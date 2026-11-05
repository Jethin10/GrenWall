import { useLayoutEffect, type RefObject } from 'react';
import { gsap, SplitText } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';

export function useCraftflowMotion(rootRef: RefObject<HTMLDivElement | null>) {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const cleanups: (() => void)[] = [];
    const context = gsap.context(() => {
      gsap.from('.cf-header > *', { y: -12, opacity: 0, stagger: .055, duration: .8, ease: 'power4.out' });
      SplitText.create('.cf-about-copy p:first-child', {
        type: 'words', autoSplit: true,
        onSplit(split) { return gsap.from(split.words, { opacity: .18, stagger: .12, ease: 'none', scrollTrigger: { trigger: split.elements[0], start: 'top 82%', end: 'bottom 48%', scrub: .6 } }); },
      });
      root.querySelectorAll<HTMLElement>('.cf-services-heading h2, .cf-collaboration h2, .cf-contact h2').forEach(heading => {
        gsap.fromTo(heading, { clipPath: 'inset(0 0 100% 0)', y: 35 }, { clipPath: 'inset(0 0 -12% 0)', y: 0, duration: 1.1, scrollTrigger: { trigger: heading, start: 'top 90%', once: true } });
      });
      gsap.from('.cf-disciplines > span', { x: 50, opacity: .2, stagger: .12, ease: 'none', scrollTrigger: { trigger: '.cf-disciplines', start: 'top 95%', end: 'top 60%', scrub: .7 } });
      gsap.from('.cf-process > div', { y: 25, opacity: 0, stagger: .12, duration: .9, scrollTrigger: { trigger: '.cf-process', start: 'top 88%', once: true } });
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        root.querySelectorAll<HTMLElement>('.cf-pill').forEach(button => {
          const xTo = gsap.quickTo(button, 'x', { duration: .5 });
          const yTo = gsap.quickTo(button, 'y', { duration: .5 });
          const move = (event: PointerEvent) => { const r = button.getBoundingClientRect(); xTo((event.clientX - r.left - r.width / 2) * .15); yTo((event.clientY - r.top - r.height / 2) * .2); };
          const leave = () => { xTo(0); yTo(0); };
          button.addEventListener('pointermove', move); button.addEventListener('pointerleave', leave);
          cleanups.push(() => { button.removeEventListener('pointermove', move); button.removeEventListener('pointerleave', leave); });
        });
      }
    }, root);
    return () => { cleanups.forEach(cleanup => cleanup()); context.revert(); };
  }, [rootRef, reduced]);
}
