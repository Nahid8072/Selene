import { Badge, Button, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { apiKeys, type ApiKeyRow } from "../../fixtures/integrations.ts";

const columns: TableColumn<ApiKeyRow>[] = [
  { key: "name", header: "Key name" },
  { key: "identifier", header: "Identifier", render: (row) => <span className="commit-sha">{row.identifier}</span> },
  { key: "scopes", header: "Permissions / scopes" },
  { key: "expiration", header: "Expiration" },
  { key: "lastUsed", header: "Last used" },
  { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> },
  {
    key: "id",
    header: "Actions",
    render: () => (
      <Button type="button" size="sm" variant="outline" disabled>
        Revoke
      </Button>
    ),
  },
];

export function APIKeyTable() {
  return (
    <div className="span-table api-key-table">
      <Table columns={columns} rows={apiKeys} rowKey={(row) => row.id} bordered responsive="default" />
    </div>
  );
}
