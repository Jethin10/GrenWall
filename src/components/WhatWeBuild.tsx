import { useEffect, useRef } from 'react';
import { Bot, BarChart3, Workflow as WorkflowIcon, type LucideIcon } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useIsMobile } from '../lib/useIsMobile';
import { RevealText } from './RevealText';
import { TiltCard } from './TiltCard';
import { AgentMark } from './AgentMark';
import { ClipReveal } from './ClipReveal';

interface Offer {
  icon: LucideIcon;
  title: string;
  copy: string;
}

const OFFERS: Offer[] = [
  {
    icon: Bot,
    title: 'AI agents',
    copy: 'Agents that make the call, not just the click.',
  },
  {
    icon: WorkflowIcon,
    title: 'Workflow automation',
    copy: 'The busywork disappears — no copy-paste, no reminders, no chasing.',
  },
  {
    icon: BarChart3,
    title: 'Business intelligence dashboards',
    copy: 'Your numbers, in one place, updated without anyone asking.',
  },
];

const MUTED = '#5F5F5C';
const EMBER = '#D8823A';

/**
 * The trio advances one at a time as you scroll — pinned in place while a
 * scrubbed GSAP timeline crossfades between them, Podium's "pin + advance"
 * move — rather than three cards revealed together and left behind.
 */
export function WhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const pinned = !reducedMotion && !isMobile;

  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(panelRefs.current.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(dotRefs.current.slice(1), { color: MUTED });
      if (dotRefs.current[0]) gsap.set(dotRefs.current[0], { color: EMBER });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
        },
      });

      tl.to(panelRefs.current[0], { autoAlpha: 0, y: -24, duration: 0.3 }, 1)
        .to(panelRefs.current[1], { autoAlpha: 1, y: 0, duration: 0.3 }, 1)
        .to(dotRefs.current[0], { color: MUTED, duration: 0.3 }, 1)
        .to(dotRefs.current[1], { color: EMBER, duration: 0.3 }, 1)
        .to(panelRefs.current[1], { autoAlpha: 0, y: -24, duration: 0.3 }, 2)
        .to(panelRefs.current[2], { autoAlpha: 1, y: 0, duration: 0.3 }, 2)
        .to(dotRefs.current[1], { color: MUTED, duration: 0.3 }, 2)
        .to(dotRefs.current[2], { color: EMBER, duration: 0.3 }, 2);
    }, section);

    return () => ctx.revert();
  }, [pinned]);

  return (
    <section ref={sectionRef} id="what-we-build" className="relative bg-void px-6 py-24 md:py-32">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center">
        <div className="mb-5 flex items-center">
          <AgentMark />
          <div className="label-mono">01 — What we build</div>
        </div>
        <RevealText
          as="h2"
          lines={['Three things.', 'Done properly.']}
          className="max-w-2xl font-display text-4xl text-bone md:text-5xl"
        />

        {pinned ? (
          <div className="relative mt-16 min-h-[22rem]">
            <div className="mb-8 flex items-center gap-4">
              {OFFERS.map((offer, i) => (
                <span
                  key={offer.title}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="label-mono"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              ))}
            </div>
            {OFFERS.map((offer, i) => (
              <div
                key={offer.title}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-8 max-w-2xl"
              >
                <offer.icon className="h-10 w-10 text-ember" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-6 font-display text-3xl text-bone md:text-5xl">{offer.title}</h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted md:text-lg">{offer.copy}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
            {OFFERS.map((offer, i) => (
              <ClipReveal key={offer.title} delay={i * 0.1}>
                <TiltCard
                  dataCursor="view"
                  className="group relative h-full rounded-2xl border border-line bg-surface p-8 transition-shadow duration-300 hover:shadow-[0_18px_40px_-16px_rgba(216,130,58,0.2)]"
                >
                  <offer.icon className="h-7 w-7 text-ember" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-6 font-display text-xl text-bone md:text-2xl">{offer.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{offer.copy}</p>
                  <div className="mt-7 h-px w-full bg-gradient-to-r from-ember via-ember/50 to-transparent opacity-60 transition-opacity duration-500 motion-safe:animate-pulse group-hover:opacity-100" />
                </TiltCard>
              </ClipReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
