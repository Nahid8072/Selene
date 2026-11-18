import { Button } from "@sakaniui/react";

export function BenchmarkExportPanel() {
  return (
    <section className="panel" aria-labelledby="export-actions">
      <h2 id="export-actions">Export</h2>
      <p className="section-note">These actions do not create a file.</p>
      <div className="detail-actions export-actions">
        <Button type="button" variant="secondary" size="sm" disabled>
          Download CSV
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled>
          Export JSON
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          Generate PDF Report
        </Button>
      </div>
    </section>
  );
}
