import { Badge, Card } from "@sakaniui/react";
import { preflightChecks, type PreflightState } from "../../fixtures/benchmarks.ts";

function variant(state: PreflightState): "success" | "warning" | "danger" | "neutral" {
  switch (state) {
    case "Ready":
      return "success";
    case "Warning":
      return "warning";
    case "Blocked":
      return "danger";
    default:
      return "neutral";
  }
}

export function PreflightValidation() {
  return (
    <Card
      title="Preflight validation"
      description="Static sample states. No check ran against a runner, a disk, or a permission service."
    >
      <ul className="isolation-list">
        {preflightChecks.map((check) => (
          <li key={check.id}>
            <Badge variant={variant(check.state)}>{check.state}</Badge> {check.label}. {check.note}
          </li>
        ))}
      </ul>
      <p className="detail-note">
        Baseline Conventional Git and candidate Selene must be compared on the same repository revision, the same
        hardware, the same resource limits, and the same cache conditions. This page does not confirm that.
      </p>
    </Card>
  );
}
