# Frontend rules

These rules apply to the Selene preview in this app. They follow `/cursor/stores/self/docs/frontend-phase-rules.md`.

## Scope

Screens are built one at a time. Screen 01 is `/overview`. The public landing page is `/`. Screen 02 is `/repositories`. Screen 03 is `/repositories/:id`. Screen 04 is `/workspaces`. Screen 05 is `/workspaces/:id`. Screen 06 is `/workloads`. Screen 07 is `/workloads/:id`. Screen 08 is `/cache`. Screen 09 is `/cache/nodes`. Screen 10 is `/benchmarks`. Screen 11 is `/benchmarks/results`. Screen 12 is `/observability`. Screen 13 is `/integrations`. Screen 14 is `/security`. Screen 15 is `/settings`. Do not start backend work or another primary screen until the user names it. There is no backend, API, auth, database, clone, or sync.

## Interaction

Operational buttons stay visible and inactive. Search, filters, dropdowns, and in-page range controls do not have handlers. Sidebar navigation and local routing work only for implemented screens. Repository rows link to `/repositories/:id`. Tabs on that page switch locally. Workspace rows and Open Workspace Details link to `/workspaces/:id`. Inspect Logs on that page scrolls to the sample log section. Other workspace actions stay inactive. An unknown workspace id shows a not-found state. Workload rows and View Details open `/workloads/:id`. Launch Workload stays inactive. Pause, Cancel, and Retry Failed Jobs are row-level, shown only where that status supports them, and stay inactive. An unknown workload id shows a not-found state. Cancel Workload, Retry Failed Jobs, and Export Logs on the detail page stay inactive. Cache Engine is `/cache`. Warm, inspect, clear, and pause/resume stay inactive and do not change the cache. Cache Nodes is `/cache/nodes`. Register, configure, drain, restart, and remove stay inactive. Benchmark Studio is `/benchmarks`. Start, stop, save, and schedule stay inactive and appear once. Configuration controls may change the preview locally and do not run an experiment. Benchmark Results is `/benchmarks/results`. Its export actions stay inactive and look inactive. Preview numbers there are 30 synthetic trials and are not measurements. Observability is `/observability`. Its metric, log, trace, and event sections switch locally. Search, log filters, and alert actions stay inactive. The page does not claim live telemetry. Excessive Failed Jobs stays clear when the sample has one failed provision. API & Integrations is `/integrations`. Its sections switch locally. Create, revoke, connect, and configure stay inactive. Examples are labeled as proposed illustrations, not a finalized contract. Security & Access Control is `/security`. Its sections switch locally. Invite, role changes, disable, remove, create, revoke, and rotate stay inactive. The permission matrix is illustrative and is not enforced. System Settings is `/settings`. Its sections switch locally. Every setting stays inactive, and nothing is saved or applied. The shell shows the preview version, inactive quick actions, an inactive documentation shortcut, a collapse control, and an inactive environment selector. Ctrl+K and Cmd+K open a local search of sample records and pages. The notification list is illustrative client state and resets on reload. Repository row actions open reviews whose confirm stays disabled. Confirmation review and paging do not run an operation or load more rows. Other unknown paths redirect to the landing page at `/`.

## Theme

Tokens live in `src/styles/global.css`.

- `data-theme="dark"` is the shipped default.
- `data-theme="light"` uses the light palette.
- If `data-theme` is absent, the palette follows `prefers-color-scheme`.
- There is no theme switcher.
- Primary actions use neutral foreground and background tokens. Healthy, warning, and error keep Sakani status colors.
- Light secondary text uses `#404040` and `#525252` so it stays readable on white. Disabled buttons do not fade a whole section; only the control itself is inactive.
- Do not hardcode a color in a component when a token already exists.

## Components and data

Reuse `AppShell`, `SidebarNav`, `Topbar`, and `MetricCard`. Keep fixtures out of view files. Use SakaniUI from the installed package. Do not install HeroUI. Do not treat an MCP server as available unless this session can actually call it.
