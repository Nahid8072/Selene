# Component catalog

Built pieces for screens 01–11 are listed below. The product list is `/agent/web/docs/product/SELENE_UI_SPECIFICATION.docx`. Specified shell pieces that are not built yet are recorded at the end. Libraries below are the ones installed in this app.

## Global shell

| Component | Role |
| --- | --- |
| `AppShell` | Desktop sidebar, sticky top bar, and a small-screen navigation drawer. Unknown routes are not rendered here. |
| `SidebarNav` | Logo, preview version, grouped navigation, inactive quick actions, and an inactive documentation shortcut. Full labels from 1200px, icon sidebar from 768px to 1199px, a collapse control on those widths, and a drawer below 768px. |
| `Topbar` | Inactive environment selector, breadcrumb, local search, sample status, illustrative notifications, and an inactive profile. The menu button opens the drawer below 768px. |
| `CommandPalette` | Ctrl+K and Cmd+K search of repositories, workspaces, workloads, and pages. Escape closes it. Enter navigates. |
| `NotificationPanel` | Sample notices from existing activity. Mark read, mark all read, dismiss, and open. Resets on reload. |
| `ReviewDialog` | Accessible review for a repository action. Confirm stays disabled. |
| `ConfirmationReview` | Inline destructive-action review. Confirm and cancel stay inactive. It is not the Sakani modal. |
| `SamplePager` | Sakani `Pagination` over the rows already on the page. It does not load more data. |
| `StatusNotice` | Empty, error, and loading notices. Empty and error use Sakani `EmptyState`. |

## Screen 01 — `src/features/overview`

| Component | Role |
| --- | --- |
| `OverviewPage` | Composes the sample alert, header, metrics, chart, cache panel, workload table, and activity feed. |
| `PageHeader` | Title, subtitle, and the inactive Add Repository and Run Benchmark buttons. |
| `MetricCard` | One summary figure. Wraps Sakani `StatCard` with no trend delta. |
| `RepositoryOperationsChart` | 24h sample line chart with labeled axes and a tooltip. The 24h / 7d / 30d control is visible and inert. |
| `CacheHealthPanel` | Hit/miss ratio, storage utilization, cached volume, and overall status. |
| `ActiveWorkloadsTable` | Workspace, repository, status, configured workers, and last activity. Stacks below 640px. |
| `RecentActivity` | Five sample events: sync, provisioning, and a recorded benchmark run. |
| `InfrastructureHealth` | Six sample service states: control plane, cache daemon, cache nodes, API gateway, workspace pool, and database. Not live checks. |

## Screen 02 — `src/features/repositories`

| Component | Role |
| --- | --- |
| `RepositoriesPage` | Heading, inactive Add Repository button, four summary cards, toolbar, and table. |
| `RepositoryToolbar` | Inactive search, provider filter, sync-status filter, and Refresh button. |
| `RepositoryTable` | Name, provider, branch, pinned commit, sync status, last synchronization, size, object count, cache status, and linked workspaces. Size and cache status come from the cache fixture. The name links to `/repositories/:id`. |
| `AddRepositoryPreview` | Inline add form: URL, provider, authentication, credential reference, masked token, branch, cache configuration, and a verification step. Verify and save stay disabled. |
| `RepositoryRowActions` | Per-row menu: view, synchronize, warm, create workspace, run benchmark, and remove. Reviews do not execute. |

## Screen 03 — `src/features/repository-details`

| Component | Role |
| --- | --- |
| `RepositoryDetailsPage` | Header, inactive actions, and local tabs: Overview, Branches, Commit History, Objects, Cache, Activity. |
| `SeriesChart` | One labeled time series for fetch frequency, retrieval volume, or agent activity. |

## Screen 04 — `src/features/workspaces`

