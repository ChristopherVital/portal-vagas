-- ==========================================================
-- SQL DEFINITIVO PARA A TABELA VAGAS
-- Este SQL recria TODAS as políticas corretamente
-- ==========================================================

-- 1. Primeiro, desabilita RLS temporariamente
ALTER TABLE public.vagas DISABLE ROW LEVEL SECURITY;

-- 2. Apaga TODAS as políticas antigas
DROP POLICY IF EXISTS "Vagas ativas são públicas" ON public.vagas;
DROP POLICY IF EXISTS "Permitir inserir vagas" ON public.vagas;
DROP POLICY IF EXISTS "Permitir atualizar vagas" ON public.vagas;
DROP POLICY IF EXISTS "Permitir deletar vagas" ON public.vagas;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vagas;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.vagas;
DROP POLICY IF EXISTS "Enable update for all users" ON public.vagas;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.vagas;

-- 3. Reabilita RLS
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;

-- 4. Cria as políticas novamente (FORTE: sem restrição de usuário)
CREATE POLICY "Vagas ativas são públicas" ON public.vagas
  FOR SELECT USING (ativa = true);

CREATE POLICY "Permitir inserir vagas" ON public.vagas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualizar vagas" ON public.vagas
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir deletar vagas" ON public.vagas
  FOR DELETE USING (true);
