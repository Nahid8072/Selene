import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ActivityFeed,
  ActivityFeedHighlight,
  Alert,
  Badge,
  Button,
  Card,
  DonutChart,
  EmptyState,
  ProgressStat,
  Table,
  Tabs,
} from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { ConfirmationReview } from "../../components/shared/ConfirmationReview.tsx";
import { repositoryDetail } from "../../fixtures/repository-details.ts";
import type { RepositoryDetailView } from "../../fixtures/repository-details.ts";
import { SeriesChart } from "./SeriesChart.tsx";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "branches", label: "Branches" },
  { value: "commits", label: "Commit History" },
  { value: "objects", label: "Objects" },
  { value: "cache", label: "Cache" },
  { value: "activity", label: "Activity" },
];

function statusVariant(status: RepositoryDetailView["status"]): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "ready":
      return "success";
    case "degraded":
      return "warning";
    case "error":
      return "danger";
    case "syncing":
      return "info";
    default:
      return "neutral";
  }
}

const actionPreviews = [
  { id: "sync", label: "Synchronize Repository", variant: "primary" as const, consequence: "Would fetch from the remote. Confirm stays inactive, so nothing is synchronized." },
  { id: "warm", label: "Warm Cache", variant: "secondary" as const, consequence: "Would request a warm on node-a. Confirm stays inactive, so the cache is unchanged." },
  { id: "workspace", label: "Provision Workspace", variant: "secondary" as const, consequence: "Would open a workspace creation preview. Confirm stays inactive, so no workspace is created." },
  { id: "benchmark", label: "Start Benchmark", variant: "secondary" as const, consequence: "Would open Benchmark Studio. Confirm stays inactive, so no benchmark starts." },
  { id: "policy", label: "Configure Cache Policy", variant: "outline" as const, consequence: "Would show the cache policy sample. Confirm stays inactive, so the policy is not saved." },
];

function RepositoryHeader({ detail }: { detail: RepositoryDetailView }) {
  const [action, setAction] = useState<(typeof actionPreviews)[number]["id"] | null>(null);
  const selected = actionPreviews.find((item) => item.id === action);
  return (
    <header className="panel">
      <nav className="crumb" aria-label="Breadcrumb">
<<<<<<< HEAD
        <Link to="/">Fleet</Link>
=======
        <Link to="/overview">Fleet</Link>
>>>>>>> landing-page
        <span aria-hidden="true">/</span>
        <Link to="/repositories">Repositories</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{detail.name}</span>
      </nav>
      <div className="page-header">
        <div>
          <h1>{detail.name}</h1>
          <p>
            {detail.providerLabel} · {detail.connectionLabel}
          </p>
        </div>
        <Badge variant={statusVariant(detail.status)}>{detail.status}</Badge>
      </div>
      <dl className="detail-meta">
        <div>
          <dt>Repository URL</dt>
          <dd>{detail.remoteUrl}</dd>
        </div>
        <div>
          <dt>Default branch</dt>
          <dd>{detail.defaultBranch}</dd>
        </div>
        <div>
          <dt>Current commit</dt>
          <dd className="commit-sha">{detail.pinnedCommit}</dd>
        </div>
        <div>
          <dt>Repository size</dt>
          <dd>{detail.sizeLabel}</dd>
        </div>
        <div>
          <dt>Git object count</dt>
          <dd>{detail.objectLabel}</dd>
        </div>
        <div>
          <dt>Last synchronization</dt>
          <dd>{detail.lastSyncLabel}</dd>
        </div>
      </dl>
      <div className="detail-actions">
        {actionPreviews.map((item) => (
          <Button key={item.id} type="button" variant={item.variant} size="sm" onClick={() => setAction(item.id)}>
            {item.label}
          </Button>
        ))}
      </div>
      {selected ? <ConfirmationReview title={selected.label} consequence={selected.consequence} /> : null}
    </header>
  );
}

function OverviewTab({ detail }: { detail: RepositoryDetailView }) {
  return (
    <div className="page-stack">
      <div className="detail-layout">
        <Card title="Connection health" description={detail.cache.note}>
          <p className="detail-note">
            {detail.connectionLabel}. Default branch {detail.defaultBranch}. Last synchronization {detail.lastSyncLabel}.
          </p>
        </Card>
        <Card title="Synchronization" description="Sample status for this mirror.">
          <p className="detail-note">
            Status {detail.status}. Pinned commit {detail.pinnedCommit}. Object count {detail.objectLabel}. Size {detail.sizeLabel}.
          </p>
        </Card>
      </div>
      <div className="chart-grid">
        <SeriesChart
          title="Fetch frequency"
          caption="Fetches per 3-hour sample bucket."
          data={detail.series}
          dataKey="fetches"
          seriesName="Fetches"
          stroke="var(--color-chart-1)"
        />
        <SeriesChart
          title="Object retrieval volume"
          caption="Cached object reads, illustrative counts."
          data={detail.series}
          dataKey="retrievals"
          seriesName="Retrievals"
          stroke="var(--color-chart-2)"
        />
        <SeriesChart
          title="Agent activity"
          caption="Configured workers touching this repo."
          data={detail.series}
          dataKey="agents"
          seriesName="Agents"
          stroke="var(--color-chart-3)"
        />
      </div>
    </div>
  );
}

