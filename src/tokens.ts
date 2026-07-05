/**
 * Grenwall Systems design tokens — deep space-black with a warm accretion
 * glow, built around the black-hole centerpiece (steven.com intro energy,
 * podium.global world). Single source of truth for values also mirrored in
 * `tailwind.config.js` (Tailwind can't import .ts at config time, so keep
 * the two in sync by hand).
 */

export const colors = {
  void: '#050506', // near-true black — deep space, never pure #000
  surface: '#0E0E10', // raised panels / tiles
  bone: '#F3EFE6', // warm bone white text, never pure #FFF
  muted: '#5C5C58', // secondary text, labels
  line: '#202024', // hairlines, crop marks
  ember: '#D8823A', // the one restrained UI accent — used sparingly
  emberSoft: 'rgba(216, 130, 58, 0.35)',
  emberGlow: 'rgba(216, 130, 58, 0.16)',
  // The accretion gradient — the star of the palette, reserved for the disk.
  accretionDeep: '#B8501A',
  accretionMid: '#E8912F',
  accretionHot: '#FFF2DC',
  lensing: '#6E4A9E', // whisper of chromatic fringe, barely there
} as const;

export const fonts = {
  display: "'Archivo Variable', 'Archivo', sans-serif",
  body: "'Inter Variable', 'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const easing = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  pop: 'back.out(2)', // springy overshoot for the button hover pop only
  cubic: [0.16, 1, 0.3, 1] as [number, number, number, number], // heavy, deliberate — the default everywhere else
} as const;

export const motion = {
  lenisLerp: 0.09,
  introDurationMs: 2200,
  cardTiltDeg: 10,
} as const;

export const links = {
  whatsapp:
    "https://wa.me/918008794433?text=Hi%20Grenwall%2C%20I%27d%20like%20to%20talk%20about%20AI%20automation%20for%20my%20business",
  whatsappPhoneDisplay: '+91 80087 94433',
} as const;

export const copy = {
  brand: 'GRENWALL SYSTEMS',
  monogram: 'G',
} as const;
