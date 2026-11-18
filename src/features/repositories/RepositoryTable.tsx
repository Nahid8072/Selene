import { Badge, Card, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { Link } from "react-router";
import { RepositoryRowActions } from "./RepositoryRowActions.tsx";
import { formatBytes } from "../../lib/format.ts";
import { repositoryCacheRows } from "../../fixtures/cache.ts";
import { repositoryRows } from "../../fixtures/repositories.ts";
import type { RepositoryRow } from "../../fixtures/repositories.ts";
import type { RepositoryStatus } from "../../types/domain.ts";

function statusVariant(
  status: RepositoryStatus,
): "success" | "warning" | "danger" | "info" | "neutral" {
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

type DisplayRow = RepositoryRow & { size: string; cache_status: "Cached" | "Partially cached" | "Uncached"; actions?: never };

function displayRows(): DisplayRow[] {
  return repositoryRows.map((row) => {
    const cached = repositoryCacheRows.find((item) => item.repository === row.name);
    const cache_status = !cached || cached.bytes === 0 ? "Uncached" : row.status === "ready" ? "Cached" : "Partially cached";
    return { ...row, size: cached && cached.bytes > 0 ? formatBytes(cached.bytes) : "—", cache_status };
  });
}

const columns: TableColumn<DisplayRow>[] = [
  {
    key: "name",
    header: "Name",
    width: "12%",
    render: (row) => (
      <Link className="repo-link" to={`/repositories/${row.id}`}>
        {row.name}
      </Link>
    ),
  },
  { key: "provider", header: "Git provider", width: "11%" },
  { key: "default_branch", header: "Default branch", width: "11%" },
  {
    key: "pinned_commit",
    header: "Latest pinned commit",
    width: "15%",
    render: (row) => <span className="commit-sha">{row.pinned_commit}</span>,
  },
  {
    key: "status",
    header: "Sync status",
    width: "12%",
    render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>,
  },
  { key: "last_sync", header: "Last synchronization", width: "12%" },
  { key: "size", header: "Size", align: "right", width: "9%" },
  { key: "object_count", header: "Object count", align: "right", width: "10%" },
  {
    key: "cache_status",
    header: "Cache status",
    width: "12%",
    render: (row) => (
      <Badge variant={row.cache_status === "Cached" ? "success" : row.cache_status === "Partially cached" ? "warning" : "neutral"}>
        {row.cache_status}
      </Badge>
    ),
  },
  { key: "linked_workspaces", header: "Linked workspaces", align: "right", width: "10%" },
  { key: "actions", header: "Actions", width: "8rem", render: (row) => <RepositoryRowActions row={row} /> },
];

export function RepositoryTable() {
  return (
    <div className="repo-table">
      <Card>
        <Table
          columns={columns}
          rows={displayRows()}
          rowKey={(row) => row.id}
          bordered={false}
          responsive="auto"
        />
      </Card>
    </div>
  );
}
