import { Card, Select } from "@sakaniui/react";
import { resultSummary, resultViewOptions, syntheticLabel } from "../../fixtures/benchmark-results.ts";

export function BenchmarkSummary({ view, onView }: { view: string; onView: (value: string) => void }) {
  return (
    <section className="panel" aria-labelledby="benchmark-summary">
      <h2 id="benchmark-summary">Benchmark summary</h2>
      <p className="section-note">{syntheticLabel}</p>
      <Select
        label="Preview"
        description="Chooses which static rows are listed. It does not start a run."
        value={view}
        options={resultViewOptions}
        onChange={onView}
      />
      <Card title={resultSummary.name} description="Same conditions for the Git baseline and the Selene candidate.">
        <dl className="detail-meta">
          <div>
            <dt>Repository</dt>
            <dd>{resultSummary.repository}</dd>
          </div>
          <div>
            <dt>Revision</dt>
            <dd className="commit-sha">{resultSummary.revision}</dd>
          </div>
          <div>
            <dt>Baseline</dt>
            <dd>{resultSummary.baseline}</dd>
          </div>
          <div>
            <dt>Candidate</dt>
            <dd>{resultSummary.candidate}</dd>
          </div>
          <div>
            <dt>Run date and duration</dt>
            <dd>
              {resultSummary.date}, {resultSummary.duration}
            </dd>
          </div>
          <div>
            <dt>Concurrent workers</dt>
            <dd>{resultSummary.workers}</dd>
          </div>
          <div>
            <dt>Test environment</dt>
            <dd>{resultSummary.environment}</dd>
          </div>
          <div>
            <dt>Software versions</dt>
            <dd>{resultSummary.versions}</dd>
          </div>
          <div>
            <dt>Cache state</dt>
            <dd>{resultSummary.cache}</dd>
          </div>
          <div>
            <dt>Repetitions</dt>
            <dd>{resultSummary.repetitions}</dd>
          </div>
          <div>
            <dt>Resource limits</dt>
            <dd>{resultSummary.resources}</dd>
          </div>
          <div>
            <dt>Workload profile</dt>
            <dd>{resultSummary.profile}</dd>
          </div>
        </dl>
      </Card>
    </section>
  );
}
