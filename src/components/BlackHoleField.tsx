import { Suspense, lazy, useEffect, useState } from 'react';
import { useShowBlackHole } from '../lib/useShowBlackHole';
import { SceneBoundary } from './SceneBoundary';

const Scene = lazy(() => import('../scenes/GrenwallScene'));

/**
 * The black hole as the spine of the page — a single, fixed, full-viewport
 * WebGL field behind all content. It never moves: instead the R3F camera
 * dollies toward the singularity as you scroll (see `fallState` /
 * `FallController`), so the whole page reads as one continuous fall inward.
 *
 * Mounted once, gated to desktop + motion. A radial mask feathers the canvas
 * edges so the bloom haze dissolves into the page rather than cutting off at
 * the WebGL buffer's rectangle. It's non-interactive (`pointer-events: none`)
 * so content stays clickable and the fall is driven purely by scroll. On
 * mobile / reduced motion it doesn't mount at all — a static monogram stands
 * in inside the hero and ending anchors instead.
 */
export function BlackHoleField() {
  const [mounted, setMounted] = useState(false);
  const show = useShowBlackHole();

  useEffect(() => {
    if (!show) return;
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        maskImage: 'radial-gradient(circle at 50% 48%, black 44%, transparent 82%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 48%, black 44%, transparent 82%)',
      }}
      aria-hidden="true"
    >
      {mounted && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      )}
      {/* A gentle global exposure clamp: a vignette that tapers the disk's
          outer glow and bloom before it reaches the mask's own edge, so
          nothing in the visible circle clips to a flat blown-out white. Pure
          CSS, inherits the same mask as the canvas above, so it only ever
          shows where the disk itself is visible. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 48%, transparent 40%, rgba(5,5,6,0.28) 68%, rgba(5,5,6,0.6) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
