/** Screen 14 sample. Not enforced access control. */

import { apiKeys } from "./integrations.ts";

export const securityNotice =
  "Users, permissions, and security configurations are illustrative previews, not enforced controls.";

export const secretNote = "A real secret would be shown once and is not shown here.";

export const users = [
  {
    id: "user-operator",
    name: "operator.sample",
    email: "operator.sample@example.invalid",
    role: "Super Admin",
    status: "Sample active",
    lastLogin: "06 Nov 2026, 18:02 UTC",
  },
  {
    id: "user-infra",
    name: "infra.sample",
    email: "infra.sample@example.invalid",
    role: "Infrastructure Administrator",
    status: "Sample active",
    lastLogin: "06 Nov 2026, 17:40 UTC",
  },
  {
    id: "user-dev",
    name: "dev.sample",
    email: "dev.sample@example.invalid",
    role: "Developer",
    status: "Sample active",
    lastLogin: "06 Nov 2026, 16:11 UTC",
  },
  {
    id: "user-observer",
    name: "observer.sample",
    email: "observer.sample@example.invalid",
    role: "Read-only Observer",
    status: "Sample active",
    lastLogin: "05 Nov 2026, 09:18 UTC",
  },
] as const;

export const invitations = [
  {
    id: "invite-guest",
    name: "guest.sample",
    email: "guest.sample@example.invalid",
    role: "Developer",
    status: "Sample invited",
    lastLogin: "Not signed in",
  },
] as const;

export const roles = ["Super Admin", "Infrastructure Administrator", "Developer", "Read-only Observer"] as const;

export type AccessLevel = "Allowed" | "Restricted" | "Read Only" | "Not Assigned";

export const permissionAreas = [
  "Repository Management",
  "Workspace Management",
  "Cache Administration",
  "Workload Management",
  "Benchmark Access",
  "Observability",
  "Security Administration",
] as const;

export const permissionMatrix: Record<(typeof permissionAreas)[number], Record<(typeof roles)[number], AccessLevel>> = {
  "Repository Management": {
    "Super Admin": "Allowed",
    "Infrastructure Administrator": "Restricted",
    Developer: "Read Only",
    "Read-only Observer": "Read Only",
  },
  "Workspace Management": {
    "Super Admin": "Allowed",
    "Infrastructure Administrator": "Allowed",
    Developer: "Allowed",
    "Read-only Observer": "Read Only",
  },
  "Cache Administration": {
    "Super Admin": "Allowed",
    "Infrastructure Administrator": "Allowed",
    Developer: "Restricted",
    "Read-only Observer": "Not Assigned",
  },
  "Workload Management": {
    "Super Admin": "Allowed",
    "Infrastructure Administrator": "Allowed",
    Developer: "Allowed",
    "Read-only Observer": "Read Only",
  },
  "Benchmark Access": {
    "Super Admin": "Allowed",
    "Infrastructure Administrator": "Read Only",
    Developer: "Allowed",
    "Read-only Observer": "Read Only",
  },
  Observability: {
    "Super Admin": "Allowed",
    "Infrastructure Administrator": "Allowed",
    Developer: "Read Only",
    "Read-only Observer": "Read Only",
  },
  "Security Administration": {
    "Super Admin": "Allowed",
    "Infrastructure Administrator": "Restricted",
    Developer: "Not Assigned",
    "Read-only Observer": "Not Assigned",
  },
};

export const repositoryPermissions = [
  {
    id: "perm-repo",
    category: "Repository-level access",
    repository: "repo_react",
    principal: "dev.sample",
    access: "Read Only",
    scope: "Inspect the pinned revision",
    state: "Illustrative",
  },
  {
    id: "perm-ws",
    category: "Workspace permissions",
    repository: "repo_react",
    principal: "ws_react_014",
    access: "Isolated",
    scope: "Private writable tree",
    state: "Sample isolated",
  },
  {
    id: "perm-cache",
    category: "Cache access boundaries",
    repository: "repo_kubernetes",
    principal: "node-a",
    access: "Read Only",
    scope: "Cached objects on the single host",
    state: "Sample boundary",
  },
  {
    id: "perm-service",
    category: "Service-to-service authorization",
    repository: "repo_linux",
    principal: "Cache Daemon",
    access: "Not Assigned",
    scope: "No service identity is stored",
    state: "Sample not assigned",
  },
  {
    id: "perm-vscode",
    category: "Repository-level access",
    repository: "repo_vscode",
    principal: "observer.sample",
    access: "Read Only",
    scope: "No objects counted yet",
    state: "Illustrative",
  },
] as const;

