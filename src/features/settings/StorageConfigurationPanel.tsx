import { Input, Select } from "@sakaniui/react";
import { storageSettings } from "../../fixtures/settings.ts";
import { ConfigurationGroup } from "./ConfigurationGroup.tsx";
import { ConfigurationRow } from "./ConfigurationRow.tsx";
import { SettingsSection } from "./SettingsSection.tsx";

export function StorageConfigurationPanel() {
  return (
    <SettingsSection id="storage-settings" title="Storage" note="Local single-host paths. Cache storage is separate from workspace storage.">
      <ConfigurationGroup title="Cache storage" note="These figures are the Cache Engine sample.">
        <ConfigurationRow label="Backend" explanation="Local disk on node-a. Not an object store.">
          <Select label="Backend" disabled value="local" options={[{ value: "local", label: storageSettings.backend }]} />
        </ConfigurationRow>
        <ConfigurationRow label="Local path" explanation="Illustrative cache directory. Not created by this page.">
          <Input label="Cache path" disabled value={storageSettings.cachePath} />
        </ConfigurationRow>
        <ConfigurationRow label="Capacity" explanation={`${storageSettings.cacheUsed} used. ${storageSettings.cacheFree} free.`}>
          <Input label="Capacity" disabled value={storageSettings.cacheCapacity} />
        </ConfigurationRow>
        <ConfigurationRow label="Retention" explanation="Cache object retention from the cache policy sample.">
          <Input label="Retention" disabled value={storageSettings.cacheRetention} />
        </ConfigurationRow>
      </ConfigurationGroup>
      <ConfigurationGroup title="Workspace storage" note="Writable workspace trees. This quota is not the 120.0 GB cache capacity.">
        <ConfigurationRow label="Local path" explanation="Matches the sample workspace mount prefix.">
          <Input label="Workspace path" disabled value={storageSettings.workspacePath} />
        </ConfigurationRow>
        <ConfigurationRow label="Object storage" explanation="No bucket is configured.">
          <Input label="Object storage" disabled value={storageSettings.objectStorage} />
        </ConfigurationRow>
      </ConfigurationGroup>
    </SettingsSection>
  );
}
