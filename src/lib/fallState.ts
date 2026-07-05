/**
 * The shared "fall into the black hole" signal — how deep the scroll is
 * (`progress`, 0..1 over the whole document) and how fast we're falling
 * (`velocity`, a smoothed, normalized scroll speed). Written once per frame
 * by `FallController` and read inside render loops (the WebGL scene, the
 * starfield, the horizon crossing) so the fall can drive per-frame motion
 * without triggering React re-renders. Stays at rest ({0, 0}) whenever the
 * fall is inactive (mobile / reduced motion).
 */
export const fallState = {
  progress: 0,
  velocity: 0,
};

/**
 * The intro's own multipliers on top of the scroll-driven fall — how the
 * *same* black hole instance is made to swell to fill the screen during the
 * loading sequence and then settle back down into its hero resting size and
 * brightness (both at exactly 1 once the intro completes). Written by
 * `Preloader` only; read by `GrenwallScene` every frame. Kept at rest (1, 1)
 * once the intro is done, so there is nothing left to converge — the object
 * the intro reveals *is* the hero's object, continuously.
 */
export const introState = {
  zoom: 1,
  glow: 1,
};

/**
 * Shapes raw scroll progress into the fall's intensity. Deliberately
 * back-loaded: a gentle, steady descent for most of the page (so the disk
 * stays moderate and content behind it stays readable), then a hard surge in
 * the final stretch — the tidal pull spiking as you cross the event horizon.
 */
export function fallCurve(p: number): number {
  const eased = p * p * (3 - 2 * p); // smoothstep — the steady descent
  const surge = Math.min(Math.max((p - 0.8) / 0.2, 0), 1); // last 20% only
  return eased * 0.3 + surge * surge * 0.7;
}
