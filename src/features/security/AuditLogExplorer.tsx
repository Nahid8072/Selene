import { Badge, Button, Input, Select, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { auditRecords } from "../../fixtures/security.ts";

interface AuditRow {
  id: string;
  timestamp: string;
  actor: string;
  category: string;
  target: string;
  action: string;
  outcome: string;
  source: string;
}

const columns: TableColumn<AuditRow>[] = [
  { key: "timestamp", header: "Timestamp" },
  { key: "actor", header: "Actor" },
  { key: "category", header: "Category" },
  { key: "target", header: "Target", render: (row) => <span className="commit-sha">{row.target}</span> },
  { key: "action", header: "Action" },
  { key: "outcome", header: "Outcome", render: (row) => <Badge>{row.outcome}</Badge> },
  { key: "source", header: "Source" },
];

const categories = [
  "User Activity",
  "Configuration Changes",
  "Repository Access Events",
  "API Key Creation and Revocation",
  "Administrative Actions",
];

export function AuditLogExplorer() {
  return (
    <section className="panel" aria-labelledby="audit-logs">
      <h2 id="audit-logs">Audit logs</h2>
      <p className="section-note">Filters and search are visible and inactive. These rows are a sample, not a live audit log.</p>
      <div className="detail-actions inert-actions" aria-label="Inactive audit filters">
        {categories.map((category) => (
          <Button key={category} type="button" size="sm" variant="outline" disabled>
            {category}
          </Button>
        ))}
      </div>
      <div className="form-grid">
        <Select label="Category" disabled placeholder="Any" options={categories.map((name) => ({ value: name, label: name }))} />
        <Select
          label="User"
          disabled
          placeholder="Any"
          options={[
            { value: "operator.sample", label: "operator.sample" },
            { value: "infra.sample", label: "infra.sample" },
            { value: "dev.sample", label: "dev.sample" },
            { value: "observer.sample", label: "observer.sample" },
          ]}
        />
        <Input label="Resource" disabled value="" placeholder="repo_ or node-a" />
        <Input label="Time range" disabled value="06 Nov 2026 sample" />
        <Input label="Outcome" disabled value="" placeholder="Any" />
        <Input label="Search" disabled value="" placeholder="Search audit rows" aria-label="Search audit rows" />
      </div>
      <div className="span-table security-table audit-table">
        <Table columns={columns} rows={[...auditRecords]} rowKey={(row) => row.id} bordered responsive="default" />
      </div>
    </section>
  );
}
