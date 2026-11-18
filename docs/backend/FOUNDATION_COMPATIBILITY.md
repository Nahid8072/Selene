---
cursor:
  subagentId: "bc-2cc8ce60-3e81-566b-bfd1-089beafbc3b8"
---

# Foundation compatibility

The Foundation Pack under `docs/source/` is not edited. These additions are approved for the backend design. They fill gaps the pack left open. They do not reverse ADR-001 or the charter.

Coding has not started.

## Approved additions

| Addition | What the pack says | What this design does |
| --- | --- | --- |
| `GET /api/v1/operations/{operationID}` | A `202` includes an operation or workspace id. It does not name a poll URL. | The id is polled at this path. The operation row is metadata, not a Git object. |
| Optional `agent_label` | Workspace create example is `repository_id`, `commit_sha`, and `name`. | Callers may send a label. It is stored text. It does not start an agent. Omitting it leaves null. |
| `needs_reconciliation` | Failure handling allows `failed` or `needs_reconciliation`. The workspace status list has no such value. | It is an operation status. While it is set, `error_code` is `needs_reconciliation` and `error_message` is set. It is also a workspace `error_code` when recovery cannot prove success. It is never a workspace status. Startup does not leave operations in this status. |
| `vscode` | The protocol starts with React and Kubernetes. Linux is optional stress. vscode is not named. | `repo_vscode` is the fourth registered repository. |
| Research starting pair | Same protocol sentence. | Research runs start with `repo_react` and `repo_kubernetes`. The full registry also contains `repo_linux` and `repo_vscode`. Linux remains optional stress. vscode is registered and is not required for the first research pair. |
| `synthetic-overlap` | A generated repository with a recorded pin. | Dataset `dataset_synthetic_overlap`, kind `synthetic`, `repository_id` null. It is not a fifth registered remote. |

## Lease field in the pack

`05_DATA_MODEL_AND_API.md` lists `cache_lease_id` on the workspace. This design does not store that column. `cache_leases.workspace_id` is the only foreign key between a workspace and a lease. A response may include `cache_lease_id` as the id of the unreleased lease found by that workspace id. Clients cannot send it. There is no second foreign key from `workspaces` to `cache_leases`.

## Not changed in the pack

D22, D23, and D24 stay accepted here and in `DECISIONS.md`. Checkout time is not provisioning latency and stays unavailable until it is instrumented on its own. PostgreSQL 16 is the only major version. Confirms stay disabled until that specific operation is approved.

No sentence in `docs/source/` was rewritten.
