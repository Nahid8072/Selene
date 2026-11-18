# Prompt 02 — M2: Node-local Git mirror/cache manager

Read `AGENTS.md`, `03_ARCHITECTURE.md`, `04_ADR-001_GIT_NATIVE_CACHE.md` and `06_CORRECTNESS_SECURITY_AND_FAILURES.md`.

Implement **only Milestone M2**: a node-local Git bare mirror/cache manager. Reuse the baseline harness from M1 for later measurement.

Requirements:
1. Define a repository/cache manager interface and a Git-backed implementation.
2. Initialize one bare mirror per repository under the configured data root.
3. Support sync/fetch from an allowed remote and record the last successfully resolved revision.
4. Make initialization and refresh idempotent.
5. Serialize concurrent initialize/sync operations for the same repository in the single-process MVP.
6. Detect and report cache states: empty, warming, ready, degraded, error.
7. Record object format and measurable repository disk usage/object count where Git provides it.
8. Ensure a failed fetch does not overwrite last-known-good metadata.
9. Disable or explicitly control automatic maintenance on managed mirrors for the MVP. Do not run GC/prune as part of normal sync.
10. Add tests for first initialization, repeated sync, parallel sync requests, unreachable remote, invalid repository and interrupted operation.

Constraints:
- No workspace provisioning yet.
- No custom object format or Rust data plane.
- No arbitrary shell execution.
- Do not run garbage collection while cache leases are not yet implemented; safest behavior in this milestone is not to expose pruning at all.
- Tests must use local temporary bare repositories.

At completion, document cache directory layout, lock behavior, failure recovery and the exact tests executed.
