import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "framer-motion";

// The provider requires a stable init callback for the whole page lifecycle.
const initParticles = async (engine) => {
  await loadSlim(engine);
};

const particleOptions = {
  fullScreen: { enable: false },
  background: {
    color: {
      value: "",
    },
  },
  fpsLimit: 144,
  interactivity: {
    events: {
      onClick: {
        enable: false,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: {
        enable: true,
      },
    },
    modes: {
      push: {
        quantity: 90,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#A0B3A9",
      opacity: 0.3,
    },
    links: {
      color: "#A0B3A9",
      distance: 150,
      enable: true,
      opacity: 0.35,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 1,
    },
    shape: {
      type: "circle",
      fill: {
        enable: false,
      },
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};

const ParticlesContainer = () => {
  const prefersReducedMotion = useReducedMotion();

  // Respect the visitor's reduced-motion preference by not mounting an
  // animation engine at all.
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        className="absolute right-0 w-full h-full translate-z-0"
        id="tsparticles"
        options={particleOptions}
      />
    </ParticlesProvider>
  );
};

export default ParticlesContainer;
