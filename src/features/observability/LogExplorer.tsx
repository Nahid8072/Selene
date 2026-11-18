import { Button, Input, Select } from "@sakaniui/react";
import { logRecords, logServices } from "../../fixtures/observability.ts";
import { LogTable } from "./LogTable.tsx";

export function LogExplorer() {
  return (
    <section className="panel log-explorer" aria-labelledby="log-explorer">
      <h2 id="log-explorer">Log explorer</h2>
      <p className="section-note">Filters are visible and inactive. Search does not run. Messages stay fully readable.</p>
      <div className="detail-actions inert-actions" aria-label="Inactive log filters">
        <Button type="button" size="sm" variant="outline" disabled>
          Error
        </Button>
        <Button type="button" size="sm" variant="outline" disabled>
          Warning
        </Button>
        <Button type="button" size="sm" variant="outline" disabled>
          Information
        </Button>
      </div>
      <div className="form-grid">
        <Select label="Service" disabled placeholder="Any" options={logServices.map((name) => ({ value: name, label: name }))} />
        <Input label="Time range" disabled value="24h sample" />
        <Input label="Request identifier" disabled value="" placeholder="req_" />
        <Input label="Search" disabled value="" placeholder="Search logs" aria-label="Search logs" />
      </div>
      <LogTable rows={logRecords} />
    </section>
  );
}
