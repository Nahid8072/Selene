import { Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { concurrencyPoints, syntheticLabel } from "../../fixtures/benchmark-results.ts";
import { LatencyComparisonChart } from "./LatencyComparisonChart.tsx";

interface Row {
  concurrency: string;
  latency: string;
  throughput: string;
  cpu: string;
}

const columns: TableColumn<Row>[] = [
  { key: "concurrency", header: "Concurrency" },
  { key: "latency", header: "Checkout median, ms" },
  { key: "throughput", header: "Throughput median, ops/s" },
  { key: "cpu", header: "CPU median, %" },
];

export function ConcurrencyAnalysis() {
  const rows = concurrencyPoints.map((point) => ({
    concurrency: String(point.concurrency),
    latency: `${point.gitCheckout} Git · ${point.seleneCheckout} Selene`,
    throughput: `${point.gitThroughput} Git · ${point.seleneThroughput} Selene`,
    cpu: `${point.gitCpu} Git · ${point.seleneCpu} Selene`,
  }));
  return (
    <section className="panel" aria-labelledby="concurrency-analysis">
      <h2 id="concurrency-analysis">Performance under increasing concurrency</h2>
      <p className="section-note">
        {syntheticLabel} Levels 1, 10, 25, 50, and 100. Each cell is the median of the completed trial rows at that
        level. This is not a ranking.
      </p>
      <LatencyComparisonChart />
      <div className="cache-table">
        <Table columns={columns} rows={rows} rowKey={(row) => row.concurrency} bordered responsive="default" />
      </div>
    </section>
  );
}
