/** Screen 12 sample for node-a. Not live telemetry. */

export const observabilityHost = "node-a";
export const observabilityNotice = "Illustrative sample. This is not live telemetry.";

export const metricOptions = [
  { value: "api-latency", label: "API Latency", unit: "ms" },
  { value: "cache-latency", label: "Cache Retrieval Latency", unit: "ms" },
  { value: "throughput", label: "Request Throughput", unit: "req/s" },
  { value: "hit-rate", label: "Cache Hit/Miss Rate", unit: "percent hit" },
  { value: "network", label: "Network Traffic", unit: "MB" },
  { value: "cpu", label: "CPU Utilization", unit: "percent" },
  { value: "memory", label: "Memory Utilization", unit: "GB" },
  { value: "disk", label: "Disk I/O", unit: "MB/s" },
] as const;

export type MetricId = (typeof metricOptions)[number]["value"];

const labels = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

function series(values: number[]): { label: string; value: number }[] {
  return labels.map((label, index) => ({ label, value: values[index] }));
}

export const metricAxis: Record<MetricId, { top: number; ticks: number[] }> = {
  "api-latency": { top: 80, ticks: [0, 20, 40, 60, 80] },
  "cache-latency": { top: 40, ticks: [0, 10, 20, 30, 40] },
  throughput: { top: 80, ticks: [0, 20, 40, 60, 80] },
  "hit-rate": { top: 100, ticks: [0, 25, 50, 75, 100] },
  network: { top: 12, ticks: [0, 3, 6, 9, 12] },
  cpu: { top: 100, ticks: [0, 25, 50, 75, 100] },
  memory: { top: 8, ticks: [0, 2, 4, 6, 8] },
  disk: { top: 12, ticks: [0, 3, 6, 9, 12] },
};

export const metricSeries: Record<MetricId, { label: string; value: number }[]> = {
  "api-latency": series([42, 48, 45, 51, 47, 44]),
  "cache-latency": series([12, 18, 16, 22, 18, 15]),
  throughput: series([36, 48, 42, 55, 50, 44]),
  "hit-rate": series([82, 84, 83, 86, 84, 85]),
  network: series([6.2, 7.1, 8.4, 9.8, 9.2, 7.9]),
  cpu: series([28, 35, 41, 39, 37, 34]),
  memory: series([5.6, 5.9, 6.4, 6.3, 6.2, 6.0]),
  disk: series([4, 6, 8, 7, 5, 4]),
};

for (const option of metricOptions) {
  const peak = Math.max(...metricSeries[option.value].map((point) => point.value));
  if (peak > metricAxis[option.value].top) {
    throw new Error(`${option.label} exceeds its chart axis.`);
  }
}

export const logServices = [
  "API Gateway",
  "Control Plane",
  "Cache Daemon",
  "Workspace Manager",
  "Repository Manager",
];

export interface LogRecord {
  id: string;
  timestamp: string;
  service: string;
  severity: "Error" | "Warning" | "Information";
  requestId: string;
  repositoryId: string;
  workspaceId: string;
  message: string;
}

export const logRecords: LogRecord[] = [
  {
    id: "log-5",
    timestamp: "06 Nov 2026, 16:28:11 UTC",
    service: "Repository Manager",
    severity: "Error",
    requestId: "req_synth07",
    repositoryId: "synthetic-overlap",
    workspaceId: "ws_synth_07",
    message: "Provisioning stopped because the mirror was still warming. The partial directory was removed.",
  },
  {
    id: "log-1",
    timestamp: "06 Nov 2026, 18:20:11 UTC",
    service: "Cache Daemon",
    severity: "Warning",
    requestId: "req_8f31a0",
    repositoryId: "repo_react",
    workspaceId: "ws_react_014",
    message:
      "Cache lookup on node-a missed a blob for repo_react while workspace ws_react_014 was reading the pinned revision. The daemon asked the upstream Git repository and finished the read. This sample line is illustrative and is not a live log.",
  },
  {
    id: "log-2",
    timestamp: "06 Nov 2026, 18:22:04 UTC",
    service: "API Gateway",
    severity: "Information",
    requestId: "req_8f31a0",
    repositoryId: "repo_react",
    workspaceId: "ws_react_014",
    message: "Accepted a workspace read for repo_react on node-a.",
  },
  {
    id: "log-3",
    timestamp: "06 Nov 2026, 18:40:02 UTC",
    service: "Control Plane",
    severity: "Information",
    requestId: "req_22bc11",
    repositoryId: "repo_kubernetes",
    workspaceId: "ws_k8s_warm",
    message: "Recorded a healthy heartbeat from node-a.",
  },
  {
    id: "log-4",
    timestamp: "06 Nov 2026, 19:05:46 UTC",
    service: "Workspace Manager",
    severity: "Warning",
    requestId: "req_19aa70",
    repositoryId: "repo_linux",
    workspaceId: "ws_linux_sparse",
    message: "Workspace ws_linux_sparse is still queued. No directory has been mounted on node-a.",
  },
];

