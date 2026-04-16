import { useState, useEffect, useCallback } from 'react';
import { ClimaContext } from './ClimaContext';

export { useClima } from './ClimaContext';

// Fortaleza, CE
const LAT = -3.7172;
const LON = -38.5433;
const API_KEY = '39d7c44c0c5cb6692b2e495778fbba27'; // Coloque sua chave em https://openweathermap.org/api

// Intervalos de refresh (ms)
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutos

/**
 * Mapeia o código de clima da OWM para uma "vibe" simplificada.
 *  - clear: céu limpo, noite estrelada
 *  - clouds: nublado
 *  - rain: chuva (drizzle, rain, thunderstorm)
 *  - snow: neve
 *  - mist: névoa/neblina
 */
function mapearVibe(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'rain';       // Thunderstorm
  if (weatherId >= 300 && weatherId < 400) return 'rain';       // Drizzle
  if (weatherId >= 500 && weatherId < 600) return 'rain';       // Rain
  if (weatherId >= 600 && weatherId < 700) return 'snow';       // Snow
  if (weatherId >= 700 && weatherId < 800) return 'mist';       // Fog/mist
  if (weatherId === 800) return 'clear';                         // Clear
  if (weatherId > 800) return 'clouds';                          // Clouds
  return 'clear';
}

/**
 * Determina o "momento do dia" baseado em sunrise/sunset da API.
 *  - noite: entre 20h e 5h
 *  - amanhecer: 1h antes do sunrise
 *  - dia: entre sunrise e 1h antes do sunset
 *  - entardecer: 1h antes do sunset
 */
function mapearMomento(agora, sunrise, sunset) {
  const h = agora / 1000; // unix timestamp em seconds
  const preAmanhecer = sunrise - 3600;
  const preEntardecer = sunset - 3600;

  if (h >= preAmanhecer && h < sunrise) return 'amanhecer';
  if (h >= preEntardecer && h < sunset) return 'entardecer';
  if (h >= sunrise && h < preEntardecer) return 'dia';
  return 'noite';
}

