import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useScrambleReveal, useWeightProximity, useMobileScrollReveal } from '../lib/effects';
import { links } from '../tokens';
import { GlobeFooter } from './GlobeFooter';
import { StarIcon } from './StarIcon';

const offers = [
  {
    title: 'AI Agents',
    summary: 'Support, sales, and ops handoffs that run without waiting on a person.',
    detail:
      'Designed around real permissions, guardrails, and outcomes — so tickets, follow-ups, and intake stop eating the week.',
    forWhom: 'Teams drowning in repeating conversations.',
    image: '/images/offer-agents-tower.webp',
    caption: 'Agents / real work',
  },
  {
    title: 'Workflow Automation',
    summary: 'End-to-end flows across the tools you already use.',
    detail:
      'We map the handoffs, cut brittle copy-paste, and ship reliable automation your team can operate day to day.',
    forWhom: 'Operators tired of systems that don’t talk.',
    image: '/images/offer-workflows-weave.webp',
    caption: 'Workflows / operations',
  },
  {
    title: 'Custom AI Products',
    summary: 'Software with intelligence at the core — when a workflow isn’t enough.',
    detail:
      'From product shape through interface and model orchestration to something that ships in production.',
    forWhom: 'Founders with a clear problem and no off-the-shelf fix.',
    image: '/images/offer-products-craft.webp',
    caption: 'Products / engineering',
  },
] as const;

const methodStages = [
  {
    phase: 'Diagnose',
    window: 'Week 01',
    summary: 'One working session on where the hours actually go.',
    deliverable:
      'A map of your repeating work, ranked by hours lost — and the one thing to automate first.',
    panel: {
      kind: 'code' as const,
      lines: [
        { text: '// map the repeating work', muted: true },
        { text: 'const audit = await review(team.week);' },
        { text: '' },
        { text: '// rank by hours lost', muted: true },
        { text: 'audit.sort((a, b) => b.hours - a.hours);' },
        { text: '' },
        { text: '> First to automate: intake triage', strong: true },
      ],
    },
  },
  {
    phase: 'Build',
    window: 'Weeks 02—04',
    summary: 'We ship the first system into your real stack, not a sandbox.',
    deliverable:
      'A running agent or workflow, wired to your tools, with guardrails and a rollback path.',
    panel: {
      kind: 'flow' as const,
      nodes: ['Your tools', 'Agent', 'Guardrails'],
    },
  },
  {
    phase: 'Run',
    window: 'Ongoing',
    summary: 'We watch it work, tune it, and hand you the controls.',
    deliverable:
      'Weekly numbers on what it handled, what it escalated, and what it saved.',
    panel: {
      kind: 'bars' as const,
      bars: [28, 44, 36, 58, 47, 72, 61, 88],
    },
  },
] as const;

