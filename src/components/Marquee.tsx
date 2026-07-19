import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface MarqueeProps {
  text: string;
}

/**
 * Kinetic type strip between hero and body — drift + scroll surge + skew.
 * Used once as a bridge so the page feels continuous, not sectioned.
 */
export function Marquee({ text }: MarqueeProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const inner = innerRef.current;
    if (!inner) return;

    let period = inner.scrollWidth / 4;
    const ro = new ResizeObserver(() => {
      period = inner.scrollWidth / 4;
    });
    ro.observe(inner);

    const xSet = gsap.quickSetter(inner, 'x', 'px');
    const skewSet = gsap.quickSetter(inner, 'skewX', 'deg');

    let vel = 0;
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        vel = self.getVelocity();
      },
    });

    let x = 0;
    let skew = 0;
    const tick = (_time: number, deltaMS: number) => {
      const dt = Math.min(deltaMS, 100) / 1000;
      const speed = 55 + Math.min(Math.abs(vel) * 0.1, 380);
      x -= speed * dt;
      if (period > 0) {
        while (x <= -period) x += period;
      }
      xSet(x);

      const target = gsap.utils.clamp(-4, 4, vel * 0.004);
      skew += (target - skew) * 0.09;
      skewSet(skew);
      vel *= 0.92;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      ro.disconnect();
    };
  }, [reducedMotion]);

  const item = (key: string) => (
    <span key={key} className="site-marquee__item">
      {text}
      <i aria-hidden="true" />
    </span>
  );

  return (
    <div className="site-marquee" aria-hidden="true">
      {reducedMotion ? (
        <div className="site-marquee__static">{item('static')}</div>
      ) : (
        <div ref={innerRef} className="site-marquee__track">
          {item('a')}
          {item('b')}
          {item('c')}
          {item('d')}
        </div>
      )}
    </div>
  );
}
