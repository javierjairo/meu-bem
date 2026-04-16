import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';

const API_KEY = 'DEMO_KEY'; // Substitua pela sua chave em https://api.nasa.gov

// Traduz texto EN → PT-BR usando API MyMemory (gratuita)
async function traduzir(texto) {
  if (!texto) return texto;
  try {
    // Quebra em blocos de ~450 chars nos pontos finais pra respeitar o limite da API
    const frases = texto.match(/[^.!?]+[.!?]+/g) || [texto];
    const blocos = [];
    let blocoAtual = '';

    for (const frase of frases) {
      if ((blocoAtual + frase).length > 450) {
        if (blocoAtual) blocos.push(blocoAtual.trim());
        blocoAtual = frase;
      } else {
        blocoAtual += frase;
      }
    }
    if (blocoAtual.trim()) blocos.push(blocoAtual.trim());

    const traduzidos = await Promise.all(
      blocos.map(async (bloco) => {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(bloco)}&langpair=en|pt-br`
        );
        const json = await res.json();
        return json.responseData?.translatedText || bloco;
      })
    );

    return traduzidos.join(' ');
  } catch {
    return texto; // Fallback: retorna original em inglês
  }
}

export default function Universo() {
  const [data, setData] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [traduzindo, setTraduzindo] = useState(false);
  const [erro, setErro] = useState('');

  const buscar = async () => {
    if (!data) {
      setErro('Escolha uma data para ver o universo naquele dia 💫');
      return;
    }

    setErro('');
    setResultado(null);
    setCarregando(true);

    try {
      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${data}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.msg || 'Data inválida ou fora do alcance da NASA');
      }

      const json = await res.json();

      // Mostra o resultado com imagem + título imediatamente
      setResultado({
        title: json.title,
        titleEN: json.title, // guarda original em inglês
        url: json.url,
        hdurl: json.hdurl,
        explanation: json.explanation,
        media_type: json.media_type,
        date: json.date,
      });
      setCarregando(false);

      // Traduz título e explicação em background
      setTraduzindo(true);
      const [tituloPT, explicacaoPT] = await Promise.all([
        traduzir(json.title),
        traduzir(json.explanation),
      ]);

      setResultado(prev => ({
        ...prev,
        title: tituloPT,
        explanation: explicacaoPT,
      }));
      setTraduzindo(false);

    } catch (err) {
      setErro(err.message || 'Ops, algo deu errado ao buscar as estrelas...');
      setCarregando(false);
    }
  };

  return (
    <div className="w-full animate-fadeIn pb-8 sm:pb-12">
      <SectionTitle
        title="O Universo Daquele Dia"
        subtitle="Descubra como o cosmos estava em uma data especial pra gente"
      />

      {/* Seletor de data + botão */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        marginTop: '24px',
        marginBottom: '32px',
      }}>
        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          fontStyle: 'italic',
          textAlign: 'center',
          maxWidth: '360px',
        }}>
          Escolha a data de um momento nosso e veja a foto que a NASA registrou do espaço naquele exato dia.
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min="1995-06-16"
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#e5e7eb',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              colorScheme: 'dark',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)'}
          />

          <button
            onClick={buscar}
            disabled={carregando}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: carregando
                ? 'rgba(124,58,237,0.3)'
                : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: carregando ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              if (!carregando) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 24px rgba(124,58,237,0.35)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(124,58,237,0.25)';
            }}
          >
            {carregando ? '✨ Buscando...' : '🔭 Buscar Estrelas'}
          </button>
        </div>
      </div>

      {/* Erro */}
      {erro && (
        <div style={{
          maxWidth: '480px',
          margin: '0 auto 24px',
          padding: '12px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(248,113,113,0.2)',
          background: 'rgba(248,113,113,0.06)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: '#f87171', margin: 0 }}>
            🌌 {erro}
          </p>
        </div>
      )}

      {/* Loading */}
      {carregando && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(168,85,247,0.15)',
            borderTopColor: '#a855f7',
            animation: 'universoSpin 0.8s linear infinite',
          }} />
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '12px',
            fontStyle: 'italic',
          }}>
            Viajando pelo cosmos...
          </p>
        </div>
      )}

      {/* Resultado */}
      {resultado && !carregando && (
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          animation: 'universoFadeIn 0.8s ease',
        }}>
          {/* Imagem ou Vídeo */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(168,85,247,0.2)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(168,85,247,0.08)',
            marginBottom: '20px',
          }}>
            {resultado.media_type === 'video' ? (
              <iframe
                src={resultado.url}
                title={resultado.title}
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  border: 'none',
                }}
                allowFullScreen
              />
            ) : (
              <a href={resultado.hdurl || resultado.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={resultado.url}
                  alt={resultado.title}
                  style={{
                    width: '100%',
                    display: 'block',
                    cursor: 'zoom-in',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </a>
            )}
          </div>

          {/* Título EN (grande) */}
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 700,
            color: '#e9d5ff',
            marginBottom: '4px',
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            {resultado.titleEN}
          </h3>

          {/* Título PT (menor, abaixo) */}
          {resultado.title !== resultado.titleEN && (
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '15px',
              fontWeight: 500,
              color: '#9ca3af',
              marginBottom: '6px',
              textAlign: 'center',
              lineHeight: 1.3,
              fontStyle: 'italic',
            }}>
              {resultado.title}
            </p>
          )}

          {/* Data formatada */}
          <p style={{
            fontSize: '11px',
            color: '#a855f7',
            textAlign: 'center',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            📅 {new Date(resultado.date + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          </p>

          {/* Explicação */}
          <div style={{
            padding: '20px 24px',
            borderRadius: '14px',
            border: '1px solid rgba(168,85,247,0.1)',
            background: 'rgba(255,255,255,0.02)',
            position: 'relative',
          }}>
            {/* Badge de tradução */}
            {traduzindo && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '12px',
                fontSize: '10px',
                color: '#a855f7',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span style={{ animation: 'universoSpin 1s linear infinite', display: 'inline-block' }}>🌐</span>
                Traduzindo...
              </div>
            )}

            <p style={{
              fontSize: '13px',
              color: '#d1d5db',
              lineHeight: 1.8,
              margin: 0,
              textAlign: 'justify',
              fontFamily: "'Inter', sans-serif",
              transition: 'opacity 0.3s ease',
              opacity: traduzindo ? 0.5 : 1,
            }}>
              {resultado.explanation}
            </p>
          </div>

          {/* Crédito */}
          <p style={{
            fontSize: '9px',
            color: '#374151',
            textAlign: 'center',
            marginTop: '16px',
            letterSpacing: '0.08em',
          }}>
            Imagem: NASA — Foto Astronômica do Dia (APOD) · Tradução automática
          </p>
        </div>
      )}

      {/* Animações CSS */}
      <style>{`
        @keyframes universoSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes universoFadeIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
