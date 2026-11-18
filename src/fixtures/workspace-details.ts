import { formatUtc } from "../lib/format.ts";
import { workspaceRecords, type WorkspaceStatus } from "./workspaces.ts";

/** Screen 05 sample. Figures are illustrative. Nothing here is measured or provisioned. */

export type WorkspaceTreeState = "clean" | "modified" | "uncommitted" | "sync-issue";

export type LogSeverity = "info" | "warning" | "error";

export interface ResourcePoint {
  label: string;
  value: number;
}

export interface WorkspaceResource {
  id: "cpu" | "memory" | "disk" | "network";
  label: string;
  current: string;
  allocation: string;
  unit: string;
  progress: number;
  history: ResourcePoint[];
}

export interface WorkspaceChange {
  path: string;
  change: string;
  disposition: string;
}

export interface WorkspaceTimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  note: string;
}

export interface WorkspaceLogLine {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  source: string;
  message: string;
}

export interface WorkspaceDetail {
  id: string;
  agent: string;
  repository: string;
  branch: string;
  baseCommit: string;
  status: WorkspaceStatus;
  createdAt: string;
  node: string;
  mount: string;
  tree: WorkspaceTreeState;
  baseChanges: string;
  head: string;
  uncommitted: string;
  syncState: string;
  resources: WorkspaceResource[];
  changes: WorkspaceChange[];
  timeline: WorkspaceTimelineEvent[];
  failure: string | null;
  cleanup: string | null;
  logs: WorkspaceLogLine[];
}

const reached = "Recorded in this sample.";

function at(iso: string): string {
  return formatUtc(iso);
}

function cpu(current: string, progress: number, history: ResourcePoint[]): WorkspaceResource {
  return {
    id: "cpu",
    label: "CPU",
    current,
    allocation: "2 vCPU",
    unit: "vCPU",
    progress,
    history,
  };
}

function memory(current: string, progress: number, history: ResourcePoint[]): WorkspaceResource {
  return {
    id: "memory",
    label: "Memory",
    current,
    allocation: "4 GB",
    unit: "GB",
    progress,
    history,
  };
}

function disk(current: string, progress: number, history: ResourcePoint[]): WorkspaceResource {
  return {
    id: "disk",
    label: "Disk",
    current,
    allocation: "20 GB",
    unit: "GB",
    progress,
    history,
  };
}

function network(current: string, progress: number, history: ResourcePoint[]): WorkspaceResource {
  return {
    id: "network",
    label: "Network",
    current,
    allocation: "100 MB/s",
    unit: "MB/s",
    progress,
    history,
  };
}

const idleResources: WorkspaceResource[] = [
  cpu("0 vCPU", 0, []),
  memory("0 GB", 0, []),
  disk("0 GB", 0, []),
  network("0 MB/s", 0, []),
];

function stages(
  times: Partial<Record<"requested" | "lookup" | "objects" | "initialized" | "started" | "stopped", string>>,
  notes: Partial<Record<"requested" | "lookup" | "objects" | "initialized" | "started" | "stopped", string>> = {},
): WorkspaceTimelineEvent[] {
  const rows: Array<[keyof typeof times, string]> = [
    ["requested", "Workspace requested"],
    ["lookup", "Cache lookup"],
    ["objects", "Objects retrieved"],
    ["initialized", "Workspace initialized"],
    ["started", "Agent started"],
    ["stopped", "Workspace stopped"],
  ];
  return rows.flatMap(([key, label]) => {
    const iso = times[key];
    if (!iso) {
      return [];
    }
    return [{ id: key, label, timestamp: at(iso), note: notes[key] ?? reached }];
  });
}

interface DetailExtra {
  mount: string;
  tree: WorkspaceTreeState;
  baseChanges: string;
  head: string;
  uncommitted: string;
  syncState: string;
  resources: WorkspaceResource[];
  changes: WorkspaceChange[];
  timeline: WorkspaceTimelineEvent[];
  failure: string | null;
  cleanup: string | null;
  logs: WorkspaceLogLine[];
}

