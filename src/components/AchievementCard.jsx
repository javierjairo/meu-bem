

export default function AchievementCard({ conquista, desbloqueada, dtDesbloqueio, onDesbloquear, onEditar, automatica }) {
  const bloqueada = !desbloqueada;
  const secreta = conquista.secreta && bloqueada;

  return (
    <div
      style={{
        position: 'relative',
        padding: '20px 16px',
        borderRadius: '16px',
        border: `1px solid ${bloqueada ? 'rgba(255,255,255,0.06)' : `${conquista.cor}33`}`,
        background: bloqueada
          ? 'rgba(255, 255, 255, 0.02)'
          : `linear-gradient(135deg, ${conquista.cor}08, ${conquista.cor}15)`,
        opacity: bloqueada ? 0.55 : 1,
        filter: bloqueada ? 'grayscale(0.7)' : 'none',
        transition: 'all 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '8px',
        minHeight: '180px',
      }}
    >
      {/* Ícone / Emoji */}
      <div
        style={{
          fontSize: secreta ? '32px' : '40px',
          lineHeight: 1,
          filter: desbloqueada ? `drop-shadow(0 0 12px ${conquista.cor}80)` : 'none',
          marginBottom: '4px',
        }}
      >
        {secreta ? '🔒' : conquista.icone}
      </div>

      {/* Título */}
      <h4
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: desbloqueada ? '#f3f4f6' : '#6b7280',
          fontFamily: "'Inter', sans-serif",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {secreta ? 'Conquista Secreta' : conquista.titulo}
      </h4>

      {/* Descrição */}
      <p
        style={{
          fontSize: '11px',
          color: desbloqueada ? '#9ca3af' : '#4b5563',
          margin: 0,
          lineHeight: 1.4,
          maxWidth: '180px',
        }}
      >
        {secreta ? 'Continue explorando para descobrir...' : conquista.descricao}
      </p>

      {/* Data de desbloqueio */}
      {desbloqueada && dtDesbloqueio && (
        <p style={{
          fontSize: '10px',
          color: conquista.cor,
          margin: '4px 0 0',
          fontWeight: 600,
        }}>
          ✓ {new Date(dtDesbloqueio).toLocaleDateString('pt-BR')}
        </p>
      )}

      {/* Indicador de brilho se desbloqueada */}
      {desbloqueada && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '3px',
          borderRadius: '0 0 4px 4px',
          background: conquista.cor,
          boxShadow: `0 0 12px ${conquista.cor}60`,
        }} />
      )}

      {/* Botões de ação */}
      <div style={{ marginTop: 'auto', display: 'flex', gap: '6px', paddingTop: '8px', alignItems: 'center' }}>
        {bloqueada && !secreta && automatica && (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(251,191,36,0.2)',
              background: 'rgba(251,191,36,0.08)',
              color: '#fbbf24',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            ⚡ Automática
          </span>
        )}
        {bloqueada && !secreta && !automatica && (
          <button
            onClick={() => onDesbloquear(conquista)}
            style={{
              padding: '5px 14px',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
            }}
          >
            🔓 Desbloquear
          </button>
        )}
        {!secreta && !automatica && (
          <button
            onClick={() => onEditar(conquista)}
            style={{
              padding: '5px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#6b7280',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            ✏️
          </button>
        )}
      </div>
    </div>
  );
}
