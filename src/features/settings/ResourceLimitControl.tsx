import { Input } from "@sakaniui/react";
import { ConfigurationRow } from "./ConfigurationRow.tsx";

export function ResourceLimitControl({
  label,
  value,
  unit,
  explanation,
}: {
  label: string;
  value: string;
  unit: string;
  explanation: string;
}) {
  return (
    <ConfigurationRow label={label} explanation={explanation}>
      <Input label={unit} disabled value={value} inputMode="numeric" />
    </ConfigurationRow>
  );
}