| Component | Role |
| --- | --- |
| `WorkspacesPage` | Title, metrics, inactive filters, table, error and empty states, creation form, isolation note. |
| `WorkspaceTable` | All nine workspace columns. The table keeps its width and scrolls horizontally on a narrow viewport. The workspace id opens `/workspaces/:id`. |
| `WorkspaceStatusBadge` | running, queued, stopped, failed. |
| `WorkspaceActionMenu` | Create, stop, restart, destroy, and view logs stay inactive. Open Workspace Details routes to `ws_react_014`. |
| `WorkspaceConfigurationPanel` | Creation form that does not submit. First render shows a valid sample, including agent `agent-016`. |
| `WorkspaceIsolationPanel` | Shared immutable objects, private writable tree, isolated execution. |

## Screen 05 — `src/features/workspace-details`

| Component | Role |
| --- | --- |
| `WorkspaceDetailsPage` | Loads one sample by id, or a not-found state. |
| `WorkspaceHeader` | Identity fields, breadcrumb back to `/workspaces`, and the five detail actions. |
| `ResourceUsagePanel` | CPU, memory, disk, and network, each with current value and allocation. |
| `ResourceHistoryChart` | One illustrative series. Uses Recharts so the chart has a labeled y-axis. |
| `RepositoryStatePanel` | Tree state, HEAD, base commit, changes versus the base, uncommitted working-tree changes, and the change table. The counts match the rows. |
| `WorkspaceTimeline` | Chronological lifecycle. Running samples omit the stopped event. Stopped samples include it. The failed sample includes retry, failure, and cleanup. |
| `WorkspaceLogViewer` | Monospace log lines, or an empty state. |

## Screen 06 — `src/features/workloads`

| Component | Role |
| --- | --- |
| `WorkloadsPage` | Title, inactive Launch Workload button, metrics, inactive search and filters, table, and creation preview. |
| `WorkloadTable` | Workload columns plus row actions. Name and type have minimum widths. The table scrolls horizontally instead of shrinking type. The id and View Details open `/workloads/:id`. |
| `WorkloadStatusBadge` | queued, running, completed, failed. |
| `WorkloadCreationPreview` | Valid sample form, helper text, group, summary, and a separate validation example. It does not submit. |

## Screen 07 — `src/features/workload-details`

| Component | Role |
| --- | --- |
| `WorkloadDetailsPage` | One sample workload, or a not-found state. Metrics are derived from that workload’s jobs. |
| `WorkloadDetailHeader` | Identity fields, breadcrumb back to `/workloads`, and the three inactive actions. |
| `WorkloadJobTable` | Job ID, agent, operation, node, duration, status, and error. Successful rows show no error. |
| `WorkloadJobTimeline` | Occurred stages only, using Sakani `ActivityFeed`. |
| `WorkloadExecutionPanel` | Sample request logs, cache response, network transfer, retry, and failure. |

## Screen 08 — `src/features/cache`

| Component | Role |
| --- | --- |
| `CacheEnginePage` | Title, illustrative notice, metrics, architecture, storage, chart, policies, operations, events, and health. |
| `CacheArchitectureDiagram` | Workspaces, node cache, and upstream Git, with the four path labels. |
| `CacheStorageBreakdown` | Used-versus-free donut and capacity bar. |
| `CacheOperationsChart` | Sakani `LineChart` for hits, misses, writes, retrievals, and evictions. |
| `RepositoryCacheTable` | Per-repository objects, storage, hits, misses, and evictions. |
| `CachePolicyPanel` | Inactive sample policy fields. |
| `CacheOperationsPanel` | Inactive warm, inspect, clear, and pause controls, plus the impact of a clear. |
| `CacheEventFeed` | Recent events and the eviction history that sums to 42. |

`MetricCard` supplies the six summary figures. A separate cache metric card was not added.

## Screen 09 — `src/features/cache-nodes`

