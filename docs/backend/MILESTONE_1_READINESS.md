---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Milestone 1 readiness

Current rebuild readiness. The former Cloud Agent source checkout is unavailable; no previous Go source, migration, database directory, or backend tests should be assumed to exist in the current local/GitHub checkout. The frontend is user-reported as pushed to the private GitHub repository. Rebuild the backend from this contract in the milestone order below. Keep the frontend unchanged and its confirm controls disabled.

The implementation sequence below is the same sequence as `docs/backend-architecture.md`. Milestone 1 is defined there and in the Milestone 1 section of this file. This file does not start that work. Wait for explicit project-owner approval.

## Final architecture

One Go process on `node-a`, bound to `127.0.0.1`. PostgreSQL 16 on `127.0.0.1` holds metadata only. Git objects stay in bare mirrors. Workspaces are private directories that read those mirrors through alternates while a lease is held. Python tools call the HTTP API and do not open the database. There is no distributed cache, Kubernetes, LLM runtime, or custom VCS.

D22, D23, and D24 are accepted. Average checkout time is not provisioning latency and stays unavailable until it is instrumented on its own. PostgreSQL 16 is the only major version. Every frontend confirm stays disabled until that specific operation is approved.

## Schema

Authoritative columns, checks, indexes, and transactions are in `DATABASE_SCHEMA_AND_INVARIANTS.md`.

Included: `repositories`, `cache_entries`, `cache_leases`, `workspaces`, `operations`, `operation_events`, `datasets`, `benchmark_configurations`, `benchmark_runs`, `benchmark_trials`.

`cache_leases.workspace_id` is the only lease foreign key. `workspaces` has no `cache_lease_id` column. A failed workspace keeps a lease only when cleanup is pending and mirror references still exist. Operations in `needs_reconciliation` or `failed` have both error fields set. A trial row is one batch, created as `accepted` before execution. Interrupted trials become `failed` with `error_code` `interrupted` and null measurements. Worker lines stay in `workers.jsonl`.

Not included: workload tables, job tables, users, API keys, eviction history.

## Route inventory

Every path below is in `openapi.yaml`. Local `$ref` values and path parameters resolve. No other route is part of this contract.

| Methods | Path |
| --- | --- |
| GET | `/healthz` |
| GET | `/readyz` |
| GET | `/api/v1/overview` |
| GET, POST | `/api/v1/repositories` |
| GET | `/api/v1/repositories/{repositoryID}` |
| POST | `/api/v1/repositories/{repositoryID}/sync` |
| GET | `/api/v1/repositories/{repositoryID}/cache` |
| GET | `/api/v1/repositories/{repositoryID}/refs` |
| GET | `/api/v1/repositories/{repositoryID}/commits` |
| GET | `/api/v1/repositories/{repositoryID}/objects` |
| GET, POST | `/api/v1/workspaces` |
| GET, DELETE | `/api/v1/workspaces/{workspaceID}` |
| GET | `/api/v1/workspaces/{workspaceID}/tree` |
| GET | `/api/v1/operations/{operationID}` |
| GET | `/api/v1/cache` |
| GET | `/api/v1/cache/series` |
| GET | `/api/v1/node` |
| GET, POST | `/api/v1/datasets` |
| GET | `/api/v1/datasets/{datasetID}` |
| GET, POST | `/api/v1/benchmark-configurations` |
| GET | `/api/v1/benchmark-configurations/{configurationID}` |
| GET, POST | `/api/v1/benchmarks` |
| GET | `/api/v1/benchmarks/{runID}` |
| GET | `/api/v1/benchmarks/{runID}/trials` |
| GET | `/api/v1/events` |
| GET | `/api/v1/logs` |
| GET | `/api/v1/traces/{correlationID}` |
| GET | `/api/v1/config` |
| GET | `/api/v1/security` |

Screen composition is in `FRONTEND_BACKEND_MAPPING.md`. Screens 06 and 07 stay on fixtures.

## State machines

`STATE_MACHINES_AND_RECOVERY.md` is the transition list.

Interrupted first refresh with no mirror directory: repository `registered`, cache `empty`, operation `failed` / `interrupted`.

Interrupted first refresh with a partial directory and no previous success: repository `error`, cache `error`, directory kept, operation `failed` / `interrupted`.

Interrupted refresh after a successful sync: repository and cache `degraded`, pin unchanged, operation `failed` / `interrupted`.

