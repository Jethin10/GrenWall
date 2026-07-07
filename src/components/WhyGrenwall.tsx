import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { SplitLines } from './SplitLines';

interface Step {
  index: string;
  title: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    index: '01',
    title: 'Map',
    detail:
      'We sit with your team, walk the processes, and find the work that repeats. You get a clear picture of what to automate and in what order.',
  },
  {
    index: '02',
    title: 'Build',
    detail:
      'We design and build the agent or workflow against your real tools and real data — custom to how you operate, never a template.',
  },
  {
    index: '03',
    title: 'Deploy',
    detail:
      'It goes live inside your stack with guardrails, approvals and logging, so you can trust what it does before you stop checking.',
  },
  {
    index: '04',
    title: 'Scale',
    detail:
      'We monitor, maintain and extend. As the automation proves itself, we move down the list and take the next process off your plate.',
  },
];

/**
 * The process — a pinned left column holds the section title while the four
 * steps scroll past on the right, each revealing as it arrives.
 */
export function WhyGrenwall() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const pin = gsap.context(() => {
        gsap.to('[data-process-title]', {
          scrollTrigger: {
            trigger: '[data-process-grid]',
            start: 'top 20%',
            end: 'bottom 75%',
            pin: '[data-process-title]',
            pinSpacing: false,
          },
        });
      }, section);
      return () => pin.revert();
    });

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-process-step]').forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            scrollTrigger: { trigger: step, start: 'top 88%', once: true },
          },
        );
      });
    }, section);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="process" className="px-5 py-32 md:px-10 md:py-44">
      <div className="rule mb-6 flex items-center justify-between border-t pt-6">
        <SplitLines as="span" className="label-mono">
          Process
        </SplitLines>
        <span className="label-mono text-faint">04</span>
      </div>

      <div data-process-grid className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-8">
        <div>
          <div data-process-title>
            <SplitLines as="h2" className="text-h1 max-w-md text-[color:var(--fg)]">
              From first call to running quietly in the background.
            </SplitLines>
            <p className="text-body text-muted mt-8 max-w-sm">
              No big-bang projects. We automate one process at a time, prove the
              value, then move to the next.
            </p>
          </div>
        </div>

        <div>
          {STEPS.map((step) => (
            <div key={step.index} data-process-step className="rule border-t py-10 first:border-t-0 first:pt-0 md:py-12">
              <div className="flex items-baseline gap-6">
                <span className="label-mono text-faint">{step.index}</span>
                <div>
                  <h3 className="text-h2 text-[color:var(--fg)]">{step.title}</h3>
                  <p className="text-body text-muted mt-4 max-w-md">{step.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
