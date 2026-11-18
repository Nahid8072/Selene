import { ActivityFeed, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { cacheEvents, evictionHistory } from "../../fixtures/cache.ts";

interface EvictionRow {
  at: string;
  repository: string;
  objects: string;
}

const columns: TableColumn<EvictionRow>[] = [
  { key: "at", header: "When" },
  { key: "repository", header: "Repository" },
  { key: "objects", header: "Objects", align: "right" },
];

export function CacheEventFeed() {
  return (
    <section className="panel" aria-labelledby="cache-events">
      <h2 id="cache-events">Recent events</h2>
      <ActivityFeed items={cacheEvents} variant="compact" />
      <h3>Eviction history</h3>
      <p className="detail-note">These four rows are the whole eviction count for the window.</p>
      <div className="cache-table">
        <Table
          columns={columns}
          rows={evictionHistory.map((row) => ({ at: row.at, repository: row.repository, objects: String(row.objects) }))}
          rowKey={(row) => row.at}
          bordered
          responsive="default"
        />
      </div>
    </section>
  );
}
