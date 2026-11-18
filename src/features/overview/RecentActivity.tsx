import { ActivityFeed, ActivityFeedHighlight, Card } from "@sakaniui/react";
import {
  IconAlertTriangle,
  IconChartBar,
  IconCircleCheck,
  IconClock,
  IconRefresh,
} from "@sakaniui/react/icons";
import type { ReactNode } from "react";
import { overviewModel } from "../../fixtures/overview.ts";

const icons: Record<string, ReactNode> = {
  evt_linux_refresh: <IconAlertTriangle />,
  evt_k8s_ready: <IconCircleCheck />,
  evt_bench: <IconChartBar />,
  evt_synth_start: <IconClock />,
  evt_react_sync: <IconRefresh />,
};

export function RecentActivity() {
  return (
    <section className="panel" aria-labelledby="recent-activity">
      <div className="panel__head">
        <div>
          <h2 id="recent-activity">Recent activity</h2>
          <p className="panel__copy">Sample sync, provisioning, and benchmark records.</p>
        </div>
      </div>
      <Card>
        <ActivityFeed
          items={overviewModel.activity.map((item) => ({
            id: item.id,
            actor: item.actor,
            description: (
              <>
                {item.action} <ActivityFeedHighlight>{item.target}</ActivityFeedHighlight>
              </>
            ),
            timestamp: item.timestamp,
            icon: icons[item.id],
          }))}
        />
      </Card>
    </section>
  );
}
