import { RevealText } from './RevealText';
import { AgentMark } from './AgentMark';
import { GravityReveal } from './GravityReveal';
import { Marquee } from './Marquee';

const LINES = [
  'Invoicing',
  'Follow-ups',
  'Reporting',
  'Scheduling',
  'Onboarding',
  'Reconciliation',
  'Lead routing',
  'Data entry',
];

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative">
      {/* A soft scrim dims the black hole behind this text-dense block so the
          list stays legible; it fades to nothing at the edges, letting the
          disk glow through between sections. */}
      <div
        className="relative px-6 pb-16 pt-24 md:pt-32"
        style={{
          background:
            'radial-gradient(ellipse 96% 92% at 50% 50%, rgba(5,5,6,0.92), rgba(5,5,6,0.6) 54%, rgba(5,5,6,0.15) 82%, transparent)',
        }}
      >
        <div className="mx-auto max-w-6xl">
          <GravityReveal>
            <div className="mb-5 flex items-center">
              <AgentMark />
              <div className="label-mono">03 — What we automate</div>
            </div>
            <RevealText
              as="h2"
              lines={['What we automate.']}
              className="max-w-2xl font-display text-4xl text-bone md:text-5xl"
            />
          </GravityReveal>

          <ul className="mt-16">
            {LINES.map((line, i) => (
              <li
                key={line}
                className="group border-t border-line transition-all duration-300 hover:pl-3 last:border-b"
              >
                <GravityReveal strength={1.15} className="flex items-baseline gap-6 py-5">
                  <span className="label-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-2xl text-bone transition-colors duration-300 group-hover:text-ember sm:text-3xl md:text-4xl">
                    {line}
                  </span>
                </GravityReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Marquee text="AI AGENTS • WORKFLOW AUTOMATION • BUSINESS INTELLIGENCE •" />
    </section>
  );
}
