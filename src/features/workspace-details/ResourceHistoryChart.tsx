import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ResourcePoint } from "../../fixtures/workspace-details.ts";

type ResourceHistoryChartProps = {
  name: string;
  unit: string;
  points: ResourcePoint[];
};

export function ResourceHistoryChart({ name, unit, points }: ResourceHistoryChartProps) {
  if (points.length === 0) {
    return <p className="detail-note">No history samples for {name}.</p>;
  }
  return (
    <div className="resource-chart" aria-label={`${name} history, ${unit}`}>
      <ResponsiveContainer width="100%" height={112}>
        <LineChart data={points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "var(--color-fg-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
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
            dataKey="value"
            name={unit}
            stroke="var(--selene-chart-1)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="detail-note">Unit: {unit}</p>
    </div>
  );
}
