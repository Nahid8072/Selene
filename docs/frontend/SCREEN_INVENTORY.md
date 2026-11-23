# Screen inventory

Authoritative list: `/agent/web/docs/product/SELENE_UI_SPECIFICATION.docx` (Selene — Complete UI Screen Architecture). Routes below are recorded only where the app already has them. The specification does not assign URLs to screens 04–15.

Status values: **Implemented**, **Partial** (a screen exists but does not yet match the specification), **Not started**.

## 01 — Overview Dashboard

| Field | Value |
| --- | --- |
| Area | Overview |
| Priority in spec | MVP, highest |
<<<<<<< HEAD
| Route | `/` |
=======
| Route | `/overview` |
>>>>>>> landing-page
| Feature folder | `src/features/overview` |
| Status | Partial |

Specified, not all present in the current page:

- Header: welcome and organization or project name, environment selector (Production, Development), global search, notifications, user profile, time-range selector.
- KPI cards: Active Agents, Running Workloads, Cache Hit Rate, Average Checkout Time, Network Data Served.
- Repository activity chart: fetch, checkout, push, repository queries, operations per second.
- Cache utilization: capacity, used, available, hit/miss distribution, efficiency over time.
- Infrastructure health: control plane, cache daemon, cache nodes, API gateway, workspace pool, database connection.
- Recent activity: workspace provisioned, repository synchronized, cache warmed, cache miss, workload completed, node unavailable.
- Quick actions: Add repository, Launch workspace, Run benchmark, View logs.

The built page instead shows Connected Repositories, Active Workspaces, Cache Hit Rate, and Object Storage Usage, plus a sync/provision chart, a cache panel, a workload table, and a sample activity feed. Add Repository and Run Benchmark are visible and inactive.

## 02 — Repositories

| Field | Value |
| --- | --- |
| Area | Repository management |
| Priority in spec | MVP, core |
| Route | `/repositories` |
| Feature folder | `src/features/repositories` |
| Status | Partial |

Specified:

- Header: title Repositories, total count, Add Repository, search, filters.
- Table columns: repository name and provider, default branch, size, objects, cache status (cached, partially cached, uncached), last sync, active agents, status (connected, syncing, error).
- Filters: all, GitHub, GitLab, self-hosted, healthy, syncing, failed.
- Row actions: view, synchronize, warm cache, create workspace, run benchmark, remove connection.
- Add Repository flow: URL, provider, authentication method, access token or credential reference, default branch, optional cache configuration, and a connection check before save.

Built columns differ: name, provider, default branch, latest pinned commit, sync status, last synchronization, object count, linked workspaces. Names link to Screen 03. Add Repository, search, provider filter, sync-status filter, and Refresh are visible and inactive. There is no add-repository form.

## 03 — Repository Details

| Field | Value |
| --- | --- |
| Area | Repository management |
| Route | `/repositories/:id` |
| Feature folder | `src/features/repository-details` |
| Status | Partial |

Specified and present: name, provider, URL, default branch, commit SHA, size, object count, last sync, connection status; tabs Overview, Branches, Commit History, Objects, Cache, Activity; inactive actions synchronize, warm cache, provision workspace, start benchmark, configure cache policy; charts for fetch frequency, object retrieval volume, and agent activity.

Specified and not matched: Commit History is a table, not a commit graph. Sample data is labeled illustrative. The four sample repositories are react, kubernetes, linux, and vscode.

## 04 — Agent Workspaces

| Field | Value |
| --- | --- |
| Area | Agent operations |
| Priority in spec | MVP, core |
| Route | `/workspaces` |
| Feature folder | `src/features/workspaces` |
| Status | Implemented for this pass. Operational actions stay inactive. Rows and Open Workspace Details open Screen 05. |

Specified and present: total, active, queued, failed, and completed metrics; table columns workspace ID, agent, repository, branch, base commit, status (running, queued, stopped, failed), created at, node, duration; inactive create, stop, restart, destroy, view logs, and open details; creation fields for repository, revision, name, agent, node, resource limits, environment, group, and labels, plus a validation example and a review section; isolation copy that writable state is not shared. Search and filters are visible and inactive. Empty and error states are shown from the fixture.

## 05 — Workspace Details

| Field | Value |
| --- | --- |
| Area | Agent operations |
| Route | `/workspaces/:id` |
| Feature folder | `src/features/workspace-details` |
| Status | Implemented for this pass. Operational actions stay inactive. |

Specified and present: workspace ID, agent ID, repository, branch, base commit, created at, status, host node, directory or mount. CPU, memory, disk, and network each show a current value, an allocation, a unit, and an illustrative history. Repository state separates changes versus the base commit from uncommitted working-tree changes. Those counts match the change table. Samples cover clean, modified, uncommitted, and sync-issue trees. The timeline is chronological. A running workspace has no stopped event. A stopped workspace has a real stopped timestamp. A failed workspace shows the recorded retry, failure, and cleanup, and no stopped event. Logs show timestamp, severity, source, and message for provisioning, repository operations, errors, and retries, in monospace, plus an empty state. Stop, Restart, Destroy, and Compare with Base Commit are inactive. Inspect Logs scrolls to the log section. Unknown ids show a not-found state. The breadcrumb returns to `/workspaces`.

