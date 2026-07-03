import { motion } from 'framer-motion';
import { RevealText } from './RevealText';
import { AgentMark } from './AgentMark';
import { ClipReveal } from './ClipReveal';
// StatBand is intentionally unused for now — see the comment near the
// bottom of this file and StatBand.tsx for how to wire in real numbers later.
// import { StatBand } from './StatBand';

const VALUE_STATEMENTS = ['Custom-built. Never templated.', 'IP stays with Grenwall.', 'Strategy and build, one team.'];

export function WhyGrenwall() {
  return (
    <section id="why-grenwall" className="relative bg-void px-6 py-24 md:py-32">
      <ClipReveal className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center">
          <AgentMark />
          <div className="label-mono">04 — Why Grenwall</div>
        </div>
        <RevealText
          as="h2"
          lines={['Built to last.']}
          className="max-w-2xl font-display text-4xl text-bone md:text-5xl"
        />

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
          {VALUE_STATEMENTS.map((statement, i) => (
            <motion.div
              key={statement}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-line pt-6"
            >
              <div className="label-mono mb-4">{String(i + 1).padStart(2, '0')}</div>
              <p className="font-display text-xl leading-snug text-bone md:text-2xl">{statement}</p>
            </motion.div>
          ))}
        </div>

        {/*
          Future: once Grenwall has real performance numbers to show
          (clients served, agents deployed, hours reclaimed, etc.), replace
          the value-statement grid above with the ready-made count-up grid:

          <StatBand stats={[
            { label: 'Agents deployed', value: 24 },
            { label: 'Hours reclaimed / month', value: 1200 },
            { label: 'Client retention', value: 98, suffix: '%' },
          ]} />
        */}
      </ClipReveal>
    </section>
  );
}
