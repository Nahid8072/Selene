import { Badge } from "@sakaniui/react";
import type { WorkloadStatus } from "../../fixtures/workloads.ts";

function variant(status: WorkloadStatus): "success" | "warning" | "danger" | "info" | "neutral" {
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

export function WorkloadStatusBadge({ status }: { status: WorkloadStatus }) {
  return <Badge variant={variant(status)}>{status}</Badge>;
}
