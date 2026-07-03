import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wipes content in via clip-path + a slight upward move as it scrolls into
 * view (not a fade). GSAP-driven — Framer Motion's `whileInView` doesn't
 * reliably animate `clipPath` in this stack, so scroll-triggered clip-path
 * reveals go through GSAP/ScrollTrigger instead, same as the preloader's
 * curtain wipe.
 */
export function ClipReveal({ children, className = '', delay = 0 }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', y: 0 });
      return;
    }

    gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)', y: 24 });
    const anim = gsap.to(el, {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      duration: 0.8,
      delay,
      ease: 'heavy',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === el)
        .forEach((st) => st.kill());
      anim.kill();
    };
  }, [reducedMotion, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
