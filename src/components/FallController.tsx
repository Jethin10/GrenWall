import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useShowBlackHole } from '../lib/useShowBlackHole';
import { fallState } from '../lib/fallState';

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

/**
 * Drives the shared fall signal every frame: `fallState.progress` (0..1) from
 * the live scroll position over the full document, and a smoothed
 * `fallState.velocity` that rises with scroll speed and eases back at rest.
 *
 * Progress is read from `scrollY / (scrollHeight - innerHeight)` rather than a
 * ScrollTrigger's cached `end`, so it stays accurate even as the pinned
 * sections inject their spacers after mount (a cached end would saturate
 * progress to 1 well before the true bottom). Lenis drives the native scroll,
 * so reading `scrollY` here stays in sync with the smooth scroll.
 *
 * `scrollHeight` itself is only re-measured on resize and on ScrollTrigger's
 * own `refresh` event (fired whenever a pin/spacer changes document height) —
 * not on every tick, which would force a layout read 60 times a second.
 *
 * Renders nothing. Only runs on desktop + motion — otherwise the fall stays at
 * rest and every consumer falls back to calm.
 */
export function FallController() {
  const active = useShowBlackHole();

  useEffect(() => {
    if (!active) {
      fallState.progress = 0;
      fallState.velocity = 0;
      return;
    }

    let maxScroll = 0;
    const measure = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    window.addEventListener('resize', measure);
    ScrollTrigger.addEventListener('refresh', measure);

    let lastY = window.scrollY;
    let lastT = performance.now();

    const tick = () => {
      const y = window.scrollY;
      fallState.progress = maxScroll > 0 ? clamp01(y / maxScroll) : 0;

      const now = performance.now();
      const dt = Math.max((now - lastT) / 1000, 1 / 120);
      const speed = Math.abs(y - lastY) / dt; // px per second
      lastY = y;
      lastT = now;

      const impulse = clamp01(speed / 2600);
      // Ease toward the impulse — a smooth rise on fast scroll, a gentle settle.
      fallState.velocity += (impulse - fallState.velocity) * 0.14;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', measure);
      ScrollTrigger.removeEventListener('refresh', measure);
      fallState.progress = 0;
      fallState.velocity = 0;
    };
  }, [active]);

  return null;
}
