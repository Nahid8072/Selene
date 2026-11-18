# Prompt 01 — M1: Reproducible Git baseline and workload harness

Read `AGENTS.md`, `02_MVP_REQUIREMENTS.md` and `07_BENCHMARK_PROTOCOL.md`.

Implement **only Milestone M1**: a reproducible baseline benchmark harness. Do not implement AgentScale cache or frontend yet.

Requirements:
1. Create a deterministic synthetic Git repository generator with configurable file count, file size, history depth, file-type mix and shared-path distribution. Use a fixed random seed.
2. Create a dataset manifest that records repository location, resolved commit SHA, generated parameters and creation time.
3. Implement a baseline worker that clones a pinned revision into a unique temporary workspace and checks out the required scope.
4. Support configurable concurrency, repetitions, timeout and workspace root.
5. Record one machine-readable JSONL result per worker, including start/end timestamps, duration, status, error code, repository ID, commit SHA and scenario parameters.
6. Generate a summary JSON containing worker counts, failures, median latency and p95 latency. Do not discard failures.
7. Add a CLI with help text and safe defaults. Benchmark execution must be explicit; normal unit tests must not run expensive benchmark workloads.
8. Add unit and integration tests using local temporary Git repositories only. Public network access must not be required for tests.
9. Document exact commands for generating a dataset and running a benchmark.

Optional after the standard clone path works: add a separate optimized-Git baseline using partial clone and sparse checkout, but only if the local test server supports filtering. Keep the mode distinct in result files.

Constraints:
- Do not implement API, database, cache, workspace manager or React UI in this milestone.
- Never invent bytes transferred or cache metrics.
- Use Go for the harness unless the existing repository already establishes a better compatible choice; explain the decision.
- Preserve all pre-existing files and user changes.

At completion, report exact test commands, sample output schema, limitations and whether the M1 exit gate is met.
