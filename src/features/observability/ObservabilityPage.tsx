import { useState } from "react";
import { SegmentedControl, Tabs } from "@sakaniui/react";
import { metricOptions, type MetricId } from "../../fixtures/observability.ts";
import { AlertList } from "./AlertList.tsx";
import { EventMonitor } from "./EventMonitor.tsx";
import { LogExplorer } from "./LogExplorer.tsx";
import { MetricSelector } from "./MetricSelector.tsx";
import { MetricsChart } from "./MetricsChart.tsx";
import { ObservabilityOverview } from "./ObservabilityOverview.tsx";
import { TraceSpanDetails } from "./TraceSpanDetails.tsx";
import { TraceWaterfall } from "./TraceWaterfall.tsx";

const sections = [
  { value: "metrics", label: "Metrics" },
  { value: "logs", label: "Logs" },
  { value: "traces", label: "Traces" },
  { value: "events", label: "Events" },
];

const ranges = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
];

export default function ObservabilityPage() {
  const [section, setSection] = useState("metrics");
  const [metric, setMetric] = useState<MetricId>(metricOptions[0].value);
  const [range, setRange] = useState("24h");
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Observability</h1>
          <p>Inspect infrastructure metrics, structured logs, distributed traces and system events across Selene.</p>
        </div>
      </header>
      <ObservabilityOverview />
      <Tabs items={sections} value={section} onChange={setSection} />
      {section === "metrics" ? (
        <section className="panel" aria-labelledby="metrics-explorer">
          <h2 id="metrics-explorer">Metrics explorer</h2>
          <SegmentedControl options={ranges} value={range} onChange={setRange} />
          <MetricSelector value={metric} onChange={setMetric} />
          <MetricsChart metric={metric} range={range} />
        </section>
      ) : null}
      {section === "logs" ? <LogExplorer /> : null}
      {section === "traces" ? (
        <>
          <TraceWaterfall />
          <TraceSpanDetails />
        </>
      ) : null}
      {section === "events" ? <EventMonitor /> : null}
      <AlertList />
    </div>
  );
}
