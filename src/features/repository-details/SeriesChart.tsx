import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "../../fixtures/repository-details.ts";

type SeriesChartProps = {
  title: string;
  caption: string;
  data: SeriesPoint[];
  dataKey: "fetches" | "retrievals" | "agents";
  seriesName: string;
  stroke: string;
};

export function SeriesChart({ title, caption, data, dataKey, seriesName, stroke }: SeriesChartProps) {
  return (
    <section className="panel" aria-label={title}>
      <h3>{title}</h3>
      <p className="detail-note">{caption}</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
            allowDecimals={false}
          />
          <Tooltip
            isAnimationActive={false}
            contentStyle={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "var(--radius-md)",
              fontSize: 12,
              color: "var(--color-fg-default)",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={seriesName}
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
