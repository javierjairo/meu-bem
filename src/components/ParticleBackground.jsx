import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const PARTICLE_OPTIONS = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: "grab" },
      resize: true,
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

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => PARTICLE_OPTIONS, []);

  if (!init) return null;

  return <Particles id="tsparticles" options={options} />;
}
