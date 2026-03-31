import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { supabase, supabaseConfigurado } from '../lib/supabaseClient';
import CapsuleLogin from './CapsuleLogin';
import CapsuleCard from './CapsuleCard';
import CapsuleForm from './CapsuleForm';
import CapsuleReveal from './CapsuleReveal';

export default function TimeCapsuleSection() {
  const { user, loading: authLoading, logout } = useAuth();
  const [capsulas, setCapsulas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [criando, setCriando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [capsulaAberta, setCapsulaAberta] = useState(null);
  const [erro, setErro] = useState('');

  // Buscar cápsulas do Supabase (via View segura)
  const buscarCapsulas = useCallback(async () => {
    if (!user || !supabaseConfigurado) return;
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('capsulas_segura')
        .select('*')
        .order('dt_abertura', { ascending: true });

      if (error) throw error;
      setCapsulas(data || []);
    } catch (err) {
      console.error('Erro ao buscar cápsulas:', err);
      setErro('Não foi possível carregar as cápsulas');
    } finally {
      setCarregando(false);
    }
  }, [user]);

  useEffect(() => {
    buscarCapsulas();
  }, [buscarCapsulas]);

  // Criar nova cápsula
  const criarCapsula = async ({ titulo, texto, dt_abertura }) => {
    setSalvando(true);
    setErro('');
    try {
      const { error } = await supabase
        .from('capsulas')
        .insert({
          titulo,
          texto,
          dt_abertura,
          criador: user.id,
        });

      if (error) throw error;

      setCriando(false);
      await buscarCapsulas();
    } catch (err) {
      console.error('Erro ao criar cápsula:', err);
      setErro('Erro ao selar a cápsula. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  // Abrir cápsula (marcar como aberta + buscar conteúdo)
  const abrirCapsula = async (capsula) => {
    if (!capsula.liberada) return;

    try {
      // Se ainda não foi aberta, marcar como aberta
      if (!capsula.aberta) {
        await supabase
          .from('capsulas')
          .update({
            aberta: true,
            dt_abertura_real: new Date().toISOString(),
          })
          .eq('id', capsula.id);
      }

      // Buscar o conteúdo completo da View segura
      const { data, error } = await supabase
        .from('capsulas_segura')
        .select('*')
        .eq('id', capsula.id)
        .single();

      if (error) throw error;

      setCapsulaAberta(data);
      // Atualizar a lista
      await buscarCapsulas();
    } catch (err) {
      console.error('Erro ao abrir cápsula:', err);
      setErro('Erro ao abrir a cápsula. Tente novamente.');
    }
  };

  // Separar cápsulas por estado
  const capsulasTrancadas = capsulas.filter(c => !c.liberada);
  const capsulasProntas = capsulas.filter(c => c.liberada && !c.aberta);
  const capsulasAbertas = capsulas.filter(c => c.aberta);

  // Se auth ainda carregando
  if (authLoading) return null;

  return (
    <div style={{ marginTop: '48px' }}>
      {/* Separador visual */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.3))' }} />
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 700,
            background: 'linear-gradient(to right, #e9d5ff, #fff, #e9d5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
            margin: 0,
          }}
        >
          🕰️ Cápsula do Tempo
        </h3>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(168,85,247,0.3))' }} />
      </div>

      <p style={{
        textAlign: 'center',
        fontSize: '13px',
        color: 'rgba(168,132,252,0.6)',
        fontStyle: 'italic',
        marginBottom: '24px',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: 1.5,
      }}>
        Deixe mensagens, previsões e cartas para o futuro.
        Elas ficarão trancadas até o dia certo ✉️
      </p>

      {/* Se não logado: mostrar login */}
      {!user ? (
        <div
          style={{
            padding: '28px 20px',
            borderRadius: '20px',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <CapsuleLogin />
        </div>
      ) : (
        <>
          {/* Header logado */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
              logado como <span style={{ color: '#a78bfa' }}>{user.email}</span>
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={logout}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: '#6b7280',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Sair
              </button>
              <button
                onClick={() => setCriando(v => !v)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: criando ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  boxShadow: criando ? 'none' : '0 2px 8px rgba(124,58,237,0.25)',
                }}
              >
                {criando ? '✕ Fechar' : '+ Nova Cápsula'}
              </button>
            </div>
          </div>

          {/* Formulário de criação */}
          {criando && (
            <div
              style={{
                padding: '24px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                background: 'rgba(255, 255, 255, 0.03)',
                marginBottom: '24px',
              }}
            >
              <CapsuleForm
                onSubmit={criarCapsula}
                onCancelar={() => setCriando(false)}
                carregando={salvando}
              />
            </div>
          )}

          {/* Erro global */}
          {erro && (
            <p style={{
              fontSize: '13px',
              color: '#f87171',
              textAlign: 'center',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(248, 113, 113, 0.1)',
              marginBottom: '16px',
            }}>
              {erro}
            </p>
          )}

          {/* Loading */}
          {carregando && (
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', padding: '24px' }}>
              Carregando cápsulas...
            </p>
          )}

          {/* Lista vazia */}
          {!carregando && capsulas.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
                <rect x="4" y="14" width="40" height="26" rx="3" stroke="#7c3aed" strokeWidth="1.5" />
                <path d="M4 17l20 13 20-13" stroke="#7c3aed" strokeWidth="1.5" />
              </svg>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Nenhuma cápsula ainda.
              </p>
              <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '4px' }}>
                Crie a primeira cápsula do tempo de vocês!
              </p>
            </div>
          )}

          {/* Cápsulas prontas para abrir */}
          {capsulasProntas.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#a855f7',
                marginBottom: '10px',
                fontWeight: 600,
              }}>
                ✨ Prontas para abrir
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {capsulasProntas.map(c => (
                  <CapsuleCard key={c.id} capsula={c} onAbrir={abrirCapsula} />
                ))}
              </div>
            </div>
          )}

          {/* Cápsulas trancadas */}
          {capsulasTrancadas.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'rgba(168,132,252,0.4)',
                marginBottom: '10px',
                fontWeight: 600,
              }}>
                🔒 Aguardando
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {capsulasTrancadas.map(c => (
                  <CapsuleCard key={c.id} capsula={c} onAbrir={abrirCapsula} />
                ))}
              </div>
            </div>
          )}

          {/* Cápsulas já abertas */}
          {capsulasAbertas.length > 0 && (
            <div>
              <p style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'rgba(168,132,252,0.3)',
                marginBottom: '10px',
                fontWeight: 600,
              }}>
                📖 Já abertas
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {capsulasAbertas.map(c => (
                  <CapsuleCard key={c.id} capsula={c} onAbrir={abrirCapsula} />
                ))}
              </div>
            </div>
          )}

          {/* Modal de revelação */}
          <CapsuleReveal
            capsula={capsulaAberta}
            onFechar={() => setCapsulaAberta(null)}
          />
        </>
      )}
    </div>
  );
}
