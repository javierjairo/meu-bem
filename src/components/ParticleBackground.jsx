import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // carrega apenas o motor essencial do tsparticles (slim) para ser leve
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={{
        background: {
          color: {
            // fundo transparente para permitir que a cor do site (layout bg-dark) apareça por trás (ou ser o próprio fundo escuro)
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push", // ao clicar empurra/adiciona estrelas
            },
            onHover: {
              enable: true,
              mode: "grab", // ao passar o mouse, conecta as estrelas próximas com linhas
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            grab: {
              distance: 140, // distância para criar a linha (constelação)
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        particles: {
          color: {
            value: ["#ffffff", "#e0c3fc", "#ffc3f2"], // cores misturadas nas estrelas (branco e leves tons pastéis)
          },
          links: {
            color: "#d8b4e2", // cor das linhas puxando levemente pro lilás/rosa
            distance: 160,
            enable: false, // SÓ aparece as linhas no hover (mode: "grab")
            opacity: 0.6,
            width: 1.5,
            shadow: {
              enable: true,
              color: "#d8b4e2",
              blur: 5
            }
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce", // quica na borda da tela
            },
            random: false,
            speed: 0.5, // velocidade bem lenta
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 90, // quantidade de partículas um pouco maior
          },
          opacity: {
            value: { min: 0.2, max: 0.9 }, // piscar de estrelas
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.2,
            }
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2.5 }, // estrelas ligeiramente maiores
          },
          shadow: { // brilho/"Glow" nas estrelas
            enable: true,
            blur: 8,
            color: "#ffffff"
          }
        },
        detectRetina: true,
        fullScreen: {
          enable: true, // força o canvas a ocupar a tela inteira com position: fixed
          zIndex: 0     // garante que fica no fundo (o conteúdo acima deve ter z-index maior/relative)
        }
      }}
    />
  );
}
