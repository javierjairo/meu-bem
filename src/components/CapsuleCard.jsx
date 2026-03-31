import { useState, useCallback } from 'react';
import CountdownTimer from './CountdownTimer';

// Ícone de carta fechada (lacre) — SVG inline
function CartaLacrada() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Envelope */}
      <rect x="4" y="14" width="40" height="26" rx="3" fill="#1a1025" stroke="#7c3aed" strokeWidth="1.5" />
      {/* Aba superior */}
      <path d="M4 17l20 13 20-13" stroke="#7c3aed" strokeWidth="1.5" fill="none" />
      {/* Lacre */}
      <circle cx="24" cy="30" r="7" fill="#581c87" stroke="#a855f7" strokeWidth="1.5" />
      {/* Coração no lacre */}
      <path d="M24 27.5c-1-1.5-3-1.5-3 .5s3 3.5 3 3.5 3-1.5 3-3.5-2-2-3-.5z" fill="#e9d5ff" />
    </svg>
  );
}

// Ícone de carta aberta
function CartaAberta() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Envelope */}
      <rect x="4" y="18" width="40" height="22" rx="3" fill="#1a1025" stroke="#a855f7" strokeWidth="1.5" />
      {/* Aba aberta */}
      <path d="M4 18l20-10 20 10" stroke="#a855f7" strokeWidth="1.5" fill="#1a1025" />
      {/* Papel saindo */}
      <rect x="12" y="10" width="24" height="20" rx="2" fill="#2d1f3e" stroke="#c084fc" strokeWidth="1" />
      {/* Linhas de texto */}
      <line x1="16" y1="16" x2="32" y2="16" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="20" x2="28" y2="20" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="24" x2="30" y2="24" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// Ícone de carta pronta para abrir (brilhante)
function CartaPronta() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      {/* Envelope */}
      <rect x="4" y="14" width="40" height="26" rx="3" fill="#1a1025" stroke="#c084fc" strokeWidth="2" />
      {/* Aba superior */}
      <path d="M4 17l20 13 20-13" stroke="#c084fc" strokeWidth="2" fill="none" />
      {/* Brilhos */}
      <circle cx="38" cy="12" r="2" fill="#e9d5ff" opacity="0.8" />
      <circle cx="42" cy="8" r="1.2" fill="#c084fc" opacity="0.6" />
      <circle cx="35" cy="8" r="1" fill="#a855f7" opacity="0.7" />
      {/* Lacre com estrela */}
      <circle cx="24" cy="30" r="7" fill="#7c3aed" stroke="#e9d5ff" strokeWidth="1.5" />
      <text x="24" y="33" textAnchor="middle" fontSize="10" fill="#fef3c7">✦</text>
    </svg>
  );
}

function formatarData(dataStr) {
  if (!dataStr) return '';
  const d = new Date(dataStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function CapsuleCard({ capsula, onAbrir }) {
  const [expirou, setExpirou] = useState(false);

  const liberada = capsula.liberada || expirou;
  const jaAberta = capsula.aberta;

  const handleExpirar = useCallback(() => {
    setExpirou(true);
  }, []);

  // Estilos por estado
  const containerStyle = {
    position: 'relative',
    padding: '20px',
    borderRadius: '16px',
    border: liberada
      ? '1px solid rgba(168, 85, 247, 0.5)'
      : '1px solid rgba(255, 255, 255, 0.08)',
    background: liberada
      ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.15), rgba(30, 10, 60, 0.3))'
      : 'rgba(255, 255, 255, 0.03)',
    cursor: liberada && !jaAberta ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
  };

  // Brilho sutil para cartas prontas
  const glowStyle = liberada && !jaAberta ? {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(168, 85, 247, 0.15)',
    filter: 'blur(20px)',
    pointerEvents: 'none',
  } : null;

  return (
    <div
      style={containerStyle}
      onClick={() => liberada && onAbrir?.(capsula)}
      role={liberada ? 'button' : undefined}
    >
      {glowStyle && <div style={glowStyle} />}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header: ícone + título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {jaAberta ? <CartaAberta /> : liberada ? <CartaPronta /> : <CartaLacrada />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '16px',
                fontWeight: 600,
                color: liberada ? '#e9d5ff' : '#9ca3af',
                margin: 0,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {capsula.titulo}
            </h4>
            <p
              style={{
                fontSize: '11px',
                color: 'rgba(168, 132, 252, 0.5)',
                margin: '2px 0 0',
                letterSpacing: '0.05em',
              }}
            >
              {jaAberta
                ? `Aberta em ${formatarData(capsula.dt_abertura_real)}`
                : `Para: ${formatarData(capsula.dt_abertura)}`
              }
            </p>
          </div>
        </div>

        {/* Corpo: estado */}
        {!liberada && (
          <div style={{ marginTop: '8px' }}>
            <p
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(168, 132, 252, 0.4)',
                textAlign: 'center',
                marginBottom: '8px',
              }}
            >
              abre em
            </p>
            <CountdownTimer
              dataAlvo={capsula.dt_abertura}
              onExpirar={handleExpirar}
            />
          </div>
        )}

        {liberada && !jaAberta && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
              }}
            >
              ✦ Abrir Cápsula ✦
            </span>
          </div>
        )}

        {jaAberta && capsula.texto && (
          <p
            style={{
              fontSize: '13px',
              color: '#d1d5db',
              lineHeight: 1.5,
              marginTop: '8px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {capsula.texto}
          </p>
        )}
      </div>
    </div>
  );
}
