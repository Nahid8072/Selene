import { formatUtc } from "../lib/format.ts";

/** Screen 04 sample. Not a live workspace and not a provisioned directory. */

export type WorkspaceStatus = "running" | "queued" | "stopped" | "failed";

export interface WorkspaceRecord {
  id: string;
  agent: string;
  repository: string;
  branch: string;
  baseCommit: string;
  status: WorkspaceStatus;
  createdAt: string;
  node: string;
  durationMs: number | null;
  completedAt: string | null;
  error: string | null;
}

export const workspaceRecords: WorkspaceRecord[] = [
  {
    id: "ws_react_014",
    agent: "agent-014",
    repository: "react",
    branch: "main",
    baseCommit: "e7b2a91c4d0f4e6a8b1c2d3e4f5061728394a0b1",
    status: "running",
    createdAt: "2026-11-06T18:20:02Z",
    node: "node-a",
    durationMs: 2 * 60 * 60 * 1000 + 14 * 60 * 1000,
    completedAt: null,
    error: null,
  },
  {
    id: "ws_k8s_warm",
    agent: "agent-ci-2",
    repository: "kubernetes",
    branch: "master",
    baseCommit: "9c31d0aa11bb22cc33dd44ee55ff66778899aabb",
    status: "running",
    createdAt: "2026-11-06T18:40:12Z",
    node: "node-a",
    durationMs: 54 * 60 * 1000,
    completedAt: null,
    error: null,
  },
  {
    id: "ws_linux_sparse",
    agent: "agent-sparse",
    repository: "linux",
    branch: "master",
    baseCommit: "4f8e1c20aabbccddeeff00112233445566778899",
    status: "queued",
    createdAt: "2026-11-06T19:05:44Z",
    node: "node-a",
    durationMs: null,
    completedAt: null,
    error: null,
  },
  {
    id: "ws_synth_07",
    agent: "agent-07",
    repository: "synthetic-overlap",
    branch: "main",
    baseCommit: "b04d5eed00001111222233334444555566667777",
    status: "failed",
    createdAt: "2026-11-06T16:27:44Z",
    node: "node-a",
    durationMs: 27 * 1000,
    completedAt: null,
    error: "Provisioning stopped because the mirror was still warming. The partial directory was removed.",
  },
  {
    id: "ws_react_review",
    agent: "agent-review",
    repository: "react",
    branch: "main",
    baseCommit: "e7b2a91c4d0f4e6a8b1c2d3e4f5061728394a0b1",
    status: "stopped",
    createdAt: "2026-11-06T12:10:00Z",
    node: "node-b",
    durationMs: 4 * 60 * 60 * 1000 + 6 * 60 * 1000,
    completedAt: null,
    error: null,
  },
  {
    id: "ws_vscode_01",
    agent: "agent-editor",
    repository: "vscode",
    branch: "main",
    baseCommit: "c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00",
    status: "stopped",
    createdAt: "2026-11-05T09:00:00Z",
    node: "node-b",
    durationMs: 6 * 60 * 60 * 1000,
    completedAt: "2026-11-05T15:00:00Z",
    error: null,
  },
];

export const emptyNode = {
  id: "node-c",
  label: "node-c",
  note: "No workspaces are assigned to this node in the sample.",
};

function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return "—";
  }
  const minutes = Math.round(durationMs / 60000);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest} min`;
  }
  return `${hours} h ${rest} min`;
}

export interface WorkspaceRow {
  id: string;
  agent: string;
  repository: string;
  branch: string;
  base_commit: string;
  status: WorkspaceStatus;
  created_at: string;
  node: string;
  duration: string;
}

export const workspaceRows: WorkspaceRow[] = workspaceRecords.map((record) => ({
  id: record.id,
  agent: record.agent,
  repository: record.repository,
  branch: record.branch,
  base_commit: record.baseCommit.slice(0, 12),
  status: record.status,
  created_at: formatUtc(record.createdAt),
  node: record.node,
  duration: formatDuration(record.durationMs),
}));

export const workspaceErrors = workspaceRecords
  .filter((record) => record.error)
  .map((record) => ({ id: record.id, message: record.error ?? "" }));

const count = (status: WorkspaceStatus) => workspaceRecords.filter((record) => record.status === status).length;

export const workspaceMetrics = [
  {
    title: "Total",
    value: String(workspaceRecords.length),
    context: "All workspaces in this sample, including stopped ones.",
  },
  {
    title: "Active",
    value: String(count("running")),
    context: "Running now. Each has its own writable tree.",
  },
  {
    title: "Queued",
    value: String(count("queued")),
    context: "Waiting for a node. Nothing has been provisioned.",
  },
  {
    title: "Failed",
    value: String(count("failed")),
    context: "Provisioning stopped. The error is shown below the table.",
  },
  {
    title: "Completed",
    value: String(workspaceRecords.filter((record) => record.completedAt).length),
    context: "Stopped after a finished run. Counted separately from a manual stop.",
  },
];

export const workspaceRepositories = ["react", "kubernetes", "linux", "vscode", "synthetic-overlap"];

export const workspaceStatusOptions = [
  { value: "running", label: "Running" },
  { value: "queued", label: "Queued" },
  { value: "stopped", label: "Stopped" },
  { value: "failed", label: "Failed" },
];

export const workspaceDraft = {
  repository: "react",
  revision: "e7b2a91c4d0f4e6a8b1c2d3e4f5061728394a0b1",
  name: "react-agent-016",
  agent: "agent-016",
  node: "automatic",
  cpu: "2",
  memory: "4 GB",
  disk: "20 GB",
  environment: "SELENE_CACHE=read-only",
  group: "overlap-sample",
  labels: "fixture, no-secrets",
};
