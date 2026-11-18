---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# URL and filesystem-path security gate

No later gate was started. No repository route was added. Git was not initialized. The frontend and confirm controls were not touched. OpenAPI was not changed. PostgreSQL stayed 16.15 and no migration was added. D22, D23, and D24 remain Accepted. The `operation_events.attributes` size decision remains pending.

Verdict: **BLOCKED**.

The path check is implemented. The URL checks that have a named outcome are implemented. Several required URL decisions are not in the documents, so this gate does not choose them and does not treat URL validation as finished.

## Rules found

Remote URL, `docs/backend/DEPLOYMENT_AND_SECURITY.md` “Remote URL validation”, applied in that order:

1. Parse failure is `invalid_remote_url`.
2. Userinfo is `credentials_not_accepted`. Nothing is stored. `docs/backend/DECISIONS.md` “Identity and exposure” says the same, and says a credential field on repository create is also `credentials_not_accepted`. Repository create was not implemented.
3. Public remotes use `https`. `http`, `ssh`, `git`, and `file` are rejected unless the exact origin is on the local test allow-list. The allow-list is configuration, not request input. The next paragraph says the exception is a `file` path under a configured fixture root, or one allow-listed loopback HTTP origin, and that it is off unless a test flag is set. The default `node-a` configuration does not set it.
4. Reject an empty host, a numeric port outside 1–65535, and an IP literal in loopback, link-local, private, multicast, or the named metadata addresses `169.254.169.254` and `fd00:ec2::254`, including IPv4/IPv6 equivalents.
5. Resolve the name at registration. Any answer in those ranges is `remote_address_rejected`, unless that origin is the test allow-list entry. `docs/backend/MILESTONE_1_READINESS.md` names `credentials_not_accepted` or `remote_address_rejected` for userinfo, non-https, link-local, and metadata addresses.
6. Do not follow a redirect that fails steps 2–5. Cap redirects. No cap number is given.
7. Persist scheme, host, port when it is not the default, and path. No userinfo and no query secrets. Which query keys are secrets is not defined.

`docs/backend/openapi.yaml` lists `unsupported_scheme` among stable codes and describes `remote_url` as a sanitized https URL with no userinfo. It does not say which failure uses `unsupported_scheme`.

The four registry URLs in `docs/backend/DECISIONS.md` are `https://github.com/facebook/react.git`, `https://github.com/kubernetes/kubernetes.git`, `https://github.com/torvalds/linux.git`, and `https://github.com/microsoft/vscode.git`.

Path boundaries, same deployment document:

1. An id is ASCII letters, digits, `_`, and `-`. Reject empty, `.`, `..`, and any id containing `/` or `\`.
2. Join that id onto the configured root. `SELENE_DATA_DIR` is an absolute path. This gate does not choose that directory.
3. Canonicalize with symlink evaluation.
4. The result must be the root, a separator, and the id. A prefix match is not enough: `/data/selene-evil` is not inside `/data/selene`.
5. Failure is `path_rejected`. Do not create the directory.
6. Public JSON and logs do not include the canonical path. Logs may use the id.

`config.json` and `workers.jsonl` are relative benchmark artifact names joined under `benchmarks/<run-id>/` “with the same checks.” Those names contain `.`, which the id alphabet rejects. That part was not implemented.

## Behavior implemented

`internal/remoteurl.Check` does not resolve names, follow redirects, or read an allow-list.

- `url.Parse` failure returns `invalid_remote_url`. The error text is only that code.
- A URL user is `credentials_not_accepted`, including when the host is also a rejected address. The error text does not contain the URL.
- Scheme other than `https`, an empty host, a query string, and a numeric port outside 1–65535 return `unresolved:<topic>`. That is not an API code. `https://example.com:65536/repo.git` parses in Go, so it is `unresolved:port`, not a parse failure.
- An IP literal that is loopback, private (`net.IP.IsPrivate`), link-local, or multicast, or equal to `169.254.169.254` or `fd00:ec2::254` after IPv4-mapped normalization, is `remote_address_rejected`.
- The four registry URLs pass. `https://8.8.8.8/repo.git` passes because a public IP literal is not in the reject list. `https://localhost/repo.git` also passes this function because the name is not resolved.

`internal/idpath.Check(root, id)` rejects a bad id, a relative root, or a root that cannot be canonicalized to a directory. It evaluates symlinks on the root. A missing child is accepted only when the lexical path is exactly the canonical root, a separator, and the id, and the directory is not created. An existing symlink is evaluated and must still be that same path. The error text is only `path_rejected`.

These functions are not called from HTTP. `GET /api/v1/repositories` is still unregistered.

## Accepted and rejected cases

Accepted by `remoteurl.Check`: the four `https://github.com/...` registry URLs, the same React URL with scheme `HTTPS`, `https://8.8.8.8/repo.git`, and `https://example.com:443/repo.git`.

Rejected with a named code:

