import { Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { formatBytes, formatCount, formatPercent } from "../../lib/format.ts";
import { repositoryCacheRows, type RepositoryCacheRow } from "../../fixtures/cache.ts";

interface Row {
  repository: string;
  objects: string;
  used: string;
  hits: string;
  misses: string;
  hit_rate: string;
  evictions: string;
}

const columns: TableColumn<Row>[] = [
  { key: "repository", header: "Repository" },
  { key: "objects", header: "Objects", align: "right" },
  { key: "used", header: "Used", align: "right" },
  { key: "hits", header: "Hits", align: "right" },
  { key: "misses", header: "Misses", align: "right" },
  { key: "hit_rate", header: "Hit rate", align: "right" },
  { key: "evictions", header: "Evictions", align: "right" },
];

function toRow(record: RepositoryCacheRow): Row {
  return {
    repository: record.repository,
    objects: formatCount(record.objects),
    used: record.bytes === 0 ? "0 MB" : formatBytes(record.bytes),
    hits: formatCount(record.hits),
    misses: formatCount(record.misses),
    hit_rate: formatPercent(record.hits, record.hits + record.misses),
    evictions: formatCount(record.evictions),
  };
}

export function RepositoryCacheTable() {
  return (
    <section className="panel" aria-labelledby="cache-repos">
      <h2 id="cache-repos">Utilization by repository</h2>
      <p className="section-note">
        Object counts match the repository list. vscode is still syncing, so its cached object count is zero. Hits and
        misses add up to the 24h totals.
      </p>
      <div className="cache-table">
        <Table
          columns={columns}
          rows={repositoryCacheRows.map(toRow)}
          rowKey={(row) => row.repository}
          bordered
          responsive="default"
        />
      </div>
    </section>
  );
}
