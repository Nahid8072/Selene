import { Alert, Input, Select } from "@sakaniui/react";
import { IconSearch } from "@sakaniui/react/icons";
import { MetricCard } from "../overview/MetricCard.tsx";
import {
  emptyNode,
  workspaceErrors,
  workspaceMetrics,
  workspaceRepositories,
  workspaceRows,
  workspaceStatusOptions,
} from "../../fixtures/workspaces.ts";
import { WorkspaceActionMenu } from "./WorkspaceActionMenu.tsx";
import { WorkspaceConfigurationPanel } from "./WorkspaceConfigurationPanel.tsx";
import { WorkspaceIsolationPanel } from "./WorkspaceIsolationPanel.tsx";
import { WorkspaceTable } from "./WorkspaceTable.tsx";

export default function WorkspacesPage() {
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Agent Workspaces</h1>
          <p>Monitor isolated working environments provisioned for your coding agents.</p>
        </div>
      </header>
      <WorkspaceActionMenu />
      <section className="kpi-grid kpi-grid--five" aria-label="Workspace summary">
        {workspaceMetrics.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} value={metric.value} context={metric.context} />
        ))}
      </section>
      <div className="repo-toolbar" aria-label="Workspace filters">
        <div className="repo-toolbar__search">
          <Input
            size="sm"
            disabled
            placeholder="Search workspaces"
            aria-label="Search workspaces"
            leadingIcon={<IconSearch size={16} aria-hidden />}
            value=""
          />
        </div>
        <div className="repo-toolbar__filter">
          <Select
            label="Status"
            size="sm"
            disabled
            placeholder="Any"
            options={workspaceStatusOptions}
          />
        </div>
        <div className="repo-toolbar__filter">
          <Select
            label="Repository"
            size="sm"
            disabled
            placeholder="Any"
            options={workspaceRepositories.map((name) => ({ value: name, label: name }))}
          />
        </div>
      </div>
      <WorkspaceTable rows={workspaceRows} />
      {workspaceErrors.map((failure) => (
        <Alert key={failure.id} color="danger" title={`Workspace ${failure.id} failed`} description={failure.message} />
      ))}
      <p className="empty-node" id="empty-node">
        {emptyNode.label}: {emptyNode.note}
      </p>
      <WorkspaceConfigurationPanel />
      <WorkspaceIsolationPanel />
    </div>
  );
}
