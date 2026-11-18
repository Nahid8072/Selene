---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Security policy decision gate

Documentation only. No Go source, tests, endpoints, Git commands, network calls, DNS lookups, or database changes were made. The frontend and its confirm controls were not touched. PostgreSQL was not changed. D22, D23, and D24 stay Accepted. The size of `operation_events.attributes` was not chosen.

Verdict: **PASS**.

## Decisions

| ID | Status | Rule |
| --- | --- | --- |
| D25 | Accepted | Stable URL error codes, in the order below. Error text and logs never include credentials, tokens, or the submitted URL. |
| D26 | Accepted | Production is HTTPS only. Reject userinfo, every query, an empty host, a port outside 1–65535, and a prohibited address. Store scheme, host, non-default port, and path. |
| D27 | Accepted | Test exceptions are injected into test instances only. Exactly two: a `file` URL inside the fixture root, and the origin `http://127.0.0.1:18080`. No `ssh` or `git`. The production allow-list is empty. |
| D28 | Accepted | Follow at most five redirect hops. Revalidate each target. The sixth redirect is `redirect_limit_exceeded`. |
| D29 | Accepted | Resolve a hostname at registration and again before Git. Any prohibited address rejects the URL. Syntactic success is not fetch permission. This decision does not run DNS. |
| D30 | Accepted | Id alphabet, absolute root, symlink canonicalization, exact `root/id` child, no directory created, no path in public output. |
| D31 | Accepted | Only `config.json` and `workers.jsonl` are artifact basenames under `benchmarks/<run-id>/`. They do not widen the id alphabet. |

## Error codes

First match wins.

| Condition | Code |
| --- | --- |
| Parse failure or malformed URL | `invalid_remote_url` |
| Userinfo or embedded credentials, including empty userinfo | `credentials_not_accepted` |
| Non-HTTPS scheme outside the D27 exceptions | `unsupported_scheme` |
| HTTPS URL with an empty host | `invalid_remote_url` |
| Numeric port outside 1–65535, including 0 | `invalid_remote_url` |
| Rejected IP address | `remote_address_rejected` |
| Any query string | `invalid_remote_url` |
| A sixth redirect | `redirect_limit_exceeded` |
| Id or artifact path failure | `path_rejected` |

`redirect_limit_exceeded` is now in the OpenAPI stable-code list. A URL or path message does not include credentials, tokens, the submitted URL, or a filesystem path.

## Production URL policy

HTTPS only. `http`, `ssh`, `git`, and `file` are rejected. Any userinfo is rejected, including an empty user. Any query is rejected, with no list of parameter names. An empty host is rejected. A numeric port outside 1–65535 is rejected, including 0. The stored HTTPS port omits 443. The stored HTTP port omits 80 when a test exception is stored.

After an IPv4-mapped IPv6 address is converted to IPv4, reject loopback, private, link-local, multicast, unspecified (`0.0.0.0` and `::`), `169.254.169.254`, and `fd00:ec2::254`. A public HTTPS IP literal outside those classes is accepted. The stored value is scheme, host, a non-default port, and path.

## Test-only URL policy

Not enabled in production. No production environment variable and no request field enables them. The production validator’s allow-list is empty. A test injects configuration into that test instance only.

The only exceptions are a `file` URL whose canonical target stays inside the fixture root (`t.TempDir()` in tests), and the exact origin `http://127.0.0.1:18080` with no wildcard, other port, or hostname alias. A `file` URL that leaves the fixture root is `unsupported_scheme`. Userinfo and a query are still rejected on an excepted URL. `ssh` and `git` are rejected in tests and in production. A hostname that resolves to `127.0.0.1` is not the test origin.

## Redirects and DNS

Five redirect hops may be followed. Every target is revalidated with the scheme, userinfo, host, port, IP, and DNS rules before it is followed. A prohibited scheme or address is not followed. The sixth redirect fails with `redirect_limit_exceeded`.

Registration still resolves the hostname and rejects the URL if any returned address is prohibited. The same check runs again before an outbound Git command. An IP literal is classified directly. Passing the syntactic checks does not make a URL safe to register or to fetch. This gate made no DNS request and does not claim that DNS tests have been run.

## Filesystem and artifact paths

Ids are ASCII letters, digits, `_`, and `-`. Empty, `.`, `..`, `/`, and `\` are rejected. The data root is absolute, canonicalized, and symlink-evaluated. A child must resolve to that root, a separator, and the id. Escapes, including symlink escapes, are `path_rejected`. Validation creates no directory. Canonical paths do not appear in public JSON or logs.

Under canonical `benchmarks/<run-id>/`, the only allowed basenames are `config.json` and `workers.jsonl`. The run id uses the normal id rule. Any other basename or a separator in the basename is rejected. An existing symlink that resolves outside the run directory is rejected. These two names are fixed exceptions and do not add `.` to the id alphabet.

## Documents

| Document | What changed |
| --- | --- |
| `backend/DECISIONS.md` | Added D25–D31. Replaced the open allow-list sentence. Added the code, production, test, redirect, DNS, path, and artifact sections. |
| `backend/DEPLOYMENT_AND_SECURITY.md` | Replaced remote URL validation, path boundaries, DNS address classes, and the redirect cap. |
| `backend/openapi.yaml` | Added `redirect_limit_exceeded` and the message rule. `remote_url` is the persisted HTTPS form with no query. |
| `backend/STATE_MACHINES_AND_RECOVERY.md` | Refresh waits for D25–D29. Events omit query strings. |
| `backend/BENCHMARK_AND_TELEMETRY.md` | D31 names the two accepted artifact basenames. |
| `backend/MILESTONE_1_READINESS.md` | D25–D31 are Accepted. The URL-and-path gate text matches the codes. The pack’s older allow-list sentence is recorded as a pack difference. |
| `backend-architecture.md` | Decision table and the URL-and-path gate text. |
| `backend/DATABASE_SCHEMA_AND_INVARIANTS.md` | Stored `remote_url` is scheme, host, non-default port, and path. |
| `project-context.md` | Production HTTPS rule and the two test exceptions. |

`docs/source/06_CORRECTNESS_SECURITY_AND_FAILURES.md` was not edited. Decisions do not revise the Foundation Pack in place. The Selene rule is D25–D31.

## Remaining notes

The Go validators were not changed, as this gate required. They do not yet return these codes. That is an implementation gap for a later gate, not an open policy choice.

`BENCHMARK_AND_TELEMETRY.md` still names `metrics.json`, `summary.json`, and `README.md` as protocol raw files. D31 does not accept them. The path check rejects those basenames until a later decision adds them.

DNS validation is specified and untested. Syntactic validation is not registration safety.

The numeric bound for `operation_events.attributes` is still pending.

## Confirmation

No file under `/agent/selene` was modified. No endpoint, registration, sync, migration, frontend control, or PostgreSQL setting was changed. No network, Git, or DNS command was run.

## Verdict

**PASS.** The approved URL, redirect, DNS, path, and artifact rules are stated the same way in the backend documents. No approved rule was left as a choice for this gate to invent.
