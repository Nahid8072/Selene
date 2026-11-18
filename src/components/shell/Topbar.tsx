import { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, IconButton, Select, TopBar } from "@sakaniui/react";
import { IconBell, IconMenu2, IconSearch } from "@sakaniui/react/icons";
import { useLocation } from "react-router";
import { environmentLabel } from "../../fixtures/overview.ts";
import { repositoryRecords } from "../../fixtures/repositories.ts";
import { CommandPalette } from "./CommandPalette.tsx";
import { NotificationPanel } from "./NotificationPanel.tsx";

type TopbarProps = {
  showMenu: boolean;
  onOpenMenu: () => void;
};

export function Topbar({ showMenu, onOpenMenu }: TopbarProps) {
  const location = useLocation();
  const detailId = location.pathname.startsWith("/repositories/")
    ? location.pathname.slice("/repositories/".length)
    : "";
  const workspaceId = location.pathname.startsWith("/workspaces/")
    ? location.pathname.slice("/workspaces/".length)
    : "";
  const workloadId = location.pathname.startsWith("/workloads/")
    ? location.pathname.slice("/workloads/".length)
    : "";
  const detailName = repositoryRecords.find((record) => record.id === detailId)?.name;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteKey, setPaletteKey] = useState(0);
  const [noticesOpen, setNoticesOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setNoticesOpen(false);
        setPaletteKey((key) => key + 1);
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const pageLabel =
    detailName ??
    (workspaceId
      ? workspaceId
      : workloadId
        ? workloadId
        : location.pathname === "/workspaces"
          ? "Agent Workspaces"
          : location.pathname === "/workloads"
            ? "Workloads"
            : location.pathname === "/cache/nodes"
              ? "Cache Nodes"
              : location.pathname === "/cache"
                ? "Cache Engine"
                : location.pathname === "/benchmarks/results"
                  ? "Benchmark Results"
                  : location.pathname === "/benchmarks"
                    ? "Benchmark Studio"
                    : location.pathname === "/observability"
                      ? "Observability"
                      : location.pathname === "/integrations"
                        ? "API & Integrations"
                        : location.pathname === "/security"
                          ? "Security & Access Control"
                          : location.pathname === "/settings"
                            ? "System Settings"
                            : location.pathname.startsWith("/repositories")
              ? "Repositories"
              : "Overview");
  const breadcrumb = workspaceId
    ? [{ label: "Fleet" }, { label: "Agent Workspaces", href: "/workspaces" }, { label: workspaceId }]
    : workloadId
      ? [{ label: "Fleet" }, { label: "Workloads", href: "/workloads" }, { label: workloadId }]
      : location.pathname === "/benchmarks/results"
        ? [{ label: "Fleet" }, { label: "Benchmarks", href: "/benchmarks" }, { label: "Benchmark Results" }]
        : location.pathname === "/cache/nodes"
          ? [{ label: "Fleet" }, { label: "Cache Engine", href: "/cache" }, { label: "Cache Nodes" }]
          : detailName
        ? [{ label: "Fleet" }, { label: "Repositories" }, { label: detailName }]
        : [{ label: "Fleet" }, { label: pageLabel }];

  return (
    <div className="topbar-wrap">
      <TopBar
        type="breadcrumb"
        density="sm"
        showToggle={showMenu}
        onToggle={onOpenMenu}
        toggleIcon={IconMenu2}
        showActions={false}
        showHelp={false}
        left={
          <div className="topbar-left">
            <div className="topbar-context">
              <div className="topbar-env">
                <Select
                  label="Environment"
                  disabled
                  value="node-a"
                  options={[{ value: "node-a", label: environmentLabel }]}
                />
              </div>
              <div className="topbar-crumb">
                <Breadcrumb items={breadcrumb} />
              </div>
            </div>
            <p className="topbar-compact">{pageLabel}</p>
            <div className="topbar-search">
              <Button
                type="button"
                size="sm"
                variant="outline"
                aria-haspopup="dialog"
                onClick={() => {
                  setPaletteKey((key) => key + 1);
                  setPaletteOpen(true);
                }}
              >
                <IconSearch size={16} aria-hidden /> Search
              </Button>
              <kbd className="search-kbd">Ctrl+K</kbd>
            </div>
          </div>
        }
        rightSlot={
          <div className="topbar-status">
            <Badge>Sample status</Badge>
            <IconButton
              icon={IconBell}
              aria-label="Notifications"
              aria-haspopup="dialog"
              variant="ghost"
              size="sm"
              onClick={() => setNoticesOpen(true)}
            />
          </div>
        }
        account={
          <Button type="button" variant="ghost" size="sm" disabled aria-label="Account, inactive">
            <span className="account-full">Operator</span>
            <span className="account-short" aria-hidden="true">
              OP
            </span>
          </Button>
        }
      />
      <CommandPalette key={paletteKey} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <NotificationPanel open={noticesOpen} onClose={() => setNoticesOpen(false)} />
    </div>
  );
}
