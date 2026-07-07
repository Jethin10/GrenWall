import { useReducedMotion } from '../lib/useReducedMotion';

interface MarqueeProps {
  text: string;
}

/** A single slow, kinetic type strip. Used once, between two sections. */
export function Marquee({ text }: MarqueeProps) {
  const reducedMotion = useReducedMotion();
  const item = (key: string) => (
    <span
      key={key}
      className="text-faint shrink-0 pr-12 text-3xl tracking-tight md:text-4xl"
      style={{ fontVariationSettings: "'opsz' 32, 'wght' 500", letterSpacing: '-0.03em' }}
    >
      {text}
    </span>
  );

  return (
    <div className="rule overflow-hidden border-y py-7" aria-hidden="true">
      {reducedMotion ? (
        <div className="flex justify-center">{item('static')}</div>
      ) : (
        <div className="animate-marquee flex w-max">
          {item('a')}
          {item('b')}
        </div>
      )}
    </div>
  );
}
