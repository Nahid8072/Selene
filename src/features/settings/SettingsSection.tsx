import type { ReactNode } from "react";

export function SettingsSection({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="panel" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {note ? <p className="section-note">{note}</p> : null}
      {children}
    </section>
  );
}
