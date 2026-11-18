import { formatUtc } from "../lib/format.ts";

/** Screen 06 sample. Nothing here is launched or measured. */

export type WorkloadType = "fetch" | "workspace" | "query" | "benchmark";

export type WorkloadStatus = "queued" | "running" | "completed" | "failed";

export interface WorkloadRecord {
  id: string;
  name: string;
  type: WorkloadType;
  agentsRequested: number;
  activeJobs: number;
  status: WorkloadStatus;
  startedAt: string | null;
  durationMs: number | null;
}

export const workloadRecords: WorkloadRecord[] = [
  {
    id: "wl_fetch_014",
    name: "Warm fetch, react",
    type: "fetch",
    agentsRequested: 10,
    activeJobs: 8,
    status: "running",
    startedAt: "2026-11-06T18:22:00Z",
    durationMs: 48 * 60 * 1000,
  },
  {
    id: "wl_ws_025",
    name: "Provision overlap workspaces",
    type: "workspace",
    agentsRequested: 25,
    activeJobs: 0,
    status: "queued",
    startedAt: null,
    durationMs: null,
  },
  {
    id: "wl_query_04",
    name: "Path query, kubernetes",
    type: "query",
    agentsRequested: 4,
    activeJobs: 0,
    status: "completed",
    startedAt: "2026-11-06T15:04:00Z",
    durationMs: 12 * 60 * 1000,
  },
  {
    id: "wl_bench_050",
    name: "Cold checkout benchmark",
    type: "benchmark",
    agentsRequested: 50,
    activeJobs: 0,
    status: "failed",
    startedAt: "2026-11-06T11:16:00Z",
    durationMs: 3 * 60 * 1000,
  },
];

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

export interface WorkloadRow {
  id: string;
  name: string;
  type: WorkloadType;
  agents_requested: string;
  active_jobs: string;
  status: WorkloadStatus;
  started_at: string;
  duration: string;
  actions: string;
}

export const workloadRows: WorkloadRow[] = workloadRecords.map((record) => ({
  id: record.id,
  name: record.name,
  type: record.type,
  agents_requested: String(record.agentsRequested),
  active_jobs: String(record.activeJobs),
  status: record.status,
  started_at: record.startedAt ? formatUtc(record.startedAt) : "—",
  duration: formatDuration(record.durationMs),
  actions: "",
}));

const count = (status: WorkloadStatus) => workloadRecords.filter((record) => record.status === status).length;

export const workloadMetrics = [
  {
    title: "Total",
    value: String(workloadRecords.length),
    context: "All workloads in this sample.",
  },
  {
    title: "Running",
    value: String(count("running")),
    context: "Executing now. Active jobs can be lower than the agents requested.",
  },
  {
    title: "Queued",
    value: String(count("queued")),
    context: "Waiting to start. No jobs are active yet.",
  },
  {
    title: "Completed",
    value: String(count("completed")),
    context: "Finished the requested repository operations.",
  },
  {
    title: "Failed",
    value: String(count("failed")),
    context: "Stopped on an error. Retry stays inactive in this preview.",
  },
];

export const workloadStatusOptions = [
  { value: "queued", label: "Queued" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

export const workloadTypeOptions = [
  { value: "fetch", label: "fetch" },
  { value: "workspace", label: "workspace" },
  { value: "query", label: "query" },
  { value: "benchmark", label: "benchmark" },
];

export const workloadRepositories = ["react", "kubernetes", "linux", "vscode", "synthetic-overlap"];

export const workloadDraft = {
  name: "overlap-fetch-16",
  repository: "react",
  operation: "fetch",
  workers: "10",
  concurrency: "4",
  priority: "normal",
  timeout: "30 min",
  cache: "warm",
  group: "overlap-sample",
};
