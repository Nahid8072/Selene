import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  background: "var(--color-bg-surface)",
  border: "1px solid var(--color-border-default)",
  borderRadius: "var(--radius-md)",
  fontSize: 12,
  color: "var(--color-fg-default)",
};

export function PreviewLineChart({
  data,
  unit,
  domain,
  ticks,
  lines,
}: {
  data: Record<string, string | number>[];
  unit: string;
  domain: [number, number];
  ticks: number[];
  lines: { key: string; name: string; stroke: string }[];
}) {
  return (
    <div className="resource-chart" aria-label={unit}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={domain}
            ticks={ticks}
            tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            isAnimationActive={false}
            contentStyle={tooltipStyle}
            labelStyle={{ color: "var(--color-fg-muted)" }}
            itemStyle={{ color: "var(--color-fg-default)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-fg-default)" }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.stroke}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="detail-note">Unit: {unit}. Illustrative preview data — synthetic, not measured.</p>
    </div>
  );
}
