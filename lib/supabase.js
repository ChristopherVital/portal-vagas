import { createClient } from '@supabase/supabase-js';

// =====================================================
// CONFIGURAÇÃO DIRETA (sem variável de ambiente)
// Troque esses valores se precisar mudar o Supabase depois
// =====================================================

const SUPABASE_URL = 'https://jsbjlkkznocznojdglzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzYmpsa2t6bm9jem5vamRnbHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDM3NzYsImV4cCI6MjA5OTE3OTc3Nn0.oisSwF6G7OjZw-K9S513FIdxV-Pj-TZe61UOlGiBzP8';

let _supabase = null;

export function getSupabase() {
  if (_supabase) return _supabase;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'COLE_A_CHAVE_ANON_AQUI') {
    throw new Error('Supabase não configurado. Falta a chave anon em lib/supabase.js');
  }

  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _supabase;
}

export const supabase = new Proxy({}, {
  get(_target, prop) {
    return getSupabase()[prop];
  }
});
