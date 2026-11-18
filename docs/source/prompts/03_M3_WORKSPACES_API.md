# Prompt 03 — M3: Isolated workspaces and API/CLI

Read `AGENTS.md`, `03_ARCHITECTURE.md`, `04_ADR-001_GIT_NATIVE_CACHE.md`, `05_DATA_MODEL_AND_API.md` and `06_CORRECTNESS_SECURITY_AND_FAILURES.md`.

Implement **only Milestone M3**.

Requirements:
1. Add workspace persistence and lifecycle states.
2. Implement workspace creation from a registered repository and a full immutable commit SHA.
3. Use a private clone that reads shared immutable objects from the managed bare mirror via Git alternates/shared clone behavior. Verify the exact resulting HEAD.
4. Track a cache lease from successful acquisition until confirmed workspace destruction.
5. Keep workspace writable Git metadata and newly created objects private to the workspace. Workspace processes must not write to the cache mirror.
6. Add safe cleanup for partial failures. Never release a lease if a workspace still exists or its dependency state is uncertain.
7. Reject cache deletion/maintenance while leases are active.
8. Add list/detail/destroy operations and API endpoints under `/api/v1`.
9. Add a basic CLI for repository registration/sync and workspace create/list/destroy.
10. Add path traversal checks, command timeouts, URL allow-list validation and secret redaction.
11. Add tests proving independent working trees, exact HEAD pinning, cache survival after workspace removal and lease safety.

Constraints:
- Do not implement push, merge queues or branch coordination.
- Do not expose unrestricted host paths.
- Do not add frontend code.
- Keep Git invocation argument-based, never shell interpolation.

At completion, provide curl/CLI examples and evidence from integration tests. Explicitly state any limitation of Git alternates and how the MVP protects the cache from pruning.
