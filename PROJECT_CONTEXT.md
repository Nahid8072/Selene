# Selene — project context for coding agents

## Project identity

Selene is an open-source, self-hostable, Git-compatible infrastructure layer for efficient repository access, shared Git object caching, and isolated workspace provisioning for concurrent AI coding agents. Git remains the source of truth; PostgreSQL stores control-plane metadata only. Selene is not a Git replacement and does not run an LLM/agent runtime in v1.

## Current repository status

- The user reports that the frontend source has been pushed to the private GitHub repository `farCyTHON/Selene`.
- The former Cloud Agent backend checkout was not recoverable. The Go module, migrations, backend tests, and database files were absent from the available machines. Do not claim an old backend exists based on old PASS reports.
- The project documentation and Foundation Pack were recovered and are included here.
- Rebuild backend code from scratch in the ordered milestones in `docs/backend/MILESTONE_1_READINESS.md`.
- Do not recreate or overwrite the frontend. Do not activate frontend confirm controls.

## Architecture and v1 boundaries

- One Go control-plane process on one Linux host (`node-a`), bound to `127.0.0.1` only while IAM is deferred.
- PostgreSQL 16 only, metadata only. Refuse other major versions.
- Git CLI/native repository format stores Git objects. Shared bare mirrors are immutable to workspace processes; workspaces are independent and writable, using Git alternates and leases.
- Python workload and benchmark tools call the Go HTTP API; they do not connect directly to PostgreSQL or write mirrors.
- No distributed cache, Kubernetes, second control-plane replica, custom VCS, Rust cache daemon, IAM, API keys, users/roles, email/webhooks, or LLM runtime in v1.
- `workloads` and `jobs` tables wait until the simulator milestone.
- The frontend remains on fixtures until later integration is explicitly approved. Fixture numbers are not real measurements and must never seed the database.

## Key correctness constraints

- `ready` workspace means provisioned and `HEAD` matches pinned full SHA; it does not mean an agent is running.
- Workspace provisioning requires a full commit SHA, not a branch name.
- `cache_leases.workspace_id` is the sole workspace-to-lease foreign key; do not add `workspaces.cache_lease_id`.
- `needs_reconciliation` is an operation status and workspace `error_code`, not a workspace status.
- No prune/GC while any lease is held.
- Failed workspace may retain an unreleased lease only when cleanup is pending and it still references the mirror; application layer checks filesystem references.
- Unknown measurements are null/unavailable, never invented zero values. Checkout time and workspace provisioning latency are distinct.
- Cache hit rate cannot be inferred from origin-fetched and locally reused object counts. Evictions are not counted in v1.
- `operation_events` is append-only. General `attributes` size remains a pending decision; repository registration event stores `{}`.
- No public response/log contains absolute host paths or credentials.

## Accepted policy

D1–D44 are recorded in `docs/backend/DECISIONS.md`. D25–D44 exact URL/path/DNS/repository-registration rules are also consolidated in `docs/backend/POLICY_SUPPLEMENT_D25_D44.md`. D44 controls repository registration error precedence.

## Implementation order after source loss

1. Read-only repository inspection; preserve the frontend.
2. Rebuild Milestone 1: PostgreSQL 16 schema and migration, Go loopback service, `/healthz`, `/readyz` only.
3. Security Read gate: `GET /api/v1/security` only.
4. Rebuild and test the D25–D32 URL/path validators.
5. Implement `POST /api/v1/repositories` under D22–D44.
6. Implement repository mirror refresh and safe outbound Git connectivity; actual Git destination must be confined to validated IPs with TLS/SNI/hostname preserved or equivalent controlled proxy.
7. Implement workspaces/leases/recovery, then datasets/configurations, benchmark execution, and telemetry as their respective gates permit.

Only one milestone per prompt. Each milestone needs tests, exact command results, a report, and explicit stop before the next milestone.
