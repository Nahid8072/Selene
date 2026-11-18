import { Card } from "@sakaniui/react";
import { operationOptions, repositoryRevision } from "../../fixtures/benchmarks.ts";
import { benchmarkNode } from "../../fixtures/benchmarks.ts";
import { benchmarkRepositories } from "../../fixtures/benchmarks.ts";
import type { BenchmarkConfig } from "./BenchmarkConfigPanel.tsx";

export function ExperimentSummary({ value }: { value: BenchmarkConfig }) {
  const repository = benchmarkRepositories.find((item) => item.value === value.repositoryId)?.label ?? value.repositoryId;
  const operation = operationOptions.find((item) => item.value === value.operation)?.label ?? value.operation;
  const duration =
    value.durationMode === "duration" ? `${value.durationMinutes} min` : `${value.workloadOps} operations`;
  return (
    <Card title="Experiment methodology" description="The profile that would be sent. Nothing has been sent.">
      <dl className="detail-meta detail-meta--stack">
        <div>
          <dt>Baseline and candidate</dt>
          <dd>Conventional Git baseline. Selene candidate.</dd>
        </div>
        <div>
          <dt>Repository revision</dt>
          <dd>
            {repository} · <span className="commit-sha">{repositoryRevision(value.repositoryId)}</span>
          </dd>
        </div>
        <div>
          <dt>Concurrency</dt>
          <dd>{value.agents} agents</dd>
        </div>
        <div>
          <dt>Cache state</dt>
          <dd>{value.cache === "warm" ? "Warm Cache" : "Cold Cache"}</dd>
        </div>
        <div>
          <dt>Operation</dt>
          <dd>
            {operation}, {value.repetitions} repetitions, {duration}
          </dd>
        </div>
        <div>
          <dt>Resource constraints</dt>
          <dd>
            {value.cpu} vCPU · {value.memoryGb} GB memory · {value.diskGb} GB disk · {value.networkMbps} MB/s ·{" "}
            {benchmarkNode.id}
          </dd>
        </div>
        <div>
          <dt>Workload profile</dt>
          <dd>
            {value.overlap}% overlap · {value.access} access · branches {value.main}/{value.development}/{value.feature}{" "}
            · {value.workspaceCreation} concurrent workspaces · fetch every {value.fetchEverySec}s · query every{" "}
            {value.queryEverySec}s · failure injection {value.failureInjection ? "on" : "off"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
