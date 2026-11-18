import { Alert, Badge } from "@sakaniui/react";
import { MetricCard } from "../overview/MetricCard.tsx";
import { cacheHost, cacheMetrics, storageSummary, warningRatio } from "../../fixtures/cache.ts";
import { CacheArchitectureDiagram } from "./CacheArchitectureDiagram.tsx";
import { CacheEventFeed } from "./CacheEventFeed.tsx";
import { CacheOperationsChart } from "./CacheOperationsChart.tsx";
import { CacheOperationsPanel } from "./CacheOperationsPanel.tsx";
import { CachePolicyPanel } from "./CachePolicyPanel.tsx";
import { CacheStorageBreakdown } from "./CacheStorageBreakdown.tsx";
import { RepositoryCacheTable } from "./RepositoryCacheTable.tsx";

export default function CacheEnginePage() {
  const warning = storageSummary.usedRatio >= warningRatio * 100;
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Cache Engine</h1>
          <p>Monitor shared Git object caching, storage efficiency and repository data retrieval across your infrastructure.</p>
        </div>
      </header>
      <Alert
        color="neutral"
        title="Illustrative data"
        description="These figures are a deterministic sample for node-a. They are not a live measurement."
      />
      <section className="kpi-grid kpi-grid--five" aria-label="Cache summary">
        {cacheMetrics.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} value={metric.value} context={metric.context} />
        ))}
      </section>
      <CacheArchitectureDiagram />
      <div className="detail-layout">
        <CacheStorageBreakdown />
        <CacheOperationsChart />
      </div>
      {warning ? (
        <Alert
          color="warning"
          title="Capacity warning"
          description={`Used capacity is ${storageSummary.usedRatio}%, above the 80% sample threshold. Free space is ${storageSummary.free}. This page does not evict anything.`}
        />
      ) : null}
      <RepositoryCacheTable />
      <div className="detail-layout">
        <CachePolicyPanel />
        <CacheOperationsPanel />
      </div>
      <div className="detail-layout">
        <CacheEventFeed />
        <section className="panel" aria-labelledby="cache-health">
          <div className="panel__head">
            <h2 id="cache-health">Health</h2>
            <Badge variant="success">healthy</Badge>
          </div>
          <p className="detail-note">
            {cacheHost} is the only cache host in this sample. It is serving lookups. Regional cache is future and
            unconfigured, so there is no second tier to fail over to.
          </p>
        </section>
      </div>
    </div>
  );
}
