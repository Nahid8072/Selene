---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Foundation Pack preservation

Documentation only. No Go source, tests, OpenAPI, database, frontend, Git, or network work was done. No validator implementation was started.

Verdict: **PASS**.

## Is this Foundation Pack source?

Yes. `docs/source/03_ARCHITECTURE.md` is `03 — Proposed Architecture` in the numbered Foundation Pack under `docs/source/`, next to `00_PROJECT_CHARTER.md` through `08_MILESTONES.md`. `docs/backend/DECISIONS.md` says backend decisions do not change the Foundation Pack under `docs/source/`.

## What D32 changed

The D32 gate replaced the suggested benchmark tree in “Storage layout (suggested)”. The only change was these two lines:

```text
    <run-id>/raw.jsonl
    <run-id>/summary.json
```

They were replaced with:

```text
    <run-id>/config.json
    <run-id>/workers.jsonl
    <run-id>/metrics.json
    <run-id>/summary.json
    <run-id>/README.md
```

No other line in that file was edited during D32.

## Restoration

Exact restoration was possible. The pre-change block was read from the file immediately before that edit. Those two lines were put back. The section again reads:

```text
  benchmarks/
    <run-id>/raw.jsonl
    <run-id>/summary.json
```

The five-file D32 policy stays in the normative Selene documents. It was not removed from `DECISIONS.md`, `BENCHMARK_AND_TELEMETRY.md`, `DEPLOYMENT_AND_SECURITY.md`, `STATE_MACHINES_AND_RECOVERY.md`, `MILESTONE_1_READINESS.md`, `backend-architecture.md`, or `project-context.md`.

## Decisions still accepted

D22, D23, and D24 remain Accepted. D25 through D32 remain Accepted, including D32’s allow-list: `config.json`, `workers.jsonl`, `metrics.json`, `summary.json`, and `README.md`.

## Files changed

- `docs/source/03_ARCHITECTURE.md` — benchmark sketch restored.
- `docs/backend/FOUNDATION_PACK_PRESERVATION_REPORT.md` — this report.

## Verdict

**PASS.** The Foundation Pack file is back to its pre-D32 text, and the current D32 policy remains in the normative backend documents.
