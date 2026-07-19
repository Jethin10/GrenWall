import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { StarIcon } from './StarIcon';

interface PreloaderProps {
  onComplete: () => void;
}

const WORDMARK_LEFT = 'GREN';
const WORDMARK_RIGHT = 'WALL';

export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const barStarRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const completedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    const root = rootRef.current;
    const word = wordRef.current;
    if (!root || !word) return;

    const letters = word.querySelectorAll<HTMLElement>('[data-loader-letter]');
    const wordStar = word.querySelector<HTMLElement>('[data-loader-star]');
    const count = { value: 0 };
    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    };

    const timeline = gsap.timeline({ onComplete: finish });
    const completionFallback = window.setTimeout(finish, 5400);

    timeline
      .set(root, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)' })
      // Wordmark letters wait in the fold, then assemble as the count climbs.
      .set(letters, { yPercent: 116, opacity: 0 })
      .set(wordStar, { opacity: 0, scale: 0.4, rotate: -200 })
      .set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })
      // Counter 0 -> 100 drives the whole loader.
      .to(count, {
        value: 100,
        duration: 2.15,
        ease: 'power1.inOut',
        onUpdate: () => {
          const v = Math.round(count.value);
          if (counterRef.current) counterRef.current.textContent = String(v).padStart(3, '0');
          if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
          // The star rides the leading edge of the progress bar.
          if (barStarRef.current) barStarRef.current.style.left = `${v}%`;
        },
      }, 0)
      // The star spins onto the N–W seam as the letters assemble beneath it.
      .to(wordStar, {
        opacity: 1,
        rotate: 0,
        scale: 1,
        duration: 1.1,
        ease: 'power3.out',
      }, 0.75)
      // Each letter climbs out of its clip in step with the progress.
      .to(letters, {
        yPercent: 0,
        opacity: 1,
        duration: 0.62,
        ease: 'power4.out',
        stagger: 0.13,
      }, 0.28)
      // Settle beat once the count lands.
      .to(word, { yPercent: -6, duration: 0.5, ease: 'power2.inOut' }, 2.15)
      .to([counterRef.current, barRef.current?.parentElement ?? null, barStarRef.current], {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, 2.2)
      // The star flares gold, spins, and dims out...
      .to(wordStar, {
        scale: 1.24,
        filter: 'drop-shadow(0 0 16px rgba(214, 178, 90, 0.9))',
        duration: 0.45,
        ease: 'power2.out',
      }, 2.4)
      .to(wordStar, {
        rotate: '+=420',
        scale: 0.45,
        opacity: 0,
        filter: 'drop-shadow(0 0 0 rgba(214, 178, 90, 0))',
        duration: 0.85,
        ease: 'power2.in',
      }, 2.85)
      // As the star fades, the panel opens up into the hero.
      .to(word, { yPercent: -118, duration: 0.9, ease: 'power4.inOut' }, 3.42)
      .to(root, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' }, 3.48);

    return () => {
      window.clearTimeout(completionFallback);
      timeline.kill();
    };
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div ref={wordRef} className="preloader-word">
        {WORDMARK_LEFT.split('').map((letter, index) => (
          <span className="preloader-letter-mask" key={`left-${letter}-${index}`}>
            <span data-loader-letter>{letter}</span>
          </span>
        ))}
        {/* Zero-width anchor: the star takes no advance — it is pinned over
            the N–W seam like the logotype, overlapping both letters. */}
        <span className="preloader-star-anchor" aria-hidden="true">
          <span className="preloader-star-center">
            <span data-loader-star className="preloader-word-star">
              <StarIcon />
            </span>
          </span>
        </span>
        {WORDMARK_RIGHT.split('').map((letter, index) => (
          <span className="preloader-letter-mask" key={`right-${letter}-${index}`}>
            <span data-loader-letter>{letter}</span>
          </span>
        ))}
      </div>

      <div className="preloader-progress">
        <span className="preloader-bar-track">
          <span ref={barRef} className="preloader-bar" />
        </span>
        <span ref={barStarRef} className="preloader-bar-star" aria-hidden="true">
          <StarIcon />
        </span>
      </div>

      <span ref={counterRef} className="preloader-count">000</span>
    </div>
  );
}
