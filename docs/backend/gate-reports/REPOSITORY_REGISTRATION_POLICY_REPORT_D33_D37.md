---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Repository registration policy freeze

Documentation and a read-only schema check. No Go, tests, routes, migrations, data writes, Git, DNS, or frontend edits. `docs/source/` was not edited.

Verdict: **PASS**.

## D33–D37

All five are Accepted. D22–D32 stay Accepted and their decision text was not rewritten.

D33. New repository ids are server-generated UUIDv4 in lowercase hyphenated form. `RepositoryCreate` has no `id`. The public type stays `string`. The four registry ids stay `repo_react`, `repo_kubernetes`, `repo_linux`, and `repo_vscode`. A UUIDv4 uses only letters, digits, and `-`, so it matches D30. The preferred generator is Go’s standard-library cryptographic randomness. No UUID module is required for that.

D34. An omitted provider uses an exact host match: `github.com` stores `github`, `gitlab.com` stores `gitlab`, and every other host stores `other`. Subdomains and lookalikes do not match. An explicit `github`, `gitlab`, `self_hosted`, or `other` is kept. `self_hosted` is never inferred. The request field stays optional. The response field stays required.

D35. A prohibited resolved address, including one bad address in a mixed set, is `400` `remote_address_rejected`. NXDOMAIN, and a successful lookup with no usable address, are `400` `remote_unresolvable`. A timeout or any other failure that cannot prove safety is `503` `dns_resolution_failed`. IP literals are not looked up. None of these write a row. Tests inject the resolver. The lookup uses the request context and must have a deadline. This freeze sets no retry count and no cache.

D36. Duplicate equality is the sanitized D26 value: lowercase scheme and host, HTTPS port 443 removed, other ports kept, canonical IP literal, path case preserved, `.git` and a trailing slash kept. Queries are rejected. Fragments are not stored. Redirects are not used as aliases. The result is `409` `repository_already_registered`. The existing unique `remote_url` constraint is the race safeguard. Only that duplicate-remote violation uses this code. There is no second row and no `201` of the existing row.

D37. `name` is trimmed of surrounding Unicode whitespace, then must be 1–128 code points with no control character. Other Unicode is kept. The stored value is trimmed. The code is `400` `invalid_repository_name`. `default_branch` is a nonempty Git short ref under `git check-ref-format` rules, not rewritten and not looked up on the remote at registration. There is no extra 255-byte cap. The code is `400` `invalid_default_branch`.

Registration DNS and a second lookup before fetch do not stop rebinding. Before Git connects, the destination must be limited to the validated address set, while certificate checks, SNI, and the hostname stay. A controlled proxy is acceptable. That restriction is not implemented.

## Schema compatibility

Live `selene.repositories`, read only:

| Column | Type | Constraint that matters |
| --- | --- | --- |
| `id` | `text`, no length cap | `valid_id`: `^[A-Za-z0-9_-]+$` |
| `name` | `text`, no length cap | not null |
| `default_branch` | `text`, no length cap | not null |
| `remote_url` | `text` | `UNIQUE` (`repositories_remote_url_key`) and `no_userinfo` |
| `provider` | `text` | `github`, `gitlab`, `self_hosted`, `other` |
| `cache_path` | `text` | not null; not in `repositories_public` |

A 36-character UUIDv4 fits `text` and `valid_id`. `repo_react`, `repo_kubernetes`, `repo_linux`, and `repo_vscode` fit the same check. `name` and `default_branch` can hold the D37 values, and the branch column has no 255-byte cap. The provider check already matches D34. No migration is required.

`SELECT` returned zero repository rows. There is no stored URL to rewrite and no noncanonical row. No `INSERT`, `UPDATE`, `DELETE`, or DDL was run.

`repositories_public` still has id, name, remote_url, provider, default_branch, status, cached_commit, created_at, updated_at, and last_synced_at. It still has no `cache_path`.

The process still registers only `GET /healthz`, `GET /readyz`, and `GET /api/v1/security`. That code was not edited.

## Documents

| File | Change |
| --- | --- |
| `backend/DECISIONS.md` | D33–D37 Accepted, plus the rebinding paragraph. |
| `backend/openapi.yaml` | POST keeps `201` and `400`, and adds `409` and `503`. New codes are in the stable list. Create still has no `id`. `provider` stays optional. Response `provider` stays required. Ids stay plain strings. |
| `backend/DATABASE_SCHEMA_AND_INVARIANTS.md` | Notes that the existing columns already match. No constraint was altered. |
| `backend/DEPLOYMENT_AND_SECURITY.md` | D35 outcomes and the rebinding limit. |
| `backend/STATE_MACHINES_AND_RECOVERY.md` | Registration failures write nothing. A second lookup is not rebinding protection. |
| `backend/FOUNDATION_COMPATIBILITY.md` | Pack gaps filled by D33–D36. |
| `backend-architecture.md` | Decision table rows. |
| `backend/MILESTONE_1_READINESS.md` | Accepted list now includes D33–D37. |

`docs/source/` was not edited.

## Risks

The Go validator was not updated, as this gate required. It does not yet lowercase hosts, canonicalize IP literals, or apply D35 and D37. Those remain future implementation work.

The lookup must be bounded by the request context. This freeze does not pick a millisecond value, a retry count, or a cache.

`cache_path` is still not null. A later insert can store a path that contains the 36-character id. This decision does not create that directory.

The `operation_events.attributes` size is still pending.

## Verdict

**PASS.** D33–D37 fit the current `text` columns, `valid_id`, the provider check, and the unique `remote_url` constraint. No destructive migration is required, and no row had to be rewritten.
