import { Badge } from "@sakaniui/react";

export function CacheArchitectureDiagram() {
  return (
    <section className="panel" aria-labelledby="cache-architecture">
      <div className="panel__head">
        <h2 id="cache-architecture">Cache architecture</h2>
        <Badge variant="neutral">Single host</Badge>
      </div>
      <p className="section-note">
        Shared immutable objects live in the node cache. Each agent workspace keeps its own writable tree.
      </p>
      <div className="cache-flow">
        <div className="cache-flow__track">
          <article className="cache-node">
            <h3>Agent Workspaces</h3>
            <p>Isolated writable indexes and working trees. They do not share those files.</p>
          </article>
          <div className="cache-links" aria-label="Lookup and hit">
            <span>lookup</span>
            <span>hit</span>
          </div>
          <article className="cache-node">
            <h3>Shared Node-Local Cache</h3>
            <p>node-a. Immutable Git objects used by every workspace on this host.</p>
          </article>
          <div className="cache-links" aria-label="Miss and delivery">
            <span>miss / upstream</span>
            <span>delivery back</span>
          </div>
          <article className="cache-node">
            <h3>Upstream Git Repository</h3>
            <p>Authoritative source. Used only when the node cache misses.</p>
          </article>
        </div>
      </div>
      <p className="detail-note">Regional cache: future / unconfigured. This sample does not deploy one.</p>
    </section>
  );
}
