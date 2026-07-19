import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Cursor-proximity variable weight (technique after OriginKit "Dynamic
 * Weight", rebuilt on gsap.ticker): letters near the cursor bulk toward
 * `wght` 900 and relax back with exponential smoothing. Expects headlines
 * already word-split by the `data-reveal="words"` pass — it further splits
 * each word into per-letter spans. Inter Variable carries the wght axis;
 * on the static Instrument Serif accents the settings are inert, so the
 * serif words simply stay put.
 */
export function useWeightProximity<T extends HTMLElement>(
  ref: RefObject<T | null>,
  selector = '[data-reveal="words"]',
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const REACH = 240;
    const letters: HTMLSpanElement[] = [];
    const baseWeights: number[] = [];
    const factors: number[] = [];

    // Letter-split runs once, after the word-mask split has happened.
    // requestAnimationFrame ensures we run after the reveal effect's split.
    let ticking = false;
    let visible = false;
    const pointer = { x: -9999, y: -9999, fresh: false };

    const tick = () => {
      if (!visible) return;
      const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.1);
      const a = 1 - Math.exp(-dt / 0.12);
      // Read pass: measure every letter before any width-changing write,
      // otherwise wght-induced reflow thrashes layout mid-loop.
      const rects = letters.map((el) => el.getBoundingClientRect());
      let anyActive = false;
      for (let i = 0; i < letters.length; i++) {
        const rect = rects[i];
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const target = Math.min(Math.max(1 - Math.hypot(dx, dy) / REACH, 0), 1);
        const next = factors[i] + (target - factors[i]) * a;
        factors[i] = next;
        if (next > 0.002) anyActive = true;
      }
      for (let i = 0; i < letters.length; i++) {
        const weight = Math.round(baseWeights[i] + (900 - baseWeights[i]) * factors[i]);
        letters[i].style.fontVariationSettings = `'wght' ${weight}`;
      }
      // Nothing near the cursor and everything settled — sleep until the
      // pointer moves again instead of burning frames.
      if (!anyActive && !pointer.fresh) stop();
      pointer.fresh = false;
    };

    const start = () => {
      if (ticking) return;
      ticking = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      if (!ticking) return;
      ticking = false;
      gsap.ticker.remove(tick);
    };

    const frame = requestAnimationFrame(() => {
      root.querySelectorAll<HTMLElement>(`${selector} .word-mask > span`).forEach((word) => {
        if (word.childElementCount > 0) return;
        const text = word.textContent ?? '';
        const weight = Number(getComputedStyle(word).fontWeight) || 500;
        word.textContent = '';
        for (const char of text) {
          const span = document.createElement('span');
          span.className = 'wchar';
          span.textContent = char;
          word.appendChild(span);
          letters.push(span);
          baseWeights.push(weight);
          factors.push(0);
        }
      });
    });

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.fresh = true;
      if (visible) start();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
    });
    io.observe(root);

    return () => {
      cancelAnimationFrame(frame);
      stop();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [ref, selector, reducedMotion]);
}

/**
 * Mobile-only scroll choreography for the stacked offer panes. Desktop keeps
 * its hover accordion untouched — this only runs under 900px. Each image
 * unveils through a scrub-linked curtain (clip-path opens as you scroll, so
 * the reveal is controlled by the thumb, not a timer) while the photo inside
 * settles from a deeper zoom; the copy underneath rises line by line.
 */
export function useMobileScrollReveal<T extends HTMLElement>(ref: RefObject<T | null>) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) return;
    if (!window.matchMedia('(max-width: 900px)').matches) return;

    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('.offer-pane').forEach((pane) => {
        const media = pane.querySelector<HTMLElement>('.offer-pane__media');
        const img = media?.querySelector<HTMLElement>('img');
        const content = pane.querySelector<HTMLElement>('.offer-pane__content');

        if (media && img) {
          gsap.fromTo(
            media,
            { clipPath: 'inset(16% 9% 16% 9%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: media, start: 'top 96%', end: 'top 42%', scrub: 0.4 },
            },
          );
          // The photo keeps drifting the whole time it's on screen, so the
          // frame never feels frozen mid-scroll.
          gsap.fromTo(
            img,
            { scale: 1.3, yPercent: -7 },
            {
              scale: 1,
              yPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom 35%', scrub: 0.4 },
            },
          );
        }

        if (content) {
          gsap.fromTo(
            content.children,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.09,
              ease: 'power3.out',
              scrollTrigger: { trigger: content, start: 'top 90%', once: true },
            },
          );
        }
      });
    }, root);
    return () => context.revert();
  }, [ref, reducedMotion]);
}

/**
 * Decrypt-style scramble reveal for the mono rail labels: characters churn
 * through glyph noise and settle left-to-right the first time each label
 * scrolls into view. Only touches elements with no child elements.
 */
export function useScrambleReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  selector: string,
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => el.childElementCount === 0 && (el.textContent ?? '').trim().length > 0,
    );
    if (!targets.length) return;

    const GLYPHS = '#/\\_—=+<>*·';
    const tweens: gsap.core.Tween[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          const original = el.textContent ?? '';
          const proxy = { p: 0 };
          tweens.push(
            gsap.to(proxy, {
              p: 1,
              duration: 0.9,
              delay: Math.random() * 0.3,
              ease: 'power2.out',
              onUpdate() {
                const settled = Math.floor(proxy.p * original.length);
                let out = original.slice(0, settled);
                for (let i = settled; i < original.length; i++) {
                  out +=
                    original[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                }
                el.textContent = out;
              },
              onComplete() {
                el.textContent = original;
              },
            }),
          );
        });
      },
      { rootMargin: '-4% 0px' },
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      tweens.forEach((tween) => tween.kill());
    };
  }, [ref, selector, reducedMotion]);
}
