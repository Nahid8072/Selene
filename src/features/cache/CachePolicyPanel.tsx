import { Card, Input } from "@sakaniui/react";
import { cachePolicy } from "../../fixtures/cache.ts";

export function CachePolicyPanel() {
  return (
    <Card title="Cache policies" description="Sample settings. They are not live, and these fields do not save.">
      <div className="form-grid">
        <Input label="Maximum cache size" description="Capacity of node-a." disabled value={cachePolicy.maxSize} />
        <Input label="Eviction policy" description="How objects are chosen for removal." disabled value={cachePolicy.eviction} />
        <Input label="Retention" description="How long an unused object may stay." disabled value={cachePolicy.retention} />
        <Input label="Warming rules" description="Which repositories are warmed ahead of use." disabled value={cachePolicy.warming} />
        <div className="form-grid__wide">
          <Input
            label="Repository-specific behavior"
            description="Overrides for one repository."
            disabled
            value={cachePolicy.repositoryBehavior}
          />
        </div>
      </div>
    </Card>
  );
}
