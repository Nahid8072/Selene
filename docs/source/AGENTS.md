# AGENTS.md — Instructions for Codex, Cursor and other coding agents

## Role

You are implementing AgentScale, a university research prototype for Git-compatible repository caching and concurrent workspace provisioning. Follow the project charter and current milestone. Do not independently expand scope.

## Mandatory reading

Before coding, read:
- `00_PROJECT_CHARTER.md`
- `02_MVP_REQUIREMENTS.md`
- `03_ARCHITECTURE.md`
- `04_ADR-001_GIT_NATIVE_CACHE.md`
- `06_CORRECTNESS_SECURITY_AND_FAILURES.md`
- `07_BENCHMARK_PROTOCOL.md`
- `08_MILESTONES.md`

If a document conflicts with an existing code invariant, stop and report the conflict instead of guessing.

## Milestone discipline

- Work only on the milestone named in the task prompt.
- Do not start frontend work unless the user explicitly opens that milestone.
- Do not implement distributed cache, Kubernetes, LLM features or a custom VCS protocol in the MVP.
- Do not change accepted architecture decisions without proposing an ADR first.
- Do not add dependencies without explaining why they are needed.
- Prefer small, reviewable changes over large rewrites.

## Engineering rules

- Inspect the repository before editing. Preserve existing code and user changes.
- Never delete, reset, overwrite or reformat unrelated files.
- Use Go `context.Context` and deadlines for subprocesses and network calls.
- Invoke Git with argument arrays; never construct shell command strings from user-controlled input.
- Validate repository URLs, commit SHAs and filesystem paths.
- Keep Git blobs/trees/commits in Git object storage; do not store them in PostgreSQL.
- Treat the cache mirror as AgentScale-managed and read-only to workspace processes.
- Use pinned commit SHAs for workspace creation.
- Track cache leases; do not prune or GC cache objects while dependent workspaces exist.
- Keep workspace writable metadata/object storage separate from shared cache storage.
- Redact secrets and credential-bearing URLs from logs and errors.
- No fake operational metrics, synthetic cache hit counts or hardcoded benchmark improvements.
- Test failures and cleanup paths, not only happy paths.

## Test requirements

For each code change:
1. Add or update unit tests.
2. Add integration tests when Git or filesystem behavior changes.
3. Run formatter and linter if configured.
4. Run focused tests, then the full test suite when practical.
5. Report exact commands and outcomes.

Benchmark tests must be opt-in and must record raw output. Never make unit tests depend on a live public Git server.

## Git and repository safety

- Do not execute destructive Git operations (`reset --hard`, `clean -xfd`, force-push, branch deletion) unless the user explicitly requests them and the target is verified.
- Do not modify a user's existing branches or commits.
- Before committing, show the changed-file list and test results; do not commit unless requested.

## Required response after each task

Report:
1. What changed.
2. Files added/modified.
3. Commands and tests run, with pass/fail.
4. Remaining risks or limitations.
5. Whether the milestone exit gate is met.
6. The smallest recommended next task.

If requirements are ambiguous or the codebase contradicts the docs, ask one focused question or present options. Do not silently invent behavior.
