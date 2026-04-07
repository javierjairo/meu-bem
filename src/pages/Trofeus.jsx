import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthProvider';
import { supabase, supabaseConfigurado } from '../lib/supabaseClient';
import SectionTitle from '../components/SectionTitle';
import AchievementCard from '../components/AchievementCard';
import AchievementModal from '../components/AchievementModal';

export default function Trofeus() {
  const { user, loading: authLoading } = useAuth();
  const [conquistas, setConquistas] = useState([]);
  const [desbloqueios, setDesbloqueios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null); // conquista sendo editada
  const [erro, setErro] = useState('');

  // Buscar todas as conquistas e desbloqueios
  const buscarDados = useCallback(async () => {
    if (!user || !supabaseConfigurado) return;
    setCarregando(true);
    try {
      const [resConquistas, resDesbloqueios] = await Promise.all([
        supabase.from('conquistas').select('*').order('ordem', { ascending: true }),
        supabase.from('conquistas_usuario').select('*'),
      ]);

      if (resConquistas.error) throw resConquistas.error;
      if (resDesbloqueios.error) throw resDesbloqueios.error;

      setConquistas(resConquistas.data || []);
      setDesbloqueios(resDesbloqueios.data || []);
    } catch (err) {
      console.error('Erro ao buscar conquistas:', err);
      setErro('Erro ao carregar conquistas');
    } finally {
      setCarregando(false);
    }
  }, [user]);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  // Criar ou editar conquista
  const salvarConquista = async (dados) => {
    setSalvando(true);
    setErro('');
    try {
      // Separar campos internos dos dados do banco
      const { _jaDesbloqueada, _dataDesbloqueio, ...dadosBanco } = dados;

      if (editando?.id_conquista) {
        // UPDATE da conquista
        const { error } = await supabase
          .from('conquistas')
          .update(dadosBanco)
          .eq('id_conquista', editando.id_conquista);
        if (error) throw error;
      } else {
        // INSERT nova conquista
        const ordem = conquistas.length + 1;
        const { data: novaConquista, error } = await supabase
          .from('conquistas')
          .insert({ ...dadosBanco, ordem })
          .select()
          .single();
        if (error) throw error;

        // Se marcou como já desbloqueada, inserir desbloqueio para o user atual
        if (_jaDesbloqueada && novaConquista) {
          const dtDesb = _dataDesbloqueio
            ? new Date(_dataDesbloqueio).toISOString()
            : new Date().toISOString();

          await supabase
            .from('conquistas_usuario')
            .upsert({
              id_conquista: novaConquista.id_conquista,
              usuario_id: user.id,
              dt_desbloqueio: dtDesb,
              notificada: true, // já sabe, não precisa toast
            }, { onConflict: 'id_conquista,usuario_id', ignoreDuplicates: true });
        }
      }

      setModalAberto(false);
      setEditando(null);
      await buscarDados();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setErro('Erro ao salvar conquista');
    } finally {
      setSalvando(false);
    }
  };

  // Desbloquear conquista para TODOS os usuários autenticados
  const desbloquear = async (conquista) => {
    setErro('');
    try {
      // Inserir para o usuário atual
      const { error } = await supabase
        .from('conquistas_usuario')
        .insert({
          id_conquista: conquista.id_conquista,
          usuario_id: user.id,
          notificada: true, // quem clica já viu
        });

      if (error && !error.message.includes('duplicate')) throw error;

      await buscarDados();
    } catch (err) {
      console.error('Erro ao desbloquear:', err);
      setErro('Erro ao desbloquear');
    }
  };

  // Verificar se conquista está desbloqueada para o user atual
  const getDesbloqueio = (idConquista) =>
    desbloqueios.find(d => d.id_conquista === idConquista && d.usuario_id === user?.id);

  // Stats
  const totalDesbloqueadas = conquistas.filter(c =>
    desbloqueios.some(d => d.id_conquista === c.id_conquista && d.usuario_id === user?.id)
  ).length;

  return (
    <div className="w-full animate-fadeIn pb-8 sm:pb-12">
      <SectionTitle title="Troféus" subtitle="Nossas conquistas desbloqueadas juntos" />

      <>
          {/* Stats bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '24px',
            marginTop: '16px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#fbbf24',
                margin: 0,
                lineHeight: 1,
                fontFamily: "'Inter', sans-serif",
              }}>
                {totalDesbloqueadas}
              </p>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                desbloqueadas
              </p>
            </div>

            <div style={{
              width: '1px',
              height: '32px',
              background: 'rgba(168,85,247,0.2)',
            }} />

            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#4b5563',
                margin: 0,
                lineHeight: 1,
                fontFamily: "'Inter', sans-serif",
              }}>
                {conquistas.length}
              </p>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                total
              </p>
            </div>
          </div>

          {/* Barra de progresso */}
          <div style={{
            maxWidth: '300px',
            margin: '0 auto 28px',
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(255,255,255,0.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${conquistas.length > 0 ? (totalDesbloqueadas / conquistas.length) * 100 : 0}%`,
              height: '100%',
              borderRadius: '3px',
              background: 'linear-gradient(to right, #7c3aed, #fbbf24)',
              transition: 'width 0.5s ease',
            }} />
          </div>

          {/* Botão nova conquista */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setEditando(null); setModalAberto(true); }}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
              }}
            >
              + Nova Conquista
            </button>
          </div>

          {/* Erro */}
          {erro && (
            <p style={{
              fontSize: '13px', color: '#f87171', textAlign: 'center',
              padding: '8px 16px', borderRadius: '8px',
              background: 'rgba(248,113,113,0.1)', marginBottom: '16px',
            }}>
              {erro}
            </p>
          )}

          {/* Loading */}
          {carregando && (
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', padding: '24px' }}>
              Carregando troféus...
            </p>
          )}

          {/* Grid de cards */}
          {!carregando && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {conquistas.map(c => {
                const desbloqueio = getDesbloqueio(c.id_conquista);
                const AUTOMATICAS = ['Primeiro Login', 'Primeira Cápsula', '100 Dias Juntos'];
                // Numerar sequencialmente as conquistas secretas
                const secretas = conquistas.filter(x => x.secreta);
                const secretaIdx = secretas.findIndex(x => x.id_conquista === c.id_conquista);
                return (
                  <AchievementCard
                    key={c.id_conquista}
                    conquista={c}
                    desbloqueada={Boolean(desbloqueio)}
                    dtDesbloqueio={desbloqueio?.dt_desbloqueio}
                    onDesbloquear={desbloquear}
                    onEditar={(cq) => {
                      const desb = getDesbloqueio(cq.id_conquista);
                      setEditando({
                        ...cq,
                        _jaDesbloqueada: Boolean(desb),
                        _dataDesbloqueio: desb?.dt_desbloqueio ? desb.dt_desbloqueio.split('T')[0] : '',
                      });
                      setModalAberto(true);
                    }}
                    automatica={AUTOMATICAS.includes(c.titulo)}
                    secretaNumero={secretaIdx >= 0 ? secretaIdx + 1 : null}
                  />
                );
              })}
            </div>
          )}

          {/* Vazia */}
          {!carregando && conquistas.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Nenhuma conquista ainda.</p>
              <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '4px' }}>
                Crie a primeira conquista do jogo de vocês!
              </p>
            </div>
          )}

          {/* Modal CRUD */}
          <AchievementModal
            aberto={modalAberto}
            conquista={editando}
            onFechar={() => { setModalAberto(false); setEditando(null); }}
            onSalvar={salvarConquista}
            carregando={salvando}
          />
        </>
    </div>
  );
}
