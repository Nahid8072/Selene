import { invitations, securityNotice, users } from "../../fixtures/security.ts";
import { MetricCard } from "../overview/MetricCard.tsx";

export function SecurityOverview() {
  return (
    <section className="panel" aria-labelledby="security-overview">
      <h2 id="security-overview">Security overview</h2>
      <p className="section-note">{securityNotice}</p>
      <div className="kpi-grid">
        <MetricCard title="Sample Accounts" value={String(users.length)} context="Fictional accounts in this preview." />
        <MetricCard title="Pending Invitations" value={String(invitations.length)} context="The invitation is not sent." />
        <MetricCard title="Configured Host" value="node-a" context="Single host in this preview." />
        <MetricCard title="Enforcement Status" value="Not applied" context="These controls are not active." />
      </div>
    </section>
  );
}
