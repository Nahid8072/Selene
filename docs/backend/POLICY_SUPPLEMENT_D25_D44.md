# Selene backend policy supplement — D25–D44

Status: **D25–D44 Accepted**. This is a portable consolidation of the accepted decisions and their gate reports. The current decision register is `DECISIONS.md`; this file is a concise focused reference for security and repository registration implementation.

## URL, DNS, and paths (D25–D32)

- Production remote URLs are HTTPS only. Reject URL userinfo, any query (including a bare `?`), empty host, ports outside 1–65535, and prohibited addresses. Do not expose URL, credentials, tokens, or filesystem paths in logs/errors.
- Stable D25 mapping: userinfo → `credentials_not_accepted`; unsupported scheme → `unsupported_scheme`; malformed URL/empty host/invalid port/query → `invalid_remote_url`; prohibited IP → `remote_address_rejected`; sixth redirect → `redirect_limit_exceeded`; invalid IDs/artifact path → `path_rejected`.
- Store normalized scheme, lowercased host, non-default port, and path. Omit HTTPS port 443. Preserve path case, `.git`, and trailing slash. Fragments are not stored.
- Only injected test configurations may permit `file:` URLs contained in the test fixture root or exact `http://127.0.0.1:18080`. Production allow-list is empty. No `ssh` or `git` scheme.
- Follow at most five redirects; revalidate each target. Never follow the sixth.
- Resolve hostnames during registration and again before Git. Reject the complete answer if any address is prohibited, including mixed public/prohibited results. Prohibited classes include loopback, private, link-local, multicast, unspecified, IPv4 metadata `169.254.169.254`, and `fd00:ec2::254`, after IPv4-mapped IPv6 normalization.
- Registration-time DNS plus a second lookup does not prevent rebinding. Before Git connects, confine the actual destination to the validated IP set while retaining hostname-based TLS verification/SNI, or use an equivalent controlled proxy/network restriction.
- IDs are ASCII letters/digits/underscore/hyphen only; reject empty, `.`, `..`, `/`, `\\`. Resolve roots canonically and enforce exact child containment with symlink safety; no prefix matching and no directory creation.
- Artifact basenames directly under `benchmarks/<run-id>/` are exactly `config.json`, `workers.jsonl`, `metrics.json`, `summary.json`, `README.md`.

## Repository registration (D33–D44)

- Repository ID: server-generated lowercase hyphenated UUIDv4. Create body does not accept `id`.
- Provider: explicit valid value is preserved; otherwise exact `github.com` → `github`, exact `gitlab.com` → `gitlab`, everything else → `other`. Never infer `self_hosted`.
- DNS: no lookup for IP literals. For a hostname use `context.WithTimeout(r.Context(), 5*time.Second)` equivalent. The five seconds is a maximum; earlier parent cancellation/deadline wins. No application retry/cache. Prohibited address → `400 remote_address_rejected`; NXDOMAIN/no usable addresses → `400 remote_unresolvable`; timeout/cancel/temporary/unsafe-to-prove → `503 dns_resolution_failed`. Nothing persists on these failures.
- Duplicate identity is the sanitized D26 URL. Only the existing named `repositories_remote_url_key` conflict maps to `409 repository_already_registered`.
- Name: trim Unicode surrounding whitespace; 1–128 Unicode code points; reject Unicode control chars; preserve remaining characters. `400 invalid_repository_name`.
- Branch: nonempty Git short ref per `git check-ref-format`; preserve the original, no remote branch lookup and no artificial 255-byte limit. `400 invalid_default_branch`.
- Request body: malformed/empty/non-object/duplicate JSON key or wrong JSON field type → `400 invalid_request_body`; provider string outside `github`, `gitlab`, `self_hosted`, `other` → `400 invalid_provider`.
- Strict exact JSON keys: `name`, `remote_url`, `provider`, `default_branch`. Credential keys `access_token`, `credential`, `authorization` are checked before general unknown keys and return `400 credentials_not_accepted`. Other unknown keys, including `id` and case variants, return `400 unknown_field`.
- D44 precedence: parse → credential keys → unknown keys → types/provider → name → branch → remote URL → storage → DNS → transaction. First failure only.
- Storage: explicit `SELENE_DATA_DIR` must be nonempty, absolute, an existing safe directory. Mirror root `SELENE_DATA_DIR/repos`; path leaf `<repository-id>.git`. `repos/` may be absent. Validate any existing directory or leaf for canonical containment/symlink escape. Registration creates nothing. Missing/unsafe data root → `500 storage_path_unavailable`; containment → `path_rejected`.
- Atomic insert includes repository row, empty cache entry (`state=empty`, `lease_count=0`), and `repository_registered` event with its own UUIDv4 and `{}` attributes. Return `201` only after commit. Roll back all three on failure. Specific remote unique constraint → `409 repository_already_registered`; all other persistence errors → `500 not_persisted`.

The `operation_events.attributes` size bound is still pending. The registration event uses `{}` and does not depend on choosing a general bound.