Interrupted provision: workspace is not marked `ready`. If references are gone, the lease is released. If they remain, `cleanup_pending` stays true and the lease stays.

Failed cleanup: the workspace is `failed`, the lease stays only while the mirror reference remains, and GC stays blocked.

Interrupted destroy: `destroyed` is set only after the directory and alternates are gone and the lease is released. Otherwise the lease stays and `cleanup_pending` is true.

Interrupted benchmark: run `failed`, open trials `failed` / `interrupted` with null measurements, raw files kept, no GC.

Startup sets `needs_reconciliation` with both error fields, then finishes those operations before new mutations. None remain in `needs_reconciliation`.

## Three-arm method

Research preset `foundation-07`: Standard Git, Optimized Git, and Selene; cold and warm; concurrency 1, 5, 10, 25, 50, and 100 only when the host can finish; at least five development repetitions, target ten or more for a final report. The two-arm, three-repetition frontend profile is preset `demonstration` only.

Mirror state and host page-cache state are separate. Origin-fetched and locally reused object counts are separate. Cache hit rate is not computed from them. Checkout time is not provisioning latency.

## Deployment and security

`DEPLOYMENT_AND_SECURITY.md`. API and PostgreSQL bind `127.0.0.1` only while IAM is deferred. PostgreSQL 16 only. Git resolves the remote again under a deny policy for private, link-local, loopback, and metadata addresses. Workspace writes are confined to that workspace directory. The mirror is group-readable and not writable by the workspace account. The dev server and the production reverse proxy are same-origin and loopback-only. They forward to the Go process. They do not publish the API off the host.

## Accepted, deferred, and unavailable

| Item | State |
| --- | --- |
| D1–D9, D12, D15–D24, D25–D44 | Accepted |
| D10 stop and restart | Deferred |
| D11 eviction and destructive clear. No GC while a lease is held. | Deferred, lease rule accepted |
| D13 IAM, API keys, enterprise credentials, email, webhooks | Deferred. `GET /api/v1/security` is `not_enforced`. |
| D14 workload and job tables and their APIs | Deferred. Screens 06 and 07 stay on fixtures. |
| `GET /api/v1/metrics` | Deferred. Not in the OpenAPI file. |
| Eviction counts and node-management mutations | Deferred. Not in the route list. |
| Average checkout time | Unavailable until a separate instrument exists. |
| Cache hit rate | Unavailable for Selene. Not applicable for the Git arms. |
| Frontend confirms | Disabled under D24. |

## Remaining conflicts

Each item is a difference between this design and either the Foundation Pack or the frozen UI. None of them is an internal contradiction among the backend specs. The pack and the UI were not edited.

| Conflict | Consequence | Recommendation |
| --- | --- | --- |
| The pack requires an operation id on `202` and does not name the poll URL. | A reader of `05` alone will not find `GET /api/v1/operations/{operationID}`. | Keep the path. Recorded in `FOUNDATION_COMPATIBILITY.md`. Do not edit the pack in this milestone. |
| The pack lists `cache_lease_id` on the workspace. This schema does not store it. | Implementers who add both foreign keys will have two lease links. | Use `cache_leases.workspace_id` only. Return the lease id by lookup. |
| The pack’s workspace status list has no `needs_reconciliation`. | Recovery must not insert that word as a status. | Keep it on the operation, with error fields, and as a workspace `error_code` only. |
| The protocol’s first public datasets are React and Kubernetes. vscode is also registered. | A research plan that treats vscode as mandatory would go beyond the protocol. | Start research with React and Kubernetes. Keep vscode in the registry. Use Linux only as optional stress. |
| The frozen UI shows `ready` as running, includes `repo_synthetic`, shows an eviction count, uses a two-arm studio, and documents `/preview`. | Those screens will not match the API until a later UI change, which is not approved. | Leave the UI frozen. Map labels only in a future client. Do not seed the API from fixtures. |
| `GET /api/v1/metrics` is allowed by the pack only after a stable contract. | Observability has logs, events, and traces, not that URL. | Leave the URL undefined until a later metrics review. |
| Screens 06 and 07 expect workloads. | Those screens stay sample-driven. | Do not add workload routes in Milestone 1. |
| Checkout time has no instrument. | The overview field stays `unavailable`. | Do not copy provisioning latency into it. |

## Current rebuild sequence after source loss

