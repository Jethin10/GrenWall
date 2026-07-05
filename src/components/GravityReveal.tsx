import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useIsMobile } from '../lib/useIsMobile';

interface GravityRevealProps {
  children: ReactNode;
  className?: string;
  /** Scales the strength of the pull + stretch. */
  strength?: number;
}

/**
 * Content enters on a gravitational curve: it starts pulled toward the
 * singularity column and stretched (a subtle spaghettification hint), then
 * settles into place for reading. Scrubbed off scroll so the pull is *felt*
 * as the block nears the hole, not merely triggered once. Falls back to a
 * calm fade-up on mobile and to static, fully-readable content under reduced
 * motion.
 */
export function GravityReveal({ children, className, strength = 1 }: GravityRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) return; // static, fully readable

    if (isMobile) {
      const anim = gsap.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'heavy', scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
      );
      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    }

    // Bend toward the vertical centreline (the singularity), captured once —
    // blocks don't move horizontally as they scroll.
    const rect = el.getBoundingClientRect();
    const dir = window.innerWidth / 2 - (rect.left + rect.width / 2) >= 0 ? 1 : -1;

    const anim = gsap.fromTo(
      el,
      {
        autoAlpha: 0,
        y: 64 * strength,
        x: `${dir * 5 * strength}vw`,
        scaleX: 1 - 0.08 * strength,
        scaleY: 1 + 0.16 * strength,
        rotate: dir * -3 * strength,
        transformOrigin: '50% 50%',
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 46%', scrub: 0.6 },
      },
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [reducedMotion, isMobile, strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
