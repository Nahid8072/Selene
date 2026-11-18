# 01 — Anthropic Scion: Study Notes and AgentScale Translation

## Source and naming

Primary source: Anthropic, **“Redesigning source control at Anthropic”**, published 13 October 2026 and updated 15 October 2026:
https://www.anthropic.com/research/redesigning-source-control

Use the term **Anthropic Scion** when referring to Anthropic's in-house version control system. There is also an unrelated Google Cloud Platform open-source project named Scion that orchestrates AI agents; do not confuse the two:
https://github.com/GoogleCloudPlatform/scion

## What Anthropic publicly disclosed

Anthropic describes a workload where online agents and CI jobs access a very large monorepository at extremely high frequency. Its article reports that daily merged changes rose from roughly 2,500 in May 2026 to more than 30,000 in September 2026; the main-branch history was nearly 100 GB; and CI performed around 25 million checkouts per day. Those figures describe Anthropic's internal workload, not an expected workload for AgentScale.

The design principles Anthropic describes include:

1. **Online clients:** most clients are agents/jobs that can rely on a reachable service, rather than complete offline repository replicas.
2. **Client/server asymmetry:** the server performs source-control operations; clients keep bounded local object caches and working copies.
3. **Server-side repository APIs:** clients can ask for history, blame, diffs and merge-base information without maintaining a complete local repository for every query.
4. **Horizontal scalability:** repository data is distributed and content-addressed; components can cache immutable data.
5. **Incremental changesets:** Scion's own changeset model is not the same as Git commits; changesets are recorded in a write-ahead log and refer to content-addressed blob data.
6. **Derived data:** indexes for operations such as blame and path history can be computed eagerly or lazily from changesets.
7. **Sparse and virtualized working copies:** clients request only needed trees/blobs; files can be materialized on demand.
8. **Tiered caching and failure isolation:** the client daemon, regional cache and authoritative server use the same object RPC shape, while tier boundaries prevent an upstream failure from cascading.

Anthropic reports very high cache hit rates and major internal infrastructure savings. These are company-reported results for its own system and workload; AgentScale must not reuse those numbers as expected outcomes.

## What Anthropic explicitly cautions

Anthropic says Scion is not a general-purpose Git replacement. It diverges significantly from Git and would require organizations to migrate the wider development lifecycle, including code review, code search, CI and access control. Anthropic's stated recommendation is that the ecosystem can apply useful architectural ideas while retaining the broader Git model.

This is the strongest reason for AgentScale to remain Git-compatible in its first release.

## Translation table: Scion idea -> AgentScale MVP

| Anthropic principle | AgentScale MVP interpretation | Deferred / not copied |
|---|---|---|
| Online agent clients | API-driven workspace and repository operations | Require-online-only VCS protocol |
| Bounded local cache | Node-local Git bare mirror/object cache | Custom Scion client protocol |
| Content-addressed immutable objects | Reuse Git's existing object IDs and object database | New blob/object format |
| Server-side repository queries | Start with a small API for repo metadata and benchmark/workspace operations | Full server-side blame, merge, rebase, ancestry engine |
| Sparse access | Evaluate Git partial clone and sparse checkout as baselines and later options | Custom virtual filesystem |
| Tiered cache | Single node-local cache in MVP | Regional and multi-region cache tiers |
| Incremental server-side changesets | Keep Git commits and refs | Scion changeset/WAL model |
| Horizontal scale | Design component boundaries for later scale-out | Distributed consensus and global ref service |
| Operational visibility | Metrics, events, logs, benchmark reports | AI “superfan” operations agents |

## Important technical distinction

A cache around Git is not equivalent to Scion's source-control architecture. AgentScale's first prototype will use Git-native object storage and workspace mechanisms. It can prove a narrower claim: overlapping jobs can reuse locally available immutable objects and avoid repeated upstream transfer. It will not claim to eliminate all repository operations or match Scion's reported scale.

## Existing Git capabilities must be part of the baseline

Git already supports:

- Partial clone, including blob filtering, to avoid initially downloading selected objects.
- Sparse checkout, to materialize selected paths.
- Multiple worktrees attached to one repository.
- Repository maintenance and prefetch facilities.

AgentScale must compare against a reasonable Git configuration, not a deliberately weak one.

## Sources

- Anthropic primary article: https://www.anthropic.com/research/redesigning-source-control
- Git partial clone: https://git-scm.com/docs/partial-clone
- Git worktree: https://git-scm.com/docs/git-worktree
- Git maintenance: https://git-scm.com/docs/git-maintenance
- Git backfill: https://git-scm.com/docs/git-backfill
