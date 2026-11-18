import { Input, Switch } from "@sakaniui/react";
import { notificationAlerts, notificationChannels } from "../../fixtures/settings.ts";
import { ConfigurationRow } from "./ConfigurationRow.tsx";
import { SettingsSection } from "./SettingsSection.tsx";

export function NotificationSettingsPanel() {
  return (
    <SettingsSection id="notification-settings" title="Notifications" note="Nothing is sent. Thresholds match the observability sample and are not live rules.">
      <ConfigurationRow label="Email alerts" explanation="The address is fictional. Mail is not sent.">
        <Input label="Email" disabled value={notificationChannels.email} />
      </ConfigurationRow>
      <ConfigurationRow label="Webhooks" explanation="The URL is fictional. No webhook is called.">
        <Input label="Webhook" disabled value={notificationChannels.webhook} />
      </ConfigurationRow>
      <ConfigurationRow label="Delivery" explanation="The switch shows off. It cannot be changed here.">
        <Switch label="Send notifications" description="Off. Not applied." disabled />
      </ConfigurationRow>
      {notificationAlerts.map((alert) => (
        <ConfigurationRow key={alert.id} label={alert.name} explanation={alert.explanation}>
          <Switch label="Sample threshold" description="Shown only. Not a live rule." disabled />
        </ConfigurationRow>
      ))}
    </SettingsSection>
  );
}
