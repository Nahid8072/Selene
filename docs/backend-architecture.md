---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Backend architecture and API contract design

Revised after review. The Foundation Pack in `docs/source/` is unchanged. The frozen frontend at `/agent/web` is unchanged. Git was not initialized. PostgreSQL was not installed. No Go file, migration, or server was created.

Detail lives in:

- `docs/backend/DECISIONS.md`
- `docs/backend/openapi.yaml`
- `docs/backend/STATE_MACHINES_AND_RECOVERY.md`
- `docs/backend/BENCHMARK_AND_TELEMETRY.md`
- `docs/backend/DEPLOYMENT_AND_SECURITY.md`
- `docs/backend/DATABASE_SCHEMA_AND_INVARIANTS.md`
- `docs/backend/FOUNDATION_COMPATIBILITY.md`
- `docs/backend/FRONTEND_BACKEND_MAPPING.md`
- `docs/backend/MILESTONE_1_READINESS.md`

Logical tables, constraints, indexes, and transaction boundaries are in `docs/backend/DATABASE_SCHEMA_AND_INVARIANTS.md`. This document does not repeat every column.

The React app still reads fixtures. None of those numbers are measurements, and none are loaded into PostgreSQL. Confirm controls stay disabled. Screen 13’s `/preview` examples are not this contract.

v1 stays one Go control plane, Git as the source of truth, PostgreSQL for metadata only, one host, shared immutable bare mirrors, independent writable workspaces, and cache leases. Python workload and benchmark tools call the Go API. There is no distributed cache, Kubernetes, LLM agent runtime, or custom VCS. Changing an accepted architecture decision still requires a new ADR.

## Decision table

| ID | Topic | Status |
| --- | --- | --- |
| D1 | One Go process on `node-a`. PostgreSQL metadata only. Git objects stay in Git. | Accepted |
| D2 | No distributed cache, Kubernetes, LLM agents, or custom VCS in v1. | Accepted |
| D3 | Immutable bare mirrors, private writable workspaces, alternates, leases. | Accepted |
| D4 | Python CLI tools call the Go HTTP API. They do not open the database. | Accepted |
| D5 | Fourth registered repository is `vscode`. `synthetic-overlap` is a generated dataset. | Accepted |
| D6 | Canonical stored enums, with an explicit UI label map. | Accepted |
| D7 | Workspace `ready` is not an active agent runtime. | Accepted |
| D8 | One mirror-refresh operation for first population and later sync. | Accepted |
| D9 | Workspace create requires a full commit SHA. | Accepted |
| D10 | Stop and restart workspace. | Deferred |
| D11 | Automatic eviction and destructive cache clear. No GC while any lease is held. | Deferred, lease rule Accepted |
| D12 | Node management is read-only. Only `node-a`. | Accepted |
| D13 | IAM, API keys, enterprise credentials, email, webhooks. Enforcement is `not_enforced`. | Deferred |
| D14 | Workload and job tables. | Deferred until the simulator milestone |
| D15 | Three-arm research protocol. Frontend two-arm, three-repetition profile is a demonstration preset. | Accepted |
| D16 | Many stored experimental configurations. A run points at one. | Accepted |
| D17 | `202` plus `GET /api/v1/operations/{operationID}`. | Accepted |
| D18 | API and PostgreSQL bind `127.0.0.1` only while IAM is deferred. | Accepted |
| D19 | Unknown metrics stay null. No invented eviction counts or health. No fixture seeding. | Accepted |
| D20 | `needs_reconciliation` is an operation status and a workspace `error_code`, not a new workspace status. | Accepted |
| D21 | Optional `agent_label` is a caller name, not a runtime. | Accepted |
| D22 | Average checkout time and workspace provisioning latency are separate measurements. | Accepted |
| D23 | PostgreSQL 16 only. No other major version is a substitute. | Accepted |
| D24 | All frontend confirms stay disabled. Each later activation needs its own approval. | Accepted |

## Remaining conflicts with the Foundation Pack

These are real mismatches. This revision does not edit `docs/source/` to remove them.

