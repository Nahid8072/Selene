import { Card, Input, Select, Textarea } from "@sakaniui/react";
import { workspaceDraft, workspaceRepositories } from "../../fixtures/workspaces.ts";

export function WorkspaceConfigurationPanel() {
  return (
    <Card
      title="Create workspace"
      description="Preview only. This form does not submit, and no workspace is created."
    >
      <div className="form-grid">
        <Select
          label="Repository"
          description="Choose a registered Git source."
          disabled
          value="react"
          options={workspaceRepositories.map((name) => ({ value: name, label: name }))}
        />
        <Input
          label="Branch or commit SHA"
          description="Pin an exact commit. A branch name is resolved before provisioning."
          disabled
          value={workspaceDraft.revision}
        />
        <Input
          label="Workspace name"
          description="Unique on this node."
          disabled
          value={workspaceDraft.name}
        />
        <Input
          label="Agent identifier"
          description="The agent that will use this writable tree."
          disabled
          value={workspaceDraft.agent}
        />
        <Select
          label="Execution node"
          description="Automatic allocation, or a named node."
          disabled
          value={workspaceDraft.node}
          options={[
            { value: "automatic", label: "Automatic allocation" },
            { value: "node-a", label: "node-a" },
            { value: "node-b", label: "node-b" },
          ]}
        />
        <Input label="CPU limit" description="Resource limit, in vCPU." disabled value={workspaceDraft.cpu} />
        <Input label="Memory limit" description="Resource limit." disabled value={workspaceDraft.memory} />
        <Input label="Disk limit" description="Writable workspace quota, not the shared cache." disabled value={workspaceDraft.disk} />
        <div className="form-grid__wide">
          <Textarea
            label="Environment configuration"
            description="Non-secret settings only. Do not put tokens here."
            disabled
            value={workspaceDraft.environment}
            rows={2}
          />
        </div>
        <Input label="Group" description="Optional grouping for this sample." disabled value={workspaceDraft.group} />
        <Input label="Labels" description="Comma-separated labels." disabled value={workspaceDraft.labels} />
        <div className="form-grid__wide">
          <Card title="Review" description="What would be requested. Nothing is sent.">
            <dl className="detail-meta">
              <div>
                <dt>Repository</dt>
                <dd>{workspaceDraft.repository}</dd>
              </div>
              <div>
                <dt>Commit</dt>
                <dd className="commit-sha">{workspaceDraft.revision.slice(0, 12)}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{workspaceDraft.name}</dd>
              </div>
              <div>
                <dt>Agent</dt>
                <dd>{workspaceDraft.agent}</dd>
              </div>
              <div>
                <dt>Node</dt>
                <dd>Automatic allocation</dd>
              </div>
              <div>
                <dt>Limits</dt>
                <dd>
                  {workspaceDraft.cpu} vCPU · {workspaceDraft.memory} · {workspaceDraft.disk}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </Card>
  );
}
