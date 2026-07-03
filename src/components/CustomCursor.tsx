import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor-hover], input, textarea';

/**
 * Small clay dot + an ink ring that lags slightly and grows over interactive
 * elements. Inside a `data-cursor="view|open|copy"` zone, the ring morphs
 * into a filled pill showing that label.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const setDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const setRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      setDot(e.clientX);
      setDotY(e.clientY);
      setRing(e.clientX);
      setRingY(e.clientY);
    };

    const showLabel = (text: string) => {
      label.textContent = text;
      ring.classList.add('cursor-ring--label');
      dot.style.opacity = '0';
    };
    const hideLabel = () => {
      ring.classList.remove('cursor-ring--label');
      dot.style.opacity = '';
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const zone = target.closest<HTMLElement>('[data-cursor]');
      if (zone) {
        showLabel(zone.dataset.cursor ?? '');
        return;
      }
      if (target.closest(INTERACTIVE_SELECTOR)) {
        ring.classList.add('cursor-ring--active');
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as Node | null;

      const zone = target.closest<HTMLElement>('[data-cursor]');
      if (zone) {
        if (!related || !zone.contains(related)) hideLabel();
        return;
      }
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (interactive && (!related || !interactive.contains(related))) {
        ring.classList.remove('cursor-ring--active');
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.body.style.cursor = '';
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-ring-label-text" />
      </div>
    </>
  );
}
