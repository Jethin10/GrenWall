const CORNERS = [
  { key: 'tl', className: 'top-6 left-6 border-l border-t' },
  { key: 'tr', className: 'top-6 right-6 border-r border-t' },
  { key: 'bl', className: 'bottom-6 left-6 border-b border-l' },
  { key: 'br', className: 'bottom-6 right-6 border-b border-r' },
] as const;

/** Faint blueprint crop-mark brackets + dashed target markers framing a composition — print registration marks, not decoration. */
export function CropFrame() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {CORNERS.map((corner) => (
        <div key={corner.key} className={`absolute h-6 w-6 border-line ${corner.className}`} />
      ))}
      <div className="absolute left-1/2 top-6 hidden h-2 w-2 -translate-x-1/2 border border-dashed border-line md:block" />
      <div className="absolute bottom-6 left-1/2 h-2 w-2 -translate-x-1/2 border border-dashed border-line" />
    </div>
  );
}
