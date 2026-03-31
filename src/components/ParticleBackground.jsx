import { useEffect, useState, useMemo } from "react";

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
function CSSStars({ count }) {
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
            backgroundColor: '#fff',
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
// Versão com partículas para desktop (mantém a experiência completa)
// ============================================================
function DesktopParticles() {
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
      color: { value: ["#ffffff", "#e0c3fc", "#ffc3f2"] },
      links: {
        color: "#d8b4e2",
        distance: 160,
        enable: false,
        opacity: 0.6,
        width: 1.5,
        shadow: { enable: true, color: "#d8b4e2", blur: 5 },
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 0.5,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 90 },
      opacity: {
        value: { min: 0.2, max: 0.9 },
        animation: { enable: true, speed: 1, minimumValue: 0.2 },
      },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2.5 } },
      shadow: { enable: true, blur: 8, color: "#ffffff" },
    },
    detectRetina: true,
    fullScreen: { enable: true, zIndex: 0 },
  }), []);

  if (!init || !window.__ParticlesComponent) return null;

  const Particles = window.__ParticlesComponent;
  return <Particles id="tsparticles" options={options} />;
}

// ============================================================
// Componente principal — escolhe a versão certa por dispositivo
// ============================================================
export default function ParticleBackground() {
  const [category, setCategory] = useState('desktop');

  useEffect(() => {
    setCategory(getDeviceCategory());
  }, []);

  // Low-end (Samsung M14, etc): 15 estrelas CSS simples, zero JS pesado
  if (category === 'lowend') {
    return <CSSStars count={15} />;
  }

  // Mobile médio (iPhone 12, etc): 25 estrelas CSS com brilho
  if (category === 'mobile') {
    return <CSSStars count={25} />;
  }

  // Desktop: experiência completa com tsParticles
  return <DesktopParticles />;
}
