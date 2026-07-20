/**
 * Grenwall Systems design tokens — full monochrome reset. Warm off-white on
 * near-black, zero accent color: premium comes from type, spacing, and one
 * heavy ease. Single source of truth for values also mirrored in
 * `tailwind.config.js` (Tailwind can't import .ts at config time, so keep
 * the two in sync by hand).
 */

export const colors = {
  ink: '#080807', // near-black page ground — never pure #000
  bone: '#E8E8E3', // warm off-white — text on dark, page bg in light theme
  paper: '#E8E8E3', // light-theme section background (alias of bone)
  gray1: '#938F8A', // secondary text on dark
  gray2: '#524D47', // tertiary text / de-emphasized words
  gray3: '#393632', // faint text, hairline-adjacent
  card: '#181715', // raised surfaces on dark
  cardLight: '#DDDDD5', // raised surfaces on light
  inkOnLight: '#080807',
  hairline: 'rgba(232, 232, 227, 0.14)', // rules on dark
  hairlineLight: 'rgba(8, 8, 7, 0.14)', // rules on light
} as const;

export const fonts = {
  display: "'Inter Variable', 'Inter', sans-serif",
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
  introDurationMs: 1800,
} as const;

export const links = {
  whatsapp:
    "https://wa.me/918008794433?text=Hi%20Grenwall%2C%20I%27d%20like%20to%20talk%20about%20AI%20automation%20for%20my%20business",
  whatsappPhoneDisplay: '+91 80087 94433',
  email: 'hello@grenwall.org',
  instagram: 'https://www.instagram.com/grenwall.ai/',
  linkedin: 'https://www.linkedin.com/company/grenwall',
} as const;

export const copy = {
  brand: 'GRENWALL',
  brandFull: 'GRENWALL SYSTEMS',
  motto: 'If the work repeats, it can be automated.',
} as const;
