# Grenwall Website — Upgrade Pass

**Feed this to Claude Code inside the existing project.** The current build is good — **keep it and improve on top of it, don't start over.** This pass does four things: (1) a new theme + palette that actually suits Grenwall and builds trust, (2) top-tier animations — keep every current one, push it further, add more, (3) less text and no cutesy taglines, (4) more richness so it never feels thin or boring. `npm run dev` must still run clean.

---

## New direction — "Bastion": trust & security by design
The name Grenwall has a **wall** in it. Lean all the way into that. A wall means protection, solidity, things handled and kept safe — which is exactly the feeling a founder needs before handing over their operations: *"these people are careful, this is safe, my business is in good hands."* Every design and motion choice should reinforce calm, control, and solidity. This is a psychological brief as much as a visual one: the site should make a visitor **trust** Grenwall.

White/paper is out — too plain, everyone uses it, no weight. Go deep and grounded instead.

### Palette — deep vault green + warm bone + one ember accent
Replace the tokens in `tailwind.config.js` **and** `src/tokens.ts`:
- **Background** (deep, grounded): `#0F1E19`
- **Surface** (raised panels / tiles): `#17271F`
- **Text** (warm bone): `#ECE6D8`
- **Muted** (sage-stone — secondary text, labels): `#8A9A8F`
- **Hairline / structure** (muted pine): `#2C4238`
- **Accent — warm ember** (the one bright note; CTAs, active states, key words, cursor tint): `#D2803C`

Why this works: deep green reads stable, premium, and calm — heritage and quiet confidence, not the neon-on-black AI cliché, not black-and-gold luxury, not basic white. The warm ember keeps it human instead of cold and robotic. One accent, used with discipline.

> **Alt** for more literal "corporate trust": swap the green base for deep ink-blue — background `#0E1621`, surface `#152233` — keep bone + ember, everything else identical.

### Wall motif (subtle, threaded throughout)
Fine architectural line-work — a keystone, a course of "bricks," load-bearing verticals — used sparingly as real structure (section dividers, the footer, the monogram). It should feel *built*, like it stands on rock. One signature moment: the wall quietly "builds itself" once, early. Never literal, never gimmicky.

---

## Copy — fewer words, no cutesy lines
- **Cut the try-hard taglines and wordplay.** Kill lines like "no mystery, only work." No clever little manifestos. Plain, confident, minimal.
- Let the design and animation carry the page. Words are sparse and load-bearing — every one earns its place.
- Keep the banned-AI-words rule (seamless, unlock, empower, supercharge, leverage, transform, cutting-edge, streamline, solutions, "the power of", etc.).

---

## Animations — keep everything, push to top-tier, add more
Keep every existing animation. Then raise the whole set to award-tier and expand it.

- **Spotlight the two that are already loved:** the **spreadsheet / Excel row filling itself**, and the **branching "tree" scene** (work/leads routing outward). Make these the stars — bigger, smoother, more detailed, more satisfying to watch. Add a few more scenes in the same family: a queue draining, an inbox sorting itself, a document assembling line-by-line, a schedule slotting into place, a stack of tasks flipping to "done."
- **Make the branch/tree a recurring motif** — an "agent tree" that grows and branches as work routes through it. Thread a small version through section transitions so the whole site reads as one connected system, not separate blocks.
- Push easing, stagger, and choreography everywhere to top-tier. Add a few more moments of delight — a section that assembles as you arrive, the wall building itself, the agent mark waking and dispatching a task. **Keep motion calm and deliberate** — calm reads as *in control and trustworthy*; frantic reads as nervous. That restraint is the point.
- Hold 60fps. Keep `prefers-reduced-motion` and mobile fallbacks.

---

## Don't be thin or boring
Add enough richness that it feels immersive, not a one-screen demo: a couple more animated capability tiles, more room to breathe between moments, the recurring tree motif tying sections together, the wall-build moment. **Rich in craft and motion, still sparse in words.** Length should come from things worth watching, never from filler text.

---

## Keep exactly as-is (retuned to the new palette)
- WhatsApp CTA + click-to-copy, wired to `https://wa.me/918008794433?text=Hi%20Grenwall%2C%20I%27d%20like%20to%20talk%20about%20AI%20automation%20for%20my%20business`. Only contact method.
- `prefers-reduced-motion` + mobile fallbacks. No fake stats, no email (StatBand stays stubbed).
- Fraunces (display, big & tight) / Inter (body) / JetBrains Mono (tiny labels).
- Lenis smooth-scroll, GSAP, Framer Motion.
- All existing signature pieces: preloader ceremony, talking cursor, magnetic springy buttons, cursor-reactive mark-field hero, capability tiles, agent mark, marquee. Retint every one of them to the deep-green + ember palette.

---

The bar: a founder lands on it and *feels* — before reading a word — that this is solid, careful, and safe to trust. Then stays, because every scroll keeps rewarding them with something worth watching.