## 06 — Workloads

| Field | Value |
| --- | --- |
| Area | Agent operations |
| Priority in spec | MVP |
| Route | `/workloads` |
| Feature folder | `src/features/workloads` |
| Status | Implemented for this pass. Launch Workload stays inactive. Rows open Screen 07. |

Specified and present: title and subtitle, total, running, queued, completed, and failed metrics, and a table with workload ID, name, type (fetch, workspace, query, benchmark), agents requested, active jobs, status, started at, and duration. Name and type keep their width and the table scrolls horizontally. The sample covers those four types and four statuses. Agents requested is separate from active jobs. Search and filters are visible and inactive. The creation preview shows a valid sample and does not submit. Launch Workload is the only primary creation action. Pause, Cancel, and Retry Failed Jobs are on the row, only for a status that supports them, and stay inactive. View Details opens Screen 07.

## 07 — Workload Details

| Field | Value |
| --- | --- |
| Area | Agent operations |
| Route | `/workloads/:id` |
| Feature folder | `src/features/workload-details` |
| Status | Implemented for this pass. Operational actions stay inactive. |

Specified and present for the four sample workloads: id, name, type, repository, status, start time, requested agents, concurrency limit, and duration. Metrics are total jobs, successful, failed, queued, average execution time, workload status, and execution progress, and they match the job table. The timeline shows only stages that occurred. A queued workload stops at queue time. A failed workload stops at the failed object retrieval. A running workload has no job-completion event. The job table includes several states, and successful rows have no error text. Execution details show request logs, cache response, network transfer, retry, and failure from the sample. Cancel Workload, Retry Failed Jobs, and Export Logs stay inactive. Unknown ids show a not-found state. The breadcrumb returns to `/workloads`.

## 08 — Cache Engine

| Field | Value |
| --- | --- |
| Area | Infrastructure |
| Priority in spec | MVP, core differentiator |
| Route | `/cache` |
| Feature folder | `src/features/cache` |
| Status | Implemented for this pass. Operational actions stay inactive. |

Specified and present for one host, node-a: architecture from agent workspaces through the shared node cache to upstream Git, with lookup, hit, miss/upstream, and delivery back. Regional cache is marked future and unconfigured. Metrics are hit rate 84.2%, 1,580 misses, 8,420 objects served, 48.6 GB served, 18 ms average hit latency, and 42 evictions. Storage is 120.0 GB capacity, 100.4 GB used, 19.6 GB free, and 9,259,783 objects, matching the repository object counts. The 24h chart covers hits, misses, writes, retrievals, and evictions. Policies are a labeled sample. Clear and pause explain permission, impact, and that confirmation would be required. They do not run.

## 09 — Cache Nodes

| Field | Value |
| --- | --- |
| Area | Infrastructure |
| Route | `/cache/nodes` |
| Feature folder | `src/features/cache-nodes` |
| Status | Implemented for this pass. Management actions stay inactive. |

Specified and present for the single host node-a: total, healthy, unhealthy, total storage, and aggregate traffic. The table has node ID, hostname, region, status, cache size, hit rate, requests per second, CPU/RAM, and last heartbeat. Selecting node-a shows storage, network, CPU and memory, latency and hit/miss, eviction history, connections, and errors. Storage, hit rate, latency, and served bytes match Cache Engine. Extra nodes appear only as an unconfigured empty state. Register, configure, drain, restart, and remove are visible and inactive. Drain, restart, and remove state the impact and that confirmation would be required.

## 10 — Benchmark Studio

| Field | Value |
| --- | --- |
| Area | Performance and observability |
| Priority in spec | MVP, essential for the research demo |
| Route | `/benchmarks` |
| Feature folder | `src/features/benchmarks` |
| Status | Implemented for this pass. Run controls stay inactive. |

Specified and present: repository, conventional Git baseline, Selene candidate, concurrency 1/10/25/50/100, cold or warm cache, operation, repetitions, and duration. Workload profile: overlap, access frequency, branch distribution, concurrent workspace creation, fetch and query frequency, and optional failure injection. Resources are limited to node-a. Preflight shows Ready, Warning, Blocked, and Not checked as static sample states. Start, stop, save, and schedule are inactive. The execution preview is labeled not running and does not claim a measured speedup. Results stay on Screen 11.

## 11 — Benchmark Results

| Field | Value |
| --- | --- |
| Area | Performance and observability |
| Route | `/benchmarks/results` |
| Feature folder | `src/features/benchmark-results` |
| Status | Implemented for this pass. Exports stay inactive. Values are synthetic, not measured. |

