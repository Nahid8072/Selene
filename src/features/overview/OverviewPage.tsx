import { Alert } from "@sakaniui/react";
import { ActiveWorkloadsTable } from "./ActiveWorkloadsTable.tsx";
import { CacheHealthPanel } from "./CacheHealthPanel.tsx";
import { MetricCard } from "./MetricCard.tsx";
import { InfrastructureHealth } from "./InfrastructureHealth.tsx";
import { PageHeader } from "./PageHeader.tsx";
import { RecentActivity } from "./RecentActivity.tsx";
import { RepositoryOperationsChart } from "./RepositoryOperationsChart.tsx";
import { overviewModel } from "../../fixtures/overview.ts";

export default function OverviewPage() {
  return (
    <div className="page-stack">
      <Alert
        color="neutral"
        title="Sample fixture"
        description="Deterministic sample for a single host. These figures are not live measurements, and the actions on this page are inactive."
      />
      <PageHeader />
      <section className="kpi-grid" aria-label="Summary">
        {overviewModel.metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            context={metric.context}
          />
        ))}
      </section>
      <div className="split">
        <RepositoryOperationsChart />
        <CacheHealthPanel />
      </div>
      <InfrastructureHealth />
      <div className="split">
        <ActiveWorkloadsTable />
        <RecentActivity />
      </div>
    </div>
  );
}
