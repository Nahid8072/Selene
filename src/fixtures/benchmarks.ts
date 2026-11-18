import { repositoryRecords } from "./repositories.ts";
import { cacheHost } from "./cache.ts";

/** Screen 10 sample. Configuration only. No run and no measured result. */

export const benchmarkDraft = {
  repositoryId: "repo_react",
  agents: "25",
  cache: "warm",
  operation: "checkout",
  repetitions: 3,
  durationMode: "duration" as "duration" | "workload",
  durationMinutes: 10,
  workloadOps: 1000,
  overlap: 70,
  access: "frequent",
  main: 60,
  development: 25,
  feature: 15,
  workspaceCreation: 4,
  fetchEverySec: 30,
  queryEverySec: 120,
  failureInjection: false,
  cpu: 4,
  memoryGb: 8,
  diskGb: 16,
  networkMbps: 50,
};

export const agentOptions = ["1", "10", "25", "50", "100"].map((value) => ({ value, label: value }));

export const cacheStateOptions = [
  { value: "cold", label: "Cold Cache" },
  { value: "warm", label: "Warm Cache" },
];

export const operationOptions = [
  { value: "clone", label: "Clone" },
  { value: "fetch", label: "Fetch" },
  { value: "checkout", label: "Checkout" },
  { value: "workspace", label: "Workspace Provisioning" },
];

export const durationOptions = [
  { value: "duration", label: "Fixed duration" },
  { value: "workload", label: "Fixed workload" },
];

export const accessOptions = [
  { value: "rare", label: "Rare" },
  { value: "moderate", label: "Moderate" },
  { value: "frequent", label: "Frequent" },
];

export const benchmarkRepositories = repositoryRecords.map((record) => ({
  value: record.id,
  label: record.name,
}));

export type PreflightState = "Ready" | "Warning" | "Blocked" | "Not checked";

export const preflightChecks: { id: string; label: string; state: PreflightState; note: string }[] = [
  {
    id: "repository",
    label: "Repository availability",
    state: "Ready",
    note: "react is ready in the repository sample.",
  },
  {
    id: "runner",
    label: "Benchmark runner health",
    state: "Ready",
    note: "The runner is listed as ready. This preview did not query it.",
  },
  {
    id: "memory",
    label: "Available memory",
    state: "Warning",
    note: "node-a shows 6.2 GB in use of 16 GB. An 8 GB limit leaves limited headroom.",
  },
  {
    id: "disk",
    label: "Disk capacity",
    state: "Warning",
    note: "node-a has 19.6 GB free. A 16 GB allocation leaves little spare cache space.",
  },
  {
    id: "permissions",
    label: "Required permissions",
    state: "Not checked",
    note: "Permission to run a benchmark was not checked.",
  },
  {
    id: "comparable",
    label: "Comparable test conditions",
    state: "Blocked",
    note: "Not confirmed. Baseline and candidate must use the same repository revision, the same hardware, the same resource limits, and the same cache conditions.",
  },
];

export const executionPreview = {
  progress: "0%",
  workers: "0",
  queued: "0",
  successful: "0",
  failed: "0",
};

export const benchmarkNode = {
  id: cacheHost,
  region: "Local / Single Host",
};

export function repositoryRevision(id: string): string {
  const record = repositoryRecords.find((item) => item.id === id);
  if (!record) {
    return "Unknown repository";
  }
  return record.pinnedCommit ?? "No pinned commit in the repository sample";
}
