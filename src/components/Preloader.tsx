import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { CropFrame } from './CropFrame';

interface PreloaderProps {
  onComplete: () => void;
}

const CORNER_LABELS = ['SYS.INIT', 'GRW—2026', 'AUTOMATION STUDIO', 'V.01'];

/**
 * A layered, steven.com-style loading intro: a black-in with a sketch line
 * drawing across the frame, a large mono counter ticking 0 → 100 while more
 * sketch lines and crop-mark guides draw themselves and corner labels
 * flicker in, the GRENWALL crystal materializing through a soft mask hole
 * around the 60% mark (it's already running underneath, at the App level —
 * this just reveals it early, in place, rather than mounting a second
 * instance), then a clip-path curtain wipe resolving into the hero. ~2.7s.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineHRef = useRef<HTMLDivElement>(null);
  const lineH2Ref = useRef<HTMLDivElement>(null);
  const lineVRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const heroAnchor = document.getElementById('hero-crystal-anchor');
    const anchorRect = heroAnchor?.getBoundingClientRect();
    const maskX = anchorRect ? anchorRect.left + anchorRect.width / 2 : window.innerWidth / 2;
    const maskY = anchorRect ? anchorRect.top + anchorRect.height / 2 : window.innerHeight * 0.42;

    function setMaskRadius(radius: number) {
      if (radius <= 0) {
        root!.style.maskImage = '';
        root!.style.webkitMaskImage = '';
        return;
      }
      const inner = Math.max(radius - 70, 0);
      const gradient = `radial-gradient(circle ${radius}px at ${maskX}px ${maskY}px, transparent 0%, transparent ${inner}px, black ${radius}px)`;
      root!.style.maskImage = gradient;
      root!.style.webkitMaskImage = gradient;
    }

    const counter = { value: 0 };
    const mask = { radius: 0 };

    const tl = gsap.timeline({ onComplete: () => onComplete() });

    // Stage 1 — black-in, a single thin line draws across the viewport.
    tl.set(root, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' })
      .fromTo(lineHRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power2.out' }, 0.1)
      .from(frameRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 0.25)

      // Stage 2 — counter climbs while more guides draw + labels flicker in.
      .fromTo(lineVRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, 0.4)
      .fromTo(lineH2Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.55)
      .to(
        counter,
        {
          value: 100,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.value));
          },
        },
        0.3,
      )
      .to(
        mask,
        {
          radius: 240,
          duration: 0.9,
          ease: 'power2.out',
          onUpdate: () => setMaskRadius(mask.radius),
        },
        1.15,
      );

    labelRefs.current.forEach((label, i) => {
      if (!label) return;
      tl.fromTo(
        label,
        { opacity: 0 },
        { opacity: 1, duration: 0.08, repeat: 3, yoyo: true, ease: 'none' },
        0.5 + i * 0.18,
      );
    });

    // Stage 3 — resolve + wipe, the crystal already resolved beneath.
    tl.to({}, { duration: 0.15 })
      .to(contentRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' })
      .to(frameRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, '<')
      .to(labelRefs.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, '<')
      .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'power4.inOut' }, '-=0.1')
      .call(() => setMaskRadius(0));

    return () => {
      tl.kill();
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
      <div ref={lineHRef} className="absolute left-0 top-1/3 h-px w-full origin-left bg-line" />
      <div ref={lineH2Ref} className="absolute bottom-1/3 right-0 h-px w-full origin-right bg-line" />
      <div ref={lineVRef} className="absolute left-1/2 top-0 h-full w-px origin-top bg-line" />

      <div ref={frameRef}>
        <CropFrame />
        <div className="absolute left-10 top-1/3 h-px w-8 border-t border-dashed border-line md:left-16" />
        <div className="absolute bottom-1/3 right-10 h-px w-8 border-t border-dashed border-line md:right-16" />
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

      <div ref={contentRef} className="flex items-baseline gap-2 font-mono text-bone">
        <span ref={counterRef} className="inline-block w-[3ch] text-right text-6xl tabular-nums md:text-8xl">
          0
        </span>
        <span className="text-sm text-muted md:text-base">/ 100</span>
      </div>
    </div>
  );
}
