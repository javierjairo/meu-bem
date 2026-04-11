import { useEffect, useRef, useState } from 'react';

const DATA_INICIO = new Date('2026-02-14T00:00:00');

function calcularStats() {
  const agora = new Date();
  const diffMs = agora - DATA_INICIO;
  const diffMin = diffMs / 60000;
  const diffDias = diffMs / 86400000;
  const diffHoras = diffMs / 3600000;

  return [
    {
      emoji: '💓',
      cor: '#ec4899',
      brilho: 'rgba(236,72,153,0.25)',
      titulo: 'Nossos corações bateram',
      valor: Math.floor(diffMin * 160), // 80 BPM × 2 pessoas
      sufixo: ' vezes',
      legenda: 'juntos desde que nos conhecemos',
    },
    {
      emoji: '🛌',
      cor: '#a855f7',
      brilho: 'rgba(168,85,247,0.25)',
      titulo: 'Horas gastas dormindo',
      valor: Math.floor(diffDias * 8 * 2), // 8h/dia × 2 pessoas
      sufixo: 'h',
      legenda: 'nessa relação (a gente precisa de descanso)',
    },
    {
      emoji: '🥂',
      cor: '#f59e0b',
      brilho: 'rgba(245,158,11,0.25)',
      titulo: 'Finais de semana juntos',
      valor: Math.floor(diffDias / 7),
      sufixo: '',
      legenda: 'fins de semana oficiais como namorados',
    },
    {
      emoji: '🍕',
      cor: '#f97316',
      brilho: 'rgba(249,115,22,0.25)',
      titulo: 'Refeições compartilhadas',
      valor: Math.floor(diffDias * 0.5),
      sufixo: '',
      legenda: '(pizza e lanches suspeitos inclusos)',
    },
    {
      emoji: '🙄',
      cor: '#06b6d4',
      brilho: 'rgba(6,182,212,0.25)',
      titulo: 'Olhos revirados',
      valor: Math.floor(diffDias * 2.5),
      sufixo: ' vezes',
      legenda: '(estatisticamente, a maioria é dela para minhas piadas)',
    },
  ];
}

function formatarNumero(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.', ',') + ' mi';
  if (n >= 1_000) return n.toLocaleString('pt-BR');
  return n.toString();
}

function StatCard({ stat, index }) {
  const [valor, setValor] = useState(0);
  const animadoRef = useRef(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animadoRef.current) {
          animadoRef.current = true;
          const target = stat.valor;
          const duracao = 1800;
          const inicio = performance.now();

          const tick = (agora) => {
            const progresso = Math.min((agora - inicio) / duracao, 1);
            // Easing out cubic
            const ease = 1 - Math.pow(1 - progresso, 3);
            setValor(Math.floor(ease * target));
            if (progresso < 1) requestAnimationFrame(tick);
            else setValor(target);
          };

          // Delay escalonado por índice
          setTimeout(() => requestAnimationFrame(tick), index * 120);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [stat.valor, index]);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        padding: '20px 16px',
        borderRadius: '16px',
        border: `1px solid ${stat.cor}25`,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: `0 4px 24px ${stat.brilho}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '6px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${stat.brilho}, inset 0 1px 0 rgba(255,255,255,0.08)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 24px ${stat.brilho}, inset 0 1px 0 rgba(255,255,255,0.06)`;
      }}
    >
      {/* Barra de cor no topo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '2px',
        borderRadius: '0 0 4px 4px',
        background: `linear-gradient(to right, transparent, ${stat.cor}, transparent)`,
      }} />

      {/* Emoji */}
      <span style={{
        fontSize: '32px',
        lineHeight: 1,
        filter: `drop-shadow(0 0 8px ${stat.cor}80)`,
        marginBottom: '2px',
      }}>
        {stat.emoji}
      </span>

      {/* Título */}
      <p style={{
        fontSize: '11px',
        fontWeight: 600,
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: 0,
      }}>
        {stat.titulo}
      </p>

      {/* Número animado */}
      <p style={{
        fontFamily: "'Inter', monospace",
        fontSize: '26px',
        fontWeight: 800,
        color: stat.cor,
        margin: '4px 0 0',
        lineHeight: 1,
        textShadow: `0 0 20px ${stat.cor}50`,
        letterSpacing: '-0.02em',
      }}>
        {formatarNumero(valor)}{stat.sufixo}
      </p>

      {/* Legenda */}
      <p style={{
        fontSize: '11px',
        color: '#4b5563',
        margin: '4px 0 0',
        lineHeight: 1.4,
        fontStyle: 'italic',
        maxWidth: '180px',
      }}>
        {stat.legenda}
      </p>
    </div>
  );
}

export default function EstatisticasInutils() {
  const stats = calcularStats();

  return (
    <div style={{ marginTop: '48px' }}>
      {/* Cabeçalho da seção */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '22px',
          color: '#a855f7',
          marginBottom: '4px',
        }}>
          números que não importam
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '18px',
          fontWeight: 700,
          color: '#d1d5db',
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          (mas a gente acha fofo)
        </h2>
        <div style={{
          width: '40px',
          height: '2px',
          background: 'linear-gradient(to right, transparent, #a855f7, transparent)',
          margin: '12px auto 0',
        }} />
      </div>

      {/* Grid de cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
      }}>
        {stats.map((stat, i) => (
          <StatCard key={stat.titulo} stat={stat} index={i} />
        ))}
      </div>

      {/* Rodapé */}
      <p style={{
        textAlign: 'center',
        fontSize: '10px',
        color: '#374151',
        marginTop: '16px',
        fontStyle: 'italic',
        letterSpacing: '0.05em',
      }}>
        * cálculos baseados em estimativas altamente científicas e muito suspeitas
      </p>
    </div>
  );
}
