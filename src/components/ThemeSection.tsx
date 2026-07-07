import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { ScrollTrigger } from '../lib/gsap';

interface ThemeSectionProps {
  theme: 'dark' | 'light';
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Section wrapper that flips the page theme while it owns the viewport.
 * Sections stay transparent; the <body> background/color crossfade (a CSS
 * transition on the custom properties' consumers) does the visual work, so
 * the switch feels like the whole world changing rather than a hard edge
 * scrolling past.
 */
export function ThemeSection({ theme, children, className = '', id }: ThemeSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || theme === 'dark') return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        document.documentElement.classList.toggle('theme-light', self.isActive);
      },
    });

    return () => {
      st.kill();
      document.documentElement.classList.remove('theme-light');
    };
  }, [theme]);

  return (
    <section ref={ref} id={id} className={`relative ${className}`}>
      {children}
    </section>
  );
}
