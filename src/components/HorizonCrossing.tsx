import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useShowBlackHole } from '../lib/useShowBlackHole';
import { fallState } from '../lib/fallState';

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

/**
 * The ending is the event horizon. As the fall crosses into the last stretch
 * of the page, a bright flash swells and passes (the crossing-over), while
 * the closing CTA (`#ending-content`) starts warped — scaled up and blurred,
 * still on the far side — and resolves crisp once we're through. Driven off
 * the shared fall progress so it stays locked to depth. Desktop + motion only.
 */
export function HorizonCrossing() {
  const flashRef = useRef<HTMLDivElement>(null);
  const active = useShowBlackHole();

  useEffect(() => {
    if (!active) return;

    // Looked up once — this element never remounts, so re-querying it every
    // frame would just be an avoidable DOM lookup 60 times a second.
    const ending = document.getElementById('ending-content');

    const tick = () => {
      const p = fallState.progress;
      const flash = flashRef.current;

      // Crossing the horizon: a brief blackout swells and passes as we go
      // through — a dark beat that reads clearly against the blazing disk,
      // peaking just as the ending scrolls in.
      const cross = clamp01((p - 0.82) / 0.16);
      if (flash) flash.style.opacity = String(Math.sin(cross * Math.PI) * 0.96);

      // The CTA resolves from the far side, crisp only once we're through.
      if (ending) {
        const reveal = clamp01((p - 0.88) / 0.1);
        ending.style.filter = reveal < 1 ? `blur(${(1 - reveal) * 9}px)` : '';
        ending.style.opacity = String(0.25 + reveal * 0.75);
        ending.style.transform = `scale(${1.07 - reveal * 0.07})`;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      if (ending) {
        ending.style.filter = '';
        ending.style.opacity = '';
        ending.style.transform = '';
      }
    };
  }, [active]);

  return (
    <div
      ref={flashRef}
      className="pointer-events-none fixed inset-0 z-[60] opacity-0"
      style={{
        // A dark veil that swells inward from the edges and swallows the frame
        // as we pass through the event horizon, then clears to the resolved CTA
        // on the other side — a readable beat against the blazing disk.
        background:
          'radial-gradient(circle at 50% 46%, rgba(5,5,6,0.35) 0%, rgba(5,5,6,0.9) 55%, rgba(5,5,6,1) 100%)',
      }}
      aria-hidden="true"
    />
  );
}
