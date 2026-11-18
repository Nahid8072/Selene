---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Deployment and security

Linux deployment and the security boundary for the single-host prototype. This is a design. It does not install PostgreSQL, open a port, or add a unit file to a machine. Coding has not started.

IAM, API keys, enterprise credentials, email, and webhooks are deferred. Until they exist, the API is local-only and unauthenticated. That is an explicit non-implementation, not a silent open service.

## Placement

| Piece | Where it runs |
| --- | --- |
| Go control plane | `node-a`, one process, user that is not root |
| PostgreSQL | Same host, listening on `127.0.0.1` only |
| Git mirrors and workspaces | Local disk under `SELENE_DATA_DIR` |
| Python benchmark and workload tools | Same host, calling `http://127.0.0.1:<port>` |
| Origin used for byte measurement | Optional Docker container on a network the benchmark tool can account. Not Kubernetes. |
| React app | Unchanged. It does not get a confirm button or a production URL from this document. |

No second host, no regional cache, no cluster.

## PostgreSQL

The Foundation Pack names PostgreSQL and does not name a major version. The setup to follow when implementation is approved is PostgreSQL 16 from the distribution packages, on the same Linux host. If 16 is not what the implementer installs, change this paragraph before writing a migration. That version pin is not an ADR.

Intended local layout:

- Listen address `127.0.0.1`, not `*` and not a public address.
- Database name `selene`.
- Role `selene` with no superuser and no permission to read other databases.
- Password or peer credential comes from the process environment or from a file mode `0600` outside the source tree and outside `SELENE_DATA_DIR`. The password is not written into a repository, a migration, a log, or an API response.
- The application role may use the `selene` schema only.
- Backups are not part of v1. The settings screen’s backup line stays unbacked by this design.

The control plane refuses to start its migrator against a URL whose host is not `127.0.0.1` or `localhost` while D13 stands. `localhost` is accepted only after it resolves to a loopback address.

`GET /readyz` is ready only after a successful ping and the expected schema version. A refused connection is `503`, not a fabricated healthy database row.

## API bind

`SELENE_HTTP_ADDR` default and required value while IAM is deferred: `127.0.0.1:8080`. Configurable port is allowed. A configured address other than loopback is a startup error. The process does not fall back to `0.0.0.0`.

There is no TLS terminator and no gateway in front of this bind. Clients on other machines are out of scope. The Python tools use that loopback URL. They do not read `DATABASE_URL`.

## Process and disk

`SELENE_DATA_DIR` is an absolute path created before start, owned by the service user.

```text
SELENE_DATA_DIR/
  repos/<repository-id>.git/
  workspaces/<workspace-id>/
  benchmarks/<run-id>/
  tmp/
```

The service user is the only writer. Workspace processes, when the benchmark harness runs them, receive the workspace directory and read-only access to that repository’s object database. They do not receive the rest of `SELENE_DATA_DIR`.

A systemd unit, when one is written later, should set `NoNewPrivileges=yes`, a working directory inside the data dir, and `EnvironmentFile` for the database credential path. This document does not install that unit.

Docker is optional and only for an isolated Git origin so upstream bytes can be read from container network counters. It is not the control plane’s required runtime.

## Remote URL validation

Applied before any DNS result is fetched and again on every redirect.

1. Parse the URL. Failure is `invalid_remote_url`.
2. Reject userinfo (`https://token@host/...`) with `credentials_not_accepted`. Store nothing.
3. Scheme `https` is allowed for public remotes. `http`, `ssh`, `git`, and `file` are rejected unless the exact origin is on the local test allow-list. The allow-list is configuration, not request input. A public registration cannot add itself to the list.
4. Reject empty host, numeric ports outside 1–65535, and hosts that are IP literals in loopback, link-local, private, multicast, or the cloud metadata ranges (`169.254.169.254`, `fd00:ec2::254`, and IPv4/IPv6 equivalents).
5. Resolve the name. If any answer is in those ranges, reject with `remote_address_rejected`, unless this origin is the test allow-list entry.
6. Do not follow a redirect that would fail steps 2–5. Cap redirects.
7. Persist only the sanitized URL: scheme, host, port if not the default, and path. No userinfo, no query secrets.

Local test fixtures may be a `file` path that canonicalizes under a configured fixture root, or one allow-listed loopback HTTP origin used by tests. That exception is off unless the process is started with the test flag. The default `node-a` configuration does not set it.

The four registry URLs are ordinary `https` GitHub URLs with no credentials.

## Path boundaries

Before creating or deleting a mirror, workspace, or benchmark directory:

1. Reject ids that are not the configured id alphabet (ASCII letters, digits, `_`, `-`). Reject empty, `.`, `..`, and anything containing `/` or `\`.
2. Join the id onto the configured root.
3. Canonicalize with symlink evaluation.
4. The result must still be the root plus a path separator plus the id. A prefix string match on a sibling directory is not enough (`/data/selene-evil` must not pass for root `/data/selene`).
5. On failure, return `path_rejected` and do not create the directory.
6. Public JSON never includes the canonical path. Logs use the repository or workspace id, not the path.

Benchmark artifact names stored in PostgreSQL are relative names (`config.json`, `workers.jsonl`). The server joins them under `benchmarks/<run-id>/` with the same checks.

## Secrets

Not stored in PostgreSQL, not returned, not logged:

- Access tokens, passwords, cookie values, `Authorization` headers.
- URLs with userinfo.
- Private keys and webhook signing secrets.
- The database password.
- Environment dumps.

A request that includes `access_token`, `credential`, or `authorization` on repository create is rejected with `credentials_not_accepted` before insert. The body is not written to the error log.

API key creation is not implemented. There is nothing to show once.

## What the process may tell a caller

| Check | Allowed result |
| --- | --- |
| Process up | `GET /healthz` returns 200 without checking Git |
| Database | `up`, `down`, or `unknown` from a ping |
| Mirror root writable | `up` or `down` from a real access check |
| Cache manager | Same process. `up` only if the process is up and the mirror root check ran. Otherwise `unknown`. |
| Single node | `node-a` plus the checks above. No synthetic hit rate. |
| Security | `not_enforced` |

No check returns the sample strings from the settings or observability fixtures.

## CLI and browser

The browser app is not given a credential and is not pointed at a non-loopback API by this design. Confirm controls stay as they are.

The Python tools send `X-Correlation-ID` when they have one, and they read `correlation_id` from the JSON they get back. They poll operations until a terminal status. They do not scrape logs for secrets.

## Deferred on purpose

No user table, no password hash, no OAuth, no API key hash, no SMTP, no webhook delivery, no private-repository credential helper. Screen 14’s roles are not enforced. Turning any of that on is a later design, and private repository support still needs its own credential design before a token exists.

## D44 registration order

For `POST /api/v1/repositories`, return only the first failure in this order: parse/structure; credential keys; unknown keys; types/provider; name; default branch; remote URL (D25 internal ordering); storage; DNS; transaction. The storage check is before DNS. No DNS lookup occurs for direct IP literals. Hostname lookup uses `context.WithTimeout(r.Context(), 5*time.Second)` semantics; the parent context can stop it sooner. No application retry or cache is used. See `DECISIONS.md` and `POLICY_SUPPLEMENT_D25_D44.md` for exact statuses and codes.
