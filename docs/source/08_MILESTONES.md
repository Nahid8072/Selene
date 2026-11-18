# 08 — Milestone Plan and Review Gates

Frontend development is deferred. Each milestone produces a runnable, testable backend or research artifact.

## M0 — Repository inspection and engineering contract

Goal: understand the current repository and establish a safe working baseline.

Tasks:
- Inspect files, language/runtime versions, existing code and tests.
- Identify existing project state; do not overwrite or restructure blindly.
- Confirm development OS/containers and available Git/Docker versions.
- Add/update root `AGENTS.md` and README links to the foundation docs.
- Propose target folder structure and exact next steps.

Exit gate:
- No product code added unless explicitly needed for repo hygiene.
- A written plan names current state, risks, missing tooling and first implementation tasks.
- Existing tests still pass.

## M1 — Reproducible Git baseline and workload harness

Goal: measure existing Git before optimizing it.

Tasks:
- Build a deterministic synthetic repository generator.
- Add dataset manifest format with pinned commit SHA.
- Implement standard Git clone/checkout scenario.
- Add concurrency control and worker-level result records.
- Add cold/warm test labels and environment metadata.
- Produce JSONL raw output and summary statistics.
- Add optimized Git baseline as a separate scenario after standard flow works.

Exit gate:
- Same scenario can be run twice with same inputs.
- Every worker result is recorded, including failure.
- Summary includes median and p95 latency.
- Baseline commands and environment are documented.

## M2 — Node-local Git mirror/cache manager

Goal: populate and safely reuse one bare mirror per repository.

Tasks:
- Implement mirror initialization and sync.
- Add repository lock and cache state transitions.
- Resolve/pin commit SHA.
- Implement cache metrics: disk size, sync duration, last synced revision.
- Add failure tests for unreachable upstream and interrupted fetch.
- Disable/guard dangerous automatic cache maintenance for the MVP.

Exit gate:
- Repeated warm operations reuse the existing mirror.
- Failed refresh leaves last known-good mirror usable.
- Concurrent initialization/sync for one repo is serialized.

## M3 — Isolated workspace provisioning and API/CLI

Goal: create multiple isolated workspaces backed by shared cached objects.

Tasks:
- Implement workspace lifecycle and lease tracking.
- Create private workspace clones using the shared object database.
- Pin workspace at exact commit SHA and verify HEAD.
- Implement workspace list/detail/destroy.
- Expose HTTP API and CLI.
- Add path validation, timeouts and safe cleanup.

Exit gate:
- At least 10 concurrent workspaces can be provisioned on the test machine (scale target is configurable, not a guaranteed hardware-independent number).
- Workspace edits are isolated.
- Shared cache survives workspace cleanup.
- Cache deletion/maintenance is blocked while leases exist.

## M4 — Concurrent workload simulator

Goal: generate repeatable repository access patterns for many workers.

Tasks:
- Configure concurrency, seed, overlap and operation type.
- Support baseline and AgentScale adapters.
- Capture worker outcomes and timings.
- Add cancellation and bounded resource limits.
- Add test scenarios for successful and failed workers.

Exit gate:
- Same workload specification can run against baseline and AgentScale.
- Worker counts, success counts and errors reconcile.

## M5 — Comparative benchmark and observability

Goal: deliver credible evidence.

Tasks:
- Add Docker/container resource measurements where available.
- Capture origin network I/O.
- Run cold and warm tests with at least two repositories.
- Generate CSV/JSON and charts from raw data.
- Document limitations and threats to validity.
- Add benchmark report export.

Exit gate:
- Results are reproducible from documented commands.
- Baseline comparison is fair and uses same commit/scope.
- No performance claims are made without raw evidence.

## M6 — Hardening and showcase release

Goal: create a stable, reproducible prototype for judges.

Tasks:
- Run correctness, isolation, path-security and failure-recovery tests.
- Test clean startup/shutdown and restart reconciliation.
- Add installation and troubleshooting documentation.
- Prepare 5–7 minute demonstration script and recorded fallback.
- Tag release and archive final benchmark data.

Exit gate:
- A fresh developer can run the demo from the README.
- All acceptance tests pass.
- Known limitations are documented.

## Deferred after showcase

- Multi-node and regional cache tiers.
- Rust data-plane/cache daemon if profiling justifies it.
- Predictive cache warming and ML policy experiments.
- Kubernetes deployment.
- Frontend control plane.
- Private repository auth and enterprise access control.
