import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cpuSeries, memorySeries } from "../../fixtures/cache-nodes.ts";

const tooltipStyle = {
  background: "var(--color-bg-surface)",
  border: "1px solid var(--color-border-default)",
  borderRadius: "var(--radius-md)",
  fontSize: 12,
  color: "var(--color-fg-default)",
};

export function NodeResourcePanel() {
  return (
    <section className="panel" aria-labelledby="node-resources">
      <h2 id="node-resources">Resources</h2>
      <p className="section-note">
        CPU ends at 37%. Memory ends at 6.2 GB of a 16 GB node allocation. These host graphs are illustrative and are
        separate from the 100.4 GB cache disk.
      </p>
      <h3>CPU</h3>
      <p className="detail-note">Unit: percent. Illustrative 24h sample. Scale 0–100.</p>
      <div className="resource-chart" aria-label="CPU history, percent">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={cpuSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
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
              dataKey="cpu"
              name="CPU"
              stroke="var(--selene-chart-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h3>Memory</h3>
      <p className="detail-note">Unit: GB. Illustrative 24h sample. Scale 0–16, the node allocation.</p>
      <div className="resource-chart" aria-label="Memory history, GB">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={memorySeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 16]}
              ticks={[0, 4, 8, 12, 16]}
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
              dataKey="memory"
              name="Memory"
              stroke="var(--selene-chart-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
