import { Button } from "@sakaniui/react";
import { Link } from "react-router";
import type { WorkloadDetail } from "../../fixtures/workload-details.ts";
import { WorkloadStatusBadge } from "../workloads/WorkloadStatusBadge.tsx";

export function WorkloadDetailHeader({ detail }: { detail: WorkloadDetail }) {
  return (
    <header className="panel">
      <nav className="crumb" aria-label="Breadcrumb">
        <Link to="/workloads">Workloads</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{detail.id}</span>
      </nav>
      <div className="page-header">
        <div>
          <h1>{detail.id}</h1>
          <p>
            {detail.name} · {detail.type}
          </p>
        </div>
        <WorkloadStatusBadge status={detail.status} />
      </div>
      <dl className="detail-meta">
        <div>
          <dt>Workload ID</dt>
          <dd className="commit-sha">{detail.id}</dd>
        </div>
        <div>
          <dt>Name</dt>
          <dd>{detail.name}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{detail.type}</dd>
        </div>
        <div>
          <dt>Repository</dt>
          <dd>{detail.repository}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{detail.status}</dd>
        </div>
        <div>
          <dt>Start time</dt>
          <dd>{detail.startedAt}</dd>
        </div>
        <div>
          <dt>Requested agents</dt>
          <dd>{detail.agentsRequested}</dd>
        </div>
        <div>
          <dt>Concurrency limit</dt>
          <dd>{detail.concurrencyLimit}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{detail.duration}</dd>
        </div>
      </dl>
      <div className="detail-actions" aria-label="Workload detail actions">
        <Button type="button" variant="outline" size="sm" disabled>
          Cancel Workload
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled>
          Retry Failed Jobs
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled>
          Export Logs
        </Button>
      </div>
    </header>
  );
}
