import { HighlightText } from './HighlightText';
import { SplitLines } from './SplitLines';

const MANIFESTO =
  'Most teams spend their best hours on work that never changes: chasing follow-ups, moving data between tools, answering the same questions, filing the same reports. That time never comes back. We build AI agents that take the repeatable work and run it — reliably, around the clock — so your people can do the work only people can do.';

/**
 * The manifesto — the one place the site talks in full sentences. The
 * paragraph brightens word by word, scrubbed to the scrollbar, so the
 * argument assembles itself as you read.
 */
export function Manifesto() {
  return (
    <section id="problem" className="px-5 py-32 md:px-10 md:py-44">
      <div className="rule mb-14 flex items-center justify-between border-t pt-6">
        <SplitLines as="span" className="label-mono">
          The problem
        </SplitLines>
        <span className="label-mono text-faint">01</span>
      </div>

      <div className="max-w-5xl">
        <HighlightText text={MANIFESTO} className="text-h1" />
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {[
          {
            k: 'Always on',
            v: 'Agents work 24/7 — no queues, no handoffs, no Mondays.',
          },
          {
            k: 'Any business',
            v: 'From solo operators to enterprise ops — if it repeats, it qualifies.',
          },
          {
            k: 'End to end',
            v: 'We map, build, deploy and maintain. You just approve the output.',
          },
        ].map((item) => (
          <div key={item.k} className="rule border-t pt-5">
            <span className="label-mono">{item.k}</span>
            <p className="text-body text-muted mt-3 max-w-xs">{item.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
