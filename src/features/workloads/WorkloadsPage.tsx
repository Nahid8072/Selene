import { Button, Input, Select } from "@sakaniui/react";
import { IconSearch } from "@sakaniui/react/icons";
import { MetricCard } from "../overview/MetricCard.tsx";
import {
  workloadMetrics,
  workloadRepositories,
  workloadRows,
  workloadStatusOptions,
  workloadTypeOptions,
} from "../../fixtures/workloads.ts";
import { WorkloadCreationPreview } from "./WorkloadCreationPreview.tsx";
import { WorkloadTable } from "./WorkloadTable.tsx";

export default function WorkloadsPage() {
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Workloads</h1>
          <p>Manage and monitor batches of repository operations across your agent infrastructure.</p>
        </div>
        <div className="page-header__actions">
          <Button type="button" variant="primary" size="sm" disabled>
            Launch Workload
          </Button>
        </div>
      </header>
      <p className="section-note">
        A workload is a job or group of repository operations, such as provisioning workspaces, repository queries, or benchmarks.
      </p>
      <section className="kpi-grid kpi-grid--five" aria-label="Workload summary">
        {workloadMetrics.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} value={metric.value} context={metric.context} />
        ))}
      </section>
      <div className="repo-toolbar" aria-label="Workload filters">
        <div className="repo-toolbar__search">
          <Input
            size="sm"
            disabled
            placeholder="Search workloads"
            aria-label="Search workloads"
            leadingIcon={<IconSearch size={16} aria-hidden />}
            value=""
          />
        </div>
        <div className="repo-toolbar__filter">
          <Select label="Status" size="sm" disabled placeholder="Any" options={workloadStatusOptions} />
        </div>
        <div className="repo-toolbar__filter">
          <Select label="Type" size="sm" disabled placeholder="Any" options={workloadTypeOptions} />
        </div>
        <div className="repo-toolbar__filter">
          <Select
            label="Repository"
            size="sm"
            disabled
            placeholder="Any"
            options={workloadRepositories.map((name) => ({ value: name, label: name }))}
          />
        </div>
      </div>
      <p className="detail-note">
        Agents requested is the configured concurrency. Active jobs is how many are running in this sample.
      </p>
      <WorkloadTable rows={workloadRows} />
      <WorkloadCreationPreview />
    </div>
  );
}
