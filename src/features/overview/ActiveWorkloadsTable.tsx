import { Badge, Card, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { overviewModel } from "../../fixtures/overview.ts";
import type { WorkloadRow } from "../../fixtures/overview.ts";
import type { WorkspaceStatus } from "../../types/domain.ts";

function statusVariant(
  status: WorkspaceStatus,
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "ready":
      return "success";
    case "provisioning":
    case "requested":
      return "info";
    case "failed":
      return "danger";
    case "stopping":
    case "destroying":
      return "warning";
    default:
      return "neutral";
  }
}

const columns: TableColumn<WorkloadRow>[] = [
  { key: "name", header: "Workspace", width: "24%" },
  { key: "repository_name", header: "Repository", width: "20%" },
  {
    key: "status",
    header: "Status",
    width: "18%",
    render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>,
  },
  {
    key: "assigned_agents",
    header: "Agents",
    align: "right",
    width: "12%",
  },
  { key: "last_activity", header: "Last activity", width: "26%" },
];

export function ActiveWorkloadsTable() {
  return (
    <section className="panel table-panel" aria-labelledby="active-workloads">
      <div className="panel__head">
        <div>
          <h2 id="active-workloads">Active workloads</h2>
          <p className="panel__copy">
            Sample workspace rows. Agent counts are configured workers, not live sessions.
          </p>
        </div>
      </div>
      <Card>
        <Table
          columns={columns}
          rows={overviewModel.workloads}
          rowKey={(row) => row.id}
          bordered={false}
          responsive="auto"
        />
      </Card>
    </section>
  );
}
