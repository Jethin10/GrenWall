# Grenwall Website — Full Build Spec (steven.com intro + podium.global everything else)

**Feed this to Claude Code inside the existing project.** This is a full spec, not loose direction. Build to the exact caliber of `steven.com` and `podium.global`, tailored to Grenwall (AI automation + custom AI agents). **Keep and enhance the existing section-02 capability animations** (spreadsheet-fill, branching tree, etc.). Rewrite the theme, the intro, and the structure to match the references. `npm run dev` must run clean.

> Reference mapping:
> - **Intro / loading → like `steven.com`**, but *more complex and layered* — numeric counter, sketch-line reveal, cinematic multi-stage entrance.
> - **The signature object → a floating "crystal" with a G inside** (see §4). This replaces steven's two circular rings, and it's our version of Podium's rotating rock — the recurring hero + ending object.
> - **Everything else → like `podium.global`** — near-black world, heavy display type, crop-marks, plain-text lists, hover-to-play mosaic, oversized underlined end CTA.
> Emulate the feel and motion patterns; use our own wordmark, copy, crystal, and content — never reproduce their assets or text.

---

## 1. Theme & tokens (rewrite completely)
Near-monochrome, black + warm bone. Replace tokens in `tailwind.config.js` and `src/tokens.ts`:
- `bg` **#08080A**  · `ink` **#F2EFE7** (warm bone, never pure #FFF) · `muted` **#5F5F5C**
- `surface` **#121214** · `line` **#242428** · `accent` **#D8823A** (warm ember — ONE accent, used sparingly)

Very-low-opacity grain overlay throughout. High contrast, huge negative space.

## 2. Typography (rewrite)
- **Display:** heavy grotesque, UPPERCASE, tight, weight 800–900 (Space Grotesk or Archivo via `@fontsource`).
- **Body:** Inter. **Micro-labels:** JetBrains Mono, tiny, uppercase, wide-tracked.

## 3. Global motion systems (build once, reuse everywhere)
- **Lenis** smooth momentum scroll (lerp ~0.09).
- **Morphing custom cursor** — bone dot + lagging ring, grows over interactive things, becomes a filled mono pill (`VIEW`/`OPEN`/`DRAG`/`COPY`) in `data-cursor` zones.
- **Reveal system** — every block enters with a **clip-path wipe** + slight rise, staggered, via GSAP ScrollTrigger; headlines mask up line-by-line.
- **Magnetic buttons** — spring-overshoot scale ~1.10, magnetic pull, ember fill sweep.
- **Crop-mark furniture** — corner ticks, dashed guide lines, dashed square markers framing compositions; reused in dividers.
- **Easing** — heavy deliberate cubic-beziers (`cubic-bezier(0.16,1,0.3,1)`). Calm = premium.
- All respect `prefers-reduced-motion` and downgrade on mobile.

---

