import { Card, Input, Select } from "@sakaniui/react";
import { workloadDraft, workloadRepositories, workloadTypeOptions } from "../../fixtures/workloads.ts";

export function WorkloadCreationPreview() {
  return (
    <Card title="Create workload" description="Preview only. This form does not submit, and no workload is launched.">
      <div className="form-grid">
        <Input
          label="Workload name"
          description="A name for this batch. The sample value is already valid."
          disabled
          value={workloadDraft.name}
        />
        <Select
          label="Repository"
          description="A registered Git source."
          disabled
          value={workloadDraft.repository}
          options={workloadRepositories.map((name) => ({ value: name, label: name }))}
        />
        <Select
          label="Operation type"
          description="fetch, workspace, query, or benchmark."
          disabled
          value={workloadDraft.operation}
          options={workloadTypeOptions}
        />
        <Input
          label="Workers"
          description="How many agents this workload asks for."
          disabled
          value={workloadDraft.workers}
        />
        <Input
          label="Concurrency limit"
          description="How many of those agents may run at once. This is not the count of active jobs."
          disabled
          value={workloadDraft.concurrency}
        />
        <Select
          label="Priority"
          description="Scheduling hint for the batch."
          disabled
          value={workloadDraft.priority}
          options={[
            { value: "low", label: "low" },
            { value: "normal", label: "normal" },
            { value: "high", label: "high" },
          ]}
        />
        <Input label="Timeout" description="Stop the batch after this long." disabled value={workloadDraft.timeout} />
        <Select
          label="Cache preference"
          description="Warm uses the local cache. Cold does not."
          disabled
          value={workloadDraft.cache}
          options={[
            { value: "warm", label: "warm" },
            { value: "cold", label: "cold" },
          ]}
        />
        <Input
          label="Group"
          description="Optional grouping for this sample."
          disabled
          value={workloadDraft.group}
        />
        <div className="form-grid__wide">
          <Card title="Summary" description="What would be requested. Nothing is sent.">
            <dl className="detail-meta">
              <div>
                <dt>Name</dt>
                <dd>{workloadDraft.name}</dd>
              </div>
              <div>
                <dt>Repository</dt>
                <dd>{workloadDraft.repository}</dd>
              </div>
              <div>
                <dt>Operation</dt>
                <dd>{workloadDraft.operation}</dd>
              </div>
              <div>
                <dt>Workers</dt>
                <dd>{workloadDraft.workers}</dd>
              </div>
              <div>
                <dt>Concurrency limit</dt>
                <dd>{workloadDraft.concurrency}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{workloadDraft.priority}</dd>
              </div>
              <div>
                <dt>Timeout</dt>
                <dd>{workloadDraft.timeout}</dd>
              </div>
              <div>
                <dt>Cache preference</dt>
                <dd>{workloadDraft.cache}</dd>
              </div>
              <div>
                <dt>Group</dt>
                <dd>{workloadDraft.group}</dd>
              </div>
            </dl>
          </Card>
        </div>
        <div className="form-grid__wide">
          <Card title="Validation example" description="Not the current sample. The fields above are valid and show no error.">
            <p className="detail-note">
              If the name were empty, the name field would show: Name is required before a workload can be requested.
            </p>
          </Card>
        </div>
      </div>
    </Card>
  );
}
