import { EmptyState } from "@sakaniui/react";
import { Link, useParams } from "react-router";
import { workspaceDetail } from "../../fixtures/workspace-details.ts";
import { RepositoryStatePanel } from "./RepositoryStatePanel.tsx";
import { ResourceUsagePanel } from "./ResourceUsagePanel.tsx";
import { WorkspaceHeader } from "./WorkspaceHeader.tsx";
import { WorkspaceLogViewer } from "./WorkspaceLogViewer.tsx";
import { WorkspaceTimeline } from "./WorkspaceTimeline.tsx";

export default function WorkspaceDetailsPage() {
  const { id = "" } = useParams();
  const detail = workspaceDetail(id);
  if (!detail) {
    return (
      <div className="page-stack">
        <EmptyState
          type="no-results"
          title="Workspace not found"
          description={`No sample workspace uses “${id}”. The list has six workspaces.`}
        />
        <Link to="/workspaces">Agent Workspaces</Link>
      </div>
    );
  }
  return (
    <div className="page-stack page-stack--tight">
      <WorkspaceHeader detail={detail} />
      <ResourceUsagePanel resources={detail.resources} />
      <div className="detail-layout">
        <RepositoryStatePanel detail={detail} />
        <WorkspaceTimeline events={detail.timeline} />
      </div>
      <WorkspaceLogViewer logs={detail.logs} />
    </div>
  );
}
