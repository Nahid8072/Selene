import { LineChart } from "@sakaniui/react";
import { cacheSeries, cacheWindow } from "../../fixtures/cache.ts";

export function CacheOperationsChart() {
  const data: Record<string, string | number>[] = cacheSeries.map((point) => ({
    label: point.label,
    hits: point.hits,
    misses: point.misses,
    writes: point.writes,
    retrievals: point.retrievals,
    evictions: point.evictions,
  }));
  return (
    <section className="panel" aria-labelledby="cache-operations-chart">
      <h2 id="cache-operations-chart">Cache operations</h2>
      <p className="section-note">
        {cacheWindow}. Unit: operations. Retrievals are hits plus misses. Hover a point for its values.
      </p>
      <LineChart
        data={data}
        series={["hits", "misses", "writes", "retrievals", "evictions"]}
        xKey="label"
        showLegend
        height={220}
      />
    </section>
  );
}
