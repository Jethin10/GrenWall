import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useShowBlackHole } from '../lib/useShowBlackHole';
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
  const showBlackHole = useShowBlackHole();

  // Entrance choreography — gated on the intro finishing. The black hole
  // was already running beneath the intro (see Preloader.tsx) and is the
  // very same instance revealed through it; it lives outside this section,
  // as the page-level BlackHoleField.
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
    // Camera settle: we emerge out of the intro's horizon slightly "inside"
    // the hero, and the frame eases back to rest.
    tl.fromTo(contentRef.current, { scale: 1.06 }, { scale: 1, duration: 1.2 }, 0)
      .to(kickerRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
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
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* Cinematic atmosphere: a faint warm pool behind the black hole, and a
          scrim that dims *toward the centre* — where the kicker, tagline, and
          CTA sit directly over the disk — so text always reads clearly no
          matter how bright the disk gets, rather than only darkening the
          edges and leaving the brightest, most-overlapped area untouched. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 42% at 50% 42%, rgba(216,130,58,0.07), transparent 70%), radial-gradient(ellipse 85% 82% at 50% 50%, rgba(5,5,6,0.5), rgba(5,5,6,0.2) 58%, transparent 85%)',
        }}
        aria-hidden="true"
      />

      <div ref={frameRef}>
        <CropFrame />
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        {/* Hidden from first paint via `opacity-0` (not just the JS effect
            below): the intro's reveal mask now opens gradually, much earlier
            than before, onto whatever is already composited behind the
            preloader — if these started fully opaque (their gsap.set(0) only
            ran once `introDone` flipped true), the raw, unstyled hero text
            would show through the growing mask hole during the intro itself,
            undercutting the "one continuous object" handoff entirely. */}
        <div ref={kickerRef} className="label-mono opacity-0">
          Grenwall // Automation Studio
        </div>

        <div
          id="hero-core-anchor"
          className="mt-2 flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80 md:h-[26rem] md:w-[26rem]"
          aria-hidden="true"
        >
          {!showBlackHole && <Monogram className="h-1/2 w-1/2 text-bone" />}
        </div>

        <p ref={taglineRef} className="-mt-3 max-w-lg text-balance font-body text-lg text-bone/80 opacity-0 md:text-xl">
          The work still gets done. You just stop doing it.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col items-center gap-5 opacity-0">
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
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted opacity-0 transition-colors hover:text-ember"
      >
        <span className="label-mono">Scroll</span>
        <ChevronDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
        <span className="sr-only">Scroll to learn what we build</span>
      </a>

      <div className="absolute bottom-8 right-8 z-10 hidden flex-col items-end gap-1 sm:flex">
        <span className="label-mono">GW—01</span>
        <span className="label-mono">©GRENWALL 2026</span>
      </div>
    </section>
  );
}
