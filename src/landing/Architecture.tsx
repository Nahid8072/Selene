import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./scroll.ts";

const STEPS = [
  {
    title: "Git repository",
    body: "Selene starts from an existing Git repository. Git remains the source of truth for history, branches and review.",
  },
  {
    title: "Selene infrastructure",
    body: "A self-hosted layer sits between that repository and your agents and takes responsibility for repository access.",
  },
  {
    title: "Shared object cache",
    body: "Repository objects are kept once in a shared cache, designed so concurrent workspaces can reuse them instead of fetching them again.",
  },
  {
    title: "Workspace provisioning",
    body: "Each task gets its own isolated workspace, provisioned from the shared foundation rather than from a fresh clone.",
  },
  {
    title: "Agents, in parallel",
    body: "Agents work independently, each in its own workspace and on its own branch. Their results go back through standard Git.",
  },
];

const ALL = STEPS.length - 1;

/**
 * "How Selene works": the diagram assembles one stage at a time as the visitor scrolls through the
 * steps beside it. Without JavaScript, on narrow screens, or with reduced motion it renders complete.
 */
export function Architecture() {
  const [active, setActive] = useState(ALL);
  const stepsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = stepsRef.current;
    if (!list || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;
    const wide = window.matchMedia("(min-width: 900px)");
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      observer?.disconnect();
      if (!wide.matches) {
        setActive(ALL);
        return;
      }
      setActive(0);
      const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        },
        { rootMargin: "-48% 0px -48% 0px" },
      );
      items.forEach((item) => observer?.observe(item));
    };

    setup();
    wide.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      wide.removeEventListener("change", setup);
    };
  }, []);

  return (
    <div className="arch" data-active={active}>
      <div className="arch__figure-wrap">
        <figure className="arch__figure">
          <ArchDiagram active={active} />
          <figcaption className="arch__caption">
            Conceptual flow. It describes Selene's design direction; the repository tracks what is implemented today.
          </figcaption>
        </figure>
      </div>

      <ol className="arch__steps" ref={stepsRef}>
        {STEPS.map((step, i) => (
          <li key={step.title} data-step={i} className={`arch__step${i <= active ? " is-on" : ""}${i === active ? " is-current" : ""}`}>
            <span className="arch__step-num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="arch__step-title">{step.title}</h3>
            <p className="arch__step-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const AGENT_X = [20, 140, 260];

function ArchDiagram({ active }: { active: number }) {
  const on = (i: number) => (i <= active ? " is-on" : "");
  const live = (i: number) => (i === active || (active === ALL && i === ALL) ? " is-live" : "");
  return (
    <svg
      className="arch__svg"
      viewBox="0 0 380 580"
      role="img"
      aria-label="Diagram: a Git repository connects to Selene's infrastructure layer, which fills a shared object cache, which provisions isolated workspaces for Agent 01, Agent 02 and Agent 03."
    >
      {/* connectors */}
      <path className={`arch__link${on(1)}`} d="M190 78 V128" pathLength={1} />
      <path className={`arch__flow${active >= 1 ? " is-on" : ""}`} d="M190 78 V128" />
      <path className={`arch__link${on(2)}`} d="M190 184 V232" pathLength={1} />
      <path className={`arch__flow${active >= 2 ? " is-on" : ""}`} d="M190 184 V232" />
      <path className={`arch__link${on(3)}`} d="M190 316 V364" pathLength={1} />
      <path className={`arch__flow${active >= 3 ? " is-on" : ""}`} d="M190 316 V364" />
      {AGENT_X.map((x, i) => {
        const d = `M190 420 C 190 452, ${x + 50} 446, ${x + 50} 478`;
        return (
          <g key={x}>
            <path className={`arch__link${on(4)}`} d={d} pathLength={1} style={{ transitionDelay: `${i * 140}ms` }} />
            <path className={`arch__flow${active >= 4 ? " is-on" : ""}`} d={d} style={{ animationDelay: `${i * -0.4}s` }} />
          </g>
        );
      })}

      {/* 1. repository */}
      <g className={`arch__node${on(0)}${live(0)}`}>
        <rect x="90" y="22" width="200" height="56" rx="6" />
        <GitGlyph x={108} y={38} />
        <text x="138" y="47" className="arch__label">
          Git repository
        </text>
        <text x="138" y="64" className="arch__sub">
          source of truth
        </text>
      </g>

      {/* 2. selene */}
      <g className={`arch__node arch__node--selene${on(1)}${live(1)}`}>
        <rect x="70" y="128" width="240" height="56" rx="6" />
        <circle cx="114" cy="156" r="9" className="arch__moon-ring" />
        <path d="M116.6 148.6a7.6 7.6 0 1 0 4.8 9.6 6 6 0 0 1-4.8-9.6Z" className="arch__moon" />
        <text x="138" y="153" className="arch__label">
          Selene infrastructure
        </text>
        <text x="138" y="170" className="arch__sub">
          self-hosted layer
        </text>
      </g>

      {/* 3. cache */}
      <g className={`arch__node${on(2)}${live(2)}`}>
        <rect x="70" y="232" width="240" height="84" rx="6" />
        <text x="90" y="256" className="arch__label">
          Shared object cache
        </text>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            className="arch__obj"
            x={90 + i * 17}
            y={274}
            width="12"
            height="12"
            rx="2"
            style={{ transitionDelay: `${active >= 2 ? i * 45 : 0}ms` }}
          />
        ))}
        <text x="90" y="304" className="arch__sub">
          Git objects, stored once
        </text>
      </g>

      {/* 4. provisioning */}
      <g className={`arch__node${on(3)}${live(3)}`}>
        <rect x="90" y="364" width="200" height="56" rx="6" />
        <text x="110" y="389" className="arch__label">
          Workspace provisioning
        </text>
        <text x="110" y="406" className="arch__sub">
          one workspace per task
        </text>
      </g>

      {/* 5. agents */}
      {AGENT_X.map((x, i) => (
        <g key={x} className={`arch__node arch__agent${on(4)}${live(4)}`} style={{ transitionDelay: `${i * 140}ms` }}>
          <rect x={x} y="478" width="100" height="64" rx="6" />
          <circle cx={x + 16} cy="498" r="3" className="arch__agent-dot" style={{ animationDelay: `${i * 0.35}s` }} />
          <text x={x + 26} y="502" className="arch__label">
            Agent 0{i + 1}
          </text>
          <text x={x + 14} y="526" className="arch__sub arch__sub--id">
            ws-0{i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

function GitGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="arch__glyph">
      <circle cx="4" cy="4" r="3" />
      <circle cx="4" cy="20" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M4 7v10M16 12c0 4-4 5-9.5 6.5" />
    </g>
  );
}
