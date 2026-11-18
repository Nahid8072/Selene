---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Backend decisions

Current implementation contract for Selene, consolidated from the accepted D1–D44 decisions and their gate reports. This file is the current decision register. It does not modify the preserved Foundation Pack under `docs/source/`. A reversal of an accepted architecture decision requires a new decision/ADR. Backend source was lost with the former Cloud Agent workspace; the implementation must be rebuilt from the milestones in `MILESTONE_1_READINESS.md`.

The frozen frontend at `/agent/web` is not modified. Its confirm controls stay disabled. Fixture numbers are not measurements and are not seed data.

## Decision table

| ID | Decision | Status |
| --- | --- | --- |
| D1 | One Go control plane on host `node-a`. PostgreSQL holds metadata only. Git objects stay in Git. | Accepted |
| D2 | No distributed cache, Kubernetes, LLM agent runtime, or custom VCS in v1. | Accepted |
| D3 | Shared bare mirrors are immutable to workspaces. Workspaces are independent and writable. Access to mirror objects is through Git alternates and a lease. | Accepted |
| D4 | Python workload and benchmark tools call the Go HTTP API for control-plane actions. They do not open PostgreSQL and do not write Selene mirrors themselves. | Accepted |
| D5 | The fourth registered repository is `vscode`. `synthetic-overlap` is a generated benchmark dataset, not that registry row. | Accepted |
| D6 | Stored statuses are the Foundation Pack enums. UI words are a presentation map, not stored values. | Accepted |
| D7 | `ready` means the workspace was provisioned and `HEAD` matches the pinned SHA. It does not mean an agent runtime is active. | Accepted |
| D8 | Sync and initial cache population are one mirror-refresh operation. | Accepted |
| D9 | Workspace provisioning requires a full commit SHA. A branch name alone is not accepted. | Accepted |
| D10 | Stop and restart of a workspace are not v1 transitions. Destroy remains the accepted end of life. | Deferred |
| D11 | Automatic cache eviction and destructive cache clear are not v1 operations. Garbage collection and prune stay forbidden while any lease is held. | Deferred, with the lease rule Accepted |
| D12 | Node management is read-only. One node, `node-a`. No register, drain, restart, or remove. | Accepted |
| D13 | IAM, API keys, enterprise credentials, email, and webhooks are not implemented. Security enforcement is `not_enforced`. | Deferred |
| D14 | Workload and job tables wait until the simulator milestone. Screens 06 and 07 are not given an empty substitute schema now. | Deferred |
| D15 | Research benchmarks use three arms (Standard Git, Optimized Git, Selene), cold and warm, the protocol concurrency list, and at least five development repetitions. The frontend’s two-arm, three-repetition profile is a demonstration preset only. | Accepted |
| D16 | The domain stores many experimental configurations. A run points at one configuration. | Accepted |
| D17 | Long work returns `202` and an operation id. Clients poll `GET /api/v1/operations/{operationID}`. | Accepted |
| D18 | The API listens on `127.0.0.1` only while IAM is deferred. | Accepted |
| D19 | Unknown metrics are null. Eviction counts and health are not invented. Frontend fixtures are not loaded as results. | Accepted |
| D20 | `needs_reconciliation` is an operation status and a workspace `error_code`, not a new workspace status. | Accepted |
| D21 | Optional `agent_label` is a caller name on a workspace, not an agent service. | Accepted |
| D22 | Average checkout time and workspace provisioning latency are separate measurements; checkout time remains unavailable until independently measured. | Accepted |
| D23 | PostgreSQL 16 only. Refuse other major versions; no substitute major version. | Accepted |
| D24 | Frontend confirm controls remain disabled; each later operation requires separate approval. | Accepted |

## Repository registry and datasets

Registered remotes, in the product registry, are exactly these four until a later review adds another:

| ID | Name | Remote | Role |
| --- | --- | --- | --- |
| `repo_react` | react | `https://github.com/facebook/react.git` | Public repository. Protocol starting set. |
| `repo_kubernetes` | kubernetes | `https://github.com/kubernetes/kubernetes.git` | Public repository. Protocol starting set. |
| `repo_linux` | linux | `https://github.com/torvalds/linux.git` | Registered. Optional stress dataset when hardware and disk allow. |
| `repo_vscode` | vscode | `https://github.com/microsoft/vscode.git` | Fourth registered repository. |

