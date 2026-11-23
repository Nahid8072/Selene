import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./scroll.ts";

/**
 * The hero's signature visual: an illustrative workspace in which one Git repository is synced into
 * Selene's shared object cache, three isolated workspaces are provisioned from it, three agents run
 * in parallel, and their work goes back to the repository through Git. Everything here is
 * simulated demonstration data, labelled as such in the window chrome.
 *
 * Discrete states (phase, agent status, log lines) come from one clock through `snapshot()`, and
 * React re-renders only when they change. The moving objects on the wires are positioned
 * imperatively each frame, so the loop never re-renders React at 60fps.
 */

const LOOP = 16000;
const RESET_AT = 15200;

type Phase = "idle" | "connect" | "sync" | "provision" | "run" | "commit" | "settle";
type AgentStatus = "idle" | "provisioning" | "running" | "done";

const PHASES: { at: number; phase: Phase; label: string }[] = [
  { at: 0, phase: "idle", label: "Waiting for repository" },
  { at: 700, phase: "connect", label: "Connecting repository" },
  { at: 2000, phase: "sync", label: "Syncing objects to cache" },
  { at: 5200, phase: "provision", label: "Provisioning workspaces" },
  { at: 7000, phase: "run", label: "3 agents running" },
  { at: 12500, phase: "commit", label: "Committing through Git" },
  { at: 14000, phase: "settle", label: "All workspaces settled" },
];

const AGENTS = [
  {
    id: "01",
    task: "Feature implementation",
    ws: "ws-01",
    branch: "agent/refund-retries",
    lines: ["edit src/api/refunds.ts", "+ retryWithBackoff(charge, { max: 3 })"],
    provisionAt: 5400,
    startAt: 7000,
    doneAt: 12600,
    result: "committed 4be19d0",
  },
  {
    id: "02",
    task: "Test execution",
    ws: "ws-02",
    branch: "agent/charge-tests",
    lines: ["run tests/charges.test.ts", "pass  refund retries after timeout"],
    provisionAt: 5800,
    startAt: 7600,
    doneAt: 13100,
    result: "committed 71c2a9e",
  },
  {
    id: "03",
    task: "Code analysis",
    ws: "ws-03",
    branch: "agent/ledger-audit",
    lines: ["read src/ledger/balance.ts", "note  2 exports unused outside ledger/"],
    provisionAt: 6200,
    startAt: 8200,
    doneAt: 13600,
    result: "report written",
  },
] as const;

const LOGS: { at: number; tag: string; text: string }[] = [
  { at: 700, tag: "git", text: "connect origin  acme/payments-api" },
  { at: 2000, tag: "sync", text: "fetch refs/heads/main  a3f9c21" },
  { at: 3600, tag: "cache", text: "objects written to shared cache" },
  { at: 5000, tag: "sync", text: "repository synchronized" },
  { at: 5400, tag: "ws", text: "ws-01 provisioned from main@a3f9c21" },
  { at: 5800, tag: "ws", text: "ws-02 provisioned from main@a3f9c21" },
  { at: 6200, tag: "ws", text: "ws-03 provisioned from main@a3f9c21" },
  { at: 7400, tag: "cache", text: "ws-01 tree 9c1e04b  served from cache" },
  { at: 8400, tag: "cache", text: "ws-02 blob 51d0e7a  served from cache" },
  { at: 9300, tag: "cache", text: "ws-03 tree 9c1e04b  served from cache" },
  { at: 12600, tag: "git", text: "ws-01 commit 4be19d0  agent/refund-retries" },
  { at: 13100, tag: "git", text: "ws-02 commit 71c2a9e  agent/charge-tests" },
  { at: 13700, tag: "git", text: "push origin  git operation completed" },
];

const TREE: { name: string; depth: number; dir?: boolean; agent?: number }[] = [
  { name: "src", depth: 0, dir: true },
  { name: "api", depth: 1, dir: true },
  { name: "charges.ts", depth: 2 },
  { name: "refunds.ts", depth: 2, agent: 0 },
  { name: "ledger", depth: 1, dir: true },
  { name: "balance.ts", depth: 2, agent: 2 },
  { name: "workers.ts", depth: 1 },
  { name: "tests", depth: 0, dir: true },
  { name: "charges.test.ts", depth: 1, agent: 1 },
  { name: "package.json", depth: 0 },
  { name: "README.md", depth: 0 },
];

interface Snapshot {
  phase: Phase;
  label: string;
  origin: boolean;
  wire: boolean;
  cache: "empty" | "filling" | "warm";
  ws: boolean[];
  agents: AgentStatus[];
}

