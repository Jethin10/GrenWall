import { ArrowUpRight } from 'lucide-react';
import { SplitLines } from './SplitLines';
import { MagneticButton } from './MagneticButton';
import { ClickToCopy } from './ClickToCopy';
import { links } from '../tokens';

/**
 * The close: one oversized invitation, one pill, one phone number. The most
 * whitespace on the page lives here on purpose.
 */
export function CTA() {
  return (
    <section id="contact" className="flex min-h-[90svh] flex-col justify-center px-5 py-32 md:px-10 md:py-44">
      <span className="label-mono">Start</span>

      <SplitLines as="h2" className="text-display mt-8 max-w-6xl text-[color:var(--fg)]">
        Stop repeating yourself.
      </SplitLines>

      <p className="text-body text-muted mt-10 max-w-md">
        Tell us what your week looks like. We&rsquo;ll tell you which parts of it
        never need to happen again.
      </p>

      <div className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
        <MagneticButton href={links.whatsapp} className="cta-pill">
          Start a project
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </MagneticButton>
        <ClickToCopy value={links.whatsappPhoneDisplay} />
      </div>
    </section>
  );
}
