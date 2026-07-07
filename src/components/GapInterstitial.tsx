import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

/**
 * The interstitial statement: two display lines slide in from opposite
 * sides, scrubbed to scroll, between hairline rules with corner ticks —
 * a beat of pure typography between the argument and the proof.
 */
export function GapInterstitial() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const st = {
        trigger: section,
        start: 'top 85%',
        end: 'center 45%',
        scrub: 0.5,
      };
      gsap.fromTo('[data-gap-left]', { xPercent: -22 }, { xPercent: 0, ease: 'none', scrollTrigger: st });
      gsap.fromTo('[data-gap-right]', { xPercent: 22 }, { xPercent: 0, ease: 'none', scrollTrigger: st });
      gsap.fromTo(
        '[data-gap-rule]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          stagger: 0.12,
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const tick = (
    <span className="bg-[color:var(--fg-faint)] block h-1.5 w-1.5 shrink-0" aria-hidden="true" />
  );

  return (
    <section ref={sectionRef} className="overflow-hidden px-5 py-32 md:px-10 md:py-48" aria-label="We automate the repeatable">
      <div className="flex items-center gap-4">
        {tick}
        <div data-gap-rule className="bg-[color:var(--rule)] h-px w-full origin-left" />
        {tick}
      </div>

      <div className="py-12 md:py-16">
        <h2 className="text-display text-[color:var(--fg)]">
          <span data-gap-left className="block will-change-transform">
            We automate
          </span>
          <span data-gap-right className="text-faint block text-right will-change-transform">
            the repeatable.
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {tick}
        <div data-gap-rule className="bg-[color:var(--rule)] h-px w-full origin-left" />
        {tick}
      </div>
    </section>
  );
}
