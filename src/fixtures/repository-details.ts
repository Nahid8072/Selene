import { formatBytes, formatCount, formatPercent, formatUtcCompact } from "../lib/format.ts";
import { capacityBytes } from "./cache.ts";
import { repositoryRecords } from "./repositories.ts";
import type { RepositoryRecord } from "./repositories.ts";

/** Illustrative detail for Screen 03. Not a live Git inspection. */

export interface BranchRecord {
  name: string;
  commit: string;
  updatedAt: string;
  isDefault: boolean;
  ref: string;
}

export interface CommitRecord {
  sha: string;
  message: string;
  author: string;
  committedAt: string;
  ref: string;
}

export interface ActivityRecord {
  id: string;
  actor: string;
  action: string;
  target: string;
  occurredAt: string;
}

export interface SeriesPoint {
  label: string;
  fetches: number;
  retrievals: number;
  agents: number;
}

export interface RepositoryDetail extends RepositoryRecord {
  remoteUrl: string;
  sizeBytes: number | null;
  connectionLabel: string;
  branches: BranchRecord[];
  commits: CommitRecord[];
  blobs: number | null;
  trees: number | null;
  commitObjects: number | null;
  cacheHits: number;
  cacheMisses: number;
  cacheBytes: number;
  cacheState: string;
  cacheNote: string;
  activity: ActivityRecord[];
  series: SeriesPoint[];
}

const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

function series(fetches: number[], retrievals: number[], agents: number[]): SeriesPoint[] {
  return hours.map((label, index) => ({
    label,
    fetches: fetches[index] ?? 0,
    retrievals: retrievals[index] ?? 0,
    agents: agents[index] ?? 0,
  }));
}

