import { ThemeSection } from './ThemeSection';
import { SplitLines } from './SplitLines';

interface BuildItem {
  index: string;
  title: string;
  description: string;
  tags: string[];
}

const ITEMS: BuildItem[] = [
  {
    index: '01',
    title: 'Support agents',
    description:
      'AI agents that answer customer questions in your voice, resolve the routine tickets outright, and hand the rest to your team with full context attached.',
    tags: ['Chat', 'Email', 'Voice'],
  },
  {
    index: '02',
    title: 'Lead & intake agents',
    description:
      'Every enquiry answered in seconds, qualified against your criteria, booked into your calendar — so no lead goes cold waiting for a reply.',
    tags: ['Qualification', 'Scheduling', 'CRM'],
  },
  {
    index: '03',
    title: 'Operations automation',
    description:
      'Invoices raised, orders synced, reports compiled, records reconciled. The back-office work that eats your week, running quietly on schedule.',
    tags: ['Invoicing', 'Reporting', 'Data sync'],
  },
  {
    index: '04',
    title: 'Custom workflows',
    description:
      'Whatever repeats inside your business — we map the process end to end and build an automation shaped exactly to how you already work.',
    tags: ['Bespoke', 'Integrations', 'Your stack'],
  },
];

/**
 * The proof section — and the page's theme flip: as it takes the viewport
 * the whole site crossfades to paper. Typographic cards, no imagery; each
 * one is a thing Grenwall builds.
 */
export function WhatWeBuild() {
  return (
    <ThemeSection theme="light" id="work" className="px-5 py-32 md:px-10 md:py-44">
      <div className="rule mb-6 flex items-center justify-between border-t pt-6">
        <SplitLines as="span" className="label-mono">
          What we build
        </SplitLines>
        <span className="label-mono text-faint">02</span>
      </div>

      <SplitLines as="h2" className="text-h1 max-w-4xl text-[color:var(--fg)]">
        Agents and automations, built around the way you already work.
      </SplitLines>

      <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2">
        {ITEMS.map((item) => (
          <article
            key={item.index}
            data-cursor-hover
            className="bg-theme-surface group flex min-h-[20rem] flex-col justify-between rounded-sm p-7 transition-transform duration-500 ease-out-cubic hover:-translate-y-1 md:min-h-[24rem] md:p-9"
          >
            <div className="flex items-start justify-between">
              <span className="label-mono">{item.index}</span>
              <div className="flex flex-wrap justify-end gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="label-mono rule rounded-full border px-2.5 py-1.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-h2 text-[color:var(--fg)]">{item.title}</h3>
              <p className="text-body text-muted mt-4 max-w-md">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </ThemeSection>
  );
}
