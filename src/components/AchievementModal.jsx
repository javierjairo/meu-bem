import { useState, useEffect } from 'react';

export default function AchievementModal({ aberto, conquista, onFechar, onSalvar, carregando }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [icone, setIcone] = useState('🏆');
  const [cor, setCor] = useState('#a855f7');
  const [secreta, setSecreta] = useState(false);
  const [jaDesbloqueada, setJaDesbloqueada] = useState(false);
  const [dataDesbloqueio, setDataDesbloqueio] = useState('');

  const editando = Boolean(conquista?.id_conquista);

  useEffect(() => {
    if (conquista) {
      setTitulo(conquista.titulo || '');
      setDescricao(conquista.descricao || '');
      setIcone(conquista.icone || '🏆');
      setCor(conquista.cor || '#a855f7');
      setSecreta(conquista.secreta || false);
      setJaDesbloqueada(conquista._jaDesbloqueada || false);
      setDataDesbloqueio(conquista._dataDesbloqueio || '');
    } else {
      setTitulo('');
      setDescricao('');
      setIcone('🏆');
      setCor('#a855f7');
      setSecreta(false);
      setJaDesbloqueada(false);
      setDataDesbloqueio('');
    }
  }, [conquista, aberto]);

  if (!aberto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({
      titulo,
      descricao,
      icone,
      cor,
      secreta,
      _jaDesbloqueada: jaDesbloqueada,
      _dataDesbloqueio: dataDesbloqueio,
    });
  };

  const emojis = ['🏆', '🌟', '💯', '🎬', '👨‍🍳', '✈️', '🔧', '❤️', '🎵', '📚', '🍕', '🎮', '🏖️', '🎂', '💍', '🐾', '🌙', '☀️', '🏠', '🧸'];
  const cores = ['#a855f7', '#ec4899', '#f59e0b', '#3b82f6', '#06b6d4', '#84cc16', '#f97316', '#ef4444', '#6366f1', '#14b8a6'];

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#e5e7eb',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '10px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <div
      onClick={onFechar}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #0f0f1a, #1a1025)',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          padding: '20px 16px',
        }}
      >
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '18px',
          fontWeight: 700,
          color: '#e9d5ff',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          {editando ? '✏️ Editar Conquista' : '🏆 Nova Conquista'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Título + Descrição lado a lado em tela grande, empilhados em tela pequena */}
          <div>
            <label style={labelStyle}>Título</label>
            <input type="text" placeholder="Ex: Cinéfilos Nível 2" value={titulo}
              onChange={(e) => setTitulo(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Descrição</label>
            <input type="text" placeholder="Ex: Assistimos 20 filmes juntos" value={descricao}
              onChange={(e) => setDescricao(e.target.value)} required style={inputStyle} />
          </div>

          {/* Emoji + Cor na mesma linha */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Emojis */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Emoji</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {emojis.map((e) => (
                  <button key={e} type="button" onClick={() => setIcone(e)}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      border: icone === e ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.06)',
                      background: icone === e ? 'rgba(168,85,247,0.15)' : 'transparent',
                      fontSize: '15px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Cores */}
            <div style={{ minWidth: '60px' }}>
              <label style={labelStyle}>Cor</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                {cores.map((c) => (
                  <button key={c} type="button" onClick={() => setCor(c)}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      border: cor === c ? '2px solid #fff' : '2px solid transparent',
                      background: c, cursor: 'pointer',
                      boxShadow: cor === c ? `0 0 8px ${c}60` : 'none',
                    }} />
                ))}
              </div>
            </div>
          </div>

          {/* Opções: Secreta + Já desbloqueada */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <label style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              padding: '6px 8px', borderRadius: '10px',
              background: secreta ? 'rgba(168,85,247,0.1)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: '#9ca3af',
            }}>
              <input type="checkbox" checked={secreta} onChange={(e) => setSecreta(e.target.checked)}
                style={{ accentColor: '#a855f7', width: '14px', height: '14px' }} />
              🔒 Secreta
            </label>

            <label style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              padding: '6px 8px', borderRadius: '10px',
              background: jaDesbloqueada ? 'rgba(34,197,94,0.08)' : 'transparent',
              border: `1px solid ${jaDesbloqueada ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: '11px', color: jaDesbloqueada ? '#4ade80' : '#9ca3af',
            }}>
              <input type="checkbox" checked={jaDesbloqueada} onChange={(e) => setJaDesbloqueada(e.target.checked)}
                style={{ accentColor: '#22c55e', width: '14px', height: '14px' }} />
              ✅ Já conquistamos
            </label>
          </div>

          {/* Data (só se já desbloqueada) */}
          {jaDesbloqueada && (
            <div>
              <label style={labelStyle}>Data da conquista</label>
              <input type="date" value={dataDesbloqueio} onChange={(e) => setDataDesbloqueio(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button type="button" onClick={onFechar}
              style={{
                flex: 1, padding: '9px', borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                color: '#6b7280', fontSize: '12px', cursor: 'pointer',
              }}>
              Cancelar
            </button>
            <button type="submit" disabled={carregando}
              style={{
                flex: 2, padding: '9px', borderRadius: '9999px', border: 'none',
                background: carregando ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff', fontSize: '12px', fontWeight: 600,
                cursor: carregando ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
              }}>
              {carregando ? '...' : editando ? 'Salvar' : jaDesbloqueada ? '🏆 Criar Desbloqueada' : 'Criar Conquista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
