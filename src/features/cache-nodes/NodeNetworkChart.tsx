import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { networkInboundGb, networkOutboundGb, networkSeries } from "../../fixtures/cache-nodes.ts";

const tooltipStyle = {
  background: "var(--color-bg-surface)",
  border: "1px solid var(--color-border-default)",
  borderRadius: "var(--radius-md)",
  fontSize: 12,
  color: "var(--color-fg-default)",
};

export function NodeNetworkChart() {
  return (
    <section className="panel" aria-labelledby="node-network">
      <h2 id="node-network">Network</h2>
      <p className="section-note">
        In {networkInboundGb.toFixed(1)} GB from upstream. Out {networkOutboundGb.toFixed(1)} GB served from the cache.
        Unit: GB per 4-hour block. Outbound matches the 48.6 GB served on Cache Engine. Illustrative sample.
      </p>
      <div className="resource-chart" aria-label="Network history, GB">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={networkSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
              tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              isAnimationActive={false}
              contentStyle={tooltipStyle}
              labelStyle={{ color: "var(--color-fg-muted)" }}
              itemStyle={{ color: "var(--color-fg-default)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-fg-default)" }} />
            <Line
              type="monotone"
              dataKey="inbound"
              name="Inbound"
              stroke="var(--selene-chart-2)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="outbound"
              name="Outbound"
              stroke="var(--selene-chart-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="detail-note">Unit: GB. Scale 0–12.</p>
      </div>
    </section>
  );
}
