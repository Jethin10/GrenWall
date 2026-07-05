import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

/** A quiet, recurring blueprint hairline — a dimension line with crop ticks at each end, drawing itself in as it drifts past at its own scroll speed. */
export function CropMarkDivider() {
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const line = lineRef.current;
    if (!line) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0.6 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top bottom',
            end: 'bottom center',
            scrub: true,
          },
        },
      );
    }, line);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="py-6" aria-hidden="true">
      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={lineRef} className="h-px w-full origin-center bg-line" />
        <div className="absolute left-6 top-1/2 h-3 w-px -translate-y-1/2 bg-line" />
        <div className="absolute right-6 top-1/2 h-3 w-px -translate-y-1/2 bg-line" />
      </div>
    </div>
  );
}
