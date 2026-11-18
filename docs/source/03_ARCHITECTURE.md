# 03 — Proposed Architecture

## MVP architecture

```text
                 CLI / workload simulator
                           |
                           v
                  Go Control Plane API
                 /         |          \
                /          |           \
       PostgreSQL     Repo Manager   Workspace Manager
          |                |              |
          |                v              v
          |         Git bare mirror   Private workspace clone
          |         per repository   + Git alternates reference
          |                |              |
          +---- metadata   +------ read-only shared objects
                           |
                           v
                    Upstream Git remote

          Benchmark runner -> raw JSON/CSV -> report analysis
```

The frontend is intentionally absent from this architecture phase. The CLI and API are sufficient to operate and test the system until the core workflows stabilize.

## Components and ownership

### 1. Go Control Plane

Responsibilities:
- HTTP API and request validation.
- Repository and workspace lifecycle orchestration.
- Git process invocation and timeout handling.
- Per-repository operation serialization for the single-process MVP.
- Persistence of metadata and operation state.
- Structured logs and health endpoints.

Non-responsibilities:
- Parsing or reimplementing the Git object format.
- Storing Git blobs in PostgreSQL.
- Acting as a general-purpose shell execution service.

### 2. Git Cache Manager

Initial implementation: a bare Git mirror stored under a stable data directory, one mirror per repository.

Responsibilities:
- Initialize mirror from upstream.
- Fetch updates into mirror.
- Record refs and a pinned commit SHA.
- Provide a stable, read-only object source for workspace clones.
- Prevent deletion/maintenance while dependent workspaces hold leases.

A future Rust data-plane service is possible only if profiling identifies a hot path that is not adequately handled by Git or the Go orchestrator.

### 3. Workspace Manager

Initial implementation: private clone per workspace that references the shared bare mirror's object database using Git's `--shared`/alternates mechanism. Workspace metadata and writable objects remain private to the workspace.

Important lifecycle:
1. Resolve and validate an exact commit SHA.
2. Acquire a cache lease for the repository.
3. Create a workspace directory under the configured workspace root.
4. Clone locally from the bare mirror using a shared object alternate.
5. Checkout the pinned commit.
6. Verify `HEAD` equals the requested SHA.
7. Mark workspace ready and retain the cache lease.
8. On destroy, remove workspace metadata/directory and release the lease.

Do not let workspace clones push to or mutate the cache mirror. The workspace's `origin` configuration should be set deliberately; push support is outside the MVP.

### 4. Metadata database

PostgreSQL stores control-plane metadata only, not Git object contents.

Suggested initial records:
- repositories
- cache_entries
- workspaces
- operation_events
- benchmark_runs
- benchmark_trials

Use migrations from the first database-backed milestone. Add indexes for repository ID, workspace ID, status and created time.

### 5. Workload and benchmark tools

A separate Python or Go command-line utility launches controlled concurrent operations. It must not be coupled to the frontend.

It records:
- scenario ID and random seed
- repository URL/ID and pinned commit
- baseline/candidate mode
- concurrency and overlap profile
- trial start/end timestamps
- per-worker outcome and duration
- upstream network bytes where measurable
- resource observations

## Key request flow: warm cache and provision workspaces

1. User registers repository.
2. Control plane validates the URL and creates repository metadata.
3. Cache manager creates a bare mirror and fetches upstream objects.
4. Control plane records cache state and resolved commit SHA.
5. Workspace request specifies repository ID and immutable commit SHA.
6. Workspace manager acquires a cache lease and creates a private clone referencing the cache object database.
7. Workspace manager checks out commit, verifies HEAD and returns workspace details.
8. Workspace operates in an isolated path; its writes do not modify the cache mirror.
9. Workspace destruction releases the lease.

## Locking and concurrency in MVP

- Use an in-process keyed lock per repository for mirror initialization/refresh and cache maintenance.
- Use a separate workspace ID for every workspace creation.
- Do not run cache prune/GC while any active workspace uses the cache.
- Do not claim multi-process or multi-host safety in the MVP. Document the single-control-plane-process limitation.
- Before adding multiple control-plane replicas, replace in-memory locking with database-backed leases/advisory locks or another explicit distributed coordination design.

## Storage layout (suggested)

```text
AGENTSCALE_DATA_DIR/
  repos/
    <repository-id>.git/       # bare mirror/cache; managed only by AgentScale
  workspaces/
    <workspace-id>/            # private workspace clone
  benchmarks/
    <run-id>/raw.jsonl
    <run-id>/summary.json
  tmp/
```

Paths must be configurable and stable. Git alternates contain paths to the shared object database; moving the cache directory can break workspaces. Do not silently relocate cache paths while workspaces exist.

## Failure domains

- Upstream Git remote failure: existing cache remains available for pinned commits; sync status becomes degraded/failed.
- Cache mirror unavailable: new workspaces fail clearly; already-created workspaces may continue if their alternates path remains available.
- Workspace provisioning failure: clean up partial directories and release leases.
- Database failure: do not report successful state transitions that were not persisted.
- Cache disk full: stop new cache population/workspace creation safely; do not delete live objects as an emergency shortcut.
