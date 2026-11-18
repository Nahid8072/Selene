import { Accordion, AccordionItem, Badge } from "@sakaniui/react";
import type { LogRecord } from "../../fixtures/observability.ts";

function Severity({ value }: { value: LogRecord["severity"] }) {
  const variant = value === "Error" ? "danger" : value === "Warning" ? "warning" : "info";
  return <Badge variant={variant}>{value}</Badge>;
}

export function LogTable({ rows }: { rows: LogRecord[] }) {
  return (
    <div className="log-sheet">
      <div className="log-sheet__head">
        <span>Timestamp</span>
        <span>Service</span>
        <span>Severity</span>
        <span>Request ID</span>
        <span>Repository ID</span>
        <span>Workspace ID</span>
        <span>Message</span>
      </div>
      {rows.map((row) => (
        <article className="log-sheet__row" key={row.id}>
          <span className="log-sheet__time">{row.timestamp}</span>
          <span className="log-sheet__service">{row.service}</span>
          <span className="log-sheet__severity">
            <Severity value={row.severity} />
          </span>
          <span className="commit-sha log-sheet__id">{row.requestId}</span>
          <span className="commit-sha log-sheet__id">{row.repositoryId}</span>
          <span className="commit-sha log-sheet__id">{row.workspaceId}</span>
          <p className="log-message">{row.message}</p>
        </article>
      ))}
      <Accordion>
        {rows.map((row) => (
          <AccordionItem key={row.id} title={`${row.timestamp} · ${row.severity} · ${row.service}`}>
            <p className="log-message">{row.message}</p>
            <p className="detail-note">
              Request {row.requestId}. Repository {row.repositoryId}. Workspace {row.workspaceId}.
            </p>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
