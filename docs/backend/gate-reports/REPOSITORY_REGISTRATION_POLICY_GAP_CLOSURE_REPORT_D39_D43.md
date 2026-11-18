---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Repository registration policy gap closure

Documentation only. No Go, tests, handlers, routes, migrations, schema, data, DNS, network, Git, directories, or frontend changes. `docs/source/` and historical gate reports were not edited.

Verdict: **PASS**. D39–D43 are Accepted and fit the live schema. One cross-check ordering question is still open. It is listed under remaining conflicts and must be decided before implementation.

## D39–D43

**D39 — Request body and provider.** Malformed JSON or an empty body is `400` `invalid_request_body`. A top-level non-object, including `null`, is `400` `invalid_request_body`. A field with the wrong JSON type is `400` `invalid_request_body`. An explicit `provider` that is `null` or not a string is `400` `invalid_request_body`. A provider string outside `github`, `gitlab`, `self_hosted`, and `other` is `400` `invalid_provider`. An omitted provider still uses D34. Missing fields keep existing codes: `remote_url` is `invalid_remote_url` (D25 parse failure), `name` is `invalid_repository_name` (D37), and `default_branch` is `invalid_default_branch` (D37). Errors contain no parser, stack, or database detail.

**D40 — Persistence failure.** A database or transaction failure that prevents commit is `500` `not_persisted`. Only a violation of `repositories_remote_url_key` is `409` `repository_already_registered`. A primary-key collision, another unique violation, or any other database error is never `409`. The repository, cache, and event rows roll back together. `201` is sent only after commit. Errors contain no SQL detail.

**D41 — Event id.** The `repository_registered` event gets its own server UUIDv4 in lowercase canonical hyphenated form. It never reuses the repository id.

**D42 — Mirror path.** The mirror root is `SELENE_DATA_DIR/repos`. The stored `cache_path` is absolute and ends in `<repository-id>.git`. `.git` is part of the canonical leaf. This supersedes only D30’s rule that the mirror leaf is exactly the id. `SELENE_DATA_DIR` must be explicitly set, nonempty, absolute, and an existing directory. If it is missing or unsafe, the response is `500` `storage_path_unavailable` and nothing is written. `repos/` may be absent. If `repos/` exists, it must be a directory under the canonical data root and must not escape through a symlink. An existing leaf must not escape `repos/`. Registration creates, initializes, clones, and modifies nothing. Sync creates the directory later.

**D43 — Strict fields.** Accepted keys are exactly `name`, `remote_url`, `provider`, and `default_branch`, case-sensitive. Any other key, including `id` and case variants such as `Name`, is `400` `unknown_field`. No unknown key is ignored. `access_token`, `credential`, and `authorization` remain `credentials_not_accepted`, checked before the unknown-key rule. A repeated key is `400` `invalid_request_body`. `RepositoryCreate` has `additionalProperties: false`.

## Schema check

Read-only on database `selene`:

- `operation_events.id` is `text`, primary key, `valid_id`. A UUIDv4 fits.
- `repositories.id` is `text`, primary key, `valid_id`. The repository UUIDv4 and the separate event UUIDv4 never share a key space.
- `repositories.cache_path` is not-null `text` with no constraint. An absolute `.git` path fits.
- `repositories_remote_url_key` is the unique constraint on `remote_url`, and the only one D40 maps to `409`.
- `operation_events.attributes` defaults to `{}`.
- `cache_entries` takes `state` `empty` and `lease_count` `0`.

No migration is needed.

## Three-row transaction

The schema document’s register row now says the repository row, the empty cache entry, and the `repository_registered` event with its own D41 id and `{}` attributes commit together after the body, URL, DNS, name, branch, and D42 storage checks. Any failure rolls back all three (D40). A committed registration leaves the mirror absent, which is already the recovery row for no previous success and no mirror directory.

## OpenAPI

| Status | Code | Source |
| --- | --- | --- |
| `201` | — | Unchanged |
| `400` | `invalid_request_body` | D39, D43 |
| `400` | `invalid_provider` | D39 |
| `400` | `unknown_field` | D43 |
| `400` | existing D25, D35, and D37 codes | Unchanged |
| `409` | `repository_already_registered` | D36, narrowed by D40 |
| `500` | `not_persisted` | D40 |
| `500` | `storage_path_unavailable` | D42 |
| `503` | `dns_resolution_failed` | D35, D38 |

The new codes are in the stable code list. `RepositoryCreate` still has no `id`, `provider` is still optional, and `Repository.provider` is still required. The file parses as YAML. POST responses are `201`, `400`, `409`, `500`, and `503`.

## Documents updated

| File | Section |
| --- | --- |
| `backend/DECISIONS.md` | D39–D43 rows. Registration request body, persistence, and mirror path sections. D30 text unchanged. |
| `backend/openapi.yaml` | POST description, `500` response, stable codes, and `RepositoryCreate`. |
| `backend/DEPLOYMENT_AND_SECURITY.md` | Process and disk, path boundaries, and request-key rule. |
| `backend/DATABASE_SCHEMA_AND_INVARIANTS.md` | `cache_path`, `operation_events` id, and the register transaction. |
| `backend/STATE_MACHINES_AND_RECOVERY.md` | Registration failures that write nothing. |
| `backend/FOUNDATION_COMPATIBILITY.md` | New codes and storage rule. |
| `backend-architecture.md` | D39–D43 rows. |
| `backend/MILESTONE_1_READINESS.md` | Accepted list includes D25–D43. |

## D22–D38 and the D42 scope

D22–D38 remain Accepted and their decision text was not rewritten. D30’s wording is unchanged. D42 explicitly supersedes only the mirror leaf name. The id alphabet, absolute root, symlink evaluation, exact parent-plus-separator rule, no prefix match, no symlink escape, no creation, and no path in output still apply. D36’s `409` is narrowed by D40 to the one constraint D36 already named.

## Remaining conflict

When one request fails more than one check, the documents do not say which code wins. D25 orders the URL checks only. Nothing orders body and key errors, URL errors, name or branch errors, the D42 storage check, DNS, and the database. D43 does put credential keys before unknown keys. Two orderings matter before implementation:

- whether name and branch are checked before DNS
- whether the D42 storage check runs before or after DNS

That order decides exact test expectations. This gate was not authorized to choose it.

The `operation_events.attributes` size is still pending. D39–D43 do not depend on it, because the registration event stores `{}`.

## Confirmation

No file under `/agent/selene` was changed. No migration, schema, or row was written. No DNS, network, Git, or directory operation ran. The frontend and `docs/source/` were not touched. Historical gate reports were not edited.

## Verdict

**PASS** for D39–D43. Cross-check precedence is still open and must be decided before the next implementation attempt.
