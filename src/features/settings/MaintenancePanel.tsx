import { Button, Input } from "@sakaniui/react";
import { ConfirmationReview } from "../../components/shared/ConfirmationReview.tsx";
import { maintenanceSettings, settingsNotice } from "../../fixtures/settings.ts";
import { ConfigurationRow } from "./ConfigurationRow.tsx";
import { SettingsSection } from "./SettingsSection.tsx";

export function MaintenancePanel() {
  return (
    <SettingsSection id="maintenance-settings" title="System maintenance" note={settingsNotice}>
      <ConfigurationRow label="Version" explanation="Preview label. Not a released build.">
        <Input label="Version" disabled value={maintenanceSettings.version} />
      </ConfigurationRow>
      <ConfigurationRow label="Host" explanation="The only host in this preview.">
        <Input label="Host" disabled value={maintenanceSettings.host} />
      </ConfigurationRow>
      <ConfigurationRow label="Health checks" explanation={`${maintenanceSettings.health}. Not a live check.`}>
        <Input label="Health" disabled value={maintenanceSettings.health} />
      </ConfigurationRow>
      <ConfigurationRow label="Service restart" explanation="Restart does not run. The review below does not execute it.">
        <div className="inert-actions">
          <Button type="button" variant="outline" disabled>
            Restart service
          </Button>
        </div>
      </ConfigurationRow>
      <ConfirmationReview
        title="Restart review"
        consequence="Restarting the sample service would interrupt node-a. Confirm stays inactive, so nothing restarts."
      />
      <ConfigurationRow label="Configuration export" explanation="Export does not create a file.">
        <div className="inert-actions">
          <Button type="button" variant="outline" disabled>
            Export configuration
          </Button>
        </div>
      </ConfigurationRow>
    </SettingsSection>
  );
}
