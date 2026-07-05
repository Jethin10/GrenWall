import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useIsMobile } from '../lib/useIsMobile';

/**
 * The intro's galaxy collapse, 0 → 1 — tweened by `Preloader`'s timeline as
 * the counter nears 100 and read every frame by this component's own draw
 * loop (a second React-state channel would re-render every frame instead of
 * just repainting the canvas). At rest (0) it's a calm rotating spiral; as it
 * rises the arms wind in, the dust fades, and the core condenses toward the
 * single bright point that the real black hole then grows out of.
 */
export const galaxyIntroState = { collapse: 0 };

interface Star {
  arm: number;
  baseRadius: number;
  scatter: number;
  size: number;
  ember: boolean;
  twinkle: number;
}

const ARM_COUNT = 3;
const ARM_TIGHTNESS = 2.6;
const TILT = 0.42; // vertical squash — an edge-on disk, echoing the black hole's own tilt

/**
 * A slowly rotating spiral galaxy rendered on a plain 2D canvas (no second
 * WebGL context) — stars scattered along logarithmic arms, faint dust lanes,
 * and a soft glowing core, all sharing the same viewport-centre point as the
 * intro's dot/streaks above it. Collapse is driven externally via
 * `galaxyIntroState`; rotation always idles gently on its own.
 */
export function GalaxyIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let cx = width / 2;
    let cy = height / 2;
    let maxRadius = Math.min(width, height) * 0.42;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
      maxRadius = Math.min(width, height) * 0.42;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = isMobile ? 110 : 220;
    const stars: Star[] = Array.from({ length: count }, (_, i) => ({
      arm: i % ARM_COUNT,
      baseRadius: 0.08 + Math.random() * 0.92,
      scatter: (Math.random() - 0.5) * 0.5,
      size: 0.6 + Math.random() * 1.4,
      ember: Math.random() > 0.75,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let rotation = 0;
    let last = performance.now();

    const draw = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      const collapse = galaxyIntroState.collapse;
      // Winds in tighter and spins faster as the collapse takes hold.
      rotation += dt * (0.12 + collapse * 1.6);

      ctx.clearRect(0, 0, width, height);

      // Dust lanes tracing the arms — dark and warm, fading fast as the
      // galaxy pulls in.
      const dustAlpha = 0.1 * (1 - collapse);
      if (dustAlpha > 0.003) {
        ctx.strokeStyle = `rgba(30,14,5,${dustAlpha})`;
        ctx.lineWidth = isMobile ? 10 : 18;
        for (let a = 0; a < ARM_COUNT; a++) {
          ctx.beginPath();
          for (let s = 0; s <= 10; s++) {
            const t = s / 10;
            const radius = t * maxRadius * (1 - collapse * 0.85);
            const angle = rotation + (a / ARM_COUNT) * Math.PI * 2 + t * ARM_TIGHTNESS;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius * TILT;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // The stars — pulled inward and wound tighter as collapse rises.
      for (const star of stars) {
        const radius = star.baseRadius * (1 - collapse * 0.97) * maxRadius;
        const angle =
          rotation + (star.arm / ARM_COUNT) * Math.PI * 2 + star.baseRadius * ARM_TIGHTNESS + star.scatter * (1 - collapse * 0.6);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * TILT;
        const twinkle = 0.7 + 0.3 * Math.sin(time * 0.002 + star.twinkle);
        const alpha = (0.25 + 0.55 * (1 - star.baseRadius)) * twinkle * (1 - collapse * 0.3);
        ctx.fillStyle = star.ember ? `rgba(232,145,47,${alpha})` : `rgba(243,239,230,${alpha})`;
        const size = star.size * (1 + collapse * 0.6);
        ctx.fillRect(x, y, size, size);
      }

      // Soft glowing core — a gentle bulge at rest, condensing into a small
      // bright point as the collapse completes.
      const coreRadius = (1 - collapse * 0.92) * maxRadius * 0.22 + 2;
      const coreBrightness = 0.5 + collapse * 0.9;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      core.addColorStop(0, `rgba(255,242,220,${0.9 * coreBrightness})`);
      core.addColorStop(0.4, `rgba(232,145,47,${0.55 * coreBrightness})`);
      core.addColorStop(1, 'rgba(232,145,47,0)');
      ctx.fillStyle = core;
      ctx.fillRect(cx - coreRadius, cy - coreRadius, coreRadius * 2, coreRadius * 2);
    };

    const tick = (time: number) => draw(time * 1000);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion, isMobile]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />;
}
