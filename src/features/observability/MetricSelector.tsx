import { Select } from "@sakaniui/react";
import { metricOptions, type MetricId } from "../../fixtures/observability.ts";

export function MetricSelector({ value, onChange }: { value: MetricId; onChange: (value: MetricId) => void }) {
  return (
    <Select
      label="Metric"
      description="Shows one illustrative series for node-a."
      value={value}
      options={metricOptions.map((option) => ({ value: option.value, label: option.label }))}
      onChange={(next) => onChange(next as MetricId)}
    />
  );
}
