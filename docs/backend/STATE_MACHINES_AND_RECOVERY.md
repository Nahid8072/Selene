---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# State machines and recovery

Normative transitions for the v1 control plane. Stored enums are the Foundation Pack lists. Labels are in `DECISIONS.md`. This file does not add a workspace status and does not enable a frontend confirm control.

Coding has not started.

## Operation

Every mirror refresh, workspace provision, workspace destroy, and benchmark run has one operation row.

| Status | Meaning |
| --- | --- |
| `accepted` | Row committed. Work has not started. |
| `running` | Worker holds the operation. |
| `succeeded` | Terminal success. Side effects described by the resource are committed. |
| `failed` | Terminal failure. `error_code` is set. Earlier success on the resource is kept. |
| `needs_reconciliation` | Process died or the outcome is unknown. Startup must resolve it before new work on that resource. |

`POST` of a long action returns `202` with `operation_id`, `correlation_id`, and `status: accepted` or `running`. `GET /api/v1/operations/{operationID}` is the poll. Clients stop on `succeeded` or `failed`. `needs_reconciliation` is not success.

The same `correlation_id` is on the HTTP response, the operation, the log lines, and any operation events for that work.

A second sync for one repository does not start a second fetch. It returns `202` with the in-flight operation id and `error` is not used. The code on a conflicting create that cannot join is `409` `sync_in_progress`.

## Repository

```text
registered --> syncing --> ready
                 |          |
                 |          +--> syncing --> ready
                 |                     |
                 |                     +--> degraded
                 +--> error

degraded --> syncing --> ready
                 |
                 +--> degraded

error --> syncing --> ready
              |
              +--> error
```

| From | Event | To | Guard |
| --- | --- | --- | --- |
| `registered` | refresh accepted | `syncing` | No other refresh is `running` for this id |
| `ready` | refresh accepted | `syncing` | Same |
| `degraded` | refresh accepted | `syncing` | Same |
| `error` | refresh accepted | `syncing` | Same |
| `syncing` | fetch and ref update committed | `ready` | `cached_commit` and `last_synced_at` move together |
| `syncing` | fetch fails, a previous success exists | `degraded` | `cached_commit` and `last_synced_at` unchanged |
| `syncing` | fetch fails, no previous success | `error` | Cache entry not marked `ready` |
| any | crash mid-refresh | see recovery | Do not guess `ready` |

There is no separate “warm” transition. First population and later sync are this refresh.

## Cache entry

One row per repository.

```text
empty --> warming --> ready
             |         |
             |         +--> warming --> ready
             |                    |
             |                    +--> degraded
             +--> error

degraded --> warming --> ready
                  |
                  +--> degraded
```

| From | Event | To | Persisted fields |
| --- | --- | --- | --- |
| `empty` | refresh starts | `warming` | `last_error_code` cleared only after success |
| `ready` | refresh starts | `warming` | Previous bytes and object count remain visible |
| `degraded` | refresh starts | `warming` | Last good SHA stays on the repository |
| `warming` | success | `ready` | `object_count` and `disk_bytes` set from a real Git measurement, or left null if that measurement failed. Null is not zero. `last_successful_sync_at` set. |
| `warming` | failure after a success | `degraded` | Counts from the last success kept. `last_error_code` set. |
| `warming` | failure with no success | `error` | Do not invent object counts. |

`lease_count` is the number of lease rows with `released_at` null. It is recomputed in the same transaction as acquire and release. It is not a counter that clients increment.

No transition emits an eviction. v1 has no eviction count.

Prune and `git gc` on the mirror are rejected with `409` `lease_held` when `lease_count > 0`. They are also not exposed as an API.

## Workspace

v1 transitions:

```text
requested --> provisioning --> ready
                    |
                    +--> failed

ready --> destroying --> destroyed
```

| From | Event | To | Guard |
| --- | --- | --- | --- |
| (none) | create accepted | `requested` | Full SHA. Mirror can serve that SHA. Row committed before Git clone. |
| `requested` | clone starts | `provisioning` | Lease row inserted in that transaction. |
| `provisioning` | `HEAD` equals `commit_sha` | `ready` | `ready_at` set. Lease stays. |
| `provisioning` | clone, checkout, or HEAD check fails | `failed` | Partial directory removed. Lease released only after that cleanup is committed. `error_code` set. |
| `ready` | destroy accepted | `destroying` | Does not touch the mirror object database. |
| `destroying` | directory removed and lease released | `destroyed` | `destroyed_at` set. |
| `destroyed` | destroy again | `destroyed` | Same row. No second lease release. |
| `failed` | destroy | `destroyed` | Cleanup is idempotent if the directory is already gone. |
| `ready` | stop or restart | no transition | `404` is wrong. The route does not exist. |

