import { lazy, Suspense, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { links } from '../tokens';

const FluidRevealCanvas = lazy(() =>
  import('./FluidRevealCanvas').then((module) => ({ default: module.FluidRevealCanvas })),
);

interface HeroProps {
  introDone: boolean;
}

const brandLetters = Array.from('GRENWALL');

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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const letters = root.querySelectorAll<HTMLElement>('[data-brand-letter]');
    const details = root.querySelectorAll<HTMLElement>('[data-hero-detail]');
    if (reducedMotion) {
      gsap.set([...letters, ...details], { opacity: 1, yPercent: 0, y: 0 });
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
          {brandLetters.map((letter, index) => (
            <span className="hero-letter-mask" key={`${letter}-${index}`} aria-hidden="true">
              <span data-brand-letter>{letter}</span>
            </span>
          ))}
        </div>
      </div>

      {!reducedMotion ? (
        <Suspense fallback={null}>
          <FluidRevealCanvas activationDelay={4200} />
        </Suspense>
      ) : null}

      <div className="hero-copy" data-hero-detail>
        <h1>
          We build intelligence into the work.<br />
          Because repetition should disappear.
        </h1>
        <a className="hero-cta" href={links.whatsapp} target="_blank" rel="noreferrer">
          Book a call <ArrowIcon />
        </a>
      </div>

      <div className="hero-bottom" data-hero-detail>
        <span>AI systems studio in India</span>
        <div>
          <a href="#systems">LinkedIn</a>
          <i>/</i>
          <a href="#contact">Instagram</a>
          <b>EN</b>
        </div>
      </div>
    </section>
  );
}