Specified and present for the Screen 10 `repo_react` profile: summary, provenance, a side-by-side metric table, charts for latency, network, throughput, resources, and concurrency, a trial table, statistics, and inactive CSV, JSON, and PDF actions. The fixture is 30 synthetic rows: 3 repetitions × concurrency 1, 10, 25, 50, and 100 × Git and Selene. Two of those rows are failed and stay visible. Means, medians, p95, min, max, histograms, and chart points use completed rows only. The series cross, so neither system is ahead at every level. Git cache hit rate is N/A. Selene cache hit rate is “not measured.” The page does not claim a speedup, delta, winner, or significance. The metric and trial tables use the container width. Git and Selene statistics sit in a two-column grid.

## 12 — Observability

| Field | Value |
| --- | --- |
| Area | Performance and observability |
| Priority in spec | MVP, essential |
| Route | `/observability` |
| Feature folder | `src/features/observability` |
| Status | Implemented for this pass. Filters, search, and alert actions stay inactive. The sample is not live telemetry. |

Specified and present for node-a only: overview, a metric selector with one chart, logs, one trace, events, and alerts. Metrics: API latency, cache retrieval latency, request throughput, cache hit/miss rate, network traffic, CPU, memory, and disk I/O. The chart has axes, a unit, a legend, and a tooltip. The time-range control does not load another window. Logs have timestamp, service, severity, request ID, repository ID, workspace ID, and message. Filters for error, warning, information, service, time range, and request identifier are visible and inactive, as is search. The trace has six stages whose durations add up to the request. Events are node failure, cache miss, authentication failure, provisioning error, and synchronization, in time order. Alerts are high miss rate, low storage, high latency, unhealthy node, and excessive failed jobs. Excessive Failed Jobs stays clear because the sample has one failed provision and the threshold is more than two in an hour. Acknowledge, resolve, and configure stay inactive.

## 13 — API & Integrations

| Field | Value |
| --- | --- |
| Area | Developer and administration |
| Route | `/integrations` |
| Feature folder | `src/features/integrations` |
| Status | Implemented for this pass. Create, revoke, connect, and configure stay inactive. Examples are proposed illustrations, not a finalized contract. |

Specified and present: overview sample values, a masked key table, a creation preview that does not generate a secret, documentation for repositories, workspaces, cache, workloads, benchmarks, and observability, five not-connected integrations, and illustrative Go, Python, CLI, REST, and gRPC examples. No request is sent.

## 14 — Security & Access Control

| Field | Value |
| --- | --- |
| Area | Developer and administration |
| Route | `/security` |
| Feature folder | `src/features/security` |
| Status | Implemented for this pass. Invite, role, account, token, and rotation actions stay inactive. The sample is not enforced. |

Specified and present: four overview cards for sample accounts, pending invitations, the configured host, and enforcement status. There is no security score, and enforcement is not active. Also present: four fictional accounts, one invitation, the four roles, a permission matrix, repository and workspace and cache and service boundaries, masked tokens, credential references, authentication configuration, rotation, five audit categories, and encryption, network, session, and secret settings. No secret value is shown.

## 15 — System Settings

| Field | Value |
| --- | --- |
| Area | Developer and administration |
| Route | `/settings` |
| Feature folder | `src/features/settings` |
| Status | Implemented for this pass. Every control stays inactive. Changes are not saved or applied. |

Specified and present: General, Control Plane, Storage, Cache Configuration, Workspace Configuration, Database, Notifications, and System Maintenance. Cache size, use, free space, eviction, and warming match Cache Engine. Workspace CPU, memory, disk, and network match the workspace samples. The database is labeled illustrative. Notifications reuse the observability alert names and send nothing. Restart and export stay inactive.

## Interactions that are not screens

The specification keeps these as modals, drawers, or guided flows: Add Repository, Create Workspace, Launch Workload, Register Cache Node, Configure Cache Policy, Start Benchmark, Create API Key, Invite User, Create Alert. None of these flows are built. Current primary buttons are visible and inactive.

## Global shell specified for every screen

Persistent sidebar: logo and version, the 15-item navigation above, quick actions, documentation shortcut, collapse and expand. Top bar: environment selector, global search (Ctrl+K), notifications, system status, user profile. Shared pieces: metric cards, searchable tables, time-series charts, status indicators, event timelines, log viewers, confirmation dialogs, pagination and filters.

Overview includes a six-service infrastructure health sample. Search and notifications are local preview interactions. Repositories show size and cache status from the cache fixture, a per-row action menu, and an Add Repository preview that does not save. Repository details actions open a review whose confirm stays disabled. The shell now shows the Selene mark and preview version, the routed navigation, inactive quick actions, an inactive documentation shortcut, and a collapse control beside the responsive drawer. The top bar has an inactive environment selector, an inactive search field with a Ctrl+K hint, a sample status, inactive notifications, and an inactive profile. Confirmation review, paging, empty, loading, and error notices exist as shared components. They do not call a backend. The routed items are Overview, Repositories, Agent Workspaces, Cache Engine, Cache Nodes, Workloads, Benchmarks, Benchmark Results, Observability, API & Integrations, Security & Access Control, and Settings.
