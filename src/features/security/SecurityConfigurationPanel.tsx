import { securityNotice, securitySettings } from "../../fixtures/security.ts";

export function SecurityConfigurationPanel() {
  return (
    <section className="panel" aria-labelledby="security-settings">
      <h2 id="security-settings">Security settings</h2>
      <p className="section-note">{securityNotice} No secret value is shown.</p>
      <div className="integration-grid">
        {securitySettings.map((group) => (
          <article key={group.id} className="api-overview__item">
            <h3>{group.title}</h3>
            <dl className="detail-meta detail-meta--stack">
              {group.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
