import { RevealText } from './RevealText';
import { MagneticButton } from './MagneticButton';
import { ClickToCopy } from './ClickToCopy';
import { AgentMark } from './AgentMark';
import { CropFrame } from './CropFrame';
import { LiveClock } from './LiveClock';
import { Monogram } from './Monogram';
import { useShowBlackHole } from '../lib/useShowBlackHole';
import { links } from '../tokens';

export function CTA() {
  const showBlackHole = useShowBlackHole();
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32 md:py-48">
      <CropFrame />
      <div className="pointer-events-none absolute inset-0 bg-ember-radial opacity-30" aria-hidden="true" />
      {/* The disk is at its brightest, biggest, most bloomed here — the
          "returns huge" close — sitting directly behind the headline and CTA.
          The old scrim only darkened the outer edges and left the centre (and
          the text) fully exposed to that peak brightness. This one dims
          hardest exactly where the text sits and fades out toward the edges,
          so the disk still reads as huge and cinematic while the type stays
          legible no matter how bright the fall gets. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 88% 84% at 50% 48%, rgba(5,5,6,0.88), rgba(5,5,6,0.55) 55%, rgba(5,5,6,0.15) 82%, transparent)',
        }}
        aria-hidden="true"
      />

      <div id="ending-content" className="relative z-30 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-8 flex items-center">
          <AgentMark />
          <div className="label-mono">05 — Contact</div>
        </div>

        <div
          id="ending-core-anchor"
          className="flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80 md:h-96 md:w-96"
          aria-hidden="true"
        >
          {!showBlackHole && <Monogram className="h-1/2 w-1/2 text-bone" />}
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
      <div className="absolute bottom-8 right-8 z-10 hidden flex-col items-end gap-1 sm:flex">
        <span className="label-mono">Built by Grenwall</span>
        <span className="label-mono">©GRENWALL 2026</span>
      </div>
    </section>
  );
}
