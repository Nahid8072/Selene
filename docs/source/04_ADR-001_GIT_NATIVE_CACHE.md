# ADR-001 — Use Git-Native Bare Mirrors and Alternates for the MVP

- Status: Accepted for MVP; revisit after benchmark evidence.
- Date: 2026-11-04

## Context

AgentScale needs to demonstrate reuse of immutable repository objects between concurrent workspaces without immediately inventing a new object format or source-control protocol. Git already stores objects by content-derived object ID and exposes native mechanisms for partial clones, shared object databases and worktrees.

## Decision

For the first prototype:

1. Maintain one AgentScale-managed **bare mirror** per registered repository on the node.
2. Populate/update it using Git fetch operations.
3. Create one private clone per workspace from the local bare mirror using Git's shared-object/alternates mechanism (`git clone --shared` or equivalent plumbing, validated by tests).
4. Keep each workspace's refs, index, working tree and newly written objects private to that workspace.
5. Treat the bare mirror as immutable to workspace processes and do not run garbage collection/pruning while workspace leases exist.
6. Pin each workspace to an exact commit SHA, not a moving branch name.
7. Do not implement push, merge queue or cross-workspace branch coordination in the MVP.

The shared object source stays on a stable filesystem path. A workspace must not depend on a cache directory that can be moved or removed while the workspace exists.

## Why this decision

- Uses Git's native object format and semantics.
- Provides an understandable single-node shared object source.
- Gives each workspace separate writable Git metadata and working tree.
- Avoids building a custom CAS/object store before proving it is necessary.
- Makes the MVP feasible to test with public Git repositories and local test repositories.

## Critical caveat: alternates and garbage collection

Git shared clones rely on objects in the source repository. If the source repository removes objects that a dependent clone needs, the dependent clone can become corrupt. Therefore:

- Cache maintenance and object pruning must be lease-aware.
- The cache mirror must not be writable by agent processes.
- Disable or control automatic maintenance for the managed cache during the MVP.
- Do not provide a “clear cache” operation that deletes a cache with active workspace leases.
- Test that workspaces remain readable after upstream fetches and after unrelated workspace cleanup.
- Document that the MVP uses a single host and a controlled maintenance policy.

## Alternatives considered

### A. Independent full clone per agent

Simple baseline, but repeats upstream object transfer and object storage work. Keep as a benchmark baseline, not the optimized design.

### B. Git worktree for every agent

Worktrees share a repository and object database. They are efficient but share common repository metadata and object storage more directly. A private clone with alternates gives clearer per-workspace Git metadata and write areas for this prototype.

### C. Custom Rust content-addressed object store

Potentially useful later, but it increases implementation and correctness risk before profiling identifies a need. Defer.

### D. Full Scion-like VCS

Out of scope. It requires a new protocol/data model and migration of surrounding developer tools.

## Consequences

Positive:
- Git-compatible workspaces.
- Reduced repeated upstream transfer when the mirror is warm and requests overlap.
- Clear separation between shared immutable objects and workspace-local writes.

Negative / limitations:
- The cache is node-local, not distributed.
- Alternates create a lifecycle dependency on the cache mirror.
- Full repository mirror population can still be expensive; partial/sparse strategies need separate experiments.
- This design does not eliminate checkout file materialization time.

## Revisit when

- Benchmarks show clone/workspace setup is still dominated by local object lookup or checkout I/O.
- The project needs multi-node cache sharing.
- Disk-pressure experiments require object-level eviction rather than whole-repository retention.
- A custom data-plane component has a measured, profile-supported use case.
