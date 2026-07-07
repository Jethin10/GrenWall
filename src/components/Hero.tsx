import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { links } from '../tokens';

interface HeroProps {
  introDone: boolean;
}

/**
 * Full-viewport opening statement. The motto is the headline — two masked
 * lines rising after the preloader curtain lifts, a quiet subline, and a
 * meta row pinned to the bottom edge. No imagery: the emptiness is the
 * design.
 */
export function Hero({ introDone }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const restRefs = useRef<(HTMLElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean) as HTMLElement[];
    const rest = restRefs.current.filter(Boolean) as HTMLElement[];

    if (reducedMotion) {
      gsap.set([...lines, ...rest], { yPercent: 0, y: 0, opacity: 1 });
      return;
    }

    if (!introDone) {
      gsap.set(lines, { yPercent: 115 });
      gsap.set(rest, { opacity: 0, y: 14 });
      return;
    }

    const tl = gsap.timeline();
    tl.to(lines, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0).to(
      rest,
      { opacity: 1, y: 0, duration: 1, stagger: 0.08 },
      0.55,
    );

    return () => {
      tl.kill();
    };
  }, [introDone, reducedMotion]);

  // Slow parallax out as you leave the hero — content drifts up and dims.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-hero-inner]', {
        yPercent: -10,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom 25%',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const setLineRef = (i: number) => (el: HTMLSpanElement | null) => {
    lineRefs.current[i] = el;
  };
  const setRestRef = (i: number) => (el: HTMLElement | null) => {
    restRefs.current[i] = el;
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden"
    >
      <div
        data-hero-inner
        className="flex min-h-[100svh] w-full flex-col justify-between px-5 pb-8 pt-24 md:px-10 md:pt-28"
      >
        {/* Eyebrow row */}
        <div ref={setRestRef(0)} className="flex items-center justify-between" style={{ opacity: 0 }}>
          <span className="label-mono">AI Automation Studio</span>
          <span className="label-mono hidden md:inline">Agents &amp; Workflows</span>
        </div>

        {/* The statement */}
        <div className="py-14">
          <h1 className="text-display text-[color:var(--fg)]">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span ref={setLineRef(0)} className="block">
                If the work repeats,
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span ref={setLineRef(1)} className="text-faint block">
                it can be automated.
              </span>
            </span>
          </h1>

          <p ref={setRestRef(1)} className="text-body text-muted mt-10 max-w-md" style={{ opacity: 0 }}>
            Grenwall designs and builds AI agents and automations that take the
            repetitive work off your team&rsquo;s hands — for any business, at any
            scale.
          </p>
        </div>

        {/* Bottom meta row */}
        <div ref={setRestRef(2)} className="rule flex items-end justify-between border-t pt-6" style={{ opacity: 0 }}>
          <span className="label-mono">Working worldwide</span>
          <a
            href="#problem"
            data-cursor-hover
            className="label-mono inline-flex items-center gap-2"
            aria-label="Scroll to next section"
          >
            Scroll
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          </a>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="label-mono link-line hidden md:inline"
          >
            {links.whatsappPhoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
