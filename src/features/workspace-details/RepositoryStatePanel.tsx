import { Badge, Card, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import type { WorkspaceChange, WorkspaceDetail, WorkspaceTreeState } from "../../fixtures/workspace-details.ts";

const columns: TableColumn<WorkspaceChange>[] = [
  { key: "path", header: "Path" },
  { key: "change", header: "Change" },
  { key: "disposition", header: "Compared with" },
];

function treeVariant(tree: WorkspaceTreeState): "success" | "warning" | "info" | "danger" {
  switch (tree) {
    case "clean":
      return "success";
    case "modified":
      return "warning";
    case "uncommitted":
      return "info";
    default:
      return "danger";
  }
}

function treeLabel(tree: WorkspaceTreeState): string {
  switch (tree) {
    case "clean":
      return "Clean";
    case "modified":
      return "Modified";
    case "uncommitted":
      return "Uncommitted";
    default:
      return "Sync issue";
  }
}

export function RepositoryStatePanel({ detail }: { detail: WorkspaceDetail }) {
  return (
    <section className="panel" aria-labelledby="repository-state">
      <div className="panel__head">
        <h2 id="repository-state">Repository state</h2>
        <Badge variant={treeVariant(detail.tree)}>{treeLabel(detail.tree)}</Badge>
      </div>
      <Card title="Working tree" description="Sample state only. This preview does not run Git.">
        <dl className="detail-meta detail-meta--stack">
          <div>
            <dt>Changes versus base commit</dt>
            <dd>{detail.baseChanges}</dd>
          </div>
          <div>
            <dt>HEAD</dt>
            <dd className="commit-sha">{detail.head}</dd>
          </div>
          <div>
            <dt>Base commit</dt>
            <dd className="commit-sha">{detail.baseCommit}</dd>
          </div>
          <div>
            <dt>Uncommitted working-tree changes</dt>
            <dd>{detail.uncommitted}</dd>
          </div>
          <div>
            <dt>Sync state</dt>
            <dd>{detail.syncState}</dd>
          </div>
        </dl>
      </Card>
      <p className="detail-note">
        Base commit rows differ from the pinned base. Working tree rows are uncommitted. The counts above match those rows.
      </p>
      {detail.changes.length === 0 ? (
        <p className="detail-note">No changes versus the base commit, and no uncommitted working-tree changes.</p>
      ) : (
        <div className="change-table">
          <Table columns={columns} rows={detail.changes} rowKey={(row) => row.path} bordered responsive="default" />
        </div>
      )}
    </section>
  );
}