The PASS reports in `docs/backend/gate-reports/` describe work that existed in the former Cloud Agent checkout. They are historical evidence only; the corresponding Go files are not present in this fresh repository unless independently verified. Rebuild and re-test in this order:

1. Milestone 1 foundation: PostgreSQL 16 schema/migration, Go process, loopback-only bind, `/healthz`, `/readyz`.
2. Security Read gate: `GET /api/v1/security` only; exact seven-field read-only response, `enforcement: not_enforced`.
3. URL/path validator layer: D25–D32 syntactic URL, ID/path, and artifact validators with injected test-only exceptions; no HTTP/Git/DNS production wiring in this isolated gate.
4. Repository registration: implement `POST /api/v1/repositories` using the complete D22–D44 contract, including bounded DNS and atomic 3-row transaction.
5. Mirror refresh: implement the only sync/population operation after registration. Actual Git outbound connections must be pinned/restricted to validated DNS addresses before fetch; a second lookup alone is insufficient.
6. Workspaces/leases/recovery; then datasets/configurations, benchmark runner, telemetry.

Do not jump directly to repository registration on a blank repository: Milestone 1, Security Read, and the reusable URL/path validators are prerequisites in this rebuild.

## Milestone 1

This is the same boundary as the Implementation roadmap in `docs/backend-architecture.md`. It does not start until the project owner approves it. This file does not grant that approval. `GET /api/v1/security` remains in `openapi.yaml`. Deferring it does not delete the route.

Milestone 1 includes, in this order:

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
2. **URL and path validators.** Rebuild D25–D32 validators and their tests. Userinfo, non-HTTPS, link-local, and metadata addresses map to their accepted error codes; a `..` id returns `path_rejected`. No registration route or Git operation is part of this gate.
3. **Repository registration.** Implement `POST /api/v1/repositories` under D22–D44, including D44 precedence, D38 bounded DNS, D42 storage path validation, and the atomic repository/cache/event transaction. Registration does not create a mirror or fetch Git.
4. **Mirror refresh.** First and later refresh use `POST /api/v1/repositories/{repositoryID}/sync`. A failed fetch does not change `cached_commit` or `last_synced_at`. Two concurrent syncs share one operation. Cache bytes stay null if `git count-objects` was not run. Actual outbound Git connections must be constrained to validated DNS addresses while preserving TLS verification/SNI/hostname, or use equivalent controlled network policy.
5. **Workspaces and leases.** Provision rejects a branch name. `HEAD` mismatch is `failed` / `head_mismatch`. Two workspaces do not see each other’s files. Destroy leaves mirror objects. `lease_count > 0` makes prune return `lease_held`. `ready` is not reported as an agent runtime.
6. **Recovery.** Kill the process during provision. After restart the operation is not `succeeded`. The workspace is not `ready` unless the success transaction had committed. A partial directory under the workspace root is handled as written in `STATE_MACHINES_AND_RECOVERY.md`. Unknown directories outside that root remain. Lease counts match unreleased rows.
7. **Datasets and configurations.** The four registry ids can be stored with null pins. `dataset_synthetic_overlap` is stored as `synthetic` with a null `repository_id`. A research configuration and the demonstration preset both exist. A frontend fixture SHA is not inserted as a resolved pin.
8. **Benchmark tool through the API.** The Python tool has no database DSN. One stored trial is one batch. A forced worker failure is a line in `workers.jsonl`, not a second trial. Summary fields that lack a source are unavailable, not zero. Cache hit rate is `not_applicable` on the Git arms and `unavailable` on Selene. A research run with fewer than the configured repetitions does not get `protocol: foundation-07` marked complete. `resource_limits` is stored, with nulls where a limit was not set.
9. **Telemetry.** `GET /api/v1/traces/{id}` returns only recorded events. `GET /api/v1/cache/series` is empty when nothing was recorded. Origin-fetched and locally reused counts are not combined into a hit rate. The cache rollup has no eviction property. Overview returns provisioning latency and average checkout time as two fields.

## Historical source note

This readiness document combines the recovered design with the current rebuild order. The older PASS reports are retained under `gate-reports/` for context only; they do not prove the former backend source is present in this checkout. Re-run each gate and its tests in this repository.

## Blockers

This document is a plan, not an instruction to execute all milestones at once. The project owner must authorize one milestone per prompt. If the chosen Linux distribution does not package PostgreSQL 16, stop; do not install another major version.
