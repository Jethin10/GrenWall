import { motion } from 'framer-motion';

/**
 * Recurring signature motif: a small dot that "wakes up" — pulsing bright,
 * then dispatching a tiny spark outward — as each section's kicker scrolls
 * into view. Threaded next to every section label so the agent feels
 * present throughout, not just in the hero.
 */
export function AgentMark() {
  return (
    <span className="relative mr-2 inline-flex h-1.5 w-1.5 align-middle">
      <motion.span
        className="absolute inline-block h-1.5 w-1.5 rounded-full bg-ember"
        initial={{ scale: 0.6, opacity: 0.35 }}
        whileInView={{ scale: [0.6, 1.8, 1], opacity: [0.35, 1, 0.85] }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        aria-hidden="true"
      />
      <motion.span
        className="absolute h-1 w-1 rounded-full bg-ember"
        initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
        whileInView={{ x: 10, y: -6, opacity: [0, 1, 0], scale: [1, 0.6, 0.3] }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
        aria-hidden="true"
      />
    </span>
  );
}
