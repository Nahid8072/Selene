import { useState } from "react";
import type { ReactNode } from "react";

interface Capability {
  id: string;
  title: string;
  body: string;
  visual: () => ReactNode;
  alt: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: "git",
    title: "Git-compatible infrastructure",
    body: "Works alongside the Git workflows you already have: the same commits, branches and remotes. Selene does not replace Git.",
    visual: GitVisual,
    alt: "A commit graph: agent branches leave main and merge back, using ordinary Git commits.",
  },
  {
    id: "cache",
    title: "Shared object caching",
    body: "A shared caching layer for repository objects, designed so each object is fetched and stored once, then read by every workspace that needs it.",
    visual: CacheVisual,
    alt: "Eight repository objects stored once, each referenced by several workspaces.",
  },
  {
    id: "workspaces",
    title: "Isolated workspaces",
    body: "Workspace provisioning for concurrent agents. Each one gets its own working tree and branch, so one agent's changes never land in another's.",
    visual: WorkspacesVisual,
    alt: "Three separate workspaces with their own branches, all provisioned from one shared foundation.",
  },
  {
    id: "self-host",
    title: "Self-hostable architecture",
    body: "Designed to run on infrastructure you control, for developers and teams who want to keep their code and their caches in-house.",
    visual: SelfHostVisual,
    alt: "A boundary labelled your infrastructure containing Selene, its cache and the workspaces; the Git remote sits outside.",
  },
  {
    id: "agents",
    title: "Agent-oriented design",
    body: "Built around the shape of parallel AI coding work: many short-lived tasks, started together, reading the same repository at once.",
    visual: AgentsVisual,
    alt: "Three agent lanes on a timeline with overlapping tasks running at the same time.",
  },
  {
    id: "open",
    title: "Open source",
    body: "The code and the design documents are public. Inspect how it works, question the decisions, and help shape what it becomes.",
    visual: OpenVisual,
    alt: "A listing of the public Selene repository, including its docs folder and README.",
  },
];

export function Capabilities() {
  const [active, setActive] = useState(0);
  const current = CAPABILITIES[active];

  return (
    <div className="caps">
      <ul className="caps__list">
        {CAPABILITIES.map((cap, i) => (
          <li key={cap.id} className={`caps__item${i === active ? " is-active" : ""}`}>
            <button
              type="button"
              className="caps__trigger"
              aria-pressed={i === active}
              aria-controls="caps-stage"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="caps__title">{cap.title}</span>
              <span className="caps__chev" aria-hidden="true" />
            </button>
            <p className="caps__body">{cap.body}</p>
            <div className="caps__inline" role="img" aria-label={cap.alt}>
              {cap.visual()}
            </div>
          </li>
        ))}
      </ul>

      <div className="caps__stage" id="caps-stage" aria-live="polite">
        <div className="caps__stage-bar">
          <span>{current.title}</span>
          <span className="caps__stage-count">
            {active + 1} / {CAPABILITIES.length}
          </span>
        </div>
        <div key={current.id} className="caps__visual" role="img" aria-label={current.alt}>
          {current.visual()}
        </div>
      </div>
    </div>
  );
}

/* ---------- Visuals. viewBox 0 0 520 320, strokes drawn on entry ---------- */

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg className="cv" viewBox="0 0 520 320" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function GitVisual() {
  const main = [60, 140, 220, 300, 380, 460];
  return (
    <Frame>
      <text x="40" y="92" className="cv-mono">main</text>
      <path className="cv-line cv-draw" d="M40 110 H480" pathLength={1} />
      <path className="cv-line cv-accent cv-draw" style={{ animationDelay: "0.25s" }} d="M140 110 C 170 110, 170 190, 200 190 H300 C 330 190, 350 110, 380 110" pathLength={1} />
      <path className="cv-line cv-accent cv-draw" style={{ animationDelay: "0.45s" }} d="M220 110 C 250 110, 250 250, 280 250 H380 C 410 250, 430 110, 460 110" pathLength={1} />
      {main.map((x, i) => (
        <circle key={x} className="cv-commit cv-pop" style={{ animationDelay: `${0.1 + i * 0.08}s` }} cx={x} cy="110" r="6" />
      ))}
      {[220, 270].map((x, i) => (
        <circle key={x} className="cv-commit cv-commit--accent cv-pop" style={{ animationDelay: `${0.6 + i * 0.1}s` }} cx={x} cy="190" r="5" />
      ))}
      {[300, 350].map((x, i) => (
        <circle key={x} className="cv-commit cv-commit--accent cv-pop" style={{ animationDelay: `${0.8 + i * 0.1}s` }} cx={x} cy="250" r="5" />
      ))}
      <text x="190" y="212" textAnchor="end" className="cv-mono cv-small cv-dim">refund-retries</text>
      <text x="268" y="272" textAnchor="end" className="cv-mono cv-small cv-dim">charge-tests</text>
      <text x="40" y="304" className="cv-mono cv-dim">commit · tree · blob — ordinary Git objects</text>
    </Frame>
  );
}

