import { createClient } from '@supabase/supabase-js';

let _supabase = null;

// Função para criar o cliente Supabase de forma "lazy" (preguiçosa).
// Só tenta criar quando for realmente usada, evitando erro de
// "supabaseUrl is required" / "supabaseKey is required" durante o build.
function criarCliente() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se as variáveis não estiverem configuradas, retorna null.
  // Quem usar deve checar se o cliente existe antes de usar.
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Cliente proxy: só inicializa o Supabase quando alguma propriedade for acessada.
export const supabase = new Proxy({}, {
  get(_target, prop) {
    if (!_supabase) {
      _supabase = criarCliente();
      if (!_supabase) {
        throw new Error(
          'Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente da Vercel.'
        );
      }
    }
    return _supabase[prop];
  }
});
