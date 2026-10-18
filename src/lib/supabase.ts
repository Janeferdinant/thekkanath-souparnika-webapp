import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url?: string;
  hasAnonKey: boolean;
  message: string;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 20
  );

  return {
    isConfigured,
    url: isConfigured ? supabaseUrl : undefined,
    hasAnonKey: Boolean(supabaseAnonKey),
    message: isConfigured
      ? 'Supabase client configured; application records are still stored in this browser.'
      : 'Supabase credentials not configured in .env. Running in interactive Local Demo Mode with persistent browser storage.',
  };
}

/**
 * Singleton Supabase Client instance.
 * Returns null if Supabase environment variables are missing.
 */
export const supabase: SupabaseClient | null = (() => {
  const status = getSupabaseConfigStatus();
  if (!status.isConfigured) {
    return null;
  }
  return createClient(supabaseUrl!, supabaseAnonKey!);
})();
