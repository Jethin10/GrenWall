# Grenwall — Website

A tight, single-page site for **Grenwall** (automation studio), built to the caliber of
`steven.com`'s loading intro and `podium.global`'s everything-else — around one idea, start to
finish: the intro gathers a **black hole**, the hero *is* that black hole, its gravity threads
every scene, and it returns at the close. Deep space-black, a warm accretion glow, heavy uppercase
display type, pinned scroll-scrub sequences, a horizontal-scroll capability reel, scramble-decode
headlines, crop-mark furniture, and a parallax starfield behind everything.

## Stack

- Vite + React + TypeScript
- **Three.js + @react-three/fiber + @react-three/postprocessing** — lazy-loaded, for the GRENWALL
  black hole only (custom accretion-disk shader, lensed halo, infalling matter,
  `Bloom`/`ChromaticAberration` post). Static monogram fallback on mobile / reduced-motion
- GSAP + ScrollTrigger + **CustomEase** (the cinematic intro, the emerge-out exit, the whole-page
  fall / camera dolly, pinned scroll-scrub sections, the horizontal capability reel, the
  gravitational content reveals, the capability scenes) — `heavy`, a registered
  `cubic-bezier(0.16, 1, 0.3, 1)`, is the default ease everywhere except the magnetic-button pop
- Lenis (smooth momentum scroll, lerp 0.09)
- Framer Motion (`whileInView` reveals, hover micro-interactions, global `MotionConfig` for
  `prefers-reduced-motion`)
- Tailwind CSS (design tokens in `tailwind.config.js`, mirrored in `src/tokens.ts`)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static, deploy-ready `dist/` folder;
`npm run preview` serves that build locally.

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/       Sections + shared UI:
                       Hero, WhatWeBuild, CapabilityTiles, WhatWeDo, WhyGrenwall, CTA, Footer
                       Nav, Monogram, CropFrame, CropMarkDivider, LiveClock — Podium-style furniture
                       BlackHoleField — the single, fixed, full-viewport black hole (the fall's spine)
                       FallController — writes the shared fall signal from live scroll each frame
                       HorizonCrossing — the event-horizon blackout + CTA resolve at the end
                       GravityReveal — content that bends/stretches toward the hole then settles
                       SceneBoundary — isolates the WebGL scene so a lost GPU context degrades gracefully
                       Starfield — stars streaming radially inward, faster the deeper you fall
                       TreeConnector — the recurring branching-tree motif
                       CustomCursor, MagneticButton, TiltCard, ClickToCopy, AgentMark, Marquee,
                       Preloader, ClipReveal, RevealText, SmoothScroll, StatBand (stubbed, unused)
  scenes/           GrenwallScene.tsx — the r3f Canvas: event horizon, shader accretion disk,
                    lensed halo, photon ring, infalling motes, bloom, camera fall
  lib/              gsap + CustomEase setup, fallState (the shared fall signal),
                    reduced-motion / mobile / "show black hole" hooks
  tokens.ts         Design tokens (colors, fonts, easing) — mirrors tailwind.config.js
  App.tsx           Composes the page, owns the intro → hero handoff
```

## Content status — placeholder copy, real info comes later

This site invents nothing specific: no location, no client names, no stats, no team bios, no
addresses, no second phone number. Every headline and section label is short, plain, load-bearing
copy — no cutesy taglines or wordplay, so the design and motion carry the page. The only hard fact
on the site is the WhatsApp CTA.

## Theme — deep space-black with a warm accretion glow

Background is near-true black (`#050506`, never pure `#000`), text is warm bone (`#F3EFE6`, never
pure white). The star of the palette is the **accretion gradient** reserved for the disk — deep
amber `#B8501A` → ember `#E8912F` → hot inner rim `#FFF2DC` — with a whisper of violet lensing
fringe (`#6E4A9E`) at the halo's edge. The UI accent stays a restrained ember (`#D8823A`): a CTA
hover, a single active state. A faint three-layer **starfield** parallaxes behind every section
(sections are transparent; the body carries the black). High contrast, huge negative space.
Display type is **Archivo Variable** at weight 850, heavy and uppercase with tight tracking; body
copy is Inter; labels are JetBrains Mono. Tokens live in `tailwind.config.js` (`void`, `surface`,
`bone`, `muted`, `line`, `ember`, `accretion.*`) and are mirrored in `src/tokens.ts`.

## The centerpiece — the GRENWALL black hole (our answer to Podium's rock)

`scenes/GrenwallScene.tsx` builds an original singularity: a pure-black **event horizon** sphere
wrapped in a broad, substantial **accretion disk** on a custom shader — a flowing, streaky warm
gradient (white-hot inner rim → ember → deep amber) with differential rotation (inner material
orbits faster), **Doppler beaming** (the approaching side runs hotter), and additive blending. A
camera-facing **lensed halo** hugs the silhouette — the faked gravitational-lensing image of the
disk, with the violet fringe at its edge — plus a thin **photon ring** right at the horizon. Two
motes of infalling matter** spiral inward on Keplerian-ish orbits and recycle at the rim. `Bloom`
makes the disk genuinely bleed light — driven off the disk's own luminance (brighter disk = more
bloom) rather than an effect ref, since under React 19 a ref on a `@react-three/postprocessing`
effect leaks into its props and its `JSON.stringify` memo key chokes on the circular effect graph.
The canvas renders at a low DPR (the disk is all soft bloom, which hides it) so the fullscreen
composer holds 60fps and never TDRs an integrated GPU, and its wrapper is feathered with a radial
mask so the glow dissolves into the page rather than cutting off at the buffer's edge.

