import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { repositoryRecords } from "../../fixtures/repositories.ts";
import { workloadRecords } from "../../fixtures/workloads.ts";
import { workspaceRecords } from "../../fixtures/workspaces.ts";

export interface SearchHit {
  id: string;
  category: "Pages" | "Repositories" | "Workspaces" | "Workloads";
  label: string;
  description: string;
  href: string;
}

const pages: SearchHit[] = [
  { id: "page-overview", category: "Pages", label: "Overview", description: "Fleet sample dashboard", href: "/" },
  { id: "page-repos", category: "Pages", label: "Repositories", description: "Registered Git sources", href: "/repositories" },
  { id: "page-workspaces", category: "Pages", label: "Agent Workspaces", description: "Isolated workspace samples", href: "/workspaces" },
  { id: "page-workloads", category: "Pages", label: "Workloads", description: "Sample job groups", href: "/workloads" },
  { id: "page-cache", category: "Pages", label: "Cache Engine", description: "node-a cache sample", href: "/cache" },
  { id: "page-nodes", category: "Pages", label: "Cache Nodes", description: "Single host node-a", href: "/cache/nodes" },
  { id: "page-benchmarks", category: "Pages", label: "Benchmark Studio", description: "Configuration preview", href: "/benchmarks" },
  { id: "page-results", category: "Pages", label: "Benchmark Results", description: "30 synthetic trials", href: "/benchmarks/results" },
  { id: "page-obs", category: "Pages", label: "Observability", description: "Sample metrics, logs, and traces", href: "/observability" },
  { id: "page-api", category: "Pages", label: "API & Integrations", description: "Proposed illustrations", href: "/integrations" },
  { id: "page-security", category: "Pages", label: "Security & Access Control", description: "Illustrative access sample", href: "/security" },
  { id: "page-settings", category: "Pages", label: "System Settings", description: "Inactive configuration preview", href: "/settings" },
];

function catalog(): SearchHit[] {
  return [
    ...pages,
    ...repositoryRecords.map((record) => ({
      id: record.id,
      category: "Repositories" as const,
      label: record.name,
      description: `${record.providerLabel} · ${record.defaultBranch} · ${record.status}`,
      href: `/repositories/${record.id}`,
    })),
    ...workspaceRecords.map((record) => ({
      id: record.id,
      category: "Workspaces" as const,
      label: record.id,
      description: `${record.agent} · ${record.repository} · ${record.status}`,
      href: `/workspaces/${record.id}`,
    })),
    ...workloadRecords.map((record) => ({
      id: record.id,
      category: "Workloads" as const,
      label: record.name,
      description: `${record.id} · ${record.type} · ${record.status}`,
      href: `/workloads/${record.id}`,
    })),
  ];
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = catalog().filter((hit) => {
      if (!needle) return true;
      return `${hit.label} ${hit.description} ${hit.category}`.toLowerCase().includes(needle);
    });
    return rows;
  }, [query]);

  useEffect(() => {
    if (!open) return;
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      previous.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>("input, button")].filter((el) => !el.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (hit: SearchHit) => {
    navigate(hit.href);
    onClose();
  };

  const groups = ["Pages", "Repositories", "Workspaces", "Workloads"] as const;

  return (
    <div className="dialog-layer">
      <div className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="command-palette-title" ref={dialogRef}>
        <h2 id="command-palette-title">Search this preview</h2>
        <p className="section-note">Repositories, workspaces, workloads, and pages already in the sample. No request is sent.</p>
        <input
          ref={inputRef}
          className="palette-input"
          value={query}
          placeholder="Type a name or page"
          aria-label="Search sample records"
          aria-activedescendant={hits[active] ? `hit-${hits[active].id}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((index) => Math.min(index + 1, Math.max(hits.length - 1, 0)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && hits[active]) {
              event.preventDefault();
              go(hits[active]);
            }
          }}
        />
        {hits.length === 0 ? (
          <p className="palette-empty">No sample matches. Try a repository, workspace, workload, or page name.</p>
        ) : (
          <div className="palette-results">
            {groups.map((group) => {
              const rows = hits.filter((hit) => hit.category === group);
              if (rows.length === 0) return null;
              return (
                <section key={group}>
                  <h3>{group}</h3>
                  <ul>
                    {rows.map((hit) => {
                      const index = hits.indexOf(hit);
                      return (
                        <li key={hit.id}>
                          <button
                            id={`hit-${hit.id}`}
                            type="button"
                            className={index === active ? "palette-hit palette-hit--active" : "palette-hit"}
                            onMouseEnter={() => setActive(index)}
                            onClick={() => go(hit)}
                          >
                            <span>{hit.label}</span>
                            <span>{hit.description}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
