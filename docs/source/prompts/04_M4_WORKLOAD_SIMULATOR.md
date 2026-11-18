# Prompt 04 — M4: Concurrent workload simulator

Read `AGENTS.md`, `07_BENCHMARK_PROTOCOL.md` and existing M1/M2/M3 implementation notes.

Implement **only Milestone M4**: a deterministic workload generator that can exercise both conventional Git and AgentScale through adapters.

Requirements:
1. Workload configuration includes dataset, pinned commit SHA, mode, concurrency, worker count, repetition count, random seed, workspace scope and timeout.
2. Add adapters for standard Git baseline and AgentScale workspace API/CLI.
3. Every worker must have a unique ID and isolated destination path.
4. Record worker-level start/end times, status, error code and mode as JSONL.
5. Support cancellation and bounded concurrency; never spawn unbounded goroutines/processes.
6. Ensure all workers are joined and all partial workspaces are cleaned safely after cancellation/failure.
7. Add deterministic synthetic workload profiles with configurable access overlap. If exact file access simulation is not yet supported, clearly label the current operation being simulated rather than claiming it represents model reasoning.
8. Add tests with local repositories and fake adapters where appropriate.

Constraints:
- No AI/LLM calls.
- No frontend.
- Do not fabricate cache hits or network bytes.
- Keep result schema versioned.

At completion, show one example workload configuration and one sample output record, then report test results.
