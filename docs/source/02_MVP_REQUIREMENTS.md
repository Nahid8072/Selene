# 02 — MVP Requirements

## Product principles

- Git-compatible, not Git-replacing.
- Self-hosted and reproducible.
- Correctness before performance.
- API/CLI first; frontend later.
- Real metrics only; no mock operational data in benchmark reports.
- Prefer Git-native mechanisms until measurement proves a custom mechanism is needed.

## Functional requirements

### FR-01 Repository registration

The system can register a repository by stable ID, display name, remote URL and default branch. The initial implementation may support public HTTPS repositories only. Credentials for private repositories are deferred until secret handling is designed.

Acceptance:
- Invalid or unsupported URLs are rejected with a useful error.
- Repository configuration persists across restart.
- Secrets are never written to logs.

### FR-02 Cache population

The system can create or refresh a node-local bare mirror for a registered repository. It records the source revision and last successful sync time.

Acceptance:
- Mirror initialization and refresh are idempotent.
- Concurrent refresh requests for one repository are serialized.
- A failed refresh does not mark the cache as healthy or replace the last-known-good state.

### FR-03 Workspace provisioning

The system can provision a workspace for a repository and an exact immutable commit SHA. Workspace creation uses a private Git repository metadata directory with read access to the shared cache object database through Git alternates (see ADR-001).

Acceptance:
- Each workspace has a unique directory and workspace ID.
- Workspace HEAD equals the requested commit at creation.
- A file change in workspace A is not visible in workspace B.
- Workspace-local commits and objects are written to that workspace's own object directory, not to the shared cache.
- Destroying a workspace does not delete shared cache objects.

### FR-04 Workspace lifecycle

Track states: `requested`, `provisioning`, `ready`, `failed`, `stopping`, `stopped`, `destroying`, `destroyed`.

Acceptance:
- State transitions are validated.
- Failures record a stable error code and safe diagnostic message.
- A workspace cannot be destroyed twice with inconsistent metadata.

### FR-05 Basic repository APIs

Expose API operations for health, repository list/register/detail/sync, cache status and workspace create/list/detail/destroy.

Acceptance:
- API schemas are documented.
- Invalid inputs return appropriate 4xx status codes.
- Long-running operations return job/workspace IDs rather than blocking indefinitely.

### FR-06 Workload simulator

A separate test utility can launch concurrent workspace or clone jobs against a pinned repository revision with configurable agent count and request overlap.

Acceptance:
- Seed, concurrency, repository, commit and scenario are recorded.
- Each worker has a unique workspace ID.
- Workload results are machine-readable JSON.

### FR-07 Benchmark runner

Run comparable baseline and AgentScale trials and save raw measurements and configuration.

Acceptance:
- Cold-cache and warm-cache trials are distinguished.
- Baseline and candidate use the same repository commit and equivalent workspace scope.
- Results include failed operations; failures are not silently dropped.
- A report can be regenerated from raw result files.

### FR-08 Observability

Record structured events and operational metrics for repository sync, cache population, workspace provisioning and benchmark execution.

Acceptance:
- Every operation has a correlation/request ID.
- Logs do not expose tokens or private URLs containing credentials.
- Metrics have units and documented definitions.

## Non-functional requirements

- Go code is formatted and lintable.
- Git commands are invoked without shell interpolation (`exec.CommandContext` with argument arrays).
- All external operations have timeouts/cancellation.
- Filesystem paths are rooted under configured data/workspace directories and checked against traversal.
- A failed operation leaves recoverable state.
- Tests use temporary directories and local test repositories; normal unit tests do not depend on the public internet.
- Benchmark tests are opt-in and separate from fast unit tests.
- The service must shut down gracefully and release locks/leases.

## Explicitly deferred

Private repository credentials, push/merge orchestration, distributed cache, multi-tenant SaaS, Kubernetes, AI-based cache prediction, frontend and native virtual filesystem.
