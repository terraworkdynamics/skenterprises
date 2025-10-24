# 🚀 Production Deployment Guide

## 🔐 Security Checklist

### ✅ Pre-Deployment Security

1. **Environment Variables**
   ```bash
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Database Security**
   ```sql
   -- Run the authentication queries
   -- Execute: database/auth_queries.sql
   ```

3. **Dependencies Security**
   ```bash
   npm run security:audit
   npm run security:fix
   ```

### 🛡️ Security Features Implemented

- ✅ **Authentication System**: Comprehensive auth with session management
- ✅ **Route Protection**: All admin routes protected
- ✅ **Auto Logout**: Automatic logout on window close/tab close
- ✅ **Brute Force Protection**: Login attempt limiting
- ✅ **Session Timeout**: Configurable session expiration
- ✅ **Input Sanitization**: XSS protection
- ✅ **Code Obfuscation**: Production code obfuscation
- ✅ **Security Headers**: CSP, XSS protection, etc.
- ✅ **Audit Logging**: Security event tracking

## 🚀 Deployment Steps

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 2. Database Setup

```sql
-- Execute these SQL queries in your Supabase dashboard:

-- 1. Run the main schema
-- Execute: supabase.sql

-- 2. Run the authentication schema
-- Execute: database/auth_queries.sql
```

### 3. Build for Production

```bash
# Security audit
npm run security:audit

# Build for production
npm run build

# Preview production build
npm run preview:prod
```

### 4. Deploy

```bash
# For static hosting (Netlify, Vercel, etc.)
npm run build
# Upload dist/ folder to your hosting provider

# For server deployment
npm run start
```

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Security Configuration
VITE_APP_ENV=production
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION=900000

# Admin Configuration
VITE_ADMIN_EMAIL=admin@skenterprises.com
VITE_ADMIN_PHONE=9972749555
```

### Database Configuration

1. **Create Admin User**
   ```sql
   -- Update the password hash in database/auth_queries.sql
   -- Use a strong password and generate proper hash
   ```

2. **Configure RLS Policies**
   ```sql
   -- All policies are included in database/auth_queries.sql
   -- Review and adjust as needed
   ```

## 🛡️ Security Best Practices

### 1. Password Security
- Use strong passwords (12+ characters)
- Enable 2FA if possible
- Regular password rotation

### 2. Database Security
- Enable SSL connections
- Regular backups
- Monitor access logs

### 3. Application Security
- Keep dependencies updated
- Regular security audits
- Monitor error logs

### 4. Network Security
- Use HTTPS only
- Configure proper CORS
- Set up firewall rules

## 📊 Monitoring

### Security Events
```sql
-- View recent security events
SELECT event_type, severity, description, created_at 
FROM public.security_events 
ORDER BY created_at DESC 
LIMIT 50;
```

### Active Sessions
```sql
-- View active user sessions
SELECT u.email, s.ip_address, s.last_activity, s.expires_at
FROM public.user_sessions s
JOIN public.admin_users u ON s.user_id = u.id
WHERE s.expires_at > now()
ORDER BY s.last_activity DESC;
```

### Audit Logs
```sql
-- View audit logs
SELECT action, resource, details, created_at 
FROM public.audit_logs 
ORDER BY created_at DESC 
LIMIT 100;
```

## 🔄 Maintenance

### Regular Tasks

1. **Weekly**
   - Check security events
   - Review audit logs
   - Update dependencies

2. **Monthly**
   - Security audit
   - Database cleanup
   - Performance review

3. **Quarterly**
   - Full security assessment
   - Backup verification
   - Access review

### Cleanup Commands

```sql
-- Clean up expired sessions
SELECT cleanup_expired_sessions();

-- Clean up old audit logs (older than 1 year)
DELETE FROM public.audit_logs 
WHERE created_at < now() - interval '1 year';

-- Clean up old security events (older than 6 months)
DELETE FROM public.security_events 
WHERE created_at < now() - interval '6 months';
```

## 🚨 Emergency Procedures

### Security Incident Response

1. **Immediate Actions**
   - Lock all admin accounts
   - Review security events
   - Check for unauthorized access

2. **Investigation**
   - Analyze audit logs
   - Check session data
   - Review database access

3. **Recovery**
   - Reset compromised accounts
   - Update security policies
   - Implement additional monitoring

## 📞 Support

- **Technical Issues**: Contact development team
- **Security Concerns**: Immediate escalation required
- **Database Issues**: Contact database administrator

## 🔗 Useful Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Security audit
npm run security:audit

# Deploy check
npm run deploy:check

# Start production server
npm run start
```

---

**⚠️ Important**: Always test in a staging environment before deploying to production!
