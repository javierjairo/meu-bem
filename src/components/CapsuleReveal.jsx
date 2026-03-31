import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function formatarData(dataStr) {
  if (!dataStr) return '';
  const d = new Date(dataStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function CapsuleReveal({ capsula, onFechar }) {
  const [visivel, setVisivel] = useState(false);
  const [mostrarTexto, setMostrarTexto] = useState(false);

  useEffect(() => {
    if (capsula) {
      // Animação sequencial: fundo → carta → texto
      requestAnimationFrame(() => setVisivel(true));
      const timer = setTimeout(() => setMostrarTexto(true), 600);
      return () => clearTimeout(timer);
    } else {
      setVisivel(false);
      setMostrarTexto(false);
    }
  }, [capsula]);

  const handleFechar = () => {
    setMostrarTexto(false);
    setVisivel(false);
    setTimeout(() => onFechar?.(), 300);
  };

  if (!capsula) return null;

  return createPortal(
    <div
      onClick={handleFechar}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: visivel ? 'rgba(0, 0, 0, 0.92)' : 'rgba(0, 0, 0, 0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* Botão fechar */}
      <button
        onClick={handleFechar}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}
      >
        ×
      </button>

      {/* Conteúdo da carta */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '80vh',
          overflowY: 'auto',
          borderRadius: '20px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          background: 'linear-gradient(180deg, #1a1025 0%, #0f0a15 100%)',
          padding: '32px 24px',
          transform: visivel ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(30px)',
          opacity: visivel ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          boxShadow: '0 0 60px rgba(124, 58, 237, 0.15)',
        }}
      >
        {/* Ícone de carta aberta */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="18" width="40" height="22" rx="3" fill="#1a1025" stroke="#a855f7" strokeWidth="1.5" />
            <path d="M4 18l20-10 20 10" stroke="#a855f7" strokeWidth="1.5" fill="#1a1025" />
            <rect x="12" y="10" width="24" height="20" rx="2" fill="#2d1f3e" stroke="#c084fc" strokeWidth="1" />
            <line x1="16" y1="16" x2="32" y2="16" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
            <line x1="16" y1="20" x2="28" y2="20" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
            <line x1="16" y1="24" x2="30" y2="24" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        {/* Título */}
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px',
            fontWeight: 700,
            color: '#e9d5ff',
            textAlign: 'center',
            margin: '0 0 8px',
            lineHeight: 1.3,
          }}
        >
          {capsula.titulo}
        </h3>

        {/* Metadados */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(168,132,252,0.5)', letterSpacing: '0.1em', margin: '4px 0' }}>
            Criada em {formatarData(capsula.dt_criacao)}
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(168,132,252,0.5)', letterSpacing: '0.1em', margin: '4px 0' }}>
            Aberta em {formatarData(capsula.dt_abertura_real || new Date().toISOString())}
          </p>
        </div>

        {/* Separador */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #7c3aed, transparent)',
            margin: '0 auto 24px',
          }}
        />

        {/* Texto da mensagem */}
        <div
          style={{
            opacity: mostrarTexto ? 1 : 0,
            transform: mostrarTexto ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.6s ease',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              color: '#d1d5db',
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
            }}
          >
            {capsula.texto}
          </p>
        </div>

        {/* Assinatura */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '18px',
              color: 'rgba(168, 132, 252, 0.6)',
            }}
          >
            com amor ♡
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
