import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface CountUpProps {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/** Animates a number counting up once it scrolls into view. */
export function CountUp({ to, suffix = '', prefix = '', decimals = 0, duration = 1.6, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const counter = { n: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          n: to,
          duration,
          ease: 'power2.out',
          onUpdate: () => setValue(counter.n),
        });
      },
    });

    return () => st.kill();
  }, [to, duration, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
