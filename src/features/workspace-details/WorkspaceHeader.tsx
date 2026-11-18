import { Alert, Button } from "@sakaniui/react";
import { Link } from "react-router";
import type { WorkspaceDetail } from "../../fixtures/workspace-details.ts";
import { WorkspaceStatusBadge } from "../workspaces/WorkspaceStatusBadge.tsx";

export function WorkspaceHeader({ detail }: { detail: WorkspaceDetail }) {
  return (
    <header className="panel">
      <nav className="crumb" aria-label="Breadcrumb">
        <Link to="/workspaces">Agent Workspaces</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{detail.id}</span>
      </nav>
      <div className="page-header">
        <div>
          <h1>{detail.id}</h1>
          <p>
            {detail.agent} · {detail.repository}
          </p>
        </div>
        <WorkspaceStatusBadge status={detail.status} />
      </div>
      <dl className="detail-meta">
        <div>
          <dt>Workspace ID</dt>
          <dd className="commit-sha">{detail.id}</dd>
        </div>
        <div>
          <dt>Agent ID</dt>
          <dd>{detail.agent}</dd>
        </div>
        <div>
          <dt>Repository</dt>
          <dd>{detail.repository}</dd>
        </div>
        <div>
          <dt>Branch</dt>
          <dd>{detail.branch}</dd>
        </div>
        <div>
          <dt>Base commit</dt>
          <dd className="commit-sha">{detail.baseCommit}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{detail.status}</dd>
        </div>
        <div>
          <dt>Created at</dt>
          <dd>{detail.createdAt}</dd>
        </div>
        <div>
          <dt>Host node</dt>
          <dd>{detail.node}</dd>
        </div>
        <div>
          <dt>Directory or mount</dt>
          <dd>{detail.mount}</dd>
        </div>
      </dl>
      <div className="detail-actions" aria-label="Workspace detail actions">
        <Button type="button" variant="secondary" size="sm" disabled>
          Stop
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled>
          Restart
        </Button>
        <Button type="button" variant="outline" size="sm" disabled>
          Destroy
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            document.getElementById("workspace-logs")?.scrollIntoView({ block: "start" });
          }}
        >
          Inspect Logs
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled>
          Compare with Base Commit
        </Button>
      </div>
      {detail.failure ? <Alert color="danger" title="Provisioning failed" description={detail.failure} /> : null}
      {detail.cleanup ? <p className="detail-note">Cleanup: {detail.cleanup}</p> : null}
    </header>
  );
}
