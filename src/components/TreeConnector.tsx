import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

const EMBER = '#D8823A';
const LINE = '#202024';

const PATHS = ['M60 70 C 60 50, 30 45, 22 20', 'M60 70 C 60 50, 60 45, 60 15', 'M60 70 C 60 50, 90 45, 98 20'];

/**
 * A recurring, ambient version of the capability grid's branching tree —
 * threaded between sections so the site reads as one connected system.
 * Idle and calm: an occasional dot drifts up one branch, then rests.
 */
export function TreeConnector() {
  const dotRef = useRef<SVGCircleElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const dot = dotRef.current;
    if (!dot) return;

    let cancelled = false;
    let pending: gsap.core.Tween | null = null;

    function cycle() {
      if (cancelled) return;
      const pathEl = pathRefs.current[Math.floor(Math.random() * PATHS.length)];
      if (!pathEl) return;
      const length = pathEl.getTotalLength();
      const proxy = { t: 0 };

      gsap.set(dot, { opacity: 1 });
      pending = gsap.to(proxy, {
        t: 1,
        duration: 1.6,
        ease: 'power1.inOut',
        onUpdate: () => {
          const pt = pathEl.getPointAtLength(length * proxy.t);
          gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
        },
        onComplete: () => {
          gsap.to(dot, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              if (!cancelled) pending = gsap.delayedCall(1.5, cycle);
            },
          });
        },
      });
    }

    pending = gsap.delayedCall(0.8, cycle);

    return () => {
      cancelled = true;
      pending?.kill();
      gsap.killTweensOf(dot);
    };
  }, [reducedMotion]);

  return (
    <div className="flex justify-center py-8" aria-hidden="true">
      <svg viewBox="0 0 120 80" className="h-16 w-32">
        <circle cx="60" cy="70" r="3" fill={LINE} />
        {PATHS.map((d, i) => (
          <path
            key={d}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke={LINE}
            strokeWidth="1.2"
          />
        ))}
        <circle cx="22" cy="20" r="2.5" fill="none" stroke={LINE} strokeWidth="1.2" />
        <circle cx="60" cy="15" r="2.5" fill="none" stroke={LINE} strokeWidth="1.2" />
        <circle cx="98" cy="20" r="2.5" fill="none" stroke={LINE} strokeWidth="1.2" />
        {!reducedMotion && <circle ref={dotRef} r="2.5" fill={EMBER} opacity="0" />}
      </svg>
    </div>
  );
}
