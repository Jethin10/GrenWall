import { motion } from 'framer-motion';
import { RevealText } from './RevealText';
import { AgentMark } from './AgentMark';
import { ClipReveal } from './ClipReveal';
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
    <section id="what-we-do" className="relative bg-void">
      <div className="px-6 pb-16 pt-24 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <ClipReveal>
            <div className="mb-5 flex items-center">
              <AgentMark />
              <div className="label-mono">03 — What we automate</div>
            </div>
            <RevealText
              as="h2"
              lines={['What we automate.']}
              className="max-w-2xl font-display text-4xl text-bone md:text-5xl"
            />
          </ClipReveal>

          <ul className="mt-16">
            {LINES.map((line, i) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-baseline gap-6 border-t border-line py-5 transition-all duration-300 hover:pl-3 last:border-b"
              >
                <span className="label-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-2xl text-bone transition-colors duration-300 group-hover:text-ember sm:text-3xl md:text-4xl">
                  {line}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <Marquee text="AI AGENTS • WORKFLOW AUTOMATION • BUSINESS INTELLIGENCE •" />
    </section>
  );
}
