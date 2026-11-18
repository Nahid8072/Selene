---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Security read gate

Only `GET /api/v1/security` was added. The URL and path security tests gate, and every later gate, were not started. The frontend was not changed. Confirm controls were not enabled. Git was not initialized. PostgreSQL stayed 16.15. The database was not redesigned. D22, D23, and D24 remain Accepted.

Verdict: **PASS**.

## Contract

`openapi.yaml` `SecurityStatus` requires `enforcement`, `iam`, `api_keys`, `enterprise_credentials`, `email`, `webhooks`, and `correlation_id`. `enforcement` is only `not_enforced`. The other five are only `deferred`. The response header `X-Correlation-ID` echoes the request header. D13 stays Deferred: no login, API key, role check, email, or webhook sender.

The handler matches that document. No contract field was changed. The route does not declare an error response, so this gate did not add one.

## Implementation

`newMux` in `/agent/selene/cmd/selene/main.go` registers three routes:

- `GET /healthz`
- `GET /readyz`
- `GET /api/v1/security`

`security` does not open PostgreSQL, read the environment, or read credential headers. It writes the seven fields through the existing `writeJSON` helper, which sets `Content-Type: application/json` and `X-Correlation-ID` from `correlation_id`. A missing or longer-than-128-character request id still gets a generated id, which is the existing rule. `/healthz` and `/readyz` were not given new behavior.

## Exact response

Live `GET http://127.0.0.1:8080/api/v1/security` at 23:41 Asia/Dhaka, with `X-Correlation-ID: security-live`:

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Correlation-Id: security-live
```

```json
{"api_keys":"deferred","correlation_id":"security-live","email":"deferred","enforcement":"not_enforced","enterprise_credentials":"deferred","iam":"deferred","webhooks":"deferred"}
```

Key order is the existing JSON encoder’s map order. The fields are the OpenAPI set. A request with no correlation header returned a generated id in both the header and `correlation_id`: `f89034f3f7be82480103a340a0d9646a`. A request with `Authorization: Bearer not-a-real-credential` still returned 200 and the same document. The credential was not copied into the body.

## Tests

`go test -count=1 -v ./cmd/selene -run 'TestGetSecurity|TestOnlySecurity|TestGetHealthz'`:

```text
--- PASS: TestGetHealthz (0.00s)
--- PASS: TestGetSecurity (0.00s)
--- PASS: TestGetSecurityNeedsNoCredential (0.00s)
--- PASS: TestGetSecurityGeneratesCorrelationID (0.00s)
--- PASS: TestOnlySecurityApplicationRoute (0.00s)
```

Those checks cover HTTP 200, the seven schema fields and no extras, `enforcement` `not_enforced`, a matching `X-Correlation-ID`, success with no API key, and success when credential headers are present but unused. `GET /api/v1/repositories`, `/api/v1/workspaces`, `/api/v1/benchmarks`, `/api/v1/config`, `/api/v1/metrics`, and `/api/v1/security/keys` are 404. `/healthz` is still 200 `up`. `/readyz` with an empty database URL is still 503 `not_ready`.

## Commands

Working directory `/agent/selene`.

| Command | Result |
| --- | --- |
| `gofmt -l .` | No files printed. |
| `go test -count=1 ./...` | `selene/cmd/selene` ok. `selene/internal/dbver` ok. `selene/internal/listen` ok. Exit 0. |
| `go vet ./...` | No findings. Exit 0. |
| `go build -o /tmp/selene-audit ./cmd/selene` | Exit 0. |

## Live HTTP

The rebuilt process listens on `127.0.0.1:8080` only.

| Request | Result |
| --- | --- |
| `GET /api/v1/security` | 200, body above, `enforcement` `not_enforced` |
| `GET /healthz` | 200, `{"correlation_id":"healthz-live","status":"up"}` |
| `GET /readyz` | 200, `status` `ready`, database check `up` after a ping of PostgreSQL 16.15 |
| `GET /api/v1/repositories` | 404 `404 page not found` |

## Still disabled

Auth, authorization, IAM, users, roles, API keys, enterprise credentials, email, webhooks, and enforcement middleware are not implemented. The body says so: `not_enforced` and `deferred`. No secret, environment variable, or filesystem path is returned.

Repository register and sync, URL and path rejection, workspaces, benchmarks, workloads, metrics, eviction, and settings writes were not started.

## Pending decision

The size of `operation_events.attributes` is still pending. The schema document and OpenAPI do not give a number or an enforcement layer. No ceiling was chosen in this gate.

## Verdict

**PASS.** `GET /api/v1/security` matches the OpenAPI document, needs no credential, and is the only new application route.
