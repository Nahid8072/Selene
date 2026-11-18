import { Badge, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { monitorEvents } from "../../fixtures/observability.ts";

interface EventRow {
  timestamp: string;
  kind: string;
  severity: string;
  source: string;
  resource: string;
  description: string;
  status: string;
}

const columns: TableColumn<EventRow>[] = [
  { key: "timestamp", header: "Timestamp" },
  { key: "kind", header: "Event" },
  {
    key: "severity",
    header: "Severity",
    render: (row) => (
      <Badge variant={row.severity === "Error" ? "danger" : row.severity === "Warning" ? "warning" : "info"}>
        {row.severity}
      </Badge>
    ),
  },
  { key: "source", header: "Source" },
  { key: "resource", header: "Resource" },
  { key: "description", header: "Description" },
  { key: "status", header: "Status" },
];

export function EventMonitor() {
  return (
    <section className="panel" aria-labelledby="event-monitor">
      <h2 id="event-monitor">Event monitor</h2>
      <p className="section-note">Chronological sample on node-a. Node failure, cache miss, authentication, provisioning, and synchronization are all listed.</p>
      <div className="span-table log-table">
        <Table
          columns={columns}
          rows={monitorEvents.map((event) => ({
            timestamp: event.timestamp,
            kind: event.kind,
            severity: event.severity,
            source: event.source,
            resource: event.resource,
            description: event.description,
            status: event.status,
          }))}
          rowKey={(row) => row.kind}
          bordered
          responsive="default"
        />
      </div>
    </section>
  );
}
