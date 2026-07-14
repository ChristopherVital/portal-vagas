-- ==========================================================
-- LIBERAR UPDATE/DELETE DA TABELA DE VAGAS
-- Rode este SQL no SQL Editor do Supabase
-- ==========================================================

-- Permite ao admin ATUALIZAR vagas (ativar/desativar, editar)
DROP POLICY IF EXISTS "Permitir atualizar vagas" ON public.vagas;
CREATE POLICY "Permitir atualizar vagas" ON public.vagas
  FOR UPDATE USING (true) WITH check (true);

-- Permite ao admin DELETAR vagas
DROP POLICY IF EXISTS "Permitir deletar vagas" ON public.vagas;
CREATE POLICY "Permitir deletar vagas" ON public.vagas
  FOR DELETE USING (true);