const detailById: Record<string, DetailExtra> = {
  ws_react_014: {
    mount: "/var/lib/selene/workspaces/ws_react_014",
    tree: "modified",
    baseChanges: "3",
    head: "a91c4d0f4e6a8b1c2d3e4f5061728394a0b1e7b2",
    uncommitted: "0",
    syncState: "HEAD is a local commit ahead of the pinned base. The working tree has no uncommitted changes.",
    resources: [
      cpu("1.4 vCPU", 70, [
        { label: "18:20", value: 0.4 },
        { label: "18:35", value: 0.9 },
        { label: "18:50", value: 1.2 },
        { label: "19:05", value: 1.4 },
      ]),
      memory("2.6 GB", 65, [
        { label: "18:20", value: 1.1 },
        { label: "18:35", value: 1.8 },
        { label: "18:50", value: 2.2 },
        { label: "19:05", value: 2.6 },
      ]),
      disk("3.1 GB", 16, [
        { label: "18:20", value: 2.4 },
        { label: "18:35", value: 2.7 },
        { label: "18:50", value: 2.9 },
        { label: "19:05", value: 3.1 },
      ]),
      network("18 MB/s", 18, [
        { label: "18:20", value: 40 },
        { label: "18:35", value: 12 },
        { label: "18:50", value: 9 },
        { label: "19:05", value: 18 },
      ]),
    ],
    changes: [
      { path: "packages/react-reconciler/src/ReactFiber.js", change: "modified", disposition: "Base commit" },
      { path: "packages/react/index.js", change: "modified", disposition: "Base commit" },
      { path: "fixtures/agent-note.txt", change: "added", disposition: "Base commit" },
    ],
    timeline: stages(
      {
        requested: "2026-11-06T18:20:02Z",
        lookup: "2026-11-06T18:20:06Z",
        objects: "2026-11-06T18:20:13Z",
        initialized: "2026-11-06T18:20:20Z",
        started: "2026-11-06T18:20:24Z",
      },
    ),
    failure: null,
    cleanup: null,
    logs: [
      {
        id: "react-provision",
        timestamp: at("2026-11-06T18:20:03Z"),
        severity: "info",
        source: "Provisioning",
        message: "Allocated node-a and created the workspace directory.",
      },
      {
        id: "react-retry",
        timestamp: at("2026-11-06T18:20:08Z"),
        severity: "warning",
        source: "Retry",
        message: "Cache lookup retried once after a slow object open. The second attempt finished.",
      },
      {
        id: "react-repo",
        timestamp: at("2026-11-06T18:20:21Z"),
        severity: "info",
        source: "Repository",
        message: "Checked out the pinned base, then recorded local commit a91c4d0f4e6a.",
      },
      {
        id: "react-error",
        timestamp: at("2026-11-06T18:51:02Z"),
        severity: "error",
        source: "Repository",
        message: "A status probe timed out. The workspace was left running. No retry is in progress.",
      },
    ],
  },
  ws_k8s_warm: {
    mount: "/var/lib/selene/workspaces/ws_k8s_warm",
    tree: "uncommitted",
    baseChanges: "0",
    head: "9c31d0aa11bb22cc33dd44ee55ff66778899aabb",
    uncommitted: "2",
    syncState: "HEAD matches the pinned base. Two paths are uncommitted in this working tree.",
    resources: [
      cpu("0.6 vCPU", 30, [
        { label: "18:40", value: 0.8 },
        { label: "18:55", value: 0.5 },
        { label: "19:10", value: 0.6 },
      ]),
      memory("1.4 GB", 35, [
        { label: "18:40", value: 1.2 },
        { label: "18:55", value: 1.3 },
        { label: "19:10", value: 1.4 },
      ]),
      disk("6.4 GB", 32, [
        { label: "18:40", value: 6.2 },
        { label: "18:55", value: 6.3 },
        { label: "19:10", value: 6.4 },
      ]),
      network("4 MB/s", 4, [
        { label: "18:40", value: 22 },
        { label: "18:55", value: 3 },
        { label: "19:10", value: 4 },
      ]),
    ],
    changes: [
      { path: "staging/src/k8s.io/kubectl/pkg/cmd/apply/apply.go", change: "modified", disposition: "Working tree" },
      { path: "cluster/README.md", change: "untracked", disposition: "Working tree" },
    ],
    timeline: stages(
      {
        requested: "2026-11-06T18:40:12Z",
        lookup: "2026-11-06T18:40:14Z",
        objects: "2026-11-06T18:40:16Z",
        initialized: "2026-11-06T18:40:19Z",
        started: "2026-11-06T18:40:22Z",
      },
      { lookup: "Warm cache. Objects were already local." },
    ),
    failure: null,
    cleanup: null,
    logs: [
      {
        id: "k8s-provision",
        timestamp: at("2026-11-06T18:40:13Z"),
        severity: "info",
        source: "Provisioning",
        message: "Attached the workspace to node-a.",
      },
      {
        id: "k8s-repo",
        timestamp: at("2026-11-06T18:40:20Z"),
        severity: "info",
        source: "Repository",
        message: "HEAD matches the base commit. Two paths are uncommitted.",
      },
    ],
  },
  ws_linux_sparse: {
    mount: "Not mounted",
    tree: "sync-issue",
    baseChanges: "0",
    head: "—",
    uncommitted: "0",
    syncState: "Sync has not started. The cache lookup is still open.",
    resources: idleResources,
    changes: [],
    timeline: stages(
      { requested: "2026-11-06T19:05:44Z", lookup: "2026-11-06T19:05:46Z" },
      { lookup: "In progress. No completion time in this sample." },
    ),
    failure: null,
    cleanup: null,
    logs: [],
  },
  ws_synth_07: {
    mount: "Removed after cleanup",
    tree: "sync-issue",
    baseChanges: "0",
    head: "—",
    uncommitted: "0",
    syncState: "Sync failed while the mirror was still warming.",
    resources: [
      cpu("0 vCPU", 0, [
        { label: "16:27", value: 0.2 },
        { label: "16:28", value: 0 },
      ]),
      memory("0 GB", 0, [
        { label: "16:27", value: 0.3 },
        { label: "16:28", value: 0 },
      ]),
      disk("0 GB", 0, [
        { label: "16:27", value: 0.1 },
        { label: "16:28", value: 0 },
      ]),
      network("0 MB/s", 0, [
        { label: "16:27", value: 8 },
        { label: "16:28", value: 0 },
      ]),
    ],
    changes: [],
    timeline: [
      ...stages(
        { requested: "2026-11-06T16:27:44Z", lookup: "2026-11-06T16:27:50Z" },
        { lookup: "Lookup failed. The mirror was still warming." },
      ),
      {
        id: "retry",
        label: "Retry",
        timestamp: at("2026-11-06T16:27:58Z"),
        note: "Retried the cache lookup. The mirror was still warming.",
      },
      {
        id: "failure",
        label: "Provisioning failed",
        timestamp: at("2026-11-06T16:28:11Z"),
        note: "Provisioning stopped because the mirror was still warming.",
      },
      {
        id: "cleanup",
        label: "Cleanup",
        timestamp: at("2026-11-06T16:28:13Z"),
        note: "The partial directory was removed.",
      },
    ],
    failure: "Provisioning stopped because the mirror was still warming. The partial directory was removed.",
    cleanup: "The partial directory was removed.",
    logs: [
      {
        id: "synth-provision",
        timestamp: at("2026-11-06T16:27:45Z"),
        severity: "info",
        source: "Provisioning",
        message: "Requested a workspace on node-a for synthetic-overlap.",
      },
      {
        id: "synth-retry",
        timestamp: at("2026-11-06T16:27:58Z"),
        severity: "warning",
        source: "Retry",
        message: "Retried the cache lookup. The mirror was still warming.",
      },
      {
        id: "synth-error",
        timestamp: at("2026-11-06T16:28:11Z"),
        severity: "error",
        source: "Provisioning",
        message: "Provisioning stopped because the mirror was still warming.",
      },
      {
        id: "synth-cleanup",
        timestamp: at("2026-11-06T16:28:13Z"),
        severity: "info",
        source: "Provisioning",
        message: "Removed the partial directory.",
      },
    ],
  },
  ws_react_review: {
    mount: "/var/lib/selene/workspaces/ws_react_review",
    tree: "modified",
    baseChanges: "1",
    head: "b7c8d9e0f1a24365869708a9bacbdc0d1e2f3041",
    uncommitted: "0",
    syncState: "Stopped with one local commit ahead of the base. The working tree was clean.",
    resources: [
      cpu("0 vCPU", 0, [
        { label: "12:10", value: 1.1 },
        { label: "14:10", value: 0.7 },
        { label: "16:16", value: 0 },
      ]),
      memory("0 GB", 0, [
        { label: "12:10", value: 2.1 },
        { label: "14:10", value: 1.9 },
        { label: "16:16", value: 0 },
      ]),
      disk("1.8 GB", 9, [
        { label: "12:10", value: 1.2 },
        { label: "14:10", value: 1.6 },
        { label: "16:16", value: 1.8 },
      ]),
      network("0 MB/s", 0, [
        { label: "12:10", value: 15 },
        { label: "14:10", value: 2 },
        { label: "16:16", value: 0 },
      ]),
    ],
    changes: [{ path: "packages/react-dom/src/client/ReactDOM.js", change: "modified", disposition: "Base commit" }],
    timeline: stages({
      requested: "2026-11-06T12:10:00Z",
      lookup: "2026-11-06T12:10:04Z",
      objects: "2026-11-06T12:10:11Z",
      initialized: "2026-11-06T12:10:18Z",
      started: "2026-11-06T12:10:22Z",
      stopped: "2026-11-06T16:16:00Z",
    }),
    failure: null,
    cleanup: null,
    logs: [
      {
        id: "review-provision",
        timestamp: at("2026-11-06T12:10:01Z"),
        severity: "info",
        source: "Provisioning",
        message: "Workspace started on node-b.",
      },
      {
        id: "review-repo",
        timestamp: at("2026-11-06T12:40:00Z"),
        severity: "info",
        source: "Repository",
        message: "Recorded one committed edit against the base.",
      },
      {
        id: "review-stop",
        timestamp: at("2026-11-06T16:16:00Z"),
        severity: "info",
        source: "Provisioning",
        message: "Workspace stopped. The tree was left in place.",
      },
    ],
  },
  ws_vscode_01: {
    mount: "/var/lib/selene/workspaces/ws_vscode_01",
    tree: "clean",
    baseChanges: "0",
    head: "c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00",
    uncommitted: "0",
    syncState: "HEAD matches the base commit. The working tree is clean.",
    resources: [
      cpu("0 vCPU", 0, [
        { label: "09:00", value: 0.9 },
        { label: "12:00", value: 0.4 },
        { label: "15:00", value: 0 },
      ]),
      memory("0 GB", 0, [
        { label: "09:00", value: 1.6 },
        { label: "12:00", value: 1.5 },
        { label: "15:00", value: 0 },
      ]),
      disk("4.0 GB", 20, [
        { label: "09:00", value: 4 },
        { label: "12:00", value: 4 },
        { label: "15:00", value: 4 },
      ]),
      network("0 MB/s", 0, [
        { label: "09:00", value: 11 },
        { label: "12:00", value: 1 },
        { label: "15:00", value: 0 },
      ]),
    ],
    changes: [],
    timeline: stages(
      {
        requested: "2026-11-05T09:00:00Z",
        lookup: "2026-11-05T09:00:05Z",
        objects: "2026-11-05T09:00:14Z",
        initialized: "2026-11-05T09:00:21Z",
        started: "2026-11-05T09:00:26Z",
        stopped: "2026-11-05T15:00:00Z",
      },
      { stopped: "Stopped after the sample run finished." },
    ),
    failure: null,
    cleanup: null,
    logs: [
      {
        id: "vscode-provision",
        timestamp: at("2026-11-05T09:00:01Z"),
        severity: "info",
        source: "Provisioning",
        message: "Workspace started on node-b.",
      },
      {
        id: "vscode-repo",
        timestamp: at("2026-11-05T09:00:27Z"),
        severity: "info",
        source: "Repository",
        message: "Checkout matches the base commit. No uncommitted changes.",
      },
    ],
  },
};

export const sampleWorkspaceId = "ws_react_014";

export const workspaceDetails: WorkspaceDetail[] = workspaceRecords.map((record) => {
  const extra = detailById[record.id];
  if (!extra) {
    throw new Error(`Missing workspace detail for ${record.id}`);
  }
  const versusBase = extra.changes.filter((change) => change.disposition === "Base commit").length;
  const workingTree = extra.changes.filter((change) => change.disposition === "Working tree").length;
  if (extra.baseChanges !== String(versusBase) || extra.uncommitted !== String(workingTree)) {
    throw new Error(`Change counts disagree for ${record.id}`);
  }
  return {
    id: record.id,
    agent: record.agent,
    repository: record.repository,
    branch: record.branch,
    baseCommit: record.baseCommit,
    status: record.status,
    createdAt: formatUtc(record.createdAt),
    node: record.node,
    ...extra,
  };
});

export function workspaceDetail(id: string): WorkspaceDetail | null {
  return workspaceDetails.find((item) => item.id === id) ?? null;
}
