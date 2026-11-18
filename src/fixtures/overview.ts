import { formatCount, formatPercent, formatUtcCompact } from "../lib/format.ts";
import { cacheHits, cacheMisses, storageSummary } from "./cache.ts";
import type {
  BenchmarkRun,
  CacheEntry,
  OperationPoint,
  OperationRange,
  Repository,
  Workspace,
  WorkspaceStatus,
} from "../types/domain.ts";

/** Fixed sample for the overview layout. Not a measurement and not a live node. */

export const environmentLabel = "node-a · single host";

export const presentedRange: OperationRange = "24h";

export const rangeOptions: { value: OperationRange; label: string }[] = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

const reactCommit = "e7b2a91c4d0f4e6a8b1c2d3e4f5061728394a0b1";
const kubernetesCommit = "9c31d0aa11bb22cc33dd44ee55ff66778899aabb";
const linuxCommit = "4f8e1c20aabbccddeeff00112233445566778899";
const syntheticCommit = "b04d5eed00001111222233334444555566667777";

export const repositories: Repository[] = [
  {
    id: "repo_react",
    name: "react",
    remote_url: "https://github.com/facebook/react.git",
    provider: "github",
    default_branch: "main",
    status: "ready",
    cached_commit: reactCommit,
    created_at: "2026-10-28T09:12:00Z",
    updated_at: "2026-11-06T15:02:11Z",
    last_synced_at: "2026-11-06T15:02:11Z",
  },
  {
    id: "repo_kubernetes",
    name: "kubernetes",
    remote_url: "https://github.com/kubernetes/kubernetes.git",
    provider: "github",
    default_branch: "master",
    status: "ready",
    cached_commit: kubernetesCommit,
    created_at: "2026-10-29T11:04:00Z",
    updated_at: "2026-11-06T14:18:40Z",
    last_synced_at: "2026-11-06T14:18:40Z",
  },
  {
    id: "repo_linux",
    name: "linux",
    remote_url: "https://github.com/torvalds/linux.git",
    provider: "github",
    default_branch: "master",
    status: "degraded",
    cached_commit: linuxCommit,
    created_at: "2026-10-30T08:40:00Z",
    updated_at: "2026-11-06T19:06:02Z",
    last_synced_at: "2026-11-05T22:14:33Z",
  },
  {
    id: "repo_synthetic",
    name: "synthetic-overlap",
    remote_url: "https://git.example.test/selene/synthetic-overlap.git",
    provider: "self_hosted",
    default_branch: "main",
    status: "syncing",
    cached_commit: null,
    created_at: "2026-11-06T16:20:00Z",
    updated_at: "2026-11-06T16:22:18Z",
    last_synced_at: null,
  },
];

export const cacheEntries: CacheEntry[] = [
  {
    repository_id: "repo_react",
    state: "ready",
    object_format: "sha1",
    object_count: 48211,
    disk_bytes: 620_000_000,
    lease_count: 3,
    last_successful_sync_at: "2026-11-06T15:02:11Z",
    last_error_code: null,
  },
  {
    repository_id: "repo_kubernetes",
    state: "ready",
    object_format: "sha1",
    object_count: 310442,
    disk_bytes: 2_480_000_000,
    lease_count: 2,
    last_successful_sync_at: "2026-11-06T14:18:40Z",
    last_error_code: null,
  },
  {
    repository_id: "repo_linux",
    state: "degraded",
    object_format: "sha1",
    object_count: 8_901_130,
    disk_bytes: 14_200_000_000,
    lease_count: 1,
    last_successful_sync_at: "2026-11-05T22:14:33Z",
    last_error_code: "UPSTREAM_TIMEOUT",
  },
  {
    repository_id: "repo_synthetic",
    state: "warming",
    object_format: "sha1",
    object_count: 12040,
    disk_bytes: 600_000_000,
    lease_count: 0,
    last_successful_sync_at: null,
    last_error_code: null,
  },
];

