import { Badge } from "@sakaniui/react";
import type { WorkspaceStatus } from "../../fixtures/workspaces.ts";

function variant(status: WorkspaceStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "running":
      return "success";
    case "queued":
      return "info";
    case "failed":
      return "danger";
    default:
      return "neutral";
  }
}

export function WorkspaceStatusBadge({ status }: { status: WorkspaceStatus }) {
  return <Badge variant={variant(status)}>{status}</Badge>;
}
