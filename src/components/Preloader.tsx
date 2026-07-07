import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

/**
 * The intro, reduced to almost nothing: an ink panel, the wordmark rising
 * through a mask, a mono counter ticking to 100 bottom-left, then the whole
 * panel lifts like a curtain with the heavy ease. ~1.8s. Skipped entirely
 * under reduced motion.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const done = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      if (!done.current) {
        done.current = true;
        onComplete();
      }
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        if (!done.current) {
          done.current = true;
          onComplete();
        }
      },
    });

    tl.set(root, { autoAlpha: 1 })
      .fromTo(markRef.current, { yPercent: 120 }, { yPercent: 0, duration: 0.9 }, 0.1)
      .to(
        counter,
        {
          value: 100,
          duration: 1.1,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
          },
        },
        0.15,
      )
      .to(markRef.current, { yPercent: -120, duration: 0.7 }, 1.35)
      .to(root, { yPercent: -100, duration: 1.0, ease: 'heavy' }, 1.5);

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[90] bg-ink opacity-0" aria-hidden="true">
      <div className="flex h-full items-center justify-center overflow-hidden">
        <span className="block overflow-hidden">
          <span
            ref={markRef}
            className="block text-bone"
            style={{ fontVariationSettings: "'opsz' 32, 'wght' 540", fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', letterSpacing: '-0.02em' }}
          >
            Grenwall<sup className="align-super text-[0.5em]">®</sup>
          </span>
        </span>
      </div>
      <div className="absolute bottom-8 left-8 flex items-baseline gap-3">
        <span ref={counterRef} className="font-mono text-sm tabular-nums text-bone">
          000
        </span>
        <span className="label-mono">Loading</span>
      </div>
    </div>
  );
}
