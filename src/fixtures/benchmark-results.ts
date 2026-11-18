import { benchmarkDraft, benchmarkNode, repositoryRevision } from "./benchmarks.ts";

/** Screen 11 synthetic preview. Not a measurement and not a claim about either system. */

export const syntheticLabel = "Illustrative preview data — synthetic, not measured.";

export type TrialSystem = "Git" | "Selene";

export interface PreviewTrial {
  id: string;
  system: TrialSystem;
  concurrency: 1 | 10 | 25 | 50 | 100;
  cache: "Warm Cache";
  checkoutMs: number | null;
  networkMb: number | null;
  throughput: number | null;
  cpu: number | null;
  memoryGb: number | null;
  status: "completed" | "failed";
}

function done(
  id: string,
  system: TrialSystem,
  concurrency: PreviewTrial["concurrency"],
  checkoutMs: number,
  networkMb: number,
  throughput: number,
  cpu: number,
  memoryGb: number,
): PreviewTrial {
  return {
    id,
    system,
    concurrency,
    cache: "Warm Cache",
    checkoutMs,
    networkMb,
    throughput,
    cpu,
    memoryGb,
    status: "completed",
  };
}

function failed(id: string, system: TrialSystem, concurrency: PreviewTrial["concurrency"]): PreviewTrial {
  return {
    id,
    system,
    concurrency,
    cache: "Warm Cache",
    checkoutMs: null,
    networkMb: null,
    throughput: null,
    cpu: null,
    memoryGb: null,
    status: "failed",
  };
}

const centers: Record<
  PreviewTrial["concurrency"],
  { git: [number, number, number, number, number]; selene: [number, number, number, number, number] }
> = {
  1: { git: [800, 30, 1.6, 20, 1.5], selene: [960, 55, 1.0, 36, 2.4] },
  10: { git: [1100, 72, 0.9, 46, 3.6], selene: [900, 44, 1.4, 30, 2.3] },
  25: { git: [1000, 48, 1.3, 32, 2.8], selene: [1200, 78, 0.7, 52, 4.5] },
  50: { git: [1700, 90, 0.5, 64, 6.2], selene: [1480, 58, 0.9, 42, 4.4] },
  100: { git: [1550, 62, 0.85, 36, 3.8], selene: [2050, 96, 0.35, 70, 6.5] },
};

const offsets = [-1, 0, 1] as const;

export const concurrencyLevels = [1, 10, 25, 50, 100] as const;

export const previewTrials: PreviewTrial[] = concurrencyLevels.flatMap((level) =>
  (["Git", "Selene"] as const).flatMap((system) =>
    offsets.map((offset, index) => {
      const id = `${system === "Git" ? "g" : "s"}-${level}-${index + 1}`;
      const failedTrial = (system === "Git" && level === 100 && index === 2) || (system === "Selene" && level === 50 && index === 2);
      if (failedTrial) {
        return failed(id, system, level);
      }
      const center = centers[level][system === "Git" ? "git" : "selene"];
      return done(
        id,
        system,
        level,
        center[0] + offset * 40,
        center[1] + offset * 4,
        Math.round((center[2] + offset * 0.1) * 10) / 10,
        center[3] + offset * 2,
        Math.round((center[4] + offset * 0.2) * 10) / 10,
      );
    }),
  ),
);

if (previewTrials.length !== 30) {
  throw new Error("A planned benchmark preview has 30 trial rows.");
}

for (const level of concurrencyLevels) {
  for (const system of ["Git", "Selene"] as const) {
    const count = previewTrials.filter((trial) => trial.system === system && trial.concurrency === level).length;
    if (count !== 3) {
      throw new Error(`${system} at concurrency ${level} must have 3 rows.`);
    }
  }
}

const failedGit = previewTrials.filter((trial) => trial.system === "Git" && trial.status === "failed").length;
const failedSelene = previewTrials.filter((trial) => trial.system === "Selene" && trial.status === "failed").length;
if (failedGit !== 1 || failedSelene !== 1 || failedGit + failedSelene + previewTrials.filter((trial) => trial.status === "completed").length !== 30) {
  throw new Error("Completed and failed trial rows must add up to 30, with one failure per system.");
}

function completed(system: TrialSystem, concurrency?: number): PreviewTrial[] {
  return previewTrials.filter(
    (trial) => trial.status === "completed" && trial.system === system && (concurrency === undefined || trial.concurrency === concurrency),
  );
}

function numbers(trials: PreviewTrial[], key: "checkoutMs" | "networkMb" | "throughput" | "cpu" | "memoryGb"): number[] {
  return trials.map((trial) => trial[key]).filter((value): value is number => value !== null);
}

function sorted(values: number[]): number[] {
  return [...values].sort((left, right) => left - right);
}

export function median(values: number[]): number {
  const ordered = sorted(values);
  const mid = Math.floor(ordered.length / 2);
  if (ordered.length % 2 === 1) {
    return ordered[mid];
  }
  return (ordered[mid - 1] + ordered[mid]) / 2;
}

export function percentile95(values: number[]): number {
  const ordered = sorted(values);
  const index = Math.ceil(0.95 * ordered.length) - 1;
  return ordered[Math.max(0, index)];
}

