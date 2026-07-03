import { useRef, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  dataCursor?: string;
}

/** Cards pop up and tilt toward the cursor on hover. Disabled for touch and reduced-motion users. */
export function TiltCard({ children, className = '', maxTilt = 10, dataCursor }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleEnter = () => {
    if (reducedMotion || !ref.current) return;
    gsap.to(ref.current, { y: -10, scale: 1.02, duration: 0.5, ease: 'back.out(1.7)' });
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, {
      rotateX: -py * maxTilt,
      rotateY: px * maxTilt,
      transformPerspective: 700,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor={dataCursor}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
