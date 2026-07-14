import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

const loaderFrames = ['/images/ai-sales-system.png', '/images/autonomous-support.png'];

export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
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
    if (!root) return;

    const frames = root.querySelectorAll<HTMLElement>('[data-loader-frame]');
    const count = { value: 0 };
    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    };

    const timeline = gsap.timeline({ onComplete: finish });
    const completionFallback = window.setTimeout(finish, 3200);
    timeline
      .set(root, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)' })
      .set(frames, { autoAlpha: 0, scale: 1.08 })
      .fromTo(markRef.current, { scale: 0.72, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.75 }, 0.08)
      .to(
        count,
        {
          value: 100,
          duration: 1.75,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(count.value)).padStart(3, '0');
            }
          },
        },
        0,
      )
      .to(frames[0], { autoAlpha: 0.88, scale: 1, duration: 0.28 }, 0.45)
      .to(frames[0], { autoAlpha: 0, duration: 0.22 }, 0.82)
      .to(frames[1], { autoAlpha: 0.82, scale: 1, duration: 0.28 }, 0.86)
      .to(frames[1], { autoAlpha: 0, duration: 0.22 }, 1.2)
      .to(markRef.current, { scale: 1.07, opacity: 0, duration: 0.4 }, 1.5)
      .to(root, { clipPath: 'inset(0 0 100% 0)', duration: 0.95 }, 1.72);

    return () => {
      window.clearTimeout(completionFallback);
      timeline.kill();
    };
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="preloader-frame" data-loader-frame>
        <img src={loaderFrames[0]} alt="" />
      </div>
      <div className="preloader-frame" data-loader-frame>
        <img src={loaderFrames[1]} alt="" />
      </div>
      <div ref={markRef} className="preloader-mark">G</div>
      <span ref={counterRef} className="preloader-count">000</span>
    </div>
  );
}
