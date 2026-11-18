import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Menu, MenuItem } from "@sakaniui/react";
import { ReviewDialog } from "../../components/shared/ReviewDialog.tsx";
import type { RepositoryRow } from "../../fixtures/repositories.ts";

type ActionId = "sync" | "warm" | "workspace" | "benchmark" | "remove";

const copy: Record<ActionId, { title: string; happens: string; impact: string; configuration: string }> = {
  sync: {
    title: "Synchronize",
    happens: "Would ask the remote for a new mirror of this repository.",
    impact: "node-a would read upstream Git. Existing workspaces would keep their current trees.",
    configuration: "Default branch and pinned commit from this row. No credential is sent.",
  },
  warm: {
    title: "Warm cache",
    happens: "Would request a warm of cached objects for this repository on node-a.",
    impact: "A miss could still go upstream. The 120.0 GB cache sample would not change.",
    configuration: "Warming rule from the cache sample. linux stays manual. vscode stays off while syncing.",
  },
  workspace: {
    title: "Create workspace",
    happens: "Would show a workspace configuration for an isolated writable tree.",
    impact: "No directory is created. Shared Git objects would not become a shared writable workspace.",
    configuration: "Sample limits: 2 vCPU, 4 GB memory, 20 GB writable disk, node-a.",
  },
  benchmark: {
    title: "Run benchmark",
    happens: "Would show the benchmark configuration for this repository.",
    impact: "No trial is started. The 30 synthetic result rows stay as they are.",
    configuration: "Conventional Git and Selene, warm cache, checkout, 3 repetitions, node-a.",
  },
  remove: {
    title: "Remove connection",
    happens: "Would disconnect this repository from the sample registry.",
    impact: "Workspaces that name it would lose their listed source. Cached objects on node-a would remain until a separate clear.",
    configuration: "Destructive review. Confirm stays disabled, so the connection remains.",
  },
};

export function RepositoryRowActions({ row }: { row: RepositoryRow }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ActionId | null>(null);
  const selected = action ? copy[action] : null;
  return (
    <div className="row-menu">
      <Button type="button" size="sm" variant="outline" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        Actions
      </Button>
      {open ? (
        <Menu aria-label={`Actions for ${row.name}`}>
          <MenuItem
            onSelect={() => {
              setOpen(false);
              navigate(`/repositories/${row.id}`);
            }}
          >
            View Repository
          </MenuItem>
          <MenuItem
            onSelect={() => {
              setOpen(false);
              setAction("sync");
            }}
          >
            Synchronize
          </MenuItem>
          <MenuItem
            onSelect={() => {
              setOpen(false);
              setAction("warm");
            }}
          >
            Warm Cache
          </MenuItem>
          <MenuItem
            onSelect={() => {
              setOpen(false);
              setAction("workspace");
            }}
          >
            Create Workspace
          </MenuItem>
          <MenuItem
            onSelect={() => {
              setOpen(false);
              setAction("benchmark");
            }}
          >
            Run Benchmark
          </MenuItem>
          <MenuItem
            state="destructive"
            onSelect={() => {
              setOpen(false);
              setAction("remove");
            }}
          >
            Remove Connection
          </MenuItem>
        </Menu>
      ) : null}
      {selected ? (
        <ReviewDialog
          title={selected.title}
          target={row.name}
          happens={selected.happens}
          impact={selected.impact}
          configuration={selected.configuration}
          onClose={() => setAction(null)}
        />
      ) : null}
    </div>
  );
}
