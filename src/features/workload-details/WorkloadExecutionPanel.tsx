import { Badge, Card, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import type { WorkloadExecution, WorkloadLogLine } from "../../fixtures/workload-details.ts";

const columns: TableColumn<WorkloadLogLine>[] = [
  { key: "timestamp", header: "Timestamp" },
  {
    key: "severity",
    header: "Severity",
    render: (row) => (
      <Badge variant={row.severity === "error" ? "danger" : row.severity === "warning" ? "warning" : "neutral"}>
        {row.severity}
      </Badge>
    ),
  },
  { key: "source", header: "Source" },
  { key: "message", header: "Message" },
];

export function WorkloadExecutionPanel({ execution }: { execution: WorkloadExecution }) {
  return (
    <section className="panel" aria-labelledby="execution-details">
      <div>
        <h2 id="execution-details">Execution details</h2>
        <p className="section-note">
          Sample record for {execution.jobId}. This panel does not inspect a live job.
        </p>
      </div>
      <Card title="Request logs" description="Lines recorded for this sample job.">
        <div className="log-view">
          <Table columns={columns} rows={execution.requestLogs} rowKey={(row) => row.id} bordered={false} responsive="default" />
        </div>
      </Card>
      <dl className="detail-meta">
        <div>
          <dt>Cache response</dt>
          <dd>{execution.cacheResponse}</dd>
        </div>
        <div>
          <dt>Network transfer</dt>
          <dd>{execution.networkTransfer}</dd>
        </div>
        <div>
          <dt>Retry</dt>
          <dd>{execution.retry}</dd>
        </div>
        <div>
          <dt>Failure</dt>
          <dd>{execution.failure}</dd>
        </div>
      </dl>
    </section>
  );
}
