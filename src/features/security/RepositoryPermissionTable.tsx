import { Badge, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { isolationNote, repositoryPermissions } from "../../fixtures/security.ts";

interface PermissionRow {
  id: string;
  category: string;
  repository: string;
  principal: string;
  access: string;
  scope: string;
  state: string;
}

const columns: TableColumn<PermissionRow>[] = [
  { key: "category", header: "Category" },
  { key: "repository", header: "Repository", render: (row) => <span className="commit-sha">{row.repository}</span> },
  { key: "principal", header: "Principal" },
  { key: "access", header: "Access level", render: (row) => <Badge>{row.access}</Badge> },
  { key: "scope", header: "Scope" },
  { key: "state", header: "Permission state" },
];

export function RepositoryPermissionTable() {
  return (
    <section className="panel" aria-labelledby="repo-permissions">
      <h2 id="repo-permissions">Repository permissions</h2>
      <p className="section-note">{isolationNote}</p>
      <div className="span-table security-table">
        <Table columns={columns} rows={[...repositoryPermissions]} rowKey={(row) => row.id} bordered responsive="default" />
      </div>
    </section>
  );
}
