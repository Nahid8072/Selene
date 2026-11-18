/** View-side shapes aligned with the control-plane concepts.
 *  They are fixture types, not an API client and not a new contract.
 */

export type RepositoryProvider = "github" | "gitlab" | "self_hosted" | "other";

export type RepositoryStatus =
  | "registered"
  | "syncing"
  | "ready"
  | "degraded"
  | "error";

export type CacheState = "empty" | "warming" | "ready" | "degraded" | "error";

export type WorkspaceStatus =
  | "requested"
  | "provisioning"
  | "ready"
  | "failed"
  | "stopping"
  | "stopped"
  | "destroying"
  | "destroyed";

export interface Repository {
  id: string;
  name: string;
  remote_url: string;
  provider: RepositoryProvider;
  default_branch: string;
  status: RepositoryStatus;
  cached_commit: string | null;
  created_at: string;
  updated_at: string;
  last_synced_at: string | null;
}

export interface CacheEntry {
  repository_id: string;
  state: CacheState;
  object_format: string;
  object_count: number | null;
  disk_bytes: number | null;
  lease_count: number;
  last_successful_sync_at: string | null;
  last_error_code: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  repository_id: string;
  base_commit: string;
  branch_name: string | null;
  status: WorkspaceStatus;
  cache_lease_id: string | null;
  created_at: string;
  ready_at: string | null;
  destroyed_at: string | null;
  error_code: string | null;
  error_message: string | null;
}

export type OperationEventType =
  | "repository_registered"
  | "cache_warm_started"
  | "cache_warm_completed"
  | "cache_warm_failed"
  | "workspace_requested"
  | "workspace_provision_started"
  | "workspace_provision_completed"
  | "workspace_provision_failed"
  | "workspace_destroyed"
  | "cache_lease_acquired"
  | "cache_lease_released";

export interface OperationEvent {
  id: string;
  correlation_id: string;
  repository_id: string | null;
  workspace_id: string | null;
  event_type: OperationEventType;
  occurred_at: string;
  duration_ms: number | null;
  attributes_json: Record<string, string | number | boolean | null>;
}

export interface BenchmarkRun {
  id: string;
  name: string;
  scenario_id: string;
  repository_id: string;
  commit_sha: string;
  baseline_mode: string;
  candidate_mode: string;
  concurrency: number;
  repetitions: number;
  cache_state: "cold" | "warm";
  seed: number;
  started_at: string;
  completed_at: string | null;
  status: string;
}

export interface OperationPoint {
  label: string;
  syncs: number;
  provisions: number;
}

export type OperationRange = "24h" | "7d" | "30d";