`cached_commit` stays null until a human or the benchmark tool records a SHA that was actually resolved from that remote. The SHAs in `/agent/web/src/fixtures` are not those pins. They must not be inserted.

`synthetic-overlap` is dataset `dataset_synthetic_overlap`. It is produced by the generator described in the benchmark protocol: configurable file count, file size, history depth, binary/text ratio, and shared-path overlap. Its pinned SHA is recorded after generation. It is not a fifth registered GitHub repository. The overview fixture’s `repo_synthetic` row is a frontend inconsistency, not a backend registry row.

## Canonical statuses and UI labels

The API returns only the stored enum. Clients that want specification words apply this map. The frozen UI does not apply it yet. That conflict is recorded in the architecture document. This revision does not edit the UI.

### Repository

| Stored | Specification label | Frozen screen label today |
| --- | --- | --- |
| `registered` | Connected | Not shown as its own word |
| `syncing` | Syncing | Syncing |
| `ready` | Connected | Ready |
| `degraded` | No specification word. Do not display as Error. | Degraded |
| `error` | Error | Not in the built filter |

`ready` and `registered` are different. `registered` means the row exists and no successful mirror refresh has completed. `ready` means the last mirror refresh succeeded.

### Cache entry

| Stored | Specification label | Rule |
| --- | --- | --- |
| `empty` | Uncached | No successful objects. |
| `warming` | Partially cached | Refresh is in progress. This is a label, not a new stored state. |
| `ready` | Cached | Last refresh succeeded. |
| `degraded` | Cached | Last good objects remain. Repository status carries `degraded`. |
| `error` | Uncached if `disk_bytes` is 0. Cached if `disk_bytes` is a measured positive number. | If `disk_bytes` is null, the label is unavailable. Do not treat null as Uncached or as zero bytes. |

### Workspace

| Stored | Label to show | Must not be shown as |
| --- | --- | --- |
| `requested`, `provisioning` | Queued | Running |
| `ready` | Ready | Running, or “active agent” |
| `failed` | Failed | |
| `stopping`, `destroying` | Stopping | A restart |
| `stopped` | Stopped | Reachable only if a future ADR adds stop. No v1 transition enters it. |
| `destroyed` | Destroyed | Hidden from the active list is a client choice. The API still returns the row. |

`ready` is not an active agent runtime. A count of `ready` workspaces is a count of provisioned workspaces. It is not “Active Agents.”

### Node

One row. `healthy` is allowed only when the process heartbeat and the mirror root check both succeeded. Otherwise `unknown` or `degraded` from a failed check. `offline` is `down`. Do not copy the sample heartbeat or the sample hit rate.

### Workload

No stored workload status until D14 is lifted. The screen words queued, running, completed, and failed are not a backend enum yet.

## Mirror refresh

`POST /api/v1/repositories/{repositoryID}/sync` is the only population operation. The first refresh creates the bare mirror if it is missing, then fetches. A later refresh fetches into the same mirror. “Warm cache” on the repository menu is the same operation. There is no second route.

A failed refresh does not change `cached_commit`, `last_synced_at`, or a previous `ready` cache into an empty one. The repository becomes `degraded` if a previous success exists, and `error` if it does not. The cache entry becomes `degraded` or `error` on the same rule. Details are in `STATE_MACHINES_AND_RECOVERY.md`.

## Workspace SHA rule

`POST /api/v1/workspaces` requires `commit_sha` to be the full object id (40 hexadecimal characters for SHA-1; 64 for SHA-256 once the mirror’s object format is known). A branch name is rejected with `invalid_commit_sha`. The server checks the SHA against the mirror. It does not resolve a branch at provision time. Callers who have a branch resolve it first by reading refs, then send the SHA.

## Leases, eviction, and destroy

A lease is taken when workspace creation starts and released only after destroy cleanup is recorded. Prune and garbage collection are rejected while any unreleased lease exists for that repository. Automatic eviction is not implemented, so v1 does not report an eviction count. The field is omitted, not returned as zero. Destructive clear is not a route.

Destroy is `DELETE /api/v1/workspaces/{workspaceID}`. It does not delete mirror objects. Stop and restart have no route and no transition.