**It's the spine of the whole page — a fall inward.** `BlackHoleField.tsx` mounts it once as a
fixed, full-viewport field *behind* all content; it never moves. Instead the whole page is a
continuous fall: see **the fall** below. It's non-interactive (`pointer-events: none`) so content
stays clickable and the motion is driven purely by scroll. `SceneBoundary` wraps the Canvas so a
lost GPU context degrades to nothing (the site keeps working) instead of white-screening. On mobile
and under `prefers-reduced-motion` the field never mounts — a static 2D monogram stands in inside
the hero and ending anchors (`#hero-core-anchor` / `#ending-core-anchor`). During the **intro**,
the black hole is already running behind the loading panel from the very start — the exit opens
onto it through a growing mask-image hole rather than mounting a second WebGL instance.

## The fall — the whole page falls into the black hole

The site's spine. `FallController` writes a shared `fallState` every frame — `progress` (0..1 from
live scroll position over the full document, so it stays accurate through the pinned sections'
spacers) and a smoothed `velocity` (rises with scroll speed, eases at rest). Everything reads it in
its own render loop, no React re-renders:

- **The camera dollies toward the singularity** the entire scroll, and the disk scale, brightness
  (→ bloom), spin, and the pull on the infalling motes all ramp with `progress` and `velocity` —
  fast scroll sucks harder and spins the disk up. The intensity is deliberately back-loaded
  (`fallCurve`): a gentle descent for most of the page so text stays readable over the hole, then a
  hard surge into the last stretch as the tidal pull spikes.
- **Content enters on gravitational curves.** `GravityReveal` scrubs each block from pulled-toward-
  centre-and-stretched (a spaghettification hint) to settled-and-readable as it nears the hole —
  the pull is felt, not just triggered. The `WhatWeDo` list bends in row by row.
- **The starfield streams radially inward**, faster the deeper you fall and the faster you scroll,
  elongating into streaks at speed.
- **The ending is the event horizon.** `HorizonCrossing` swells a dark blackout as `progress`
  crosses into the final stretch — passing *through* the horizon — while the CTA starts warped and
  blurred on the far side and resolves crisp once we're through.
- Text-dense sections carry a soft radial scrim so the hole recedes to a glow behind reading
  content while blazing full-glory in the hero, the ending, and the gaps between sections.

All of it respects `prefers-reduced-motion` and mobile: `FallController` doesn't run, the field
never mounts, `GravityReveal` becomes a calm fade-up (or static), and the starfield holds still —
the calm stacked reveals, no camera fall.

## Pinned scroll-scrub sequences & the horizontal reel

Two sections pin in place while a scrubbed GSAP timeline advances their content on scroll, rather
than revealing once and sitting there:

- **What we build** (`WhatWeBuild.tsx`) pins for two viewport-heights and crossfades through its
  three offerings one at a time — a numbered `01 / 02 / 03` index tracks the active one — before
  releasing into the next section. Falls back to the original three-card grid on mobile / reduced
  motion.
- **Capability** (`CapabilityTiles.tsx`) is the horizontal-scroll reel — Podium's signature move.
  The whole row of nine tiles is pinned and slides left as you scroll down, one vertical pixel
  mapped to one horizontal pixel, so the mosaic reveals tile-by-tile instead of arriving all at
  once. Falls back to the original asymmetric hover-to-play grid on mobile / reduced motion.

## Headlines decode, they don't just appear

`RevealText.tsx` combines the line-mask slide with a **scramble/decode**: as each headline line
rises into place its letters cycle through a character pool and lock left-to-right. Every major
section headline gets it automatically; under reduced motion the text renders instantly, static.

## Recurring motifs

- **`CropFrame.tsx`** / **`CropMarkDivider.tsx`** — faint blueprint crop-mark brackets, dashed
  target markers, and dimension-line dividers that draw themselves in as they scroll past, used to
  frame the hero/ending and separate sections.
- **`TreeConnector.tsx`** — a small ambient version of the capability grid's branching tree,
  threaded between sections so the site reads as one connected system: an occasional dot drifts
  up one branch, rests, then tries another.
- The capability grid's own **lead-routing tile** is the tree motif's biggest, most detailed
  expression — a proper two-level tree (a trunk splitting into two, each splitting again into two
  leaves), with the split and leaf nodes lighting up as four dots travel through on hover.

## The craft, section by section