export const workspaces: Workspace[] = [
  {
    id: "ws_react_014",
    name: "react-agent-014",
    repository_id: "repo_react",
    base_commit: reactCommit,
    branch_name: null,
    status: "ready",
    cache_lease_id: "lease_react_014",
    created_at: "2026-11-06T18:20:02Z",
    ready_at: "2026-11-06T18:20:09Z",
    destroyed_at: null,
    error_code: null,
    error_message: null,
  },
  {
    id: "ws_react_015",
    name: "react-agent-015",
    repository_id: "repo_react",
    base_commit: reactCommit,
    branch_name: null,
    status: "ready",
    cache_lease_id: "lease_react_015",
    created_at: "2026-11-06T18:21:40Z",
    ready_at: "2026-11-06T18:21:46Z",
    destroyed_at: null,
    error_code: null,
    error_message: null,
  },
  {
    id: "ws_k8s_warm",
    name: "k8s-ci-warm",
    repository_id: "repo_kubernetes",
    base_commit: kubernetesCommit,
    branch_name: null,
    status: "ready",
    cache_lease_id: "lease_k8s_warm",
    created_at: "2026-11-06T18:40:12Z",
    ready_at: "2026-11-06T18:40:28Z",
    destroyed_at: null,
    error_code: null,
    error_message: null,
  },
  {
    id: "ws_k8s_warm_b",
    name: "k8s-ci-warm-b",
    repository_id: "repo_kubernetes",
    base_commit: kubernetesCommit,
    branch_name: null,
    status: "provisioning",
    cache_lease_id: "lease_k8s_warm_b",
    created_at: "2026-11-06T18:44:01Z",
    ready_at: null,
    destroyed_at: null,
    error_code: null,
    error_message: null,
  },
  {
    id: "ws_linux_sparse",
    name: "linux-sparse-02",
    repository_id: "repo_linux",
    base_commit: linuxCommit,
    branch_name: null,
    status: "ready",
    cache_lease_id: "lease_linux_02",
    created_at: "2026-11-06T17:54:18Z",
    ready_at: "2026-11-06T17:55:02Z",
    destroyed_at: null,
    error_code: null,
    error_message: null,
  },
  {
    id: "ws_synth_07",
    name: "synthetic-overlap-07",
    repository_id: "repo_synthetic",
    base_commit: syntheticCommit,
    branch_name: null,
    status: "failed",
    cache_lease_id: null,
    created_at: "2026-11-06T16:27:44Z",
    ready_at: null,
    destroyed_at: null,
    error_code: "CACHE_NOT_READY",
    error_message: "Workspace provisioning stopped because the mirror is still warming.",
  },
  {
    id: "ws_react_review",
    name: "react-review-003",
    repository_id: "repo_react",
    base_commit: reactCommit,
    branch_name: null,
    status: "stopping",
    cache_lease_id: "lease_react_review",
    created_at: "2026-11-06T12:10:00Z",
    ready_at: "2026-11-06T12:10:06Z",
    destroyed_at: null,
    error_code: null,
    error_message: null,
  },
];

/** Configured simulator workers for the sample workload rows. Not live sessions. */
const configuredWorkers: Record<string, number> = {
  ws_react_014: 4,
  ws_react_015: 4,
  ws_k8s_warm: 8,
  ws_k8s_warm_b: 8,
  ws_linux_sparse: 2,
  ws_synth_07: 5,
  ws_react_review: 1,
};

const lastActivityAt: Record<string, string> = {
  ws_react_014: "2026-11-06T18:22:14Z",
  ws_react_015: "2026-11-06T18:24:03Z",
  ws_k8s_warm: "2026-11-06T18:41:10Z",
  ws_k8s_warm_b: "2026-11-06T18:44:01Z",
  ws_linux_sparse: "2026-11-06T17:55:02Z",
  ws_synth_07: "2026-11-06T16:28:11Z",
  ws_react_review: "2026-11-06T19:01:36Z",
};

export const benchmarkRuns: BenchmarkRun[] = [
  {
    id: "run_react_warm_04",
    name: "react-warm-overlap",
    scenario_id: "overlap-same-sha",
    repository_id: "repo_react",
    commit_sha: reactCommit,
    baseline_mode: "standard-git",
    candidate_mode: "selene",
    concurrency: 10,
    repetitions: 5,
    cache_state: "warm",
    seed: 20261106,
    started_at: "2026-11-06T16:40:00Z",
    completed_at: "2026-11-06T17:12:18Z",
    status: "completed",
  },
];

export const operationSeries: Record<OperationRange, OperationPoint[]> = {
  "24h": [
    { label: "00:00", syncs: 4, provisions: 6 },
    { label: "03:00", syncs: 3, provisions: 5 },
    { label: "06:00", syncs: 6, provisions: 10 },
    { label: "09:00", syncs: 9, provisions: 16 },
    { label: "12:00", syncs: 11, provisions: 18 },
    { label: "15:00", syncs: 8, provisions: 12 },
    { label: "18:00", syncs: 14, provisions: 22 },
    { label: "21:00", syncs: 7, provisions: 9 },
  ],
  "7d": [
    { label: "31 Oct", syncs: 22, provisions: 41 },
    { label: "01 Nov", syncs: 18, provisions: 36 },
    { label: "02 Nov", syncs: 27, provisions: 48 },
    { label: "03 Nov", syncs: 24, provisions: 44 },
    { label: "04 Nov", syncs: 31, provisions: 57 },
    { label: "05 Nov", syncs: 29, provisions: 52 },
    { label: "06 Nov", syncs: 26, provisions: 49 },
  ],
  "30d": [
    { label: "09 Oct", syncs: 84, provisions: 160 },
    { label: "16 Oct", syncs: 91, provisions: 174 },
    { label: "23 Oct", syncs: 77, provisions: 149 },
    { label: "30 Oct", syncs: 102, provisions: 188 },
    { label: "06 Nov", syncs: 96, provisions: 181 },
  ],
};

export interface MetricSample {
  title: string;
  value: string;
  context: string;
}

