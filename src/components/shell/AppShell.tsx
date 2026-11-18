import { useEffect, useRef, useState, type ReactNode } from "react";
import { SidebarNav } from "./SidebarNav.tsx";
import { Topbar } from "./Topbar.tsx";

type AppShellProps = {
  children: ReactNode;
};

type ShellMode = "full" | "compact" | "drawer";

export function AppShell({ children }: AppShellProps) {
  const [mode, setMode] = useState<ShellMode>("full");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1200px)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      const next: ShellMode = mobile.matches ? "drawer" : wide.matches ? "full" : "compact";
      setMode(next);
      setCollapsedOverride(null);
      if (next !== "drawer") {
        setDrawerOpen(false);
      }
    };
    apply();
    wide.addEventListener("change", apply);
    mobile.addEventListener("change", apply);
    return () => {
      wide.removeEventListener("change", apply);
      mobile.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (drawerOpen && !dialog.open) {
      dialog.showModal();
    }
    if (!drawerOpen && dialog.open) {
      dialog.close();
    }
  }, [drawerOpen]);

  const collapsed = mode === "drawer" ? false : (collapsedOverride ?? mode === "compact");

  return (
    <div className={collapsed && mode !== "drawer" ? "app-shell app-shell--compact" : "app-shell"} data-surface="solid">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="app-shell__sidebar">
        <SidebarNav
          collapsed={collapsed}
          onToggleCollapse={mode === "drawer" ? undefined : () => setCollapsedOverride(!collapsed)}
        />
      </div>
      <div className="app-shell__main">
        <Topbar showMenu={mode === "drawer"} onOpenMenu={() => setDrawerOpen(true)} />
        <main id="content" className="app-shell__content">
          {children}
        </main>
      </div>
      <dialog
        ref={dialogRef}
        className="nav-drawer"
        aria-label="Navigation"
        onClose={() => setDrawerOpen(false)}
      >
        <SidebarNav showClose onNavigate={() => setDrawerOpen(false)} />
      </dialog>
    </div>
  );
}
