import { CountUp } from './CountUp';

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

interface StatBandProps {
  stats: StatItem[];
}

/**
 * STUBBED FOR LATER — not currently rendered anywhere.
 *
 * Grenwall has no real performance numbers yet, so the live "Why Grenwall"
 * section (see `WhyGrenwall.tsx`) uses qualitative statements instead of
 * fabricated stats. Once real numbers exist (clients served, agents deployed,
 * hours reclaimed, etc.), drop them in here and uncomment the `<StatBand />`
 * usage inside `WhyGrenwall.tsx` to swap the qualitative band for a real,
 * count-up stat grid — no other changes required.
 *
 * Example usage once real numbers land:
 * <StatBand stats={[
 *   { label: 'Agents deployed', value: 24 },
 *   { label: 'Hours reclaimed / month', value: 1200 },
 *   { label: 'Client retention', value: 98, suffix: '%' },
 * ]} />
 */
export function StatBand({ stats }: StatBandProps) {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="font-display text-4xl text-ember md:text-5xl">
            <CountUp to={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix ?? ''} />
          </div>
          <div className="label-mono mt-3">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
