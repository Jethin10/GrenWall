interface MonogramProps {
  className?: string;
}

/** The Grenwall "G" monogram — a plain, confident letterform in a bordered square. */
export function Monogram({ className = 'h-9 w-9 text-ember' }: MonogramProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="39" height="39" rx="8" stroke="currentColor" strokeOpacity="0.3" />
      <path
        d="M27 14.2C25.2 12 22.8 10.8 20 10.8c-5.4 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8c4.6 0 8.5-3.2 9.5-7.5H19.8v-3.4h13.2c.05.6.05 1.1.05 1.7 0 7-5.5 12.6-13.3 12.6C12 33.8 6.4 28.2 6.4 21S12 8.2 19.7 8.2c3.9 0 7.2 1.4 9.6 3.9L27 14.2z"
        fill="currentColor"
      />
    </svg>
  );
}
