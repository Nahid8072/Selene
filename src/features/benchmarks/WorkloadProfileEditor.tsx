import { Card, ProgressStat, Select, Slider, Switch } from "@sakaniui/react";
import { accessOptions } from "../../fixtures/benchmarks.ts";
import type { BenchmarkConfig } from "./BenchmarkConfigPanel.tsx";

export function WorkloadProfileEditor({
  value,
  onChange,
}: {
  value: BenchmarkConfig;
  onChange: (next: BenchmarkConfig) => void;
}) {
  return (
    <Card
      title="Workload configuration"
      description="Profile for the independent workload simulator. This screen does not run the simulator."
    >
      <div className="form-grid">
        <div className="form-grid__wide">
          <Slider
            label="Overlapping file requests, percent"
            showValue
            min={0}
            max={100}
            value={value.overlap}
            onChange={(event) => onChange({ ...value, overlap: Number(event.target.value) })}
          />
          <ProgressStat label="Overlap" value={`${value.overlap}%`} progress={value.overlap} />
        </div>
        <Select
          label="Repository access frequency"
          description="How often agents touch the repository. Illustrative."
          value={value.access}
          options={accessOptions}
          onChange={(access) => onChange({ ...value, access })}
        />
        <div className="form-grid__wide">
          <p className="detail-note">Branch distribution. Illustrative. The three shares are a profile, not a live tree.</p>
          <Slider
            label="main, percent"
            showValue
            min={0}
            max={100}
            value={value.main}
            onChange={(event) => onChange({ ...value, main: Number(event.target.value) })}
          />
          <ProgressStat label="main" value={`${value.main}%`} progress={value.main} />
          <Slider
            label="development, percent"
            showValue
            min={0}
            max={100}
            value={value.development}
            onChange={(event) => onChange({ ...value, development: Number(event.target.value) })}
          />
          <ProgressStat label="development" value={`${value.development}%`} progress={value.development} />
          <Slider
            label="feature branches, percent"
            showValue
            min={0}
            max={100}
            value={value.feature}
            onChange={(event) => onChange({ ...value, feature: Number(event.target.value) })}
          />
          <ProgressStat label="feature branches" value={`${value.feature}%`} progress={value.feature} />
        </div>
        <Slider
          label="Concurrent workspace creation"
          showValue
          min={0}
          max={25}
          value={value.workspaceCreation}
          onChange={(event) => onChange({ ...value, workspaceCreation: Number(event.target.value) })}
        />
        <Slider
          label="Fetch frequency, seconds"
          showValue
          min={5}
          max={300}
          step={5}
          value={value.fetchEverySec}
          onChange={(event) => onChange({ ...value, fetchEverySec: Number(event.target.value) })}
        />
        <Slider
          label="Repository query frequency, seconds"
          showValue
          min={10}
          max={600}
          step={10}
          value={value.queryEverySec}
          onChange={(event) => onChange({ ...value, queryEverySec: Number(event.target.value) })}
        />
        <Switch
          label="Failure injection"
          description={
            value.failureInjection
              ? "On in this profile. No failure is injected from this page."
              : "Off. Optional resilience test. No failure is injected from this page."
          }
          checked={value.failureInjection}
          onChange={(event) => onChange({ ...value, failureInjection: event.target.checked })}
        />
      </div>
    </Card>
  );
}