## Identity and exposure

While D13 stands:

- The HTTP server binds `127.0.0.1` only.
- There is no login, no API key, no role check, and no email or webhook sender.
- `GET /api/v1/security` returns `enforcement: not_enforced`.
- Repository registration rejects URLs that contain userinfo, and rejects non-HTTPS schemes except an explicit local test allow-list. Tokens in the Add Repository form are not an API field. If a client sends a credential field, the response is `400` `credentials_not_accepted` and nothing is stored.

## Operations and the CLI

Every long Git action creates an operation row and returns `202` with that id. Polling is specified in `openapi.yaml`. Python tools and the future Go CLI call `http://127.0.0.1:<port>`. Baseline Git commands inside the benchmark harness are measurement steps for arms A and B. They are not a second control plane. Their results are posted to the API. They do not open the database.

## Deferred work

D22–D24 are Accepted. Workload tables are deliberately absent until the simulator milestone, which is the approval gate for D14 rather than a schema sketched in advance.


## Accepted decisions D25–D44 (current normative supplement)

The following decisions are Accepted. Detailed gate evidence is retained under `docs/backend/gate-reports/`. If an older archived source document differs, this section and `POLICY_SUPPLEMENT_D25_D44.md` are the current backend policy.

| ID | Topic | Accepted rule |
| --- | --- | --- |
| D25 | URL validation and stable error codes | First matching URL rule wins. Never expose credentials, tokens, submitted URLs, or internal paths in errors/logs. |
| D26 | Production remote URL | HTTPS only. Reject userinfo, queries, empty host, invalid numeric ports, and prohibited IP addresses. Store normalized scheme, host, non-default port, and path. |
| D27 | Test-only URL exceptions | Only injected test instances may allow a `file:` URL contained within a test fixture root or exact `http://127.0.0.1:18080` origin. Production allow-list is empty. No `ssh` or `git` schemes. |
| D28 | Redirects | At most five redirect hops; revalidate each target. The sixth redirect is `redirect_limit_exceeded`. |
| D29 | DNS and rebinding | Resolve at registration and again before Git. Any prohibited address rejects the URL. Syntactic validation alone is not fetch permission. Actual Git connection must be pinned/restricted to validated addresses while retaining TLS verification, SNI, and hostname, or equivalent controlled proxy policy. |
| D30 | IDs and filesystem paths | IDs use ASCII letters, digits, `_`, `-`; reject empty, `.`, `..`, separators. Roots are absolute/canonical and symlink-evaluated; enforce exact root-child containment, no prefix matching, no symlink escape. Validation creates nothing. Internal paths are never public output. D42 narrowly supersedes the mirror leaf-name rule. |
| D31 | Benchmark artifacts | Initially approved basenames: `config.json`, `workers.jsonl`. |
| D32 | Benchmark artifact allow-list extension | Exact allowed basenames are `config.json`, `workers.jsonl`, `metrics.json`, `summary.json`, `README.md` under `benchmarks/<run-id>/`. This does not widen ID syntax. |
| D33 | Repository ID generation | New repository IDs are server-generated canonical lowercase hyphenated UUIDv4. Create request has no `id`; historical IDs remain valid. |
| D34 | Provider | Explicit valid provider is preserved. If omitted, exact host `github.com` → `github`, `gitlab.com` → `gitlab`, all other exact hosts → `other`. Never infer `self_hosted`; no subdomain/lookalike matching. |
| D35 | Registration DNS result mapping | Prohibited address, including any prohibited address in a mixed answer: `400 remote_address_rejected`. NXDOMAIN or successful result with no usable address: `400 remote_unresolvable`. Timeout/temporary/unsafe-to-prove result: `503 dns_resolution_failed`. IP literals skip DNS. Failures write nothing. Resolver is injectable in tests; no retry/cache. |
| D36 | Duplicate URL identity | Compare sanitized D26 URL: lowercase scheme/host, drop HTTPS port 443, retain other ports, canonicalize IP literals, preserve path case, `.git`, and trailing slash. Queries rejected; fragments not stored; redirects are not aliases. Only the specific `repositories_remote_url_key` duplicate maps to `409 repository_already_registered`. |
| D37 | Name and branch validation | Name: trim surrounding Unicode whitespace, 1–128 Unicode code points, reject Unicode control chars, preserve other Unicode; `400 invalid_repository_name`. Branch: nonempty Git short ref per `git check-ref-format`, no rewriting, no extra 255-byte cap, no remote lookup at registration; `400 invalid_default_branch`. |
| D38 | DNS deadline | Entire registration lookup has a 5-second maximum, using a child of the incoming request context (equivalent to `context.WithTimeout(r.Context(), 5*time.Second)`). Earlier parent cancellation/deadline wins. No application retry or cache. Timeout, parent cancellation, temporary failure, or inability to prove safety maps to `503 dns_resolution_failed`. |
| D39 | Request body/provider errors | Malformed/empty JSON, non-object body, wrong field type, or explicit null/non-string provider: `400 invalid_request_body`. Unsupported provider string: `400 invalid_provider`. |
| D40 | Transaction persistence errors | Registration transaction contains repository, empty cache entry, and registration event. Commit only all three; any failure rolls all back. Only `repositories_remote_url_key` maps to `409`; every other persistence/transaction failure maps to `500 not_persisted`. |
| D41 | Registration event ID | `repository_registered` event gets an independent server-generated canonical lowercase hyphenated UUIDv4, distinct from repository ID. |
| D42 | Mirror storage path | `SELENE_DATA_DIR` must be explicitly configured, nonempty, absolute, existing, and safe. Mirror root is `SELENE_DATA_DIR/repos`; stored path ends `<repository-id>.git`. This narrowly supersedes only D30's exact-leaf-id rule. `repos/` may be absent; any existing directory/leaf must remain within canonical roots with symlink protection. Registration does not create directories or a Git repository. Missing/unsafe data dir: `500 storage_path_unavailable`; containment violation remains `path_rejected`. |
| D43 | Strict JSON fields | Only exact case-sensitive keys `name`, `remote_url`, `provider`, `default_branch` accepted. Reject `id`, unknown keys and case variants with `400 unknown_field`. Credential keys `access_token`, `credential`, `authorization` take precedence over unknown keys and map to `400 credentials_not_accepted`. Duplicate JSON keys map to `400 invalid_request_body`. |
| D44 | Registration validation precedence | First failure wins; one code, no aggregation. Order: parse → credential keys → unknown keys → field types/provider → name → default branch → remote URL (D25 internal order) → storage (D42) → DNS (D35/D38) → DB transaction. |

