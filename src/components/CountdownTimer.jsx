import { useState, useEffect, useCallback } from 'react';

function calcularTempo(dataAlvo) {
  const agora = Date.now();
  const alvo = new Date(dataAlvo).getTime();
  const diff = alvo - agora;

  if (diff <= 0) return null; // Já expirou

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);

  return { dias, horas, minutos, segundos };
}

export default function CountdownTimer({ dataAlvo, onExpirar }) {
  const [tempo, setTempo] = useState(() => calcularTempo(dataAlvo));

  const atualizar = useCallback(() => {
    const novoTempo = calcularTempo(dataAlvo);
    setTempo(novoTempo);
    if (!novoTempo && onExpirar) onExpirar();
  }, [dataAlvo, onExpirar]);

  useEffect(() => {
    atualizar();
    const intervalo = setInterval(atualizar, 1000);
    return () => clearInterval(intervalo);
  }, [atualizar]);

  if (!tempo) return null;

  const blocos = [
    { valor: tempo.dias, label: 'dias' },
    { valor: tempo.horas, label: 'hrs' },
    { valor: tempo.minutos, label: 'min' },
    { valor: tempo.segundos, label: 'seg' },
  ];

  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
      {blocos.map(({ valor, label }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '40px',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '18px',
              color: '#e9d5ff',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(valor).padStart(2, '0')}
          </span>
          <span
            style={{
              fontSize: '9px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(168, 132, 252, 0.6)',
              marginTop: '2px',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
