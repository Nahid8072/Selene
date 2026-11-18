import { Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { traceDurationMs, traceStages } from "../../fixtures/observability.ts";

interface SpanRow {
  name: string;
  start: string;
  duration: string;
  status: string;
  parent: string;
}

const columns: TableColumn<SpanRow>[] = [
  { key: "name", header: "Stage" },
  { key: "start", header: "Start", align: "right" },
  { key: "duration", header: "Duration", align: "right" },
  { key: "status", header: "Status" },
  { key: "parent", header: "Parent" },
];

export function TraceSpanDetails() {
  return (
    <section className="panel" aria-labelledby="trace-spans">
      <h2 id="trace-spans">Span details</h2>
      <p className="section-note">Durations add up to {traceDurationMs} ms. Start offsets place each child after its parent begins.</p>
      <div className="span-table">
        <Table
          columns={columns}
          rows={traceStages.map((stage) => ({
            name: stage.name,
            start: `${stage.startMs} ms`,
            duration: `${stage.durationMs} ms`,
            status: stage.status,
            parent: stage.parent,
          }))}
          rowKey={(row) => row.name}
          bordered
          responsive="default"
        />
      </div>
    </section>
  );
}
