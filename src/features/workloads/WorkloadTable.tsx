import { Button, Card, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { Link } from "react-router";
import type { WorkloadRow } from "../../fixtures/workloads.ts";
import { WorkloadStatusBadge } from "./WorkloadStatusBadge.tsx";

const columns: TableColumn<WorkloadRow>[] = [
  {
    key: "id",
    header: "Workload ID",
    width: "9rem",
    render: (row) => (
      <Link className="row-link" to={`/workloads/${row.id}`}>
        <span className="commit-sha">{row.id}</span>
      </Link>
    ),
  },
  { key: "name", header: "Workload Name", width: "16rem" },
  { key: "type", header: "Type", width: "8rem" },
  { key: "agents_requested", header: "Agents Requested", align: "right", width: "9rem" },
  { key: "active_jobs", header: "Active Jobs", align: "right", width: "7rem" },
  {
    key: "status",
    header: "Status",
    width: "7rem",
    render: (row) => <WorkloadStatusBadge status={row.status} />,
  },
  { key: "started_at", header: "Started At", width: "14rem" },
  { key: "duration", header: "Duration", align: "right", width: "6rem" },
  {
    key: "actions",
    header: "Actions",
    width: "22rem",
    render: (row) => (
      <div className="row-actions">
        {row.status === "running" ? (
          <Button type="button" size="sm" variant="secondary" disabled>
            Pause
          </Button>
        ) : null}
        {row.status === "running" || row.status === "queued" ? (
          <Button type="button" size="sm" variant="outline" disabled>
            Cancel
          </Button>
        ) : null}
        {row.status === "failed" ? (
          <Button type="button" size="sm" variant="secondary" disabled>
            Retry Failed Jobs
          </Button>
        ) : null}
        <Link className="repo-link" to={`/workloads/${row.id}`}>
          View Details
        </Link>
      </div>
    ),
  },
];

export function WorkloadTable({ rows }: { rows: WorkloadRow[] }) {
  return (
    <div className="workload-table">
      <Card>
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} bordered={false} responsive="default" />
      </Card>
    </div>
  );
}
