import { useReducedMotion } from '../lib/useReducedMotion';

interface MarqueeProps {
  text: string;
}

/** A single slow, kinetic type strip. Used once, between two sections. */
export function Marquee({ text }: MarqueeProps) {
  const reducedMotion = useReducedMotion();
  const item = (key: string) => (
    <span key={key} className="shrink-0 pr-10 font-display text-3xl uppercase tracking-tight text-bone/40 md:text-4xl">
      {text}
    </span>
  );

  return (
    <div className="overflow-hidden border-y border-line py-7" aria-hidden="true">
      {reducedMotion ? (
        <div className="flex justify-center">{item('static')}</div>
      ) : (
        <div className="flex w-max animate-marquee">
          {item('a')}
          {item('b')}
        </div>
      )}
    </div>
  );
}
