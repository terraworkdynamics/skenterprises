-- ==============================================
-- 🔐 SECURE AUTHENTICATION DATABASE QUERIES
-- ==============================================

-- Create admin users table with enhanced security
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create session tracking table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create security events table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==============================================
-- 🔒 ROW LEVEL SECURITY POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Admin users policies (only authenticated users can access)
CREATE POLICY "admin_users_select_policy" ON public.admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_users_update_policy" ON public.admin_users
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Session policies
CREATE POLICY "user_sessions_select_policy" ON public.user_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "user_sessions_insert_policy" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "user_sessions_delete_policy" ON public.user_sessions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Audit logs policies (read-only for authenticated users)
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Security events policies
CREATE POLICY "security_events_select_policy" ON public.security_events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "security_events_insert_policy" ON public.security_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==============================================
-- 📊 INDEXES FOR PERFORMANCE
-- ==============================================

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Security events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);

-- ==============================================
-- 🔧 FUNCTIONS FOR SECURITY
-- ==============================================

-- Function to check if user is locked
CREATE OR REPLACE FUNCTION is_user_locked(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = user_email 
    AND locked_until IS NOT NULL 
    AND locked_until > now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment login attempts
CREATE OR REPLACE FUNCTION increment_login_attempts(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  attempts INTEGER;
  max_attempts INTEGER := 5;
  lock_duration INTERVAL := '15 minutes';
BEGIN
  UPDATE public.admin_users 
  SET login_attempts = login_attempts + 1,
      locked_until = CASE 
        WHEN login_attempts + 1 >= max_attempts THEN now() + lock_duration
        ELSE locked_until
      END
  WHERE email = user_email;
  
  -- Log security event
  INSERT INTO public.security_events (event_type, severity, description, metadata)
  VALUES (
    'failed_login_attempt',
    CASE 
      WHEN (SELECT login_attempts FROM public.admin_users WHERE email = user_email) >= max_attempts 
      THEN 'high'
      ELSE 'medium'
    END,
    'Failed login attempt for user: ' || user_email,
    jsonb_build_object('email', user_email, 'attempts', (SELECT login_attempts FROM public.admin_users WHERE email = user_email))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset login attempts on successful login
CREATE OR REPLACE FUNCTION reset_login_attempts(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.admin_users 
  SET login_attempts = 0,
      locked_until = NULL,
      last_login = now()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  event_type TEXT,
  severity TEXT DEFAULT 'medium',
  description TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_events (event_type, severity, description, metadata)
  VALUES (event_type, severity, description, metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- 🚀 SAMPLE ADMIN USER CREATION
-- ==============================================

-- Create default admin user (password should be changed immediately)
-- Password: Admin@123456 (change this in production!)
INSERT INTO public.admin_users (email, password_hash, full_name, role)
VALUES (
  'admin@skenterprises.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- This is a sample hash, replace with actual hash
  'System Administrator',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- ==============================================
-- 🔄 TRIGGERS FOR AUTOMATIC UPDATES
-- ==============================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 📋 USEFUL QUERIES FOR ADMINISTRATION
-- ==============================================

-- Query to check user login status
-- SELECT email, is_active, login_attempts, locked_until, last_login 
-- FROM public.admin_users 
-- WHERE email = 'admin@skenterprises.com';

-- Query to view recent security events
-- SELECT event_type, severity, description, created_at 
-- FROM public.security_events 
-- ORDER BY created_at DESC 
-- LIMIT 50;

-- Query to view active sessions
-- SELECT u.email, s.ip_address, s.last_activity, s.expires_at
-- FROM public.user_sessions s
-- JOIN public.admin_users u ON s.user_id = u.id
-- WHERE s.expires_at > now()
-- ORDER BY s.last_activity DESC;

-- Query to clean up expired sessions (run periodically)
-- SELECT cleanup_expired_sessions();
