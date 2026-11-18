import { observabilityHost, observabilityNotice } from "../../fixtures/observability.ts";

export function ObservabilityOverview() {
  return (
    <section className="panel" aria-labelledby="observability-overview">
      <h2 id="observability-overview">Observability overview</h2>
      <p className="section-note">
        {observabilityNotice} The only host is {observabilityHost}. Metrics, logs, traces, events, and alerts below are
        a static sample.
      </p>
    </section>
  );
}
