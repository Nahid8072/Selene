/**
 * Every outbound destination used by the landing page.
 *
 * Only verified, existing URLs belong here. A destination that does not exist
 * yet (Discord invite, CONTRIBUTING.md, LICENSE) stays `null`, and every link
 * that points to it is hidden until it is filled in.
 */
const REPO = "https://github.com/Nahid8072/Selene";

export const links = {
  github: REPO,
  docs: `${REPO}/tree/main/docs`,
  setup: `${REPO}#readme`,
  issues: `${REPO}/issues`,
  pullRequests: `${REPO}/pulls`,
  contributing: null as string | null,
  discord: null as string | null,
  license: null as string | null,
  /** The in-app UI preview, which runs on sample data. */
  preview: "/overview",
} as const;

export const site = {
  name: "Selene",
  tagline: "Shared infrastructure for concurrent AI coding agents.",
  shortDescription:
    "Selene is open-source infrastructure for concurrent AI coding agents, with Git-compatible repository access, shared object caching, and isolated workspaces.",
  organization: "Schrodringers Lab",
  founders: ["Fardin Hasan Siam", "Nahid Hasan Ratul"],
} as const;
