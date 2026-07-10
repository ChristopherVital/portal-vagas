'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const SENHA_ADMIN = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export default function Admin() {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState('');
  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [aba, setAba] = useState('vagas');
  const [editando, setEditando] = useState(null);

  // Form de vaga
  const [titulo, setTitulo] = useState('');
  const [local, setLocal] = useState('');
  const [tipo, setTipo] = useState('CLT');
  const [descricao, setDescricao] = useState('');
  const [ativa, setAtiva] = useState(true);
  const [msg, setMsg] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    if (logado) {
      carregarVagas();
      carregarCandidaturas();
    }
  }, [logado]);

  function entrar(e) {
    e.preventDefault();
    if (senha === SENHA_ADMIN) setLogado(true);
    else setMsg({ tipo: 'erro', texto: 'Senha incorreta.' });
  }

  async function carregarVagas() {
    const { data } = await supabase
      .from('vagas')
      .select('*')
      .order('created_at', { ascending: false });
    setVagas(data || []);
  }

  async function carregarCandidaturas() {
    const { data } = await supabase
      .from('candidaturas')
      .select('*')
      .order('created_at', { ascending: false });
    setCandidaturas(data || []);
  }

  function novaVaga() {
    setEditando({ id: null });
    setTitulo(''); setLocal(''); setTipo('CLT'); setDescricao(''); setAtiva(true);
    setMsg({ tipo: '', texto: '' });
  }

  function editarVaga(v) {
    setEditando(v);
    setTitulo(v.titulo); setLocal(v.local || ''); setTipo(v.tipo || 'CLT');
    setDescricao(v.descricao || ''); setAtiva(v.ativa);
    setMsg({ tipo: '', texto: '' });
    window.scrollTo(0, 0);
  }

  async function salvarVaga(e) {
    e.preventDefault();
    setMsg({ tipo: '', texto: '' });

    const dados = { titulo, local, tipo, descricao, ativa };

    let result;
    if (editando?.id) {
      result = await supabase.from('vagas').update(dados).eq('id', editando.id);
    } else {
      result = await supabase.from('vagas').insert(dados);
    }

    if (result.error) {
      setMsg({ tipo: 'erro', texto: 'Erro: ' + result.error.message });
    } else {
      setMsg({ tipo: 'ok', texto: 'Vaga salva com sucesso!' });
      setEditando(null);
      setTitulo(''); setLocal(''); setDescricao('');
      carregarVagas();
    }
  }

  async function excluirVaga(id) {
    if (!confirm('Excluir esta vaga? As candidaturas já enviadas serão mantidas.')) return;
    await supabase.from('vagas').delete().eq('id', id);
    carregarVagas();
  }

  async function toggleAtiva(v) {
    await supabase.from('vagas').update({ ativa: !v.ativa }).eq('id', v.id);
    carregarVagas();
  }

  function urlCurriculo(arquivo) {
    const { data } = supabase.storage.from('curriculos').getPublicUrl(arquivo);
    return data.publicUrl;
  }

  // =================== LOGIN ===================
  if (!logado) {
    return (
      <main className="container">
        <div className="form-card" style={{ maxWidth: 400, marginTop: 40 }}>
          <h2 style={{ marginBottom: 16 }}>🔐 Área administrativa</h2>
          {msg.texto && <div className={`mensagem ${msg.tipo}`}>{msg.texto}</div>}
          <form onSubmit={entrar}>
            <label>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            <button className="btn" type="submit">Entrar</button>
          </form>
        </div>
      </main>
    );
  }

  // =================== PAINEL ===================
  return (
    <main className="container">
      <div className="admin-bar">
        <h2>Painel administrativo</h2>
        <button className="btn btn-secondary" onClick={() => setLogado(false)}>Sair</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className={aba === 'vagas' ? 'btn' : 'btn btn-secondary'}
          onClick={() => { setAba('vagas'); setEditando(null); }}
        >
          Vagas ({vagas.length})
        </button>
        <button
          className={aba === 'candidaturas' ? 'btn' : 'btn btn-secondary'}
          onClick={() => setAba('candidaturas')}
        >
          Candidaturas ({candidaturas.length})
        </button>
      </div>

      {/* ============= VAGAS ============= */}
      {aba === 'vagas' && (
        <>
          {msg.texto && <div className={`mensagem ${msg.tipo}`}>{msg.texto}</div>}

          {editando && (
            <div className="form-card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16 }}>
                {editando.id ? 'Editar vaga' : 'Nova vaga'}
              </h3>
              <form onSubmit={salvarVaga}>
                <label>Título *</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

                <label>Local</label>
                <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Ex: São Paulo - SP" />

                <label>Tipo de contrato</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db', marginBottom: 16, fontSize: 15 }}>
                  <option>CLT</option>
                  <option>PJ</option>
                  <option>Estágio</option>
                  <option>Temporário</option>
                  <option>Freelancer</option>
                </select>

                <label>Descrição da vaga *</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />

                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={ativa} onChange={(e) => setAtiva(e.target.checked)} style={{ width: 'auto', marginBottom: 0 }} />
                  Vaga ativa (visível no site)
                </label>

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn" type="submit">Salvar</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setEditando(null)}>Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {!editando && (
            <button className="btn" onClick={novaVaga} style={{ marginBottom: 16 }}>+ Nova vaga</button>
          )}

          {vagas.length === 0 ? (
            <div className="empty">Nenhuma vaga cadastrada.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Local</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vagas.map((v) => (
                  <tr key={v.id}>
                    <td><strong>{v.titulo}</strong></td>
                    <td>{v.local || '-'}</td>
                    <td>{v.tipo || '-'}</td>
                    <td>
                      <span style={{ color: v.ativa ? '#059669' : '#9ca3af' }}>
                        {v.ativa ? '● Ativa' : '○ Inativa'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" onClick={() => editarVaga(v)} style={{ marginRight: 6, padding: '6px 10px', fontSize: 13 }}>Editar</button>
                      <button className="btn btn-secondary" onClick={() => toggleAtiva(v)} style={{ marginRight: 6, padding: '6px 10px', fontSize: 13 }}>
                        {v.ativa ? 'Desativar' : 'Ativar'}
                      </button>
                      <button className="btn btn-danger" onClick={() => excluirVaga(v.id)} style={{ padding: '6px 10px', fontSize: 13 }}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ============= CANDIDATURAS ============= */}
      {aba === 'candidaturas' && (
        <>
          {candidaturas.length === 0 ? (
            <div className="empty">Nenhuma candidatura recebida ainda.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Vaga</th>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Currículo</th>
                </tr>
              </thead>
              <tbody>
                {candidaturas.map((c) => (
                  <tr key={c.id}>
                    <td>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>{c.vaga_titulo || '-'}</td>
                    <td><strong>{c.nome}</strong></td>
                    <td>
                      <div style={{ fontSize: 13 }}>
                        📧 <a href={`mailto:${c.email}`} style={{ color: '#2563eb' }}>{c.email}</a><br />
                        📱 <a href={`https://wa.me/${c.telefone.replace(/\D/g,'')}`} target="_blank" style={{ color: '#2563eb' }}>{c.telefone}</a>
                      </div>
                    </td>
                    <td>
                      <a href={urlCurriculo(c.curriculo_arquivo)} target="_blank" className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: 13 }}>
                        Baixar PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}
