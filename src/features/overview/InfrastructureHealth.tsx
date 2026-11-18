import { Badge } from "@sakaniui/react";

const services = [
  { name: "Control plane", state: "Sample healthy", variant: "success" as const, note: "Not a live health check." },
  { name: "Cache daemon", state: "Sample warning", variant: "warning" as const, note: "node-a is at 83.7% of 120.0 GB." },
  { name: "Cache nodes", state: "Sample healthy", variant: "success" as const, note: "node-a is the only configured node." },
  { name: "API gateway", state: "Not connected", variant: "neutral" as const, note: "Sample address only. Not a live gateway." },
  { name: "Workspace pool", state: "Sample", variant: "info" as const, note: "Counts come from the workspace sample." },
  { name: "Database connection", state: "Not verified", variant: "neutral" as const, note: "Illustrative. Not a verified connection." },
];

export function InfrastructureHealth() {
  return (
    <section className="panel" aria-labelledby="infrastructure-health">
      <h2 id="infrastructure-health">Infrastructure health</h2>
      <p className="section-note">Sample states for the single host. These are not live checks.</p>
      <ul className="health-list">
        {services.map((service) => (
          <li key={service.name}>
            <div>
              <p className="config-row__label">{service.name}</p>
              <p className="section-note">{service.note}</p>
            </div>
            <Badge variant={service.variant}>{service.state}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
