import { Card, SegmentedControl } from "@sakaniui/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { overviewModel, presentedRange, rangeOptions } from "../../fixtures/overview.ts";

export function RepositoryOperationsChart() {
  const points = overviewModel.operations;

  return (
    <section className="panel" aria-labelledby="repository-operations">
      <div className="panel__head">
        <div>
          <h2 id="repository-operations">Repository operations</h2>
          <p className="panel__copy">Sample sync and provisioning counts. The range control is inactive.</p>
        </div>
        <div className="range-control" inert>
          <SegmentedControl options={rangeOptions} value={presentedRange} />
        </div>
      </div>
      <Card>
      <div className="ops-chart">
        <ul className="chart-legend">
          <li>
            <span className="swatch swatch-syncs" aria-hidden="true" />
            Syncs
          </li>
          <li>
            <span className="swatch swatch-provisions" aria-hidden="true" />
            Provisions
          </li>
        </ul>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--color-fg-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "var(--color-fg-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
              allowDecimals={false}
            />
            <Tooltip
              isAnimationActive={false}
              cursor={{ stroke: "var(--color-border-default)", strokeWidth: 1 }}
              contentStyle={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-default)",
                borderRadius: "var(--radius-md)",
                fontSize: 12,
                color: "var(--color-fg-default)",
              }}
              labelStyle={{ color: "var(--color-fg-muted)" }}
              itemStyle={{ color: "var(--color-fg-default)" }}
            />
            <Line
              type="monotone"
              dataKey="syncs"
              name="Syncs"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="provisions"
              name="Provisions"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="axis-note">Horizontal axis: time (UTC). Vertical axis: operation count. Showing the 24h sample.</p>
        <table className="sr-only">
          <caption>24 hour sample of repository operations</caption>
          <thead>
            <tr>
              <th scope="col">Time (UTC)</th>
              <th scope="col">Syncs</th>
              <th scope="col">Provisions</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.label}>
                <th scope="row">{point.label}</th>
                <td>{point.syncs}</td>
                <td>{point.provisions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Card>
    </section>
  );
}
