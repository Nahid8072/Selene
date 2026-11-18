import { Badge, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { formatJobDuration, type JobStatus, type WorkloadJob } from "../../fixtures/workload-details.ts";

interface JobRow extends WorkloadJob {
  duration: string;
  error_details: string;
}

const columns: TableColumn<JobRow>[] = [
  { key: "id", header: "Job ID", render: (row) => <span className="commit-sha">{row.id}</span> },
  { key: "agent", header: "Agent" },
  { key: "operation", header: "Repository Operation" },
  { key: "node", header: "Execution Node" },
  { key: "duration", header: "Duration", align: "right" },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={variant(row.status)}>{row.status}</Badge>,
  },
  { key: "error_details", header: "Error Details" },
];

function variant(status: JobStatus): "success" | "danger" | "info" | "neutral" {
  switch (status) {
    case "successful":
      return "success";
    case "failed":
      return "danger";
    case "running":
      return "info";
    default:
      return "neutral";
  }
}

export function WorkloadJobTable({ jobs }: { jobs: WorkloadJob[] }) {
  const rows: JobRow[] = jobs.map((job) => ({
    ...job,
    duration: formatJobDuration(job.durationMs),
    error_details: job.error ?? "—",
  }));
  return (
    <section className="panel" aria-labelledby="workload-jobs">
      <h2 id="workload-jobs">Jobs</h2>
      <div className="job-table">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} bordered responsive="default" />
      </div>
    </section>
  );
}
