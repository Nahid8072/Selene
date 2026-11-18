/** Screen 13 sample. Not a live gateway and not a finalized API contract. */

export const integrationNotice =
  "API information and integration states are illustrative previews, not live connections.";

export const contractLabel = "Proposed illustration, not a finalized contract.";

export const apiOverview = [
  { title: "API Base URL", value: "https://selene.example", context: "Sample address. Not a live gateway." },
  { title: "API Version", value: "preview-2026.11", context: "Sample label. Not a released version." },
  { title: "Service Health", value: "Sample healthy", context: "Not a live health check." },
  { title: "Endpoint Documentation", value: "Illustration", context: contractLabel },
  { title: "Authentication Status", value: "Not connected", context: "No credential is stored in this preview." },
];

export interface ApiKeyRow {
  id: string;
  name: string;
  identifier: string;
  scopes: string;
  expiration: string;
  lastUsed: string;
  status: string;
}

export const apiKeys: ApiKeyRow[] = [
  {
    id: "key-reader",
    name: "agent-reader",
    identifier: "sln_••••7c2a",
    scopes: "repositories:read",
    expiration: "06 May 2027",
    lastUsed: "06 Nov 2026",
    status: "Sample active",
  },
  {
    id: "key-workspace",
    name: "workspace-preview",
    identifier: "sln_••••19b0",
    scopes: "workspaces:read",
    expiration: "01 Feb 2027",
    lastUsed: "Never in this sample",
    status: "Sample unused",
  },
];

export const keyPreview = {
  name: "agent-reader",
  scope: "repositories:read",
  expiration: "06 May 2027",
  note: "A real secret would be shown once. This preview does not generate one.",
};

export const scopeOptions = [
  { value: "repositories:read", label: "repositories:read" },
  { value: "workspaces:read", label: "workspaces:read" },
];

export interface DocEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "DELETE";
  summary: string;
  request: string;
  response: string;
  code: string;
}

function endpoint(id: string, name: string, method: DocEndpoint["method"], summary: string): DocEndpoint {
  const request =
    method === "GET"
      ? `${method} /preview/${id}\nHost: selene.example\nAuthorization: Bearer ••••••••\n\n${contractLabel}`
      : `${method} /preview/${id}\nHost: selene.example\nAuthorization: Bearer ••••••••\n\n{\n  "note": "${contractLabel}"\n}`;
  return {
    id,
    name,
    method,
    summary,
    request,
    response: `{\n  "id": "${id}",\n  "note": "${contractLabel}"\n}`,
    code: `// ${contractLabel}\n// ${method} ${name}\n`,
  };
}

export const docCategories = [
  {
    id: "repositories",
    label: "Repositories",
    operations: [
      endpoint("repo-register", "Register", "POST", "Would register a repository such as repo_react."),
      endpoint("repo-sync", "Sync", "POST", "Would ask for a synchronization of a registered repository."),
      endpoint("repo-inspect", "Inspect", "GET", "Would read one repository record."),
    ],
  },
  {
    id: "workspaces",
    label: "Workspaces",
    operations: [
      endpoint("ws-create", "Create", "POST", "Would create a workspace such as ws_react_014."),
      endpoint("ws-inspect", "Inspect", "GET", "Would read one workspace record."),
      endpoint("ws-destroy", "Destroy", "DELETE", "Would remove a workspace. This preview does not destroy anything."),
    ],
  },
  {
    id: "cache",
    label: "Cache",
    operations: [
      endpoint("cache-stats", "Statistics", "GET", "Would read cache counters for node-a."),
      endpoint("cache-warm", "Warm", "POST", "Would request a cache warm. This preview does not warm the cache."),
    ],
  },
  {
    id: "workloads",
    label: "Workloads",
    operations: [
      endpoint("wl-submit", "Submit", "POST", "Would submit a workload. This preview does not submit one."),
      endpoint("wl-inspect", "Inspect", "GET", "Would read one workload record."),
      endpoint("wl-cancel", "Cancel", "POST", "Would cancel a workload. This preview does not cancel anything."),
    ],
  },
  {
    id: "benchmarks",
    label: "Benchmarks",
    operations: [
      endpoint("bench-start", "Start", "POST", "Would start a benchmark. This preview does not start one."),
      endpoint("bench-inspect", "Inspect", "GET", "Would read one benchmark record."),
      endpoint("bench-export", "Export", "GET", "Would export a benchmark report. This preview does not create a file."),
    ],
  },
  {
    id: "observability",
    label: "Observability",
    operations: [
      endpoint("obs-metrics", "Metrics", "GET", "Would read a metrics sample for node-a."),
      endpoint("obs-logs", "Logs", "GET", "Would read a log sample."),
    ],
  },
] as const;

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: string;
  state: string;
  preview: string;
}