export interface WorkloadRow {
  id: string;
  name: string;
  repository_name: string;
  status: WorkspaceStatus;
  assigned_agents: number;
  last_activity: string;
}

export interface ActivitySample {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface CacheHealthSample {
  statusLabel: string;
  badgeVariant: "success" | "warning" | "danger" | "info" | "neutral";
  hitsLabel: string;
  missesLabel: string;
  ratioLabel: string;
  utilization: number;
  utilizationLabel: string;
  volumeLabel: string;
  objectLabel: string;
  leaseLabel: string;
  note: string;
}

export interface OverviewModel {
  metrics: MetricSample[];
  operations: OperationPoint[];
  cache: CacheHealthSample;
  workloads: WorkloadRow[];
  activity: ActivitySample[];
}

const repositoryStatusOrder = ["ready", "degraded", "syncing", "error", "registered"] as const;

function statusContext(counts: Map<string, number>, order: readonly string[]): string {
  return order
    .filter((status) => (counts.get(status) ?? 0) > 0)
    .map((status) => `${counts.get(status)} ${status}`)
    .join(" · ");
}

function countStatuses(statuses: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const status of statuses) {
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }
  return counts;
}

function repositoryName(id: string): string {
  return repositories.find((repository) => repository.id === id)?.name ?? id;
}

const trackedWorkspaces = workspaces.filter(
  (workspace) => workspace.status !== "destroyed" && workspace.status !== "destroying",
);

const readyWorkspaces = trackedWorkspaces.filter((workspace) => workspace.status === "ready");

const objectCount = cacheEntries.reduce((sum, entry) => sum + (entry.object_count ?? 0), 0);
const leaseCount = cacheEntries.reduce((sum, entry) => sum + entry.lease_count, 0);

const workloadRows: WorkloadRow[] = trackedWorkspaces.map((workspace) => ({
  id: workspace.id,
  name: workspace.name,
  repository_name: repositoryName(workspace.repository_id),
  status: workspace.status,
  assigned_agents: configuredWorkers[workspace.id] ?? 0,
  last_activity: formatUtcCompact(lastActivityAt[workspace.id] ?? workspace.created_at),
}));

const activity: ActivitySample[] = [
  {
    id: "evt_linux_refresh",
    actor: "Cache manager",
    action: "failed a refresh for",
    target: "linux",
    timestamp: formatUtcCompact("2026-11-06T19:06:02Z"),
  },
  {
    id: "evt_k8s_ready",
    actor: "Workspace manager",
    action: "provisioned",
    target: "k8s-ci-warm",
    timestamp: formatUtcCompact("2026-11-06T18:40:28Z"),
  },
  {
    id: "evt_bench",
    actor: "Benchmark runner",
    action: "recorded a sample run for",
    target: benchmarkRuns[0]?.name ?? "benchmark",
    timestamp: formatUtcCompact(benchmarkRuns[0]?.completed_at ?? "2026-11-06T17:12:18Z"),
  },
  {
    id: "evt_synth_start",
    actor: "Workspace manager",
    action: "started provisioning",
    target: "synthetic-overlap-07",
    timestamp: formatUtcCompact("2026-11-06T16:28:11Z"),
  },
  {
    id: "evt_react_sync",
    actor: "Cache manager",
    action: "finished a warm sync for",
    target: "react",
    timestamp: formatUtcCompact("2026-11-06T15:02:11Z"),
  },
];

export const overviewModel: OverviewModel = {
  metrics: [
    {
      title: "Connected repositories",
      value: formatCount(repositories.length),
      context: statusContext(
        countStatuses(repositories.map((repository) => repository.status)),
        repositoryStatusOrder,
      ),
    },
    {
      title: "Active workspaces",
      value: formatCount(readyWorkspaces.length),
      context: `${readyWorkspaces.length} ready · ${trackedWorkspaces.length} tracked`,
    },
    {
      title: "Cache hit rate",
      value: formatPercent(cacheHits, cacheHits + cacheMisses),
      context: `${formatCount(cacheHits)} hits · ${formatCount(cacheMisses)} misses`,
    },
    {
      title: "Object storage usage",
      value: storageSummary.used,
      context: `${storageSummary.usedRatio}% of ${storageSummary.capacity} cache capacity`,
    },
  ],
  operations: operationSeries[presentedRange],
  cache: {
    statusLabel: "Degraded",
    badgeVariant: "warning",
    hitsLabel: formatCount(cacheHits),
    missesLabel: formatCount(cacheMisses),
    ratioLabel: formatPercent(cacheHits, cacheHits + cacheMisses),
    utilization: storageSummary.usedRatio,
    utilizationLabel: `${storageSummary.usedRatio}%`,
    volumeLabel: storageSummary.used,
    objectLabel: `${formatCount(objectCount)} objects`,
    leaseLabel: `${leaseCount} leases`,
    note: "One mirror refresh failed. The last successful sync is still the pinned source.",
  },
  workloads: workloadRows,
  activity,
};
