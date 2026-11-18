import { Card, Input, Slider } from "@sakaniui/react";
import { benchmarkNode } from "../../fixtures/benchmarks.ts";
import type { BenchmarkConfig } from "./BenchmarkConfigPanel.tsx";

export function ResourceConstraintPanel({
  value,
  onChange,
}: {
  value: BenchmarkConfig;
  onChange: (next: BenchmarkConfig) => void;
}) {
  return (
    <Card title="Resource configuration" description="Limits for this experiment. Only node-a is deployed.">
      <div className="form-grid">
        <Slider
          label="CPU limit, vCPU"
          showValue
          min={1}
          max={8}
          value={value.cpu}
          onChange={(event) => onChange({ ...value, cpu: Number(event.target.value) })}
        />
        <Slider
          label="Memory limit, GB"
          showValue
          min={1}
          max={16}
          value={value.memoryGb}
          onChange={(event) => onChange({ ...value, memoryGb: Number(event.target.value) })}
        />
        <Slider
          label="Disk allocation, GB"
          showValue
          min={1}
          max={20}
          value={value.diskGb}
          onChange={(event) => onChange({ ...value, diskGb: Number(event.target.value) })}
        />
        <Slider
          label="Network constraint, MB/s"
          showValue
          min={10}
          max={100}
          step={10}
          value={value.networkMbps}
          onChange={(event) => onChange({ ...value, networkMbps: Number(event.target.value) })}
        />
        <div className="form-grid__wide">
          <Input
            label="Worker node"
            description="Local / Single Host. No other node is configured."
            disabled
            value={`${benchmarkNode.id} · ${benchmarkNode.region}`}
          />
        </div>
      </div>
    </Card>
  );
}
