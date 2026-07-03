# Grenwall — Website

A tight, single-page site for **Grenwall** (automation studio), built to the caliber of
`steven.com`'s loading intro and `podium.global`'s everything-else: a near-black, near-bone world,
heavy uppercase display type, a floating glass crystal standing in for Podium's rock, pinned
scroll-scrub sequences, a horizontal-scroll capability reel, crop-mark furniture, and a running
scroll-progress "system" chrome.

## Stack

- Vite + React + TypeScript
- **Three.js + @react-three/fiber + @react-three/drei** — lazy-loaded, for the floating GRENWALL
  crystal only (`MeshTransmissionMaterial`, synthetic `Lightformer` environment, `Sparkles`).
  Static monogram fallback on mobile / reduced-motion
- GSAP + ScrollTrigger + **CustomEase** (the cinematic loading sequence, pinned scroll-scrub
  sections, the horizontal capability reel, the traveling crystal, the capability scenes) —
  `heavy`, a registered `cubic-bezier(0.16, 1, 0.3, 1)`, is the default ease everywhere except the
  magnetic-button pop
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
                       TravelingCrystal — the single, page-level 3D crystal, travels via scroll
                       SectionIndex — the running index number + scroll-progress rail
                       TreeConnector — the recurring branching-tree motif
                       CustomCursor, MagneticButton, TiltCard, ClickToCopy, AgentMark, Marquee,
                       Preloader, ClipReveal, RevealText, SmoothScroll, StatBand (stubbed, unused)
  scenes/           GrenwallScene.tsx — the r3f Canvas: the glass crystal, glowing "G" core,
                    ground glow, motes, lighting, drag/proximity
  lib/              gsap + CustomEase setup, reduced-motion / mobile / "show crystal" hooks
  tokens.ts         Design tokens (colors, fonts, easing) — mirrors tailwind.config.js
  App.tsx           Composes the page, owns the preloader → hero handoff
```

## Content status — placeholder copy, real info comes later

This site invents nothing specific: no location, no client names, no stats, no team bios, no
addresses, no second phone number. Every headline and section label is short, plain, load-bearing
copy — no cutesy taglines or wordplay, so the design and motion carry the page. The only hard fact
on the site is the WhatsApp CTA.

## Theme — near-monochrome black & bone

Background is near-black (`#08080A`, never pure black), text is warm bone (`#F2EFE7`, never pure
white), with one accent — a restrained ember (`#D8823A`) — used sparingly: a CTA hover, the
crystal's inner glow, a single active state. High contrast, huge negative space. Display type is
**Archivo Variable** at weight 850, heavy and uppercase with tight tracking (baked into the global
`h1`–`h4` rule, so every headline site-wide picks it up automatically); body copy is Inter; labels
are JetBrains Mono. Tokens live in `tailwind.config.js` (`void`, `surface`, `bone`, `muted`, `line`,
`ember`) and are mirrored in `src/tokens.ts`.

## The centerpiece — a floating glass crystal (our answer to Podium's rock)

`scenes/GrenwallScene.tsx` builds an original faceted glass diamond (`octahedronGeometry` +
drei's `MeshTransmissionMaterial`, lit by a small synthetic `Lightformer` environment so it reads
as real glass without an external HDR download) with the exact "G" path from `Monogram.tsx` —
extruded, small, and glowing ember — suspended at its core. It bobs on a sine loop, spins slowly,
eases its tilt toward the cursor, drifts with a handful of `Sparkles` motes, and floats over a soft
ember ground-glow. It can be grabbed and spun directly (`data-cursor="drag"` triggers the cursor's
`DRAG` pill).

**It's a single instance, not one per section.** `TravelingCrystal.tsx` mounts it once at the page
level and moves it with GSAP/ScrollTrigger as you scroll: large and centered through the **hero**,
shrinking into a quiet top-right tuck as the middle sections pass, then growing large and centered
again through the **ending** — the thread tying every scene together, per the brief that the
crystal should "persist and travel," not just bookend the page. Hero and CTA each keep an invisible
sizing anchor (`#hero-crystal-anchor` / `#ending-crystal-anchor`) that `TravelingCrystal` measures
to know exactly where to land; a static 2D monogram renders in that anchor instead on mobile and
under `prefers-reduced-motion`, since the animated crystal never mounts there. During the
**preloader**, the crystal is already running underneath the loading panel from the very start —
the loader just reveals it early through a soft, growing mask-image hole around the 60% mark,
rather than mounting a second WebGL instance.

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

## The running "system" chrome

`SectionIndex.tsx` is a small fixed rail on the right edge (desktop only): the current section's
two-digit index flips in as you pass each one, a dot marker runs the full length of a thin vertical
line tracking overall scroll position, and a live percentage counter underneath states exactly how
far down the page you are — real, derived data, never a fabricated stat.

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

- **Preloader** (`Preloader.tsx`) — a layered, steven.com-style loading intro: a black-in with a
  sketch line drawing across the frame, a large mono counter ticking 0 → 100 while more guide lines
  draw themselves and corner labels flicker in, the crystal materializing through the mask-reveal
  around 60%, then a `clip-path` curtain wipe resolving into the hero. Skipped entirely under
  `prefers-reduced-motion`.
- **Nav** (`Nav.tsx`) — a minimal fixed bar: monogram left, `Work` / `Approach` / `Contact` right,
  each with an underline that wipes in from the left on hover.
- **Cursor** (`CustomCursor.tsx`) — the usual lagging dot + ring grows over generic interactive
  elements, but morphs into a filled ember pill with dark text (`VIEW`, `OPEN`, `DRAG`, `COPY`)
  inside any `data-cursor="…"` zone: capability tiles (`view`), WhatsApp links (`open`), the
  crystal (`drag`), the phone number (`copy`).
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

- The whole site respects `prefers-reduced-motion`: Lenis smooth-scroll, the preloader, the
  crystal (replaced by a static monogram), the pinned scroll-scrub sections and horizontal reel
  (both fall back to plain stacked/grid layouts), the tree connector, the capability-tile scenes,
  the custom cursor, the button hover pop, and Framer Motion's `whileInView` reveals (via a global
  `MotionConfig reducedMotion="user"`) all fall back to instant, static, fully-readable content.
- The crystal never mounts on mobile or under reduced motion — a flat SVG monogram takes its place
  in both the hero and the ending — and it's a single instance for the whole page, so there is
  never more than one WebGL context regardless of scroll position.
- Motion throughout is deliberately calm — a single heavy `cubic-bezier(0.16, 1, 0.3, 1)`, no
  frantic loops — since restraint reads as *premium*, not the springy overshoot reserved
  specifically for button hovers.