function BranchesTab({ detail }: { detail: RepositoryDetailView }) {
  const columns: TableColumn<(typeof detail.branches)[number]>[] = [
    { key: "name", header: "Branch" },
    { key: "commit", header: "Latest commit", render: (row) => <span className="commit-sha">{row.commit}</span> },
    { key: "updated", header: "Last updated" },
    { key: "isDefault", header: "Default" },
    { key: "ref", header: "Reference", render: (row) => <span className="commit-sha">{row.ref}</span> },
  ];
  return (
    <Card>
      <Table columns={columns} rows={detail.branches} rowKey={(row) => row.ref} bordered={false} responsive="auto" />
    </Card>
  );
}

function CommitsTab({ detail }: { detail: RepositoryDetailView }) {
  if (detail.commits.length === 0) {
    return (
      <EmptyState
        type="no-data"
        title="No commit history in this sample"
        description="The mirror has not recorded commits yet. Nothing is being fetched."
      />
    );
  }
  const columns: TableColumn<(typeof detail.commits)[number]>[] = [
    { key: "sha", header: "SHA", render: (row) => <span className="commit-sha">{row.sha}</span> },
    { key: "message", header: "Message" },
    { key: "author", header: "Author" },
    { key: "timestamp", header: "Timestamp" },
    { key: "ref", header: "Branch / reference" },
  ];
  return (
    <Card>
      <Table columns={columns} rows={detail.commits} rowKey={(row) => row.sha} bordered={false} responsive="auto" />
    </Card>
  );
}

function ObjectsTab({ detail }: { detail: RepositoryDetailView }) {
  if (!detail.objects || !detail.objectTotal) {
    return (
      <EmptyState
        type="no-data"
        title="Object census unavailable"
        description="Blob, tree, and commit counts appear after the mirror finishes warming."
      />
    );
  }
  return (
    <div className="detail-layout">
      <Card title="Object mix" description="Blobs, trees, and commits in the sample census.">
        <DonutChart data={detail.objects} centerValue={detail.objectTotal} centerCaption="Total objects" height={240} />
      </Card>
      <Card title="Counts">
        <dl className="detail-meta">
          {detail.objects.map((entry) => (
            <div key={entry.label}>
              <dt>{entry.label}</dt>
              <dd>{entry.value.toLocaleString("en-US")}</dd>
            </div>
          ))}
          <div>
            <dt>Total objects</dt>
            <dd>{detail.objectTotal}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

function CacheTab({ detail }: { detail: RepositoryDetailView }) {
  return (
    <Card title="Repository cache" description={detail.cache.note}>
      <div className="cache-health">
        <div className="cache-status">
          <span>Cache status</span>
          <Badge variant={statusVariant(detail.status)}>{detail.cache.state}</Badge>
        </div>
        <dl className="cache-ratio">
          <div>
            <dt>Hits</dt>
            <dd>{detail.cache.hits}</dd>
          </div>
          <div>
            <dt>Misses</dt>
            <dd>{detail.cache.misses}</dd>
          </div>
          <div>
            <dt>Hit rate</dt>
            <dd>{detail.cache.ratio}</dd>
          </div>
          <div>
            <dt>Cached storage</dt>
            <dd>{detail.cache.storage}</dd>
          </div>
        </dl>
        <ProgressStat label="Share of the 16 GB sample volume" value={detail.cache.storage} progress={detail.cache.utilization} />
      </div>
    </Card>
  );
}

function ActivityTab({ detail }: { detail: RepositoryDetailView }) {
  return (
    <Card title="Repository events" description="Synchronization, fetches, checkouts, queries, and object retrievals.">
      <ActivityFeed
        items={detail.activity.map((event) => ({
          id: event.id,
          actor: event.actor,
          description: (
            <>
              {event.action} <ActivityFeedHighlight>{event.target}</ActivityFeedHighlight>
            </>
          ),
          timestamp: event.timestamp,
        }))}
      />
    </Card>
  );
}

export default function RepositoryDetailsPage() {
  const params = useParams();
  const detail = repositoryDetail(params.id ?? "");
  const [tab, setTab] = useState("overview");

  if (!detail) {
    return (
      <div className="page-stack">
        <EmptyState
          type="no-results"
          title="Repository is not in this preview"
          description="The sample includes react, kubernetes, linux, and vscode."
        />
        <Link to="/repositories">Back to repositories</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <Alert
        color="neutral"
        title="Illustrative sample"
        description="Charts, hit rates, and event times are deterministic fixtures. They are not live measurements, and the actions on this page do not run."
      />
      <RepositoryHeader detail={detail} />
      <Tabs items={tabs} value={tab} onChange={setTab} />
      {tab === "overview" ? <OverviewTab detail={detail} /> : null}
      {tab === "branches" ? <BranchesTab detail={detail} /> : null}
      {tab === "commits" ? <CommitsTab detail={detail} /> : null}
      {tab === "objects" ? <ObjectsTab detail={detail} /> : null}
      {tab === "cache" ? <CacheTab detail={detail} /> : null}
      {tab === "activity" ? <ActivityTab detail={detail} /> : null}
    </div>
  );
}
