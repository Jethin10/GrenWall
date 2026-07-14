import { useEffect, useRef, useState, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { links } from '../tokens';

const capabilities = [
  {
    title: 'AI Agents',
    summary: 'Intelligent agents that work, decide and adapt on your behalf.',
    detail: 'From research and qualification to operations and support, we design agents around real permissions, guardrails and outcomes.',
  },
  {
    title: 'Workflow Automation',
    summary: 'End-to-end automation that replaces busywork and unlocks capacity.',
    detail: 'We map the handoffs across your tools, remove brittle repetition and build reliable flows your team can actually operate.',
  },
  {
    title: 'AI Products',
    summary: 'AI-native products designed to solve real problems and scale.',
    detail: 'We take focused ideas from product strategy through interface, model orchestration and production-ready implementation.',
  },
  {
    title: 'Strategy & Integration',
    summary: 'Strategic alignment, data architecture and seamless integration.',
    detail: 'We find the highest-leverage opportunities, define the system boundary and connect the right models to the right data.',
  },
];

const systems = [
  {
    title: 'AI Sales Operating System',
    description: 'Pipeline intelligence, deal velocity and revenue infrastructure.',
    image: '/images/ai-sales-system.png',
  },
  {
    title: 'Autonomous Support Layer',
    description: 'Intent recognition, context engine and resolution automation.',
    image: '/images/autonomous-support.png',
  },
];

const process = [
  ['Discover', 'We map the system, uncover the truth and find leverage.'],
  ['Design', 'We shape the blueprint, aligning strategy and flow.'],
  ['Build', 'We engineer the system with precision and control.'],
  ['Evolve', 'We optimize, learn and compound outcomes.'],
];

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 18 12" aria-hidden="true">
      <path d="M1 6h15M11.5 1.5 16 6l-4.5 4.5" />
    </svg>
  );
}

function useEditorialReveal<T extends HTMLElement>(): RefObject<T | null> {
  const rootRef = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const context = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.15,
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      });
      root.querySelectorAll<HTMLElement>('[data-image-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.4,
            scrollTrigger: { trigger: element, start: 'top 82%', once: true },
          },
        );
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return rootRef;
}

export function Manifesto() {
  const ref = useEditorialReveal<HTMLElement>();
  return (
    <section ref={ref} className="manifesto editorial-section" aria-labelledby="manifesto-title">
      <div className="section-kicker" data-reveal>
        <span>00</span><span>Our point of view</span><span>Built to scale</span>
      </div>
      <h2 id="manifesto-title" data-reveal>
        We build the systems<br />
        between ambition<br />
        <span>and execution.</span>
      </h2>
      <div className="manifesto-note" data-reveal>
        <span>GRENWALL / 2026</span>
        <p>Strategy, product and engineering—brought together to make AI useful inside the way your company already works.</p>
      </div>
    </section>
  );
}

export function Capabilities() {
  const [active, setActive] = useState<number | null>(null);
  const ref = useEditorialReveal<HTMLElement>();
  return (
    <section ref={ref} id="capabilities" className="capabilities editorial-section" aria-labelledby="capabilities-title">
      <div className="section-heading" data-reveal>
        <span>01 / Capabilities</span>
        <h2 id="capabilities-title">What we build</h2>
      </div>
      <div className="capability-list">
        {capabilities.map((item, index) => {
          const isOpen = active === index;
          return (
            <article key={item.title} className={`capability-row${isOpen ? ' is-open' : ''}`} data-reveal>
              <button type="button" aria-expanded={isOpen} onClick={() => setActive(isOpen ? null : index)}>
                <span className="capability-index">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span className="capability-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="capability-detail" aria-hidden={!isOpen}>
                <p>{item.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SelectedSystems() {
  const ref = useEditorialReveal<HTMLElement>();
  return (
    <section ref={ref} id="systems" className="systems editorial-section" aria-labelledby="systems-title">
      <div className="section-heading section-heading--row" data-reveal>
        <span>02 / Selected systems</span>
        <h2 id="systems-title">Proof through systems</h2>
      </div>
      <div className="systems-grid">
        {systems.map((system, index) => (
          <article className="system-card" key={system.title}>
            <div className="system-image" data-image-reveal>
              <img src={system.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
              <span>0{index + 1}</span>
            </div>
            <div className="system-copy" data-reveal>
              <h3>{system.title}</h3>
              <p>{system.description}</p>
              <ArrowIcon />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Process() {
  const ref = useEditorialReveal<HTMLElement>();
  return (
    <section ref={ref} id="process" className="process editorial-section" aria-labelledby="process-title">
      <div className="section-heading section-heading--row" data-reveal>
        <span>03 / Our approach</span>
        <h2 id="process-title">From friction to flow</h2>
      </div>
      <div className="process-line" data-reveal>
        {process.map(([title, copy], index) => (
          <article key={title}>
            <span className="process-dot" aria-hidden="true" />
            <small>0{index + 1}</small>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <div className="process-statement" data-reveal>
        <span>Systems that think.</span>
        <span>Workflows that flow.</span>
        <span>Products that compound.</span>
      </div>
    </section>
  );
}

export function Contact() {
  const ref = useEditorialReveal<HTMLElement>();
  return (
    <footer ref={ref} id="contact" className="contact editorial-section">
      <div className="section-kicker" data-reveal>
        <span>04</span><span>Let’s work</span><span>One useful conversation</span>
      </div>
      <div className="contact-main">
        <h2 data-reveal>Let’s remove the work<br />that shouldn’t exist.</h2>
        <a className="contact-cta" href={links.whatsapp} target="_blank" rel="noreferrer" data-reveal>
          Start a project <ArrowIcon />
        </a>
      </div>
      <div className="footer-rail" data-reveal>
        <a href="#home">Grenwall</a>
        <span>India / Worldwide</span>
        <a href="#systems">LinkedIn</a>
        <a href="#contact">Instagram</a>
        <a href={links.whatsapp} target="_blank" rel="noreferrer">{links.whatsappPhoneDisplay}</a>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
