import { useLayoutEffect, useRef } from 'react';
import { gsap, SplitText } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface HighlightTextProps {
  text: string;
  className?: string;
}

/**
 * The scrubbed manifesto paragraph: every word starts at the faint gray and
 * brightens to full foreground as it crosses the middle of the viewport.
 * Scroll position drives it directly (scrub), so it reads as deliberate
 * rather than triggered.
 */
export function HighlightText({ text, className = '' }: HighlightTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    let tween: gsap.core.Tween | undefined;
    const split = SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) => {
        tween = gsap.fromTo(
          self.words,
          { color: 'var(--fg-faint)' },
          {
            color: 'var(--fg)',
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 78%',
              end: 'bottom 45%',
              scrub: 0.4,
            },
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
  }, [reducedMotion]);

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
