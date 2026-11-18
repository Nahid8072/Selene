import { formatCount, formatPercent, formatUtc } from "../lib/format.ts";
import {
  cacheEvictions,
  cacheHits,
  cacheHost,
  cacheMetrics,
  cacheMisses,
  capacityBytes,
  evictionHistory,
  freeBytes,
  storageSummary,
  usedBytes,
} from "./cache.ts";

/** Screen 09 sample. One configured host. Numbers are the Screen 08 sample. */

const windowSeconds = 24 * 60 * 60;
const lookups = cacheHits + cacheMisses;

export const nodeRecord = {
  id: cacheHost,
  hostname: cacheHost,
  region: "Local / Single Host",
  status: "healthy" as const,
  cacheSize: `${storageSummary.used} used of ${storageSummary.capacity}`,
  hitRate: formatPercent(cacheHits, lookups),
  requestsPerSec: (lookups / windowSeconds).toFixed(2),
  cpuRam: "37% / 6.2 GB",
  heartbeat: formatUtc("2026-11-06T20:00:00Z"),
};

export const nodeOverview = [
  {
    title: "Total Nodes",
    value: "1",
    context: "Configured hosts. This deployment is a single host.",
  },
  {
    title: "Healthy Nodes",
    value: "1",
    context: `${cacheHost} is healthy in this sample.`,
  },
  {
    title: "Unhealthy Nodes",
    value: "0",
    context: "No degraded or offline node is configured.",
  },
  {
    title: "Total Storage",
    value: storageSummary.capacity,
    context: `Capacity of ${cacheHost}. Used ${storageSummary.used}, free ${storageSummary.free}.`,
  },
  {
    title: "Aggregate Cache Traffic",
    value: cacheMetrics[3].value,
    context: "Bytes returned from the node cache in the same 24h window as Cache Engine.",
  },
];

export const cpuSeries = [
  { label: "00:00", cpu: 22 },
  { label: "04:00", cpu: 28 },
  { label: "08:00", cpu: 35 },
  { label: "12:00", cpu: 41 },
  { label: "16:00", cpu: 39 },
  { label: "20:00", cpu: 37 },
];

export const memorySeries = [
  { label: "00:00", memory: 5.4 },
  { label: "04:00", memory: 5.6 },
  { label: "08:00", memory: 5.9 },
  { label: "12:00", memory: 6.4 },
  { label: "16:00", memory: 6.3 },
  { label: "20:00", memory: 6.2 },
];

export const networkSeries = [
  { label: "00:00", inbound: 0.8, outbound: 6.2 },
  { label: "04:00", inbound: 0.9, outbound: 7.1 },
  { label: "08:00", inbound: 1.1, outbound: 8.4 },
  { label: "12:00", inbound: 1.3, outbound: 9.8 },
  { label: "16:00", inbound: 1.2, outbound: 9.2 },
  { label: "20:00", inbound: 1.1, outbound: 7.9 },
];

const sumNetwork = (key: "inbound" | "outbound") =>
  networkSeries.reduce((total, point) => total + point[key], 0);

export const networkInboundGb = Math.round(sumNetwork("inbound") * 10) / 10;
export const networkOutboundGb = Math.round(sumNetwork("outbound") * 10) / 10;

if (networkOutboundGb !== 48.6) {
  throw new Error("Node outbound traffic must match Cache Engine data served.");
}

if (cpuSeries[cpuSeries.length - 1].cpu !== 37 || memorySeries[memorySeries.length - 1].memory !== 6.2) {
  throw new Error("Resource charts must end at the labeled CPU and memory values.");
}

export const nodeConnections = [
  { id: "conn-014", agent: "agent-014", repository: "react", state: "established" },
  { id: "conn-ci", agent: "agent-ci-2", repository: "kubernetes", state: "established" },
  { id: "conn-editor", agent: "agent-editor", repository: "vscode", state: "established" },
];

export const nodeErrors = [
  {
    id: "err-linux-miss",
    at: formatUtc("2026-11-06T18:20:00Z"),
    severity: "warning" as const,
    message: "linux cache miss waited on the upstream Git repository. The object was delivered.",
  },
  {
    id: "err-vscode-empty",
    at: formatUtc("2026-11-06T14:05:00Z"),
    severity: "info" as const,
    message: "vscode has no cached objects yet. That mirror is still syncing.",
  },
];

export const nodeFacts = {
  host: cacheHost,
  capacity: storageSummary.capacity,
  used: storageSummary.used,
  free: storageSummary.free,
  hitRate: formatPercent(cacheHits, lookups),
  latency: "18 ms",
  evictions: formatCount(cacheEvictions),
  usedBytes,
  freeBytes,
  capacityBytes,
  evictionHistory,
};
