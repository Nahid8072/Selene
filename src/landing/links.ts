/**
 * Every outbound destination and site-wide fact used by the landing page.
 *
 * Only verified, existing URLs belong here. A destination that does not exist yet stays `null`,
 * and every link that points to it is hidden (or falls back, where noted) until it is filled in.
 *
 * Placeholders still to fill in:
 *   - discord       Discord community invite URL
 *   - contributing  CONTRIBUTING.md (the "Contribute" links fall back to GitHub Issues until it exists)
 *   - license       LICENSE file
 *   - site URL      set SITE_URL at build time (see vite.config.ts) for canonical, Open Graph and sitemap URLs
 */
const REPO = "https://github.com/Nahid8072/Selene";

export const links = {
  github: REPO,
  docs: `${REPO}/tree/main/docs`,
  readme: `${REPO}#readme`,
  issues: `${REPO}/issues`,
  contributing: null as string | null,
  discord: null as string | null,
  license: null as string | null,
} as const;

/** Where "Contribute" actions go: the guidelines once they exist, Issues until then. */
export const contributeHref = links.contributing ?? links.issues;

export const site = {
  name: "Selene",
  label: "Open Source Infrastructure",
  repoSlug: "Nahid8072/Selene",
  organization: "Schrodringers Lab",
  founders: ["Fardin Hasan Siam", "Nahid Hasan Ratul"],
} as const;
