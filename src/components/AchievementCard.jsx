import { useState } from 'react';

export default function AchievementCard({ conquista, desbloqueada, dtDesbloqueio, onDesbloquear, onEditar, automatica, secretaNumero }) {
  const bloqueada = !desbloqueada;
  const secreta = conquista.secreta && bloqueada;

  const [pedindoSenha, setPedindoSenha] = useState(false);
  const [senha, setSenha] = useState('');
  const [senhaErrada, setSenhaErrada] = useState(false);

  const tentarRevelar = () => {
    if (senha.trim().toLowerCase() === 'conseguimos') {
      setPedindoSenha(false);
      setSenha('');
      setSenhaErrada(false);
      onDesbloquear(conquista);
    } else {
      setSenhaErrada(true);
      setTimeout(() => setSenhaErrada(false), 2000);
    }
  };

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
        {secreta ? `Conquista Secreta ${secretaNumero || ''}` : conquista.titulo}
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
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px', alignItems: 'center', width: '100%' }}>
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

        {/* Botão Revelar conquista secreta */}
        {bloqueada && secreta && !pedindoSenha && (
          <button
            onClick={() => setPedindoSenha(true)}
            style={{
              padding: '5px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(251,191,36,0.25)',
              background: 'rgba(251,191,36,0.08)',
              color: '#fbbf24',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            🔓 Revelar
          </button>
        )}

        {/* Input de senha para conquista secreta */}
        {bloqueada && secreta && pedindoSenha && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input
              type="text"
              placeholder="Digite a senha..."
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && tentarRevelar()}
              autoFocus
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '10px',
                border: `1px solid ${senhaErrada ? 'rgba(248,113,113,0.5)' : 'rgba(251,191,36,0.3)'}`,
                background: 'rgba(255,255,255,0.05)',
                color: '#e5e7eb',
                fontSize: '11px',
                textAlign: 'center',
                outline: 'none',
                boxSizing: 'border-box',
                animation: senhaErrada ? 'senhaShake 0.4s ease' : 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => { setPedindoSenha(false); setSenha(''); setSenhaErrada(false); }}
                style={{
                  flex: 1,
                  padding: '4px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'transparent',
                  color: '#6b7280',
                  fontSize: '9px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
              <button
                onClick={tentarRevelar}
                style={{
                  flex: 2,
                  padding: '4px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(251,191,36,0.15)',
                  color: '#fbbf24',
                  fontSize: '9px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Confirmar
              </button>
            </div>
            {senhaErrada && (
              <p style={{ fontSize: '9px', color: '#f87171', margin: 0 }}>
                Senha incorreta 😅
              </p>
            )}
          </div>
        )}

        {/* Botão editar — aparece em todos (exceto secretos bloqueados e automáticos) */}
        {!automatica && !(secreta && bloqueada) && (
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

      <style>{`
        @keyframes senhaShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
