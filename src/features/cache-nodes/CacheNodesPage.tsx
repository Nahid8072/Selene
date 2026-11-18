import { useState } from "react";
import { Alert, Badge, Button, EmptyState } from "@sakaniui/react";
import { MetricCard } from "../overview/MetricCard.tsx";
import { CacheStorageBreakdown } from "../cache/CacheStorageBreakdown.tsx";
import { nodeFacts, nodeOverview, nodeRecord } from "../../fixtures/cache-nodes.ts";
import { CacheNodeTable } from "./CacheNodeTable.tsx";
import { NodeConnectionList } from "./NodeConnectionList.tsx";
import { NodeErrorFeed } from "./NodeErrorFeed.tsx";
import { NodeEvictionHistory } from "./NodeEvictionHistory.tsx";
import { NodeNetworkChart } from "./NodeNetworkChart.tsx";
import { NodeResourcePanel } from "./NodeResourcePanel.tsx";

export default function CacheNodesPage() {
  const [selected, setSelected] = useState(nodeRecord.id);
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>Cache Nodes</h1>
          <p>Monitor cache node health, resource utilization, storage capacity and retrieval performance.</p>
        </div>
        <Badge variant="neutral">Single host</Badge>
      </header>
      <p className="section-note">
        This deployment is a single host, {nodeFacts.host}. CPU, memory, and request rate are illustrative. Storage,
        hit rate, latency, and traffic match Cache Engine.
      </p>
      <section className="kpi-grid kpi-grid--five" aria-label="Node summary">
        {nodeOverview.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} value={metric.value} context={metric.context} />
        ))}
      </section>
      <section className="panel" aria-labelledby="node-table">
        <h2 id="node-table">Nodes</h2>
        <CacheNodeTable selected={selected} onSelect={setSelected} />
      </section>
      {selected === nodeRecord.id ? (
        <div className="page-stack page-stack--tight" aria-label="node-a detail">
          <div className="panel__head">
            <h2>node-a</h2>
            <Badge variant="success">healthy</Badge>
          </div>
          <CacheStorageBreakdown />
          <NodeNetworkChart />
          <NodeResourcePanel />
          <section className="panel" aria-labelledby="node-performance">
            <h2 id="node-performance">Cache performance</h2>
            <dl className="detail-meta">
              <div>
                <dt>Retrieval latency</dt>
                <dd>{nodeFacts.latency}</dd>
              </div>
              <div>
                <dt>Hit rate</dt>
                <dd>{nodeFacts.hitRate}</dd>
              </div>
              <div>
                <dt>Hit / miss</dt>
                <dd>8,420 hits · 1,580 misses</dd>
              </div>
            </dl>
          </section>
          <NodeEvictionHistory />
          <NodeConnectionList />
          <NodeErrorFeed />
        </div>
      ) : null}
      <EmptyState
        type="no-data"
        title="No additional nodes"
        description="Regional and extra cache nodes are unconfigured. They are not part of this deployment."
      />
      <section className="panel" aria-labelledby="node-management">
        <h2 id="node-management">Node management</h2>
        <div className="detail-actions">
          <Button type="button" variant="secondary" size="sm" disabled>
            Register Node
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            Configure Node
          </Button>
          <Button type="button" variant="destructive" size="sm" disabled>
            Drain Node
          </Button>
          <Button type="button" variant="destructive" size="sm" disabled>
            Restart Service
          </Button>
          <Button type="button" variant="destructive" size="sm" disabled>
            Remove Node
          </Button>
        </div>
        <Alert
          color="warning"
          title="Drain, restart, and remove need confirmation"
          description="An Infrastructure Administrator would have to confirm. Drain would stop new lookups on node-a while 100.4 GB of cached objects remain. Restart would interrupt the cache service on that host. Remove would take node-a out of the deployment. Workspaces would miss and read upstream Git. None of these actions run from this preview."
        />
      </section>
    </div>
  );
}