| Component | Role |
| --- | --- |
| `CacheNodesPage` | Title, five metrics, node table, node-a detail, empty future-node state, and inactive management actions. |
| `CacheNodeTable` | The nine node columns plus a local select control. |
| `NodeNetworkChart` | Inbound and outbound traffic. Outbound matches the 48.6 GB served on Cache Engine. |
| `NodeResourcePanel` | Illustrative CPU and memory history. |
| `NodeEvictionHistory` | The same four eviction rows as Cache Engine. |
| `NodeConnectionList` | Established connections on node-a. |
| `NodeErrorFeed` | Sample warning and information lines. |

`NodeHealthCard` and `NodeStoragePanel` were not added. `MetricCard`, `Badge`, and `CacheStorageBreakdown` already cover health and storage.

## Screen 10 — `src/features/benchmarks`

| Component | Role |
| --- | --- |
| `BenchmarkStudioPage` | Title, inactive header actions, responsibility note, and the studio sections. |
| `BenchmarkConfigPanel` | Repository, comparison, concurrency, cache state, operation, repetitions, and duration. |
| `WorkloadProfileEditor` | Simulator profile only. Overlap, access, branches, workspace creation, fetch, query, and failure injection. |
| `ResourceConstraintPanel` | CPU, memory, disk, and network limits on node-a. |
| `PreflightValidation` | Six static sample states. No check is executed. |
| `ExperimentSummary` | Methodology: baseline, candidate, revision, concurrency, cache, operation, resources, and profile. |
| `ExecutionPreview` | Static not-running counters. No measured comparison. |

`BenchmarkMetricCard` was not added. The preview counters use `MetricCard`.

## Screen 11 — `src/features/benchmark-results`

| Component | Role |
| --- | --- |
| `BenchmarkResultsPage` | Title, synthetic-data label, and the results sections. |
| `BenchmarkSummary` | Preview selector and the Screen 10 provenance. |
| `ComparativeMetricTable` | Side-by-side metrics computed from trial rows. Git cache hit rate is N/A. |
| `LatencyComparisonChart` | Checkout medians across concurrency, with a Y axis in milliseconds. |
| `NetworkComparisonChart` | Network medians across concurrency, in MB. |
| `ThroughputChart` | Throughput medians across concurrency, in ops/s. |
| `ResourceComparisonChart` | CPU and memory medians across concurrency. |
| `ConcurrencyAnalysis` | The same medians in a table for levels 1, 10, 25, 50, and 100, plus the latency chart. |
| `TrialResultsTable` | Per-trial rows, including failures. |
| `StatisticalSummary` | Median, p95, min, max, distribution, and failed counts from those rows. |
| `BenchmarkExportPanel` | Inactive CSV, JSON, and PDF actions. |
| `PreviewLineChart` | Shared Recharts chart with a Y axis. Sakani `LineChart` is not used here because it has no Y axis. |

The trial fixture has 30 rows, three for every system and concurrency level. Statistics and chart points are computed from the completed rows. Failed rows stay in the trial table.

## Screen 12 — `src/features/observability`

| Component | Role |
| --- | --- |
| `ObservabilityPage` | Title, local Metrics / Logs / Traces / Events tabs, and the alerts section. |
| `ObservabilityOverview` | Sample-data notice and the single host, node-a. |
| `MetricSelector` | One Sakani `Select` for the eight metrics. |
| `MetricsChart` | One focused series. Reuses `PreviewLineChart` so the chart has a Y axis. |
| `LogExplorer` | Inactive severity, service, time-range, request-identifier, and search controls. |
| `LogTable` | Seven fields, severity badges, monospace ids, wrapping messages, and an accordion for the full line. |
| `TraceWaterfall` | Six stages on one static trace. Durations add up to the request. |
| `TraceSpanDetails` | Start, duration, status, and parent for each stage. Uses Sakani `Table`. |
| `EventMonitor` | Five chronological events. Uses Sakani `Table` and `Badge`. |
| `AlertList` | Five sample alerts. Uses Sakani `Card` and `Badge`. Acknowledge, resolve, and configure stay inactive. |

`AlertCard` was not added. Each alert is a Sakani `Card` inside `AlertList`.

## Screen 13 — `src/features/integrations`

