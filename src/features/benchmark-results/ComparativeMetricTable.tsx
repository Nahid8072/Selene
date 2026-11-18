import { Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { gitStats, seleneStats, syntheticLabel } from "../../fixtures/benchmark-results.ts";

interface Row {
  metric: string;
  unit: string;
  git: string;
  selene: string;
}

const columns: TableColumn<Row>[] = [
  { key: "metric", header: "Metric" },
  { key: "unit", header: "Unit" },
  { key: "git", header: "Git baseline" },
  { key: "selene", header: "Selene" },
];

function oneDecimal(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const rows: Row[] = [
  { metric: "Average checkout time", unit: "ms", git: oneDecimal(gitStats.checkoutMean), selene: oneDecimal(seleneStats.checkoutMean) },
  { metric: "p95 checkout time", unit: "ms", git: String(gitStats.checkoutP95), selene: String(seleneStats.checkoutP95) },
  { metric: "Network transferred", unit: "MB", git: oneDecimal(gitStats.networkMedian), selene: oneDecimal(seleneStats.networkMedian) },
  { metric: "Throughput", unit: "ops/s", git: oneDecimal(gitStats.throughputMedian), selene: oneDecimal(seleneStats.throughputMedian) },
  { metric: "CPU consumption", unit: "percent", git: oneDecimal(gitStats.cpuMedian), selene: oneDecimal(seleneStats.cpuMedian) },
  { metric: "Memory consumption", unit: "GB", git: oneDecimal(gitStats.memoryMedian), selene: oneDecimal(seleneStats.memoryMedian) },
  { metric: "Cache hit rate", unit: "percent", git: "N/A", selene: "not measured" },
];

export function ComparativeMetricTable() {
  return (
    <section className="panel" aria-labelledby="comparative-metrics">
      <h2 id="comparative-metrics">Comparative metrics</h2>
      <p className="section-note">
        {syntheticLabel} Checkout average and p95, and the other medians, are computed from completed trial rows. There
        is no difference column and no conclusion.
      </p>
      <div className="span-table">
        <Table columns={columns} rows={rows} rowKey={(row) => row.metric} bordered responsive="default" />
      </div>
    </section>
  );
}
