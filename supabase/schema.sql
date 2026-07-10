-- ==========================================================
-- SCRIPT DEFINITIVO - PODE RODAR QUANTAS VEZES QUISER
-- IMPORTANTE: rode em 2 ETAPAS separadas no SQL Editor!
-- ==========================================================

-- =====================================================
-- ETAPA 1 - RODE PRIMEIRO (apaga tudo que pode dar erro)
-- =====================================================

drop policy if exists "Vagas ativas são públicas" on public.vagas;
drop policy if exists "Qualquer pessoa pode se candidatar" on public.candidaturas;
drop policy if exists "Upload público de currículos" on storage.objects;
drop policy if exists "Leitura pública dos currículos" on storage.objects;

drop table if exists public.candidaturas cascade;
drop table if exists public.vagas cascade;

-- (pare aqui, clique Run, espere "Success")

-- =====================================================
-- ETAPA 2 - RODE DEPOIS (cria tudo de novo)
-- IMPORTANTE: o bucket "curriculos" precisa existir no Storage
-- =====================================================

create table public.vagas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  local text,
  tipo text default 'CLT',
  descricao text not null,
  ativa boolean default true,
  created_at timestamp with time zone default now()
);

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

alter table public.vagas enable row level security;
create policy "Vagas ativas são públicas" on public.vagas
  for select using (ativa = true);

alter table public.candidaturas enable row level security;
create policy "Qualquer pessoa pode se candidatar" on public.candidaturas
  for insert with check (true);

create policy "Upload público de currículos" on storage.objects
  for insert with check (bucket_id = 'curriculos');

create policy "Leitura pública dos currículos" on storage.objects
  for select using (bucket_id = 'curriculos');
