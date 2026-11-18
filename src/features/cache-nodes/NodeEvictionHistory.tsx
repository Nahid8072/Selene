import { Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { nodeFacts } from "../../fixtures/cache-nodes.ts";

interface EvictionRow {
  at: string;
  repository: string;
  objects: string;
}

const columns: TableColumn<EvictionRow>[] = [
  { key: "at", header: "When" },
  { key: "repository", header: "Repository" },
  { key: "objects", header: "Objects", align: "right" },
];

export function NodeEvictionHistory() {
  return (
    <section className="panel" aria-labelledby="node-evictions">
      <h2 id="node-evictions">Eviction history</h2>
      <p className="section-note">
        {nodeFacts.evictions} objects. These rows are the same eviction history as Cache Engine.
      </p>
      <div className="cache-table">
        <Table
          columns={columns}
          rows={nodeFacts.evictionHistory.map((row) => ({
            at: row.at,
            repository: row.repository,
            objects: String(row.objects),
          }))}
          rowKey={(row) => row.at}
          bordered
          responsive="default"
        />
      </div>
    </section>
  );
}
