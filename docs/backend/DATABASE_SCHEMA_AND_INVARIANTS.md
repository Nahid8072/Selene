---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Database schema and invariants

Logical schema for PostgreSQL 16. No migration is written. No database is created. Names match `openapi.yaml`. Public queries must not select `cache_path`, workspace `path`, or any secret.

Coding has not started.

## Tables

### repositories

| Column | Constraint |
| --- | --- |
| `id` | Primary key. Id alphabet only. |
| `name` | Not null. |
| `remote_url` | Not null. Unique. No userinfo. |
| `provider` | `github`, `gitlab`, `self_hosted`, `other`. |
| `default_branch` | Not null. |
| `status` | `registered`, `syncing`, `ready`, `degraded`, `error`. |
| `cached_commit` | Null until a successful refresh. |
| `cache_path` | Not null. Internal. |
| `created_at`, `updated_at` | Not null. |
| `last_synced_at` | Null until success. |

### cache_entries

| Column | Constraint |
| --- | --- |
| `repository_id` | Primary key and foreign key to `repositories`. |
| `state` | `empty`, `warming`, `ready`, `degraded`, `error`. |
| `object_format` | Null until detected. |
| `object_count`, `disk_bytes` | Null until measured, each with its own source column. Null value when the source is `unavailable`. Check: null or `>= 0`. Never a stand-in zero. |
| `lease_count` | Not null, `>= 0`. Equals the number of unreleased leases for this repository. |
| `last_successful_sync_at` | Null until success. Does not move on failure. |
| `last_error_code` | Null or a stable code. |

No eviction column.

### cache_leases

| Column | Constraint |
| --- | --- |
| `id` | Primary key. |
| `repository_id` | Not null, foreign key. |
| `workspace_id` | Not null, foreign key. Unique where `released_at` is null. |
| `acquired_at` | Not null. |
| `released_at` | Null while held. |
| `cleanup_pending` | Not null boolean. True only when `released_at` is null and the workspace still references the mirror. |

### workspaces

| Column | Constraint |
| --- | --- |
| `id` | Primary key. |
| `name` | Not null. |
| `repository_id` | Not null, foreign key. |
| `base_commit` | Not null. Full SHA. |
| `branch_name` | Null if detached. |
| `path` | Not null. Internal. |
| `status` | Foundation list, including `stopping` and `stopped`, which v1 does not enter. |
| `agent_label` | Null or short text. Not a process. |
| `node_id` | Not null. v1 check: `node-a`. |
| `cache_lease_id` | Null or foreign key. |
| `created_at` | Not null. |
| `ready_at`, `destroyed_at` | Null until those transitions. |
| `error_code`, `error_message` | Null or redacted text. |

Tree counts are not columns. They are read from Git or returned unavailable.

### operations

| Column | Constraint |
| --- | --- |
| `id` | Primary key. |
| `type` | `repository_sync`, `workspace_provision`, `workspace_destroy`, `benchmark_run`. |
| `status` | `accepted`, `running`, `succeeded`, `failed`, `needs_reconciliation`. |
| `repository_id`, `workspace_id`, `benchmark_run_id` | Nullable foreign keys as the type requires. |
| `error_code`, `error_message` | Set on `failed`. |
| `correlation_id` | Not null. |
| `started_at`, `finished_at` | `finished_at` null until a terminal status. |

### operation_events

Append-only. `id` primary key. `correlation_id` not null. `repository_id` and `workspace_id` nullable. `event_type` is the Foundation Pack list. `occurred_at` not null. `duration_ms` null or `>= 0`. `attributes` is a bounded JSON object without secrets or absolute paths. No update and no delete.

### datasets

| Column | Constraint |
| --- | --- |
| `id` | Primary key. |
| `kind` | `public_repository` or `synthetic`. |
| `name` | Not null. |
| `repository_id` | Null for `dataset_synthetic_overlap`. Foreign key when set. |
| `commit_sha` | Null until resolved. Check: full hex or null. |
| `generator` | Null for public repositories. JSON inputs for synthetic. |

### benchmark_configurations

| Column | Constraint |
| --- | --- |
| `id` | Primary key. |
| `preset` | `research` or `demonstration`. |
| `protocol` | `foundation-07` or null. Research rows use `foundation-07`. |
| `arms` | Non-empty subset of `standard_git`, `optimized_git`, `selene`. Research rows contain all three. |
| `concurrencies` | Non-empty integers. Research values are drawn from 1, 5, 10, 25, 50, and 100 only when allowed. |
| `cache_states` | Non-empty subset of `cold`, `warm`. |
| `repetitions` | Integer `>= 1`. Research rows are `>= 5`. |
| `scope` | `full` or `sparse`. |
| `dataset_id` | Foreign key. |
| `commit_sha` | Null until pinned. |
| `seed` | Null or integer. Required by the application when the dataset is synthetic. |
| `optimized_git_flags` | JSON array. Empty unless arm B is present. |
| `cpu_count`, `memory_bytes`, `disk_bytes`, `network_bps` | Each null or `>= 0`. Null means unset. |

### benchmark_runs

