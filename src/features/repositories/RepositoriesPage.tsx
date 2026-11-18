import { useState } from "react";
import { Button } from "@sakaniui/react";
import { repositoryMetrics } from "../../fixtures/repositories.ts";
import { MetricCard } from "../overview/MetricCard.tsx";
import { SamplePager } from "../../components/shared/SamplePager.tsx";
import { AddRepositoryPreview } from "./AddRepositoryPreview.tsx";
import { RepositoryTable } from "./RepositoryTable.tsx";
import { RepositoryToolbar } from "./RepositoryToolbar.tsx";

export default function RepositoriesPage() {
  const [adding, setAdding] = useState(false);
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <h1>Repositories</h1>
          <p>Manage Git sources, synchronization and repository availability across your infrastructure.</p>
        </div>
        <div className="page-header__actions">
          <Button type="button" variant="primary" size="sm" onClick={() => setAdding(true)}>
            Add Repository
          </Button>
        </div>
      </header>
      <section className="kpi-grid" aria-label="Repository summary">
        {repositoryMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            context={metric.context}
          />
        ))}
      </section>
      {adding ? <AddRepositoryPreview onClose={() => setAdding(false)} /> : null}
      <RepositoryToolbar />
      <RepositoryTable />
      <SamplePager />
    </div>
  );
}
