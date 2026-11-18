import { Badge, Button, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { users } from "../../fixtures/security.ts";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  actions?: never;
}

const columns: TableColumn<UserRow>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "status", header: "Status", render: (row) => <Badge variant="success">{row.status}</Badge> },
  { key: "lastLogin", header: "Last login" },
  {
    key: "actions",
    header: "Actions",
    render: () => (
      <div className="detail-actions inert-actions">
        <Button type="button" size="sm" variant="outline" disabled>
          Change Role
        </Button>
        <Button type="button" size="sm" variant="outline" disabled>
          Disable Account
        </Button>
        <Button type="button" size="sm" variant="outline" disabled>
          Remove User
        </Button>
      </div>
    ),
  },
];

export function UserManagementTable() {
  return (
    <div className="span-table security-table">
      <Table columns={columns} rows={[...users]} rowKey={(row) => row.id} bordered responsive="default" />
    </div>
  );
}
