import { metricAxis, metricOptions, metricSeries, observabilityNotice, type MetricId } from "../../fixtures/observability.ts";
import { PreviewLineChart } from "../benchmark-results/PreviewLineChart.tsx";

export function MetricsChart({ metric, range }: { metric: MetricId; range: string }) {
  const selected = metricOptions.find((option) => option.value === metric) ?? metricOptions[0];
  const data = metricSeries[selected.value].map((point) => ({ label: point.label, value: point.value }));
  const axis = metricAxis[selected.value];
  return (
    <div>
      <h2 id="metrics-chart">{selected.label}</h2>
      <p className="section-note">
        {observabilityNotice} Plotted window 16:00–21:00. The {range} control does not load another sample.
      </p>
      <PreviewLineChart
        data={data}
        unit={selected.unit}
        domain={[0, axis.top]}
        ticks={axis.ticks}
        lines={[{ key: "value", name: selected.label, stroke: "var(--selene-chart-1)" }]}
      />
    </div>
  );
}
