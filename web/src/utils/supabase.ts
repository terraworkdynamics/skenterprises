import { createClient } from '@supabase/supabase-js';

// For development, use placeholder values if env vars are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we have valid Supabase configuration
const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-supabase-anon-key-here';

if (!hasValidConfig) {
  console.warn('⚠️ Missing or invalid Supabase configuration.');
  console.warn('📝 Please run: node setup-env.js');
  console.warn('📝 Then edit .env file with your actual Supabase credentials.');
  console.warn('🔗 Get your credentials from: https://supabase.com');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidConfig;
