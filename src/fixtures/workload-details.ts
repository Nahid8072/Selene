import { formatUtc } from "../lib/format.ts";
import { workloadRecords, type WorkloadStatus, type WorkloadType } from "./workloads.ts";

/** Screen 07 sample. Counts are derived from the job rows. Nothing here is executed. */

export type JobStatus = "successful" | "failed" | "queued" | "running";

export interface WorkloadJob {
  id: string;
  agent: string;
  operation: string;
  node: string;
  durationMs: number | null;
  status: JobStatus;
  error: string | null;
}

export interface WorkloadLogLine {
  id: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
  source: string;
  message: string;
}

export interface WorkloadTimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  note: string;
}

export interface WorkloadExecution {
  jobId: string;
  requestLogs: WorkloadLogLine[];
  cacheResponse: string;
  networkTransfer: string;
  retry: string;
  failure: string;
}

export interface WorkloadDetail {
  id: string;
  name: string;
  type: WorkloadType;
  repository: string;
  status: WorkloadStatus;
  startedAt: string;
  agentsRequested: string;
  concurrencyLimit: string;
  duration: string;
  jobs: WorkloadJob[];
  totalJobs: string;
  successful: string;
  failed: string;
  queued: string;
  averageExecution: string;
  progress: string;
  progressNote: string;
  timeline: WorkloadTimelineEvent[];
  execution: WorkloadExecution;
}

