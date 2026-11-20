import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

// Supabase credentials come from Vite env vars (see .env.example).
// The anon key is a PUBLIC client key — it ships in the browser bundle by design.
// Never put the service_role key in this app.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean =>
  supabaseUrl.length > 0 &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey.length > 0 &&
  !supabaseAnonKey.includes('your-anon-key');

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return clientInstance;
};

export type { User };
