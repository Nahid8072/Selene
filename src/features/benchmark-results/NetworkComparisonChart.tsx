import { concurrencyPoints, syntheticLabel } from "../../fixtures/benchmark-results.ts";
import { PreviewLineChart } from "./PreviewLineChart.tsx";

export function NetworkComparisonChart() {
  const data = concurrencyPoints.map((point) => ({
    label: String(point.concurrency),
    git: point.gitNetwork,
    selene: point.seleneNetwork,
  }));
  return (
    <section className="panel" aria-labelledby="network-transfer">
      <h2 id="network-transfer">Network transfer</h2>
      <p className="section-note">{syntheticLabel} Median of completed trial rows at each concurrency.</p>
      <PreviewLineChart
        data={data}
        unit="MB"
        domain={[0, 120]}
        ticks={[0, 30, 60, 90, 120]}
        lines={[
          { key: "git", name: "Git", stroke: "var(--selene-chart-2)" },
          { key: "selene", name: "Selene", stroke: "var(--selene-chart-1)" },
        ]}
      />
    </section>
  );
}