function snapshot(t: number): Snapshot {
  if (t >= RESET_AT) t = 0;
  let current = PHASES[0];
  for (const p of PHASES) if (t >= p.at) current = p;
  return {
    phase: current.phase,
    label: current.label,
    origin: t >= 700,
    wire: t >= 1000,
    cache: t >= 5000 ? "warm" : t >= 2000 ? "filling" : "empty",
    ws: AGENTS.map((a) => t >= a.provisionAt),
    agents: AGENTS.map((a) =>
      t >= a.doneAt ? "done" : t >= a.startAt ? "running" : t >= a.provisionAt ? "provisioning" : "idle",
    ),
  };
}

const keyOf = (s: Snapshot) => `${s.phase}|${s.origin}|${s.wire}|${s.cache}|${s.ws.join()}|${s.agents.join()}`;

/** The state shown without JavaScript, with reduced motion, and before hydration: agents mid-run. */
const STATIC_T = 10400;
const STATIC_SNAPSHOT = snapshot(STATIC_T);

interface LogLine {
  id: number;
  stamp: string;
  tag: string;
  text: string;
}

function stamp(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}.${Math.floor((ms % 1000) / 100)}`;
}

const STATIC_LOGS: LogLine[] = LOGS.filter((l) => l.at <= STATIC_T)
  .slice(-5)
  .map((l, i) => ({ id: i, stamp: stamp(l.at), tag: l.tag, text: l.text }));

/* ---------- Cache grid: 10 x 6 cells, 46 of them filled in a fixed scattered order ---------- */

const COLS = 10;
const ROWS = 6;
const CELL = 13;
const GAP = 4;
const GRID_X = 196;
const GRID_Y = 110;
/** Deterministic scatter so server and client markup match. */
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const rank = (i * 37 + 11) % (COLS * ROWS);
  return { i, x: GRID_X + (i % COLS) * (CELL + GAP), y: GRID_Y + Math.floor(i / COLS) * (CELL + GAP), rank };
});
const FILLED = 46;
/** Cells that flash while agents read from the cache. */
const READ_CELLS = new Set([3, 14, 22, 27, 35, 41, 48, 56]);

/* ---------- Wires (SVG user units, viewBox 0 0 560 340) ---------- */

const WIRES = [
  "M112 170 H180",
  "M376 140 C 412 140, 410 76, 446 76",
  "M376 170 H446",
  "M376 200 C 412 200, 410 264, 446 264",
];
const WS_Y = [56, 150, 244];

/* ---------- Moving objects ---------- */

interface Packet {
  wire: number;
  p: number;
  back?: boolean;
}

const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

function packetsAt(t: number): Packet[] {
  const out: Packet[] = [];
  // Repository objects flowing into the cache.
  for (let k = 0; k < 18; k++) {
    const start = 2050 + k * 160;
    if (t >= start && t < start + 560) out.push({ wire: 0, p: (t - start) / 560 });
  }
  // Agents reading objects from the shared cache.
  AGENTS.forEach((a, i) => {
    for (let start = a.startAt + 150 + i * 90; start < a.doneAt - 500; start += 720) {
      if (t >= start && t < start + 620) out.push({ wire: i + 1, p: (t - start) / 620 });
    }
  });
  // Commits travelling back to the Git remote (agents 01 and 02 commit; 03 only reports).
  AGENTS.slice(0, 2).forEach((a, i) => {
    const s = a.doneAt;
    if (t >= s && t < s + 480) out.push({ wire: i + 1, p: (t - s) / 480, back: true });
    if (t >= s + 480 && t < s + 980) out.push({ wire: 0, p: (t - s - 480) / 500, back: true });
  });
  return out;
}

const POOL = 10;

export function AgentWorkspace() {
  const [snap, setSnap] = useState<Snapshot>(STATIC_SNAPSHOT);
  const [logs, setLogs] = useState<LogLine[]>(STATIC_LOGS);
  /** Agent the visitor is pointing at (or tapped): its workspace, wire and files stay lit, the rest dim. */
  const [focusAgent, setFocusAgent] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const wireRefs = useRef<(SVGPathElement | null)[]>([]);
  const packetRefs = useRef<(SVGRectElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    const lengths = wireRefs.current.map((w) => w?.getTotalLength() ?? 0);
    let clock = 0;
    let prev = 0;
    let lastT = -1;
    let lastKey = "";
    let raf = 0;
    let onScreen = true;
    let logId = 100;

    // Restart from an empty workspace so the first loop builds up in front of the visitor.
    setLogs([]);
    setSnap(snapshot(0));

    const frame = (now: number) => {
      if (prev === 0) prev = now;
      clock += Math.min(now - prev, 64);
      prev = now;
      const t = clock % LOOP;

      // Log lines whose time was crossed since the last frame (including across the loop seam).
      const wrapped = t < lastT;
      const fresh = LOGS.filter((l) => (wrapped ? l.at > lastT || l.at <= t : l.at > lastT && l.at <= t));
      if (fresh.length) {
        setLogs((cur) =>
          [...cur, ...fresh.map((l) => ({ id: logId++, stamp: stamp(clock - (t - l.at)), tag: l.tag, text: l.text }))].slice(-6),
        );
      }
      lastT = t;

      const s = snapshot(t);
      const key = keyOf(s);
      if (key !== lastKey) {
        lastKey = key;
        setSnap(s);
      }

      const packets = t >= RESET_AT ? [] : packetsAt(t);
      for (let i = 0; i < POOL; i++) {
        const el = packetRefs.current[i];
        const wire = wireRefs.current[packets[i]?.wire ?? 0];
        if (!el) continue;
        const pk = packets[i];
        if (!pk || !wire) {
          el.style.opacity = "0";
          continue;
        }
        const p = ease(pk.back ? 1 - pk.p : pk.p);
        const pt = wire.getPointAtLength(p * lengths[pk.wire]);
        el.setAttribute("transform", `translate(${(pt.x - 3).toFixed(1)} ${(pt.y - 3).toFixed(1)})`);
        el.style.opacity = String(Math.min(1, Math.sin(pk.p * Math.PI) * 2.2));
        el.classList.toggle("is-back", Boolean(pk.back));
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !onScreen || document.hidden) return;
      prev = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(root);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    // Give the entrance choreography a beat before the loop starts.
    const delay = window.setTimeout(start, 900);

    return () => {
      window.clearTimeout(delay);
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="aw" ref={rootRef} data-phase={snap.phase} data-focus={focusAgent ?? undefined}>
      <div className="aw__bar">
        <p className="aw__crumbs">
          <span className="aw__crumb-strong">selene</span>
          <span aria-hidden="true">/</span>
          <span>acme/payments-api</span>
          <span aria-hidden="true">/</span>
          <span className="aw__branch">main</span>
        </p>
        <p className="aw__phase" aria-hidden="true">
          <span className="aw__phase-dot" />
          <span key={snap.label} className="aw__phase-label">
            {snap.label}
          </span>
        </p>
        <p className="aw__sim">Simulated</p>
      </div>

      <div className="aw__body">
        {/* Repository explorer */}
        <div className="aw__explorer">
          <p className="aw__panel-title">Repository</p>
          <div className="aw__repo">
            <span className="aw__repo-name">acme/payments-api</span>
            <span className="aw__meta">
              <span>main</span>
              <span>HEAD a3f9c21</span>
            </span>
          </div>
          <ul className={`aw__tree${snap.cache === "filling" ? " is-scanning" : ""}`}>
            {TREE.map((row, i) => {
              const owner = row.agent;
              const touched = owner !== undefined && snap.agents[owner] !== "idle" && snap.agents[owner] !== "provisioning";
              return (
                <li
                  key={row.name}
                  className={`aw__row${row.dir ? " is-dir" : ""}${touched ? " is-touched" : ""}${
                    owner === 0 && snap.agents[0] === "running" ? " is-selected" : ""
                  }`}
                  style={{ paddingLeft: `${10 + row.depth * 12}px`, ["--i" as string]: i }}
                >
                  <span className="aw__row-icon">{row.dir ? <FolderGlyph /> : <FileGlyph />}</span>
                  <span className="aw__row-name">{row.name}</span>
                  {touched && owner !== undefined ? <span className="aw__row-agent">A{AGENTS[owner].id}</span> : null}
                </li>
              );
            })}
          </ul>
          <dl className="aw__git">
            <div>
              <dt>remote</dt>
              <dd>origin</dd>
            </div>
            <div>
              <dt>objects</dt>
              <dd>{snap.cache === "empty" ? "not cached" : snap.cache === "filling" ? "syncing" : "in shared cache"}</dd>
            </div>
            <div>
              <dt>worktrees</dt>
              <dd>{snap.ws.filter(Boolean).length} isolated</dd>
            </div>
          </dl>
        </div>

        {/* Infrastructure core */}
        <div className="aw__core">
          <svg className="aw__svg" viewBox="0 0 560 340" role="presentation">
            {/* wires: resting line plus a drawn overlay */}
            {WIRES.map((d, i) => (
              <g key={d}>
                <path className="aw__wire-rest" d={d} />
                <path
                  ref={(el) => {
                    wireRefs.current[i] = el;
                  }}
                  className={`aw__wire aw__wire--${i}${(i === 0 ? snap.wire : snap.ws[i - 1]) ? " is-on" : ""}${
                    i > 0 && snap.agents[i - 1] === "running" ? " is-live" : ""
                  }`}
                  d={d}
                  pathLength={1}
                  style={{ transitionDelay: i === 0 ? "0ms" : `${(i - 1) * 120}ms` }}
                />
              </g>
            ))}

            {/* origin */}
            <g className={`aw__node aw__origin${snap.origin ? " is-on" : ""}`}>
              <rect x="16" y="144" width="96" height="52" rx="5" />
              <text x="30" y="166" className="aw__svg-label">
                origin
              </text>
              <text x="30" y="183" className="aw__svg-sub">
                git remote
              </text>
            </g>

            {/* selene core + cache */}
            <g className={`aw__node aw__selene is-cache-${snap.cache}`}>
              <rect x="180" y="58" width="196" height="224" rx="6" />
              <text x="196" y="80" className="aw__svg-label">
                selene
              </text>
              <text x="196" y="95" className="aw__svg-sub">
                shared object cache
              </text>
              {CELLS.map((c) => (
                <rect
                  key={c.i}
                  className={`aw__cell${c.rank < FILLED ? " is-f" : ""}${READ_CELLS.has(c.i) ? " is-r" : ""}`}
                  x={c.x}
                  y={c.y}
                  width={CELL}
                  height={CELL}
                  rx="2"
                  style={{ ["--d" as string]: `${Math.round((c.rank / FILLED) * 2800)}ms`, ["--r" as string]: `${(c.i % 5) * 260}ms` }}
                />
              ))}
              <text x="196" y="226" className="aw__svg-sub">
                state
              </text>
              <text x="360" y="226" textAnchor="end" className="aw__svg-value">
                {snap.cache === "empty" ? "empty" : snap.cache === "filling" ? "filling" : "warm"}
              </text>
              <text x="196" y="250" className="aw__svg-sub">
                readers
              </text>
              <text x="360" y="250" textAnchor="end" className="aw__svg-value">
                {snap.agents.filter((a) => a === "running").length} workspaces
              </text>
            </g>

            {/* workspaces */}
            {AGENTS.map((a, i) => (
              <g
                key={a.ws}
                className={`aw__node aw__wsnode aw__wsnode--${i + 1}${snap.ws[i] ? " is-on" : ""}${snap.agents[i] === "running" ? " is-live" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <rect x="446" y={WS_Y[i]} width="100" height="40" rx="5" />
                <circle cx="460" cy={WS_Y[i] + 20} r="3" className="aw__ws-dot" />
                <text x="470" y={WS_Y[i] + 24} className="aw__svg-label">
                  {a.ws}
                </text>
              </g>
            ))}

            {/* moving objects */}
            {Array.from({ length: POOL }, (_, i) => (
              <rect
                key={i}
                ref={(el) => {
                  packetRefs.current[i] = el;
                }}
                className="aw__packet"
                width="6"
                height="6"
                rx="1"
                style={{ opacity: 0 }}
              />
            ))}
          </svg>
        </div>

        {/* Concurrent agent workspaces */}
        <div className="aw__agents">
          <p className="aw__panel-title">Agent workspaces</p>
          {AGENTS.map((a, i) => {
            const status = snap.agents[i];
            return (
              <div
                key={a.id}
                className={`aw__agent aw__agent--${i + 1} is-${status}`}
                style={{ ["--run" as string]: `${a.doneAt - a.startAt}ms` }}
                onMouseEnter={() => setFocusAgent(i + 1)}
                onMouseLeave={() => setFocusAgent(null)}
                onClick={() => setFocusAgent((f) => (f === i + 1 ? null : i + 1))}
              >
                <div className="aw__agent-head">
                  <span className="aw__agent-name">Agent {a.id}</span>
                  <span className="aw__status">
                    <span className="aw__status-dot" />
                    {status}
                  </span>
                </div>
                <p className="aw__agent-task">{a.task}</p>
                <p className="aw__agent-meta">
                  {a.ws} · {a.branch}
                </p>
                <span className="aw__progress">
                  <span className="aw__progress-bar" />
                </span>
                <div className="aw__agent-out">
                  {status === "running" || status === "done" ? (
                    <>
                      <span className="aw__type">{a.lines[0]}</span>
                      <span className="aw__type aw__type--2">
                        {a.lines[1]}
                        {i === 0 && status === "running" ? <span className="aw__caret" /> : null}
                      </span>
                    </>
                  ) : (
                    <span className="aw__agent-wait">{status === "provisioning" ? "preparing workspace" : "waiting"}</span>
                  )}
                </div>
                {status === "done" ? <p className="aw__agent-result">{a.result}</p> : null}
              </div>
            );
          })}
        </div>

        {/* Activity stream */}
        <div className="aw__stream">
          <p className="aw__panel-title">Activity</p>
          <ol className="aw__log">
            {logs.map((l) => (
              <li key={l.id} className="aw__log-line">
                <span className="aw__log-time">{l.stamp}</span>
                <span className={`aw__log-tag aw__log-tag--${l.tag}`}>{l.tag}</span>
                <span className="aw__log-text">{l.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/**
 * The hero workspace once its loop has finished: every agent done, work merged back into main
 * through Git, cache still warm. Closes the story the hero opens. Static apart from a one-time settle.
 */
export function SettledWorkspace() {
  const merges = [
    { x: 200, from: 70, hash: "4be19d0", label: "refund-retries" },
    { x: 364, from: 244, hash: "71c2a9e", label: "charge-tests" },
  ];
  return (
    <div className="aw awx">
      <div className="aw__bar">
        <p className="aw__crumbs">
          <span className="aw__crumb-strong">selene</span>
          <span aria-hidden="true">/</span>
          <span>acme/payments-api</span>
          <span aria-hidden="true">/</span>
          <span className="aw__branch">main</span>
        </p>
        <p className="aw__phase awx__phase">
          <span className="aw__phase-dot" />
          <span>Settled</span>
        </p>
        <p className="aw__sim">Simulated</p>
      </div>

      <div className="awx__graph">
        <svg viewBox="0 0 440 110" className="cv" aria-hidden="true" focusable="false">
          <text x="16" y="50" className="cv-mono cv-small cv-dim">
            main
          </text>
          <path className="cv-line cv-draw" d="M56 46 H424" pathLength={1} />
          {merges.map((m, i) => (
            <g key={m.hash}>
              <path
                className="cv-line cv-accent cv-draw"
                style={{ animationDelay: `${0.3 + i * 0.2}s` }}
                d={`M${m.from} 46 C ${m.from + 24} 46, ${m.from + 20} 86, ${m.from + 50} 86 H${m.x - 50} C ${m.x - 20} 86, ${m.x - 24} 46, ${m.x} 46`}
                pathLength={1}
              />
              <circle className="cv-commit cv-commit--accent cv-pop" style={{ animationDelay: `${0.7 + i * 0.2}s` }} cx={m.x} cy="46" r="6" />
              <text x={m.x} y="26" textAnchor="middle" className="cv-mono cv-small cv-pop" style={{ animationDelay: `${0.8 + i * 0.2}s` }}>
                {m.hash}
              </text>
              <text x={m.from + 52} y="104" className="cv-mono cv-small cv-dim">
                {m.label}
              </text>
            </g>
          ))}
          <circle className="cv-commit" cx="70" cy="46" r="5" />
          <circle className="cv-commit" cx="244" cy="46" r="5" />
          <circle className="cv-commit cv-pop" style={{ animationDelay: "1.2s" }} cx="410" cy="46" r="6" />
        </svg>
      </div>

      <ul className="awx__rows">
        {AGENTS.map((a, i) => (
          <li key={a.id} className="awx__row" style={{ ["--i" as string]: i }}>
            <span className="awx__agent">
              <span className="aw__status-dot" />
              Agent {a.id}
            </span>
            <span className="awx__task">{a.task}</span>
            <span className="awx__result">{a.result}</span>
          </li>
        ))}
      </ul>

      <ol className="aw__log awx__log">
        <li className="aw__log-line">
          <span className="aw__log-tag aw__log-tag--cache">cache</span>
          <span className="aw__log-text">shared cache warm, 3 workspaces served</span>
        </li>
        <li className="aw__log-line">
          <span className="aw__log-tag aw__log-tag--git">git</span>
          <span className="aw__log-text">push origin  git operation completed</span>
        </li>
      </ol>
    </div>
  );
}

function FolderGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M1.75 4.25v8a1 1 0 0 0 1 1h10.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H8L6.5 3.25H2.75a1 1 0 0 0-1 1Z" />
    </svg>
  );
}

function FileGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M4 1.75h5.25L12.5 5v8.25a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10.5a1 1 0 0 1 1-1Z" />
      <path d="M9 1.75V5.25h3.5" />
    </svg>
  );
}
