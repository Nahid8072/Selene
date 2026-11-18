import { databaseSettings } from "../../fixtures/settings.ts";
import { SettingsSection } from "./SettingsSection.tsx";

export function DatabaseHealthPanel() {
  return (
    <SettingsSection id="database-settings" title="Database" note="Illustrative only. This is not a production database and not a verified connection.">
      <dl className="detail-meta detail-meta--stack">
        {databaseSettings.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </SettingsSection>
  );
}
