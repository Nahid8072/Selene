import { Fragment, useState } from "react";
import { EmptyState, IconButton } from "@sakaniui/react";
import { IconChevronDown } from "@sakaniui/react/icons";
import { Link } from "react-router";
import { formatWhen, shortenIdentifier, unavailable } from "../../api/format.ts";
import type { WorkspaceRecord } from "../../api/selene.ts";
import { WorkspaceRowDetails } from "./WorkspaceRowDetails.tsx";
import { WorkspaceStatusBadge } from "./WorkspaceStatusBadge.tsx";

function Identifier({ value }: { value: string }) {
  return (
    <span className="cell-clip" title={value}>
      <span aria-hidden="true">{shortenIdentifier(value)}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

function Clip({ value }: { value: string }) {
  return (
    <span className="cell-clip" title={value}>
      {value}
    </span>
  );
}

export function WorkspaceTable({ rows }: { rows: WorkspaceRecord[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <EmptyState
        type="no-data"
        title="No workspace records"
        description="The control plane has no workspace rows. Benchmark-owned checkouts are not stored as workspaces."
      />
    );
  }

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="workspace-record-table">
      <table>
        <colgroup>
          <col className="col-toggle" />
          <col className="col-id" />
          <col className="col-name" />
          <col className="col-repo" />
          <col className="col-commit" />
          <col className="col-status" />
          <col className="col-created" />
          <col className="col-agent" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Details</span>
            </th>
            <th scope="col">Workspace ID</th>
            <th scope="col">Name</th>
            <th scope="col">Repository ID</th>
            <th scope="col">Base commit</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">Agent label</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const open = openId === row.id;
            const detailId = `workspace-detail-${row.id}`;
            const created = formatWhen(row.created_at);
            return (
              <Fragment key={row.id}>
                <tr
                  className={open ? "workspace-record-table__row is-open" : "workspace-record-table__row"}
                  onClick={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest("a, button")) return;
                    toggle(row.id);
                  }}
                >
                  <td>
                    <IconButton
                      icon={IconChevronDown}
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-expanded={open}
                      aria-controls={detailId}
                      aria-label={open ? `Collapse ${row.name}` : `Expand ${row.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggle(row.id);
                      }}
                    />
                  </td>
                  <td>
                    <Link className="row-link cell-clip" to={`/workspaces/${row.id}`} title={row.id}>
                      <span aria-hidden="true">{shortenIdentifier(row.id)}</span>
                      <span className="sr-only">{row.id}</span>
                    </Link>
                  </td>
                  <td>
                    <Clip value={row.name || unavailable()} />
                  </td>
                  <td>
                    <Identifier value={row.repository_id} />
                  </td>
                  <td>
                    <Identifier value={row.base_commit} />
                  </td>
                  <td>
                    <span className="workspace-record-table__status" title={row.status}>
                      <WorkspaceStatusBadge status={row.status} />
                    </span>
                  </td>
                  <td>
                    <Clip value={created} />
                  </td>
                  <td>
                    <Clip value={row.agent_label ?? unavailable()} />
                  </td>
                </tr>
                {open ? (
                  <tr className="workspace-record-table__detail">
                    <td colSpan={8}>
                      <div id={detailId}>
                        <WorkspaceRowDetails seed={row} />
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
