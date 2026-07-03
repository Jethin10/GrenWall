import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface RevealTextProps {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  /** Animate immediately (hero) instead of waiting for scroll into view. */
  immediate?: boolean;
  delay?: number;
}

/** Splits headline copy into masked lines that slide up into place, one after another. */
export function RevealText({ lines, as = 'h2', className = '', immediate = false, delay = 0 }: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const Tag = as;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll<HTMLElement>('.reveal-row');

    if (reducedMotion) {
      gsap.set(rows, { y: 0, opacity: 1 });
      return;
    }

    gsap.set(rows, { y: '110%', opacity: 0 });

    const anim = gsap.to(rows, {
      y: '0%',
      opacity: 1,
      duration: 1,
      ease: 'heavy',
      stagger: 0.09,
      delay,
      scrollTrigger: immediate
        ? undefined
        : {
            trigger: container,
            start: 'top 85%',
            once: true,
          },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [reducedMotion, immediate, delay]);

  return (
    <Tag ref={containerRef as never} className={className}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <span className="reveal-row inline-block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
