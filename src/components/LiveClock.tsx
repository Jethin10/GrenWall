import { useEffect, useState } from 'react';

/** A small ticking local-time readout — functional chrome, not a slogan. */
export function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return (
    <span className="label-mono tabular-nums" aria-hidden="true">
      {hh}:{mm}:{ss}
    </span>
  );
}
