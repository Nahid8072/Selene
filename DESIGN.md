---
name: Selene
description: A dark graphite observability window onto shared repository infrastructure for concurrent coding agents.
colors:
  graphite-ground: "#09090a"
  graphite-raised: "#0c0c0e"
  panel: "#0f0f11"
  panel-2: "#131316"
  panel-3: "#17171a"
  hairline: "rgb(255 255 255 / 0.075)"
  hairline-2: "rgb(255 255 255 / 0.12)"
  hairline-3: "rgb(255 255 255 / 0.2)"
  soft-white: "#ededea"
  ash: "#a8a8a3"
  smoke: "#87877f"
  signal-mint: "#34d59a"
  live-surface: "#111a17"
  ink: "#0b0b0c"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.1rem + 4.6vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Schibsted Grotesk, Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 2.5vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  subtitle:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.005em"
  mono:
    fontFamily: "Geist Mono Variable, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  wordmark:
    fontFamily: "Schibsted Grotesk, Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "0.16em"
rounded:
  xs: "3px"
  sm: "4px"
  md: "7px"
  lg: "11px"
  xl: "12px"
  round: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  gutter: "clamp(16px, 4vw, 48px)"
  section: "clamp(96px, 11vw, 168px)"
  container: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.soft-white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
  button-quiet:
    backgroundColor: "rgb(255 255 255 / 0.025)"
    textColor: "{colors.soft-white}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-quiet-hover:
    backgroundColor: "rgb(255 255 255 / 0.06)"
  nav-link:
    textColor: "{colors.ash}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-link-hover:
    backgroundColor: "rgb(255 255 255 / 0.04)"
    textColor: "{colors.soft-white}"
  window-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ash}"
    rounded: "{rounded.lg}"
  window-bar:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.smoke}"
    typography: "{typography.mono}"
    height: "42px"
    padding: "0 14px"
  agent-card:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ash}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  agent-card-running:
    backgroundColor: "{colors.live-surface}"
    textColor: "{colors.soft-white}"
  status-chip:
    textColor: "{colors.smoke}"
    rounded: "{rounded.sm}"
    padding: "2px 7px"
---

# Design System: Selene

## Overview

**Creative North Star: "The Observability Window"**

Selene's world is a quiet operations console seen through glass at night: a near-black graphite ground, editor-style panels stacked from hairlines rather than shadows, and soft off-white type. Nothing decorates. The page earns attention by showing the system at work: a repository feeding a shared object cache that provisions isolated agent workspaces, drawn as schematics and animated as a readable sequence. Every surface should read like a pane of a developer tool, not like a marketing card.

Color is almost entirely withheld. Neutrals do the structure; the single signal-mint accent marks what is live: cache objects filling, agents running, packets flowing, the current architecture step. When mint appears, something is happening. Type is a two-voice pairing: a tight, confident grotesk for statements, a neutral text sans for explanation, and a mono reserved for machine output (paths, hashes, logs, status).

Motion is a primary material but never a dependency. All choreography lives behind `html.motion`, which is set only when scripts run, the visitor has not asked for reduced motion, and the URL does not carry `?motion=off`. Without that class, every element renders in its complete, settled final state. Rejected outright (user-binding): neon, purple AI gradients, particles, glowing orbs, glass cards everywhere.

**Key Characteristics:**
- Near-black graphite ground with five tonal panel steps and three hairline weights.
- One accent, signal mint, reserved for live data and state.
- Schibsted Grotesk statements, Geist explanation, Geist Mono for machine output only.
- Depth from hairlines and tonal steps; real shadows only on floating windows and the scrolled nav.
- Schematic SVG figures (boxes, wires, cells) instead of illustration or imagery.
- Motion gated, explanatory, and fully optional.

## Colors

A graphite monochrome with one warm signal color held in reserve.

### Primary
- **Signal Mint** (signal-mint): the live-data signal. Filled cache cells, running-agent status and dot, typing caret, flowing wires and packets, agent tags on touched files, the cache log tag, the current architecture step number, and the mint crescent in the brand mark and favicon. It is also used as the focus-ring color, selection tint (at 32%), and text caret, because those mark the visitor's own live position. Applied as a translucent fill (`rgb(52 213 154 / 0.08–0.85)`) far more often than solid.

### Neutral
- **Graphite Ground** (graphite-ground): page background, `theme-color`, and the hollow fill of commit dots.
- **Graphite Raised** (graphite-raised): window title bars and side panes (explorer, agents, capability stage bar), one step above ground.
- **Panel / Panel 2 / Panel 3** (panel, panel-2, panel-3): window bodies, schematic node boxes and agent cards, and schematic tiles, in that order of lift.
- **Hairline / Hairline 2 / Hairline 3** (hairline, hairline-2, hairline-3): the structural line system. Hairline divides sections, rows, and panes; Hairline 2 outlines windows, quiet buttons, and the top rule of lists; Hairline 3 is the hover or provisioning emphasis.
- **Soft White** (soft-white): headings, primary text, primary button fill.
- **Ash** (ash): body and lead copy, inactive nav links, secondary values.
- **Smoke** (smoke): captions, metadata, timestamps, idle status, dim schematic labels.
- **Live Surface** (live-surface): the faintly warm card ground under a running agent; the only tinted surface.
- **Ink** (ink): text on the soft-white primary button and skip link.

