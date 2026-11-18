import type { ReactNode } from "react";

export function ConfigurationRow({ label, explanation, children }: { label: string; explanation: string; children: ReactNode }) {
  return (
    <div className="config-row">
      <div className="config-row__copy">
        <p className="config-row__label">{label}</p>
        <p className="section-note">{explanation}</p>
      </div>
      <div className="config-row__control">{children}</div>
    </div>
  );
}
