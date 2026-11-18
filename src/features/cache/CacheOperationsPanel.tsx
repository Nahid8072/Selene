import { Alert, Button, Card, Select, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { repositoryCacheRows, selectedEntries, selectedRepository } from "../../fixtures/cache.ts";

interface EntryRow {
  id: string;
  kind: string;
  bytes: string;
}

const columns: TableColumn<EntryRow>[] = [
  { key: "id", header: "Object", render: (row) => <span className="commit-sha">{row.id}</span> },
  { key: "kind", header: "Kind" },
  { key: "bytes", header: "Size", align: "right" },
];

export function CacheOperationsPanel() {
  return (
    <Card title="Cache operations" description="Visual only. Nothing is warmed, inspected, cleared, or paused.">
      <Select
        label="Repository"
        description="The preview below is for this repository."
        size="sm"
        disabled
        value={selectedRepository}
        options={repositoryCacheRows.map((row) => ({ value: row.repository, label: row.repository }))}
      />
      <div className="cache-table">
        <Table columns={columns} rows={selectedEntries} rowKey={(row) => row.id} bordered={false} responsive="default" />
      </div>
      <div className="detail-actions" aria-label="Cache actions">
        <Button type="button" variant="secondary" size="sm" disabled>
          Warm Cache
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled>
          Inspect Cache Statistics
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          Clear Selected Entries
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled>
          Pause/Resume Cache Service
        </Button>
      </div>
      <Alert
        color="warning"
        title="Clear would need permission and confirmation"
        description="An Infrastructure Administrator would have to confirm. The three react objects above, 12.0 MB on node-a, would leave the shared cache. The next miss would fetch them from upstream. Writable workspaces would stay. This preview does not remove them."
      />
      <p className="detail-note">
        Pause/Resume would stop or start serving the node-a cache. That also needs confirmation, and this control does not
        change the service.
      </p>
    </Card>
  );
}
