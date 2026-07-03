# Grenwall Website — Full Theme Overhaul (match Podium + steven.com)

**Feed this to Claude Code inside the existing project.** Keep the good animation work (spreadsheet-fill, branching tree, capability tiles, magnetic buttons, talking cursor, click-to-copy) — but **replace the theme entirely**. New direction: match the look and feel of `podium.global` and `steven.com`, tailored to Grenwall. Drop the deep-green "Bastion" theme and drop the stone/monolith completely. `npm run dev` must run clean.

**References — emulate the aesthetic + animation patterns, tailored to us (own wordmark, own copy, own content — don't trace their assets):**
- `steven.com` — the minimal numeric loading intro.
- `podium.global` — the whole vibe: near-black world, heavy bold display type, a big centered centerpiece, the light→dark wipe, corner labels, plain-text lists, the oversized closing CTA.

---

## New theme — near-monochrome, black & bone (like the references)
Replace the tokens in `tailwind.config.js` and `src/tokens.ts`:
- **Background:** `#0A0A0B` (near-black, not pure #000)
- **Text:** `#F1EEE6` (warm bone white, not pure #FFF)
- **Muted** (secondary text, labels): `#6E6E6A`
- **Surface** (raised panels/tiles): `#141416`
- **Hairline:** `#26262A`
- **Accent — optional, ONE, used barely** (CTA hover, a single active state): a restrained warm ember `#C9772F`. Keep it near-invisible; the references are basically pure black/bone and the animation is the star. If in doubt, use none.

High contrast, huge negative space, confident. The page is black; the motion and type carry it.

## Typography — switch to heavy bold, drop the serif
Podium/steven use big, heavy **sans** display, not serif. Retire Fraunces for headlines.
- **Display:** a heavy grotesque sans, UPPERCASE, tight tracking, very bold (use Space Grotesk / Archivo / or Inter at 900 — whatever you can wire via fontsource cleanly). Big and loud.
- **Body:** Inter.
- **Labels:** JetBrains Mono (tiny, wide-tracked, uppercase).

---

## The hero centerpiece — a big animated GRENWALL wordmark (NOT a stone)
Where Podium rotates a rock, we put the **word GRENWALL**, huge and centered — the logo *is* the hero object.
- Big, heavy, uppercase. It **animates in** on load (letters draw/mask up, or assemble), then has quiet **kinetic life** — a subtle drift, a slight distortion or weight-shift on cursor proximity/hover, the accent barely grazing it. Give it presence and motion; it should feel alive, not pasted on.
- **Important — do NOT leave the hero as a bare wordmark on black.** Surround it with the full Podium furniture so it reads as a designed page, not an empty screen: minimal top nav (monogram left, a quiet `CONTACT` right), a short one-line sub-label under the wordmark, the WhatsApp CTA, a `SCROLL` cue, tiny corner micro-labels, and faint blueprint crop-mark guide lines framing the composition. Rich and full, like the references — never a lonely word on a black void.

---

## The opening/loading sequence
1. **Count (steven.com).** Full-screen panel, a large monospace counter ticks `0 → 100`, minimal. Thin crop-mark guide lines + a few dashed markers fade in as it counts.
2. **The wipe (Podium).** At 100, the panel clip-path wipes away to reveal the black world and the GRENWALL wordmark already resolving into place. Weighty, deliberate. Under ~2s total.
3. Skipped under `prefers-reduced-motion` → straight to a static hero.

## Match Podium's site-wide feel
- **Oversized closing CTA** — big bold underlined WhatsApp CTA at the end (Podium's "WORK WITH US" energy), magnetic on hover.
- **Tiny corner micro-labels** — functional, not slogans (no cutesy taglines): a small live clock (local time), `SCROLL`, section indices like `01 — WHAT WE BUILD`, `©GRENWALL 2026` in the footer corner.
- **Plain-text confident list** + the **capability tiles** stay the mid-page centerpieces, retinted to the black/bone palette so they look as sharp as Podium's mosaic.
- **Crop-mark / blueprint hairlines** as a light recurring motif in dividers.
- **Minimal nav**, understated.

---

## Keep (retinted to black/bone)
- All existing animations — **spreadsheet-fill and branching tree stay the stars**, plus the agent-tree motif, capability tiles, magnetic springy buttons, talking cursor, click-to-copy. Just recolor them for the new palette.
- Lenis smooth-scroll, GSAP, Framer Motion. 60fps. `prefers-reduced-motion` + mobile fallbacks.
- WhatsApp CTA + click-to-copy: `https://wa.me/918008794433?text=Hi%20Grenwall%2C%20I%27d%20like%20to%20talk%20about%20AI%20automation%20for%20my%20business`. Only contact method.
- Sparse, plain copy — no cutesy taglines, no banned AI words (seamless, unlock, empower, transform, streamline, solutions, etc.).
- No fake info (no cities/offices, no stats, no email). StatBand stays stubbed.

---

The bar is these two sites. Load → counter → wipe → the GRENWALL wordmark alive and centered in a full, designed black page → rich animated sections below. Professional, premium, minimal, and unmistakably Grenwall.
