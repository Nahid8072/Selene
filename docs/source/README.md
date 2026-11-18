# AgentScale — Foundation Pack

This pack is the implementation contract for the AgentScale university project. Give the entire folder to Codex or Cursor as repository context, then execute **one milestone prompt at a time** from `prompts/`.

## What we are building

AgentScale is a self-hosted, Git-compatible repository access and workspace optimization layer for concurrent coding-agent workloads. The MVP keeps Git as the source of truth and investigates whether a node-local shared Git object cache plus isolated workspaces can reduce repeated upstream transfer and workspace setup cost.

**This is not a reimplementation of Anthropic's Scion.** It borrows selected principles from Anthropic's published case study while retaining Git compatibility and a much smaller scope.

## Read in this order

1. `00_PROJECT_CHARTER.md` — project goal, research question, non-goals.
2. `01_SCION_STUDY_AND_DESIGN_TRANSLATION.md` — what Anthropic disclosed and what AgentScale should/should not copy.
3. `02_MVP_REQUIREMENTS.md` — functional requirements and acceptance criteria.
4. `03_ARCHITECTURE.md` — component boundaries and request flows.
5. `04_ADR-001_GIT_NATIVE_CACHE.md` — the key architecture decision for the MVP.
6. `05_DATA_MODEL_AND_API.md` — initial entities and API contract.
7. `06_CORRECTNESS_SECURITY_AND_FAILURES.md` — invariants, safety rules and failure handling.
8. `07_BENCHMARK_PROTOCOL.md` — fair experiments and metrics.
9. `08_MILESTONES.md` — development sequence and review gates.
10. `AGENTS.md` — non-negotiable instructions for coding agents.
11. `prompts/` — copy-paste prompts for each stage.

## First action

Do **not** ask the coding agent to build the whole product. Start with `prompts/00_REPOSITORY_INSPECTION_AND_PLAN.md`. It should inspect the existing repository, identify its current state, and propose a minimal plan without implementing product code. Review that plan before proceeding to Milestone 0 or 1.

## Initial technical choices

- Go: control plane, API, CLI and Git process orchestration.
- Git CLI/native repository format: source of truth and object storage in the first prototype.
- PostgreSQL: durable control-plane metadata when the API becomes multi-session; SQLite is acceptable for a very early local spike if clearly isolated behind a repository interface.
- Python: workload generation and analysis scripts.
- Docker Compose: reproducible local test environment.
- Rust: deferred until a measured hot path justifies a dedicated data-plane component.
- React/TypeScript frontend: explicitly deferred until the backend workflow and metrics are real.

## Working agreement

- Work on one milestone at a time.
- Never fabricate metrics, benchmark outcomes, cache hits, or system health.
- Every feature needs automated tests and observable behavior.
- Preserve Git compatibility; do not invent a custom commit/object format for the MVP.
- Before changing architecture, write or update an ADR.
- After each milestone, report files changed, commands run, test results, known gaps and the next milestone recommendation.
