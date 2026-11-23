import {
  Sidebar,
  SidebarDivider,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
} from "@sakaniui/react";
import {
  IconActivity,
  IconApi,
  IconBook,
  IconPlus,
  IconChartBar,
  IconDatabase,
  IconFolders,
  IconGitBranch,
  IconLayoutDashboard,
  IconRadar,
  IconReport,
  IconServer,
  IconShieldLock,
  IconSettings,
  IconX,
} from "@sakaniui/react/icons";
import { IconButton } from "@sakaniui/react";
import { useLocation, useNavigate } from "react-router";
import { maintenanceSettings } from "../../fixtures/settings.ts";

type SidebarNavProps = {
  onNavigate?: () => void;
  showClose?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function SidebarNav({ onNavigate, showClose = false, collapsed = false, onToggleCollapse }: SidebarNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< HEAD
  const overviewActive = location.pathname === "/";
=======
  const overviewActive = location.pathname === "/overview";
>>>>>>> landing-page
  const repositoriesActive = location.pathname.startsWith("/repositories");
  const workspacesActive = location.pathname === "/workspaces" || location.pathname.startsWith("/workspaces/");
  const workloadsActive = location.pathname === "/workloads" || location.pathname.startsWith("/workloads/");
  const cacheActive = location.pathname === "/cache";
  const cacheNodesActive = location.pathname === "/cache/nodes";
  const benchmarksActive = location.pathname === "/benchmarks";
  const benchmarkResultsActive = location.pathname === "/benchmarks/results";
  const observabilityActive = location.pathname === "/observability";
  const integrationsActive = location.pathname === "/integrations";
  const securityActive = location.pathname === "/security";
  const settingsActive = location.pathname === "/settings";

  return (
    <div className="sidebar-block">
      {showClose ? (
        <div className="drawer-toolbar">
          <IconButton
            icon={IconX}
            aria-label="Close navigation"
            variant="ghost"
            size="sm"
            onClick={onNavigate}
          />
        </div>
      ) : null}
      <Sidebar className="sidebar-nav" collapsed={collapsed}>
        <SidebarHeader
          type={onToggleCollapse ? "brand-toggle" : "brand"}
          title="Selene"
          subtitle={maintenanceSettings.version}
          logo={<span aria-hidden="true">Se</span>}
          collapsed={collapsed}
          onToggle={onToggleCollapse}
        />
        {collapsed ? null : <SidebarGroupLabel>Fleet</SidebarGroupLabel>}
        <SidebarItem
          icon={IconLayoutDashboard}
          label="Overview"
          active={overviewActive}
          collapsed={collapsed}
          onClick={() => {
<<<<<<< HEAD
            navigate("/");
=======
            navigate("/overview");
>>>>>>> landing-page
            onNavigate?.();
          }}
        />
        <SidebarItem
          icon={IconGitBranch}
          label="Repositories"
          active={repositoriesActive}
          collapsed={collapsed}
          onClick={() => {
            navigate("/repositories");
            onNavigate?.();
          }}
        />
        <SidebarItem
          icon={IconFolders}
          label="Agent Workspaces"
          active={workspacesActive}
          collapsed={collapsed}
          onClick={() => {
            navigate("/workspaces");
            onNavigate?.();
          }}
        />
        <SidebarDivider />
        {collapsed ? null : <SidebarGroupLabel>Infrastructure</SidebarGroupLabel>}
        <SidebarItem
          icon={IconDatabase}
          label="Cache Engine"
          active={cacheActive}
          hasSubmenu
          expanded
          collapsed={collapsed}
          onClick={() => {
            navigate("/cache");
            onNavigate?.();
          }}
        />
        <div className="sidebar-subitem">
          <SidebarItem
            icon={IconServer}
            label="Cache Nodes"
            active={cacheNodesActive}
            collapsed={collapsed}
            onClick={() => {
              navigate("/cache/nodes");
              onNavigate?.();
            }}
          />
        </div>
        <SidebarItem
          icon={IconActivity}
          label="Workloads"
          active={workloadsActive}
          collapsed={collapsed}
          onClick={() => {
            navigate("/workloads");
            onNavigate?.();
          }}
        />
        <SidebarDivider />
        {collapsed ? null : <SidebarGroupLabel>Evidence</SidebarGroupLabel>}
        <SidebarItem
          icon={IconChartBar}
          label="Benchmarks"
          active={benchmarksActive}
          hasSubmenu
          expanded
          collapsed={collapsed}
          onClick={() => {
            navigate("/benchmarks");
            onNavigate?.();
          }}
        />
        <div className="sidebar-subitem">
          <SidebarItem
            icon={IconReport}
            label="Benchmark Results"
            active={benchmarkResultsActive}
            collapsed={collapsed}
            onClick={() => {
              navigate("/benchmarks/results");
              onNavigate?.();
            }}
          />
        </div>
        <SidebarItem
          icon={IconRadar}
          label="Observability"
          active={observabilityActive}
          collapsed={collapsed}
          onClick={() => {
            navigate("/observability");
            onNavigate?.();
          }}
        />
        <SidebarDivider />
        {collapsed ? null : <SidebarGroupLabel>System</SidebarGroupLabel>}
        <SidebarItem
          icon={IconApi}
          label="API & Integrations"
          active={integrationsActive}
          collapsed={collapsed}
          onClick={() => {
            navigate("/integrations");
            onNavigate?.();
          }}
        />
        <SidebarItem
          icon={IconShieldLock}
          label="Security & Access Control"
          active={securityActive}
          collapsed={collapsed}
          onClick={() => {
            navigate("/security");
            onNavigate?.();
          }}
        />
        <SidebarItem
          icon={IconSettings}
          label="Settings"
          active={settingsActive}
          collapsed={collapsed}
          onClick={() => {
            navigate("/settings");
            onNavigate?.();
          }}
        />
        <SidebarDivider />
        {collapsed ? null : <SidebarGroupLabel>Quick actions</SidebarGroupLabel>}
        <SidebarItem icon={IconPlus} label="Add repository" disabled collapsed={collapsed} />
        <SidebarItem icon={IconFolders} label="Launch workspace" disabled collapsed={collapsed} />
        <SidebarItem icon={IconChartBar} label="Run benchmark" disabled collapsed={collapsed} />
        <SidebarItem icon={IconActivity} label="View logs" disabled collapsed={collapsed} />
        <SidebarItem icon={IconBook} label="Documentation" disabled collapsed={collapsed} />
      </Sidebar>
      {collapsed ? null : (
        <p className="sidebar-note">
          Quick actions and documentation stay inactive. Operational controls on each screen do not run.
        </p>
      )}
    </div>
  );
}