function MethodPanel({ panel }: { panel: (typeof methodStages)[number]['panel'] }) {
  if (panel.kind === 'code') {
    return (
      <div className="method-panel method-panel--code" aria-hidden="true">
        {panel.lines.map((line, i) => (
          <span
            key={i}
            className={
              'muted' in line ? 'is-muted' : 'strong' in line ? 'is-strong' : undefined
            }
          >
            {line.text || ' '}
          </span>
        ))}
      </div>
    );
  }
  if (panel.kind === 'flow') {
    return (
      <div className="method-panel method-panel--flow" aria-hidden="true">
        {panel.nodes.map((node, i) => (
          <div className="method-flow__node" key={node}>
            <span>{node}</span>
            {i < panel.nodes.length - 1 && <i className="method-flow__link" />}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="method-panel method-panel--bars" aria-hidden="true">
      <div className="method-bars__head">
        <span>Handled / week</span>
        <span>+ climbing</span>
      </div>
      <div className="method-bars__chart">
        {panel.bars.map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

const fitSignals = [
  {
    title: 'The same work keeps coming back',
    copy: 'Support replies, lead follow-ups, status updates — anything your team does on loop.',
    image: '/images/fit-repeat.jpg',
  },
  {
    title: 'Leads or tickets leak through cracks',
    copy: 'The process lives in chat threads and memory, so people drop the ball.',
    image: '/images/fit-leaks.jpg',
  },
  {
    title: 'Volume is rising faster than headcount',
    copy: 'You need leverage before you hire another full-time seat.',
    image: '/images/fit-volume.jpg',
  },
  {
    title: 'You want AI that ships into real ops',
    copy: 'Not a demo. Something that runs inside how your company already works.',
    image: '/images/fit-realops.jpg',
  },
] as const;

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 18 12" aria-hidden="true">
      <path d="M1 6h15M11.5 1.5 16 6l-4.5 4.5" />
    </svg>
  );
}

function useSectionReveal<T extends HTMLElement>(): RefObject<T | null> {
  const rootRef = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        const trigger = { trigger: element, start: 'top 88%', once: true } as const;
        if (element.dataset.reveal === 'mask') {
          // Headline rise — the line climbs out of its own baseline clip.
          gsap.fromTo(
            element,
            { clipPath: 'inset(0% 0% 100% 0%)', y: 64 },
            {
              clipPath: 'inset(0% 0% -14% 0%)',
              y: 0,
              duration: 1.35,
              ease: 'power4.out',
              scrollTrigger: trigger,
            },
          );
          return;
        }
        if (element.dataset.reveal === 'words') {
          // Split into masked words once, then each word climbs out of its
          // own clip with a slight settle — visibly typographic, not a fade.
          if (!element.dataset.split) {
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            const textNodes: Text[] = [];
            while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
            textNodes.forEach((node) => {
              const fragment = document.createDocumentFragment();
              (node.textContent ?? '').split(/(\s+)/).forEach((word) => {
                if (!word) return;
                if (/^\s+$/.test(word)) {
                  fragment.appendChild(document.createTextNode(' '));
                  return;
                }
                const mask = document.createElement('span');
                mask.className = 'word-mask';
                const inner = document.createElement('span');
                inner.textContent = word;
                mask.appendChild(inner);
                fragment.appendChild(mask);
              });
              node.parentNode?.replaceChild(fragment, node);
            });
            element.dataset.split = 'true';
          }
          gsap.fromTo(
            element.querySelectorAll('.word-mask > span'),
            { yPercent: 112, rotate: 5 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.15,
              stagger: 0.055,
              ease: 'power4.out',
              scrollTrigger: trigger,
            },
          );
          return;
        }
        if (element.dataset.reveal === 'rail') {
          // Rails settle label by label, left to right.
          gsap.fromTo(
            element.children,
            { y: 14, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.09,
              ease: 'power3.out',
              scrollTrigger: trigger,
            },
          );
          return;
        }
        gsap.fromTo(
          element,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: trigger,
          },
        );
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return rootRef;
}

// A soft graphite shadow that trails the cursor across the paper sections.
export function CursorSheen() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
    const fade = gsap.quickTo(el, 'opacity', { duration: 0.5, ease: 'power2.out' });
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = parent.getBoundingClientRect();
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);
      fade(1);
    };
    const onLeave = () => fade(0);
    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);
    return () => {
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return <div ref={ref} className="cursor-sheen" aria-hidden="true" />;
}

export function Offer() {
  const [active, setActive] = useState(0);
  const ref = useSectionReveal<HTMLElement>();
  useScrambleReveal(ref, '.section-rail span');
  useMobileScrollReveal(ref);
  const reducedMotion = useReducedMotion();

  // Expanding specimen panels: the active pane grows and resolves its copy in;
  // the closed panes stay as ruled spines carrying just numeral + title. The
  // copy re-animates on each change so switching feels like a fresh reveal.
  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) return;
    // Mobile uses the scroll-scrubbed reveal instead; running both would
    // fight over the image transform.
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const pane = root.querySelector<HTMLElement>('.offer-pane.is-active');
    const content = pane?.querySelector<HTMLElement>('.offer-pane__content');
    if (!pane || !content) return;
    const media = pane.querySelector<HTMLElement>('.offer-pane__media img');
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    // The heading climbs out of its own clip, then the supporting lines
    // settle underneath — the pane reads as a fresh page, not a fade.
    const heading = content.querySelector<HTMLElement>('h3');
    if (heading) {
      timeline.fromTo(
        heading,
        { yPercent: 108, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8 },
        0,
      );
    }
    timeline.fromTo(
      Array.from(content.children).filter((child) => child !== heading),
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 },
      0.14,
    );
    if (media) {
      timeline.fromTo(
        media,
        { scale: 1.14 },
        { scale: 1, duration: 1.4, ease: 'power2.out' },
        0,
      );
    }
    return () => {
      timeline.kill();
    };
  }, [active, reducedMotion, ref]);

  return (
    <section ref={ref} id="offer" className="offer editorial-section" aria-labelledby="offer-title">
      <div className="section-rail" data-reveal="rail">
        <span>01 / Offer</span>
        <span>What we build</span>
        <span>01—03</span>
      </div>

      <div className="offer-head" data-reveal>
        <h2 id="offer-title">
          Three ways we put <em className="serif-accent">intelligence to work.</em>
        </h2>
        <p>Pick the shape of the problem. Every engagement ships something running.</p>
      </div>

      <div className="offer-accordion" role="tablist" aria-label="What we build" data-reveal>
        {offers.map((offer, index) => {
          const isActive = active === index;
          return (
            <article
              key={offer.title}
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              className={`offer-pane${isActive ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setActive(index);
                }
              }}
            >
              <div className="offer-pane__media" aria-hidden="true">
                <img src={offer.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
              </div>

              <div className="offer-pane__spine" aria-hidden="true">
                <span className="offer-pane__num">0{index + 1}</span>
                <span className="offer-pane__label">{offer.title}</span>
              </div>

              <div className="offer-pane__content">
                <p className="offer-pane__eyebrow">{offer.caption}</p>
                <h3>{offer.title}</h3>
                <p className="offer-pane__summary">{offer.summary}</p>
                <p className="offer-pane__detail">{offer.detail}</p>
                <span className="offer-pane__for">For — {offer.forWhom}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Method() {
  const ref = useSectionReveal<HTMLElement>();
  useWeightProximity(ref);
  useScrambleReveal(ref, '.section-rail span, .method-stage__window');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.method-card'));
    if (!cards.length) return;
    const context = gsap.context(() => {
      cards.forEach((card, index) => {
        // Each card shrinks and dims as the next one slides up to cover it —
        // the stack reads as depth, not a flat list.
        if (index < cards.length - 1) {
          const next = cards[index + 1];
          gsap.fromTo(
            card,
            { scale: 1, opacity: 1 },
            {
              scale: 0.92,
              opacity: 0.45,
              ease: 'none',
              scrollTrigger: {
                trigger: next,
                start: 'top 90%',
                end: 'top 30%',
                scrub: 0.5,
              },
            },
          );
        }

        // Deal-in: the arriving card rises, un-tilts from a perspective lean
        // and wipes open through its own clip — scrub-linked, so the scroll
        // itself lays each page onto the stack.
        gsap.fromTo(
          card,
          {
            y: 110,
            rotateX: 9,
            transformPerspective: 1100,
            clipPath: 'inset(4% 3% 30% 3% round 1.2rem)',
          },
          {
            y: 0,
            rotateX: 0,
            clipPath: 'inset(0% 0% 0% 0% round 1.2rem)',
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 50%', scrub: 0.5 },
          },
        );

        // Ghost numeral drifts against the card while it travels — the
        // background never reads as frozen wallpaper.
        const ghost = card.querySelector<HTMLElement>('.method-card__ghost');
        if (ghost) {
          gsap.fromTo(
            ghost,
            { yPercent: 34, rotate: 5 },
            {
              yPercent: -8,
              rotate: 0,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 25%', scrub: 0.6 },
            },
          );
        }

        // Split the phase word into masked letters once — same climb the
        // footer wordmark uses, so the display language stays consistent.
        const heading = card.querySelector<HTMLElement>('h3');
        if (heading && !heading.dataset.split) {
          const text = heading.textContent ?? '';
          heading.textContent = '';
          for (const char of text) {
            const mask = document.createElement('span');
            mask.className = 'm-mask';
            const inner = document.createElement('span');
            inner.textContent = char;
            mask.appendChild(inner);
            heading.appendChild(mask);
          }
          heading.dataset.split = 'true';
        }

        const letters = card.querySelectorAll<HTMLElement>('h3 .m-mask > span');
        const header = card.querySelector<HTMLElement>('.method-card__copy header');
        const support = card.querySelectorAll<HTMLElement>(
          '.method-card__summary, .method-card__deliverable',
        );
        const panel = card.querySelector<HTMLElement>('.method-panel');

        // Content starts hidden the moment the effect mounts so nothing
        // flashes fully-formed while the card is still dealing in.
        gsap.set(letters, { yPercent: 112, rotate: 6 });
        if (header) gsap.set(header, { y: 16, opacity: 0 });
        gsap.set(support, { y: 26, opacity: 0 });
        if (panel) gsap.set(panel, { y: 34, opacity: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: 'power4.out' },
          scrollTrigger: { trigger: card, start: 'top 62%', once: true },
        });
        if (header) timeline.to(header, { y: 0, opacity: 1, duration: 0.5 }, 0);
        timeline.to(letters, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.05 }, 0.06);
        timeline.to(support, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, 0.3);
        if (panel) timeline.to(panel, { y: 0, opacity: 1, duration: 0.7 }, 0.2);

        // The panel visual performs as it lands — typed code, a diagram
        // drawing itself, bars growing — instead of sitting pre-rendered.
        const codeLines = card.querySelectorAll<HTMLElement>('.method-panel--code span');
        if (codeLines.length) {
          gsap.set(codeLines, { clipPath: 'inset(0% 100% 0% 0%)' });
          timeline.to(
            codeLines,
            { clipPath: 'inset(0% -2% 0% 0%)', duration: 0.45, stagger: 0.09, ease: 'power2.out' },
            0.45,
          );
          const strong = card.querySelector<HTMLElement>('.method-panel--code .is-strong');
          if (strong) {
            timeline.fromTo(
              strong,
              { color: 'rgba(243, 243, 241, 0.2)' },
              { color: '#ffffff', duration: 0.6, ease: 'power2.inOut' },
              1.1,
            );
          }
        }
        const flowNodes = card.querySelectorAll<HTMLElement>('.method-flow__node span');
        const flowLinks = card.querySelectorAll<HTMLElement>('.method-flow__link');
        if (flowNodes.length) {
          gsap.set(flowNodes, { scale: 0.7, y: 10, opacity: 0 });
          gsap.set(flowLinks, { scaleY: 0, transformOrigin: '50% 0%' });
          flowNodes.forEach((node, i) => {
            const at = 0.5 + i * 0.3;
            timeline.to(node, { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' }, at);
            if (flowLinks[i]) {
              timeline.to(flowLinks[i], { scaleY: 1, duration: 0.3, ease: 'power2.out' }, at + 0.18);
            }
          });
        }
        const bars = card.querySelectorAll<HTMLElement>('.method-bars__chart i');
        if (bars.length) {
          const head = card.querySelectorAll<HTMLElement>('.method-bars__head span');
          gsap.set(bars, { scaleY: 0, transformOrigin: '50% 100%' });
          gsap.set(head, { opacity: 0, y: 8 });
          timeline.to(head, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.5);
          timeline.to(bars, { scaleY: 1, duration: 0.8, stagger: 0.07 }, 0.55);
        }
      });
    }, root);
    return () => context.revert();
  }, [ref, reducedMotion]);

  return (
    <section ref={ref} id="method" className="method editorial-section" aria-labelledby="method-title">
      <div className="section-rail" data-reveal="rail">
        <span>02 / Method</span>
        <span>How an engagement runs</span>
        <span>Weeks, not quarters</span>
      </div>

      <div className="method-intro">
        <h2 id="method-title" data-reveal="words">
          No decks. A system <em className="serif-accent">running in weeks.</em>
        </h2>
        <p data-reveal>
          We’re an early studio, so we won’t show you logos — we’ll show you exactly what
          you get and when. Every engagement runs the same three moves.
        </p>
      </div>

      <div className="method-stack">
        {methodStages.map((stage, index) => (
          <article
            className="method-card"
            key={stage.phase}
            style={{ top: `calc(14vh + ${index * 2.2}rem)`, zIndex: index + 1 }}
          >
            <span className="method-card__ghost" aria-hidden="true">
              0{index + 1}
            </span>
            <div className="method-card__copy">
              <header>
                <span className="method-card__index">0{index + 1}</span>
                <span className="method-stage__window">{stage.window}</span>
              </header>
              <h3>{stage.phase}</h3>
              <p className="method-card__summary">{stage.summary}</p>
              <p className="method-card__deliverable">
                <span>You get</span>
                {stage.deliverable}
              </p>
            </div>
            <MethodPanel panel={stage.panel} />
          </article>
        ))}
      </div>

      <div className="method-note" data-reveal>
        <p>
          If the diagnosis says automation won’t pay for itself, we tell you that too —
          and you keep the map.
        </p>
      </div>
    </section>
  );
}

export function Fit() {
  const ref = useSectionReveal<HTMLElement>();
  useWeightProximity(ref);
  useScrambleReveal(ref, '.section-rail span');
  // Touch has no hover, so a tap toggles the smaller inline reveal — the
  // mobile mirror of the desktop cursor-follow preview.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Cursor-following preview (technique after OriginKit "Hover Image
  // Reveal"): a photo window trails the pointer over the signal list, and
  // switching rows slides the reel directionally — down-list pushes the old
  // frame up, up-list pushes it down.
  const previewRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    const preview = previewRef.current;
    if (!root || !preview || reducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    gsap.set(preview.querySelectorAll('.fit-preview__item'), { yPercent: 102 });
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
    const rTo = gsap.quickTo(preview, 'rotation', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    let settle: ReturnType<typeof setTimeout>;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = root.getBoundingClientRect();
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);
      rTo(gsap.utils.clamp(-7, 7, (event.clientX - lastX) * 0.4));
      lastX = event.clientX;
      clearTimeout(settle);
      settle = setTimeout(() => rTo(0), 90);
    };
    root.addEventListener('pointermove', onMove);
    return () => {
      clearTimeout(settle);
      root.removeEventListener('pointermove', onMove);
    };
  }, [ref, reducedMotion]);

  const setPreview = useCallback(
    (index: number | null) => {
      const preview = previewRef.current;
      if (!preview || reducedMotion) return;
      gsap.to(preview, {
        autoAlpha: index === null ? 0 : 1,
        scale: index === null ? 0.88 : 1,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      preview.querySelectorAll<HTMLElement>('.fit-preview__item').forEach((item, i) => {
        const target = index === null ? 102 : i < index ? -102 : i > index ? 102 : 0;
        gsap.to(item, { yPercent: target, duration: 0.6, ease: 'power4.out', overwrite: 'auto' });
      });
    },
    [reducedMotion],
  );

  return (
    <section ref={ref} id="fit" className="fit editorial-section" aria-labelledby="fit-title">
      <div className="section-rail" data-reveal="rail">
        <span>03 / Fit</span>
        <span>When to call</span>
        <span>Selective</span>
      </div>

      <div className="fit-stage">
        <div className="fit-sticky" data-reveal>
          <h2 id="fit-title" data-reveal="words">
            Call us when the work is <em className="serif-accent">already clear.</em>
          </h2>
          <p>
            We’re an early studio taking a small number of projects. If one of these is you, we should talk.
          </p>
          <a className="fit-sticky__cta" href={links.whatsapp} target="_blank" rel="noreferrer">
            Book a call <ArrowIcon />
          </a>
        </div>

        <div className="fit-signals" onMouseLeave={() => setPreview(null)}>
          {fitSignals.map((signal, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                className={`fit-signal${isOpen ? ' is-open' : ''}`}
                key={signal.title}
                data-reveal
                onMouseEnter={() => setPreview(index)}
              >
                <span className="fit-signal__index">0{index + 1}</span>
                <div className="fit-signal__body">
                  <h3>{signal.title}</h3>
                  <p>{signal.copy}</p>
                </div>
                <button
                  type="button"
                  className="fit-signal__peek"
                  aria-expanded={isOpen}
                  aria-label={isOpen ? 'Hide preview' : 'Reveal preview'}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {isOpen ? 'Hide' : 'View'} <ArrowIcon />
                </button>
                <div className="fit-signal__thumb" aria-hidden={!isOpen}>
                  <img src={signal.image} alt="" loading="lazy" />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div ref={previewRef} className="fit-preview" aria-hidden="true">
        {fitSignals.map((signal) => (
          <div className="fit-preview__item" key={signal.image}>
            <img src={signal.image} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

// The globe band stands on its own so the delivery story lands before the
// ask — worldwide proof first, then the contact CTA closes the page.
export function WorldBand() {
  const ref = useSectionReveal<HTMLElement>();
  useScrambleReveal(ref, '.world-band__eyebrow');

  return (
    <section ref={ref} id="world" className="world-band editorial-section" aria-labelledby="world-title">
      <div className="world-band__head" data-reveal>
        <p className="world-band__eyebrow">04 / Everywhere</p>
        <h2 id="world-title">
          Built in India. <em className="serif-accent">Shipped worldwide.</em>
        </h2>
        <p className="world-band__note">
          Remote-first, timezone-fluent. Your systems run where your customers are.
        </p>
      </div>

      <GlobeFooter />
    </section>
  );
}

export function Contact() {
  const ref = useSectionReveal<HTMLElement>();
  useWeightProximity(ref);
  useScrambleReveal(ref, '.section-rail span, .contact-meta span');
  const wordRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const word = wordRef.current;
    if (!word || reducedMotion) return;
    const letters = word.querySelectorAll<HTMLElement>(':scope > span:not(.contact-star-anchor)');
    const context = gsap.context(() => {
      // The star spins onto the seam once the letters have landed.
      gsap.fromTo(
        word.querySelector('.contact-wordmark__star'),
        { opacity: 0, scale: 0.4, rotate: -160 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.9,
          delay: 0.55,
          ease: 'power3.out',
          scrollTrigger: { trigger: word, start: 'top 96%', once: true },
        },
      );
      // Each letter climbs out of the fold as the footer lands.
      gsap.fromTo(
        letters,
        { yPercent: 104, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.1,
          stagger: 0.045,
          ease: 'power4.out',
          scrollTrigger: { trigger: word, start: 'top 96%', once: true },
        },
      );
      // ...then drifts on scroll so the block never feels frozen.
      gsap.to(word, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
      });
    }, word);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <footer ref={ref} id="contact" className="contact editorial-section">
      <div className="section-rail contact-rail" data-reveal="rail">
        <span>05 / Contact</span>
        <span>Start a project</span>
        <span>Select projects</span>
      </div>

      <div className="contact-field">
        <h2 data-reveal="words">
          Let’s remove the work
          <span className="serif-accent">that shouldn’t exist.</span>
        </h2>
        <p className="contact-intro" data-reveal>
          Tell us where work gets stuck. One conversation — we’ll show what to automate first.
        </p>
        <div className="contact-actions" data-reveal>
          <a className="contact-project-link" href={links.whatsapp} target="_blank" rel="noreferrer">
            <span>Book a call</span>
            <ArrowIcon />
          </a>
          <div className="contact-channels">
            <a href={links.whatsapp} target="_blank" rel="noreferrer">
              <ArrowIcon /> WhatsApp
            </a>
            <a href="mailto:hello@grenwall.org">
              <ArrowIcon /> hello@grenwall.org
            </a>
          </div>
        </div>
        <div className="contact-meta" data-reveal>
          <span>India / Working globally</span>
          <span>
            <i /> Available for select projects
          </span>
        </div>
      </div>

      <div className="contact-close">
        <div ref={wordRef} className="contact-wordmark" aria-hidden="true">
          {'GREN'.split('').map((letter, index) => (
            <span key={`left-${index}`}>{letter}</span>
          ))}
          {/* Zero-width anchor — the star overlaps the N–W seam, logo-style. */}
          <span className="contact-star-anchor">
            <span className="contact-star-center">
              <span className="contact-wordmark__star">
                <StarIcon />
              </span>
            </span>
          </span>
          {'WALL'.split('').map((letter, index) => (
            <span key={`right-${index}`}>{letter}</span>
          ))}
        </div>
      </div>

      <div className="site-footer">
        <div className="site-footer__brand">
          <p className="site-footer__tag">AI systems, automation, and products — built in India, shipped worldwide.</p>
        </div>

        <nav className="site-footer__col" aria-label="Contact">
          <p className="site-footer__head">Talk to us</p>
          <a href={links.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp <span>{links.whatsappPhoneDisplay}</span>
          </a>
          <a href={`mailto:${links.email}`}>
            Email <span>{links.email}</span>
          </a>
        </nav>

        <nav className="site-footer__col" aria-label="Social">
          <p className="site-footer__head">Follow</p>
          <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>

        <div className="site-footer__col site-footer__meta">
          <p className="site-footer__head">Studio</p>
          <span>India / Working globally</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </div>

      <div className="site-footer__base">
        <span>© 2026 Grenwall</span>
        <span className="site-footer__base-star" aria-hidden="true">
          <StarIcon />
        </span>
        <span>If the work repeats, it can be automated.</span>
      </div>
    </footer>
  );
}