1. **Operation poll path.** `05_DATA_MODEL_AND_API.md` requires a `202` and an operation or workspace id. It does not name the poll URL. This design names `GET /api/v1/operations/{operationID}`. That is an elaboration, not a reversal. Rejecting the path means clients still need some documented way to use the id.
2. **Reconciliation word.** `06_CORRECTNESS_SECURITY_AND_FAILURES.md` allows an uncertain operation to be marked `failed` or `needs_reconciliation`. The workspace status list in `05` has no `needs_reconciliation` value. This design keeps that list and stores the condition as operation status `needs_reconciliation` plus workspace `failed` / `error_code` `needs_reconciliation` when the workspace row itself is unknown. A new workspace enum value would be a contract change.
3. **`agent_label`.** The workspace create example in `05` is `repository_id`, `commit_sha`, and `name`. This design adds an optional label so screen 04 can show a caller name without an agent service. Omitting it leaves the column null.
4. **vscode.** The benchmark protocol’s starting public datasets are React and Kubernetes, with Linux as optional stress. It does not name vscode. This review still registers vscode as the fourth remote. Linux stays registered and stays optional as a stress dataset.
5. **Frozen UI versus stored meaning.** Screen 04 labels some `ready` workspaces as running. This API will not. `src/fixtures/overview.ts` still contains `repo_synthetic`. The registry will not. Screen 08 shows an eviction count and an LRU policy. v1 omits eviction. Screen 10’s studio cannot represent Optimized Git or concurrency 5 until the frontend is allowed to change. Screen 13 still shows `/preview` paths. Those files were not edited.
6. **Metrics URL.** `05` allows `GET /api/v1/metrics` only after a stable metrics contract. This design does not define that contract. Prometheus text is a later scrape surface. Unknown JSON numbers stay null.
7. **UI specification leftovers.** Push, server-side query jobs, multi-node register/drain/remove, email, webhooks, and IAM remain described on the screens and remain out of v1. The charter and ADR-001 already defer them. No new ADR is written here because those deferrals stand.
8. **Checkout time has no instrument.** D22 keeps it separate from provisioning latency. The overview field exists and stays `unavailable`. The UI specification still does not name a unit or a source. That gap remains. The API will not fill it from provisioning latency.

## Revised service architecture

```text
Frozen React app (fixtures, confirms disabled)
        |
        v
Go control plane, one process, 127.0.0.1 only
  HTTP API
  repository manager     one mirror-refresh
  cache manager          in-process, not a daemon
  workspace manager      SHA pin, lease, destroy
  operation log          poll and recovery
  dataset and benchmark metadata
        |                 |                    |
        v                 v                    v
   PostgreSQL       bare mirrors         private workspaces
   metadata         repos/<id>.git       workspaces/<id>/
   127.0.0.1             |                    |
                         +---- alternates ----+
                         |
                         v
                  upstream Git (https)

Python benchmark and workload tools
  control-plane calls -> Go API only
  arm A and arm B git  -> measurement harness, results posted back to the API
```

Packages inside the one process: `api`, `repository`, `cache`, `workspace`, `event`, `store`, `benchmark`, `node`. There is no `workload` package until D14. There is no gateway, no second replica, and no Rust cache daemon. The UI words “cache daemon” and “API gateway” are names for this process, reported `unknown` until a real check runs.

The in-process lock per repository is enough only because there is one control-plane process. The node resource says so.

## Revised database entities

PostgreSQL. No migration is written. Git objects, packs, and raw benchmark bodies are not rows. Raw files stay under `benchmarks/<run-id>/`.

First schema:

| Entity | Purpose |
| --- | --- |
| `repositories` | Four registry rows when seeded by an operator: react, kubernetes, linux, vscode. `cached_commit` null until a real resolve. `cache_path` internal, never selected by public views. Status enum as in `05`. |
| `cache_entries` | One per repository. State enum as in `05`. `object_count` and `disk_bytes` nullable. `lease_count` recomputed from lease rows. No eviction column. |
| `cache_leases` | Unreleased while a workspace references the mirror, including `failed` or `destroying` when `cleanup_pending` is true. Release sets `released_at` only after those references are gone. |
| `workspaces` | Foundation columns plus nullable `agent_label` and `node_id` default `node-a`. No `cache_lease_id` column. The lease row’s `workspace_id` is the link. Status enum unchanged. `path` internal. |
| `operations` | `accepted`, `running`, `succeeded`, `failed`, `needs_reconciliation`. Types: mirror refresh, provision, destroy, benchmark run. |
| `operation_events` | Append-only. Foundation event types only. `cache_warm_*` means mirror refresh. |
| `datasets` | Public pins and `dataset_synthetic_overlap`. `commit_sha` nullable. Generator inputs on the synthetic row. |
| `benchmark_configurations` | Arms, concurrencies, cache states, repetitions, scope, dataset, seed, Optimized Git flags, preset, and `resource_limits`. |
| `benchmark_runs` | Points at one configuration and the SHA actually used. No speedup, winner, delta, or significance column. |
| `benchmark_trials` | One batch per arm, concurrency, cache condition, and repetition. Worker lines stay in `workers.jsonl`. Cache hit rate stays unavailable for Selene and not applicable for the Git arms. Origin-fetched and locally reused counts are separate and are not a hit rate. |

