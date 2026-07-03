import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useShowCrystal } from '../lib/useShowCrystal';
import { Monogram } from './Monogram';

const Scene = lazy(() => import('../scenes/GrenwallScene'));

const BASE_SIZE = 320;
const HERO_SCALE = 1;
const ENDING_SCALE = 1.2;
const TUCKED_SCALE = 0.24;
const TUCKED_MARGIN = 56;

/**
 * The single, persistent GRENWALL crystal — mounted once, fixed over the
 * whole page. It sits large & centered through the hero, shrinks into a
 * quiet top-right tuck as the middle sections pass, and grows large &
 * centered again through the ending — the thread tying every scene
 * together, per the "crystal persists and travels" brief.
 */
export function TravelingCrystal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const show = useShowCrystal();

  useEffect(() => {
    if (!show) return;
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const triggers: ScrollTrigger[] = [];

    function setup() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const centerX = vw / 2;
      const tuckedX = vw - TUCKED_MARGIN;
      const tuckedY = TUCKED_MARGIN + 40;

      // The hero/ending anchors are empty spacers left in each section's own
      // centered flex column. Their position *within their own section* is
      // fixed regardless of scroll — combined with knowing exactly where each
      // ScrollTrigger considers that section's top to be (viewport top for
      // the hero-exit trigger, viewport center for the ending-entry trigger),
      // that gives the crystal's true on-screen target without guesswork.
      const heroAnchor = document.getElementById('hero-crystal-anchor');
      const heroSection = document.getElementById('hero');
      const endingAnchor = document.getElementById('ending-crystal-anchor');

      let heroY = vh * 0.42;
      if (heroAnchor && heroSection) {
        const anchorRect = heroAnchor.getBoundingClientRect();
        const sectionRect = heroSection.getBoundingClientRect();
        heroY = anchorRect.top - sectionRect.top + anchorRect.height / 2;
      }

      // The ending trigger runs all the way to the true bottom of the page
      // (end: 'max') so nothing is left frozen while the short footer below
      // the ending section scrolls past — endingY is the anchor's position
      // at that exact final scroll position, not a guess mid-section.
      let endingY = vh * 0.42;
      if (endingAnchor) {
        const anchorAbsoluteTop = endingAnchor.getBoundingClientRect().top + window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - vh;
        endingY = anchorAbsoluteTop - maxScroll + endingAnchor.offsetHeight / 2;
      }

      gsap.set(wrapper, { x: centerX, y: heroY, scale: HERO_SCALE, opacity: 1 });

      triggers.push(
        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(wrapper, {
              x: gsap.utils.interpolate(centerX, tuckedX, p),
              y: gsap.utils.interpolate(heroY, tuckedY, p),
              scale: gsap.utils.interpolate(HERO_SCALE, TUCKED_SCALE, p),
              opacity: gsap.utils.interpolate(1, 0.45, p),
            });
          },
        }),
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: '#contact',
          start: 'top bottom',
          end: 'max',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(wrapper, {
              x: gsap.utils.interpolate(tuckedX, centerX, p),
              y: gsap.utils.interpolate(tuckedY, endingY, p),
              scale: gsap.utils.interpolate(TUCKED_SCALE, ENDING_SCALE, p),
              opacity: gsap.utils.interpolate(0.45, 1, p),
            });
          },
        }),
      );
    }

    setup();
    ScrollTrigger.addEventListener('refreshInit', setup);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', setup);
      triggers.forEach((t) => t.kill());
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={wrapperRef}
      data-cursor="drag"
      className="pointer-events-auto fixed left-0 top-0 z-20 will-change-transform"
      style={{ width: BASE_SIZE, height: BASE_SIZE, marginLeft: -BASE_SIZE / 2, marginTop: -BASE_SIZE / 2 }}
      aria-hidden="true"
    >
      {mounted ? (
        <Suspense fallback={<FallbackMonogram />}>
          <Scene />
        </Suspense>
      ) : (
        <FallbackMonogram />
      )}
    </div>
  );
}

function FallbackMonogram() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Monogram className="h-1/2 w-1/2 text-bone" />
    </div>
  );
}