| Component | Role |
| --- | --- |
| `IntegrationsPage` | Title, notice, and local tabs for the five sections. |
| `APIOverviewPanel` | Five sample gateway fields. Values wrap inside the card. `MetricCard` is not used here because a long URL overflows its display value. |
| `APIKeyTable` | Masked keys. Revoke stays inactive. Uses Sakani `Table`. |
| `APIKeyPreview` | Disabled name, scopes, and expiration. No secret is generated. |
| `EndpointExplorer` | Category and operation navigation. No request is sent. |
| `EndpointDocumentation` | Method, description, and request, response, and code previews. |
| `IntegrationCard` | One not-connected integration. Uses Sakani `Card`. Connect and configure stay inactive. |
| `SDKExamplePanel` | Go, Python, CLI, REST, and gRPC previews. |

`CodeSnippetViewer` was not added. Code areas use Sakani `CodeSnippet` without a filename, so it does not offer a copy control.

## Screen 14 — `src/features/security`

| Component | Role |
| --- | --- |
| `SecurityPage` | Title, notice, and local tabs for the seven sections. |
| `SecurityOverview` | Compact sample posture. No security score. |
| `UserManagementTable` | Name, email, role, status, last login, and inactive row actions. |
| `InvitationList` | One sample invitation with role, status, and last login. |
| `RolePermissionMatrix` | Four roles across seven areas. Scrolls inside its container. |
| `RepositoryPermissionTable` | Repository, workspace, cache, and service boundaries. |
| `AuthenticationPanel` | Credential references, authentication configuration, and token rotation. |
| `TokenTable` | Masked API tokens reused from the integrations sample. |
| `AuditLogExplorer` | Five categories and inactive filters. |
| `SecurityConfigurationPanel` | Encryption, network, session, and secret settings. No secret values. |
| `SecurityOverview` | Four compact cards: accounts, invitations, host, and enforcement. Uses `MetricCard`. |

## Screen 15 — `src/features/settings`

| Component | Role |
| --- | --- |
| `SettingsPage` | Title, notice, and local tabs for the eight groups. |
| `SettingsSection` | One titled settings group. |
| `ConfigurationGroup` | A cluster of rows inside a section. |
| `ConfigurationRow` | Label, explanation, and one inactive control. |
| `ResourceLimitControl` | Inactive numeric limit with a unit. |
| `StorageConfigurationPanel` | Cache storage and workspace storage, kept separate. |
| `DatabaseHealthPanel` | Illustrative connection, pool, backup, and migration. |
| `NotificationSettingsPanel` | Email, webhook, and the observability alert names. Nothing is sent. |
| `MaintenancePanel` | Version, host, health, and inactive restart and export. |

## SakaniUI (`@sakaniui/react@0.12.0`)

