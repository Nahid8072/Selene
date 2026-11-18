import { EmptyState } from "@sakaniui/react";
import { Link, useParams } from "react-router";
import { workloadDetail } from "../../fixtures/workload-details.ts";
import { MetricCard } from "../overview/MetricCard.tsx";
import { WorkloadDetailHeader } from "./WorkloadDetailHeader.tsx";
import { WorkloadExecutionPanel } from "./WorkloadExecutionPanel.tsx";
import { WorkloadJobTable } from "./WorkloadJobTable.tsx";
import { WorkloadJobTimeline } from "./WorkloadJobTimeline.tsx";

export default function WorkloadDetailsPage() {
  const { id = "" } = useParams();
  const detail = workloadDetail(id);
  if (!detail) {
    return (
      <div className="page-stack">
        <EmptyState
          type="no-results"
          title="Workload not found"
          description={`No sample workload uses “${id}”. The list has four workloads.`}
        />
        <Link to="/workloads">Workloads</Link>
      </div>
    );
  }
  const metrics = [
    { title: "Total Jobs", value: detail.totalJobs, context: "Rows in the job table." },
    { title: "Successful", value: detail.successful, context: "Jobs that finished without an error." },
    { title: "Failed", value: detail.failed, context: "Jobs with an error detail." },
    { title: "Queued", value: detail.queued, context: "Jobs that have not started." },
    {
      title: "Average Execution Time",
      value: detail.averageExecution,
      context: "Mean of jobs that have a recorded duration. Queued jobs are omitted.",
    },
    { title: "Workload Status", value: detail.status, context: "Same status as the header." },
    { title: "Execution progress", value: detail.progress, context: detail.progressNote },
  ];
  return (
    <div className="page-stack page-stack--tight">
      <WorkloadDetailHeader detail={detail} />
      <section className="kpi-grid kpi-grid--five" aria-label="Workload job summary">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} value={metric.value} context={metric.context} />
        ))}
      </section>
      <WorkloadJobTable jobs={detail.jobs} />
      <div className="detail-layout">
        <WorkloadExecutionPanel execution={detail.execution} />
        <WorkloadJobTimeline events={detail.timeline} />
      </div>
    </div>
  );
}