export const integrations: IntegrationItem[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Source hosting for repositories an agent might read.",
    category: "Source control",
    state: "Not connected",
    preview: "Sample setting: organization left blank. No token is stored.",
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Source hosting, including a self-managed project host.",
    category: "Source control",
    state: "Not connected",
    preview: "Sample setting: group left blank. No token is stored.",
  },
  {
    id: "git-server",
    name: "Self-hosted Git Servers",
    description: "A Git remote that is not GitHub or GitLab.",
    category: "Source control",
    state: "Not connected",
    preview: "Sample setting: remote URL left blank. No credential is stored.",
  },
  {
    id: "cicd",
    name: "CI/CD Systems",
    description: "A pipeline that might submit a workload.",
    category: "Automation",
    state: "Not connected",
    preview: "Sample setting: pipeline name left blank. No webhook is stored.",
  },
  {
    id: "agents",
    name: "Coding-Agent Frameworks",
    description: "An external agent runtime that might open a workspace.",
    category: "Agents",
    state: "Not connected",
    preview: "Sample setting: framework name left blank. No key is stored.",
  },
];

export const sdkTabs = [
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "cli", label: "CLI" },
  { value: "rest", label: "REST" },
  { value: "grpc", label: "gRPC / Protobuf" },
] as const;

export type SdkId = (typeof sdkTabs)[number]["value"];

export const sdkSamples: Record<SdkId, { install: string; examples: { title: string; code: string }[] }> = {
  go: {
    install: `// ${contractLabel}\n// Install preview only. No module is installed by this page.\n`,
    examples: [
      {
        title: "Example",
        code: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("https://selene.example")\n}\n`,
      },
    ],
  },
  python: {
    install: `# ${contractLabel}\n# Install preview only. No package is installed by this page.\n`,
    examples: [
      {
        title: "Example",
        code: `base = "https://selene.example"\nprint(base)\n`,
      },
    ],
  },
  cli: {
    install: `# ${contractLabel}\n# Install preview only. This CLI is not installed.\n`,
    examples: [
      {
        title: "Terminal example",
        code: `$ printf '%s\\n' "workspace inspect ws_react_014"\nproposed illustration, not a finalized contract\n`,
      },
    ],
  },
  rest: {
    install: `# ${contractLabel}\n# No request is sent by this page.\n`,
    examples: [
      {
        title: "Request preview",
        code: `GET /preview/repo-inspect HTTP/1.1\nHost: selene.example\nAuthorization: Bearer ••••••••\n`,
      },
      {
        title: "Response preview",
        code: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "id": "repo_react",\n  "note": "${contractLabel}"\n}\n`,
      },
    ],
  },
  grpc: {
    install: `// ${contractLabel}\n// Service preview only. No RPC is called by this page.\n`,
    examples: [
      {
        title: "Protobuf",
        code: `syntax = "proto3";\n\npackage selene.preview;\n\n// ${contractLabel}\nservice WorkspacePreview {\n  rpc Inspect (InspectRequest) returns (InspectReply);\n}\n\nmessage InspectRequest {\n  string id = 1;\n}\n\nmessage InspectReply {\n  string note = 1;\n}\n`,
      },
    ],
  },
};
