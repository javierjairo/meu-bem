import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 
    ('ontouchstart' in window && navigator.maxTouchPoints > 0);
}

function isLowEndDevice() {
  if (typeof window === 'undefined') return false;
  // Telas muito pequenas ou ram limitada = low-end
  return window.innerWidth < 400 || 
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
}

function getParticleOptions(isMobile, isLowEnd) {
  // Em dispositivo low-end: partículas estáticas super leves
  if (isLowEnd) {
    return {
      background: { color: { value: "transparent" } },
      fpsLimit: 20,
      interactivity: {
        events: {
          onClick: { enable: false },
          onHover: { enable: false },
          resize: { enable: true },
        },
      },
      particles: {
        color: { value: ["#ffffff", "#e0c3fc"] },
        links: { enable: false },
        move: {
          enable: true,
          speed: 0.15,
          direction: "none",
          outModes: { default: "bounce" },
          straight: false,
        },
        number: { density: { enable: true, area: 1200 }, value: 12 },
        opacity: { value: { min: 0.3, max: 0.8 } },
        shape: { type: "circle" },
        size: { value: { min: 0.8, max: 1.8 } },
      },
      detectRetina: false,
      fullScreen: { enable: true, zIndex: 0 },
    };
  }

  // Mobile normal (iPhone 12 etc): leve mas bonito
  if (isMobile) {
    return {
      background: { color: { value: "transparent" } },
      fpsLimit: 30,
      interactivity: {
        events: {
          onClick: { enable: false },
          onHover: { enable: false },
          resize: { enable: true },
        },
      },
      particles: {
        color: { value: ["#ffffff", "#e0c3fc", "#ffc3f2"] },
        links: { enable: false },
        move: {
          enable: true,
          speed: 0.3,
          direction: "none",
          outModes: { default: "bounce" },
          straight: false,
        },
        number: { density: { enable: true, area: 1000 }, value: 25 },
        opacity: {
          value: { min: 0.2, max: 0.85 },
          animation: { enable: true, speed: 0.5, minimumValue: 0.2 },
        },
        shape: { type: "circle" },
        size: { value: { min: 0.8, max: 2 } },
      },
      detectRetina: false,
      fullScreen: { enable: true, zIndex: 0 },
    };
  }

  // Desktop: experiência completa
  return {
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
  };
}

export default function ParticleBackground() {
  const [init, setInit] = useState(false);
  const [deviceType, setDeviceType] = useState({ mobile: false, lowEnd: false });

  useEffect(() => {
    const mobile = isMobileDevice();
    const lowEnd = isLowEndDevice();
    setDeviceType({ mobile, lowEnd });

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(
    () => getParticleOptions(deviceType.mobile, deviceType.lowEnd),
    [deviceType.mobile, deviceType.lowEnd]
  );

  if (!init) return null;

  return <Particles id="tsparticles" options={options} />;
}
