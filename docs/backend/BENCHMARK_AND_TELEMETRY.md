---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Benchmark methodology and telemetry

This file follows `docs/source/07_BENCHMARK_PROTOCOL.md`. It does not replace that protocol. It records how the control plane stores configurations and where each number comes from. Coding has not started. No frontend fixture is a measurement.

## Three arms

Every research run names its arms. The research protocol uses all three, on the same host, the same pinned SHA, and the same materialized file set.

| Arm | Stored value | What the worker does |
| --- | --- | --- |
| A Standard Git | `standard_git` | Each worker clones the pinned revision from the origin and checks out the declared scope. Selene’s mirror is not used. |
| B Optimized Git | `optimized_git` | Native Git features only. Default documented filter is `--filter=blob:none`. Sparse checkout is a separate scenario, not mixed into a full-checkout comparison. The configuration written to `config.json` lists the exact flags. The workspace contents must match the other arms. |
| C Selene | `selene` | One node-local bare mirror is populated once. Each workspace is a private clone through Git alternates. The mirror is not writable by the worker. |

Comparing a full standard clone with a Selene sparse checkout is not a valid research result. Sparse scope is its own scenario, applied to every arm or reported separately.

There is no fourth arm and no custom object format.

## Cold, warm, concurrency, repetitions

| Dimension | Research protocol |
| --- | --- |
| Cache state | `cold` and `warm`, both required for a final claim |
| Concurrency | 1, 5, 10, 25, 50. 100 only when the recorded host has the CPU, RAM, and disk to finish. |
| Repetitions | At least 5 for development. Target 10 or more for a final report when runtime allows. |
| Order | Alternate or randomize arm order. Record the order. |
| Seed | Required for `dataset_synthetic_overlap`. Recorded for every run. |

Cold Selene: start with no local mirror for that repository. Record upstream population time and bytes separately from the later workspace batch. Report batch cost and per-workspace cost.

Warm Selene: the mirror already contains the pinned SHA. Record workspace provisioning and any further upstream bytes.

Baseline cold and warm: each trial starts with a clean workspace directory. Do not call a trial cold only because Selene’s cache directory was empty if the host page cache may still be warm. Record whether the page cache was dropped, and if it was not, set that note on the trial. Do not invent a page-cache byte count.

A warm result does not prove a cold result. Absolute values and trial counts are stored. The API has no speedup, winner, delta, or significance field.

## Demonstration preset

The frozen Benchmark Studio profile is preset `demonstration`, not the research protocol.

| Field | Demonstration preset | Research protocol |
| --- | --- | --- |
| Arms | `standard_git`, `selene` | `standard_git`, `optimized_git`, `selene` |
| Repetitions | 3 | At least 5; final target 10 or more |
| Concurrency | 1, 10, 25, 50, 100 as shown on the screen | 1, 5, 10, 25, 50, and 100 only if hardware allows |
| Cache states on screen | Cold and warm exist as controls | Both are required for a research claim |

The preset is a stored configuration so the screen can be represented later. A run with `preset: demonstration` must not be returned as a research result. `GET` of a run includes `preset` and `protocol`. Research runs use `preset: research` and `protocol: foundation-07`.

The screen’s 30 synthetic trials are not loaded.

## Multiple configurations

A configuration is its own row. A run points at one configuration. The table can hold the research matrix and the demonstration preset at the same time.

Stored on the configuration: `id`, `preset`, `arms`, `concurrencies`, `cache_states`, `repetitions`, `scope` (`full` or `sparse`), `dataset_id`, `commit_sha`, `seed`, `git_flags` for arm B, resource limits, and a note. A run copies the SHA it actually used into `benchmark_runs.commit_sha` even if the dataset pin later changes. Runs do not follow a moving branch.

Trials are one row per arm, per concurrency, per cache state, per repetition index, per worker outcome as required by the raw `workers.jsonl`. Failed workers stay. Summary statistics use completed trials only and still report `failure_count`. If a required input is missing, that summary field is null.

## Dataset registry

| Dataset | Kind | Pin |
| --- | --- | --- |
| `repo_react` | Registered public repository | SHA column null until resolved from the remote and recorded |
| `repo_kubernetes` | Registered public repository | Same |
| `repo_linux` | Registered public repository. Optional stress use. | Same |
| `repo_vscode` | Registered public repository. Fourth registry entry. Not required to be the first protocol dataset. | Same |
| `dataset_synthetic_overlap` | Generated tree. Not a registered remote. | SHA recorded after `git rev-parse` on the generated repository. Generator inputs stored: file count, file size, history depth, binary/text ratio, shared-path overlap, seed. |

