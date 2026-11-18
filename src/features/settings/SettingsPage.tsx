import { useState } from "react";
import { Input, Select, Switch, Tabs } from "@sakaniui/react";
import { cacheSettings, controlPlaneSettings, generalSettings, settingsNotice, workspaceSettings } from "../../fixtures/settings.ts";
import { ConfigurationGroup } from "./ConfigurationGroup.tsx";
import { ConfigurationRow } from "./ConfigurationRow.tsx";
import { DatabaseHealthPanel } from "./DatabaseHealthPanel.tsx";
import { MaintenancePanel } from "./MaintenancePanel.tsx";
import { NotificationSettingsPanel } from "./NotificationSettingsPanel.tsx";
import { ResourceLimitControl } from "./ResourceLimitControl.tsx";
import { SettingsSection } from "./SettingsSection.tsx";
import { StorageConfigurationPanel } from "./StorageConfigurationPanel.tsx";

const sections = [
  { value: "general", label: "General" },
  { value: "control", label: "Control Plane" },
  { value: "storage", label: "Storage" },
  { value: "cache", label: "Cache Configuration" },
  { value: "workspace", label: "Workspace Configuration" },
  { value: "database", label: "Database" },
  { value: "notifications", label: "Notifications" },
  { value: "maintenance", label: "System Maintenance" },
];

export default function SettingsPage() {
  const [section, setSection] = useState("general");
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>System Settings</h1>
          <p>Configure Selene deployment parameters, storage, cache behavior, workspace policies and system maintenance.</p>
        </div>
      </header>
      <p className="section-note">{settingsNotice}</p>
      <div className="tab-scroll">
        <Tabs items={sections} value={section} onChange={setSection} />
      </div>
      {section === "general" ? (
        <SettingsSection id="general-settings" title="General" note="Single-host sample. These fields are not saved.">
          <ConfigurationGroup title="Instance">
            <ConfigurationRow label="Instance name" explanation="A preview name, not a deployed instance.">
              <Input label="Instance name" disabled value={generalSettings.instance} />
            </ConfigurationRow>
            <ConfigurationRow label="Environment" explanation="The shell already shows this host.">
              <Input label="Environment" disabled value={generalSettings.environment} />
            </ConfigurationRow>
            <ConfigurationRow label="Organization" explanation="Fictional organization. Not an account.">
              <Input label="Organization" disabled value={generalSettings.organization} />
            </ConfigurationRow>
            <ConfigurationRow label="Default configuration" explanation="No other region or host is configured.">
              <Input label="Defaults" disabled value={generalSettings.defaults} />
            </ConfigurationRow>
          </ConfigurationGroup>
        </SettingsSection>
      ) : null}
      {section === "control" ? (
        <SettingsSection id="control-settings" title="Control plane" note="Sample service values. Not applied.">
          <ConfigurationGroup title="API and workers">
            <ConfigurationRow label="API service" explanation="Sample address. Not a live gateway.">
              <Input label="API base URL" disabled value={controlPlaneSettings.api} />
            </ConfigurationRow>
            <ConfigurationRow label="Worker registration" explanation="Only node-a is listed. Nothing is registered.">
              <Input label="Workers" disabled value={controlPlaneSettings.workers} />
            </ConfigurationRow>
            <ResourceLimitControl
              label="Request limit"
              value={controlPlaneSettings.requestLimit}
              unit={controlPlaneSettings.requestUnit}
              explanation="Separate illustrative limit. Not measured and not applied."
            />
            <ResourceLimitControl
              label="Timeout"
              value={controlPlaneSettings.timeout}
              unit={controlPlaneSettings.timeoutUnit}
              explanation="Separate illustrative timeout. Not applied."
            />
          </ConfigurationGroup>
        </SettingsSection>
      ) : null}
      {section === "storage" ? <StorageConfigurationPanel /> : null}
      {section === "cache" ? (
        <SettingsSection id="cache-settings" title="Cache configuration" note="Size, use, and free space match Cache Engine. Eviction and warming match that sample.">
          <ConfigurationGroup title="Defaults">
            <ConfigurationRow label="Default size" explanation={`${cacheSettings.used} used. ${cacheSettings.free} free.`}>
              <Input label="Cache size" disabled value={cacheSettings.size} />
            </ConfigurationRow>
            <ConfigurationRow label="Eviction" explanation="Least recently used, from the cache policy sample.">
              <Select label="Eviction" disabled value="lru" options={[{ value: "lru", label: cacheSettings.eviction }]} />
            </ConfigurationRow>
            <ConfigurationRow label="Retention" explanation="Same retention as the cache policy sample.">
              <Input label="Retention" disabled value={cacheSettings.retention} />
            </ConfigurationRow>
            <ConfigurationRow label="Warming" explanation={cacheSettings.vscode}>
              <Input label="Warming" disabled value={cacheSettings.warming} />
            </ConfigurationRow>
            <ConfigurationRow label="Scheduled warm" explanation="The switch shows the sample schedule. It does not start a warm.">
              <Switch label="Warm react and kubernetes" description="Sample on. Not applied." checked disabled />
            </ConfigurationRow>
          </ConfigurationGroup>
        </SettingsSection>
      ) : null}
      {section === "workspace" ? (
        <SettingsSection
          id="workspace-settings"
          title="Workspace configuration"
          note="Limits match the workspace draft and the workspace detail allocations. Shared immutable Git objects are not part of the writable quota."
        >
          <ConfigurationGroup title="Default limits">
            <ResourceLimitControl label="CPU" value={workspaceSettings.cpu} unit={workspaceSettings.cpuUnit} explanation="Default allocation is 2 vCPU." />
            <ResourceLimitControl label="Memory" value={workspaceSettings.memory} unit={workspaceSettings.memoryUnit} explanation="Default allocation is 4 GB." />
            <ResourceLimitControl
              label="Writable disk"
              value={workspaceSettings.disk}
              unit={workspaceSettings.diskUnit}
              explanation="20 GB is the isolated writable tree. It is not the 120.0 GB cache."
            />
            <ResourceLimitControl
              label="Network"
              value={workspaceSettings.network}
              unit={workspaceSettings.networkUnit}
              explanation="Allocation shown on the workspace detail sample."
            />
          </ConfigurationGroup>
          <ConfigurationGroup title="Lifecycle">
            <ConfigurationRow label="Cleanup" explanation={workspaceSettings.cleanup}>
              <Switch label="Automatic cleanup" description="Off. Not applied." disabled />
            </ConfigurationRow>
            <ConfigurationRow label="Expiration" explanation={workspaceSettings.expiration}>
              <Input label="Expiration" disabled value={workspaceSettings.expiration} />
            </ConfigurationRow>
          </ConfigurationGroup>
        </SettingsSection>
      ) : null}
      {section === "database" ? <DatabaseHealthPanel /> : null}
      {section === "notifications" ? <NotificationSettingsPanel /> : null}
      {section === "maintenance" ? <MaintenancePanel /> : null}
    </div>
  );
}
