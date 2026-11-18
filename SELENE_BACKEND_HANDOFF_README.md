# Selene backend handoff pack

This folder is intended to be merged into the root of the existing Selene frontend repository. It contains project context, the original Foundation Pack, the accepted backend contract, historical decision-gate reports, and staged implementation prompts.

## Quick install

1. Extract this archive.
2. Copy `AGENTS.md`, `PROJECT_CONTEXT.md`, `SELENE_BACKEND_HANDOFF_README.md`, `docs/`, and `prompts/` into the root of your existing Selene repository. Merge folders; do not delete/replace the frontend's files.
3. If `AGENTS.md`, `docs/`, or `prompts/` already exists, merge their contents carefully instead of overwriting unrelated work.
4. Review `PROJECT_CONTEXT.md` and `docs/backend/MILESTONE_1_READINESS.md`.
5. Start with `prompts/backend/00_REPOSITORY_INSPECTION.md`. It is read-only. Then authorize one implementation milestone at a time.
6. Commit the documentation as its own Git commit after reviewing `git status`.

## Important source-of-truth order

- `docs/backend/DECISIONS.md` is the current consolidated decision register (D1–D44).
- `docs/backend/POLICY_SUPPLEMENT_D25_D44.md` is the focused current security and registration supplement.
- `docs/backend/openapi.yaml` is the OpenAPI baseline updated in this handoff for D39–D44 registration errors, strict create fields, and precedence.
- `docs/backend/DATABASE_SCHEMA_AND_INVARIANTS.md`, `STATE_MACHINES_AND_RECOVERY.md`, `DEPLOYMENT_AND_SECURITY.md`, and `BENCHMARK_AND_TELEMETRY.md` are normative supporting documents. Read them together.
- `docs/source/` is the original Foundation Pack archive and is intentionally preserved unchanged, including historical AgentScale naming from before the project was renamed Selene. Do not rewrite it to match later decisions.
- `docs/backend/gate-reports/` contains historical reports. A historical PASS proves a prior environment passed at that time; it does not prove the source code still exists. Rebuild and rerun tests in this repository.

## Rebuild order

Do not start with repository registration on an empty backend. Rebuild Milestone 1 first, then Security Read, then URL/path validators, then repository registration. See `MILESTONE_1_READINESS.md` and prompts.

## Existing frontend

The frontend is not included in this archive because the user has already pushed it to GitHub. Do not replace it with the older frontend archive or regenerate it. Keep operational confirms disabled under D24.