export function mean(values: number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export interface SystemStats {
  system: TrialSystem;
  count: number;
  failed: number;
  checkoutMedian: number;
  checkoutP95: number;
  checkoutMin: number;
  checkoutMax: number;
  checkoutMean: number;
  networkMedian: number;
  throughputMedian: number;
  cpuMedian: number;
  memoryMedian: number;
}

function statsFor(system: TrialSystem): SystemStats {
  const rows = completed(system);
  const checkout = numbers(rows, "checkoutMs");
  return {
    system,
    count: rows.length,
    failed: previewTrials.filter((trial) => trial.system === system && trial.status === "failed").length,
    checkoutMedian: median(checkout),
    checkoutP95: percentile95(checkout),
    checkoutMin: Math.min(...checkout),
    checkoutMax: Math.max(...checkout),
    checkoutMean: mean(checkout),
    networkMedian: median(numbers(rows, "networkMb")),
    throughputMedian: median(numbers(rows, "throughput")),
    cpuMedian: median(numbers(rows, "cpu")),
    memoryMedian: median(numbers(rows, "memoryGb")),
  };
}

export const gitStats = statsFor("Git");
export const seleneStats = statsFor("Selene");

export interface ConcurrencyPoint {
  concurrency: number;
  gitCheckout: number;
  seleneCheckout: number;
  gitNetwork: number;
  seleneNetwork: number;
  gitThroughput: number;
  seleneThroughput: number;
  gitCpu: number;
  seleneCpu: number;
  gitMemory: number;
  seleneMemory: number;
}

function crosses(flags: boolean[]): boolean {
  return flags.some(Boolean) && flags.some((flag) => !flag);
}

export const concurrencyPoints: ConcurrencyPoint[] = concurrencyLevels.map((level) => ({
  concurrency: level,
  gitCheckout: median(numbers(completed("Git", level), "checkoutMs")),
  seleneCheckout: median(numbers(completed("Selene", level), "checkoutMs")),
  gitNetwork: median(numbers(completed("Git", level), "networkMb")),
  seleneNetwork: median(numbers(completed("Selene", level), "networkMb")),
  gitThroughput: median(numbers(completed("Git", level), "throughput")),
  seleneThroughput: median(numbers(completed("Selene", level), "throughput")),
  gitCpu: median(numbers(completed("Git", level), "cpu")),
  seleneCpu: median(numbers(completed("Selene", level), "cpu")),
  gitMemory: median(numbers(completed("Git", level), "memoryGb")),
  seleneMemory: median(numbers(completed("Selene", level), "memoryGb")),
}));

if (
  !crosses(concurrencyPoints.map((point) => point.seleneCheckout < point.gitCheckout)) ||
  !crosses(concurrencyPoints.map((point) => point.seleneNetwork < point.gitNetwork)) ||
  !crosses(concurrencyPoints.map((point) => point.seleneThroughput > point.gitThroughput)) ||
  !crosses(concurrencyPoints.map((point) => point.seleneCpu < point.gitCpu))
) {
  throw new Error("Synthetic series must cross. Neither system may lead every concurrency level.");
}

export function checkoutBuckets(system: TrialSystem): { label: string; count: number }[] {
  const values = numbers(completed(system), "checkoutMs");
  const buckets = [
    { label: "Under 1000 ms", count: 0 },
    { label: "1000–1499 ms", count: 0 },
    { label: "1500 ms and over", count: 0 },
  ];
  for (const value of values) {
    if (value < 1000) {
      buckets[0].count += 1;
    } else if (value < 1500) {
      buckets[1].count += 1;
    } else {
      buckets[2].count += 1;
    }
  }
  return buckets;
}

export const resultSummary = {
  name: "checkout-warm-preview",
  repository: "react",
  revision: repositoryRevision(benchmarkDraft.repositoryId),
  baseline: "Conventional Git",
  candidate: "Selene",
  date: "06 Nov 2026",
  duration: `${benchmarkDraft.durationMinutes} min`,
  workers: benchmarkDraft.agents,
  environment: `${benchmarkNode.id}, ${benchmarkNode.region}`,
  versions: "Preview fixture. No software version was recorded.",
  cache: "Warm Cache",
  repetitions: String(benchmarkDraft.repetitions),
  resources: `${benchmarkDraft.cpu} vCPU, ${benchmarkDraft.memoryGb} GB memory, ${benchmarkDraft.diskGb} GB disk, ${benchmarkDraft.networkMbps} MB/s, ${benchmarkNode.id}`,
  profile: `${benchmarkDraft.overlap}% overlap, ${benchmarkDraft.access} access, branches ${benchmarkDraft.main}/${benchmarkDraft.development}/${benchmarkDraft.feature}, ${benchmarkDraft.workspaceCreation} concurrent workspaces, fetch every ${benchmarkDraft.fetchEverySec}s, query every ${benchmarkDraft.queryEverySec}s, failure injection off`,
};

export const resultViewOptions = [
  { value: "all", label: "All illustrative trials" },
  { value: "completed", label: "Completed rows only" },
];
