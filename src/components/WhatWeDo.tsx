import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { SplitLines } from './SplitLines';
import { links } from '../tokens';

interface Service {
  index: string;
  title: string;
  detail: string;
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Custom AI agents',
    detail: 'Autonomous agents that reason, decide and act inside your tools.',
  },
  {
    index: '02',
    title: 'Workflow automation',
    detail: 'Multi-step processes wired end to end — no copy-paste, no chasing.',
  },
  {
    index: '03',
    title: 'System integrations',
    detail: 'Your CRM, inbox, sheets and stack, finally talking to each other.',
  },
  {
    index: '04',
    title: 'AI chat & voice',
    detail: 'Assistants that hold a real conversation with customers, 24/7.',
  },
  {
    index: '05',
    title: 'Automation audits',
    detail: 'We map your operations and show you exactly what to automate first.',
  },
];

/**
 * Services as a ledger: full-width rows, mono indices, hairline dividers.
 * Rows reveal on scroll; on hover the row brightens and its arrow steps in
 * from the edge.
 */
export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-service-row]').forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: { trigger: row, start: 'top 90%', once: true },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="services" className="px-5 py-32 md:px-10 md:py-44">
      <div className="rule mb-6 flex items-center justify-between border-t pt-6">
        <SplitLines as="span" className="label-mono">
          Services
        </SplitLines>
        <span className="label-mono text-faint">03</span>
      </div>

      <SplitLines as="h2" className="text-h1 max-w-3xl text-[color:var(--fg)]">
        One studio for the whole automation stack.
      </SplitLines>

      <div className="mt-16">
        {SERVICES.map((service) => (
          <a
            key={service.index}
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-service-row
            data-cursor-hover
            className="rule group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-t py-7 transition-colors duration-300 md:grid-cols-[4rem_1fr_1fr_auto] md:py-9"
          >
            <span className="label-mono text-faint">{service.index}</span>
            <h3 className="text-h2 text-muted transition-colors duration-300 group-hover:text-[color:var(--fg)]">
              {service.title}
            </h3>
            <p className="text-body text-faint hidden max-w-sm transition-colors duration-300 group-hover:text-[color:var(--fg-muted)] md:block">
              {service.detail}
            </p>
            <ArrowUpRight
              className="text-faint h-5 w-5 -translate-x-2 opacity-0 transition-all duration-300 ease-out-cubic group-hover:translate-x-0 group-hover:text-[color:var(--fg)] group-hover:opacity-100"
              aria-hidden="true"
            />
          </a>
        ))}
        <div className="rule border-t" />
      </div>
    </section>
  );
}
