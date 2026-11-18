import { Badge, Button, Card } from "@sakaniui/react";
import type { IntegrationItem } from "../../fixtures/integrations.ts";

export function IntegrationCard({ item }: { item: IntegrationItem }) {
  return (
    <Card title={item.name} description={item.description}>
      <p>
        <Badge>{item.category}</Badge> <Badge>{item.state}</Badge>
      </p>
      <p className="section-note">{item.preview}</p>
      <div className="detail-actions inert-actions">
        <Button type="button" size="sm" variant="secondary" disabled>
          Connect
        </Button>
        <Button type="button" size="sm" variant="outline" disabled>
          Configure
        </Button>
      </div>
    </Card>
  );
}
