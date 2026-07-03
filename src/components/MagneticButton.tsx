import { useRef, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  strength?: number;
  /** 'pill' = bordered button with an ember fill sweep. 'text' = bare underlined text link. */
  variant?: 'pill' | 'text';
}

/**
 * CTA that jumps to meet the cursor: a springy overshoot scale on hover and
 * a magnetic pull toward the pointer. The 'pill' variant adds an ember fill
 * sweeping in behind the text; the 'text' variant stays a bare underlined
 * link that just shifts to ember, for oversized Podium-style closing CTAs.
 * Falls back to a plain link (no motion) for touch/reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  className = '',
  external = true,
  strength = 0.35,
  variant = 'pill',
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleEnter = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { scale: 1.1, duration: 0.5, ease: 'back.out(2)' });
  };

  const handleLeave = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
  };

  if (variant === 'text') {
    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        data-cursor-hover
        data-cursor={external ? 'open' : undefined}
        className={`group underline decoration-2 underline-offset-8 transition-colors duration-300 hover:text-ember ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor-hover
      data-cursor={external ? 'open' : undefined}
      className={`group relative overflow-hidden ${className}`}
    >
      <span
        className="absolute inset-0 z-0 origin-left scale-x-0 bg-ember transition-transform duration-[350ms] ease-out motion-reduce:transition-none group-hover:scale-x-100"
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 motion-reduce:transition-none group-hover:text-void">
        {children}
      </span>
    </a>
  );
}
