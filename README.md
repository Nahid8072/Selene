# Selene

Open-source, self-hostable, Git-compatible infrastructure for concurrent AI coding agents. This repository holds the
public landing page, the dashboard UI preview (on sample data, no API), and the design documents in `docs/`.

```bash
npm install
npm run dev
```

The dev server prints a local URL, usually http://127.0.0.1:5173/.

| Route | What it is |
| --- | --- |
| `/` | Public landing page (`src/landing/`) |
| `/overview` and the other dashboard routes | UI preview on sample fixtures (`src/features/`) |

```bash
npx oxlint
npx tsc -b
npm run build
```

`npm run build` also prerenders the landing page into `dist/index.html` (`scripts/prerender.mjs`), so its copy is
indexable without JavaScript, and writes `robots.txt`. Set `SITE_URL` to the official landing page URL when it exists
(`SITE_URL=https://example.org npm run build`) to add the canonical URL, absolute Open Graph URLs and `sitemap.xml`.
Landing page links live in `src/landing/links.ts`; links without a verified destination (Discord, contributing guide,
license) stay hidden until they are filled in.

Screen tracking lives in `docs/frontend/SCREEN_INVENTORY.md` and `docs/frontend/COMPONENT_CATALOG.md`.
