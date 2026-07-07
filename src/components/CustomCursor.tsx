import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor-hover], input, textarea';

/**
 * One dot, nothing else. It grows and fades to a soft disc over interactive
 * elements; color follows the active theme via the --fg custom property.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const setX = gsap.quickTo(dot, 'x', { duration: 0.16, ease: 'power3.out' });
    const setY = gsap.quickTo(dot, 'y', { duration: 0.16, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
        dot.classList.add('cursor-dot--active');
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as Node | null;
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (interactive && (!related || !interactive.contains(related))) {
        dot.classList.remove('cursor-dot--active');
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}
