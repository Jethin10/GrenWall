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

const MUTED = '#5C5C58';
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
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const pinned = !reducedMotion && !isMobile;

  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(panelRefs.current.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(numeralRefs.current.slice(1), { autoAlpha: 0, y: 60 });
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

      const swap = (from: number, to: number, at: number) => {
        tl.to(panelRefs.current[from], { autoAlpha: 0, y: -24, duration: 0.3 }, at)
          .to(panelRefs.current[to], { autoAlpha: 1, y: 0, duration: 0.3 }, at)
          .to(numeralRefs.current[from], { autoAlpha: 0, y: -60, duration: 0.3 }, at)
          .to(numeralRefs.current[to], { autoAlpha: 1, y: 0, duration: 0.3 }, at)
          .to(dotRefs.current[from], { color: MUTED, duration: 0.3 }, at)
          .to(dotRefs.current[to], { color: EMBER, duration: 0.3 }, at);
      };
      swap(0, 1, 1);
      swap(1, 2, 2);
    }, section);

    return () => ctx.revert();
  }, [pinned]);

  return (
    <section
      ref={sectionRef}
      id="what-we-build"
      className={`relative px-6 py-24 md:py-32 ${pinned ? 'flex min-h-[100svh] flex-col justify-center overflow-hidden' : ''}`}
    >
      {/* Mostly a safety net: the fall curve keeps the disk dim through most
          of the page, but a fast scroll here can still spike its brightness
          momentarily, so a soft scrim keeps the (left-aligned) copy readable. */}
      {pinned && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 78% 75% at 38% 52%, rgba(5,5,6,0.55), rgba(5,5,6,0.2) 55%, transparent 85%)',
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
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
          <div className="relative mt-14 min-h-[24rem]">
            {/* Giant ghost numeral — the section's own backdrop, one per offer */}
            {OFFERS.map((offer, i) => (
              <span
                key={`numeral-${offer.title}`}
                ref={(el) => {
                  numeralRefs.current[i] = el;
                }}
                className="pointer-events-none absolute -top-10 right-0 z-0 select-none font-display text-[16rem] leading-none text-line md:text-[20rem]"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}

            <div className="relative z-10 mb-8 flex items-center gap-4">
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
                className="absolute inset-x-0 top-8 z-10 max-w-3xl"
              >
                <offer.icon className="h-12 w-12 text-ember" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-6 font-display text-4xl text-bone md:text-7xl">{offer.title}</h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted md:text-xl">{offer.copy}</p>
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
