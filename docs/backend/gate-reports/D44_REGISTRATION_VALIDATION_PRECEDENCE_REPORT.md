---
cursor:
  subagentId: "bc-528206bf-b49c-5c0c-96aa-2718ed75a712"
---

# D44 registration validation precedence

Documentation only. `POST /api/v1/repositories` was not implemented.

Verdict: **PASS**.

D44 is Accepted. It is first-failure-wins for `POST /api/v1/repositories`. One code is returned. Later stages are not inspected to choose a different code. Errors are not aggregated.

## Sequence

1. **Parse.** An empty body, malformed JSON, a top-level non-object including `null`, or a repeated property is `400` `invalid_request_body`. This is before key classification.
2. **Credential keys.** `access_token`, `credential`, and `authorization` are `400` `credentials_not_accepted`. This keeps D43: those keys are classified before unknown keys.
3. **Unknown keys.** The only exact case-sensitive keys are `name`, `remote_url`, `provider`, and `default_branch`. Any other key, including `id` and case variants such as `Name`, is `400` `unknown_field`.
4. **Types and provider.** A wrong JSON type, or an explicit `provider` that is `null` or not a string, is `400` `invalid_request_body`. An unsupported provider string is `400` `invalid_provider`. A wrong type is reported before that unsupported string. An omitted provider does not fail. D34 still selects the stored provider from the host, and only after `remote_url` has passed stage 5. Stage 4 does not parse the URL to choose an error.
5. **Fields.** `name` under D37 is `400` `invalid_repository_name`. Then `default_branch` under D37 is `400` `invalid_default_branch`. Then `remote_url` under D25 and D26. D25’s first-match order is unchanged: parse failure, userinfo, a non-HTTPS scheme outside the D27 exceptions, an empty host, a port outside 1–65535, a rejected IP address, any query, then a sixth redirect. An earlier field wins. This stage does not resolve a hostname. Registration does not fetch, and D36 does not follow a redirect to decide the stored URL.
6. **Storage.** D42 validates the data directory and mirror containment and does not change the filesystem. A missing, unsafe, or invalid `SELENE_DATA_DIR` configuration is `500` `storage_path_unavailable`. The data-directory check is first and runs before DNS. A mirror-containment failure stays `path_rejected`. D44 does not swap those codes.
7. **DNS.** D35 and D38 are unchanged, and DNS runs only after stages 1–6 pass. An IP literal is classified in stage 5 and is not looked up. A hostname uses a child of the request context with a 5-second cap. An earlier parent deadline wins. A prohibited address is `400` `remote_address_rejected`. NXDOMAIN or no usable address is `400` `remote_unresolvable`. A timeout, cancellation, a temporary failure, or an unsafe result is `503` `dns_resolution_failed`.
8. **Transaction.** The repository row, the empty cache entry, and the `repository_registered` event are inserted together only after every earlier stage passes. Commit returns `201`. Only `repositories_remote_url_key` returns `409` `repository_already_registered`. Any other database or transaction failure returns `500` `not_persisted` and rolls back all three rows. No preflight lookup is added. The unique constraint remains the race safeguard.

## Examples

| Request | Response |
| --- | --- |
| Malformed JSON, plus anything later | `400` `invalid_request_body` |
| A repeated key, plus a credential key | `400` `invalid_request_body` |
| A credential key, plus an ordinary unknown key | `400` `credentials_not_accepted` |
| An unknown key, plus a wrong JSON type | `400` `unknown_field` |
| A wrong JSON type, plus an unsupported provider string | `400` `invalid_request_body` |
| An invalid name, plus an invalid branch | `400` `invalid_repository_name` |
| An invalid name, plus an invalid URL | `400` `invalid_repository_name` |
| An invalid branch, plus an invalid URL | `400` `invalid_default_branch` |
| An invalid URL, plus unavailable storage | The existing D25 first-match code for that URL, not `storage_path_unavailable` |
| Unavailable storage, plus a DNS failure | `500` `storage_path_unavailable` |
| A DNS failure, plus a duplicate URL | `503` `dns_resolution_failed` |
| A request that passes stages 1–7, plus a duplicate remote | `409` `repository_already_registered` |

A stage-7 prohibited address (`400` `remote_address_rejected`) or unresolvable name (`400` `remote_unresolvable`) also wins over a duplicate remote. The duplicate is not consulted until the insert.

## Documents updated

| File | Change |
| --- | --- |
| `/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/DECISIONS.md` | D44 row, precedence section, and examples. The waiting note now includes D44 and still does not choose the attributes size. |
| `/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/DEPLOYMENT_AND_SECURITY.md` | Body-key order, storage before DNS, DNS only after earlier stages, and registration does not fetch. The URL table now matches D25: rejected IP literal, then query. |
| `/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/STATE_MACHINES_AND_RECOVERY.md` | Registration returns the first failure in the D44 order. |
| `/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/FOUNDATION_COMPATIBILITY.md` | Pack row for the registration check order. |
| `/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/openapi.yaml` | POST description, `RepositoryCreate`, and the error-code note name D44. The file parses as YAML. |
| `/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend-architecture.md` | D44 row, Accepted. |
| `/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/MILESTONE_1_READINESS.md` | Accepted list is D25–D44. The route stays outside Milestone 1. |

`/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/DATABASE_SCHEMA_AND_INVARIANTS.md` was inspected and not edited. Its register cell is the set of checks that must pass before commit. It is not a failure order. The prior gap report already said that list does not choose a winner.

## D22–D43

D22 through D43 remain Accepted. Their decision text was not rewritten. Their codes and HTTP statuses were not changed.

D43 still puts credential keys before unknown keys. D44 puts a repeated key before those credential keys. D43 already maps a repeated key to `invalid_request_body` and does not say a credential key wins over it.

D25’s URL table was not edited. Inside stage 5 its order is still parse, userinfo, scheme, empty host, port, rejected IP, query, sixth redirect.

## Conflicts

No accepted decision contradicted this order. Nothing was left BLOCKED.

`DEPLOYMENT_AND_SECURITY.md` previously listed a query before a prohibited IP literal. D25 lists the rejected IP first. That was a drift in the deployment table, not a second decision. The table was aligned to D25. The D25 section was not rewritten.

The attributes size is still not chosen. D44 does not choose it.

`/cursor/stores/bc-b0aaa365-7121-40bc-b098-90a4bab9e99f/docs/backend/REPOSITORY_REGISTRATION_POLICY_GAP_CLOSURE_REPORT.md` still says the cross-check order is open. That report was not rewritten. D44 closes the question it recorded.

## Forbidden changes

No Go, handlers, routes, tests, migrations, or schema changes. No database data was accessed or written. No DNS, network, or Git command ran. No directory was created. The frontend was not changed. `docs/source/` was not edited. Historical reports were not rewritten. The attributes size was not decided. `POST /api/v1/repositories` was not implemented.

## Verdict

**PASS.** D44 is Accepted. Implementation stops here.
