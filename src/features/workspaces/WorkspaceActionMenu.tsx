import { Button } from "@sakaniui/react";
import { useNavigate } from "react-router";
import { sampleWorkspaceId } from "../../fixtures/workspace-details.ts";

const actions = [
  { label: "Create Workspace", variant: "primary" as const },
  { label: "Stop Workspace", variant: "secondary" as const },
  { label: "Restart Workspace", variant: "secondary" as const },
  { label: "Destroy Workspace", variant: "outline" as const },
  { label: "View Logs", variant: "ghost" as const },
  { label: "Open Workspace Details", variant: "ghost" as const },
];

export function WorkspaceActionMenu() {
  const navigate = useNavigate();
  return (
    <div className="detail-actions" aria-label="Workspace actions">
      {actions.map((action) =>
        action.label === "Open Workspace Details" ? (
          <Button
            key={action.label}
            type="button"
            variant={action.variant}
            size="sm"
            onClick={() => navigate(`/workspaces/${sampleWorkspaceId}`)}
          >
            {action.label}
          </Button>
        ) : (
          <Button key={action.label} type="button" variant={action.variant} size="sm" disabled>
            {action.label}
          </Button>
        ),
      )}
    </div>
  );
}
