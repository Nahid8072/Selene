# 00 — Project Charter

## Project name

**AgentScale** — Git-compatible repository infrastructure for concurrent coding-agent workloads.

## One-sentence description

AgentScale is a self-hosted infrastructure layer that reduces repeated repository-data retrieval and workspace initialization for concurrent coding agents while keeping Git as the source of truth.

## Problem statement

As teams run more automated coding, CI and research jobs, many jobs may repeatedly access the same repositories and overlapping immutable Git objects. Independent clones and repeated workspace preparation can duplicate upstream data transfer, disk work and setup time. Existing Git features such as partial clone, sparse checkout and worktrees already address parts of this problem, so AgentScale must demonstrate measurable value beyond a correctly configured Git baseline.

## Research question

> Under controlled, concurrent repository workloads, can a Git-compatible shared object-cache and workspace-provisioning layer reduce upstream data transfer and workspace preparation time compared with conventional Git workflows, without violating repository correctness or workspace isolation?

## Hypotheses to test (not promises)

- H1: For repeated concurrent access to the same pinned repository revision, a warmed node-local shared cache will reduce bytes transferred from the upstream Git server compared with independent full clones.
- H2: Shared cached objects will reduce repeated object-download work across workspaces.
- H3: The benefit will increase with workload overlap and concurrency, but may be small for cold one-off jobs, small repositories or workloads with little overlap.
- H4: Any performance gain must not introduce missing-object, stale-revision, workspace-contamination or data-leakage failures.

These are hypotheses. Do not claim success until experiments support them.

## Target users

- AI-native engineering teams running multiple coding agents.
- CI systems repeatedly preparing the same repositories.
- Research teams launching parallel repository-analysis jobs.
- Platform engineers operating self-hosted development infrastructure.

## MVP product boundary

The MVP is a **single-host / single-cache-node prototype** with:

1. A Git repository registry.
2. A node-local bare mirror/cache per repository.
3. Isolated workspace clones that read immutable objects through Git alternates.
4. A Go control-plane API and CLI.
5. A concurrent workload generator.
6. A reproducible benchmark runner and report output.
7. Basic operational state, logs and metrics.

A multi-node cache hierarchy is a future extension, not a requirement for the showcase MVP.

## Non-goals for the university MVP

- Replacing Git or creating a new VCS protocol.
- Reimplementing commit, merge, rebase, blame or review semantics.
- Building a code review system, code search engine or CI platform.
- Running actual LLM agents or calling paid model APIs.
- Building a full enterprise IAM/SSO product.
- Kubernetes operator or multi-region deployment.
- AI/ML-based optimization before collecting trustworthy workload data.
- Frontend implementation before core workflows and benchmarks work.

## Definition of success

The project is showcase-ready when another developer can:

1. Start the stack from documented instructions.
2. Register or configure a public Git repository.
3. Warm or populate the node-local cache.
4. Provision multiple independent workspaces at a pinned commit.
5. Run the same workload against a conventional Git baseline and AgentScale.
6. Inspect measured latency, upstream network bytes, throughput, CPU/RAM and failures.
7. Verify that workspace modifications do not leak into other workspaces or corrupt the cache.
8. Re-run the experiment and obtain traceable raw results.

No fixed percentage improvement is a success criterion. Evidence and correctness are.
