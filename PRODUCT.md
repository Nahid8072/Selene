# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers, infrastructure engineers, researchers, and open-source contributors who run, or expect to run, several AI coding agents against the same repositories at once. They arrive from search, a shared link, or GitHub, want to understand in under a minute what Selene is and is not, and then go to the GitHub repository to read the source and docs.

## Product Purpose

Selene is an open-source, self-hostable, Git-compatible infrastructure layer for efficient repository access, shared object caching, and isolated workspace provisioning for concurrent AI coding agents. This repository is the public website only: it introduces Selene and sends visitors to the GitHub repository, where the source code, documentation, installation instructions, issues, and contribution workflow live. Success means a visitor leaves knowing what Selene does and opens the repository.

## Positioning

Selene is infrastructure underneath coding agents, not a coding agent. It does not replace Git and works alongside existing Git workflows. It is not an IDE or an assistant and is not a competitor to Cursor, Claude Code, or other agents. Its mechanism: one shared repository and object-cache layer feeding many isolated agent workspaces.

## Operating Context

The product is in development. The repository holds architecture and design documents (`docs/` on GitHub: backend, frontend, product, source). Visitors evaluate it the way engineers evaluate open-source infrastructure: read the README, skim docs, open issues, check the code.

## Capabilities and Constraints

- Focus areas: Git-compatible repository access, shared object caching, isolated workspace provisioning, concurrent agent workloads, self-hosting.
- Nothing is released or production-ready; visuals of the product are illustrative and must be labeled as such where a visitor could mistake them for a real system.
- The site is a standalone landing page (`/`). The earlier dashboard preview route was removed from the site because its source files are not in this repository (user decision, 2026-11-22).
- Built with React 19 + Vite, prerendered to static HTML at build time so the page is indexable without JavaScript.
- All outbound links live in `src/landing/links.ts`. Confirmed: GitHub repo `https://github.com/Nahid8072/Selene`, docs `…/tree/main/docs`, issues. Not yet existing: Discord invite, canonical site URL, CONTRIBUTING.md, LICENSE, GitHub Discussions. They stay `null` and their links stay hidden or fall back to Issues until filled in.

## Brand Commitments

- Name: SELENE. Organization: Schrodringers Lab (spelled exactly so). Supporting label: "Open Source Infrastructure".
- Founders: Fardin Hasan Siam and Nahid Hasan Ratul, shown by name only: no roles, bios, or profile links.
- Voice: a founder explaining an engineering problem; direct, technical, no marketing jargon, no hype.
- Visual constraints the user made binding: primarily monochrome, near-black ground, one controlled accent, workspace-style panels, motion as a primary design element that explains the architecture; no neon, no purple AI gradients, no particles, no glowing orbs, no glass cards everywhere.

## Evidence on Hand

No users, stars, downloads, benchmarks, testimonials, adoption figures, or performance numbers exist. None may be invented. No license file exists yet. Existing assets: `public/favicon.svg`, `public/og-image.png`, `public/apple-touch-icon.png`.

## Product Principles

1. Infrastructure, not an agent: every surface makes the distinction from coding assistants obvious.
2. Git stays the source of truth; Selene complements it.
3. Honest status: show direction and design intent, never imply production readiness.
4. The repository is the destination; the website introduces and routes.

## Accessibility & Inclusion

WCAG 2.1 AA contrast, keyboard access with visible focus, and full `prefers-reduced-motion` support with a complete static state.
