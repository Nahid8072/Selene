import { Badge, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { nodeErrors } from "../../fixtures/cache-nodes.ts";

interface ErrorRow {
  at: string;
  severity: "warning" | "info";
  message: string;
}

const columns: TableColumn<ErrorRow>[] = [
  { key: "at", header: "Timestamp" },
  {
    key: "severity",
    header: "Severity",
    render: (row) => <Badge variant={row.severity === "warning" ? "warning" : "info"}>{row.severity}</Badge>,
  },
  { key: "message", header: "Description" },
];

export function NodeErrorFeed() {
  return (
    <section className="panel" aria-labelledby="node-errors">
      <h2 id="node-errors">Errors</h2>
      <p className="section-note">Recorded sample lines for node-a. Nothing is streaming.</p>
      <div className="log-view">
        <Table
          columns={columns}
          rows={nodeErrors.map((row) => ({ at: row.at, severity: row.severity, message: row.message }))}
          rowKey={(row) => row.at}
          bordered
          responsive="default"
        />
      </div>
    </section>
  );
}