function formatDuration(durationMs: number | null): string {
  if (durationMs === null) {
    return "—";
  }
  const minutes = Math.round(durationMs / 60000);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} h ${rest} min`;
}

function at(iso: string): string {
  return formatUtc(iso);
}

function event(id: string, label: string, iso: string, note: string): WorkloadTimelineEvent {
  return { id, label, timestamp: at(iso), note };
}

const fetchRunning: WorkloadJob[] = [
  ["01", 40],
  ["02", 36],
  ["03", 30],
  ["04", 28],
  ["05", 22],
  ["06", 18],
  ["07", 12],
  ["08", 8],
].map(([agent, minutes]) => ({
  id: `job_fetch_${agent}`,
  agent: `agent-${agent}`,
  operation: "fetch",
  node: "node-a",
  durationMs: Number(minutes) * 60 * 1000,
  status: "running",
  error: null,
}));

const fetchJobs: WorkloadJob[] = [
  ...fetchRunning,
  {
    id: "job_fetch_09",
    agent: "agent-09",
    operation: "fetch",
    node: "—",
    durationMs: null,
    status: "queued",
    error: null,
  },
  {
    id: "job_fetch_10",
    agent: "agent-10",
    operation: "fetch",
    node: "—",
    durationMs: null,
    status: "queued",
    error: null,
  },
];

const queuedJobs: WorkloadJob[] = ["01", "02", "03", "04"].map((agent) => ({
  id: `job_ws_${agent}`,
  agent: `agent-${agent}`,
  operation: "workspace provision",
  node: "—",
  durationMs: null,
  status: "queued" as const,
  error: null,
}));

const queryJobs: WorkloadJob[] = [
  ["01", 2],
  ["02", 3],
  ["03", 4],
  ["04", 3],
].map(([agent, minutes]) => ({
  id: `job_query_${agent}`,
  agent: `agent-${agent}`,
  operation: "query",
  node: "node-a",
  durationMs: Number(minutes) * 60 * 1000,
  status: "successful" as const,
  error: null,
}));

const benchJobs: WorkloadJob[] = [
  {
    id: "job_bench_01",
    agent: "agent-01",
    operation: "checkout",
    node: "node-b",
    durationMs: 2 * 60 * 1000,
    status: "successful",
    error: null,
  },
  {
    id: "job_bench_02",
    agent: "agent-02",
    operation: "checkout",
    node: "node-b",
    durationMs: 3 * 60 * 1000,
    status: "successful",
    error: null,
  },
  {
    id: "job_bench_03",
    agent: "agent-03",
    operation: "checkout",
    node: "node-b",
    durationMs: 1 * 60 * 1000,
    status: "failed",
    error: "Checkout stopped because the cold object fetch failed.",
  },
  {
    id: "job_bench_04",
    agent: "agent-04",
    operation: "checkout",
    node: "node-a",
    durationMs: 2 * 60 * 1000,
    status: "failed",
    error: "Worker exited before the checkout finished.",
  },
  {
    id: "job_bench_05",
    agent: "agent-05",
    operation: "checkout",
    node: "—",
    durationMs: null,
    status: "queued",
    error: null,
  },
];

interface DetailExtra {
  repository: string;
  concurrencyLimit: string;
  jobs: WorkloadJob[];
  timeline: WorkloadTimelineEvent[];
  execution: WorkloadExecution;
}

const detailById: Record<string, DetailExtra> = {
  wl_fetch_014: {
    repository: "react",
    concurrencyLimit: "8",
    jobs: fetchJobs,
    timeline: [
      event("creation", "Job creation", "2026-11-06T18:22:00Z", "Recorded in this sample."),
      event("queue", "Queue time", "2026-11-06T18:22:04Z", "The batch left the queue."),
      event("lookup", "Cache lookup", "2026-11-06T18:22:11Z", "Warm cache. Objects were already local."),
      event("objects", "Object retrieval", "2026-11-06T18:22:20Z", "Recorded in this sample."),
      event("setup", "Workspace setup", "2026-11-06T18:22:32Z", "Recorded in this sample."),
    ],
    execution: {
      jobId: "job_fetch_01",
      requestLogs: [
        {
          id: "fetch-req",
          timestamp: at("2026-11-06T18:22:01Z"),
          severity: "info",
          source: "Request",
          message: "Accepted a fetch for react at the pinned sample revision.",
        },
      ],
      cacheResponse: "Hit. The requested objects were served from node-a.",
      networkTransfer: "18 MB from the local cache. No upstream transfer in this sample.",
      retry: "None in this sample.",
      failure: "None in this sample.",
    },
  },
  wl_ws_025: {
    repository: "synthetic-overlap",
    concurrencyLimit: "10",
    jobs: queuedJobs,
    timeline: [
      event("creation", "Job creation", "2026-11-06T19:02:00Z", "Recorded in this sample."),
      event("queue", "Queue time", "2026-11-06T19:02:08Z", "Still queued. Later stages have not started."),
    ],
    execution: {
      jobId: "job_ws_01",
      requestLogs: [
        {
          id: "ws-req",
          timestamp: at("2026-11-06T19:02:01Z"),
          severity: "info",
          source: "Request",
          message: "Workspace provision was accepted and is waiting for a node.",
        },
      ],
      cacheResponse: "No cache response yet.",
      networkTransfer: "No transfer yet.",
      retry: "None in this sample.",
      failure: "None in this sample.",
    },
  },
  wl_query_04: {
    repository: "kubernetes",
    concurrencyLimit: "4",
    jobs: queryJobs,
    timeline: [
      event("creation", "Job creation", "2026-11-06T15:04:00Z", "Recorded in this sample."),
      event("queue", "Queue time", "2026-11-06T15:04:03Z", "The batch left the queue."),
      event("lookup", "Cache lookup", "2026-11-06T15:04:08Z", "Recorded in this sample."),
      event("objects", "Object retrieval", "2026-11-06T15:04:20Z", "Recorded in this sample."),
      event("setup", "Workspace setup", "2026-11-06T15:04:40Z", "Recorded in this sample."),
      event("completion", "Job completion", "2026-11-06T15:16:00Z", "All four jobs finished."),
    ],
    execution: {
      jobId: "job_query_01",
      requestLogs: [
        {
          id: "query-req",
          timestamp: at("2026-11-06T15:04:01Z"),
          severity: "info",
          source: "Request",
          message: "Path query for kubernetes completed without an error.",
        },
      ],
      cacheResponse: "Hit. Tree paths were read from the cached objects.",
      networkTransfer: "2 MB from node-a.",
      retry: "None in this sample.",
      failure: "None in this sample.",
    },
  },
  wl_bench_050: {
    repository: "linux",
    concurrencyLimit: "25",
    jobs: benchJobs,
    timeline: [
      event("creation", "Job creation", "2026-11-06T11:16:00Z", "Recorded in this sample."),
      event("queue", "Queue time", "2026-11-06T11:16:05Z", "The batch left the queue."),
      event("lookup", "Cache lookup", "2026-11-06T11:16:12Z", "Cold cache. The objects were not local."),
      event("objects", "Object retrieval", "2026-11-06T11:18:40Z", "Failed. The remaining objects were not fetched."),
    ],
    execution: {
      jobId: "job_bench_03",
      requestLogs: [
        {
          id: "bench-req",
          timestamp: at("2026-11-06T11:16:01Z"),
          severity: "info",
          source: "Request",
          message: "Cold checkout benchmark started for linux.",
        },
        {
          id: "bench-retry",
          timestamp: at("2026-11-06T11:17:10Z"),
          severity: "warning",
          source: "Retry",
          message: "Retried the object fetch once.",
        },
        {
          id: "bench-error",
          timestamp: at("2026-11-06T11:18:40Z"),
          severity: "error",
          source: "Failure",
          message: "Checkout stopped because the cold object fetch failed.",
        },
      ],
      cacheResponse: "Miss. The cold cache did not have the requested objects.",
      networkTransfer: "140 MB attempted from upstream. The transfer did not finish.",
      retry: "One retry of the object fetch. It did not succeed.",
      failure: "Checkout stopped because the cold object fetch failed.",
    },
  },
};

function averageExecution(jobs: WorkloadJob[]): string {
  const timed = jobs.filter((job) => job.durationMs !== null);
  if (timed.length === 0) {
    return "—";
  }
  const total = timed.reduce((sum, job) => sum + (job.durationMs ?? 0), 0);
  return formatDuration(total / timed.length);
}

export const workloadDetails: WorkloadDetail[] = workloadRecords.map((record) => {
  const extra = detailById[record.id];
  if (!extra) {
    throw new Error(`Missing workload detail for ${record.id}`);
  }
  const successful = extra.jobs.filter((job) => job.status === "successful").length;
  const failed = extra.jobs.filter((job) => job.status === "failed").length;
  const queued = extra.jobs.filter((job) => job.status === "queued").length;
  const running = extra.jobs.filter((job) => job.status === "running").length;
  if (successful + failed + queued + running !== extra.jobs.length) {
    throw new Error(`Job counts disagree for ${record.id}`);
  }
  const finished = successful + failed;
  const progress = extra.jobs.length === 0 ? 0 : Math.round((finished / extra.jobs.length) * 100);
  return {
    id: record.id,
    name: record.name,
    type: record.type,
    repository: extra.repository,
    status: record.status,
    startedAt: record.startedAt ? formatUtc(record.startedAt) : "—",
    agentsRequested: String(record.agentsRequested),
    concurrencyLimit: extra.concurrencyLimit,
    duration: formatDuration(record.durationMs),
    jobs: extra.jobs,
    totalJobs: String(extra.jobs.length),
    successful: String(successful),
    failed: String(failed),
    queued: String(queued),
    averageExecution: averageExecution(extra.jobs),
    progress: `${progress}%`,
    progressNote: `${finished} of ${extra.jobs.length} jobs have finished.`,
    timeline: extra.timeline,
    execution: extra.execution,
  };
});

export function workloadDetail(id: string): WorkloadDetail | null {
  return workloadDetails.find((item) => item.id === id) ?? null;
}

export function formatJobDuration(durationMs: number | null): string {
  return formatDuration(durationMs);
}
