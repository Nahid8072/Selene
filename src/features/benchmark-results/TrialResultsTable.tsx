import { Badge, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { previewTrials, syntheticLabel, type PreviewTrial } from "../../fixtures/benchmark-results.ts";

interface Row {
  id: string;
  system: string;
  concurrency: string;
  cache: string;
  checkout: string;
  network: string;
  throughput: string;
  cpu: string;
  memory: string;
  status: string;
}

const columns: TableColumn<Row>[] = [
  { key: "id", header: "Trial ID", render: (row) => <span className="commit-sha">{row.id}</span> },
  { key: "system", header: "System" },
  { key: "concurrency", header: "Concurrency", align: "right" },
  { key: "cache", header: "Cache state" },
  { key: "checkout", header: "Checkout time", align: "right" },
  { key: "network", header: "Network transferred", align: "right" },
  { key: "throughput", header: "Throughput", align: "right" },
  { key: "cpu", header: "CPU", align: "right" },
  { key: "memory", header: "Memory", align: "right" },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={row.status === "failed" ? "danger" : "neutral"}>{row.status}</Badge>,
  },
];

function cell(value: number | null, suffix: string): string {
  return value === null ? "—" : `${value}${suffix}`;
}

function toRow(trial: PreviewTrial): Row {
  return {
    id: trial.id,
    system: trial.system,
    concurrency: String(trial.concurrency),
    cache: trial.cache,
    checkout: cell(trial.checkoutMs, " ms"),
    network: cell(trial.networkMb, " MB"),
    throughput: cell(trial.throughput, " ops/s"),
    cpu: cell(trial.cpu, "%"),
    memory: cell(trial.memoryGb, " GB"),
    status: trial.status,
  };
}

export function TrialResultsTable({ view }: { view: string }) {
  const source = view === "completed" ? previewTrials.filter((trial) => trial.status === "completed") : previewTrials;
  return (
    <section className="panel" aria-labelledby="trial-results">
      <h2 id="trial-results">Individual trial results</h2>
      <p className="section-note">{syntheticLabel} Failed trials stay in the full list. The preview selector does not create a run.</p>
      <div className="span-table trial-table">
        <Table columns={columns} rows={source.map(toRow)} rowKey={(row) => row.id} bordered responsive="default" />
      </div>
    </section>
  );
}
