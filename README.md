<<<<<<< HEAD
# Selene overview

Frontend preview for Screen 01, the Overview dashboard. There is no API.

```bash
npm install
npm run dev
```

The dev server prints a local URL, usually http://127.0.0.1:5173/.

```bash
npx oxlint
npx tsc -b
npm run build
```

Screen tracking lives in `docs/frontend/SCREEN_INVENTORY.md` and `docs/frontend/COMPONENT_CATALOG.md`.
=======
# Selene website

The public landing page for Selene: open-source, self-hostable, Git-compatible infrastructure for repository access,
shared object caching, and isolated workspaces for concurrent AI coding agents. A project by Schrodringers Lab.

The Selene source code, documentation and contribution workflow live in the
[Selene repository](https://github.com/Nahid8072/Selene). This site introduces the project and links there.

```bash
npm install
npm run dev        # http://127.0.0.1:5173/
npm run build      # typecheck, build, prerender to dist/
npm run preview    # serve dist/ at http://localhost:4173/
npm run lint
```

## How it is built

- React 19 + Vite. `npm run build` prerenders the page into `dist/index.html` (`scripts/prerender.mjs`), so every
  section is indexable without JavaScript, then hydrates it in the browser.
- `src/landing/` holds the page: `LandingPage.tsx` (sections), `AgentWorkspace.tsx` (the animated hero workspace),
  `Architecture.tsx` (scroll-driven architecture diagram), `Capabilities.tsx`, `figures.tsx`, `LandingNav.tsx`,
  and `landing.css` (tokens, layout, motion).
- Motion is CSS transforms/opacity plus one `requestAnimationFrame` loop for the hero, paused off-screen. It is
  disabled for `prefers-reduced-motion`, and `?motion=off` renders the settled page for screenshots.

## Links and placeholders

All outbound links live in `src/landing/links.ts`. These do not exist yet and stay `null`; their links are hidden or
fall back to GitHub Issues/Docs until filled in:

- `discord` — Discord invite URL (enables "Join Discord" in the nav, the community action, and the final CTA)
- `contributing` — CONTRIBUTING.md URL
- `license` — LICENSE URL

Set `SITE_URL` when the official URL exists (`SITE_URL=https://example.org npm run build`) to add the canonical URL,
absolute Open Graph URLs and `sitemap.xml`. `robots.txt` is always written.

## Note

The earlier dashboard UI preview (`src/DashboardApp.tsx`, `src/features/`, `src/components/shell/`) is no longer
routed: its supporting files are not in this repository. Those files are left in place untouched.
>>>>>>> landing-page
