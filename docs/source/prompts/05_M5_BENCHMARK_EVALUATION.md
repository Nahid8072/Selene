# Prompt 05 — M5: Comparative benchmark and observability

Read `AGENTS.md`, `07_BENCHMARK_PROTOCOL.md` and all previous milestone outputs.

Implement **only Milestone M5**.

Requirements:
1. Run comparable standard Git, optimized Git (if supported) and AgentScale trials against the same pinned commit and equivalent materialized workspace scope.
2. Separate cold-cache population cost from workspace provisioning time; report both total batch cost and amortized per-workspace cost.
3. Capture latency, successful operations/second, failures and resource measurements.
4. If using Docker, capture origin-container network I/O and relevant worker/cache container CPU, memory and block I/O using supported Docker metrics. Record the measurement source and sampling interval.
5. If a metric cannot be measured reliably on the host, mark it unavailable; do not estimate it silently.
6. Run at least two public repositories at fixed SHAs plus the synthetic dataset where feasible.
7. Generate summary JSON and CSV from immutable raw JSONL data; include median, p95, trial count and failure counts.
8. Generate charts from raw results, not manually entered values.
9. Document threats to validity: OS page cache, Docker overhead, repository size, network locality, trial order and host contention.
10. Add tests for aggregation math, percentile handling, missing metrics and failed workers.

Constraints:
- Do not add a frontend.
- Do not claim a performance improvement unless the raw data supports it.
- Do not copy Anthropic's Scion performance numbers into AgentScale results.

At completion, produce a sample report with clearly marked actual measurements or clearly marked demonstration data, and explain how to reproduce it.