- **Intro** (`Preloader.tsx`) — heavy, big, full: a lone ember **dot** on deep black (grain, faint
  stars, a mono counter) **gathers mass** into a thick, luminous accretion disk — layered
  counter-rotating conic streak bands clipped to an annulus — while stars streak inward; the disk
  **grows until it fills the entire viewport** (the peak weight beat); then at 100 the whole mass
  **surges past the viewer** and we emerge out through its dark center into the hero — a radial
  mask opens onto the real black hole already bobbing beneath, and the hero settles from a slight
  overscale. No boxy wipe — a dimensional exit. ~3.5s. Skipped entirely under
  `prefers-reduced-motion`.
- **Nav** (`Nav.tsx`) — a minimal fixed bar: monogram left, `Work` / `Approach` / `Contact` right,
  each with an underline that wipes in from the left on hover.
- **Cursor** (`CustomCursor.tsx`) — the usual lagging dot + ring grows over generic interactive
  elements, but morphs into a filled ember pill with dark text (`VIEW`, `OPEN`, `COPY`) inside any
  `data-cursor="…"` zone: capability tiles (`view`), WhatsApp links (`open`), the phone number
  (`copy`). Three faint trailing dots chase it at staggered lags — a comet tail at 8–22% opacity.
- **Click-to-copy** (`ClickToCopy.tsx`) — click the WhatsApp number to copy it (Clipboard API with
  a legacy `execCommand` fallback), with a brief mono "Copied" flash and an `aria-live`
  announcement for screen readers.
- **Capability tiles** (`CapabilityTiles.tsx`) — the section the client loves, kept and enhanced.
  Nine in-code SVG/GSAP micro-scenes: a spreadsheet row filling in with a running cursor and an
  ember flash on the final cell, and a lead routing through the two-level branching tree, are the
  two big stars — backed by a message sending itself, an invoice clearing, a queue draining, an
  inbox sorting itself, a task stack marking itself done, a document assembling line by line, and a
  report assembling. Idle is subtle; hovering plays the scene.
- **What we automate** (`WhatWeDo.tsx`) — a big plain-text list of what Grenwall automates
  (invoicing, follow-ups, reporting, scheduling, onboarding, reconciliation, lead routing, data
  entry), each line highlighting in ember on hover, with a single slow kinetic marquee folded in
  beneath it.
- **Agent mark** (`AgentMark.tsx`) — a small dot that "wakes up" with a bright pulse, then
  dispatches a tiny spark outward, the first time each section's kicker scrolls into view — a
  recurring signature threaded through every section after the hero.
- **Buttons** (`MagneticButton.tsx`) — spring-overshoot scale to ~1.10 on hover and a magnetic pull
  toward the cursor throughout; the `pill` variant (hero) adds an ember fill sweep, the `text`
  variant (the ending) is a bare, oversized, underlined link with a nudging arrow — Podium's "big
  bold CTA" energy.

## Contact CTA

Every "Book a call" link opens WhatsApp with a pre-filled message, and every click-to-copy control
copies the same number, both wired to **+91 80087 94433**. This is intentional and already live —
it is the only contact method on the site right now. Do not swap in a placeholder number.

## One thing to add later (intentionally left out for now)

Grenwall has no real performance numbers yet, so **StatBand** was deliberately left out rather
than faked: [`src/components/StatBand.tsx`](src/components/StatBand.tsx) is a fully working,
ready-to-use count-up stat grid that is **not currently rendered**. The live "Why Grenwall"
section ([`src/components/WhyGrenwall.tsx`](src/components/WhyGrenwall.tsx)) instead shows three
short qualitative statements. Once Grenwall has real numbers (clients served, agents deployed,
hours reclaimed, etc.), pass them into `<StatBand stats={[...]} />` and uncomment its usage at the
bottom of `WhyGrenwall.tsx` — no other changes required.

## Motion & accessibility notes

- The whole site respects `prefers-reduced-motion`: Lenis smooth-scroll, the intro, the black hole
  and the whole-page fall (replaced by a static monogram, no camera dolly), the starfield (drawn
  once, no infall), the gravitational content reveals (`GravityReveal` → static), the pinned
  scroll-scrub sections and horizontal reel (both fall back to plain stacked/grid layouts), the
  tree connector, the capability-tile scenes, the custom cursor, the button hover pop, and Framer
  Motion's `whileInView` reveals (via a global `MotionConfig reducedMotion="user"`) all fall back
  to instant, static, fully-readable content.
- The black hole never mounts on mobile or under reduced motion — a flat SVG monogram takes its
  place in both the hero and the ending — and it's a single fixed instance for the whole page, so
  there is never more than one heavy WebGL context regardless of scroll position. `SceneBoundary`
  guarantees that even a lost GPU context just drops the hole rather than taking down the site.
- The fullscreen field renders at a low DPR and caps its camera dolly short of the horizon, so the
  additive-bloom shader never becomes a fill-rate bomb — it holds 60fps on integrated GPUs.
- Motion throughout is deliberately calm — a single heavy `cubic-bezier(0.16, 1, 0.3, 1)`, no
  frantic loops — since restraint reads as *premium*, not the springy overshoot reserved
  specifically for button hovers.
