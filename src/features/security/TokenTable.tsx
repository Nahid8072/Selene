import { Badge, Button, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { securityTokens } from "../../fixtures/security.ts";

interface TokenRow {
  id: string;
  owner: string;
  scopes: string;
  expiration: string;
  lastUsed: string;
  status: string;
  revoke?: never;
}

const columns: TableColumn<TokenRow>[] = [
  { key: "id", header: "Identifier", render: (row) => <span className="commit-sha">{row.id}</span> },
  { key: "owner", header: "Owner" },
  { key: "scopes", header: "Scopes" },
  { key: "expiration", header: "Expiration" },
  { key: "lastUsed", header: "Last used" },
  { key: "status", header: "Status", render: (row) => <Badge>{row.status}</Badge> },
  {
    key: "revoke",
    header: "Actions",
    render: () => (
      <Button type="button" size="sm" variant="outline" disabled>
        Revoke
      </Button>
    ),
  },
];

export function TokenTable() {
  return (
    <div className="span-table security-table">
      <Table columns={columns} rows={securityTokens} rowKey={(row) => row.id} bordered responsive="default" />
    </div>
  );
}
