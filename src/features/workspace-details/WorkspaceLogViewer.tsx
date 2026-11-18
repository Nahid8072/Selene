import { Badge, EmptyState, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import type { LogSeverity, WorkspaceLogLine } from "../../fixtures/workspace-details.ts";

const columns: TableColumn<WorkspaceLogLine>[] = [
  { key: "timestamp", header: "Timestamp" },
  {
    key: "severity",
    header: "Severity",
    render: (row) => <Badge variant={severityVariant(row.severity)}>{row.severity}</Badge>,
  },
  { key: "source", header: "Source" },
  { key: "message", header: "Message" },
];

function severityVariant(severity: LogSeverity): "neutral" | "warning" | "danger" {
  switch (severity) {
    case "error":
      return "danger";
    case "warning":
      return "warning";
    default:
      return "neutral";
  }
}

export function WorkspaceLogViewer({ logs }: { logs: WorkspaceLogLine[] }) {
  return (
    <section className="panel" id="workspace-logs" aria-labelledby="workspace-logs-title">
      <div>
        <h2 id="workspace-logs-title">Logs</h2>
        <p className="section-note">
          Provisioning, repository operations, errors, and retries from the sample. Nothing is streaming.
        </p>
      </div>
      {logs.length === 0 ? (
        <EmptyState
          type="no-data"
          title="No log lines"
          description="This workspace has not written a provisioning, repository, error, or retry line in the sample."
        />
      ) : (
        <div className="log-view">
          <Table columns={columns} rows={logs} rowKey={(row) => row.id} bordered responsive="default" />
        </div>
      )}
    </section>
  );
}
