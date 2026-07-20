import { lazy, Suspense, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useIsMobile } from '../lib/useIsMobile';
import { useReducedMotion } from '../lib/useReducedMotion';
import { links } from '../tokens';

const FluidRevealCanvas = lazy(() =>
  import('./FluidRevealCanvas').then((module) => ({ default: module.FluidRevealCanvas })),
);

interface HeroProps {
  introDone: boolean;
}

const brandRows = ['GREN', 'WALL'];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 12" aria-hidden="true">
      <path d="M1 6h15M11.5 1.5 16 6l-4.5 4.5" />
    </svg>
  );
}

export function Hero({ introDone }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile(901);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const letters = root.querySelectorAll<HTMLElement>('[data-brand-letter]');
    const details = root.querySelectorAll<HTMLElement>('[data-hero-detail]');
    if (reducedMotion) {
      gsap.set(Array.from(letters).concat(Array.from(details)), { opacity: 1, yPercent: 0, y: 0 });
      return;
    }
    if (!introDone) {
      gsap.set(letters, { yPercent: 0, rotate: 0 });
      gsap.set(details, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(letters, { yPercent: 115, rotate: 2 });
    gsap.set(details, { opacity: 0, y: 12 });
    const timeline = gsap.timeline();
    timeline
      .to(details, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.05)
      .to(letters, { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.045 }, 0.22);
    return () => {
      timeline.kill();
    };
  }, [introDone, reducedMotion]);

  return (
    <section ref={rootRef} id="home" className="hero">
      <div className="hero-media" data-hero-media aria-hidden="true">
        {reducedMotion ? (
          <img
            src="/video/grenwall-material-poster.jpg"
            alt=""
            width="1920"
            height="1080"
            fetchPriority="high"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/video/grenwall-material-poster.jpg"
          >
            <source src="/video/grenwall-material-loop.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      <div className="hero-reveal-surface">
        <div className="hero-word" aria-label="Grenwall">
          {isMobile
            ? brandRows.map((row) => (
                <span className="hero-letter-mask hero-row-mask" key={row} aria-hidden="true">
                  <span className="hero-word-row" data-brand-letter>
                    {row}
                  </span>
                </span>
              ))
            : brandRows.map((row) =>
                Array.from(row).map((letter, index) => (
                  <span className="hero-letter-mask" key={`${row}-${letter}-${index}`} aria-hidden="true">
                    <span data-brand-letter>{letter}</span>
                  </span>
                )),
              )}
        </div>
      </div>

      {!reducedMotion ? (
        <Suspense fallback={null}>
          <FluidRevealCanvas activationDelay={isMobile ? 1800 : 4200} />
        </Suspense>
      ) : null}

      <div className="hero-copy" data-hero-detail>
        <h1>
          We build intelligence into the work.<br />
          <em className="serif-accent">because repetition should disappear.</em>
        </h1>
        <a className="hero-cta" href={links.whatsapp} target="_blank" rel="noreferrer">
          Book a call <ArrowIcon />
        </a>
      </div>

      <p className="hero-lede" data-hero-detail>
        We design and run the agents and automations that take repeating work off your
        team — support, follow-ups, operations.
      </p>

      <span className="hero-hint" aria-hidden="true">
        {isMobile ? 'Drag across the name' : 'Run your cursor through the name'}
      </span>

      <div className="hero-bottom" data-hero-detail>
        <span>AI systems studio in India</span>
        <div>
          <a href={links.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          <i>/</i>
          <a href="mailto:hello@grenwall.org">Email</a>
        </div>
      </div>
    </section>
  );
}
