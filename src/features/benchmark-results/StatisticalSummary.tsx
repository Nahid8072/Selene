import { Card } from "@sakaniui/react";
import { checkoutBuckets, gitStats, seleneStats, syntheticLabel, type SystemStats } from "../../fixtures/benchmark-results.ts";

function block(stats: SystemStats) {
  const buckets = checkoutBuckets(stats.system);
  return (
    <Card title={stats.system} description="Completed rows only. Failed rows are counted separately.">
      <dl className="detail-meta detail-meta--stack">
        <div>
          <dt>Completed rows</dt>
          <dd>{stats.count}</dd>
        </div>
        <div>
          <dt>Failed runs</dt>
          <dd>{stats.failed}</dd>
        </div>
        <div>
          <dt>Median checkout</dt>
          <dd>{stats.checkoutMedian} ms</dd>
        </div>
        <div>
          <dt>p95 checkout</dt>
          <dd>{stats.checkoutP95} ms</dd>
        </div>
        <div>
          <dt>Min checkout</dt>
          <dd>{stats.checkoutMin} ms</dd>
        </div>
        <div>
          <dt>Max checkout</dt>
          <dd>{stats.checkoutMax} ms</dd>
        </div>
        <div>
          <dt>Checkout distribution</dt>
          <dd>{buckets.map((bucket) => `${bucket.label}: ${bucket.count}`).join(". ")}</dd>
        </div>
      </dl>
    </Card>
  );
}

export function StatisticalSummary() {
  return (
    <section className="panel" aria-labelledby="statistical-summary">
      <h2 id="statistical-summary">Statistical summary</h2>
      <p className="section-note">
        {syntheticLabel} Median, p95, min, max, distribution, and failed-run counts are computed from the trial rows.
        They are not a separate aggregate and they are not a significance test.
      </p>
      <div className="stat-grid">
        {block(gitStats)}
        {block(seleneStats)}
      </div>
    </section>
  );
}
