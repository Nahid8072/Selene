import { Card } from "@sakaniui/react";

export function WorkspaceIsolationPanel() {
  return (
    <Card title="Workspace isolation" description="How a workspace uses the shared cache.">
      <ul className="isolation-list">
        <li>Agents read the same immutable Git objects from the node-local cache.</li>
        <li>Each workspace has its own writable metadata, index, and working tree.</li>
        <li>Agent execution stays inside that workspace. Writes are not visible to other agents.</li>
      </ul>
    </Card>
  );
}
