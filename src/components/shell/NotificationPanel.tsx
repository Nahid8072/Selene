import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Badge, Button } from "@sakaniui/react";
import { monitorEvents, sampleAlerts } from "../../fixtures/observability.ts";
import { overviewModel } from "../../fixtures/overview.ts";
import { workloadRecords } from "../../fixtures/workloads.ts";
import { workspaceRecords } from "../../fixtures/workspaces.ts";

interface Notice {
  id: string;
  title: string;
  timestamp: string;
  severity: "Error" | "Warning" | "Information";
  source: string;
  description: string;
  href?: string;
}

const notices: Notice[] = [
  ...overviewModel.activity.map((event): Notice => ({
    id: event.id,
    title: `${event.actor} ${event.action}`,
    timestamp: event.timestamp,
    severity: event.action.includes("failed") ? "Warning" : "Information",
    source: event.target,
    description: `${event.actor} ${event.action} ${event.target}.`,
    href: event.target === "react" ? "/repositories/repo_react" : event.target === "linux" ? "/repositories/repo_linux" : "/observability",
  })),
  ...monitorEvents.map((event): Notice => ({
    id: event.id,
    title: event.kind,
    timestamp: event.timestamp,
    severity: event.severity === "Error" ? "Error" : event.severity === "Warning" ? "Warning" : "Information",
    source: `${event.source} · ${event.resource}`,
    description: event.description,
    href: event.resource.startsWith("ws_") ? `/workspaces/${event.resource}` : event.resource.startsWith("repo_") ? `/repositories/${event.resource}` : "/observability",
  })),
  ...sampleAlerts.map((alert): Notice => ({
    id: alert.id,
    title: alert.name,
    timestamp: alert.triggered,
    severity: alert.severity === "Error" ? "Error" as const : "Warning" as const,
    source: alert.resource,
    description: `${alert.state}. ${alert.explanation}`,
    href: "/observability",
  })),
  ...workspaceRecords
    .filter((record) => record.error)
    .map((record) => ({
      id: `ws-note-${record.id}`,
      title: `${record.id} ${record.status}`,
      timestamp: record.createdAt,
      severity: "Error" as const,
      source: record.node,
      description: record.error ?? "",
      href: `/workspaces/${record.id}`,
    })),
  ...workloadRecords
    .filter((record) => record.status === "failed")
    .map((record) => ({
      id: `wl-note-${record.id}`,
      title: record.name,
      timestamp: record.startedAt ?? "Not started",
      severity: "Error" as const,
      source: record.id,
      description: `${record.type} sample is ${record.status}.`,
      href: `/workloads/${record.id}`,
    })),
];

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState(() => notices.map((notice, index) => ({ ...notice, unread: index < 3 })));

  useEffect(() => {
    if (!open) return;
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => dialogRef.current?.querySelector("button")?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      previous.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-layer">
      <div className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="notice-title" ref={dialogRef}>
        <h2 id="notice-title">Notifications</h2>
        <p className="section-note">Illustrative sample from existing activity. Not live alerts. This list resets on reload.</p>
        <div className="detail-actions">
          <Button type="button" size="sm" variant="outline" onClick={() => setItems((rows) => rows.map((row) => ({ ...row, unread: false })))}>
            Mark all read
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        {items.length === 0 ? <p className="palette-empty">No sample notices remain in this session.</p> : null}
        <ul className="notice-list">
          {items.map((item) => (
            <li key={item.id} className={item.unread ? "notice-item notice-item--unread" : "notice-item"}>
              <div>
                <p className="config-row__label">{item.title}</p>
                <p className="section-note">
                  {item.timestamp} · {item.source}
                </p>
                <p>{item.description}</p>
              </div>
              <Badge variant={item.severity === "Error" ? "danger" : item.severity === "Warning" ? "warning" : "info"}>{item.unread ? "Unread" : "Read"}</Badge>
              <div className="detail-actions">
                <Button type="button" size="sm" variant="ghost" onClick={() => setItems((rows) => rows.map((row) => (row.id === item.id ? { ...row, unread: false } : row)))}>
                  Mark read
                </Button>
                {item.href ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigate(item.href!);
                      onClose();
                    }}
                  >
                    Open
                  </Button>
                ) : null}
                <Button type="button" size="sm" variant="ghost" onClick={() => setItems((rows) => rows.filter((row) => row.id !== item.id))}>
                  Dismiss
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
