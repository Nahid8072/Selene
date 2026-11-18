# AGENTS.md — Selene repository instructions

You are working in Selene, a university research prototype for Git-compatible repository caching and isolated workspace provisioning. Follow `PROJECT_CONTEXT.md`, `docs/backend/DECISIONS.md`, and the currently authorized milestone. Do not expand scope.

## Mandatory reading

Before backend coding, read:
- `PROJECT_CONTEXT.md`
- `docs/backend/DECISIONS.md`
- `docs/backend/POLICY_SUPPLEMENT_D25_D44.md`
- `docs/backend/openapi.yaml`
- `docs/backend/DATABASE_SCHEMA_AND_INVARIANTS.md`
- `docs/backend/STATE_MACHINES_AND_RECOVERY.md`
- `docs/backend/DEPLOYMENT_AND_SECURITY.md`
- `docs/backend/MILESTONE_1_READINESS.md`
- relevant documents under `docs/source/`

## Scope discipline

- Work only on the milestone explicitly named in the prompt.
- Do not proceed to the next milestone after reporting completion.
- Do not change accepted decisions without proposing a new decision/ADR.
- Do not implement the whole product in one pass.
- Do not modify the frontend or enable confirm controls unless explicitly authorized.
- Do not add workloads/jobs, IAM, API keys, Kubernetes, distributed cache, LLM runtime, custom VCS, or Rust cache daemon in v1.

## Engineering rules

- Inspect the repository before editing. Preserve user changes and frontend code.
- Never reset, clean, overwrite, or reformat unrelated files.
- Use context deadlines for network and subprocess work.
- Invoke Git with argument arrays, never shell-concatenate untrusted input.
- Validate URLs, IDs, commit SHAs, and filesystem paths.
- Git objects remain in Git; PostgreSQL stores metadata only.
- Shared bare mirrors are immutable to workspace processes.
- Use full commit SHAs for workspace provisioning.
- Do not prune/GC while any lease is held.
- Redact tokens, credentials, URLs with userinfo, and absolute paths from logs/errors.
- No synthetic metrics, fake cache hit rates, or fabricated benchmark improvements.
- Unknown measurements are null/unavailable, not zero.
- Respect D22–D44 exactly, including D44 first-failure-wins validation precedence.
- Do not invent a size limit for `operation_events.attributes`; the decision remains pending.

## Tests and completion evidence

For every code milestone:
1. Add/update focused unit tests.
2. Add integration tests for DB, Git, filesystem, and recovery behavior as appropriate.
3. Run gofmt, focused tests, full `go test ./...`, `go vet ./...`, and `go build ./...` where feasible.
4. State skipped checks and their reasons; never claim unrun checks passed.
5. Provide exact changed files, commands, outcomes, known limitations, and milestone verdict.
6. Do not commit or push unless the user explicitly asks.

If a real contract conflict remains, stop and report it. Do not silently invent policy.
