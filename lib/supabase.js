import { createClient } from '@supabase/supabase-js';

let _supabase = null;

// Cliente "lazy": só cria o cliente Supabase quando for realmente usado,
// evitando erro de "supabaseUrl is required" durante o build.
export function getSupabase() {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variáveis de ambiente do Supabase não configuradas. ' +
      'Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.'
    );
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

// Mantém compatibilidade com `import { supabase } from '...'` se alguém usar.
// Mas o ideal é usar getSupabase() diretamente nas páginas.
export const supabase = new Proxy({}, {
  get(_, prop) {
    return getSupabase()[prop];
  }
});
