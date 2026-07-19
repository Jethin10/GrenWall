import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { links } from '../tokens';
import { StarIcon } from './StarIcon';

interface NavProps {
  introDone: boolean;
}

const navLinks = [
  { label: 'Offer', href: '#offer' },
  { label: 'Method', href: '#method' },
  { label: 'Fit', href: '#fit' },
  { label: 'Contact', href: '#contact' },
];

export function Nav({ introDone }: NavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const targets = [buttonRef.current, ghostRef.current].filter(Boolean);
    if (!targets.length) return;
    if (reducedMotion) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.set(targets, { autoAlpha: 0, y: -10 });
    if (!introDone) return;
    const tween = gsap.to(targets, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.12 });
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

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || reducedMotion) return;
    const rows = panel.querySelectorAll<HTMLElement>('.menu-panel__links a, .menu-panel__footer > *');
    const brand = panel.querySelector<HTMLElement>('.menu-panel__brand');
    if (!open) {
      gsap.set(rows, { clearProps: 'all' });
      if (brand) gsap.set(brand, { clearProps: 'all' });
      return;
    }
    const timeline = gsap.timeline();
    if (brand) {
      timeline.fromTo(
        brand,
        { yPercent: 32, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out' },
        0.28,
      );
    }
    timeline.fromTo(
      rows,
      { y: 34, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.055, ease: 'power3.out' },
      0.38,
    );
    return () => {
      timeline.kill();
    };
  }, [open, reducedMotion]);

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
        <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
        <span className="menu-mark" aria-hidden="true">
          <StarIcon />
        </span>
      </button>

      {/* Blended twin of the toggle: fixed elements isolate their children's
          blending, so the adaptive label lives here (whole element blends)
          while the real button keeps the gold star and the click target. */}
      <span ref={ghostRef} className="menu-toggle menu-toggle--ghost" aria-hidden="true">
        <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
        <span className="menu-mark">
          <StarIcon />
        </span>
      </span>

      <div
        id="site-menu"
        ref={panelRef}
        className={`menu-panel${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
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
