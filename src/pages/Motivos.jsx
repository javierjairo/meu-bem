import { useState, useCallback } from 'react';
import { useAuth } from '../components/AuthProvider';
import { supabase, supabaseConfigurado } from '../lib/supabaseClient';
import SectionTitle from '../components/SectionTitle';

export default function Motivos() {
  const { user, loading: authLoading } = useAuth();
  const [fase, setFase] = useState('idle'); // idle | sorteando | quiz | revelado
  const [motivo, setMotivo] = useState(null);
  const [ultimoId, setUltimoId] = useState(null);
  const [palpite, setPalpite] = useState(null); // null | 'acertou' | 'errou'
  const [erro, setErro] = useState('');

  // Admin
  const [adminAberto, setAdminAberto] = useState(false);
  const [novaFrase, setNovaFrase] = useState('');
  const [novoAutor, setNovoAutor] = useState('');
  const [novoTipo, setNovoTipo] = useState('casal');
  const [salvando, setSalvando] = useState(false);

  const sortear = useCallback(async () => {
    if (!user || !supabaseConfigurado) return;
    setFase('sorteando');
    setPalpite(null);
    setErro('');

    try {
      // Usar a função RPC de sorteio aleatório
      const { data, error } = await supabase
        .rpc('motivo_aleatorio', { ultimo_id: ultimoId });

      if (error) throw error;
      if (!data || data.length === 0) {
        setErro('Nenhum motivo cadastrado ainda');
        setFase('idle');
        return;
      }

      const m = data[0];

      // Delay pra animação do pote
      await new Promise(r => setTimeout(r, 2000));

      setMotivo(m);
      setUltimoId(m.id);

      // Se é do casal → quiz, senão → revelado direto
      if (m.tipo === 'casal' && m.autor) {
        setFase('quiz');
      } else {
        setFase('revelado');
      }
    } catch (err) {
      console.error('Erro no sorteio:', err);
      setErro('Erro ao sortear motivo');
      setFase('idle');
    }
  }, [user, ultimoId]);

  const responderQuiz = (resposta) => {
    if (!motivo) return;
    if (resposta === motivo.autor) {
      setPalpite('acertou');
    } else {
      setPalpite('errou');
    }
    setFase('revelado');
  };

  const salvarMotivo = async () => {
    if (!novaFrase.trim()) return;
    setSalvando(true);
    try {
      const { error } = await supabase.from('motivos').insert({
        frase: novaFrase.trim(),
        autor: novoAutor.trim() || null,
        tipo: novoTipo,
      });
      if (error) throw error;
      setNovaFrase('');
      setNovoAutor('');
      setNovoTipo('casal');
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="w-full animate-fadeIn pb-8 sm:pb-12">
      <SectionTitle title="Pote de Motivos" subtitle="Cada frase é um pedacinho de nós" />

      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>

          {/* ====== O POTE ====== */}
          {(fase === 'idle' || fase === 'sorteando') && (
            <div style={{ padding: '40px 0' }}>
              <button
                onClick={fase === 'idle' ? sortear : undefined}
                disabled={fase === 'sorteando'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: fase === 'idle' ? 'pointer' : 'default',
                  outline: 'none',
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {/* Glow atrás do pote */}
                <div style={{
                  position: 'absolute',
                  inset: '-20px',
                  borderRadius: '50%',
                  background: fase === 'sorteando'
                    ? 'radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)'
                    : 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)',
                  animation: fase === 'sorteando' ? 'poteGlow 1s ease-in-out infinite' : 'none',
                  transition: 'all 0.4s ease',
                }} />

                {/* Pote SVG */}
                <div style={{
                  fontSize: '100px',
                  lineHeight: 1,
                  animation: fase === 'sorteando' ? 'poteShake 0.15s ease-in-out infinite' : 'none',
                  transition: 'transform 0.3s ease',
                  filter: fase === 'sorteando' ? 'brightness(1.3)' : 'brightness(1)',
                  position: 'relative',
                }}>
                  🏺
                </div>

                {/* Partículas de brilho ao sortear */}
                {fase === 'sorteando' && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: ['#fbbf24', '#a855f7', '#ec4899', '#f9a8d4', '#c084fc', '#fde68a'][i],
                        top: '20%',
                        left: '50%',
                        animation: `poteSparkle 1.5s ease ${i * 0.2}s infinite`,
                        opacity: 0,
                      }} />
                    ))}
                  </>
                )}
              </button>

              <p style={{
                marginTop: '20px',
                fontSize: '13px',
                color: fase === 'sorteando' ? '#c084fc' : '#6b7280',
                fontStyle: 'italic',
                transition: 'color 0.3s ease',
              }}>
                {fase === 'sorteando' ? '✨ Sorteando...' : 'Toque no pote para sortear um motivo'}
              </p>
            </div>
          )}

          {/* ====== QUIZ: Quem disse? ====== */}
          {fase === 'quiz' && motivo && (
            <div style={{
              padding: '32px 20px',
              borderRadius: '20px',
              border: '1px solid rgba(168,85,247,0.2)',
              background: 'linear-gradient(135deg, rgba(15,15,26,0.95), rgba(26,16,37,0.95))',
              animation: 'cardFadeIn 0.6s ease',
            }}>
              {/* Frase */}
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: 500,
                color: '#e9d5ff',
                lineHeight: 1.6,
                marginBottom: '28px',
                fontStyle: 'italic',
              }}>
                "{motivo.frase}"
              </p>

              {/* Pergunta */}
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 600,
                marginBottom: '16px',
              }}>
                Quem disse? 🤔
              </p>

              {/* Opções */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Javier', 'Vitória', 'Os dois'].map(opcao => (
                  <button
                    key={opcao}
                    onClick={() => responderQuiz(opcao)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(168,85,247,0.3)',
                      background: 'rgba(168,85,247,0.08)',
                      color: '#d8b4fe',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = 'rgba(168,85,247,0.2)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'rgba(168,85,247,0.08)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {opcao === 'Javier' ? '💙' : opcao === 'Vitória' ? '💜' : '💕'} {opcao}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ====== RESULTADO REVELADO ====== */}
          {fase === 'revelado' && motivo && (
            <div style={{
              padding: '32px 20px',
              borderRadius: '20px',
              border: `1px solid ${palpite === 'acertou' ? 'rgba(34,197,94,0.3)' : palpite === 'errou' ? 'rgba(251,146,60,0.3)' : 'rgba(168,85,247,0.2)'}`,
              background: 'linear-gradient(135deg, rgba(15,15,26,0.95), rgba(26,16,37,0.95))',
              animation: 'cardFadeIn 0.6s ease',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Badge de acerto/erro */}
              {palpite && (
                <div style={{
                  marginBottom: '16px',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: palpite === 'acertou' ? 'rgba(34,197,94,0.12)' : 'rgba(251,146,60,0.12)',
                  color: palpite === 'acertou' ? '#4ade80' : '#fb923c',
                  border: `1px solid ${palpite === 'acertou' ? 'rgba(34,197,94,0.25)' : 'rgba(251,146,60,0.25)'}`,
                }}>
                  {palpite === 'acertou' ? '🎉 Acertou!' : '😄 Quase!'}
                </div>
              )}

              {/* Frase */}
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontWeight: 500,
                color: '#e9d5ff',
                lineHeight: 1.6,
                marginBottom: '12px',
                fontStyle: 'italic',
              }}>
                "{motivo.frase}"
              </p>

              {/* Autor */}
              {motivo.autor && (
                <p style={{
                  fontSize: '13px',
                  color: motivo.tipo === 'citacao' ? '#9ca3af' : '#c084fc',
                  fontWeight: 600,
                  fontStyle: 'italic',
                }}>
                  — {motivo.autor}
                </p>
              )}

              {/* Botão sortear outro */}
              <button
                onClick={() => { setFase('idle'); setTimeout(sortear, 300); }}
                style={{
                  marginTop: '24px',
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
                }}
              >
                🔮 Sortear outro motivo
              </button>

              {/* Botão voltar pro pote */}
              <button
                onClick={() => { setFase('idle'); setMotivo(null); setPalpite(null); }}
                style={{
                  display: 'block',
                  margin: '12px auto 0',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'transparent',
                  color: '#6b7280',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Voltar ao pote
              </button>
            </div>
          )}

          {/* Erro */}
          {erro && (
            <p style={{
              fontSize: '13px', color: '#f87171', textAlign: 'center',
              padding: '8px 16px', borderRadius: '8px',
              background: 'rgba(248,113,113,0.1)', marginTop: '16px',
            }}>
              {erro}
            </p>
          )}

          {/* ====== ADMIN: Adicionar frase ====== */}
          <div style={{ marginTop: '40px' }}>
            <button
              onClick={() => setAdminAberto(v => !v)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'transparent',
                color: '#4b5563',
                fontSize: '10px',
                cursor: 'pointer',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {adminAberto ? '✕ Fechar' : '+ Adicionar motivo'}
            </button>

            {adminAberto && (
              <div style={{
                marginTop: '16px',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(168,85,247,0.15)',
                background: 'rgba(255,255,255,0.02)',
                textAlign: 'left',
              }}>
                <textarea
                  placeholder="Digite a frase..."
                  value={novaFrase}
                  onChange={e => setNovaFrase(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(168,85,247,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#e5e7eb',
                    fontSize: '13px',
                    fontFamily: "'Inter', sans-serif",
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input
                    type="text"
                    placeholder="Autor (opcional)"
                    value={novoAutor}
                    onChange={e => setNovoAutor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(168,85,247,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#e5e7eb',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />

                  <select
                    value={novoTipo}
                    onChange={e => setNovoTipo(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(168,85,247,0.2)',
                      background: 'rgba(20,20,30,0.95)',
                      color: '#e5e7eb',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  >
                    <option value="casal">Casal</option>
                    <option value="citacao">Citação</option>
                  </select>
                </div>

                <button
                  onClick={salvarMotivo}
                  disabled={salvando || !novaFrase.trim()}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: salvando ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: salvando ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(124,58,237,0.2)',
                  }}
                >
                  {salvando ? 'Salvando...' : '💜 Salvar motivo'}
                </button>
              </div>
            )}
          </div>
        </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes poteShake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-4deg); }
          75% { transform: rotate(4deg); }
        }
        @keyframes poteGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes poteSparkle {
          0% { transform: translate(-50%, 0) scale(0); opacity: 0; }
          30% { opacity: 1; transform: translate(calc(-50% + ${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 30}px), -${40 + Math.random() * 40}px) scale(1); }
          100% { opacity: 0; transform: translate(calc(-50% + ${Math.random() > 0.5 ? '' : '-'}${30 + Math.random() * 50}px), -${80 + Math.random() * 60}px) scale(0.3); }
        }
        @keyframes cardFadeIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
