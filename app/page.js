'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from('vagas')
        .select('id, titulo, local, tipo, descricao, created_at')
        .eq('ativa', true)
        .order('created_at', { ascending: false });
      if (!error) setVagas(data || []);
      setCarregando(false);
    }
    carregar();
  }, []);

  const vagasFiltradas = vagas.filter((v) => {
    const termo = busca.toLowerCase();
    return (
      v.titulo?.toLowerCase().includes(termo) ||
      v.local?.toLowerCase().includes(termo) ||
      v.tipo?.toLowerCase().includes(termo) ||
      v.descricao?.toLowerCase().includes(termo)
    );
  });

  return (
    <main className="container">
      <h2>Vagas disponíveis</h2>

      <input
        type="text"
        className="search-box"
        placeholder="🔍 Buscar vaga por nome, local ou tipo..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {carregando ? (
        <div className="empty">Carregando vagas...</div>
      ) : vagasFiltradas.length === 0 ? (
        <div className="empty">
          {busca
            ? 'Nenhuma vaga encontrada para essa busca.'
            : 'Nenhuma vaga publicada no momento.'}
        </div>
      ) : (
        <div className="vaga-list">
          {vagasFiltradas.map((v) => (
            <a key={v.id} href={`/vaga/${v.id}`} className="vaga-card">
              <h3>{v.titulo}</h3>
              <div className="meta">
                {v.local && <>📍 {v.local} </>}
                {v.tipo && <>· 💼 {v.tipo}</>}
              </div>
              <div className="desc">
                {v.descricao?.slice(0, 180)}
                {v.descricao?.length > 180 ? '...' : ''}
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
