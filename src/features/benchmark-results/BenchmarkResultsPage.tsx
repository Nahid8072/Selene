import { useState } from "react";
import { syntheticLabel } from "../../fixtures/benchmark-results.ts";
import { BenchmarkExportPanel } from "./BenchmarkExportPanel.tsx";
import { BenchmarkSummary } from "./BenchmarkSummary.tsx";
import { ComparativeMetricTable } from "./ComparativeMetricTable.tsx";
import { ConcurrencyAnalysis } from "./ConcurrencyAnalysis.tsx";
import { NetworkComparisonChart } from "./NetworkComparisonChart.tsx";
import { ResourceComparisonChart } from "./ResourceComparisonChart.tsx";
import { StatisticalSummary } from "./StatisticalSummary.tsx";
import { ThroughputChart } from "./ThroughputChart.tsx";
import { TrialResultsTable } from "./TrialResultsTable.tsx";

export default function BenchmarkResultsPage() {
  const [view, setView] = useState("all");
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Benchmark Results</h1>
          <p>Evaluate repository access efficiency, cache performance and infrastructure resource consumption across controlled experiments.</p>
        </div>
      </header>
      <p className="section-note">{syntheticLabel}</p>
      <BenchmarkSummary view={view} onView={setView} />
      <ComparativeMetricTable />
      <section className="panel" aria-labelledby="performance-comparisons">
        <h2 id="performance-comparisons">Performance comparisons</h2>
        <div className="detail-layout">
          <NetworkComparisonChart />
          <ThroughputChart />
        </div>
        <ResourceComparisonChart />
      </section>
      <ConcurrencyAnalysis />
      <TrialResultsTable view={view} />
      <StatisticalSummary />
      <BenchmarkExportPanel />
    </div>
  );
}
