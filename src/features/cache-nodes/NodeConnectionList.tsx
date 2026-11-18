import { Badge, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { nodeConnections } from "../../fixtures/cache-nodes.ts";

interface ConnectionRow {
  id: string;
  agent: string;
  repository: string;
  state: string;
}

const columns: TableColumn<ConnectionRow>[] = [
  { key: "id", header: "Connection", render: (row) => <span className="commit-sha">{row.id}</span> },
  { key: "agent", header: "Agent" },
  { key: "repository", header: "Repository" },
  { key: "state", header: "State", render: (row) => <Badge variant="success">{row.state}</Badge> },
];

export function NodeConnectionList() {
  return (
    <section className="panel" aria-labelledby="node-connections">
      <h2 id="node-connections">Connections</h2>
      <p className="section-note">{nodeConnections.length} established connections on node-a. Illustrative sample.</p>
      <div className="cache-table">
        <Table columns={columns} rows={nodeConnections} rowKey={(row) => row.id} bordered responsive="default" />
      </div>
    </section>
  );
}
