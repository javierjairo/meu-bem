import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { supabase, supabaseConfigurado } from '../lib/supabaseClient';

export default function AchievementToast() {
  const { user } = useAuth();
  const [conquista, setConquista] = useState(null);
  const [fase, setFase] = useState('idle'); // idle | entrando | visivel | saindo

  const verificarNovas = useCallback(async () => {
    if (!user || !supabaseConfigurado) return;

    try {
      const { data, error } = await supabase
        .from('conquistas_usuario')
        .select('id, id_conquista, conquistas(titulo, icone, cor, descricao)')
        .eq('usuario_id', user.id)
        .eq('notificada', false)
        .limit(1)
        .single();

      if (error || !data) return;

      setConquista({
        titulo: data.conquistas.titulo,
        icone: data.conquistas.icone,
        cor: data.conquistas.cor,
        descricao: data.conquistas.descricao,
        desbloqueioId: data.id,
      });

      // Sequência: entrada → visível → saída → limpa
      setFase('entrando');
      setTimeout(() => setFase('visivel'), 50);

      // Marcar como notificada
      await supabase
        .from('conquistas_usuario')
        .update({ notificada: true })
        .eq('id', data.id);

      // Após 5.5s, começa a sair
      setTimeout(() => {
        setFase('saindo');
        setTimeout(() => {
          setFase('idle');
          setConquista(null);
          // Verificar se tem mais na fila
          setTimeout(verificarNovas, 1000);
        }, 600);
      }, 5500);
    } catch {
      // silencioso
    }
  }, [user]);

  useEffect(() => {
    // Esperar o Engine rodar primeiro (4s)
    const timer = setTimeout(verificarNovas, 5000);
    return () => clearTimeout(timer);
  }, [verificarNovas]);

  if (fase === 'idle' || !conquista) return null;

  const isVisible = fase === 'visivel';
  const isExiting = fase === 'saindo';

  return (
    <>
      <style>{`
        @keyframes achieveShimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes achieveGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.15); }
          50% { box-shadow: 0 0 40px rgba(251,191,36,0.35); }
        }
        @keyframes emojiPop {
          0% { transform: scale(0.3) rotate(-20deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          zIndex: 99999,
          width: 'calc(100% - 32px)',
          maxWidth: '420px',
          transform: `translateX(-50%) translateY(${isVisible ? '0' : isExiting ? '150%' : '150%'})`,
          opacity: isVisible ? 1 : isExiting ? 0 : 0,
          transition: isExiting
            ? 'transform 0.6s ease-in, opacity 0.6s ease-in'
            : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
          pointerEvents: 'none',
        }}
      >
        {/* Card principal — estilo console */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 20px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            animation: isVisible ? 'achieveGlow 2s ease-in-out infinite' : 'none',
          }}
        >
          {/* Shimmer brilhante passando por cima */}
          {isVisible && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '60%',
                background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.08), rgba(255,255,255,0.12), rgba(251,191,36,0.08), transparent)',
                animation: 'achieveShimmer 2.5s ease-in-out 0.5s',
                animationFillMode: 'forwards',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Barra lateral dourada — estilo PS */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: 'linear-gradient(to bottom, #fbbf24, #f59e0b, #fbbf24)',
              boxShadow: '0 0 12px rgba(251,191,36,0.5)',
            }}
          />

          {/* Ícone do troféu */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '8px',
              background: `radial-gradient(circle, ${conquista.cor}20, transparent)`,
              border: `1px solid ${conquista.cor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0,
              animation: isVisible ? 'emojiPop 0.6s ease 0.3s both' : 'none',
            }}
          >
            {conquista.icone}
          </div>

          {/* Texto */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Label dourado */}
            <p
              style={{
                fontSize: '9px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: '#fbbf24',
                margin: '0 0 3px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              🏆 Conquista Desbloqueada
            </p>

            {/* Título */}
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#f3f4f6',
                margin: '0 0 2px',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {conquista.titulo}
            </p>

            {/* Descrição */}
            <p
              style={{
                fontSize: '11px',
                color: '#9ca3af',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {conquista.descricao}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