export const isolationNote =
  "Sharing immutable Git objects does not grant repository access or a shared writable workspace. Each workspace stays isolated.";

export const securityTokens = apiKeys.map((key, index) => ({
  id: key.identifier,
  owner: index === 0 ? "dev.sample" : "operator.sample",
  scopes: key.scopes,
  expiration: key.expiration,
  lastUsed: key.lastUsed,
  status: key.status,
}));

export const credentialReferences = [
  {
    id: "cred-github",
    name: "github-sample",
    provider: "GitHub",
    target: "repo_react",
    status: "Not connected",
  },
  {
    id: "cred-cache",
    name: "cache-daemon-sample",
    provider: "Cache Daemon",
    target: "node-a",
    status: "Reference only",
  },
] as const;

export const authConfiguration = [
  { label: "Method", value: "Sample bearer token. No token is stored." },
  { label: "Token policy", value: "Illustrative expiry labels. Not enforced." },
  { label: "Credential configuration", value: "Names and providers only. No secret material." },
  { label: "Rotation policy", value: "Sample 90-day note. Rotation does not run." },
] as const;

export const tokenRotation = [
  { label: "Schedule", value: "Sample every 90 days" },
  { label: "Last rotation", value: "Not rotated in this sample" },
  { label: "Next rotation", value: "Not scheduled" },
] as const;

export const auditRecords = [
  {
    id: "audit-user",
    timestamp: "06 Nov 2026, 18:02 UTC",
    actor: "operator.sample",
    category: "User Activity",
    target: "security preview",
    action: "Opened the sample user list",
    outcome: "Recorded",
    source: "Control Plane",
  },
  {
    id: "audit-config",
    timestamp: "06 Nov 2026, 17:40 UTC",
    actor: "infra.sample",
    category: "Configuration Changes",
    target: "node-a",
    action: "Reviewed a sample cache threshold",
    outcome: "Not applied",
    source: "Control Plane",
  },
  {
    id: "audit-repo",
    timestamp: "06 Nov 2026, 16:11 UTC",
    actor: "dev.sample",
    category: "Repository Access Events",
    target: "repo_react",
    action: "Read the pinned revision",
    outcome: "Sample allow",
    source: "API Gateway",
  },
  {
    id: "audit-key",
    timestamp: "06 Nov 2026, 15:04 UTC",
    actor: "operator.sample",
    category: "API Key Creation and Revocation",
    target: "sln_••••7c2a",
    action: "Recorded a masked key label",
    outcome: "No key created",
    source: "API Gateway",
  },
  {
    id: "audit-admin",
    timestamp: "05 Nov 2026, 09:18 UTC",
    actor: "observer.sample",
    category: "Administrative Actions",
    target: "Read-only Observer",
    action: "Viewed the sample role list",
    outcome: "Recorded",
    source: "Control Plane",
  },
] as const;

export const auditFilters = ["Category", "User", "Resource", "Time range", "Outcome"] as const;

export const securitySettings = [
  {
    id: "encryption",
    title: "Encryption",
    rows: [
      { label: "At rest", value: "Sample reference only. No key material." },
      { label: "In transit", value: "Sample TLS note. Not a live certificate." },
      { label: "Key management reference", value: "kms-sample. The reference is a name, not a key." },
    ],
  },
  {
    id: "network",
    title: "Network access rules",
    rows: [
      { label: "Ranges", value: "Sample 10.0.0.0/8. Not installed on a host." },
      { label: "Policy", value: "Illustrative allow list. Not enforced." },
      { label: "Service restrictions", value: "node-a is the only host in this preview." },
    ],
  },
  {
    id: "session",
    title: "Session policies",
    rows: [
      { label: "Duration", value: "Sample 8 hours." },
      { label: "Idle timeout", value: "Sample 30 minutes." },
      { label: "Renewal", value: "Not enforced. Sessions are not issued here." },
    ],
  },
  {
    id: "secrets",
    title: "Secret management",
    rows: [
      { label: "References", value: "github-sample and cache-daemon-sample." },
      { label: "Rotation policy", value: "Sample 90 days. Rotation does not run." },
      { label: "Access restrictions", value: "Super Admin sample only. Not enforced." },
      { label: "Storage status", value: "No secret is stored." },
    ],
  },
] as const;
