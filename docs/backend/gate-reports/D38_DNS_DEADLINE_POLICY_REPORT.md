---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# D38 DNS deadline

Documentation only. No resolver, route, test, migration, Git, or network call was added. `docs/source/` was not edited. Historical gate reports were not edited.

Verdict: **PASS**.

## Decision

D38 is Accepted. It is new. It is not taken from `ReadHeaderTimeout` (5 seconds, header reads only), the 2-second PostgreSQL readiness ping, or the 2-second startup database check.

Repository-registration DNS has a 5-second maximum. The lookup context is derived from the incoming request context, equivalent to `context.WithTimeout(r.Context(), 5*time.Second)`. Five seconds is a cap, not a guaranteed run. If the parent context is already cancelled or has an earlier deadline, that earlier stop wins. The cap covers the whole application-level DNS resolution for that registration request. There is no application-level DNS retry and no DNS cache.

## Why this does not revise D35

D35 still classifies outcomes and still says the lookup must have a deadline, with no retry and no cache. It does not name the duration. D38 only supplies that duration and states which of D35’s existing outcomes a cancelled or timed-out lookup uses. UUID, provider, URL, duplicate-remote, name, and branch policy are unchanged.

## Mappings

| Outcome | Result |
| --- | --- |
| Any prohibited returned address, including one bad address in a mixed set | `400` `remote_address_rejected` |
| NXDOMAIN, or a successful result with no usable addresses | `400` `remote_unresolvable` |
| The 5-second cap, an earlier parent cancellation or deadline, a temporary resolver failure, or any other failure that cannot prove safety | `503` `dns_resolution_failed` |
| Direct IP literal | No DNS lookup. D26 classification only. |

Nothing is stored on these failures.

## Rebinding

Registration-time DNS, including this 5-second lookup, and another lookup before fetch do not by themselves stop DNS rebinding. Before Git connects, the destination must be confined to the validated address set, while TLS certificate checks, SNI, and the hostname stay in place. A controlled proxy or the same kind of network restriction is acceptable. That restriction is not implemented.

## Documents

| File | Change |
| --- | --- |
| `backend/DECISIONS.md` | D38 row and the registration DNS deadline section. D22–D37 text was not rewritten. |
| `backend/DEPLOYMENT_AND_SECURITY.md` | The 5-second cap and its source, next to the existing D35 outcomes. |
| `backend/STATE_MACHINES_AND_RECOVERY.md` | Registration lookup uses the D38 cap. A timeout or parent cancellation writes nothing. |
| `backend/FOUNDATION_COMPATIBILITY.md` | The pack names no lookup budget. D38 supplies it. |
| `backend-architecture.md` | D38 row. |
| `backend/MILESTONE_1_READINESS.md` | Accepted list includes D38. |

OpenAPI was left as it is. `503` `dns_resolution_failed` and `400` `remote_unresolvable` were already documented. A duration cap does not contradict those codes.

## Checks

D38 is Accepted. D22–D37 remain Accepted with the same decision text. The 5-second cap and the parent-wins rule are stated in `DECISIONS.md`. D35’s codes are the same codes D38 uses. Historical reports, including the blocked implementation report, were not rewritten. No code or data changed. The `operation_events.attributes` size is still pending.

## Verdict

**PASS.** D38 adds the missing registration DNS cap without changing D35’s outcome classes or D22–D37.
