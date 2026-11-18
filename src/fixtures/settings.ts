/** Screen 15 sample. Not saved and not applied. */

import { cachePolicy, storageSummary } from "./cache.ts";
import { apiOverview } from "./integrations.ts";
import { environmentLabel } from "./overview.ts";
import { sampleAlerts } from "./observability.ts";
import { workspaceDraft } from "./workspaces.ts";

export const settingsNotice = "Illustrative configuration preview. Changes are not saved or applied.";

export const generalSettings = {
  instance: "selene-preview",
  environment: environmentLabel,
  organization: "sample-org",
  defaults: "Single host. Local paths. No remote region.",
};

export const controlPlaneSettings = {
  api: apiOverview[0].value,
  workers: "node-a only. Registration is not applied.",
  requestLimit: "100",
  requestUnit: "requests/s",
  timeout: "30",
  timeoutUnit: "seconds",
};

export const storageSettings = {
  backend: "Local disk",
  cachePath: "/var/lib/selene/cache",
  workspacePath: "/var/lib/selene/workspaces",
  objectStorage: "None. This sample has no object-storage bucket.",
  cacheCapacity: storageSummary.capacity,
  cacheUsed: storageSummary.used,
  cacheFree: storageSummary.free,
  cacheRetention: cachePolicy.retention,
};

export const cacheSettings = {
  size: cachePolicy.maxSize,
  eviction: cachePolicy.eviction,
  retention: cachePolicy.retention,
  warming: cachePolicy.warming,
  vscode: cachePolicy.repositoryBehavior,
  used: storageSummary.used,
  free: storageSummary.free,
};

export const workspaceSettings = {
  cpu: workspaceDraft.cpu,
  cpuUnit: "vCPU",
  memory: "4",
  memoryUnit: "GB",
  disk: "20",
  diskUnit: "GB",
  network: "100",
  networkUnit: "MB/s",
  cleanup: "Sample only. The failed workspace record is not removed.",
  expiration: "No expiration is applied.",
};

export const databaseSettings = [
  { label: "Connection health", value: "Illustrative. This is not a verified connection." },
  { label: "Pool", value: "Sample size 4. Not a running pool." },
  { label: "Backup status", value: "No backup has been taken." },
  { label: "Migration status", value: "No migration has been applied." },
];

export const notificationChannels = {
  email: "alerts@example.invalid",
  webhook: "https://hooks.example.invalid/selene",
};

export const maintenanceSettings = {
  version: apiOverview[1].value,
  host: "node-a",
  health: apiOverview[2].value,
};

export const notificationAlerts = sampleAlerts.map((alert) => ({
  id: alert.id,
  name: alert.name,
  explanation: alert.explanation,
}));