### D25 URL first-match order

1. Parse failure (including empty scheme): `invalid_remote_url`.
2. Userinfo, including empty userinfo: `credentials_not_accepted`.
3. Non-HTTPS scheme outside D27 test-only exceptions: `unsupported_scheme`.
4. HTTPS empty host: `invalid_remote_url`.
5. Numeric port outside 1–65535, including 0: `invalid_remote_url`.
6. Prohibited IP literal: `remote_address_rejected`.
7. Any query string: `invalid_remote_url`.
8. Sixth redirect: `redirect_limit_exceeded`.

Prohibited address classes include loopback, private, link-local, multicast, unspecified, `169.254.169.254`, and `fd00:ec2::254`, after IPv4-mapped IPv6 normalization.

### D44 request validation precedence

| Stage | Check | First failure response |
| --- | --- | --- |
| 1 | Parse JSON; reject empty/malformed/non-object/duplicate property | `400 invalid_request_body` |
| 2 | Credential keys | `400 credentials_not_accepted` |
| 3 | Unknown/case-variant keys | `400 unknown_field` |
| 4 | Types and provider | `400 invalid_request_body` or `400 invalid_provider` |
| 5a | Name | `400 invalid_repository_name` |
| 5b | Default branch | `400 invalid_default_branch` |
| 5c | Remote URL | D25/D26 existing mapping |
| 6 | Storage configuration/path | `500 storage_path_unavailable` or `path_rejected` |
| 7 | DNS | `400 remote_address_rejected`, `400 remote_unresolvable`, or `503 dns_resolution_failed` |
| 8 | Atomic three-row insert | `201`; specific remote duplicate `409 repository_already_registered`; other failure `500 not_persisted` |

The registration event attributes are `{}`. The maximum size/constraint for arbitrary future `operation_events.attributes` remains a separate pending decision; do not invent a limit.
