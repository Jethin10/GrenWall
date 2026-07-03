import { RevealText } from './RevealText';
import { MagneticButton } from './MagneticButton';
import { ClickToCopy } from './ClickToCopy';
import { AgentMark } from './AgentMark';
import { CropFrame } from './CropFrame';
import { LiveClock } from './LiveClock';
import { Monogram } from './Monogram';
import { useShowCrystal } from '../lib/useShowCrystal';
import { links } from '../tokens';

export function CTA() {
  const showCrystal = useShowCrystal();
  return (
    <section id="contact" className="relative overflow-hidden bg-void px-6 py-32 md:py-48">
      <CropFrame />
      <div className="pointer-events-none absolute inset-0 bg-ember-radial opacity-30" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-8 flex items-center">
          <AgentMark />
          <div className="label-mono">05 — Contact</div>
        </div>

        <div
          id="ending-crystal-anchor"
          className="flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80 md:h-96 md:w-96"
          aria-hidden="true"
        >
          {!showCrystal && <Monogram className="h-1/2 w-1/2 text-bone" />}
        </div>

        <RevealText
          as="h2"
          lines={['Ready when', 'you are.']}
          className="mt-2 max-w-2xl font-display text-4xl leading-[1.05] text-bone md:text-6xl"
        />

        <MagneticButton
          href={links.whatsapp}
          variant="text"
          className="mt-12 inline-flex items-center gap-4 font-display text-[clamp(2.5rem,9vw,7rem)] uppercase leading-none tracking-tight text-bone"
        >
          Book a call
          <span
            className="inline-block text-[0.6em] transition-transform duration-300 ease-out group-hover:translate-x-3"
            aria-hidden="true"
          >
            →
          </span>
        </MagneticButton>

        <p className="mt-12 max-w-md text-base text-muted md:text-lg">
          No deck, no pitch — just a call to see if this fits.
        </p>
        <div className="mt-6">
          <ClickToCopy value={links.whatsappPhoneDisplay} />
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-10 hidden sm:block">
        <LiveClock />
      </div>
      <div className="label-mono absolute bottom-8 right-8 z-10 hidden sm:block">Built by Grenwall</div>
    </section>
  );
}
