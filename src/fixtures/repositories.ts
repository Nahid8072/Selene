import { formatCount, formatUtcCompact } from "../lib/format.ts";
import type { RepositoryStatus } from "../types/domain.ts";

/** Screen 02 sample. Not a live registry and not the overview fixture. */

export interface RepositoryRecord {
  id: string;
  name: string;
  provider: "github" | "gitlab" | "self_hosted";
  providerLabel: string;
  defaultBranch: string;
  pinnedCommit: string | null;
  status: RepositoryStatus;
  lastSyncedAt: string | null;
  objectCount: number | null;
  linkedWorkspaces: number;
}

export const repositoryRecords: RepositoryRecord[] = [
  {
    id: "repo_react",
    name: "react",
    provider: "github",
    providerLabel: "GitHub",
    defaultBranch: "main",
    pinnedCommit: "e7b2a91c4d0f4e6a8b1c2d3e4f5061728394a0b1",
    status: "ready",
    lastSyncedAt: "2026-11-06T15:02:11Z",
    objectCount: 48211,
    linkedWorkspaces: 3,
  },
  {
    id: "repo_kubernetes",
    name: "kubernetes",
    provider: "github",
    providerLabel: "GitHub",
    defaultBranch: "master",
    pinnedCommit: "9c31d0aa11bb22cc33dd44ee55ff66778899aabb",
    status: "ready",
    lastSyncedAt: "2026-11-06T14:18:40Z",
    objectCount: 310442,
    linkedWorkspaces: 2,
  },
  {
    id: "repo_linux",
    name: "linux",
    provider: "github",
    providerLabel: "GitHub",
    defaultBranch: "master",
    pinnedCommit: "4f8e1c20aabbccddeeff00112233445566778899",
    status: "degraded",
    lastSyncedAt: "2026-11-05T22:14:33Z",
    objectCount: 8901130,
    linkedWorkspaces: 1,
  },
  {
    id: "repo_vscode",
    name: "vscode",
    provider: "github",
    providerLabel: "GitHub",
    defaultBranch: "main",
    pinnedCommit: null,
    status: "syncing",
    lastSyncedAt: null,
    objectCount: null,
    linkedWorkspaces: 0,
  },
];

export const providerFilterOptions = [
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "self_hosted", label: "Self-hosted" },
];

export const syncStatusFilterOptions = [
  { value: "ready", label: "Ready" },
  { value: "syncing", label: "Syncing" },
  { value: "degraded", label: "Degraded" },
];

export interface RepositoryRow {
  id: string;
  name: string;
  provider: string;
  default_branch: string;
  pinned_commit: string;
  status: RepositoryStatus;
  last_sync: string;
  object_count: string;
  linked_workspaces: number;
}

function countStatus(status: RepositoryStatus): number {
  return repositoryRecords.filter((record) => record.status === status).length;
}

export const repositoryMetrics = [
  {
    title: "Total repositories",
    value: formatCount(repositoryRecords.length),
    context: "Registered Git sources",
  },
  {
    title: "Healthy repositories",
    value: formatCount(countStatus("ready")),
    context: "Last sync marked ready",
  },
  {
    title: "Syncing",
    value: formatCount(countStatus("syncing")),
    context: "Mirror refresh in progress",
  },
  {
    title: "Degraded",
    value: formatCount(countStatus("degraded")),
    context: "Last known-good pin kept",
  },
];

export const repositoryRows: RepositoryRow[] = repositoryRecords.map((record) => ({
  id: record.id,
  name: record.name,
  provider: record.providerLabel,
  default_branch: record.defaultBranch,
  pinned_commit: record.pinnedCommit ? record.pinnedCommit.slice(0, 12) : "—",
  status: record.status,
  last_sync: record.lastSyncedAt ? formatUtcCompact(record.lastSyncedAt) : "—",
  object_count: record.objectCount === null ? "—" : formatCount(record.objectCount),
  linked_workspaces: record.linkedWorkspaces,
}));