### Named Rules
**The Mint Means Live Rule.** Signal mint marks data or state that is happening now, plus the brand crescent and the visitor's own focus, caret, and selection. It never fills a CTA, a heading, a static icon, or a decorative rule. If nothing on screen is live, nothing on screen is mint except the mark.

**The Hairline Ladder Rule.** Structure is drawn with the three white-alpha hairlines (7.5%, 12%, 20%), not with new grays. Schematic strokes may step further (10% to 42%) as nodes switch on, but stay white-alpha.

## Typography

**Display Font:** Schibsted Grotesk (self-hosted variable, 400–900), falling back to Geist and system sans
**Body Font:** Geist Variable (via Fontsource)
**Label/Mono Font:** Geist Mono Variable (via Fontsource)

**Character:** A dense, slightly editorial grotesk set tight and large for claims, against a calm technical sans for reading. Mono appears only where a machine would print the text.

### Hierarchy
- **Display** (600, clamp 2.5rem to 4.75rem, 1.0): hero headline, split into masked lines; the closing statement runs the same voice up to 5rem.
- **Headline** (600, clamp 2rem to 3.25rem, 1.05, max 21ch, balanced): section headings and founder names. The essay title and closing statement use the Display size (17ch and 14ch).
- **Title** (600, 1.25rem, 1.25): action-row titles, mobile nav links, capability index triggers, architecture step titles, and the essay opening paragraph (Geist).
- **Subtitle** (Geist 600, 1.0625rem, 1.35): problem column headings and small card names.
- **Lead** (Geist 400, 1.0625rem, 1.65, max 46–50ch, Ash): section and hero introductions.
- **Body** (Geist 400, 16px, 1.6): base copy, problem and capability descriptions; essay body runs at the Lead size (1.0625rem / 1.7) at 62ch.
- **Label** (Geist 500, 14px): buttons, nav, captions in Smoke, and the 46px large buttons at 16px.
- **Mono** (Geist Mono 400, 12px; small Geist UI text inside windows shares this 12px step): file paths, branches, hashes, log lines, status text, step numbers, schematic labels, tabular numerics.
- **Wordmark** (Schibsted 700, 14–15px, 0.16em tracking): the SELENE name in nav and footer only.

### Named Rules
**The Machine Voice Rule.** Geist Mono is for strings a system would emit: paths, hashes, logs, status, counts. Never for prose, headings, or marketing claims.

**The Negative Tracking Rule.** Schibsted display sizes track tight (-0.015em to -0.038em, tighter as size grows). The only positive tracking in the system is the wordmark.

## Layout

A single 1240px container with a fluid gutter (16px to 48px) and fluid section padding (96px to 168px), each section opened by a top hairline. Section heads are a two-column grid (heading 1.25fr, lead 1fr, bottom-aligned) that stacks below 860px. The hero is an asymmetric grid: headline across the left 1.6fr, lead, CTAs, and fact list in the right column, and the workspace window spanning the full container beneath. Content blocks use editorial column splits (three problem columns divided by hairlines, a sticky figure beside scrolling steps for architecture, an index list beside a sticky stage for capabilities, a 12-column essay with tenets in columns 1–4 and body in 6–12). Small spacing steps cluster on 8, 16, and 24px. Breakpoints: 520, 640, 720, 860–900, 1024, 1080px; below 900px every split collapses to one column, sticky figures become static, and the capability stage is replaced by inline schematics under each item.

## Elevation & Depth

Depth is tonal and linear first: ground, raised, and three panel steps, separated by hairlines. Shadows exist only on things that float above the page: the hero workspace window, the capability stage, the scrolled nav, and its mobile panel. Every one pairs a 1px inner top highlight with a long, deeply negative-spread black drop, so the window seems to hover in darkness rather than cast a visible edge. The primary button carries a faint white under-glow as its one tactile cue.

