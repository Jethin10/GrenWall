# Grenwall Website — Redesign Pass

**Feed this to Claude Code inside the existing project.** It's a redesign, not a rebuild — keep the Vite + React + TypeScript stack, the tooling, and the file structure. When you're done, `npm run dev` must run clean.

**The goal:** a genuinely award-tier studio site for **Grenwall**, a company that builds **AI automation and custom AI agents**. The current version is too basic and reads like an AI template. Rebuild it to the polish level of a top creative-studio site — the kind of site people send to friends just to show off the animations.

**Reference: podium.global.** Do NOT copy its content, text, layout, or info. Copy the *craft*: the smoothness, the preloader ceremony, the cursor work, the reveal choreography, the tiny details that make it feel expensive. Study every one of those moves, then reinterpret it in Grenwall's own style so the result is clearly ours, not a clone. Podium is the quality bar and the inspiration — never a template to trace.

---

## Content / info — keep it minimal (real info comes later)
- Write short, real-voiced placeholder copy (a headline about handing your work off to agents; simple section labels). Keep it easy to swap out.
- **Invent nothing specific.** No location, no client names, no stats, no team bios, no addresses, no phone numbers except the WhatsApp CTA below. If a spot wants info we don't have yet, use a clean generic label or a clearly-marked `{{ placeholder }}` slot.
- The only hard fact on the site right now is the WhatsApp CTA.

## Colors — your call, make it stunning
The palette is open. Pick the most appealing, premium, distinctive scheme you can actually execute well. It must look intentional and expensive, and must NOT fall into the AI-site clichés: no dark-mode-plus-neon-glow, no black-and-gold luxury, no purple/blue tech gradient, no glowing circuit-board motifs.

Strong directions (pick one — or do better):
- **(a)** Warm paper / editorial background + one bold accent (clay red, ink blue, or deep olive).
- **(b)** Stark near-monochrome — bone + warm black — with a single restrained accent. Podium-sharp.
- **(c)** A rich, moody single-hue world (deep forest, oxblood, or ink) with one bright counter-accent.

One accent, used with discipline. Whatever looks best on screen wins.

## Typography — keep, push bigger
Keep **Fraunces** (display), **Inter** (body), **JetBrains Mono** (tiny labels). Set headlines BIG and tight. Big serif display against tiny mono labels is the crafted, studio look — lean into it.

## Voice
Human, sharp, plain. Short sentences. Say what things actually do. **Banned words:** seamless, unlock, empower, supercharge, leverage, revolutionize, transform, cutting-edge, elevate, streamline, robust, solutions, innovative, "the power of", "next-level."

---

## The craft to adapt from Podium (reinterpret each in our own style — don't trace)
1. **Preloader ceremony.** A full-screen intro: a mono counter ticks `0 → 100`, the Grenwall wordmark/monogram draws in, then a clip-path curtain wipes away to reveal the hero. Under ~1.8s. This one moment sets the tone. Make the wipe direction/motion feel like *ours*.
2. **A cursor that talks.** The custom cursor morphs into a small labelled pill when it enters certain zones — `VIEW`, `DRAG`, `OPEN`, `COPY`. Retune shape/lag/color to Grenwall.
3. **Click-to-copy, with feedback.** Contact text you can click to copy, flashing `Copied` in mono. Tactile and satisfying.
4. **Clip-path reveal choreography.** Images/tiles reveal with a wipe (not a fade), staggered on scroll. Headlines mask up line-by-line. Everything arrives with intent and heavy, deliberate easing (custom cubic-beziers, never linear).
5. **Hover-to-play tiles.** Media/tiles sit calm, then on hover scale up, lift above their neighbors, and animate. See our version below.
6. **Big plain-text confident list.** A large editorial text block where each line highlights in the accent on hover. Reads more premium than any icon grid or logo wall.
7. **One kinetic marquee.** A single slow horizontal type strip between two sections. Once, not everywhere.
8. **Tiny corner micro-labels.** Small mono marks — `SCROLL`, section indices like `01 — WHAT WE BUILD`. These little details are what make it read as a *studio*.
9. **Magnetic, springy buttons.** On hover: scale to ~1.10 with a spring overshoot + a magnetic pull toward the cursor + an accent fill sweep. They should jump to meet you, not fade.
10. **Momentum smooth-scroll + grain.** Lenis inertia scrolling and a very low-opacity grain/texture overlay throughout.

## Our signature touches (this is what makes it Grenwall, not a Podium clone)
1. **Cursor-reactive mark field (hero).** A grid of crisp marks/strokes that rotate away from the cursor like iron filings around a magnet, drifting slowly when idle, rippling on click, the accent bleeding into the nearest marks. It quietly says "chaos organizing itself" — which is what automation *is*. Nothing like it on Podium; it's ours.
2. **Capability tiles = automations at work.** Our answer to Podium's media mosaic: an asymmetric grid of small in-code micro-scenes, each showing a single automation doing its job — a message sending itself, a spreadsheet row filling in, an invoice clearing, a lead routing, a report assembling. Idle = subtle; hover = it plays. Honest proof, no stock photos, no fake dashboards.
3. **An "agent" signature.** Pick one small recurring motif tied to agents (e.g. a little mark that "wakes up" and completes a task on hover) and thread it through the site so it feels like a world, not a page.

---

## Structure — tight (Podium is short and dense; match that)
Raise the craft, not the scroll length. Whole thing should read in well under a minute.
1. **Preloader → Hero** — counter ceremony, kicker, big headline, one line of sub-copy, accent CTA + click-to-copy WhatsApp, cursor-reactive mark field behind, scroll cue.
2. **What we build** — 3 things: custom AI agents · workflow automation · business-intelligence dashboards. Tight one-liners, strong hover.
3. **Capability tiles** — the hover-to-play automation mosaic. The centerpiece.
4. **What we do** — the big plain-text confident list. Fold the marquee in near here.
5. **Why Grenwall** — 3 short punchy lines (custom-built, never templated · you keep the IP · strategy + build in one team). No fake stats.
6. **CTA / Footer** — big closing headline, accent WhatsApp button + click-to-copy number, wordmark, monogram "G", small corner labels, copyright.

Generic labels only — real info gets added later.

## Keep exactly as-is
- WhatsApp CTA + click-to-copy, wired to `https://wa.me/918008794433?text=Hi%20Grenwall%2C%20I%27d%20like%20to%20talk%20about%20AI%20automation%20for%20my%20business`. Only contact method for now.
- `prefers-reduced-motion` fallbacks and mobile fallbacks (drop the heavy hero interaction on small screens; keep smooth-scroll + reveals).
- No fake stats, no email (leave the StatBand component stubbed for later).
- Lenis smooth-scroll, GSAP (clip-path wipes + preloader curtain), Framer Motion micro-interactions. Mark field and tile micro-scenes can be canvas or SVG — whatever holds 60fps.

---

Prioritize taste, smoothness, and small details over feature count. Every reveal, hover, and cursor state should feel deliberate. The bar: someone lands on it and immediately thinks *"a real studio made this"* — and wants to keep scrolling just to see what the animations do next.
