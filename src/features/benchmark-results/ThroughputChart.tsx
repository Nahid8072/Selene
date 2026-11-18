import { concurrencyPoints, syntheticLabel } from "../../fixtures/benchmark-results.ts";
import { PreviewLineChart } from "./PreviewLineChart.tsx";

export function ThroughputChart() {
  const data = concurrencyPoints.map((point) => ({
    label: String(point.concurrency),
    git: point.gitThroughput,
    selene: point.seleneThroughput,
  }));
  return (
    <section className="panel" aria-labelledby="throughput-chart">
      <h2 id="throughput-chart">Throughput</h2>
      <p className="section-note">{syntheticLabel} Median of completed trial rows at each concurrency.</p>
      <PreviewLineChart
        data={data}
        unit="ops/s"
        domain={[0, 2]}
        ticks={[0, 0.5, 1, 1.5, 2]}
        lines={[
          { key: "git", name: "Git", stroke: "var(--selene-chart-2)" },
          { key: "selene", name: "Selene", stroke: "var(--selene-chart-1)" },
        ]}
      />
    </section>
  );
}
