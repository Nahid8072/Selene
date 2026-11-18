import { MetricCard } from "../overview/MetricCard.tsx";
import { executionPreview } from "../../fixtures/benchmarks.ts";

const metrics = [
  { title: "Current progress", value: executionPreview.progress, context: "Not started. This number does not change." },
  { title: "Active workers", value: executionPreview.workers, context: "No worker is running." },
  { title: "Queued jobs", value: executionPreview.queued, context: "No job is queued." },
  { title: "Successful operations", value: executionPreview.successful, context: "No operation has been counted." },
  { title: "Failed operations", value: executionPreview.failed, context: "No operation has been counted." },
];

export function ExecutionPreview() {
  return (
    <section className="panel" aria-labelledby="execution-preview">
      <h2 id="execution-preview">Illustrative Execution Preview — Not Running</h2>
      <p className="section-note">
        Static sample. Measured results, including any comparison of Selene and conventional Git, belong on Benchmark
        Results. This preview does not claim a speedup.
      </p>
      <div className="kpi-grid kpi-grid--five">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} value={metric.value} context={metric.context} />
        ))}
      </div>
      <p className="detail-note">Live performance panels are empty. No measurement is available until a run exists.</p>
    </section>
  );
}
