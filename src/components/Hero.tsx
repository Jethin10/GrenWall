import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useShowCrystal } from '../lib/useShowCrystal';
import { MagneticButton } from './MagneticButton';
import { ClickToCopy } from './ClickToCopy';
import { CropFrame } from './CropFrame';
import { LiveClock } from './LiveClock';
import { Monogram } from './Monogram';
import { links } from '../tokens';

interface HeroProps {
  introDone: boolean;
}

export function Hero({ introDone }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);

  const reducedMotion = useReducedMotion();
  const showCrystal = useShowCrystal();

  // Entrance choreography — gated on the preloader finishing. The crystal
  // itself already materialized during the preloader (see Preloader.tsx);
  // it lives outside this section now, as the page-level TravelingCrystal.
  useEffect(() => {
    if (!introDone) return;

    if (reducedMotion) {
      gsap.set([kickerRef.current, taglineRef.current, ctaRef.current, cueRef.current], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    gsap.set([kickerRef.current, taglineRef.current, ctaRef.current, cueRef.current], { opacity: 0, y: 16 });

    const tl = gsap.timeline({ defaults: { ease: 'heavy' } });
    tl.to(kickerRef.current, { opacity: 1, y: 0, duration: 0.6 })
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
      .to(cueRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, [introDone, reducedMotion]);

  // Parallax depth: hero content drifts and fades as the page scrolls past it.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Mouse parallax: the crop-frame drifts opposite the cursor (background
  // layer), the content drifts slightly with it (foreground layer) — a
  // subtle sense of depth so the composition breathes as the cursor moves.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section || window.matchMedia('(pointer: coarse)').matches) return;

    const setFrameX = gsap.quickTo(frameRef.current, 'x', { duration: 0.8, ease: 'power3.out' });
    const setFrameY = gsap.quickTo(frameRef.current, 'y', { duration: 0.8, ease: 'power3.out' });
    const setContentX = gsap.quickTo(contentRef.current, 'x', { duration: 0.8, ease: 'power3.out' });
    const setContentY = gsap.quickTo(contentRef.current, 'y', { duration: 0.8, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setFrameX(-px * 18);
      setFrameY(-py * 18);
      setContentX(px * 8);
      setContentY(py * 8);
    };

    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-void"
    >
      <div ref={frameRef}>
        <CropFrame />
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <div ref={kickerRef} className="label-mono">
          Grenwall // Automation Studio
        </div>

        <div
          id="hero-crystal-anchor"
          className="mt-4 flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72 md:h-80 md:w-80"
          aria-hidden="true"
        >
          {!showCrystal && <Monogram className="h-1/2 w-1/2 text-bone" />}
        </div>

        <p ref={taglineRef} className="-mt-2 max-w-md text-balance font-body text-base text-muted md:text-lg">
          The work still gets done. You just stop doing it.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-5">
          <MagneticButton
            href={links.whatsapp}
            className="inline-flex items-center gap-2 rounded-full border-2 border-bone px-8 py-4 font-mono text-sm tracking-wide text-bone"
          >
            Book a call
          </MagneticButton>
          <ClickToCopy value={links.whatsappPhoneDisplay} />
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-10 hidden sm:block">
        <LiveClock />
      </div>

      <a
        ref={cueRef}
        href="#what-we-build"
        data-cursor-hover
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-ember"
      >
        <span className="label-mono">Scroll</span>
        <ChevronDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
        <span className="sr-only">Scroll to learn what we build</span>
      </a>

      <div className="label-mono absolute bottom-8 right-8 z-10 hidden sm:block">GW—01</div>
    </section>
  );
}
