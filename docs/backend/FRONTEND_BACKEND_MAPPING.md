---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Frontend to backend mapping

The app at `/agent/web` is frozen. This file says how a later client would read the API. It does not change screens, labels, or confirm buttons. D24 stays accepted: every operational confirm stays disabled until that operation is approved on its own.

Unknown measurements are null or `unavailable`. They are not zeros and they are not fixture numbers.

## Status labels

The API returns stored enums. A future client applies this map. The frozen UI does not.

| Stored workspace status | Display | Never display as |
| --- | --- | --- |
| `requested`, `provisioning` | Queued | Running |
| `ready` | Ready | Running, or an active agent |
| `failed` | Failed | |
| `stopping`, `destroying` | Stopping | Restart |
| `stopped` | Stopped | |
| `destroyed` | Destroyed | |

`ready` is a provisioned workspace whose `HEAD` matches the pinned SHA. It is not an agent runtime.

| Stored repository status | Display |
| --- | --- |
| `registered` | Connected |
| `syncing` | Syncing |
| `ready` | Connected |
| `degraded` | Degraded, not Error |
| `error` | Error |

| Stored cache state | Display |
| --- | --- |
| `empty` | Uncached |
| `warming` | Partially cached |
| `ready` | Cached |
| `degraded` | Cached, with repository status Degraded |
| `error` | Uncached only when `disk_bytes` was measured as 0. If `disk_bytes` is null, the label is unavailable. |

## Registry and samples the API will not copy

`repo_synthetic` / `synthetic-overlap` in `src/fixtures/overview.ts` is not a registered repository. The registry is `repo_react`, `repo_kubernetes`, `repo_linux`, and `repo_vscode`. `dataset_synthetic_overlap` is a generated dataset with a null `repository_id`.

Eviction count is not a field. The sample value 42 is not returned.

The demonstration preset is Standard Git and Selene, 3 repetitions, concurrencies 1, 10, 25, 50, and 100. The research protocol is three arms, at least 5 repetitions, and concurrencies 1, 5, 10, 25, 50, with 100 only when the host can finish. A demonstration run is not a research result.

Paths under `/preview` on screen 13 are not routes. The contract is `docs/backend/openapi.yaml`.

## Screen data

Only paths that exist in `openapi.yaml` are listed. Where one screen needs several reads, the composition is named here. No extra endpoint is implied.

| Screen | Data | Source |
| --- | --- | --- |
| 01 Overview | Counts, cache rollup, recent events, provisioning latency, average checkout time | `GET /api/v1/overview`. Checkout time is `unavailable` until its own instrument exists. It is not copied from provisioning latency. |
| 02 Repositories | List | `GET /api/v1/repositories`. Cache bytes and state for a row come from `GET /api/v1/repositories/{repositoryID}/cache`. |
| 03 Repository details | One repository, refs, commits, objects, cache, activity | `GET` repository, `/refs`, `/commits`, `/objects`, `/cache`, and `GET /api/v1/events?repository_id=`. |
| 04 Agent workspaces | List | `GET /api/v1/workspaces`. `ready` is shown as Ready. |
| 05 Workspace details | One workspace, tree, logs | `GET /api/v1/workspaces/{workspaceID}`, `GET .../tree`, and `GET /api/v1/logs?workspace_id=`. |
| 06 Workloads | None from the API | Deferred with D14. The screen stays on its fixture. |
| 07 Workload details | None from the API | Deferred with D14. The screen stays on its fixture. |
| 08 Cache engine | Rollup and series | `GET /api/v1/cache` and `GET /api/v1/cache/series`. Hit rate is `unavailable`. There is no eviction series. |
| 09 Cache nodes | The one host | `GET /api/v1/node`. Register, drain, restart, and remove are not routes. |
| 10 Benchmark studio | Stored configurations | `GET /api/v1/benchmark-configurations`. Start, stop, save, and schedule stay disabled under D24. |
| 11 Benchmark results | Runs and batch trials | `GET /api/v1/benchmarks` and `GET /api/v1/benchmarks/{runID}/trials`. Workers are in `workers.jsonl`, not extra trial rows. |
| 12 Observability | Events, logs, one trace | `GET /api/v1/events`, `GET /api/v1/logs`, `GET /api/v1/traces/{correlationID}`. `GET /api/v1/metrics` is not defined. |
| 13 API and integrations | This contract | The OpenAPI file. Key create and revoke are not routes. `/preview` is not a path. |
| 14 Security | Enforcement flag | `GET /api/v1/security` returns `not_enforced`. Users, roles, and API keys are not routes. |
| 15 Settings | Effective process configuration | `GET /api/v1/config`. Writes are not routes. |

Shell search, notifications, and pagination stay in the browser until a later approval. They are not given new endpoints here.

## Explicitly deferred

Workload and job APIs, `GET /api/v1/metrics`, IAM, API keys, eviction, node-management mutations, and checkout-time measurement. Confirm buttons stay disabled.
