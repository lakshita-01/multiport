// Supabase has been replaced with a custom REST API backend (CockroachDB + Express on Render)
// Use src/lib/api.js for all data operations
// Use src/contexts/AuthContext.jsx for authentication

export const supabase = null;

if (typeof window !== 'undefined') {
  console.warn('supabase.js is deprecated. Use api.js instead.');
}
