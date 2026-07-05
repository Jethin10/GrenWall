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

const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/#_';

function scrambleAt(target: string, progress: number): string {
  // Characters left of the lock front are final; the rest still cycle.
  const lockFront = Math.floor(progress * (target.length + 3));
  let out = '';
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (i < lockFront || ch === ' ' || ch === '.' || ch === ',' || ch === '—') {
      out += ch;
    } else {
      out += SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
    }
  }
  return out;
}

/**
 * Headline entrance: masked lines slide up while their letters cycle
 * through a scramble and lock into place left-to-right — the decode
 * entrance, staggered line by line.
 */
export function RevealText({ lines, as = 'h2', className = '', immediate = false, delay = 0 }: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const Tag = as;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = Array.from(container.querySelectorAll<HTMLElement>('.reveal-row'));

    if (reducedMotion) {
      gsap.set(rows, { y: 0, opacity: 1 });
      rows.forEach((row, i) => {
        row.textContent = lines[i] ?? row.textContent;
      });
      return;
    }

    gsap.set(rows, { y: '110%', opacity: 0 });

    const tweens: gsap.core.Tween[] = [];

    const slide = gsap.to(rows, {
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
      onStart: () => {
        rows.forEach((row, i) => {
          const target = lines[i] ?? '';
          const state = { p: 0 };
          tweens.push(
            gsap.to(state, {
              p: 1,
              duration: 0.7,
              delay: i * 0.09,
              ease: 'power2.out',
              onUpdate: () => {
                row.textContent = scrambleAt(target, state.p);
              },
              onComplete: () => {
                row.textContent = target;
              },
            }),
          );
        });
      },
    });

    return () => {
      slide.scrollTrigger?.kill();
      slide.kill();
      tweens.forEach((t) => t.kill());
      rows.forEach((row, i) => {
        row.textContent = lines[i] ?? row.textContent;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
