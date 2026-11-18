---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Milestone 1 implementation audit

Corrections are limited to the previous FAIL findings. The Security Read gate and later gates were not started. No route was added beyond `GET /healthz` and `GET /readyz`. `GET /api/v1/security` was not implemented. The frontend was not changed. Confirm controls were not enabled. Git was not initialized. D22, D23, and D24 remain Accepted.

Verdict: **PASS**.

This check is of `/agent/selene` and database `selene` after those corrections. PostgreSQL is 16.15, listening on `127.0.0.1`.

## 1. Health regression test

`/agent/selene/cmd/selene/healthz_test.go` calls `GET /healthz` through `httptest`. `healthz` still writes `map[string]string`, which is the response path that panicked on a `map[string]any` type assertion. The test also calls `writeJSON` with that map directly.

`go test -count=1 -v ./cmd/selene -run TestGetHealthz` result:

```text
=== RUN   TestGetHealthz
--- PASS: TestGetHealthz (0.00s)
```

The test requires HTTP 200, JSON `status` `up`, and `X-Correlation-ID` equal to `healthz-regression` on both the handler response and the direct `writeJSON` call. Health behavior was not changed. A live `GET /healthz` at 23:19 Asia/Dhaka returned HTTP 200 and `{"status":"up",...}` with `X-Correlation-Id` set. That process listens only on `127.0.0.1:8080` (`/proc/net/tcp` state `0A`).

## 2. Failed-workspace lease rule

`/agent/selene/migrations/001_initial.sql` adds deferred constraint triggers on both tables. They run at commit:

- `cache_leases_failed_workspace_cleanup` calls `selene.reject_failed_lease_row()`
- `workspaces_failed_workspace_cleanup` calls `selene.reject_failed_workspace_row()`

Both are `tgdeferrable` and `tginitdeferred`. An unreleased lease whose workspace status is `failed` is rejected unless `cleanup_pending` is true. A change to either table is visible to the check before commit, so setting the workspace to `failed` and `cleanup_pending` to true in one transaction is allowed, and doing only one of those is not. `cache_leases.workspace_id` remains the only foreign key from `cache_leases` to `workspaces`. Introspection shows no foreign key from `workspaces` to `cache_leases`.

The triggers do not read the filesystem. Cleanup of a workspace directory or alternates file is still the application's job.

`TestFailedWorkspaceLeaseCleanup` against database `selene`:

```text
--- PASS: TestFailedWorkspaceLeaseCleanup (0.02s)
    --- PASS: TestFailedWorkspaceLeaseCleanup/valid_failed_unreleased_cleanup_pending (0.00s)
    --- PASS: TestFailedWorkspaceLeaseCleanup/invalid_failed_unreleased_cleanup_pending_false (0.00s)
    --- PASS: TestFailedWorkspaceLeaseCleanup/released_after_cleanup (0.00s)
    --- PASS: TestFailedWorkspaceLeaseCleanup/workspace_update_cannot_bypass (0.00s)
    --- PASS: TestFailedWorkspaceLeaseCleanup/lease_update_cannot_bypass (0.00s)
    --- PASS: TestFailedWorkspaceLeaseCleanup/same_transaction_may_set_both_before_commit (0.00s)
```

The invalid cases fail the commit with SQLSTATE `23514` and the message `unreleased lease on a failed workspace requires cleanup_pending`. The release case commits a `failed` workspace whose lease has `released_at` set and `cleanup_pending` false.

## 3. Event attributes

`DATABASE_SCHEMA_AND_INVARIANTS.md` says `operation_events.attributes` is a JSON object without secrets or absolute paths, and that no numeric bound and no enforcement layer are specified. `openapi.yaml` `OperationEvent.attributes` is `type: object` with `additionalProperties: true`. It has no `maxLength`, `maxProperties`, or other size limit.

No number was invented and no size check was added. Live column: `jsonb NOT NULL DEFAULT '{}'::jsonb`. No constraint definition mentions `attributes`.

Recommendation for the project owner: before a later gate, choose one numeric ceiling and one layer. The layer is either a database check on the stored JSON or an application check before insert. After that choice, add the check and a test. Until then the column stays an unbounded JSON object.

## 4. Documentation

`DATABASE_SCHEMA_AND_INVARIANTS.md` no longer says that no migration exists or that coding has not started. It names `/agent/selene/migrations/001_initial.sql` and database `selene`, and it says Milestone 1 is this schema plus `GET /healthz` and `GET /readyz`. Application routes, workers, Git operations, and later gates are still described as not started. The transaction-boundary table remains the contract for that later work. Invariant 3 now says the failed-workspace `cleanup_pending` pair is a deferred constraint, and that SQL does not check filesystem references. A ready workspace's lease and a destroyed workspace's lease are still application rules, not triggers.

## Commands

Working directory `/agent/selene`.

| Command | Result |
| --- | --- |
| `gofmt -l .` | No files printed. |
| `go test -count=1 ./...` | `selene/cmd/selene` ok. `selene/internal/dbver` ok. `selene/internal/listen` ok. Exit 0. |
| `go vet ./...` | No findings. Exit 0. |
| `go build -o /tmp/selene-audit ./cmd/selene` | Exit 0. |

`SELENE_HTTP_ADDR=0.0.0.0:8081 /tmp/selene-audit` exited 1 with `listen address "0.0.0.0:8081": host must be 127.0.0.1`. `TestMajor` accepts `160015` and rejects `150001` and `170000`.

## Schema evidence

```text
server_version: 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
listen_addresses: 127.0.0.1
```

Tables in schema `selene`: `benchmark_configurations`, `benchmark_runs`, `benchmark_trials`, `cache_entries`, `cache_leases`, `datasets`, `operation_events`, `operations`, `repositories`, `workspaces`. Ten tables. No `workloads` table. No column named `speedup` or `cache_lease_id`.

`repositories_public` has no `cache_path`. `workspaces_public` has no `path`.

## Routes

`main.go` registers only `GET /healthz` and `GET /readyz`. Live results from the `127.0.0.1:8080` process:

| Request | Result |
| --- | --- |
| `GET /healthz` | 200, `status` `up` |
| `GET /readyz` | 200, `status` `ready`, database check `up` after a real ping |
| `GET /api/v1/security` | 404 `page not found` |
| `GET /api/v1/repositories` | 404 `page not found` |

`/healthz` does not open a database connection. `/readyz` returns 503 `not_ready` when the URL is empty or the ping fails. `refuseOtherMajor` returns nil when the connection or version query fails, so a down database does not stop startup.

## Scope

`DECISIONS.md` lines 37–39 still mark D22, D23, and D24 Accepted. No `.git` directory was created. `/agent/web` was not written. Confirm controls were not enabled.

## Remaining deviations

`operation_events.attributes` has no numeric bound because the specification does not give one. That is recorded above for the project owner. It is not a failed check.

SQL does not verify that a workspace directory or alternates file still references the mirror. The schema document says the application does that. The database rule that was missing, failed plus unreleased plus `cleanup_pending` false, is now enforced.

A ready workspace is not required by a trigger to hold a lease, and a destroyed workspace is not required by a trigger to have no open lease. Those remain later transaction rules, as written in the schema document.

## Verdict

**PASS.** The health regression test exists and passed. The failed-workspace lease rule is enforced on both tables at commit and the required cases passed. No attribute size was invented. The stale schema sentences are gone. Milestone 1 is still only the schema plus `GET /healthz` and `GET /readyz`.