| Input | Code |
| --- | --- |
| `https://super-secret-token@github.com/facebook/react.git`, `https://user:password@github.com/repo.git`, `https://@github.com/repo.git`, `http://token@127.0.0.1/repo.git`, `ssh://git@github.com/repo.git` | `credentials_not_accepted` |
| `%`, `:`, `https://example.com:abc/repo.git`, `https://example.com:-1/repo.git` | `invalid_remote_url` |
| `https://127.0.0.1/repo.git`, `https://127.0.0.2/repo.git`, `https://[::1]/repo.git`, `https://10.1.2.3/repo.git`, `https://172.16.0.1/repo.git`, `https://192.168.0.1/repo.git`, `https://[fc00::1]/repo.git`, `https://169.254.1.1/repo.git`, `https://169.254.169.254/latest/meta-data`, `https://[fd00:ec2::254]/`, `https://[fe80::1]/repo.git`, `https://224.0.0.1/repo.git`, `https://[ff02::1]/repo.git`, `https://[::ffff:10.1.2.3]/repo.git`, `https://[::ffff:169.254.169.254]/repo.git` | `remote_address_rejected` |

Not accepted, and not given a named code:

| Input | Topic |
| --- | --- |
| `http://github.com/facebook/react.git`, `ssh://github.com/repo.git`, `git://github.com/repo.git`, `file:///tmp/fixture.git`, `github.com/facebook/react.git`, `http://[::1]:99999/` | `scheme` |
| `https://example.com:0/repo.git`, `https://example.com:65536/repo.git` | `port` |
| `https:///repo.git` | `empty_host` |
| `https://github.com/repo.git?token=super-secret-token` | `query` |

Accepted ids under `t.TempDir`: `repo_react`, `A`, `a-b_c`, `node-a`. None of those directories were created.

Rejected ids, error `path_rejected`: empty, `.`, `..`, `../…`, `a/b`, `a\b`, `foo.bar`, `has space`, `ü`, `.hidden`. A relative root and a missing root are also `path_rejected`.

## Traversal and symlinks

Ran under `t.TempDir` on Linux:

- A symlink whose id is `alias` and whose target is a sibling `selene-evil` is `path_rejected`. The error does not contain `selene-evil`. The symlink is left in place and no directory is created for a rejected id.
- A symlink `link` to an outside directory `outside-marker` is `path_rejected`. The error does not contain `outside-marker`.
- A symlink `alias` that points at another directory inside the root is `path_rejected` because the canonical path is not root + separator + `alias`.
- When the configured root is itself a symlink to a real directory, `repo_react` is accepted and is not created in the real directory.
- An existing real directory named `repo_react` is accepted.

## What did not run

`remoteurl` and `idpath` do not import `os/exec` and do not call `LookupHost` or `LookupIP`. No Git command ran. No repository row was written. No migration ran. Tests did not touch a production data directory. No new HTTP route was registered.

## Commands

Working directory `/agent/selene`. `SELENE_DATABASE_URL` was `postgres://selene@127.0.0.1:5432/selene?sslmode=disable`. PostgreSQL 16.15 was already accepting connections.

| Command | Result |
| --- | --- |
| `gofmt -l .` | No files printed. Exit 0. |
| `go test -count=1 ./...` | `selene/cmd/selene` ok. `selene/internal/dbver` ok. `selene/internal/idpath` ok. `selene/internal/listen` ok. `selene/internal/remoteurl` ok. Exit 0. |
| `go vet ./...` | No findings. Exit 0. |
| `go build ./...` | Exit 0. |

`go test -count=1 ./...` included `TestMilestoneRoutesStillHold`: `GET /healthz` is 200 `up` with the request correlation id; `GET /api/v1/security` is still `not_enforced` with the six deferred fields; `GET /api/v1/repositories` is 404; `GET /readyz` with an empty URL or with `127.0.0.1:1` is 503 `not_ready`; `GET /readyz` with `SELENE_DATABASE_URL` is 200 `ready` and the database check is `up`.

## Unresolved

1. The stable code for a non-`https` scheme is not specified. `unsupported_scheme` is only named in the OpenAPI code list. The readiness sentence names `credentials_not_accepted` or `remote_address_rejected`, which are already defined for userinfo and addresses. No code was selected.
2. Empty host and a parsed port outside 1–65535 have no stable code. Port 0 and port 65536 are in that gap. A non-numeric port fails `url.Parse` and is `invalid_remote_url`.
3. The redirect cap has no number. Redirects are not followed.
4. The test flag name, the fixture root, and the one loopback HTTP origin are not specified. Step 3 also allows `ssh` and `git` on an origin allow-list, while the following paragraph only describes `file` under a fixture root and one loopback HTTP origin. The exception stays off. No allow-list entry was invented.
5. “Query secrets” are not defined, so a query is not sanitized and is not given a stable rejection code.
6. Registration-time DNS resolution is specified and was not done. This gate forbids network requests, and repository registration is out of scope. `Check` returning nil does not mean `https://localhost/repo.git` passed the DNS rule.
7. `0.0.0.0` and `::` are not named in the reject list. No extra ban was added.
8. Benchmark artifact names were not validated. `config.json` does not match the id alphabet, and the documents still say to use the same checks.

## Files changed

- `/agent/selene/internal/remoteurl/url.go`
- `/agent/selene/internal/remoteurl/url_test.go`
- `/agent/selene/internal/idpath/path.go`
- `/agent/selene/internal/idpath/path_test.go`
- `/agent/selene/cmd/selene/regression_test.go`

## Verdict

**BLOCKED.** Path checks and the named URL outcomes are in place. The scheme code, empty-host code, out-of-range port code, redirect cap, test allow-list, and query-secret rule are unspecified, so URL validation is not complete.
