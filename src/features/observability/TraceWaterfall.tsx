import { traceContext, traceDurationMs, traceStages } from "../../fixtures/observability.ts";

export function TraceWaterfall() {
  return (
    <section className="panel" aria-labelledby="trace-waterfall">
      <h2 id="trace-waterfall">Distributed trace</h2>
      <p className="section-note">
        {traceContext.id} · request {traceContext.requestId} · {traceContext.repositoryId} · {traceContext.workspaceId} ·{" "}
        {traceContext.host}. Total {traceDurationMs} ms. Not a live trace.
      </p>
      <ol className="trace-list">
        {traceStages.map((stage) => (
          <li key={stage.name}>
            <div className="trace-label">
              <span>{stage.name}</span>
              <span>
                {stage.durationMs} ms · {stage.status} · parent {stage.parent}
              </span>
            </div>
            <div className="trace-track" aria-hidden="true">
              <span
                className="trace-span"
                style={{
                  marginLeft: `${(stage.startMs / traceDurationMs) * 100}%`,
                  width: `${(stage.durationMs / traceDurationMs) * 100}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