const details: Record<string, Omit<RepositoryDetail, keyof RepositoryRecord>> = {
  repo_react: {
    remoteUrl: "https://github.com/facebook/react.git",
    sizeBytes: 1_800_000_000,
    connectionLabel: "Connected",
    branches: [
      { name: "main", commit: "e7b2a91c4d0f", updatedAt: "2026-11-06T15:02:11Z", isDefault: true, ref: "refs/heads/main" },
      { name: "release/19", commit: "a11ce0190004", updatedAt: "2026-11-04T09:18:00Z", isDefault: false, ref: "refs/heads/release/19" },
      { name: "canary", commit: "b19c0de00077", updatedAt: "2026-11-06T11:40:22Z", isDefault: false, ref: "refs/heads/canary" },
    ],
    commits: [
      { sha: "e7b2a91c4d0f", message: "Pin workspace fixture at the mirrored main tip", author: "mirror", committedAt: "2026-11-06T14:58:02Z", ref: "main" },
      { sha: "91aa10bc22de", message: "Record object census after warm fetch", author: "cache-manager", committedAt: "2026-11-06T12:11:40Z", ref: "main" },
      { sha: "44c0ffee8811", message: "Update canary tip used by agent overlap jobs", author: "mirror", committedAt: "2026-11-05T18:02:09Z", ref: "canary" },
      { sha: "a11ce0190004", message: "Mark release/19 as a retained ref", author: "mirror", committedAt: "2026-11-04T09:18:00Z", ref: "release/19" },
    ],
    blobs: 40102,
    trees: 6108,
    commitObjects: 2001,
    cacheHits: 2100,
    cacheMisses: 180,
    cacheBytes: 1_800_000_000,
    cacheState: "Ready",
    cacheNote: "Warm mirror. Sample hit and miss counts, not a measured trial.",
    activity: [
      { id: "react-sync", actor: "Cache manager", action: "finished a warm sync of", target: "react", occurredAt: "2026-11-06T15:02:11Z" },
      { id: "react-fetch", actor: "Fetch worker", action: "fetched refs for", target: "refs/heads/main", occurredAt: "2026-11-06T15:01:40Z" },
      { id: "react-checkout", actor: "Workspace manager", action: "checked out", target: "react-agent-014", occurredAt: "2026-11-06T18:20:09Z" },
      { id: "react-query", actor: "Query worker", action: "resolved commit", target: "e7b2a91c4d0f", occurredAt: "2026-11-06T16:12:03Z" },
      { id: "react-object", actor: "Object reader", action: "served cached blobs for", target: "react", occurredAt: "2026-11-06T16:40:18Z" },
    ],
    series: series([4, 3, 6, 9, 8, 7, 11, 6], [18, 14, 22, 40, 36, 28, 44, 21], [1, 1, 2, 4, 4, 3, 4, 2]),
  },
  repo_kubernetes: {
    remoteUrl: "https://github.com/kubernetes/kubernetes.git",
    sizeBytes: 12_400_000_000,
    connectionLabel: "Connected",
    branches: [
      { name: "master", commit: "9c31d0aa11bb", updatedAt: "2026-11-06T14:18:40Z", isDefault: true, ref: "refs/heads/master" },
      { name: "release-1.31", commit: "1310aa44bb90", updatedAt: "2026-11-02T16:05:11Z", isDefault: false, ref: "refs/heads/release-1.31" },
    ],
    commits: [
      { sha: "9c31d0aa11bb", message: "Pin the CI warm workspace to master", author: "mirror", committedAt: "2026-11-06T14:12:55Z", ref: "master" },
      { sha: "77aa10bb33cc", message: "Keep release-1.31 reachable for lease tests", author: "mirror", committedAt: "2026-11-02T16:05:11Z", ref: "release-1.31" },
      { sha: "c0de44119900", message: "Note packfile reuse across two workspaces", author: "cache-manager", committedAt: "2026-11-06T13:40:00Z", ref: "master" },
    ],
    blobs: 260000,
    trees: 42000,
    commitObjects: 8442,
    cacheHits: 3200,
    cacheMisses: 420,
    cacheBytes: 12_400_000_000,
    cacheState: "Ready",
    cacheNote: "Shared object database for two linked workspaces. Sample counters.",
    activity: [
      { id: "k8s-sync", actor: "Cache manager", action: "finished a warm sync of", target: "kubernetes", occurredAt: "2026-11-06T14:18:40Z" },
      { id: "k8s-fetch", actor: "Fetch worker", action: "fetched refs for", target: "refs/heads/master", occurredAt: "2026-11-06T14:17:02Z" },
      { id: "k8s-checkout", actor: "Workspace manager", action: "checked out", target: "k8s-ci-warm", occurredAt: "2026-11-06T18:40:28Z" },
      { id: "k8s-object", actor: "Object reader", action: "served trees for", target: "kubernetes", occurredAt: "2026-11-06T18:41:10Z" },
    ],
    series: series([2, 2, 5, 8, 10, 9, 12, 7], [40, 36, 70, 120, 140, 110, 160, 80], [0, 1, 2, 6, 8, 8, 8, 4]),
  },
  repo_linux: {
    remoteUrl: "https://github.com/torvalds/linux.git",
    sizeBytes: 86_200_000_000,
    connectionLabel: "Degraded",
    branches: [
      { name: "master", commit: "4f8e1c20aabb", updatedAt: "2026-11-05T22:14:33Z", isDefault: true, ref: "refs/heads/master" },
      { name: "linux-6.11.y", commit: "6110aa22cc44", updatedAt: "2026-10-30T08:12:00Z", isDefault: false, ref: "refs/heads/linux-6.11.y" },
    ],
    commits: [
      { sha: "4f8e1c20aabb", message: "Last successful pin before the upstream timeout", author: "mirror", committedAt: "2026-11-05T22:10:04Z", ref: "master" },
      { sha: "6110aa22cc44", message: "Retain the stable branch ref", author: "mirror", committedAt: "2026-10-30T08:12:00Z", ref: "linux-6.11.y" },
      { sha: "deadd00d1100", message: "Sparse checkout sample for linux-sparse-02", author: "workspace-manager", committedAt: "2026-11-06T17:50:12Z", ref: "master" },
    ],
    blobs: 7_400_000,
    trees: 1_200_000,
    commitObjects: 301_130,
    cacheHits: 2800,
    cacheMisses: 900,
    cacheBytes: 86_200_000_000,
    cacheState: "Degraded",
    cacheNote: "Refresh failed with UPSTREAM_TIMEOUT. The last successful pin is still the source.",
    activity: [
      { id: "linux-fail", actor: "Cache manager", action: "failed a refresh of", target: "linux", occurredAt: "2026-11-06T19:06:02Z" },
      { id: "linux-sync", actor: "Cache manager", action: "recorded the last good sync of", target: "linux", occurredAt: "2026-11-05T22:14:33Z" },
      { id: "linux-checkout", actor: "Workspace manager", action: "checked out", target: "linux-sparse-02", occurredAt: "2026-11-06T17:55:02Z" },
      { id: "linux-query", actor: "Query worker", action: "read ref", target: "refs/heads/master", occurredAt: "2026-11-06T17:54:40Z" },
    ],
    series: series([1, 1, 2, 3, 2, 2, 1, 0], [12, 10, 18, 24, 20, 16, 8, 4], [0, 0, 1, 1, 2, 1, 1, 0]),
  },
  repo_vscode: {
    remoteUrl: "https://github.com/microsoft/vscode.git",
    sizeBytes: 0,
    connectionLabel: "Syncing",
    branches: [
      { name: "main", commit: "—", updatedAt: "2026-11-06T19:12:00Z", isDefault: true, ref: "refs/heads/main" },
    ],
    commits: [],
    blobs: null,
    trees: null,
    commitObjects: null,
    cacheHits: 320,
    cacheMisses: 80,
    cacheBytes: 0,
    cacheState: "Warming",
    cacheNote: "Mirror is still populating. The cache sample has no stored bytes for vscode yet.",
    activity: [
      { id: "vscode-start", actor: "Cache manager", action: "started a fetch of", target: "vscode", occurredAt: "2026-11-06T19:10:04Z" },
      { id: "vscode-ref", actor: "Fetch worker", action: "is reading", target: "refs/heads/main", occurredAt: "2026-11-06T19:12:00Z" },
    ],
    series: series([0, 0, 0, 0, 0, 1, 3, 4], [0, 0, 0, 0, 0, 2, 8, 14], [0, 0, 0, 0, 0, 0, 0, 0]),
  },
};

