import { Button } from "@sakaniui/react";

export function PageHeader() {
  return (
    <header className="page-header">
      <div>
        <h1>Overview</h1>
        <p>Infrastructure health and activity across your agent fleet.</p>
      </div>
      <div className="page-header__actions">
        <Button type="button" variant="secondary" size="sm" disabled>
          Launch Workspace
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled>
          Run Benchmark
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled>
          View Logs
        </Button>
        <Button type="button" variant="primary" size="sm" disabled>
          Add Repository
        </Button>
      </div>
    </header>
  );
}
