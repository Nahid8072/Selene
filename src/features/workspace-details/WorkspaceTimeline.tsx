import { ActivityFeed } from "@sakaniui/react";
import type { WorkspaceTimelineEvent } from "../../fixtures/workspace-details.ts";

export function WorkspaceTimeline({ events }: { events: WorkspaceTimelineEvent[] }) {
  return (
    <section className="panel" aria-labelledby="workspace-timeline">
      <h2 id="workspace-timeline">Lifecycle</h2>
      <ActivityFeed
        items={events.map((event) => ({
          id: event.id,
          actor: event.label,
          description: event.note,
          timestamp: event.timestamp,
        }))}
      />
    </section>
  );
}
