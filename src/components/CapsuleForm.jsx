import { useState } from 'react';

export default function CapsuleForm({ onSubmit, onCancelar, carregando }) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [dtAbertura, setDtAbertura] = useState('');
  const [erro, setErro] = useState('');

  // Data mínima: amanhã
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const dataMinima = amanha.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (!titulo.trim()) return setErro('Dê um título para sua cápsula');
    if (!dtAbertura) return setErro('Escolha quando ela poderá ser aberta');
    if (!texto.trim()) return setErro('Escreva algo especial na sua cápsula');

    const dataEscolhida = new Date(dtAbertura + 'T00:00:00');
    if (dataEscolhida <= new Date()) {
      return setErro('A data de abertura precisa ser no futuro');
    }

    onSubmit({
      titulo: titulo.trim(),
      texto: texto.trim(),
      dt_abertura: dataEscolhida.toISOString(),
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#e5e7eb',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: '#a78bfa',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Título */}
        <div>
          <label style={labelStyle}>Título da cápsula</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Apostas para 2027"
            maxLength={100}
            style={inputStyle}
          />
        </div>

        {/* Data de abertura */}
        <div>
          <label style={labelStyle}>Abrir quando?</label>
          <input
            type="date"
            value={dtAbertura}
            onChange={(e) => setDtAbertura(e.target.value)}
            min={dataMinima}
            style={{
              ...inputStyle,
              colorScheme: 'dark',
            }}
          />
        </div>

        {/* Texto/Mensagem */}
        <div>
          <label style={labelStyle}>Sua mensagem</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva algo especial... uma carta, uma previsão, uma memória..."
            rows={5}
            maxLength={5000}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '120px',
              lineHeight: 1.6,
            }}
          />
          <p style={{ fontSize: '11px', color: 'rgba(168,132,252,0.4)', textAlign: 'right', marginTop: '4px' }}>
            {texto.length}/5000
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <p style={{
            fontSize: '13px',
            color: '#f87171',
            textAlign: 'center',
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(248, 113, 113, 0.1)',
          }}>
            {erro}
          </p>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancelar}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#9ca3af',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={carregando}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: carregando
                ? 'rgba(124, 58, 237, 0.3)'
                : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: carregando ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.2s',
            }}
          >
            {carregando ? 'Selando...' : '✉️ Selar Cápsula'}
          </button>
        </div>
      </div>
    </form>
  );
}
