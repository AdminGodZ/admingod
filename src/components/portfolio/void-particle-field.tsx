"use client";

import { useEffect, useRef } from "react";

type VoidParticleFieldProps = {
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
  drift: number;
  phase: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function sampleEdgeX(width: number) {
  if (Math.random() < 0.14) {
    const centerSpread = width * 0.14;
    return width * 0.5 + (Math.random() - 0.5) * centerSpread;
  }

  const side = Math.random() < 0.5 ? -1 : 1;
  const edgeBias = Math.random() ** 0.36;
  const center = width * 0.5;
  const offset = edgeBias * width * 0.48;
  return center + side * offset;
}

function resetParticle(particle: Particle, width: number, height: number) {
  particle.x = sampleEdgeX(width);
  particle.y = height + Math.random() * (height * 0.25 + 20);
  particle.speed = 0.42 + Math.random() * 1.25;
  particle.size = 1 + Math.random() * 2.4;
  particle.alpha = 0.22 + Math.random() * 0.62;
  particle.drift = (Math.random() - 0.5) * 0.18;
  particle.phase = Math.random() * Math.PI * 2;
}

export default function VoidParticleField({
  className,
}: VoidParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    let dark = document.documentElement.classList.contains("dark");

    const resize = () => {
      canvas.style.removeProperty("width");
      canvas.style.removeProperty("height");

      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.8);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = clamp(Math.floor(width / 4.8), 220, 560);
      particles = Array.from({ length: count }, () => {
        const particle = {} as Particle;
        resetParticle(particle, width, height);
        particle.y -= Math.random() * height * 0.24;
        return particle;
      });
    };

    const draw = (now: number) => {
      const delta = Math.min(40, now - last);
      last = now;
      const dt = delta / 16.666;
      const time = now * 0.001;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(
        0,
        dark ? "rgba(255, 255, 255, 0.055)" : "rgba(10, 10, 10, 0.085)",
      );
      gradient.addColorStop(
        0.22,
        dark ? "rgba(245, 245, 245, 0.026)" : "rgba(14, 14, 14, 0.04)",
      );
      gradient.addColorStop(
        0.56,
        dark ? "rgba(235, 235, 235, 0.008)" : "rgba(16, 16, 16, 0.012)",
      );
      gradient.addColorStop(1, "rgba(16, 16, 16, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.y -= particle.speed * dt;
        particle.x +=
          Math.sin(time * 0.8 + particle.phase) * 0.08 + particle.drift * dt;

        const centerPull = (width * 0.5 - particle.x) * 0.0008;
        particle.x += centerPull;

        if (particle.y < -8 || particle.x < -12 || particle.x > width + 12) {
          resetParticle(particle, width, height);
        }

        const rise = 1 - clamp(particle.y / height, 0, 1);
        const fade = clamp(1 - rise * 0.95, 0.06, 1);
        const alpha = clamp(particle.alpha * fade * 1.08, 0, 1);
        ctx.fillStyle = dark
          ? `rgba(226, 226, 226, ${alpha * 0.72})`
          : `rgba(22, 22, 22, ${alpha})`;
        ctx.shadowBlur = 6 + particle.size * 2.6;
        ctx.shadowColor = dark
          ? "rgba(255, 255, 255, 0.18)"
          : "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }

      ctx.shadowBlur = 0;

      if (!prefersReducedMotion) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    const onResize = () => {
      resize();
      if (prefersReducedMotion) {
        draw(0);
      }
    };

    resize();
    window.addEventListener("resize", onResize, { passive: true });
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");

      if (prefersReducedMotion) {
        draw(performance.now());
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (prefersReducedMotion) {
      draw(0);
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
