import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useIsMobile } from '../lib/useIsMobile';
import { fallState } from '../lib/fallState';

interface Star {
  angle: number; // radial position around the singularity
  dist: number; // px from centre
  speed: number; // per-star infall rate multiplier
  size: number;
  baseAlpha: number;
  twinklePhase: number;
  layer: number; // 0 far / slow, 2 near / fast
}

const LAYER_SPEED = [0.35, 0.7, 1.15];

/**
 * The starfield behind everything — stars stream radially inward toward the
 * singularity, drifting slowly at rest and accelerating the deeper you fall
 * and the faster you scroll (`fallState`), stretching into streaks at speed.
 * A field of matter perpetually falling in. Static under reduced motion;
 * thinner on mobile, where the calm drift stands in for the scroll-driven fall.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let maxDist = Math.hypot(width, height) / 2 + 8;

    const count = isMobile ? 60 : 150;
    const stars: Star[] = Array.from({ length: count }, (_, i) => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * maxDist,
      speed: 0.6 + Math.random() * 0.8,
      size: 0.4 + Math.random() * 1.1,
      baseAlpha: 0.12 + Math.random() * 0.4,
      twinklePhase: Math.random() * Math.PI * 2,
      layer: i % 3,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      maxDist = Math.hypot(width, height) / 2 + 8;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let last = performance.now();

    const draw = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      const cx = width / 2;
      const cy = height / 2;
      // A slow perpetual drift, accelerating with fall depth + scroll speed.
      const pull = 18 + fallState.progress * 90 + fallState.velocity * 900;
      const streakK = fallState.velocity * 260;

      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!reducedMotion) {
          star.dist -= dt * pull * star.speed * LAYER_SPEED[star.layer];
          if (star.dist < 2) {
            star.dist = maxDist;
            star.angle = Math.random() * Math.PI * 2;
          }
        }
        const cos = Math.cos(star.angle);
        const sin = Math.sin(star.angle);
        const x = cx + cos * star.dist;
        const y = cy + sin * star.dist;
        if (x < -8 || x > width + 8 || y < -8 || y > height + 8) continue;

        // Brighter as it nears the hole; twinkling out of phase.
        const near = 1 - star.dist / maxDist;
        const twinkle = reducedMotion ? 1 : 0.72 + 0.28 * Math.sin(time * 0.0011 + star.twinklePhase);
        ctx.globalAlpha = Math.min(star.baseAlpha * twinkle * (0.7 + near * 0.8), 1);
        ctx.fillStyle = star.layer === 2 ? '#F3EFE6' : '#C9C4B8';

        const streak = streakK * star.speed * LAYER_SPEED[star.layer];
        if (streak > 3) {
          // Elongate away from the centre — the trail of infalling matter.
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = star.size;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + cos * streak, y + sin * streak);
          ctx.stroke();
        } else {
          ctx.fillRect(x, y, star.size, star.size);
        }
      }
      ctx.globalAlpha = 1;
    };

    if (reducedMotion) {
      draw(performance.now());
      return () => window.removeEventListener('resize', resize);
    }

    const tick = (time: number) => draw(time * 1000);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion, isMobile]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