Not in this schema: workloads, jobs, users, invitations, roles, API keys, alert rules, notification channels, eviction history, and a desired-state settings document.

Indexes: repository id, workspace id, status, created time, and `correlation_id` on events and operations.

## Revised API routes

Normative shapes, errors, pagination, and correlation ids are in `docs/backend/openapi.yaml`. Lists use `page` (default 1) and `page_size` (default 20, maximum 100). Every response sets `X-Correlation-ID`. Error JSON is `{ "error": { "code", "message", "correlation_id" } }`. Unknown ids are `404` `not_found`.

| Method and path | Role |
| --- | --- |
| `GET /healthz` | Process up. Does not claim the database is up. |
| `GET /readyz` | Database and data-directory checks. `503` when not ready. |
| `GET /api/v1/repositories` | Page. |
| `POST /api/v1/repositories` | Register HTTPS remote. `201`. No token field. |
| `GET /api/v1/repositories/{repositoryID}` | One row, no path. |
| `POST /api/v1/repositories/{repositoryID}/sync` | The only mirror-refresh. `202`. |
| `GET /api/v1/repositories/{repositoryID}/cache` | Cache entry. Nulls stay null. |
| `GET /api/v1/repositories/{repositoryID}/refs` | Mirror refs. Empty if never fetched. |
| `GET /api/v1/repositories/{repositoryID}/commits` | Commit records, not a graph. |
| `GET /api/v1/repositories/{repositoryID}/objects` | Object statistics. Unavailable when Git was not read. |
| `GET /api/v1/overview` | Status counts, cache rollup, recent events. Provisioning latency and average checkout time are separate and independently unavailable. |
| `POST /api/v1/workspaces` | Full SHA required. `202`. |
| `GET /api/v1/workspaces` | Page. |
| `GET /api/v1/workspaces/{workspaceID}` | Detail. No host path. |
| `GET /api/v1/workspaces/{workspaceID}/tree` | HEAD, base SHA, and path counts, or unavailable. |
| `DELETE /api/v1/workspaces/{workspaceID}` | Destroy. `202`. Lease released only after mirror references are gone. |
| `GET /api/v1/operations/{operationID}` | Poll. |
| `GET /api/v1/cache` | Node rollup. No eviction field. Hit rate unavailable. |
| `GET /api/v1/cache/series` | Recorded buckets only. Empty when nothing was observed. |
| `GET /api/v1/node` | `node-a`, `read_only: true`. |
| `GET /api/v1/datasets` and `POST /api/v1/datasets` | Registry. Does not import fixture SHAs. |
| `GET /api/v1/datasets/{datasetID}` | One dataset. |
| `GET` and `POST /api/v1/benchmark-configurations` | Many configurations. |
| `GET /api/v1/benchmark-configurations/{configurationID}` | One configuration. |
| `GET /api/v1/benchmarks` | Page of runs. Presets stay labeled. |
| `POST /api/v1/benchmarks` | Start a run for one configuration. `202`. |
| `GET /api/v1/benchmarks/{runID}` | Metadata and nullable summary. |
| `GET /api/v1/benchmarks/{runID}/trials` | Failures included. |
| `GET /api/v1/events` | Foundation events. |
| `GET /api/v1/logs` | Redacted lines. Filters include repository, workspace, severity, service, correlation id, and time. |
| `GET /api/v1/traces/{correlationID}` | One id, oldest first. Absent stages omitted. |
| `GET /api/v1/config` | Effective config. No paths. `eviction: deferred`. |
| `GET /api/v1/security` | `enforcement: not_enforced`. |

Not in the contract: warm as a second route, stop, restart, pause, cancel, retry, clear, node register, API keys, user invites, alert delivery, settings writes, PDF export, and `GET /api/v1/metrics`.

Screens 06 and 07 have no resource until D14. Screens 01, 08, 09, 12, 14, and 15 are served by the reads above, with null and `unknown` where a check or a counter does not exist. They are not served by copying fixtures.

## Three-arm benchmark design

The research protocol is Foundation Pack `07`, stored as preset `research` and `protocol: foundation-07`.

| Item | Research value |
| --- | --- |
| Arms | `standard_git`, `optimized_git`, `selene` |
| Optimized Git | Documented native flags. Default filter `blob:none`. Sparse checkout only as its own scenario, same contents on every arm. |
| Cache | `cold` and `warm`, reported separately |
| Concurrency | 1, 5, 10, 25, 50. 100 only when the host record says capacity allows it. |
| Repetitions | At least 5 in development. Target 10 or more for a final report. |
| Datasets | React and Kubernetes first. Linux optional stress. `dataset_synthetic_overlap` from the generator. vscode may be used because it is registered. It is not a substitute for the protocol’s starting pair. |
| Pins | Full SHA on the run, resolved before the first trial |
| Result | Absolute values, units, trial counts, failures kept. No speedup field. |

