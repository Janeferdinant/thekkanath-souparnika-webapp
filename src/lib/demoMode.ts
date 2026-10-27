/**
 * Environment checks with no storage or Supabase imports, so the public
 * pages can read them without pulling the data layer into their bundle.
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 20);
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}
