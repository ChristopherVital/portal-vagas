-- ==========================================================
-- ADICIONAR COLUNA 'status' NA TABELA DE CANDIDATURAS
-- Rode este SQL no SQL Editor do Supabase
-- ==========================================================

-- Adiciona a coluna 'status' se ela não existir
ALTER TABLE public.candidaturas
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pendente';

-- Permite ao admin ATUALIZAR candidaturas (mudar status, etc)
DROP POLICY IF EXISTS "Permitir atualizar candidaturas" ON public.candidaturas;
CREATE POLICY "Permitir atualizar candidaturas" ON public.candidaturas
  FOR UPDATE USING (true) WITH check (true);

-- Permite ao admin DELETAR candidaturas
DROP POLICY IF EXISTS "Permitir deletar candidaturas" ON public.candidaturas;
CREATE POLICY "Permitir deletar candidaturas" ON public.candidaturas
  FOR DELETE USING (true);
