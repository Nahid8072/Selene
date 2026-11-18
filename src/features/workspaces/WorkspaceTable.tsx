import { Card, EmptyState, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { Link } from "react-router";
import type { WorkspaceRow } from "../../fixtures/workspaces.ts";
import { WorkspaceStatusBadge } from "./WorkspaceStatusBadge.tsx";

const columns: TableColumn<WorkspaceRow>[] = [
  {
    key: "id",
    header: "Workspace ID",
    render: (row) => (
      <Link className="row-link" to={`/workspaces/${row.id}`} aria-label={`Open workspace ${row.id}`}>
        <span className="commit-sha">{row.id}</span>
      </Link>
    ),
  },
  { key: "agent", header: "Agent" },
  { key: "repository", header: "Repository" },
  { key: "branch", header: "Branch" },
  {
    key: "base_commit",
    header: "Base Commit",
    render: (row) => <span className="commit-sha">{row.base_commit}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <WorkspaceStatusBadge status={row.status} />,
  },
  { key: "created_at", header: "Created At" },
  { key: "node", header: "Node" },
  { key: "duration", header: "Duration", align: "right" },
];

export function WorkspaceTable({ rows }: { rows: WorkspaceRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        type="no-data"
        title="No workspaces in this view"
        description="Create a workspace from a pinned commit when that action is available. Nothing is provisioned from this preview."
      />
    );
  }
  return (
    <div className="workspace-table">
      <Card>
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} bordered={false} responsive="default" />
      </Card>
    </div>
  );
}