| Column | Constraint |
| --- | --- |
| `id` | Primary key. |
| `configuration_id` | Not null, foreign key. |
| `dataset_id` | Not null, foreign key. |
| `commit_sha` | Not null. The SHA used, copied at start. |
| `name` | Not null. |
| `status` | `accepted`, `running`, `succeeded`, `failed`. |
| `preset` | Copied from the configuration. |
| `started_at`, `completed_at` | `completed_at` null until terminal. |
| `failure_count` | Null until worker files are complete. |

No speedup, winner, delta, or significance column.

### benchmark_trials

One row per batch: one `run_id`, `arm`, `cache_state`, `concurrency`, and `repetition`. Unique on those five columns.

| Column | Constraint |
| --- | --- |
| `id` | Primary key. |
| `run_id` | Foreign key. |
| `arm` | The three arm names. |
| `cache_state` | Experimental condition: `cold` or `warm`. |
| `mirror_state` | Selene mirror: `cold` or `warm`. Baseline arms: `not_applicable`. |
| `page_cache_state` | `dropped`, `not_dropped`, `unknown`. |
| `concurrency`, `repetition` | Integers `>= 1`. |
| `status` | `succeeded` or `failed`. |
| `workers_artifact` | `workers.jsonl`. Worker rows are not in this table. |
| `worker_count`, `success_count`, `failure_count` | Null if the file is incomplete. |
| `started_at`, `completed_at` | Nullable. |
| `error_code` | Null or stable code, including `interrupted`. |

Measured columns are stored as value plus state plus source, or as null value with state `unavailable` or `not_applicable`:

- `provisioning_latency_ms`
- `average_checkout_time_ms` (always unavailable in v1; not copied from provisioning latency)
- `upstream_bytes_sent`, `upstream_bytes_received`
- `cpu_percent`, `memory_bytes`, `block_read_bytes`, `block_write_bytes`
- `origin_fetched_objects`
- `locally_reused_objects`
- `cache_hit_rate` (Selene `unavailable`, baselines `not_applicable`, value null)

Each of those has a `*_source` text column. A measured value with a null source is rejected. A non-null value with state other than `measured` is rejected.

## Indexes

- `repositories (status, created_at)`
- `workspaces (repository_id, status, created_at)`
- `workspaces (node_id)`
- `cache_leases (repository_id) where released_at is null`
- `operations (status, correlation_id)`
- `operation_events (occurred_at)`, `(repository_id, occurred_at)`, `(workspace_id, occurred_at)`, `(correlation_id, occurred_at)`
- `benchmark_trials (run_id, arm, cache_state, concurrency, repetition)` unique
- `benchmark_runs (configuration_id, started_at)`

## Transaction boundaries

| Work | One transaction includes | Must not commit before |
| --- | --- | --- |
| Register repository | Repository `registered`, empty cache entry, `repository_registered` event, correlation id | URL checks |
| Start refresh | Status `syncing` / cache `warming`, operation `running`, `cache_warm_started` | The per-repository lock |
| Refresh success | `cached_commit`, `last_synced_at`, cache `ready`, measured counts or nulls, operation `succeeded`, `cache_warm_completed` | Git exit zero and the pin read back from the mirror |
| Refresh failure | Status `degraded` or `error` as in the state machine, previous pin unchanged, operation `failed`, `cache_warm_failed` | The Git failure is recorded |
| Start provision | Workspace `requested` then `provisioning`, lease insert, `lease_count` recomputed, events | SHA check against the mirror |
| Provision success | Workspace `ready`, `ready_at`, operation `succeeded`, provision-completed event | `HEAD` equals the SHA |
| Provision failure after the directory is gone | Workspace `failed`, lease `released_at` set, `cleanup_pending` false, `lease_count` recomputed | The directory and alternates file are gone |
| Provision failure while the directory remains | Workspace `failed`, lease stays, `cleanup_pending` true | Do not release the lease |
| Destroy completion | Workspace `destroyed`, lease released, `lease_count` recomputed | Directory and alternates are gone |
| Recovery | The status changes in `STATE_MACHINES_AND_RECOVERY.md` for that operation, plus `lease_count` recomputed from unreleased rows | Do not mark success |
| Benchmark trial finish | Trial row and the immutable raw file name | `workers.jsonl` for that batch is complete, or the trial is `failed` / `interrupted` with null measures |

`lease_count` is never updated in a different transaction from the lease insert or release it reflects.

## Invariants

1. Git objects are not rows.
2. `lease_count` matches unreleased leases.
3. An unreleased lease exists for every `ready` workspace, and for `failed` or `destroying` only when `cleanup_pending` is true.
4. `destroyed` has no unreleased lease.
5. Garbage collection is not represented as a successful operation while any lease for that repository is unreleased.
6. `cached_commit` and `last_synced_at` change only in a refresh-success transaction.
7. A benchmark trial is one batch. Worker outcomes are only in `workers.jsonl`.
8. `cache_hit_rate` is not a function of `origin_fetched_objects` and `locally_reused_objects`.
9. `average_checkout_time` is not written from `provisioning_latency`.
10. No fixture number from `/agent/web` is inserted as a measured value.