function CacheVisual() {
  const hashes = ["9c1e04b", "51d0e7a", "a3f9c21", "77b2f10", "e0c4a9d", "2f8ac33", "c91d5e2", "4be19d0"];
  const ws = [70, 210, 350];
  const refs = [
    [0, 1, 2, 4, 6],
    [0, 2, 3, 5, 7],
    [0, 1, 2, 3, 6],
  ];
  return (
    <Frame>
      <text x="40" y="44" className="cv-mono cv-dim">shared cache · each object stored once</text>
      {hashes.map((h, i) => (
        <g key={h} className="cv-pop" style={{ animationDelay: `${i * 0.05}s` }}>
          <rect className="cv-tile" x={40 + i * 56} y="64" width="48" height="40" rx="3" />
          <text x={64 + i * 56} y="89" textAnchor="middle" className="cv-mono cv-small">
            {h.slice(0, 4)}
          </text>
        </g>
      ))}
      {ws.map((x, w) =>
        refs[w].map((o, k) => (
          <path
            key={`${w}-${o}`}
            className={`cv-line cv-thin cv-draw${o === 0 || o === 2 ? " cv-accent" : ""}`}
            style={{ animationDelay: `${0.3 + w * 0.15 + k * 0.04}s` }}
            d={`M${64 + o * 56} 104 C ${64 + o * 56} 170, ${x + 50} 170, ${x + 50} 226`}
            pathLength={1}
          />
        )),
      )}
      {ws.map((x, w) => (
        <g key={x} className="cv-pop" style={{ animationDelay: `${0.5 + w * 0.1}s` }}>
          <rect className="cv-box" x={x} y="226" width="100" height="44" rx="4" />
          <text x={x + 14} y="253" className="cv-mono">ws-0{w + 1}</text>
        </g>
      ))}
    </Frame>
  );
}

function WorkspacesVisual() {
  const cols = [
    { x: 30, ws: "ws-01", branch: "refund-retries", edit: 1 },
    { x: 190, ws: "ws-02", branch: "charge-tests", edit: 3 },
    { x: 350, ws: "ws-03", branch: "ledger-audit", edit: 2 },
  ];
  const widths = [82, 64, 96, 54, 74];
  return (
    <Frame>
      {cols.map((c, i) => (
        <g key={c.ws} className="cv-pop" style={{ animationDelay: `${i * 0.12}s` }}>
          <rect className="cv-box" x={c.x} y="30" width="140" height="196" rx="5" />
          <text x={c.x + 14} y="54" className="cv-mono">{c.ws}</text>
          <text x={c.x + 14} y="72" className="cv-mono cv-small cv-dim">{c.branch}</text>
          <path className="cv-rule" d={`M${c.x} 86 H${c.x + 140}`} />
          {widths.map((w, r) => (
            <rect
              key={r}
              className={r === c.edit ? "cv-bar cv-bar--accent" : "cv-bar"}
              x={c.x + 14 + (r % 2) * 10}
              y={104 + r * 22}
              width={r === c.edit ? w + 12 : w}
              height="7"
              rx="2"
            />
          ))}
        </g>
      ))}
      {cols.map((c, i) => (
        <path key={c.ws} className="cv-line cv-thin cv-draw" style={{ animationDelay: `${0.4 + i * 0.1}s` }} d={`M${c.x + 70} 226 V258`} pathLength={1} />
      ))}
      <rect className="cv-base" x="30" y="258" width="460" height="36" rx="4" />
      <text x="46" y="281" className="cv-mono cv-small">shared foundation · main@a3f9c21</text>
    </Frame>
  );
}

