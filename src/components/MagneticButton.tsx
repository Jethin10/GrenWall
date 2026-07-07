import { useRef, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  strength?: number;
}

/**
 * A link with a gentle magnetic pull toward the pointer — no overshoot, no
 * fill sweep; the restraint is the point. Style the surface via className
 * (usually `cta-pill` or `link-line`). Falls back to a plain link for
 * touch/reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  className = '',
  external = true,
  strength = 0.25,
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
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
  };

  return (
    <a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor-hover
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {children}
    </a>
  );
}
