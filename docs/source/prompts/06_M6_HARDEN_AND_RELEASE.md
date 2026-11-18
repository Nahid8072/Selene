# Prompt 06 — M6: Hardening, documentation and showcase release

Read all foundation documents and prior milestone reports.

Implement **only Milestone M6**.

Requirements:
1. Run the full unit and integration suite.
2. Add/complete tests for correctness, workspace isolation, cache lease safety, interrupted operations, upstream outage, disk-full simulation where practical, path traversal, invalid URLs and log redaction.
3. Add restart reconciliation for persisted workspaces/cache state. Do not delete unknown paths automatically.
4. Verify clean startup/shutdown and migration behavior.
5. Document single-host limitations and explicitly deferred capabilities.
6. Write a clean-install quickstart for a developer with Git, Go, Docker and Python.
7. Prepare a 5–7 minute demonstration script using a pinned repository and reproducible workload.
8. Prepare a recorded fallback plan and ensure demo mode labels prerecorded results honestly.
9. Archive benchmark configuration, raw results and generated report.
10. Create a release checklist; do not create a Git tag or commit unless the user explicitly asks.

Constraints:
- Do not add frontend code in this milestone unless separately requested.
- Do not overstate production readiness.
- No unverified performance claims.

At completion, report whether every M6 exit criterion is satisfied and list all known limitations.