`stopping` and `stopped` remain in the enum because the Foundation Pack lists them. No v1 event enters them. Restart is not “destroy then create” inside one call.

`agent_label`, when sent, is stored as text. It does not start a process. `ready` does not imply the label’s owner is running.

`HEAD` check is `git rev-parse HEAD` in that workspace compared to the requested SHA. Mismatch is `failed` with `error_code` `head_mismatch`.

## Lease

| Event | Row | `lease_count` |
| --- | --- | --- |
| Enter `provisioning` | Insert, `released_at` null | Recompute |
| Enter `ready` | Unchanged | Unchanged |
| Provision `failed` after cleanup | `released_at` set | Recompute |
| Enter `destroyed` | `released_at` set if still null | Recompute |
| Crash | See recovery | Recompute from rows, never from a remembered integer |

A workspace must not keep a lease after `failed` or `destroyed`. A `ready` workspace must hold exactly one unreleased lease.

## Crash recovery

On process start, before accepting new mutations:

1. Connect to PostgreSQL. If that fails, `readyz` is not ready. Do not mark Git work successful.
2. For each operation in `accepted` or `running`:
   - Set it to `needs_reconciliation`.
   - Do not mark the related repository `ready` and do not mark the related workspace `ready`.
3. Reconcile each `needs_reconciliation` operation:
   - **Mirror refresh.** If the mirror exists and `HEAD` of the configured default branch, or the recorded fetch ref, matches a commit already stored in `cached_commit`, the refresh did not need to change the pin. Leave the pin. Set the operation `failed` with `error_code` `interrupted` if the process died before the success transaction, unless the success transaction is already committed (operation would not still be `running`). A committed `succeeded` operation is not rewritten.
   - **Mirror refresh with no prior success and an incomplete mirror directory.** Leave the repository `error` or `registered` as the last committed status. Do not promote it. Set the operation `failed` with `error_code` `interrupted`. Do not delete the mirror directory automatically if objects are present. An operator may retry sync.
   - **Provision.** If status was `provisioning` or `requested` and `HEAD` does not match the SHA, or the directory is missing or incomplete: set workspace `failed`, `error_code` `needs_reconciliation`, remove a partial directory that is still under the workspace root, release the lease, set the operation `failed`.
   - **Provision where the directory exists, `HEAD` matches, and the lease row is unreleased, but the status transaction never committed `ready`.** This is the ambiguous case. Do not assume success. Set workspace `failed` with `error_code` `needs_reconciliation`, keep the directory for inspection, and do not release the lease until a later destroy or an explicit operator cleanup that this API does not automate. The operation becomes `failed`. Unknown directories outside the workspace root are not deleted.
   - **Destroy.** If the directory is gone and the lease is still held, release the lease and set `destroyed` only when the workspace row was already `destroying`. If the row was `ready` and the directory is gone, set `failed` with `error_code` `needs_reconciliation` rather than pretending a destroy completed.
4. Recompute every `lease_count` from unreleased lease rows.
5. Reject GC and prune while any count is above zero.
6. New mutations are allowed only after steps 2 through 5 finish. A repository whose operation is still `needs_reconciliation` accepts no second refresh until that operation is `failed` or `succeeded`.

Recovery never inserts fixture hit rates, eviction totals, or a healthy cache.

## Correlation and events

Accepted event types stay the Foundation Pack list: `repository_registered`, `cache_warm_started`, `cache_warm_completed`, `cache_warm_failed`, `workspace_requested`, `workspace_provision_started`, `workspace_provision_completed`, `workspace_provision_failed`, `workspace_destroyed`, `cache_lease_acquired`, `cache_lease_released`.

`cache_warm_*` names the mirror-refresh operation. They are not a second warm action.

Each event stores `correlation_id`, optional repository and workspace ids, `occurred_at`, optional `duration_ms`, and a small redacted attribute object. Attributes must not contain URLs with userinfo, tokens, or absolute host paths.

## Repository registration (D33–D44)

Registration is synchronous and does not fetch Git or create a mirror directory. Validation uses D44 first-failure-wins ordering. After all stages pass, one database transaction inserts: repository (`registered`), one empty cache entry (`state=empty`, `lease_count=0`), and an append-only `repository_registered` event with a separate UUIDv4 id and `{}` attributes. Commit yields `201`. Roll back all three on any failure. Only `repositories_remote_url_key` maps to `409 repository_already_registered`; other insert/transaction failures map to `500 not_persisted`. DNS results follow D35/D38 and nothing is stored on DNS failure. Registration storage path and error mapping follow D42. This operation does not create `repos/` or a Git mirror.