function SelfHostVisual() {
  return (
    <Frame>
      <rect className="cv-boundary" x="170" y="26" width="326" height="270" rx="8" />
      <text x="190" y="52" className="cv-mono cv-small cv-dim">your infrastructure</text>
      <g className="cv-pop">
        <rect className="cv-box" x="24" y="136" width="104" height="48" rx="4" />
        <text x="40" y="157" className="cv-mono">origin</text>
        <text x="40" y="173" className="cv-mono cv-small cv-dim">git remote</text>
      </g>
      <path className="cv-line cv-draw" d="M128 160 H214" pathLength={1} />
      <g className="cv-pop" style={{ animationDelay: "0.15s" }}>
        <rect className="cv-box cv-box--strong" x="214" y="120" width="120" height="80" rx="5" />
        <text x="230" y="146" className="cv-mono">selene</text>
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} className="cv-cell" x={230 + i * 15} y="164" width="10" height="10" rx="2" />
        ))}
        <text x="230" y="192" className="cv-mono cv-small cv-dim">cache</text>
      </g>
      {[80, 160, 240].map((y, i) => (
        <g key={y}>
          <path
            className="cv-line cv-thin cv-accent cv-draw"
            style={{ animationDelay: `${0.35 + i * 0.1}s` }}
            d={`M334 160 C 370 160, 370 ${y}, 400 ${y}`}
            pathLength={1}
          />
          <g className="cv-pop" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
            <rect className="cv-box" x="400" y={y - 18} width="76" height="36" rx="4" />
            <text x="414" y={y + 5} className="cv-mono cv-small">ws-0{i + 1}</text>
          </g>
        </g>
      ))}
    </Frame>
  );
}

function AgentsVisual() {
  const lanes = [
    { y: 70, bars: [[20, 150], [190, 300]] },
    { y: 140, bars: [[60, 210], [240, 330]] },
    { y: 210, bars: [[40, 120], [150, 280], [300, 340]] },
  ];
  return (
    <Frame>
      {lanes.map((l, i) => (
        <g key={l.y}>
          <text x="30" y={l.y + 5} className="cv-mono cv-small">Agent 0{i + 1}</text>
          <path className="cv-rule" d={`M130 ${l.y} H490`} />
          {l.bars.map(([a, b], k) => (
            <rect
              key={a}
              className="cv-bar cv-grow"
              style={{ animationDelay: `${0.1 + i * 0.12 + k * 0.1}s` }}
              x={130 + a}
              y={l.y - 9}
              width={b - a}
              height="18"
              rx="3"
            />
          ))}
        </g>
      ))}
      <path className="cv-rule" d="M130 262 H490" />
      <text x="130" y="284" className="cv-mono cv-small cv-dim">time</text>
      <g className="cv-now">
        <path className="cv-line cv-accent" d="M0 44 V250" />
        <text x="6" y="40" className="cv-mono cv-small cv-accent-text">now</text>
      </g>
    </Frame>
  );
}

function OpenVisual() {
  const rows: [string, string][] = [
    ["dir", "docs"],
    ["dir", "public"],
    ["dir", "src"],
    ["file", "AGENTS.md"],
    ["file", "PROJECT_CONTEXT.md"],
    ["file", "README.md"],
  ];
  return (
    <Frame>
      <rect className="cv-box" x="40" y="26" width="440" height="268" rx="6" />
      <text x="60" y="56" className="cv-mono">Nahid8072/Selene</text>
      <text x="460" y="56" textAnchor="end" className="cv-mono cv-small cv-accent-text">public</text>
      <path className="cv-rule" d="M40 72 H480" />
      {rows.map(([kind, name], i) => (
        <g key={name} className="cv-pop" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
          {kind === "dir" ? (
            <path className="cv-icon" d={`M60 ${96 + i * 34}h7l2 3h9v10H60Z`} />
          ) : (
            <path className="cv-icon" d={`M62 ${95 + i * 34}h8l4 4v11H62Z`} />
          )}
          <text x="90" y={107 + i * 34} className="cv-mono">
            {name}
            {kind === "dir" ? "/" : ""}
          </text>
          {i < rows.length - 1 ? <path className="cv-rule cv-rule--faint" d={`M40 ${120 + i * 34} H480`} /> : null}
        </g>
      ))}
    </Frame>
  );
}
