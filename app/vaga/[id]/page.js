'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

// Força a página a ser dinâmica
export const dynamic = 'force-dynamic';

export default function VagaPage() {
  const { id } = useParams();
  const [vaga, setVaga] = useState(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [arquivo, setArquivo] = useState(null);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from('vagas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setErro('Vaga não encontrada.');
      else setVaga(data);
    }
    carregar();
  }, [id]);

  const tiposAceitos = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
  const extensoesAceitas = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
  const mimeTypesAceitos = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];

  async function enviar(e) {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !telefone.trim() || !email.trim()) {
      setErro('Preencha nome, telefone e e-mail.');
      return;
    }
    if (!arquivo) {
      setErro('Anexe seu currículo.');
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro('O arquivo deve ter no máximo 5MB.');
      return;
    }
    // Valida pela extensão E pelo tipo do arquivo
    const extensao = arquivo.name.split('.').pop().toLowerCase();
    if (!extensoesAceitas.includes(extensao) || !mimeTypesAceitos.includes(arquivo.type)) {
      setErro('Formato inválido. Envie um arquivo PDF, DOC, DOCX, JPG ou PNG.');
      return;
    }

    setEnviando(true);

    try {
      // 1) Upload do arquivo para o Storage
      const extensao = arquivo.name.split('.').pop().toLowerCase();
      const nomeArquivo = `${Date.now()}_${nome.replace(/\s+/g, '_')}.${extensao}`;
      const { error: uploadErr } = await supabase.storage
        .from('curriculos')
        .upload(nomeArquivo, arquivo);

      if (uploadErr) throw new Error('Falha no envio do arquivo: ' + uploadErr.message);

      // 2) Salvar candidatura no banco
      const { error: insertErr } = await supabase.from('candidaturas').insert({
        vaga_id: id,
        vaga_titulo: vaga.titulo,
        nome,
        telefone,
        email,
        curriculo_arquivo: nomeArquivo,
      });

      if (insertErr) throw new Error('Falha ao salvar candidatura: ' + insertErr.message);

      setSucesso(true);
      setNome(''); setTelefone(''); setEmail(''); setArquivo(null);
      e.target.reset();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (erro && !vaga) return (
    <main className="container">
      <a className="voltar" href="/">← Voltar para vagas</a>
      <div className="mensagem erro">{erro}</div>
    </main>
  );

  if (!vaga) return <main className="container">Carregando...</main>;

  return (
    <main className="container">
      <a className="voltar" href="/">← Voltar para vagas</a>

      <h2>{vaga.titulo}</h2>
      <div className="meta" style={{ color: '#6b7280', marginBottom: 20 }}>
        {vaga.local && <>📍 {vaga.local} </>}
        {vaga.tipo && <>· 💼 {vaga.tipo}</>}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 24, marginBottom: 24, whiteSpace: 'pre-wrap' }}>
        {vaga.descricao}
      </div>

      <div className="form-card">
        <h3 style={{ marginBottom: 16 }}>Candidate-se a esta vaga</h3>

        {sucesso && (
          <div className="mensagem ok">
            ✅ Candidatura enviada com sucesso! Entraremos em contato pelo seu e-mail.
          </div>
        )}
        {erro && <div className="mensagem erro">{erro}</div>}

        <form onSubmit={enviar}>
          <label>Nome completo *</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label>Telefone (WhatsApp) *</label>
          <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 98765-4321" required />

          <label>E-mail *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@exemplo.com" required />

          <label>Currículo (PDF, DOC ou imagem JPG/PNG, máximo 5MB) *</label>
          <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => setArquivo(e.target.files[0])} required />

          <button className="btn" type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar candidatura'}
          </button>
        </form>
      </div>
    </main>
  );
}
