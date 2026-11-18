import { concurrencyPoints, syntheticLabel } from "../../fixtures/benchmark-results.ts";
import { PreviewLineChart } from "./PreviewLineChart.tsx";

export function ResourceComparisonChart() {
  const data = concurrencyPoints.map((point) => ({
    label: String(point.concurrency),
    git: point.gitCpu,
    selene: point.seleneCpu,
  }));
  return (
    <section className="panel" aria-labelledby="resource-chart">
      <h2 id="resource-chart">Resource utilization</h2>
      <p className="section-note">
        {syntheticLabel} CPU median of completed trial rows. Memory stays in the trial table so this axis stays in percent.
      </p>
      <PreviewLineChart
        data={data}
        unit="percent CPU"
        domain={[0, 100]}
        ticks={[0, 25, 50, 75, 100]}
        lines={[
          { key: "git", name: "Git CPU", stroke: "var(--selene-chart-2)" },
          { key: "selene", name: "Selene CPU", stroke: "var(--selene-chart-1)" },
        ]}
      />
      <h3>Memory</h3>
      <PreviewLineChart
        data={concurrencyPoints.map((point) => ({
          label: String(point.concurrency),
          git: point.gitMemory,
          selene: point.seleneMemory,
        }))}
        unit="GB"
        domain={[0, 8]}
        ticks={[0, 2, 4, 6, 8]}
        lines={[
          { key: "git", name: "Git memory", stroke: "var(--selene-chart-2)" },
          { key: "selene", name: "Selene memory", stroke: "var(--selene-chart-1)" },
        ]}
      />
    </section>
  );
}