export interface RepositoryDetailView {
  id: string;
  name: string;
  providerLabel: string;
  remoteUrl: string;
  defaultBranch: string;
  pinnedCommit: string;
  sizeLabel: string;
  objectLabel: string;
  lastSyncLabel: string;
  connectionLabel: string;
  status: RepositoryRecord["status"];
  branches: { name: string; commit: string; updated: string; isDefault: string; ref: string }[];
  commits: { sha: string; message: string; author: string; timestamp: string; ref: string }[];
  objects: { label: string; value: number }[] | null;
  objectTotal: string | null;
  cache: {
    state: string;
    hits: string;
    misses: string;
    ratio: string;
    storage: string;
    note: string;
    utilization: number;
  };
  activity: { id: string; actor: string; action: string; target: string; timestamp: string }[];
  series: SeriesPoint[];
}

export function repositoryDetail(id: string): RepositoryDetailView | null {
  const base = repositoryRecords.find((record) => record.id === id);
  const extra = details[id];
  if (!base || !extra) {
    return null;
  }
  const objectTotal = base.objectCount;
  return {
    id: base.id,
    name: base.name,
    providerLabel: base.providerLabel,
    remoteUrl: extra.remoteUrl,
    defaultBranch: base.defaultBranch,
    pinnedCommit: base.pinnedCommit ?? "Not pinned yet",
    sizeLabel: extra.sizeBytes === null ? "—" : formatBytes(extra.sizeBytes),
    objectLabel: objectTotal === null ? "—" : formatCount(objectTotal),
    lastSyncLabel: base.lastSyncedAt ? formatUtcCompact(base.lastSyncedAt) : "Not synced yet",
    connectionLabel: extra.connectionLabel,
    status: base.status,
    branches: extra.branches.map((branch) => ({
      name: branch.name,
      commit: branch.commit,
      updated: formatUtcCompact(branch.updatedAt),
      isDefault: branch.isDefault ? "Default" : "—",
      ref: branch.ref,
    })),
    commits: extra.commits.map((commit) => ({
      sha: commit.sha,
      message: commit.message,
      author: commit.author,
      timestamp: formatUtcCompact(commit.committedAt),
      ref: commit.ref,
    })),
    objects:
      extra.blobs === null || extra.trees === null || extra.commitObjects === null
        ? null
        : [
            { label: "Blobs", value: extra.blobs },
            { label: "Trees", value: extra.trees },
            { label: "Commits", value: extra.commitObjects },
          ],
    objectTotal: objectTotal === null ? null : formatCount(objectTotal),
    cache: {
      state: extra.cacheState,
      hits: formatCount(extra.cacheHits),
      misses: formatCount(extra.cacheMisses),
      ratio:
        extra.cacheHits + extra.cacheMisses === 0
          ? "—"
          : formatPercent(extra.cacheHits, extra.cacheHits + extra.cacheMisses),
      storage: formatBytes(extra.cacheBytes),
      note: extra.cacheNote,
      utilization: Math.min(100, Math.round((extra.cacheBytes / capacityBytes) * 100)),
    },
    activity: extra.activity.map((event) => ({
      id: event.id,
      actor: event.actor,
      action: event.action,
      target: event.target,
      timestamp: formatUtcCompact(event.occurredAt),
    })),
    series: extra.series,
  };
}
