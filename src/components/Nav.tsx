import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { links } from '../tokens';

interface NavProps {
  introDone: boolean;
}

const navLinks = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Systems', href: '#systems' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export function Nav({ introDone }: NavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    if (reducedMotion) {
      gsap.set(button, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.set(button, { autoAlpha: 0, y: -10 });
    if (!introDone) return;
    const tween = gsap.to(button, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.12 });
    return () => {
      tween.kill();
    };
  }, [introDone, reducedMotion]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? 'Close' : 'Menu'}</span>
        <span className="menu-mark" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      </button>

      <div id="site-menu" className={`menu-panel${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <div className="menu-panel__brand">GRENWALL</div>
        <nav aria-label="Primary navigation" className="menu-panel__links">
          {navLinks.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="menu-panel__footer">
          <span>AI SYSTEMS STUDIO</span>
          <a href={links.whatsapp} target="_blank" rel="noreferrer">START A PROJECT</a>
          <span>INDIA / WORLDWIDE</span>
        </div>
      </div>
    </>
  );
}
