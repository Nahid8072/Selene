import { formatBytes, formatCount, formatPercent, formatUtc } from "../lib/format.ts";
import { repositoryRecords } from "./repositories.ts";

/** Screen 08 sample for one host. Figures are illustrative and add up inside this file. */

export const cacheHost = "node-a";
export const cacheWindow = "24h sample ending 06 Nov 2026, 20:00 UTC";
export const capacityBytes = 120_000_000_000;
export const warningRatio = 0.8;

export interface CacheSeriesPoint {
  label: string;
  hits: number;
  misses: number;
  writes: number;
  retrievals: number;
  evictions: number;
}

export const cacheSeries: CacheSeriesPoint[] = [
  { label: "00:00", hits: 900, misses: 180, writes: 40, retrievals: 1080, evictions: 4 },
  { label: "04:00", hits: 1100, misses: 220, writes: 45, retrievals: 1320, evictions: 6 },
  { label: "08:00", hits: 1400, misses: 260, writes: 50, retrievals: 1660, evictions: 8 },
  { label: "12:00", hits: 1800, misses: 340, writes: 60, retrievals: 2140, evictions: 10 },
  { label: "16:00", hits: 1700, misses: 310, writes: 55, retrievals: 2010, evictions: 8 },
  { label: "20:00", hits: 1520, misses: 270, writes: 60, retrievals: 1790, evictions: 6 },
];

const sumSeries = (key: keyof Omit<CacheSeriesPoint, "label">) =>
  cacheSeries.reduce((total, point) => total + point[key], 0);

export const cacheHits = sumSeries("hits");
export const cacheMisses = sumSeries("misses");
export const cacheWrites = sumSeries("writes");
export const cacheRetrievals = sumSeries("retrievals");
export const cacheEvictions = sumSeries("evictions");

if (cacheRetrievals !== cacheHits + cacheMisses) {
  throw new Error("Cache retrievals must equal hits plus misses.");
}

export interface RepositoryCacheRow {
  repository: string;
  objects: number;
  bytes: number;
  hits: number;
  misses: number;
  evictions: number;
}

export const repositoryCacheRows: RepositoryCacheRow[] = [
  { repository: "react", objects: 48211, bytes: 1_800_000_000, hits: 2100, misses: 180, evictions: 6 },
  { repository: "kubernetes", objects: 310442, bytes: 12_400_000_000, hits: 3200, misses: 420, evictions: 10 },
  { repository: "linux", objects: 8_901_130, bytes: 86_200_000_000, hits: 2800, misses: 900, evictions: 24 },
  { repository: "vscode", objects: 0, bytes: 0, hits: 320, misses: 80, evictions: 2 },
];

for (const row of repositoryCacheRows) {
  const record = repositoryRecords.find((item) => item.name === row.repository);
  const recordedObjects = record?.objectCount ?? 0;
  if (!record || recordedObjects !== row.objects) {
    throw new Error(`Cache objects for ${row.repository} do not match the repository fixture.`);
  }
}

const sumRows = (key: keyof Omit<RepositoryCacheRow, "repository">) =>
  repositoryCacheRows.reduce((total, row) => total + row[key], 0);

if (sumRows("hits") !== cacheHits || sumRows("misses") !== cacheMisses || sumRows("evictions") !== cacheEvictions) {
  throw new Error("Per-repository cache counters do not match the 24h totals.");
}

export const usedBytes = sumRows("bytes");
export const freeBytes = capacityBytes - usedBytes;
export const cachedObjects = sumRows("objects");

if (freeBytes < 0) {
  throw new Error("Cache used bytes exceed capacity.");
}

export const cacheMetrics = [
  {
    title: "Hit rate",
    value: formatPercent(cacheHits, cacheHits + cacheMisses),
    context: `${formatCount(cacheHits)} hits divided by ${formatCount(cacheHits + cacheMisses)} lookups in this window.`,
  },
  {
    title: "Misses",
    value: formatCount(cacheMisses),
    context: "Lookups that went to the upstream Git repository.",
  },
  {
    title: "Objects served",
    value: formatCount(cacheHits),
    context: "Objects returned from the node cache. One object per hit in this sample.",
  },
  {
    title: "Total data served",
    value: "48.6 GB",
    context: "Bytes returned from the node cache in this window. This is transfer, not stored capacity.",
  },
  {
    title: "Average retrieval latency",
    value: "18 ms",
    context: "Mean time to serve a cache hit on node-a. Misses are not included.",
  },
  {
    title: "Eviction count",
    value: formatCount(cacheEvictions),
    context: "Objects removed by the sample least-recently-used policy in this window.",
  },
];

export const evictionHistory = [
  { id: "ev-linux", at: formatUtc("2026-11-06T18:10:00Z"), repository: "linux", objects: 24 },
  { id: "ev-k8s", at: formatUtc("2026-11-06T12:40:00Z"), repository: "kubernetes", objects: 10 },
  { id: "ev-react", at: formatUtc("2026-11-06T09:15:00Z"), repository: "react", objects: 6 },
  { id: "ev-vscode", at: formatUtc("2026-11-06T04:05:00Z"), repository: "vscode", objects: 2 },
];

if (evictionHistory.reduce((total, row) => total + row.objects, 0) !== cacheEvictions) {
  throw new Error("Eviction history does not match the eviction count.");
}

export const cacheEvents = [
  {
    id: "hit-react",
    actor: "Cache hit",
    description: "react served a blob from the node-a cache.",
    timestamp: formatUtc("2026-11-06T19:40:00Z"),
  },
  {
    id: "miss-linux",
    actor: "Cache miss",
    description: "linux was fetched from the upstream Git repository.",
    timestamp: formatUtc("2026-11-06T18:20:00Z"),
  },
  {
    id: "evict-linux",
    actor: "Eviction",
    description: "24 linux objects were dropped under the sample retention rule.",
    timestamp: formatUtc("2026-11-06T18:10:00Z"),
  },
  {
    id: "warm-k8s",
    actor: "Warm",
    description: "kubernetes was already local, so the warm pass did not transfer new objects.",
    timestamp: formatUtc("2026-11-06T14:18:00Z"),
  },
];

export const selectedRepository = "react";

export const selectedEntries = [
  { id: "e7b2a91c4d0f", kind: "commit", bytes: "4.2 MB" },
  { id: "a91c4d0f4e6a", kind: "tree", bytes: "1.1 MB" },
  { id: "b7c8d9e0f1a2", kind: "blob", bytes: "6.7 MB" },
];

export const cachePolicy = {
  maxSize: formatBytes(capacityBytes),
  eviction: "Least recently used",
  retention: "30 days",
  warming: "react and kubernetes on a schedule. linux is manual.",
  repositoryBehavior: "vscode warming is off while that mirror is still syncing.",
};

export const storageSummary = {
  capacity: formatBytes(capacityBytes),
  used: formatBytes(usedBytes),
  free: formatBytes(freeBytes),
  objects: formatCount(cachedObjects),
  usedRatio: Math.round((usedBytes / capacityBytes) * 1000) / 10,
};
