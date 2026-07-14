-- ==========================================================
-- SQL DE DEBUG - Verifica o estado atual das políticas
-- Rode este SQL para diagnosticar
-- ==========================================================

-- 1. Lista TODAS as políticas da tabela vagas
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'vagas'
ORDER BY cmd, policyname;

-- 2. Mostra se RLS está ativo
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'vagas';
