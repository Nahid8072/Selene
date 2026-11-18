import type { ReactNode } from "react";

export function ConfigurationGroup({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="config-group">
      <h3>{title}</h3>
      {note ? <p className="section-note">{note}</p> : null}
      {children}
    </div>
  );
}