### Shadow Vocabulary
- **Window float** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.05), 0 50px 100px -40px rgb(0 0 0 / 0.9), 0 20px 40px -24px rgb(0 0 0 / 0.7)`): the hero workspace window only.
- **Stage float** (`box-shadow: 0 40px 80px -40px rgb(0 0 0 / 0.8)`): the sticky capability stage.
- **Nav glass** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04), 0 18px 40px -20px rgb(0 0 0 / 0.8)` with `backdrop-filter: blur(16px) saturate(140%)` over `rgb(14 14 16 / 0.72)`): the nav bar once scrolled or opened.
- **Primary lift** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.6), 0 6px 20px -10px rgb(255 255 255 / 0.35)`): the primary button; grows to `0 10px 28px -12px / 0.45` on hover.

### Named Rules
**The Only-Windows-Float Rule.** Inline panels (the open-source flow card, mobile capability schematics, agent cards) are flat with a hairline. Shadow is reserved for window-like surfaces that sit above the page.

**The One Glass Rule.** Backdrop blur belongs to the floating nav and its menu panel. No other surface is glass.

## Shapes

Gently squared corners: 7px on controls and cards, 11px on windows and framed panels, 12px on the floating nav bar, 4px on tiny chips and the focus ring, 3px on inline file tags, full circles only for status dots. Borders are always 1px. Dashed strokes mean "not yet": provisioning agent cards, unprovisioned workspace nodes, rest-state wires, and network boundaries in schematics turn solid when they become real. Background textures are limited to the supplied green dot-wave image behind the hero (public/media/selene-wave.webp at 60% opacity, faded under the nav, with a dark scrim behind the headline, a slow drift, and a mint light sweep every 16s that only lights its dots), a 64px hairline grid over it (radially masked), and an 18px dot grid inside schematic stages. The supplied isometric illustration (public/media/selene-architecture.webp) opens the architecture section: it floats a few pixels, and an SVG overlay drawn in the image's own pixel space carries mint light and packets along its tubes, with each component hoverable, focusable and tappable to light its part of the flow.

## Components

### Buttons
Calm and tactile; the light button is the only bright solid on the page.
- **Shape:** gently squared (7px), 40px tall default, 34px small, 46px large.
- **Primary:** Soft White fill, Ink text, Geist 500 14px, primary-lift shadow. Hover goes to pure white with a slightly larger glow.
- **Quiet:** near-transparent white fill (2.5%), Hairline 2 border, Soft White text; hover raises fill to 6% and border to Hairline 3.
- **Hover / Focus / Active:** trailing arrow nudges 3px right on hover; active presses down 1px and scales to 0.985; focus is a 2px mint outline at 3px offset with 4px radius (shared by every focusable element).

### Cards / Containers
- **Corner Style:** 7px for cards, 11px for windows and framed panels.
- **Background:** Panel or Panel 2, with Graphite Raised for bars and side panes.
- **Shadow Strategy:** flat; see the Only-Windows-Float Rule.
- **Border:** 1px Hairline or Hairline 2.
- **Internal Padding:** 10–12px inside cards, 14–20px inside panes and framed panels.

### Navigation
- **Style:** fixed, 12px from the top, 56px tall, 12px radius; transparent at rest, turning to the nav-glass treatment once the page scrolls. Wordmark plus a Smoke supporting label behind a hairline divider (label hidden below 1080px).
- **Links:** Geist 14px in Ash, 7px radius, 8px 12px padding; hover lifts to Soft White on a 4% white wash; the active section gets a 1px underline that scales in from the left.
- **Mobile (below 880px):** links and the quiet CTA hide; a 38px hairline menu button opens a near-opaque panel with Schibsted 1.25rem links and an external-link row. Below 360px the primary CTA also hides.

### Agent Workspace Window (signature)
The hero's simulated editor: a 42px mono title bar (breadcrumbs, branch, phase dot, an "illustrative" chip), then a three-pane body (216px explorer, schematic core on a dot grid, 276px agent column) with a log stream under the core. Agent cards move through four states: idle (55% opacity), provisioning (dashed Hairline 3 border, stepped blink), running (mint-tinted border on Live Surface, mint status and caret), done (Hairline 2 border, Ash status). Cache cells fill mint in staggered order; log lines older than the last three dim to 50%. Below 1080px the explorer drops; below 720px panes stack and the log loses its timestamp column.

### Action Rows
Open-source destinations are borderless rows with a Hairline 2 top rule, a Schibsted title, a Smoke meta line (mono when it is a path), and an up-right arrow that moves 3px diagonally and brightens on hover while the rule brightens to Ash.

### Capability Index
An accordion-like list of Schibsted triggers in Ash that turn Soft White when active, with a hairline "chevron" that extends from 10px to 28px. The selected capability renders in a sticky window stage beside it; below 900px the stage is removed and each item carries its schematic inline.

## Do's and Don'ts

### Do:
- **Do** keep every surface on the graphite ladder (ground, raised, panel 1–3) and draw structure with the three white-alpha hairlines.
- **Do** reserve signal mint for live data and state, the brand crescent, and focus, caret, and selection.
- **Do** set Geist Mono only on paths, hashes, logs, status, counts, and schematic labels.
- **Do** gate all choreography under `html.motion` and make the no-class render complete, settled, and legible; honor `prefers-reduced-motion` and `?motion=off`.
- **Do** use dashed strokes for not-yet-real things and switch them to solid when they become real.
- **Do** ease state changes with `cubic-bezier(0.16, 1, 0.3, 1)` and loops with `cubic-bezier(0.65, 0, 0.35, 1)`.
- **Do** label any product visualization a visitor could mistake for a real system as illustrative.

### Don't:
- **Don't** introduce a second accent, neon, or purple AI gradients.
- **Don't** add particles, glowing orbs, or decorative illustration; explanation is drawn as schematics.
- **Don't** use glass on anything but the floating nav and its menu panel.
- **Don't** fill CTAs, headings, or static icons with mint.
- **Don't** shadow inline cards; only floating windows and the scrolled nav float.
- **Don't** put an eyebrow or kicker label above section headings; headings stand alone with their lead.
- **Don't** let content depend on motion to appear.
