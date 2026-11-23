import { useEffect, useState } from "react";
import { Alert, Button } from "@sakaniui/react";
import { Link } from "react-router";
import { SeleneApiError } from "../../api/client.ts";
import { formatWhen, unavailable } from "../../api/format.ts";
import { getWorkspace, type WorkspaceRecord } from "../../api/selene.ts";
import { WorkspaceStatusBadge } from "./WorkspaceStatusBadge.tsx";

function text(value: string | null | undefined): string {
  if (value == null || value === "") return unavailable();
  return value;
}

function count(value: number | null): string {
  return value == null ? unavailable() : String(value);
}

export function WorkspaceRowDetails({ seed }: { seed: WorkspaceRecord }) {
  const [record, setRecord] = useState<WorkspaceRecord>(seed);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getWorkspace(seed.id)
      .then((next) => {
        if (cancelled) return;
        setRecord(next);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof SeleneApiError ? cause.code : "request_failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, seed.id]);

  const fields: { label: string; value: string; mono?: boolean }[] = [
    { label: "Workspace ID", value: record.id, mono: true },
    { label: "Name", value: text(record.name) },
    { label: "Repository ID", value: record.repository_id, mono: true },
    { label: "Base commit", value: record.base_commit, mono: true },
    { label: "Status", value: record.status },
    { label: "Created", value: formatWhen(record.created_at) },
    { label: "Agent label", value: text(record.agent_label) },
    { label: "Branch", value: text(record.branch_name) },
    { label: "HEAD", value: text(record.head_sha), mono: true },
    { label: "Node", value: text(record.node_id) },
    { label: "Ready", value: formatWhen(record.ready_at) },
    { label: "Destroyed", value: formatWhen(record.destroyed_at) },
    { label: "Lease", value: text(record.cache_lease_id), mono: true },
    { label: "Changed paths", value: count(record.changed_path_count) },
    { label: "Uncommitted paths", value: count(record.uncommitted_path_count) },
    { label: "Freshness", value: text(record.freshness) },
    { label: "Error code", value: text(record.error_code) },
    { label: "Error message", value: text(record.error_message) },
  ];

  return (
    <div className="workspace-detail">
      <div className="workspace-detail__head">
        <p>Database workspace record. Not a benchmark checkout.</p>
        <Link to={`/workspaces/${record.id}`}>Open workspace</Link>
      </div>
      {loading ? <p className="section-note">Loading workspace details.</p> : null}
      {error ? (
        <div className="workspace-detail__error">
          <Alert color="danger" title="Workspace details could not be loaded" description={error} />
          <Button type="button" size="sm" variant="outline" onClick={() => setAttempt((value) => value + 1)}>
            Retry
          </Button>
        </div>
      ) : null}
      <dl className="workspace-detail__grid">
        {fields.map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd className={field.mono ? "commit-sha" : undefined}>
              {field.label === "Status" ? <WorkspaceStatusBadge status={field.value} /> : field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
