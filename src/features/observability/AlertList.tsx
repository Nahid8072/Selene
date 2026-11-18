import { Badge, Button, Card } from "@sakaniui/react";
import { sampleAlerts } from "../../fixtures/observability.ts";

export function AlertList() {
  return (
    <section className="panel" aria-labelledby="alerts">
      <h2 id="alerts">Alerts</h2>
      <p className="section-note">Sample configuration. Acknowledge, resolve, and configure do not run, and this is not a live alerting engine.</p>
      <div className="detail-actions inert-actions">
        <Button type="button" size="sm" variant="secondary" disabled>
          Acknowledge
        </Button>
        <Button type="button" size="sm" variant="outline" disabled>
          Resolve
        </Button>
        <Button type="button" size="sm" variant="ghost" disabled>
          Configure
        </Button>
      </div>
      {sampleAlerts.map((alert) => (
        <Card key={alert.id} title={alert.name} description={alert.explanation}>
          <p>
            <Badge variant={alert.severity === "Error" ? "danger" : "warning"}>{alert.severity}</Badge> {alert.state}. Resource{" "}
            {alert.resource}. Last triggered {alert.triggered}.
          </p>
        </Card>
      ))}
    </section>
  );
}