## 3.5 Complexity & density — make it feel like Podium, NOT a stacked template
The current build feels basic because it's blocks stacked vertically. Podium feels *complex* because scenes are choreographed, pinned, and connected. Apply these throughout:
- **Scene-to-scene transitions, not hard cuts.** Sections hand off — one clip-path-wipes or slides into the next, backgrounds shift tone, the crystal drifts/scales between them so the whole page reads as one continuous world.
- **The crystal persists and travels.** It doesn't only live in the hero and ending — it shrinks into a corner, tucks behind text, re-emerges, and reacts as you scroll. It's the thread tying every scene together.
- **Pinned scroll-scrub sequences.** At least two sections **pin** while their content advances on scroll (GSAP ScrollTrigger scrub): the capability mosaic reveals tile-by-tile as you scroll through it; the "what we build" trio advances one at a time. Scroll drives the animation, not just triggers it.
- **One horizontal-scroll reel.** A section that scrolls sideways as you scroll down (Podium's signature) — use it for the capability scenes or an approach/process reel.
- **Depth & parallax.** Layer foreground/mid/background at different scroll speeds; text and crop-marks drift at different rates. Add subtle mouse-parallax so the composition breathes as the cursor moves.
- **Numbered index system.** Big section indices (`01 / 02 / 03…`) that animate as you pass them, plus a running progress marker — the editorial "system" feel both references have.
- **Micro-interactions everywhere.** Link underlines that wipe, arrows that nudge on hover, counters that count up, labels that flicker in, hover states that reveal hidden content. Every interactive thing does something.
- **Density of motion, not text.** More things moving, revealing, and reacting — never more paragraphs.

## 4. The signature object — a floating GRENWALL crystal (our "rock", and it replaces steven's rings)
An **original glass crystal that floats and bobs**, with the Grenwall **G** suspended glowing inside — borrowing the hover/bob motion of a game "end crystal," but our own design. **Do not use any Minecraft textures, models, or the exact beam/base — build an original crystal in our palette.**
- **Form:** a faceted glass octahedron / diamond (or a glass cube balanced on its point), suspended in the black. A glowing bone/ember **"G" monogram** floats at its core.
- **Material:** refractive glass (drei `MeshTransmissionMaterial` or similar) with subtle chromatic edge dispersion, bone/graphite tone, a soft ember inner glow. Faint drifting motes around it; an original soft light-column / ground glow beneath (not a copied beam).
- **Motion:** slow vertical **bob** (sine, ~3.5s loop) + slow Y-axis rotation; on cursor proximity it eases its spin toward the pointer. Calm, weightless, hypnotic.
- **Where it lives:** materializes in the **intro** (§5.0, in the rings' slot), anchors the **hero** (§5.1), and returns large on the **ending** black screen (§5.6).
- **Build:** re-add `three` + `@react-three/fiber` + `@react-three/drei` for this object only; lazy-load; static rendered fallback image on mobile / reduced-motion. Hold 60fps.

---

## 5. Page flow, scene by scene
*(Treat these as choreographed scenes in one continuous world — transitions, pins, and the traveling crystal connect them, per §3.5. Never hard-cut stacked blocks.)*

### 5.0 Intro / loading — **steven.com style, more complex & layered**
Multi-stage, cinematic — not a single quick counter. Sequence:
1. **Black-in.** Grain settles. A single thin sketch line draws across the viewport.
2. **Counter + grid.** A large monospace counter starts `0 → 100` (corner or center). As it climbs, **hand-drawn sketch lines and crop-mark guides draw themselves** across the screen and small mono labels flicker in at the corners (steven's connecting-line / editorial-grid language). Stagger these so it feels alive and built, stage by stage, not all at once.
3. **The crystal materializes.** Around ~60%, the **floating GRENWALL crystal** fades/refracts into existence where steven puts its two circular rings — beginning its bob + slow spin, the G lighting up inside.
4. **Resolve + wipe.** At 100, a weighty **clip-path curtain** wipes the loader away (light→dark inversion, Podium's move) into the hero, the crystal carrying through into place, a slight camera settle. Total ~2.5–3s, deliberately cinematic.
- Skipped under `prefers-reduced-motion` → straight to a static hero with the crystal still.

### 5.1 Hero — **podium.global style**
- Near-black. The **floating crystal** centered (the "rock" slot), bobbing.
- Minimal top nav: monogram left; quiet links right (`WORK · APPROACH · CONTACT`), underline-wipe on hover.
- One mono kicker + one plain sub-line (what Grenwall does). Sparse, no cutesy taglines.
- Ember WhatsApp CTA (magnetic) + `SCROLL` cue. Corner micro-labels: live local clock, a coordinate-style mark, `©GRENWALL 2026`. Functional, never slogans.
- Full framed composition with crop-marks — never a bare object on black.

### 5.2 What we build — 3 items
custom AI agents · workflow automation · business-intelligence dashboards. Big display type, each row a clip-path reveal, strong hover (row lifts, ember hairline under it, cursor → `VIEW`). Label `01 — WHAT WE BUILD`.

### 5.3 **02 — Capability (KEEP & ENHANCE the existing animations — the client's favorites)**
Keep every scene, make them the centerpiece, upgraded:
- **Spreadsheet fills itself** — bigger, crisper cells, staggered row-by-row fill with a running cursor, a total updating at the bottom, ember flash on the last cell.
- **Branching tree** — a task/lead routing outward through branches that draw on live; larger, more branches, smoother easing, an agent node lighting at each split.
- Add 2–3 more in the family: **inbox sorting itself**, **queue draining to zero**, **document assembling line-by-line**.
- Layout as Podium's **asymmetric hover-to-play mosaic**: tiles calm/looping-subtle; hover scales the tile up, lifts it above neighbors, plays its scene once; clip-path wipe-in on scroll.

### 5.4 What we automate — big plain-text list (**Podium's list move**)
Large editorial text block: invoicing, follow-ups, reporting, scheduling, onboarding, reconciliation, lead routing, data entry… each line highlights ember on hover. No icons. Fold **one slow kinetic marquee** in nearby.

### 5.5 Why Grenwall — 3 short lines
Custom-built never templated · you keep the IP · strategy + build in one team. Plain, punchy, clip-path reveal. No fake stats (StatBand stays stubbed).

### 5.6 Ending — **black screen, crystal returns large + big CTA** (Podium's close)
- Full black. The **GRENWALL crystal returns large**, bobbing and rotating (their rock → our crystal).
- Oversized display closing headline + WhatsApp CTA styled **big and underlined**, magnetic on hover.
- Corner footer furniture: monogram, `©GRENWALL 2026`, live clock, `BUILT BY GRENWALL`. Crop-marks framing it.

---

## 6. Keep exactly as-is
- WhatsApp CTA + click-to-copy: `https://wa.me/918008794433?text=Hi%20Grenwall%2C%20I%27d%20like%20to%20talk%20about%20AI%20automation%20for%20my%20business`. Only contact method.
- **Cut text hard — less words, more show.** Kill every non-essential line; no paragraphs, no filler, no cutesy taglines. A scene that *demonstrates* (a spreadsheet filling, a queue draining) always beats a sentence describing it. Keep only the few load-bearing words the design needs. No banned AI words (seamless, unlock, empower, transform, streamline, solutions, "the power of", etc.).
- No fake info (no cities/offices, client names, stats, email).
- `prefers-reduced-motion` + mobile fallbacks, 60fps.

## 7. Technical notes
- `three` + `@react-three/fiber` + `@react-three/drei` for the crystal only; lazy-load; static fallback on mobile / reduced-motion.
- Lenis + GSAP (ScrollTrigger) + Framer Motion. GSAP owns the intro timeline, wipes, pins, capability scenes; Framer Motion for hover micro-interactions. Keep the initial bundle lean.

---

The bar: put our site next to `steven.com` and `podium.global` and it belongs there. The layered count-in, the sketch lines, the floating GRENWALL crystal with the G inside, the wipe, the hover-to-play capability mosaic, the plain-text list, the big underlined WhatsApp close — top-tier, animated in every layer, unmistakably Grenwall.
