import { apiOverview, integrationNotice } from "../../fixtures/integrations.ts";

export function APIOverviewPanel() {
  return (
    <section className="panel" aria-labelledby="api-overview">
      <h2 id="api-overview">API overview</h2>
      <p className="section-note">{integrationNotice}</p>
      <div className="api-overview">
        {apiOverview.map((item) => (
          <article className="api-overview__item" key={item.title}>
            <h3>{item.title}</h3>
            <p className="api-overview__value">{item.value}</p>
            <p className="section-note">{item.context}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