export const traceStages = [
  { name: "Agent Request", startMs: 0, durationMs: 20, status: "ok", parent: "—" },
  { name: "API Gateway", startMs: 20, durationMs: 40, status: "ok", parent: "Agent Request" },
  { name: "Control Plane", startMs: 60, durationMs: 50, status: "ok", parent: "API Gateway" },
  { name: "Cache Lookup", startMs: 110, durationMs: 90, status: "miss", parent: "Control Plane" },
  { name: "Upstream Git Server", startMs: 200, durationMs: 180, status: "ok", parent: "Cache Lookup" },
  { name: "Response", startMs: 380, durationMs: 30, status: "ok", parent: "Upstream Git Server" },
];

export const traceDurationMs = traceStages.reduce((total, stage) => total + stage.durationMs, 0);

if (traceStages[traceStages.length - 1].startMs + traceStages[traceStages.length - 1].durationMs !== traceDurationMs) {
  throw new Error("Trace stage durations must sum to the request duration.");
}

export const traceContext = {
  id: "trace_8f31a0",
  requestId: "req_8f31a0",
  repositoryId: "repo_react",
  workspaceId: "ws_react_014",
  host: observabilityHost,
};

export const monitorEvents = [
  {
    id: "ev-node",
    timestamp: "06 Nov 2026, 12:10:00 UTC",
    severity: "Information",
    source: "Control Plane",
    resource: observabilityHost,
    description: "No node failure is recorded. node-a remained the only host.",
    status: "clear",
    kind: "Node Failures",
  },
  {
    id: "ev-provision",
    timestamp: "06 Nov 2026, 16:28:11 UTC",
    severity: "Error",
    source: "Workspace Manager",
    resource: "ws_synth_07",
    description: "Provisioning stopped because the mirror was still warming.",
    status: "recorded",
    kind: "Workspace Provisioning Errors",
  },
  {
    id: "ev-miss",
    timestamp: "06 Nov 2026, 18:20:11 UTC",
    severity: "Warning",
    source: "Cache Daemon",
    resource: "repo_react",
    description: "A cache miss on node-a went to the upstream Git repository.",
    status: "observed",
    kind: "Cache Misses",
  },
  {
    id: "ev-auth",
    timestamp: "06 Nov 2026, 18:41:00 UTC",
    severity: "Information",
    source: "API Gateway",
    resource: "req_22bc11",
    description: "No authentication failure is in this sample.",
    status: "clear",
    kind: "Authentication Failures",
  },
  {
    id: "ev-sync",
    timestamp: "06 Nov 2026, 19:05:46 UTC",
    severity: "Warning",
    source: "Repository Manager",
    resource: "repo_linux",
    description: "linux synchronization is still open for the queued workspace.",
    status: "open",
    kind: "Repository Synchronization Issues",
  },
];

export const sampleAlerts = [
  {
    id: "alert-miss",
    name: "High Cache Miss Rate",
    severity: "Warning",
    resource: observabilityHost,
    state: "Sample clear",
    triggered: "Not triggered in this sample",
    explanation: "Sample threshold is a miss share above 30% of lookups. This is configuration, not a live rule.",
  },
  {
    id: "alert-storage",
    name: "Low Storage Capacity",
    severity: "Warning",
    resource: observabilityHost,
    state: "Sample warning",
    triggered: "06 Nov 2026, 20:00 UTC",
    explanation: "Sample threshold is 80% used. node-a is at 83.7% in the cache sample. This page does not page anyone.",
  },
  {
    id: "alert-latency",
    name: "High API Latency",
    severity: "Warning",
    resource: "API Gateway",
    state: "Sample clear",
    triggered: "Not triggered in this sample",
    explanation: "Sample threshold is 200 ms. The illustrative API series stays under 60 ms.",
  },
  {
    id: "alert-node",
    name: "Unhealthy Node",
    severity: "Error",
    resource: observabilityHost,
    state: "Sample clear",
    triggered: "Not triggered in this sample",
    explanation: "Would match a node that is degraded or offline. node-a is healthy in this sample.",
  },
  {
    id: "alert-jobs",
    name: "Excessive Failed Jobs",
    severity: "Error",
    resource: "ws_synth_07",
    state: "Sample clear",
    triggered: "Not triggered in this sample",
    explanation: "Sample threshold is more than two failed provisions in an hour. One failed provision is in the sample, so this alert stays clear.",
  },
];
