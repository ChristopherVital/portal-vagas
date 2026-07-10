-- ==========================================================
-- SCRIPT "À PROVA DE ERROS" - PODE RODAR QUANTAS VEZES QUISER
-- Use este se você ainda não tem dados importantes
-- ==========================================================

-- Remove políticas e tabelas antigas (ignora se não existirem)
drop policy if exists "Vagas ativas são públicas" on public.vagas;
drop policy if exists "Qualquer pessoa pode se candidatar" on public.candidaturas;
drop policy if exists "Upload público de currículos" on storage.objects;
drop policy if exists "Leitura pública dos currículos" on storage.objects;

drop table if exists public.candidaturas cascade;
drop table if exists public.vagas cascade;

-- Cria a tabela de vagas
create table public.vagas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  local text,
  tipo text default 'CLT',
  descricao text not null,
  ativa boolean default true,
  created_at timestamp with time zone default now()
);

-- Cria a tabela de candidaturas
create table public.candidaturas (
  id uuid default gen_random_uuid() primary key,
  vaga_id uuid references public.vagas(id) on delete set null,
  vaga_titulo text,
  nome text not null,
  telefone text not null,
  email text not null,
  curriculo_arquivo text not null,
  created_at timestamp with time zone default now()
);

-- Segurança: leitura pública apenas de vagas ativas
alter table public.vagas enable row level security;
create policy "Vagas ativas são públicas" on public.vagas
  for select using (ativa = true);

-- Segurança: qualquer pessoa pode se candidatar
alter table public.candidaturas enable row level security;
create policy "Qualquer pessoa pode se candidatar" on public.candidaturas
  for insert with check (true);

-- ==========================================================
-- ATENÇÃO: As 2 últimas linhas (políticas de storage) só
-- funcionam DEPOIS de você criar o bucket "curriculos" no
-- menu Storage. Se o bucket já existir, pode rodar tudo de
-- uma vez. Caso contrário, rode em duas etapas.
-- ==========================================================
create policy "Upload público de currículos" on storage.objects
  for insert with check (bucket_id = 'curriculos');

create policy "Leitura pública dos currículos" on storage.objects
  for select using (bucket_id = 'curriculos');
