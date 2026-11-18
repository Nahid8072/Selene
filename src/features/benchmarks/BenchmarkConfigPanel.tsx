import { Card, SegmentedControl, Select, Slider } from "@sakaniui/react";
import type { benchmarkDraft } from "../../fixtures/benchmarks.ts";
import {
  agentOptions,
  benchmarkRepositories,
  cacheStateOptions,
  durationOptions,
  operationOptions,
} from "../../fixtures/benchmarks.ts";

export type BenchmarkConfig = typeof benchmarkDraft;

export function BenchmarkConfigPanel({
  value,
  onChange,
}: {
  value: BenchmarkConfig;
  onChange: (next: BenchmarkConfig) => void;
}) {
  return (
    <Card title="Benchmark configuration" description="Preview only. This form does not start an experiment.">
      <div className="form-grid">
        <Select
          label="Repository"
          description="A connected repository from the sample list."
          value={value.repositoryId}
          options={benchmarkRepositories}
          onChange={(repositoryId) => onChange({ ...value, repositoryId })}
        />
        <div>
          <p className="detail-note">Comparison</p>
          <p>Baseline: Conventional Git. Candidate: Selene.</p>
        </div>
        <div className="form-grid__wide">
          <p className="detail-note">Concurrent agents</p>
          <SegmentedControl
            options={agentOptions}
            value={value.agents}
            onChange={(agents) => onChange({ ...value, agents })}
          />
        </div>
        <div>
          <p className="detail-note">Cache state</p>
          <SegmentedControl
            options={cacheStateOptions}
            value={value.cache}
            onChange={(cache) => onChange({ ...value, cache: cache === "cold" ? "cold" : "warm" })}
          />
        </div>
        <Select
          label="Operation"
          description="What the runner would execute."
          value={value.operation}
          options={operationOptions}
          onChange={(operation) => onChange({ ...value, operation })}
        />
        <Slider
          label="Repetitions"
          showValue
          min={1}
          max={10}
          value={value.repetitions}
          onChange={(event) => onChange({ ...value, repetitions: Number(event.target.value) })}
        />
        <div className="form-grid__wide">
          <p className="detail-note">Duration</p>
          <SegmentedControl
            options={durationOptions}
            value={value.durationMode}
            onChange={(durationMode) =>
              onChange({ ...value, durationMode: durationMode === "workload" ? "workload" : "duration" })
            }
          />
        </div>
        {value.durationMode === "duration" ? (
          <Slider
            label="Fixed duration, minutes"
            showValue
            min={5}
            max={60}
            step={5}
            value={value.durationMinutes}
            onChange={(event) => onChange({ ...value, durationMinutes: Number(event.target.value) })}
          />
        ) : (
          <Slider
            label="Fixed workload, operations"
            showValue
            min={100}
            max={5000}
            step={100}
            value={value.workloadOps}
            onChange={(event) => onChange({ ...value, workloadOps: Number(event.target.value) })}
          />
        )}
      </div>
    </Card>
  );
}
