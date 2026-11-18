---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Repository registration implementation

## Attempt after D38 — Wednesday, Nov 18, 2026, 2:59 AM (UTC+6)

Verdict: **BLOCKED**.

D38 resolved the DNS deadline. The preflight then found five gaps the endpoint cannot avoid. Each one would need a new code, a new HTTP status, a new id rule, or a choice between two conflicting path rules. `POST /api/v1/repositories` was not added. No Go file, test, migration, database, or document other than this report was changed.

### Consistent and ready

D22–D38 do not contradict each other on the parts they cover:

- D33 repository id
- D34 provider inference
- D25, D26, and D36 URL validation, normalization, and the `409`
- D35 and D38 DNS outcomes and the 5-second child deadline
- D37 name and branch rules
- the three-row registration transaction in `DATABASE_SCHEMA_AND_INVARIANTS.md`

The live schema supports them, as recorded in `REPOSITORY_REGISTRATION_POLICY_REPORT.md`.

### Gaps

1. **Invalid request body or provider has no code.** `RepositoryCreate.provider` must be `github`, `gitlab`, `self_hosted`, or `other`. A different string, a non-string, or `null` needs a `400` code. Malformed JSON, a non-object body, and a field of the wrong JSON type need one too. The stable list has no request or provider code. `invalid_repository_name`, `invalid_default_branch`, and `invalid_remote_url` describe a field’s content, not a broken body or an unknown provider.

2. **Persistence failure has no documented response.** If PostgreSQL is down or an insert fails for a reason other than `repositories_remote_url_key`, POST has to return something. `not_persisted` is in the stable code list. `createRepository` documents `503` only for `dns_resolution_failed`. No document assigns `not_persisted` to a status on this route. D36 also forbids mapping other unique violations to `409`, for example a primary-key collision.

3. **The `repository_registered` event id has no generator.** The transaction must insert one `operation_events` row. That table needs an `id` in the D30 alphabet. D33 covers repository ids only. Reusing UUIDv4 for event ids would be a new decision.

4. **`cache_path` conflicts with D30.** `cache_path` is not null. `DEPLOYMENT_AND_SECURITY.md` places the mirror at `SELENE_DATA_DIR/repos/<repository-id>.git/`. D30 says a mirror directory is accepted only when it resolves to the configured root, a separator, and the id. The `.git` suffix and the `repos/` level do not fit that exact rule. Neither document says which one decides the stored `cache_path`. No document says what POST does when `SELENE_DATA_DIR` is not set or `repos/` does not exist yet. Validation may not create it.

5. **Unknown request fields are not decided.** Credential fields are rejected. A client-supplied `id`, other unknown keys, and keys that differ only by letter case are not decided. They could be rejected with no stable code, or ignored. D33 says the client does not send an id, but not what happens if it does.

### What would unblock it

One decision for each gap:

- the stable code or codes for a bad body and a bad provider
- the status and code for a persistence failure on POST
- the `operation_events.id` generator
- the exact `cache_path` rule and the unset-data-dir behavior
- the unknown-field rule

### Confirmation

No file under `/agent/selene` was modified. `docs/source/`, the frontend, migrations, and database data were not touched. D22–D38 were not edited. The `operation_events.attributes` size was not chosen. Sync was not started. `gofmt`, `go test`, `go vet`, and `go build` were not run because the preflight stopped before code.

---

## Earlier attempt, before D38 (kept as recorded)

The DNS deadline preflight failed. `POST /api/v1/repositories` was not added. No resolver, handler, transaction, or test was written. No duration was chosen. No lookup runs without a bound.

Verdict: **BLOCKED**.

### Deadline preflight

`/agent/selene/cmd/selene/main.go` builds the server with only `ReadHeaderTimeout: 5 * time.Second`. There is no `ReadTimeout`, `WriteTimeout`, or `IdleTimeout`. A handler’s `r.Context()` is not given its own deadline. `ReadHeaderTimeout` limits header reads. It is not a lookup budget, and no decision approves it as one.

`readyz` and `refuseOtherMajor` use `context.WithTimeout(..., 2*time.Second)` for a PostgreSQL connect and ping. That bound is for the database check. D35 does not adopt it for DNS.

D35 says the lookup uses the request context and must have a deadline, and that this decision sets no retry count and no cache. `REPOSITORY_REGISTRATION_POLICY_REPORT.md` says the freeze does not pick a millisecond value. Reusing 2 seconds or 5 seconds would be choosing that value.

An injected test resolver would still leave the production path without an approved bound. The gate says not to implement the DNS handler until a bound exists, and not to look up without one.

### What was not implemented

D33–D37 remain the accepted policy. They were not coded. No repository row, cache row, or event is written by a new route. List, detail, and sync stay unregistered. The future rebinding rule is unchanged: a second lookup does not confine the Git connection to the validated addresses, and that restriction is still not built.

### Files changed

- `docs/backend/REPOSITORY_REGISTRATION_IMPLEMENTATION_REPORT.md` — this report.

No file under `/agent/selene` was modified. `docs/source/` was not modified. D22–D37 were not edited. The `operation_events.attributes` size was not chosen.

### Commands

None. `gofmt`, `go test`, `go vet`, and `go build` were not run because the preflight stopped the gate.

### What would unblock it

An already approved bounded DNS lookup deadline, with its source named, that this handler may reuse. Until that exists, registration must not call a resolver.

### Verdict

**BLOCKED.** There is no approved DNS deadline to reuse, and an unbounded lookup is not allowed.
