/* Small explanatory figures for the problem and open-source sections. All decorative motion is CSS,
   gated behind `html.motion` and paused for reduced motion. viewBox 0 0 300 180. */

const AGENT_X = [50, 150, 250];

export function RepeatedAccessFigure() {
  return (
    <svg className="pf" viewBox="0 0 300 180" aria-hidden="true" focusable="false">
      {AGENT_X.map((x, i) => (
        <g key={x}>
          <rect className="pf-box" x={x - 34} y="14" width="68" height="30" rx="4" />
          <text x={x} y="34" textAnchor="middle" className="pf-mono">
            agent 0{i + 1}
          </text>
          <path className="pf-wire" d={`M${x} 44 C ${x} 90, 150 100, 150 134`} />
          <path className="pf-pulse" d={`M150 134 C 150 100, ${x} 90, ${x} 44`} style={{ animationDelay: `${i * -0.5}s` }} />
        </g>
      ))}
      <rect className="pf-box pf-box--strong" x="96" y="134" width="108" height="32" rx="4" />
      <text x="150" y="155" textAnchor="middle" className="pf-mono">
        main@a3f9c21
      </text>
    </svg>
  );
}

export function DuplicatedWorkFigure() {
  const pattern = [1, 0, 1, 1, 1, 0, 0, 1, 1];
  return (
    <svg className="pf" viewBox="0 0 300 180" aria-hidden="true" focusable="false">
      {AGENT_X.map((x, c) => (
        <g key={x}>
          <rect className="pf-box" x={x - 42} y="14" width="84" height="122" rx="4" />
          {pattern.map((on, i) => (
            <rect
              key={i}
              className={on ? `pf-tile pf-tile--${i % 3}` : "pf-tile pf-tile--empty"}
              x={x - 30 + (i % 3) * 22}
              y={30 + Math.floor(i / 3) * 22}
              width="16"
              height="16"
              rx="2"
            />
          ))}
          <text x={x} y="124" textAnchor="middle" className="pf-mono pf-dim">
            copy {c + 1}
          </text>
        </g>
      ))}
      <text x="150" y="164" textAnchor="middle" className="pf-mono">
        same objects, fetched and stored 3×
      </text>
    </svg>
  );
}

export function IsolationFigure() {
  return (
    <svg className="pf" viewBox="0 0 300 180" aria-hidden="true" focusable="false">
      {AGENT_X.map((x, i) => (
        <g key={x}>
          <rect className="pf-box" x={x - 42} y="14" width="84" height="104" rx="4" />
          <text x={x - 30} y="34" className="pf-mono">
            ws-0{i + 1}
          </text>
          {[0, 1, 2].map((r) => (
            <rect key={r} className="pf-bar" x={x - 30} y={48 + r * 18} width={[44, 58, 36][(r + i) % 3]} height="6" rx="2" />
          ))}
          <rect className="pf-caret" x={x - 30 + [44, 58, 36][(2 + i) % 3] + 4} y="83" width="2" height="10" style={{ animationDelay: `${i * 0.37}s` }} />
          <path className="pf-wire pf-wire--dashed" d={`M${x} 118 V146`} />
        </g>
      ))}
      <rect className="pf-base" x="8" y="146" width="284" height="24" rx="4" />
      <text x="150" y="162" textAnchor="middle" className="pf-mono pf-dim">
        shared foundation?
      </text>
    </svg>
  );
}

/** How a contribution travels through the public repository. A process, not a history. */
export function ContributionFlow() {
  const steps = [
    { x: 150, y: 70, label: "branch" },
    { x: 250, y: 70, label: "commit" },
    { x: 350, y: 70, label: "pull request" },
    { x: 450, y: 70, label: "review" },
  ];
  return (
    <svg
      className="cf"
      viewBox="0 0 640 200"
      role="img"
      aria-label="How a contribution flows: create a branch from main, commit, open a pull request, get a review, and merge back into main."
    >
      <text x="20" y="152" className="cf-mono cf-dim">
        main
      </text>
      <path className="cf-line cf-draw" d="M20 130 H620" pathLength={1} />
      <path
        className="cf-line cf-accent cf-draw"
        style={{ animationDelay: "0.3s" }}
        d="M70 130 C 110 130, 110 70, 150 70 H450 C 500 70, 500 130, 550 130"
        pathLength={1}
      />
      {[70, 550].map((x, i) => (
        <circle key={x} className="cf-dot cf-pop" style={{ animationDelay: `${i * 1.1}s` }} cx={x} cy="130" r="7" />
      ))}
      {steps.map((s, i) => (
        <g key={s.label} className="cf-pop" style={{ animationDelay: `${0.5 + i * 0.18}s` }}>
          <circle className="cf-dot cf-dot--accent" cx={s.x} cy={s.y} r="6" />
          <text x={s.x} y={s.y - 18} textAnchor="middle" className="cf-mono">
            {s.label}
          </text>
        </g>
      ))}
      <text x="550" y="162" textAnchor="middle" className="cf-mono cf-pop" style={{ animationDelay: "1.3s" }}>
        merge
      </text>
    </svg>
  );
}