Public pins are full SHAs. The fixture SHAs in `/agent/web` are not copied.

Never start a trial without `commit_sha` filled from a real resolution.

## Measurement sources

If the source did not run, the field is null and `measurement_source` is `unavailable`. Do not write zero for an unknown.

| Metric | Unit | Source | If the source is missing |
| --- | --- | --- | --- |
| Provisioning latency | milliseconds | Worker start and end timestamps in `workers.jsonl` | null |
| Median, p95, p99 latency | milliseconds | Computed from completed trials when the count supports it. p99 only when the protocol’s sample count supports it. | null |
| Upstream bytes sent and received | bytes | Docker network I/O counters on an isolated origin container, difference over the trial window | null. Do not estimate from pack heuristics and present them as origin bytes. |
| Successful workspaces per second | count / second | Completed successes and the batch wall time | null if the clock or the success count was not recorded |
| Failure rate | ratio | Failed workers divided by workers started. Both counts are required. | null if either count was not recorded. A known zero failures is a real zero only when every worker row exists. |
| CPU | percent | Host or container sample named in `metrics.json` | null |
| Memory | bytes | Peak and average, source named | null |
| Disk read and write | bytes | Container or host block I/O, source named | null |
| Cache disk footprint | bytes | `git count-objects -v` or directory size of that mirror, command and exit status stored | null |
| Warm-up cost | milliseconds and bytes | The cold mirror-refresh operation, separate from workspace latency | null |
| Cache hits and misses | count | Selene arm only. Method below. | null. Not applicable on `standard_git` and `optimized_git`, stored as `not_applicable` rather than a number. |

Environment recorded with every run: Git version, OS, kernel, Docker version if used, CPU, RAM, storage type, and network setup. Missing items are null, not guessed.

Raw files, immutable after the run, under the data directory:

- `benchmarks/<run-id>/config.json`
- `benchmarks/<run-id>/workers.jsonl`
- `benchmarks/<run-id>/metrics.json`
- `benchmarks/<run-id>/summary.json`
- `benchmarks/<run-id>/README.md` with the exact command

The API returns trial rows and a summary computed from those files. It does not rewrite them. CSV and JSON export, when implemented, stream those artifacts. PDF is not part of the protocol and is not a v1 route.

Charts required by the protocol (latency, upstream bytes, throughput, CPU and memory, cold versus warm cost, failure rate) are produced later from the raw files. They are not the frontend sample charts.

## Cache hit and miss instrumentation

Hits and misses are Selene-only. Baseline arms store `not_applicable`.

v1 does not pretend Git alternates emit a counter. The control plane may record a hit or a miss only in these cases:

1. **Mirror refresh.** Objects received from the origin during that `git fetch` are misses for the refresh. The count is taken from Git’s fetch machinery output only when the exit status is zero and the count is present in the captured output. If the output cannot be parsed, `cache_misses` for that refresh is null. Bytes from the origin container remain the primary upstream measure.
2. **Workspace provision that opens no connection to the origin.** After `HEAD` is verified, the object count of the pinned commit is read with `git rev-list --count --objects <sha>` against the workspace. If that command exits zero and the provision’s network record shows no origin traffic, that count is `cache_hits` for the provision and `cache_misses` is 0 for that provision only. Zero is allowed here because the network observation and the rev-list both succeeded. If either check is missing, both fields are null.
3. **Anything else.** Including partial fetches, a failed rev-list, or an origin that was not in its own network namespace. Both fields stay null. `measurement_source` is `unavailable`.

Evictions are not instrumented. No series of eviction events is synthesized to match the screen’s sample of 42.

Health is not a cache metric. Component health comes from `STATE_MACHINES_AND_RECOVERY.md` and the node resource: a check ran, or the status is `unknown`.

## Telemetry the API will expose

| Read | Content |
| --- | --- |
| `GET /api/v1/events` | Accepted operation events for a repository, workspace, and time window |
| `GET /api/v1/logs` | Redacted process lines: time, service, severity, correlation id, optional repository and workspace ids, message |
| `GET /api/v1/traces/{correlationID}` | Those lines and events for one id, in time order. Stages that did not happen are absent. |
| Prometheus text on the process | Only after scrape names and units are written down at implementation time. `GET /api/v1/metrics` stays undefined. |

Alert rules, email, and webhooks are deferred. The observability screen’s five alert names are not evaluated.

Logs and events omit secrets, credential URLs, and absolute data-directory paths.
