import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap, SplitText } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface SplitLinesProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  className?: string;
  /** Animate immediately (hero, after preloader) instead of on scroll. */
  immediate?: boolean;
  delay?: number;
  stagger?: number;
}

/**
 * The house text entrance: SplitText breaks the element into lines, each
 * wrapped in an overflow mask, and the lines rise from below with the heavy
 * ease. No scramble, no blur — one quiet move, used everywhere.
 */
export function SplitLines({
  children,
  as = 'div',
  className = '',
  immediate = false,
  delay = 0,
  stagger = 0.08,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const Tag = as;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    let tween: gsap.core.Tween | undefined;
    const split = SplitText.create(el, {
      type: 'lines',
      linesClass: 'split-line',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => {
        tween = gsap.fromTo(
          self.lines,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            stagger,
            delay,
            ease: 'heavy',
            scrollTrigger: immediate
              ? undefined
              : { trigger: el, start: 'top 88%', once: true },
          },
        );
        return tween;
      },
    });

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split.revert();
    };
  }, [reducedMotion, immediate, delay, stagger]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
