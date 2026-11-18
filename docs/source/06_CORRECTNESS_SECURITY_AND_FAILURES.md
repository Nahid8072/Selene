# 06 — Correctness, Security and Failure Rules

These rules are mandatory. Performance improvements do not compensate for silent repository corruption or cross-workspace leakage.

## Correctness invariants

1. Every workspace is pinned to an immutable full commit SHA.
2. Workspace A's working-tree edits are never visible in Workspace B.
3. Workspace-local Git writes go to the workspace's own object database.
4. Agent processes cannot modify or prune the shared cache mirror.
5. A cache object is never evicted while an active workspace lease may reference it.
6. A failed cache refresh does not mark the cache as successfully refreshed.
7. Workspace `HEAD` is verified after provisioning.
8. A workspace is not marked `ready` until all verification steps pass.
9. Cache maintenance is not run while workspace leases are active.
10. No benchmark result is reported as successful if a required worker failed or its measurements are missing; failures must be visible.

## Security rules

- Never execute user input through a shell string. Invoke Git with explicit argument arrays.
- Validate remote URL schemes. Initial MVP should allow only configured HTTPS remotes and local test fixtures; do not blindly fetch arbitrary user-supplied URLs.
- Prevent server-side request forgery: reject loopback, link-local, private and metadata-service addresses for untrusted remote URLs unless explicitly allow-listed for the local test environment.
- Do not store raw access tokens in repository metadata, logs, benchmark reports or command-line arguments.
- Private repository authentication is deferred until a credential-provider design is implemented.
- Keep cache and workspace roots configurable and canonicalize paths before use.
- Reject `..` path traversal and symlink escapes from configured roots.
- Run workload workers with least privilege. In the benchmark environment, do not mount unrelated host directories.
- Keep the shared cache volume read-only to workspace/agent processes.
- Do not expose internal cache paths or raw remote URLs in public API responses.
- Use timeouts and cancellation for all Git subprocesses.
- Limit repository size, workspace count and concurrent operations in the local service to avoid accidental resource exhaustion.

## Cache lifecycle / alternate safety

Git alternates mean a workspace may depend on an object directory outside its own repository. The source cache must remain available and retain referenced objects for the entire lifetime of the workspace.

MVP policy:
- Track a lease from workspace creation until successful destruction.
- Do not prune/GC cache objects while `lease_count > 0`.
- Do not expose a force-clear operation in the MVP.
- Do not automatically delete cache repositories based only on age.
- Keep object storage path stable.
- If cache state is uncertain, fail new workspace provisioning safely rather than serving an unverified cache.

## Failure handling

### Upstream unavailable

- Existing cached commit objects can still serve workspaces.
- New sync requests report failure/degraded state.
- Never overwrite last successful sync metadata with a failed attempt.

### Cache disk full

- Fail cache warming/workspace creation with a stable error.
- Keep existing cache data intact.
- Record free-space metrics and event.

### Git subprocess timeout

- Cancel process context.
- Record exit code/timeout.
- Clean partial workspace directories.
- Release acquired leases only after cleanup is confirmed or a recovery record is persisted.

### Control-plane restart

- On startup, reconcile workspace records with actual filesystem paths and Git metadata.
- Mark uncertain partial operations as `failed` or `needs_reconciliation`; do not assume success.
- Do not delete unknown directories automatically.

### Database unavailable

- Return service unavailable for state-changing API operations.
- Do not report success before the state transition is durably recorded.

## Required tests

- Two workspaces have independent working trees.
- Editing a file in one workspace does not change the other.
- Creating a workspace at a SHA yields that exact HEAD.
- A cache refresh does not invalidate existing workspaces.
- Cache cleanup is rejected while a lease exists.
- Failed clone/provision cleans partial paths and releases leases safely.
- Invalid URLs and path traversal are rejected.
- Logs and API errors redact secrets.
