import { useEffect, useState, useMemo } from "react";
import { useClima } from "./ClimaContext";

// ============================================================
// Detecção de dispositivo
// ============================================================
function getDeviceCategory() {
  if (typeof window === 'undefined') return 'desktop';
  
  const isMobile = window.innerWidth < 768 || 
    ('ontouchstart' in window && navigator.maxTouchPoints > 0);
  
  if (!isMobile) return 'desktop';
  
  // Low-end: telas pequenas, poucos cores, hardware fraco
  const isLowEnd = window.innerWidth < 500 || 
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    // Samsung Galaxy M14 e similares
    (navigator.deviceMemory && navigator.deviceMemory <= 4);
  
  return isLowEnd ? 'lowend' : 'mobile';
}

// ============================================================
// Versão CSS pura para mobile — ZERO impacto na performance
// ============================================================
function CSSStars({ count, clima }) {
  const corBase = clima?.particulas?.colors?.[0] || '#fff';

  const stars = useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${0.8 + Math.random() * 1.5}px`,
        opacity: 0.3 + Math.random() * 0.6,
        delay: `${Math.random() * 4}s`,
        duration: `${3 + Math.random() * 4}s`,
      });
    }
    return result;
  }, [count]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: corBase,
            opacity: star.opacity,
            animation: `starTwinkle ${star.duration} ease-in-out ${star.delay} infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes starTwinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Versão com partículas para desktop (reativa ao clima)
// ============================================================
function DesktopParticles({ clima }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    // Import dinâmico — não carrega o bundle de partículas no mobile
    let cancelled = false;
    Promise.all([
      import("@tsparticles/react"),
      import("@tsparticles/slim"),
    ]).then(async ([{ default: Particles, initParticlesEngine }, { loadSlim }]) => {
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
      if (!cancelled) {
        setInit(true);
        // Salvar no window para reusar
        window.__ParticlesComponent = Particles;
      }
    });
    return () => { cancelled = true; };
  }, []);

  // Configurações reativas ao clima
  const p = clima?.particulas || {};
  
  const options = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "grab" },
        resize: { enable: true },
      },
      modes: {
        push: { quantity: 4 },
        grab: { distance: 140, links: { opacity: 0.5 } },
      },
    },
    particles: {
      color: { value: p.colors || ["#ffffff", "#e0c3fc", "#ffc3f2"] },
      links: {
        color: "#d8b4e2",
        distance: 160,
        enable: false,
        opacity: 0.6,
        width: 1.5,
        shadow: { enable: true, color: "#d8b4e2", blur: 5 },
      },
      move: {
        direction: p.direction || "none",
        enable: true,
        outModes: { default: "out" },
        random: (p.direction === 'none'),
        speed: p.speed || 0.5,
        straight: false,
        gravity: {
          enable: (p.gravity || 0) > 0,
          acceleration: p.gravity || 0,
        },
      },
      number: { density: { enable: true, area: 800 }, value: 90 },
      opacity: {
        value: p.opacity || { min: 0.2, max: 0.9 },
        animation: { enable: true, speed: 1, minimumValue: 0.1 },
      },
      shape: { type: "circle" },
      size: { value: p.size || { min: 1, max: 2.5 } },
      shadow: { enable: true, blur: 8, color: "#ffffff" },
    },
    detectRetina: true,
    fullScreen: { enable: true, zIndex: 0 },
  }), [
    p.colors?.join(','),
    p.direction,
    p.speed,
    p.gravity,
    p.opacity?.min,
    p.opacity?.max,
    p.size?.min,
    p.size?.max,
  ]);

  if (!init || !window.__ParticlesComponent) return null;

  const Particles = window.__ParticlesComponent;
  return <Particles id="tsparticles" options={options} />;
}

// ============================================================
// Gradiente de fundo (a "cor do céu" atrás de tudo)
// ============================================================
function BackgroundGradient({ gradiente }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: gradiente || 'linear-gradient(180deg, #050510, #0a0a1a, #0d0d20)',
        transition: 'background 5s ease', // Transição suave de 5 segundos
      }}
    />
  );
}

// ============================================================
// Badge discreto de clima (canto inferior)
// ============================================================
function ClimaBadge({ clima }) {
  if (!clima?.temp) return null;

  const emojiMap = {
    clear: '✨', clouds: '☁️', rain: '🌧️', snow: '❄️', mist: '🌫️',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '12px',
        right: '12px',
        zIndex: 50,
        padding: '4px 10px',
        borderRadius: '9999px',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontSize: '10px',
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <span>{emojiMap[clima.vibe] || '🌙'}</span>
      <span>{clima.temp}°C</span>
      <span style={{ color: '#374151' }}>Fortaleza</span>
    </div>
  );
}

// ============================================================
// Componente principal — escolhe a versão certa por dispositivo
// ============================================================
export default function ParticleBackground() {
  const [category, setCategory] = useState('desktop');
  const { clima } = useClima();

  useEffect(() => {
    setCategory(getDeviceCategory());
  }, []);

  return (
    <>
      {/* Camada 0: Gradiente de fundo reativo ao clima */}
      <BackgroundGradient gradiente={clima?.gradiente} />

      {/* Camada 1: Partículas */}
      {category === 'lowend' && <CSSStars count={15} clima={clima} />}
      {category === 'mobile' && <CSSStars count={25} clima={clima} />}
      {category === 'desktop' && <DesktopParticles clima={clima} />}

      {/* Camada 2: Badge de clima discreto */}
      <ClimaBadge clima={clima} />
    </>
  );
}
