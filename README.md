# 📋 Portal de Vagas

Site completo para postar vagas de emprego e receber currículos, com banco de dados, busca e painel administrativo.

**Stack:** Next.js 14 + Supabase (Postgres + Storage) + Vercel
**Custo:** R$ 0,00 (planos gratuitos)

---

## 🚀 Como colocar no ar (passo a passo)

### Parte 1 — Criar conta no Supabase (banco de dados + arquivos)

1. Acesse **https://supabase.com** e crie uma conta grátis (pode logar com GitHub).
2. Clique em **"New Project"**, dê um nome (ex: `portal-vagas`), defina uma senha e escolha a região mais próxima (ex: `South America (São Paulo)`).
3. Aguarde ~2 minutos o projeto ser criado.
4. No menu esquerdo, vá em **SQL Editor**, cole todo o conteúdo do arquivo `supabase/schema.sql` e clique em **Run**.
5. No menu esquerdo, vá em **Storage** → **New bucket**:
   - Nome: `curriculos`
   - Marque **Public bucket** (ON)
   - Clique em **Create bucket**
6. Volte ao SQL Editor e rode **apenas as duas últimas linhas** do `schema.sql` (as políticas de storage), pois o bucket precisa existir antes.
7. Em **Project Settings → API**, copie:
   - **Project URL** → cole em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Parte 2 — Subir o código no GitHub

1. Crie uma conta em **https://github.com** (se não tiver).
2. Crie um novo repositório (botão verde "New"), dê o nome `portal-vagas`, deixe público, **não marque** "Add README".
3. No seu computador, instale o **Git** (https://git-scm.com) e o **Node.js** (https://nodejs.org — versão LTS).
4. Abra o terminal na pasta do projeto e rode:

```bash
cd vagas-site
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/portal-vagas.git
git push -u origin main
```

5. Na hora do push, o GitHub vai pedir usuário e senha. Para a senha, use um **Personal Access Token** (em https://github.com/settings/tokens → Generate new token → marque `repo`).

### Parte 3 — Colocar no ar na Vercel

1. Acesse **https://vercel.com** e faça login com a mesma conta do GitHub.
2. Clique em **"Add New → Project"**.
3. Selecione o repositório `portal-vagas` e clique em **Import**.
4. Antes de clicar em Deploy, clique em **Environment Variables** e adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = (sua URL do Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (sua chave anon)
   - `ADMIN_PASSWORD` = a senha que você quiser para o painel
5. Clique em **Deploy** e aguarde ~1 minuto.
6. Pronto! Seu site estará no ar em algo como `https://portal-vagas.vercel.app`

### Parte 4 — Usar o site

- **Site público:** a URL acima (compartilhe com candidatos)
- **Painel admin:** mesma URL + `/admin` (ex: `https://portal-vagas.vercel.app/admin`)
- **Senha do admin:** a que você definiu em `ADMIN_PASSWORD`

---

## 📝 Funcionalidades

✅ Lista de vagas com **busca por nome** (ou local, tipo, descrição)
✅ Candidato clica na vaga → preenche nome, telefone, e-mail e anexa currículo em PDF
✅ Painel administrativo protegido por senha
✅ Criar, editar, ativar/desativar e excluir vagas
✅ Ver todas as candidaturas com link para baixar o PDF e botões de e-mail/WhatsApp

---

## 💡 Dicas importantes

- **Nunca** compartilhe sua `service_role` key do Supabase — use sempre a `anon` key.
- Troque a senha do admin (`ADMIN_PASSWORD`) por uma senha forte.
- O plano grátis do Supabase tem **500MB de espaço** — suficiente para milhares de currículos em PDF.
- Se quiser um domínio próprio (ex: `vagas.suaempresa.com.br`), basta comprá-lo e adicionar na Vercel (Settings → Domains).

---

## 🆘 Problemas comuns

**"Invalid API key"** → Conferiu se copiou a URL e a anon key corretamente em `.env.local` ou na Vercel.

**"new row violates row-level security policy"** ao candidatar-se → Rode as últimas linhas do schema.sql (políticas de storage).

**"Bucket not found"** → Crie o bucket `curriculos` no Storage do Supabase e marque como público.
