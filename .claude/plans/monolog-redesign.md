# Grenwall — Full monochrome premium redesign (Monolog × Podium direction)

## What the references actually do (analysis)

**bymonolog.com** (from the local clone at `C:\Grenwall_Website_ref\clone`):
- **Palette**: two-tone monochrome — warm off-white `#e8e8e3` on near-black `#080807`, grays `#938f8a / #524d47 / #393632`, card surface `#181715`. Zero accent color. Premium = restraint.
- **Type system**: one display sans (KHTeka) + one mono (Suisse Intl Mono) for eyebrows/labels/indices. Utility text scale (`u-text-style-display / h1–h5 / main`). Sentence case, tight tracking.
- **Section flow**: `hero → problems (stats + highlight-text paragraph + stacking cards) → gap (display-type interstitial with hairline grid lines/squares) → works (LIGHT theme flip, case cards with metric counters) → services (slider) → process → FAQ → CTA → footer`.
- **Signature moves**: `data-theme-section` dark↔light background crossfade mid-page; `data-highlight-text` word-by-word scrubbed paragraph; stacking pinned cards; `data-count` metric counters; SplitText line reveals; Lenis smooth scroll; custom cursor with `data-cursor` labels; mono micro-labels + index numbers (01/02/03) everywhere.
- **GSAP stack**: gsap 3.15 + ScrollTrigger + SplitText + CustomEase + Flip + Lenis — exactly what we already have (SplitText is free since GSAP 3.13).

**podium.global**: even quieter — huge type on near-black, enormous whitespace, slow deliberate eases, almost no imagery. The "controlled" feel = one CustomEase used everywhere, long durations (0.9–1.4s), small staggers.

## Decisions (confirmed with user)
- **Full monochrome reset** — remove black hole, starfield, three.js scenes, ember orange entirely.
- **Keep React + Vite + GSAP + Lenis stack** — rewrite sections in place; `scripts/shot.mjs` keeps working.
- All copy is original Grenwall copy (AI automations & agents; motto: "If the work repeats, it can be automated.") — no text from the reference sites.

## New design system

**tokens.ts / tailwind.config.js / index.css rewrite**
- Colors: `ink #080807`, `paper #E8E8E3` (light-section bg), `bone #E8E8E3` (text on dark), `gray-1 #938F8A`, `gray-2 #524D47`, `gray-3 #393632`, `card #181715`, hairline `rgba(232,232,227,0.12)`.
- Fonts: **Inter Variable** as the single display+body face (tight `-0.03em` display tracking, weight 450–550), **JetBrains Mono** for eyebrows/labels/indices. Drop Archivo + Fraunces imports.
- Ease: keep `heavy` CustomEase `(0.16,1,0.3,1)`, defaults 1s — already right.
- Type scale utilities: `.text-display` (clamp ~4.5–9rem), `.text-h1…h5`, `.text-body`, `.label-mono` (11px mono uppercase tracked).

## Page structure (new App.tsx order)

1. **Preloader** — rewrite: minimal — mono percentage counter bottom-left + wordmark fade, curtain lifts with heavy ease. No galaxy.
2. **Nav** — slim bar: `GRENWALL` wordmark left · center links (Work, Services, Process, FAQ) · right: LiveClock (keep) + "Start a project" text link. Mix-blend-difference so it survives the light section.
3. **Hero** (`ThemeSection dark`) — full viewport. Mono eyebrow `AI AUTOMATION STUDIO — [year]`. Giant two-line display headline: "If the work repeats, it can be automated." (line-mask SplitText reveal after preloader). Subline + bottom meta row (location / scroll cue / WhatsApp). No 3D — a barely-visible radial vignette only.
4. **Problem / Stats** (dark) — StatBand (keep CountUp): e.g. `20+ hrs/week reclaimed`, `24/7 agents`, `90-day payback`-style original stats. Below: **HighlightText** paragraph — the manifesto rewritten, word-by-word opacity scrub (gray-2 → bone) as you scroll.
5. **Gap interstitial** (dark) — "We automate / the repeatable." split left/right display type sliding in from opposite sides on scrub, hairline horizontal rules + corner squares (rebuild CropMarkDivider into this).
6. **Work / What we build** (**LIGHT theme flip** — body bg crossfades to `#E8E8E3`, ink text) — the signature premium moment. Stacked case/capability cards: AI Support Agent, Lead-Qual Agent, Ops Automation, Data Pipelines — each with mono index `01–04`, description, and a `data-count` metric (hrs saved, response time). Cards use `#DDDDD5`-ish surfaces, image-free, typographic.
7. **Services** (flip back to dark) — vertical list rows with hover-expand: Custom AI Agents / Workflow Automation / System Integrations / AI Chat & Voice / Automation Audits. Mono index + arrow, hairline dividers, row hover inverts.
8. **Process** — numbered 01–04: Map → Build → Deploy → Scale. Pinned left column title, right rows reveal.
9. **FAQ** — accordion grid, hairline borders, plus/minus mono glyph.
10. **CTA** — huge display "Automate the repeatable." + white pill WhatsApp CTA (MagneticButton kept).
11. **Footer** — oversized wordmark bottom, mono link columns, LiveClock, copyright.

## Implementation steps

1. **Purge**: delete `Starfield, BlackHoleField, CinematicBackdrop, FallController, HorizonCrossing, GalaxyIntro, SceneBoundary, GravityReveal, TiltCard, TreeConnector, Monogram, AgentMark, CropFrame, scenes/GrenwallScene, lib/fallState, lib/useShowBlackHole`; remove three/@react-three/* + framer-motion from package.json (framer only used for MotionConfig — replace with a media-query check already in `useReducedMotion`).
2. **Tokens**: rewrite `tokens.ts`, `tailwind.config.js`, `index.css` (fonts, type utilities, light-theme CSS vars: `--bg/--fg` flipped by ScrollTrigger).
3. **New primitives**: `SplitLines` (line-mask reveal, register `gsap/SplitText` in lib/gsap), `HighlightText` (word scrub), `ThemeSection` (dark/light body crossfade via ScrollTrigger `onToggle`), keep/retune `RevealText, CountUp, Marquee, MagneticButton, ClickToCopy, LiveClock, CustomCursor, SmoothScroll, ClipReveal`.
4. **Sections**: rewrite `Preloader, Nav, Hero, Manifesto→Problem, WhatWeBuild→Work (light), WhatWeDo→Services, WhyGrenwall→Process, CTA, Footer`; new `GapInterstitial`, `FAQ`.
5. **App.tsx**: new order, remove MotionConfig/three mounts, keep the global `ScrollTrigger.refresh()`.
6. **Verify**: `npm run build`, then `node scripts/shot.mjs` at hero/mid/light-section/end scroll depths + mobile shot; iterate on spacing/type until it reads premium.

## Motion rules (the "controlled" feel)
- One ease (`heavy`), durations 0.9–1.4s, staggers 0.06–0.12, never bouncy.
- Everything scroll-triggered enters once (`once: true`) except scrubbed pieces (highlight paragraph, gap type, theme flip).
- Reduced-motion: all reveals collapse to static via existing `useReducedMotion`.
