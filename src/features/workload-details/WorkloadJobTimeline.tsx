import { ActivityFeed } from "@sakaniui/react";
import type { WorkloadTimelineEvent } from "../../fixtures/workload-details.ts";

export function WorkloadJobTimeline({ events }: { events: WorkloadTimelineEvent[] }) {
  return (
    <section className="panel" aria-labelledby="workload-timeline">
      <h2 id="workload-timeline">Execution timeline</h2>
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
