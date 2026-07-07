import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { LiveClock } from './LiveClock';
import { links } from '../tokens';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
];

interface NavProps {
  introDone: boolean;
}

/**
 * Slim fixed bar: wordmark left, mono links center, clock + contact right.
 * Everything inherits the theme vars, so it survives the light-section flip
 * without a special case.
 */
export function Nav({ introDone }: NavProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }
    if (!introDone) {
      gsap.set(el, { autoAlpha: 0, y: -12 });
      return;
    }
    const tween = gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.15 });
    return () => {
      tween.kill();
    };
  }, [introDone, reducedMotion]);

  return (
    <nav
      ref={ref}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 md:px-10"
      style={{ opacity: 0 }}
    >
      <a
        href="#hero"
        data-cursor-hover
        aria-label="Grenwall — back to top"
        className="text-[color:var(--fg)]"
        style={{ fontVariationSettings: "'opsz' 24, 'wght' 540", fontSize: '1.05rem', letterSpacing: '-0.02em' }}
      >
        Grenwall<sup className="align-super text-[0.55em]">®</sup>
      </a>

      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} data-cursor-hover className="label-mono link-line hover:text-[color:var(--fg)]">
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <span className="hidden md:inline-flex">
          <LiveClock />
        </span>
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="label-mono link-line text-[color:var(--fg)]"
        >
          Start a project
        </a>
      </div>
    </nav>
  );
}
