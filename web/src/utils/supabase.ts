import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  // Fail fast but without throwing in module scope to avoid blank screen
  // Consumers can check for undefined and handle gracefully
  console.error('Missing Supabase env configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : (undefined as unknown as ReturnType<typeof createClient>);


