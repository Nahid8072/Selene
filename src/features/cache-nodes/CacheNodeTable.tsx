import { Badge, Button, Table } from "@sakaniui/react";
import type { TableColumn } from "@sakaniui/react";
import { nodeRecord } from "../../fixtures/cache-nodes.ts";

interface NodeRow {
  id: string;
  hostname: string;
  region: string;
  status: string;
  cache_size: string;
  hit_rate: string;
  requests_per_sec: string;
  cpu_ram: string;
  heartbeat: string;
  select?: never;
}

export function CacheNodeTable({ onSelect, selected }: { onSelect: (id: string) => void; selected: string }) {
  const row: NodeRow = {
    id: nodeRecord.id,
    hostname: nodeRecord.hostname,
    region: nodeRecord.region,
    status: nodeRecord.status,
    cache_size: nodeRecord.cacheSize,
    hit_rate: nodeRecord.hitRate,
    requests_per_sec: nodeRecord.requestsPerSec,
    cpu_ram: nodeRecord.cpuRam,
    heartbeat: nodeRecord.heartbeat,
  };
  const columns: TableColumn<NodeRow>[] = [
    { key: "id", header: "Node ID", render: (item) => <span className="commit-sha">{item.id}</span> },
    { key: "hostname", header: "Hostname" },
    { key: "region", header: "Region" },
    { key: "status", header: "Status", render: (item) => <Badge variant="success">{item.status}</Badge> },
    { key: "cache_size", header: "Cache Size" },
    { key: "hit_rate", header: "Hit Rate", align: "right" },
    { key: "requests_per_sec", header: "Requests/sec", align: "right" },
    { key: "cpu_ram", header: "CPU/RAM" },
    { key: "heartbeat", header: "Last Heartbeat" },
    {
      key: "select",
      header: "",
      align: "right",
      render: (item) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={selected === item.id}
          onClick={() => onSelect(item.id)}
        >
          {selected === item.id ? "Selected" : "Select"}
        </Button>
      ),
    },
  ];
  return (
    <div className="cache-table node-table">
      <Table columns={columns} rows={[row]} rowKey={(item) => item.id} bordered={false} responsive="default" />
    </div>
  );
}
