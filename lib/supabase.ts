import { createClient } from '@supabase/supabase-js';

// Prioritize process.env for security, fallback to defaults only for local development
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tgudyhbnvvrszrdykdvm.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6Btehf9VprAJZ1ZKDJPzwg_uh014xpx';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials missing! Check environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);