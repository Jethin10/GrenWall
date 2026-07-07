import { useState } from 'react';
import { SplitLines } from './SplitLines';

interface QA {
  q: string;
  a: string;
}

const ITEMS: QA[] = [
  {
    q: 'What kind of businesses do you work with?',
    a: 'Any business with repeatable work — agencies, clinics, e-commerce, real estate, professional services, manufacturers. If a process happens the same way twice a week, it is a candidate.',
  },
  {
    q: 'How do I know what to automate first?',
    a: 'That is the first thing we do together. An automation audit maps your operations, scores each process by time cost and complexity, and gives you an ordered list — you see the highest-return automation before we build anything.',
  },
  {
    q: 'Will this replace my team?',
    a: 'No — it replaces their busywork. The goal is that the people you already have spend their hours on judgment, relationships and growth instead of copy-paste.',
  },
  {
    q: 'What happens when the AI gets something wrong?',
    a: 'Every agent ships with guardrails: approval steps for sensitive actions, full logging, and escalation to a human when confidence is low. You decide how much autonomy it earns, and when.',
  },
  {
    q: 'Do you maintain what you build?',
    a: 'Yes. Automations live in a changing environment — tools update, processes drift. We monitor, maintain and extend everything we ship, so it keeps working after launch day.',
  },
  {
    q: 'How long does a build take?',
    a: 'A first automation typically goes live in weeks, not months. We deliberately start with a narrow, high-value process so you see it working early.',
  },
];

/**
 * FAQ as an accordion ledger — hairline rows, a mono plus that rotates to a
 * cross, answers that expand with a CSS grid-rows transition (no JS height
 * math to fight).
 */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-5 py-32 md:px-10 md:py-44">
      <div className="rule mb-6 flex items-center justify-between border-t pt-6">
        <SplitLines as="span" className="label-mono">
          FAQ
        </SplitLines>
        <span className="label-mono text-faint">05</span>
      </div>

      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-8">
        <SplitLines as="h2" className="text-h1 max-w-md text-[color:var(--fg)]">
          The questions everyone asks first.
        </SplitLines>

        <div>
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="rule border-t first:border-t-0">
                <button
                  type="button"
                  data-cursor-hover
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-h4 text-[color:var(--fg)]">{item.q}</span>
                  <span
                    className={`text-muted shrink-0 font-mono text-lg transition-transform duration-500 ease-out-cubic ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out-cubic ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-body text-muted max-w-xl pb-7 pr-10">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="rule border-t" />
        </div>
      </div>
    </section>
  );
}
