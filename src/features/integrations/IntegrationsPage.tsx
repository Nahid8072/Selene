import { useState } from "react";
import { Button, Tabs } from "@sakaniui/react";
import { integrationNotice, integrations } from "../../fixtures/integrations.ts";
import { APIKeyPreview } from "./APIKeyPreview.tsx";
import { APIKeyTable } from "./APIKeyTable.tsx";
import { APIOverviewPanel } from "./APIOverviewPanel.tsx";
import { EndpointExplorer } from "./EndpointExplorer.tsx";
import { IntegrationCard } from "./IntegrationCard.tsx";
import { SDKExamplePanel } from "./SDKExamplePanel.tsx";

const sections = [
  { value: "overview", label: "API Overview" },
  { value: "keys", label: "API Key Management" },
  { value: "docs", label: "API Documentation" },
  { value: "integrations", label: "Integrations" },
  { value: "sdks", label: "SDKs & Examples" },
];

export default function IntegrationsPage() {
  const [section, setSection] = useState("overview");
  return (
    <div className="page-stack page-stack--tight">
      <header className="page-header">
        <div>
          <h1>API & Integrations</h1>
          <p>Connect coding agents, developer tools and external systems to Selene's infrastructure.</p>
        </div>
      </header>
      <p className="section-note">{integrationNotice}</p>
      <Tabs items={sections} value={section} onChange={setSection} />
      {section === "overview" ? <APIOverviewPanel /> : null}
      {section === "keys" ? (
        <section className="panel" aria-labelledby="api-keys">
          <h2 id="api-keys">API key management</h2>
          <p className="section-note">Identifiers are masked. Create and revoke do not run, and no secret is generated.</p>
          <div className="detail-actions inert-actions">
            <Button type="button" variant="primary" disabled>
              Create API key
            </Button>
          </div>
          <APIKeyTable />
          <h3>Creation preview</h3>
          <APIKeyPreview />
        </section>
      ) : null}
      {section === "docs" ? <EndpointExplorer /> : null}
      {section === "integrations" ? (
        <section className="panel" aria-labelledby="integration-list">
          <h2 id="integration-list">Integrations</h2>
          <p className="section-note">Every integration is not connected. Connect and configure do not run.</p>
          <div className="integration-grid">
            {integrations.map((item) => (
              <IntegrationCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
      {section === "sdks" ? <SDKExamplePanel /> : null}
    </div>
  );
}