`Accordion`, `AccordionItem`, `Alert`, `ActivityFeed`, `ActivityFeedHighlight`, `Badge`, `Breadcrumb`, `Button`, `Card`, `CodeSnippet`, `DonutChart`, `EmptyState`, `IconButton`, `Input`, `LineChart`, `Progress`, `ProgressStat`, `SegmentedControl`, `Select`, `Sidebar`, `SidebarDivider`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarItem`, `Slider`, `StatCard`, `Switch`, `Table`, `Tabs`, `TopBar`, `Pagination`.

Icons, from `@sakaniui/react/icons`: `IconActivity`, `IconAlertTriangle`, `IconApi`, `IconBell`, `IconBook`, `IconChartBar`, `IconCircleCheck`, `IconClock`, `IconDatabase`, `IconFolders`, `IconGitBranch`, `IconLayoutDashboard`, `IconMenu2`, `IconPlus`, `IconRadar`, `IconRefresh`, `IconSearch`, `IconSettings`, `IconShieldLock`, `IconX`.

Styles: `@sakaniui/react/tokens.css` and `@sakaniui/react/style.css`. The app maps Sakani semantic tokens to the monochrome palette in `src/styles/global.css`. `data-theme="dark"` is the default. `data-theme="light"` and a `prefers-color-scheme` fallback when `data-theme` is absent are both defined. The `dark` class stays in sync so Sakani components follow the same theme. Healthy, warning, and error colors are the library status tokens. Surfaces stay `data-surface="solid"`.

## HeroUI

None. `@heroui/react@3.2.7` resolves on npm and was not installed. SakaniUI already supplies the buttons, inputs, and icon buttons this screen uses.

## Other libraries

| Package | Use |
| --- | --- |
| `react-router@7.18.5` | `BrowserRouter`, `Routes`, `Route`, `Navigate`, `Link`. Built routes are `/`, `/repositories`, `/repositories/:id`, `/workspaces`, `/workspaces/:id`, `/workloads`, `/workloads/:id`, `/cache`, `/cache/nodes`, `/benchmarks`, `/benchmarks/results`, `/observability`, `/integrations`, `/security`, and `/settings`. Other paths redirect to `/`. Unknown workspace and workload ids stay on their detail routes and show not found. |
| `recharts@3.9.2` | `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer` in `RepositoryOperationsChart` and `SeriesChart`. |
| `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` | The families named by Sakani's `--font-sans` and `--font-mono`. |

`RepositoryOperationsChart` is custom because the installed Sakani `LineChart` draws an x-axis and a tooltip and does not draw a y-axis.

## Mock data

`src/fixtures/overview.ts` holds the overview sample. The page reads `overviewModel`. The chart displays the 24h series only.

`src/fixtures/repositories.ts` holds the Repositories sample: react, kubernetes, linux, and vscode. It does not replace the overview fixture.

`src/fixtures/repository-details.ts` holds Screen 03 branches, commits, object counts, cache counters, events, and chart series for those four ids.

`src/fixtures/workspaces.ts` holds the Screen 04 sample. It does not provision anything.

`src/fixtures/workspace-details.ts` holds Screen 05 resource, tree, timeline, and log samples for those six ids. The figures are illustrative.

`src/fixtures/workloads.ts` holds the Screen 06 sample. It does not launch a workload.

`src/fixtures/workload-details.ts` holds Screen 07 jobs, timelines, and execution records for those four ids. The job metrics are counted from the rows.

`src/fixtures/cache.ts` holds the Screen 08 sample. Its counters are checked against each other and against the repository object counts.

`src/fixtures/cache-nodes.ts` holds the Screen 09 sample for node-a. It reads the Screen 08 capacity, usage, hit rate, traffic, and evictions.

`src/fixtures/benchmarks.ts` holds the Screen 10 default profile, static preflight states, and the not-running execution counters.

`src/fixtures/benchmark-results.ts` holds 30 Screen 11 synthetic trial rows. Summary statistics and chart points are computed from the completed rows.

`src/fixtures/observability.ts` holds the Screen 12 sample for node-a: eight metric series, five log records, one six-stage trace, five events, and five alerts. Excessive Failed Jobs stays clear.

`src/fixtures/integrations.ts` holds the Screen 13 sample. Every documentation and SDK example is marked as a proposed illustration.

`src/fixtures/security.ts` holds the Screen 14 sample. Token identifiers match the integrations keys. No secret value is stored.

`src/fixtures/settings.ts` holds the Screen 15 sample. Cache figures come from the cache fixture. Workspace limits come from the workspace draft and detail allocations.

## Specified, not built

The specification also requires, on every screen: sidebar version, the full 15-item navigation, sidebar quick actions, a documentation shortcut, sidebar collapse, an environment selector, Ctrl+K search, a system-status indicator, searchable paginated tables, log viewers, and confirmation dialogs for destructive actions. Those pieces are not in the catalog of built components. The fifteen primary screens now have routes. Still unspecified in the built shell: sidebar version, quick actions, a documentation shortcut, an environment selector, Ctrl+K search, a system-status indicator, confirmation dialogs, and pagination. The modal and drawer flows named in the inventory are still inactive buttons, not built flows.
