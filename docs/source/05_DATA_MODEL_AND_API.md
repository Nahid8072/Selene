# 05 — Initial Data Model and API Contract

This is a starting contract, not a frozen production schema. Keep data models small and version API responses.

## Core entities

### Repository

- `id`: stable UUID/string ID.
- `name`: display name.
- `remote_url`: sanitized Git remote URL.
- `provider`: `github`, `gitlab`, `self_hosted`, or `other`.
- `default_branch`: configured branch.
- `status`: `registered`, `syncing`, `ready`, `degraded`, `error`.
- `cached_commit`: latest successfully mirrored commit SHA.
- `cache_path`: internal path, never exposed without authorization.
- `created_at`, `updated_at`, `last_synced_at`.

### CacheEntry

One entry per repository cache in the MVP.

- `repository_id`.
- `state`: `empty`, `warming`, `ready`, `degraded`, `error`.
- `object_format`: detected Git object format.
- `object_count` and `disk_bytes` when available.
- `lease_count`.
- `last_successful_sync_at`.
- `last_error_code`.

### Workspace

- `id`.
- `repository_id`.
- `base_commit` (full immutable SHA).
- `branch_name` or detached state.
- `path` (internal; do not expose unrestricted paths).
- `status`: `requested`, `provisioning`, `ready`, `failed`, `stopping`, `stopped`, `destroying`, `destroyed`.
- `cache_lease_id`.
- `created_at`, `ready_at`, `destroyed_at`.
- `error_code`, `error_message` (redacted/safe).

### OperationEvent

Append-only event record for auditability and measurement.

- `id`.
- `correlation_id`.
- `repository_id` (nullable).
- `workspace_id` (nullable).
- `event_type`.
- `occurred_at`.
- `duration_ms` (nullable).
- `attributes_json` (bounded, redacted, schema-documented).

Suggested event types:
- `repository_registered`
- `cache_warm_started`
- `cache_warm_completed`
- `cache_warm_failed`
- `workspace_requested`
- `workspace_provision_started`
- `workspace_provision_completed`
- `workspace_provision_failed`
- `workspace_destroyed`
- `cache_lease_acquired`
- `cache_lease_released`

### BenchmarkRun and BenchmarkTrial

BenchmarkRun:
- `id`, `name`, `scenario_id`, `repository_id`, `commit_sha`.
- `baseline_mode`, `candidate_mode`.
- `concurrency`, `repetitions`, `cache_state`, `seed`.
- `environment_json`, `started_at`, `completed_at`, `status`.

BenchmarkTrial:
- `id`, `run_id`, `trial_index`, `mode`, `status`.
- `started_at`, `completed_at`, `duration_ms`.
- `workspace_count`, `success_count`, `failure_count`.
- `upstream_bytes_sent`, `upstream_bytes_received` (nullable if the measurement source is unavailable).
- `cpu_percent`, `memory_bytes`, `block_read_bytes`, `block_write_bytes` (nullable where not measured).
- `raw_result_path` or structured raw data reference.

## Initial API endpoints

Use `/api/v1` prefix.

### Health
- `GET /healthz` — process liveness.
- `GET /readyz` — database and required service readiness.

### Repositories
- `GET /api/v1/repositories`
- `POST /api/v1/repositories`
- `GET /api/v1/repositories/{repositoryID}`
- `POST /api/v1/repositories/{repositoryID}/sync`
- `GET /api/v1/repositories/{repositoryID}/cache`

### Workspaces
- `POST /api/v1/workspaces`
- `GET /api/v1/workspaces`
- `GET /api/v1/workspaces/{workspaceID}`
- `DELETE /api/v1/workspaces/{workspaceID}`

Workspace create request example:

```json
{
  "repository_id": "repo_123",
  "commit_sha": "<full-commit-sha>",
  "name": "agent-task-001"
}
```

### Benchmark
- `POST /api/v1/benchmarks` — create/run a benchmark job when the benchmark milestone is implemented.
- `GET /api/v1/benchmarks/{runID}`
- `GET /api/v1/benchmarks/{runID}/trials`

### Operations / metrics
- `GET /api/v1/events?repository_id=...&workspace_id=...`
- `GET /api/v1/metrics` — only if a stable metrics contract is defined; otherwise expose Prometheus metrics separately.

## API conventions

- Return `202 Accepted` for long-running sync/provision operations and include an operation/workspace ID.
- Return stable machine-readable error codes.
- Validate full commit SHA before provisioning.
- Use request IDs/correlation IDs in responses and logs.
- Never return credential values.
- Never expose host filesystem paths by default.
- Paginate lists; cap page size.
- Add API schema documentation (OpenAPI) once endpoints stabilize.
