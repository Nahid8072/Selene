---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# URL and filesystem validator implementation

Implemented in `/agent/selene` against D25–D32. Approved policy text was not changed. OpenAPI was not changed: `redirect_limit_exceeded` and the other URL codes were already listed. No registration, sync, Git, real DNS, real HTTP, endpoint, migration, or frontend work was done.

Verdict: **PASS** for syntactic URL checks, path checks, and artifact checks only. This does not mean a URL is safe to register or to fetch, and it does not implement registration DNS enforcement.

## Files changed

- `/agent/selene/internal/remoteurl/url.go`
- `/agent/selene/internal/remoteurl/url_test.go`
- `/agent/selene/internal/idpath/path.go`
- `/agent/selene/internal/idpath/artifact_test.go`

## D25–D32 mapping

`Validate` uses the first match:

| Condition | Code |
| --- | --- |
| Parse failure, empty scheme, empty host, port outside 1–65535, any query including a bare `?` | `invalid_remote_url` |
| Userinfo, including empty userinfo | `credentials_not_accepted` |
| Non-HTTPS outside the two injected exceptions | `unsupported_scheme` |
| Prohibited IP, or any injected DNS answer in a prohibited class | `remote_address_rejected` |
| Sixth redirect | `redirect_limit_exceeded` |
| Bad id, escape, or artifact name | `path_rejected` |

Error text is only the code. Tests reject strings that contain the token, `://`, or the hostname.

Production `Check` uses an empty `Options`: HTTPS only, no fixture root, test HTTP origin off. It rejects loopback, private, link-local, multicast, unspecified (`0.0.0.0`, `::`), and `169.254.169.254` / `fd00:ec2::254` after `To4()` normalization. `https://8.8.8.8/repo.git` and `https://[2001:4860:4860::8888]/repo.git` pass. `https://[::ffff:8.8.8.8]/repo.git` passes. Mapped private, metadata, and unspecified addresses do not.

The persisted form is scheme, host, a non-default port, and path. Port 443 is omitted for HTTPS and port 80 would be omitted for HTTP. Fragments, queries, and userinfo are not stored. `https://example.com:443/repo.git` becomes `https://example.com/repo.git`. `https://example.com:8443/repo.git` keeps `:8443`.

## Test exceptions and redirects

`Options.FixtureRoot` and `Options.AllowTestHTTPOrigin` are the only switches. Nothing reads an environment variable or a request flag. Production `Check` rejects `file://…` and `http://127.0.0.1:18080/repo.git` with `unsupported_scheme`.

With both switches set, a `file` URL whose canonical target stays inside `t.TempDir()` is accepted. A file outside that root, and a symlink inside the root that points outside, are `unsupported_scheme`. `http://127.0.0.1:18080/repo.git` is accepted and keeps port 18080. Port 18081, `localhost`, a query, `ssh`, and `git` are still rejected.

`Follow` revalidates the start URL and each hop and opens no connection. Five hops succeed. The sixth returns `redirect_limit_exceeded` without inspecting that hop. A hop to `https://127.0.0.1/…` returns `remote_address_rejected`.

## DNS helper

`ProhibitedAddress` classifies one address. `Options.Lookup` is an injected function. Tests pass fake answers: `8.8.8.8` allows fetch, and a mix of `8.8.8.8` plus `10.0.0.1`, or `127.0.0.1`, is `remote_address_rejected`. The same hostname with a nil lookup is syntactically accepted and `FetchAllowed` is false. There is no `LookupHost`, no registration call, and no Git command.

## Paths and artifacts

`idpath.Check` still covers valid ids, rejected ids, relative and missing roots, traversal, slash and backslash, symlink escapes, a symlinked root, the `selene` / `selene-evil` prefix case, and no directory creation. Every error is `path_rejected`.

`idpath.CheckArtifact` allows only `config.json`, `workers.jsonl`, `metrics.json`, `summary.json`, and `README.md`, directly under `benchmarks/<run-id>/`. The run id uses the existing id rule. `readme.md`, other extensions, nested names, a bad run id, a `config.json` symlink to another directory, and a `benchmarks` symlink to `benchmarks-evil` are `path_rejected`. Nothing is created.

## Route regressions

`go test -count=1 ./...` ran `TestMilestoneRoutesStillHold`: `GET /healthz` is 200 `up`, `GET /readyz` is 503 without a database and 200 `ready` after a PostgreSQL ping, `GET /api/v1/security` stays `not_enforced`, and `GET /api/v1/repositories` is 404.

## Commands

Working directory `/agent/selene`.

| Command | Result |
| --- | --- |
| `gofmt -l .` | No files printed. Exit 0. |
| `go test -count=1 ./...` | `cmd/selene`, `internal/dbver`, `internal/idpath`, `internal/listen`, and `internal/remoteurl` ok. Exit 0. |
| `go vet ./...` | No findings. Exit 0. |
| `go build ./...` | Exit 0. |

## Limitations

Syntactic acceptance of a hostname is not permission to register it or to run Git. DNS runs only when a caller injects `Lookup`. Redirects are a supplied list, not an HTTP client. These helpers are not connected to a repository route. The `operation_events.attributes` size is still pending.

## Verdict

**PASS** for the syntactic URL, path, and artifact rules in D25–D32. Not a claim that registration DNS enforcement, repository registration, or Git sync is implemented.
