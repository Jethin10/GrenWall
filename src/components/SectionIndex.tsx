import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

const SECTIONS = [
  { id: 'hero', index: '00' },
  { id: 'what-we-build', index: '01' },
  { id: 'capability', index: '02' },
  { id: 'what-we-do', index: '03' },
  { id: 'why-grenwall', index: '04' },
  { id: 'contact', index: '05' },
];

/**
 * The editorial "system" chrome both references share: a running scroll
 * progress marker on a thin rail, and the current section's big index
 * number, flipping in as each section takes over.
 */
export function SectionIndex() {
  const reducedMotion = useReducedMotion();
  const numberRef = useRef<HTMLSpanElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState('00');

  useEffect(() => {
    if (reducedMotion) return;
    const triggers: ScrollTrigger[] = [];

    SECTIONS.forEach(({ id, index }) => {
      const el = document.getElementById(id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setCurrent(index),
          onEnterBack: () => setCurrent(index),
        }),
      );
    });

    triggers.push(
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          if (markerRef.current) gsap.set(markerRef.current, { top: `${self.progress * 100}%` });
          if (percentRef.current) percentRef.current.textContent = `${Math.round(self.progress * 100)}%`;
        },
      }),
    );

    return () => triggers.forEach((t) => t.kill());
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !numberRef.current) return;
    gsap.fromTo(numberRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'heavy' });
  }, [current, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
      aria-hidden="true"
    >
      <span ref={numberRef} className="label-mono text-ember">
        {current}
      </span>
      <div className="relative h-40 w-px bg-line">
        <div
          ref={markerRef}
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
        />
      </div>
      <span className="label-mono">05</span>
      <span ref={percentRef} className="label-mono tabular-nums text-muted">
        0%
      </span>
    </div>
  );
}
