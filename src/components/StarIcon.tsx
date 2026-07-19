import { useId } from 'react';

interface StarIconProps {
  className?: string;
}

// The four-point gold star from the Grenwall wordmark. Sized in em so it
// scales with the surrounding type; facet overlay fakes the metallic bevel.
export function StarIcon({ className }: StarIconProps) {
  const gradientId = useId();

  return (
    <svg
      className={className ? `gw-star ${className}` : 'gw-star'}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="5" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EDD27C" />
          <stop offset="0.48" stopColor="#C9A23A" />
          <stop offset="1" stopColor="#7E5E17" />
        </linearGradient>
      </defs>
      <path
        d="M12 0C13.32 7.16 16.84 10.68 24 12C16.84 13.32 13.32 16.84 12 24C10.68 16.84 7.16 13.32 0 12C7.16 10.68 10.68 7.16 12 0Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M12 0C10.68 7.16 7.16 10.68 0 12C7.16 13.32 10.68 16.84 12 24Z"
        fill="#fff"
        opacity="0.2"
      />
    </svg>
  );
}