export default function ClimaProvider({ children }) {
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const buscarClima = useCallback(async () => {
    if (!API_KEY) {
      // Sem chave: assume noite clara padrão (site vira estático normalmente)
      setClima({
        vibe: 'clear',
        momento: 'noite',
        temp: null,
        vento: { speed: 0, deg: 0 },
        descricao: '',
        gradiente: 'linear-gradient(180deg, #050510, #0a0a1a, #0d0d20)',
        particulas: { speed: 0.5, direction: 'none', gravity: 0 },
      });
      setCarregando(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      if (!res.ok) throw new Error('Falha na API');

      const data = await res.json();
      const vibe = mapearVibe(data.weather[0].id);
      const momento = mapearMomento(Date.now(), data.sys.sunrise, data.sys.sunset);
      const ventoSpeed = data.wind?.speed || 0;
      const ventoDeg = data.wind?.deg || 0;

      // Gradiente de fundo baseado no momento + clima
      const gradiente = gerarGradiente(momento, vibe);

      // Comportamento das partículas baseado no clima
      const particulas = gerarComportamentoParticulas(vibe, ventoSpeed, ventoDeg);

      setClima({
        vibe,
        momento,
        temp: Math.round(data.main.temp),
        vento: { speed: ventoSpeed, deg: ventoDeg },
        descricao: data.weather[0].description,
        gradiente,
        particulas,
      });
    } catch (err) {
      console.warn('[Clima]', err.message);
      // Fallback silencioso: noite padrão
      setClima({
        vibe: 'clear',
        momento: 'noite',
        temp: null,
        vento: { speed: 0, deg: 0 },
        descricao: '',
        gradiente: 'linear-gradient(180deg, #050510, #0a0a1a, #0d0d20)',
        particulas: { speed: 0.5, direction: 'none', gravity: 0 },
      });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarClima();
    const intervalo = setInterval(buscarClima, REFRESH_INTERVAL);
    return () => clearInterval(intervalo);
  }, [buscarClima]);

  return (
    <ClimaContext.Provider value={{ clima, carregando }}>
      {children}
    </ClimaContext.Provider>
  );
}

// ============================================================
// Gerador de Gradiente (a "cor" do céu atrás das partículas)
// ============================================================
function gerarGradiente(momento, vibe) {
  // Base por momento do dia
  const bases = {
    noite: { top: '#050510', mid: '#0a0a1a', bot: '#0d0d20' },
    amanhecer: { top: '#0d0d20', mid: '#1a0a2e', bot: '#2d1b3d' },
    dia: { top: '#0a0a1a', mid: '#0f0f2a', bot: '#1a1035' },
    entardecer: { top: '#0d0d20', mid: '#1f0a2e', bot: '#2a0f3a' },
  };

  const base = bases[momento] || bases.noite;

  // Modificadores de clima
  const mods = {
    clear: { top: base.top, mid: base.mid, bot: base.bot },
    clouds: { top: '#08080f', mid: '#0e0e18', bot: '#141420' },
    rain: { top: '#050508', mid: '#0a0a12', bot: '#0f0f1a' },
    snow: { top: '#0a0a14', mid: '#10101e', bot: '#161628' },
    mist: { top: '#0a0a10', mid: '#0f0f1a', bot: '#141422' },
  };

  const mod = mods[vibe] || mods.clear;

  // Entardecer claro: adiciona um toque quente sutil
  if (momento === 'entardecer' && vibe === 'clear') {
    return `linear-gradient(180deg, #0d0d20, #1f0a2e, #2a1530, #1a0a20)`;
  }

  // Amanhecer claro: toque rosa/lavanda super sutil
  if (momento === 'amanhecer' && vibe === 'clear') {
    return `linear-gradient(180deg, #0d0d20, #150a25, #1a0f2a, #0d0d20)`;
  }

  return `linear-gradient(180deg, ${mod.top}, ${mod.mid}, ${mod.bot})`;
}

// ============================================================
// Gerador de comportamento das partículas
// ============================================================
function gerarComportamentoParticulas(vibe, ventoSpeed, ventoDeg) {
  // Converter direção do vento (degrees) para direção tsParticles
  let direction = 'none';
  if (ventoSpeed > 3) {
    if (ventoDeg >= 315 || ventoDeg < 45) direction = 'top';
    else if (ventoDeg >= 45 && ventoDeg < 135) direction = 'right';
    else if (ventoDeg >= 135 && ventoDeg < 225) direction = 'bottom';
    else direction = 'left';
  }

  // Velocidade base proporcional ao vento real (capped)
  const speedBase = Math.min(0.3 + (ventoSpeed / 15), 2.5);

  switch (vibe) {
    case 'rain':
      return {
        speed: Math.max(speedBase, 1.2),
        direction: 'bottom',          // Chuva cai de cima
        gravity: 0.8,                 // Partículas puxadas pra baixo
        colors: ['#8b9dc3', '#c0c8e0', '#a0a8c0'],
        opacity: { min: 0.15, max: 0.6 },
        size: { min: 0.5, max: 1.8 },
      };

    case 'clouds':
      return {
        speed: speedBase * 0.8,
        direction,
        gravity: 0,
        colors: ['#b0b0c0', '#c8c8d8', '#9898a8'],
        opacity: { min: 0.15, max: 0.5 },
        size: { min: 1, max: 2.5 },
      };

    case 'mist':
      return {
        speed: speedBase * 0.4,       // Névoa = lento e flutuante
        direction: 'none',
        gravity: 0,
        colors: ['#d0d0e0', '#b8b8c8', '#c0c0d0'],
        opacity: { min: 0.1, max: 0.35 },
        size: { min: 1.5, max: 3 },   // Partículas maiores e difusas
      };

    case 'snow':
      return {
        speed: speedBase * 0.5,
        direction: 'bottom',
        gravity: 0.3,
        colors: ['#ffffff', '#e8e8ff', '#d0d0ff'],
        opacity: { min: 0.3, max: 0.8 },
        size: { min: 1, max: 3 },
      };

    case 'clear':
    default:
      return {
        speed: speedBase,
        direction,
        gravity: 0,
        colors: ['#ffffff', '#e0c3fc', '#ffc3f2'],
        opacity: { min: 0.2, max: 0.9 },
        size: { min: 1, max: 2.5 },
      };
  }
}
