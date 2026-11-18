import { concurrencyPoints, syntheticLabel } from "../../fixtures/benchmark-results.ts";
import { PreviewLineChart } from "./PreviewLineChart.tsx";

export function LatencyComparisonChart() {
  const data = concurrencyPoints.map((point) => ({
    label: String(point.concurrency),
    git: point.gitCheckout,
    selene: point.seleneCheckout,
  }));
  return (
    <section className="panel" aria-labelledby="checkout-latency">
      <h2 id="checkout-latency">Checkout latency</h2>
      <p className="section-note">{syntheticLabel} Median of completed trial rows at each concurrency.</p>
      <PreviewLineChart
        data={data}
        unit="ms"
        domain={[0, 2500]}
        ticks={[0, 500, 1000, 1500, 2000, 2500]}
        lines={[
          { key: "git", name: "Git", stroke: "var(--selene-chart-2)" },
          { key: "selene", name: "Selene", stroke: "var(--selene-chart-1)" },
        ]}
      />
    </section>
  );
}
