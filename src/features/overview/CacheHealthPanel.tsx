import { Badge, Card, ProgressStat } from "@sakaniui/react";
import { overviewModel } from "../../fixtures/overview.ts";

export function CacheHealthPanel() {
  const cache = overviewModel.cache;

  return (
    <section className="panel" aria-labelledby="cache-health">
      <div className="panel__head">
        <div>
          <h2 id="cache-health">Cache health</h2>
          <p className="panel__copy">Node-local mirror sample. Not a measured trial.</p>
        </div>
      </div>
      <Card>
        <div className="cache-health">
          <div className="cache-status">
            <span>Overall</span>
            <Badge variant={cache.badgeVariant}>{cache.statusLabel}</Badge>
          </div>
          <dl className="cache-ratio">
            <div>
              <dt>Hit / miss</dt>
              <dd>
                {cache.hitsLabel} / {cache.missesLabel}
              </dd>
            </div>
            <div>
              <dt>Ratio</dt>
              <dd>{cache.ratioLabel}</dd>
            </div>
          </dl>
          <ProgressStat
            label="Storage utilization"
            value={cache.utilizationLabel}
            progress={cache.utilization}
          />
          <p className="cache-meta">
            {cache.volumeLabel} cached · {cache.objectLabel} · {cache.leaseLabel}
          </p>
          <p className="cache-note">{cache.note}</p>
        </div>
      </Card>
    </section>
  );
}
