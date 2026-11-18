import { Badge, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { invitations } from "../../fixtures/security.ts";

interface InviteRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const columns: TableColumn<InviteRow>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "status", header: "Account status", render: (row) => <Badge variant="warning">{row.status}</Badge> },
  { key: "lastLogin", header: "Last login" },
];

export function InvitationList() {
  return (
    <div className="span-table security-table">
      <Table columns={columns} rows={[...invitations]} rowKey={(row) => row.id} bordered responsive="default" />
    </div>
  );
}
