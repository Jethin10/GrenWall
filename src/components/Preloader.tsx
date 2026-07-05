import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { introState } from '../lib/fallState';
import { CropFrame } from './CropFrame';
import { GalaxyIntro, galaxyIntroState } from './GalaxyIntro';

interface PreloaderProps {
  onComplete: () => void;
}

const CORNER_LABELS = ['SYS.INIT', 'GRW—2026', 'AUTOMATION STUDIO', 'V.04'];
const STREAK_COUNT = 14;

/**
 * The intro — heavy, big, full, and built around ONE continuous object: the
 * real WebGL black hole (`BlackHoleField`, already mounted and running
 * underneath, hidden behind this opaque panel). A slowly rotating spiral
 * galaxy (`GalaxyIntro`) fills the panel; as the counter nears 100 its core
 * collapses — arms wind in, dust fades, the core condenses to a bright point
 * (`galaxyIntroState.collapse`) — right as a growing radial mask on this
 * panel opens onto the real black hole while `introState.zoom`/`introState.glow`
 * swell it (via GrenwallScene) to gather mass, spin up, and fill the screen —
 * the peak "weight" beat — before both the mask and `introState` ease back to
 * their resting values (full coverage, zoom = 1, glow = 1) at exactly the same
 * moment. There is no second object and no hand-off: the hero's black hole
 * *is* the galaxy's collapsed core, already settled by the time this panel
 * finishes fading. ~3.5s. Skipped entirely under reduced motion (`introState`
 * stays at rest, so the hero black hole simply renders at its normal resting
 * size from the first frame).
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const streakRefs = useRef<(HTMLDivElement | null)[]>([]);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const lineHRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const heroAnchor = document.getElementById('hero-core-anchor');
    const anchorRect = heroAnchor?.getBoundingClientRect();
    const maskX = anchorRect ? anchorRect.left + anchorRect.width / 2 : window.innerWidth / 2;
    const maskY = anchorRect ? anchorRect.top + anchorRect.height / 2 : window.innerHeight * 0.42;
    const coverRadius = Math.hypot(window.innerWidth, window.innerHeight);

    function setMaskRadius(radius: number) {
      if (radius <= 0) {
        root!.style.maskImage = '';
        root!.style.webkitMaskImage = '';
        return;
      }
      const inner = Math.max(radius * 0.55, 0);
      const gradient = `radial-gradient(circle ${radius}px at ${maskX}px ${maskY}px, transparent 0%, transparent ${inner}px, black ${radius}px)`;
      root!.style.maskImage = gradient;
      root!.style.webkitMaskImage = gradient;
    }

    const counter = { value: 0 };
    const mask = { radius: 0 };
    const streaks = streakRefs.current.filter(Boolean) as HTMLDivElement[];

    // Always start from rest, in case a prior run was interrupted mid-tween.
    introState.zoom = 1;
    introState.glow = 1;
    galaxyIntroState.collapse = 0;

    const tl = gsap.timeline({ onComplete: () => onComplete() });

    // --- Stage 1 (0 → 0.7s): deep black, the galaxy settles in, the dot, the counter.
    tl.set(root, { autoAlpha: 1 })
      .fromTo(galaxyRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.05)
      .fromTo(dotRef.current, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0.12)
      .fromTo(lineHRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.15)
      .from(frameRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 0.3)
      .to(
        counter,
        {
          value: 100,
          duration: 2.7,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.value));
          },
        },
        0.2,
      );

    // --- Stage 2 (0.5 → 1.5s): the galaxy's core collapses — arms wind in,
    // dust fades, the core condenses to a bright point — as the dot swells
    // and gives way to the real black hole, stars bending and streaking
    // inward around it. The galaxy panel itself is gone by the time the mask
    // has opened enough to matter, leaving only the point it collapsed into.
    tl.to(galaxyIntroState, { collapse: 1, duration: 0.85, ease: 'power2.in' }, 0.5)
      .to(galaxyRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 1.1)
      .to(dotRef.current, { scale: 3.4, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.7);

    streaks.forEach((streak, i) => {
      const angle = (i / STREAK_COUNT) * Math.PI * 2 + (i % 3) * 0.4;
      const from = 420 + (i % 5) * 90;
      tl.fromTo(
        streak,
        {
          x: Math.cos(angle) * from,
          y: Math.sin(angle) * from,
          rotate: (angle * 180) / Math.PI,
          autoAlpha: 0,
          scaleX: 0.4,
        },
        {
          x: Math.cos(angle) * 40,
          y: Math.sin(angle) * 40,
          autoAlpha: 0.85,
          scaleX: 1.6,
          duration: 0.8 + (i % 4) * 0.2,
          ease: 'power2.in',
        },
        1.0 + (i % 6) * 0.16,
      ).to(streak, { autoAlpha: 0, duration: 0.15 }, '>');
    });

    // --- Stages 3 & 4 (0.85 → 3.05s): the SAME instance gathers, spins up,
    // and fills the screen (introState swelling past its resting 1), while
    // the mask on this panel grows in lockstep to reveal it — a widening
    // porthole onto the real object, not a second one fading in. Both this
    // mask and introState land back at their exact resting values (full
    // coverage; zoom/glow = 1) at the same moment, so there is nothing left
    // to snap into place once the panel is gone.
    tl.to(
      mask,
      {
        radius: coverRadius,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => setMaskRadius(mask.radius),
      },
      0.85,
    )
      .to(introState, { zoom: 9, glow: 2.6, duration: 1.45, ease: 'power1.inOut' }, 0.85)
      .to(introState, { zoom: 1, glow: 1, duration: 1.0, ease: 'power2.out' }, 2.3);

    // --- Resolve: remaining chrome falls away, then the panel itself fades.
    tl.to(counterWrapRef.current, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, 2.85)
      .to([frameRef.current, lineHRef.current], { autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, 2.85)
      .to(labelRefs.current, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' }, 2.85)
      .to(root, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, 3.35)
      .call(() => setMaskRadius(0));

    // Corner labels flicker in through stages 1–2.
    labelRefs.current.forEach((label, i) => {
      if (!label) return;
      tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.08, repeat: 3, yoyo: true, ease: 'none' }, 0.4 + i * 0.2);
    });

    return () => {
      tl.kill();
      introState.zoom = 1;
      introState.glow = 1;
      galaxyIntroState.collapse = 0;
      if (root) {
        root.style.maskImage = '';
        root.style.webkitMaskImage = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-void opacity-0"
      aria-hidden="true"
    >
      {/* The galaxy — rotating, then collapsing into the point the real
          black hole grows out of */}
      <div ref={galaxyRef} className="absolute inset-0 opacity-0">
        <GalaxyIntro />
      </div>

      <div ref={lineHRef} className="absolute left-0 top-1/3 h-px w-full origin-left bg-line" />

      <div ref={frameRef}>
        <CropFrame />
        <div className="absolute left-10 top-1/3 h-px w-8 border-t border-dashed border-line md:left-16" />
        <div className="absolute bottom-1/3 right-10 h-px w-8 border-t border-dashed border-line md:right-16" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* The seed dot, before the real black hole takes over */}
        <div ref={dotRef} className="absolute h-3 w-3 rounded-full bg-ember opacity-0" />

        {/* Stars streaking inward as gravity takes hold */}
        {Array.from({ length: STREAK_COUNT }).map((_, i) => (
          <div
            key={`streak-${i}`}
            ref={(el) => {
              streakRefs.current[i] = el;
            }}
            className="absolute h-px w-10 rounded-full opacity-0"
            style={{ background: 'linear-gradient(90deg, rgba(243,239,230,0.9), transparent)' }}
          />
        ))}
      </div>

      {CORNER_LABELS.map((label, i) => (
        <span
          key={label}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className={`label-mono absolute opacity-0 ${
            i === 0 ? 'left-6 top-6' : i === 1 ? 'right-6 top-6' : i === 2 ? 'bottom-6 left-6' : 'bottom-6 right-6'
          }`}
        >
          {label}
        </span>
      ))}

      <div ref={counterWrapRef} className="absolute bottom-8 left-8 flex items-baseline gap-2 font-mono text-bone">
        <span ref={counterRef} className="inline-block w-[3ch] text-right text-5xl tabular-nums md:text-7xl">
          0
        </span>
        <span className="text-sm text-muted md:text-base">/ 100</span>
      </div>
    </div>
  );
}