Cold Selene splits mirror population from the workspace batch. Warm Selene does not. A warm result is not a cold result. Baseline trials are not labeled cold merely because Selene’s directory was empty.

Preset `demonstration` stores the frozen screen: arms Standard Git and Selene, 3 repetitions, concurrencies 1, 10, 25, 50, and 100. It is not a research result. The 30 frontend trials are not imported.

A trial is one batch for one arm, concurrency, cache condition, and repetition. Workers stay in `workers.jsonl`. Mirror state and host page-cache state are separate. Origin-fetched and locally reused object counts are separate. Cache hit rate is unavailable until a direct instrument exists, and it is not a ratio of those counts. Upstream bytes come from an isolated origin container or stay unavailable. Evictions are not counted. Average checkout time is not provisioning latency.

## Implementation roadmap

This is the same sequence as `docs/backend/MILESTONE_1_READINESS.md`. None of it is started by this document. D22, D23, and D24 stay accepted. The frontend stays on fixtures. The OpenAPI file still lists `GET /api/v1/security` and the other routes. Leaving them out of Milestone 1 does not remove them from that contract.

Milestone 1 waits for explicit project-owner approval. It includes only these steps, in order:

1. Install PostgreSQL 16 if the chosen Linux distribution packages PostgreSQL 16. If it does not, stop. Do not install another major version.
2. Write and apply the initial migrations for the approved tables in `docs/backend/DATABASE_SCHEMA_AND_INVARIANTS.md`. No `workloads` table. No speedup column. Public views do not select `cache_path` or workspace `path`.
3. Run one Go process. A bind address other than `127.0.0.1` fails startup.
4. Implement `GET /healthz` and `GET /readyz` only. `GET /healthz` returns 200 without using the database as its liveness check. `GET /readyz` returns 503 when PostgreSQL is down and 200 after a real ping.

Milestone 1 excludes:

- `GET /api/v1/security`
- Every other application API route in `docs/backend/openapi.yaml`
- Repository registration and synchronization
- Workspace provisioning and destruction
- Benchmark execution
- Workload and job APIs
- Metrics, IAM, API keys, eviction, and node management
- Frontend changes or confirm-button activation

Later gates, after Milestone 1, in this order:

1. **Security read.** Implement `GET /api/v1/security`. The body says `not_enforced`. This is the first application route after Milestone 1.
2. **URL and path tests.** Userinfo, non-https, link-local, and metadata addresses return `credentials_not_accepted` or `remote_address_rejected` and insert nothing. A `..` workspace id returns `path_rejected`. Logs for those requests contain no URL userinfo.
3. **Mirror refresh.** First and later refresh use `POST /api/v1/repositories/{repositoryID}/sync`. A failed fetch does not change `cached_commit` or `last_synced_at`. Two concurrent syncs share one operation. Cache bytes stay null if `git count-objects` was not run.
4. **Workspaces and leases.** Provision rejects a branch name. `HEAD` mismatch is `failed` / `head_mismatch`. Two workspaces do not see each other’s files. Destroy leaves mirror objects. `lease_count > 0` makes prune return `lease_held`. `ready` is not reported as an agent runtime.
5. **Recovery.** Kill the process during provision. After restart the operation is not `succeeded`. The workspace is not `ready` unless the success transaction had committed. A partial directory under the workspace root is handled as written in `STATE_MACHINES_AND_RECOVERY.md`. Unknown directories outside that root remain. Lease counts match unreleased rows.
6. **Datasets and configurations.** The four registry ids can be stored with null pins. `dataset_synthetic_overlap` is stored as `synthetic` with a null `repository_id`. A research configuration and the demonstration preset both exist. A frontend fixture SHA is not inserted as a resolved pin.
7. **Benchmark tool through the API.** The Python tool has no database DSN. One stored trial is one batch. A forced worker failure is a line in `workers.jsonl`, not a second trial. Summary fields that lack a source are unavailable, not zero. Cache hit rate is `not_applicable` on the Git arms and `unavailable` on Selene. A research run with fewer than the configured repetitions does not get `protocol: foundation-07` marked complete. `resource_limits` is stored, with nulls where a limit was not set.
8. **Telemetry.** `GET /api/v1/traces/{id}` returns only recorded events. `GET /api/v1/cache/series` is empty when nothing was recorded. Origin-fetched and locally reused counts are not combined into a hit rate. The cache rollup has no eviction property. Overview returns provisioning latency and average checkout time as two fields.

Coding has not started. Wait for explicit project-owner approval before Milestone 1.
