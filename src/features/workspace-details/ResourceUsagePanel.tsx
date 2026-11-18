import { Card, ProgressStat } from "@sakaniui/react";
import type { WorkspaceResource } from "../../fixtures/workspace-details.ts";
import { ResourceHistoryChart } from "./ResourceHistoryChart.tsx";

export function ResourceUsagePanel({ resources }: { resources: WorkspaceResource[] }) {
  return (
    <section className="panel" aria-labelledby="resource-usage">
      <div>
        <h2 id="resource-usage">Resource utilization</h2>
        <p className="section-note">Current value and allocation. These figures are illustrative, not a live measurement.</p>
      </div>
      <div className="resource-grid">
        {resources.map((resource) => (
          <Card key={resource.id} title={resource.label} description={`Allocation ${resource.allocation}`}>
            <ProgressStat label="Current" value={resource.current} progress={resource.progress} />
            <ResourceHistoryChart name={resource.label} unit={resource.unit} points={resource.history} />
          </Card>
        ))}
      </div>
    </section>
  );
}
