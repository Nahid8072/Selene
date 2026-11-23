import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./scroll.ts";

/**
 * The isometric architecture illustration (supplied artwork) with an SVG overlay drawn in the
 * image's own pixel space: light and data packets travel the real tubes, and each component can
 * be hovered, focused or tapped to highlight its part of the flow. Illustrative only.
 *
 * Without JavaScript or with reduced motion it renders as the still artwork with its connections lit.
 */

type Part = "repo" | "cache" | "a1" | "a2" | "a3";

const W = 1774;
const H = 887;

const LINKS: { id: Part; d: string }[] = [
  { id: "repo", d: "M420 532 C 455 540, 480 520, 512 512 S 570 492, 597 488 S 660 470, 686 468" },
  { id: "a1", d: "M1100 410 C 1160 400, 1180 330, 1212 290 S 1270 212, 1333 208" },
  { id: "a2", d: "M1100 465 C 1170 452, 1230 440, 1282 433 S 1360 437, 1398 437" },
  { id: "a3", d: "M1100 518 C 1170 515, 1210 560, 1240 595 S 1320 690, 1390 688" },
];

const REGIONS: { id: Part; x: number; y: number; w: number; h: number; label: string; detail: string }[] = [
  {
    id: "repo",
    x: 55,
    y: 300,
    w: 415,
    h: 425,
    label: "Git repository",
    detail: "Your existing Git repository stays the source of truth. Selene connects to it; history, branches and review stay in Git.",
  },
  {
    id: "cache",
    x: 600,
    y: 185,
    w: 520,
    h: 570,
    label: "Shared object cache",
    detail: "Selene's infrastructure layer keeps repository objects once, so every workspace can reuse them instead of fetching them again.",
  },
  {
    id: "a1",
    x: 1300,
    y: 60,
    w: 350,
    h: 260,
    label: "Agent 01 workspace",
    detail: "Feature implementation in an isolated workspace on its own branch, provisioned from the shared cache.",
  },
  {
    id: "a2",
    x: 1360,
    y: 296,
    w: 364,
    h: 262,
    label: "Agent 02 workspace",
    detail: "Test execution in its own workspace. Nothing it changes reaches the other agents.",
  },
  {
    id: "a3",
    x: 1352,
    y: 545,
    w: 376,
    h: 278,
    label: "Agent 03 workspace",
    detail: "Code analysis in a third isolated workspace, reading the same objects from the shared cache.",
  },
];

const IDLE_TEXT = "Hover or tap a component to trace its part of the flow.";
const STEPS = ["Repository connected", "Objects cached", "Workspaces provisioned", "Agents executing"];

/** Which links light up for a focused part. */
const RELATED: Record<Part, Part[]> = {
  repo: ["repo"],
  cache: ["repo", "a1", "a2", "a3"],
  a1: ["repo", "a1"],
  a2: ["repo", "a2"],
  a3: ["repo", "a3"],
};

export function IsoArchitecture() {
  const [focus, setFocus] = useState<Part | null>(null);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    setMotionOk(!prefersReducedMotion());
  }, []);

  const lit = focus ? RELATED[focus] : null;
  const current = REGIONS.find((r) => r.id === focus);

  return (
    <figure className={`iso${focus ? " has-focus" : ""}`} data-focus={focus ?? undefined}>
      <div className="iso__stage" onMouseLeave={() => setFocus(null)}>
        <div className="iso__float">
          <img
            className="iso__img"
            src="/media/selene-architecture.webp"
            width={W}
            height={H}
            loading="lazy"
            decoding="async"
            alt="Isometric illustration: a Git repository module feeds data cubes into a central Selene infrastructure core holding a grid of cached objects, which connects to three separate agent workspace screens."
          />
          <svg className="iso__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            {REGIONS.map((r) => (
              <rect
                key={r.id}
                className={`iso__ring iso__ring--${r.id}${focus === r.id ? " is-on" : ""}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx="22"
              />
            ))}
            {LINKS.map((l) => (
              <g key={l.id} className={`iso__link iso__link--${l.id}${lit?.includes(l.id) ? " is-lit" : ""}`}>
                <path id={`iso-path-${l.id}`} className="iso__wire" d={l.d} pathLength={1} />
                <path className="iso__glow" d={l.d} pathLength={1} />
              </g>
            ))}

            {/* Ambient loop: objects into the cache, then out to each workspace. */}
            {motionOk && !focus
              ? LINKS.map((l, i) =>
                  [0, 1, 2].map((k) => (
                    <Packet
                      key={`${l.id}-${k}`}
                      path={l.id}
                      dur={12}
                      window={i === 0 ? [0.06 + k * 0.05, 0.22 + k * 0.05] : [0.46 + (i - 1) * 0.05 + k * 0.06, 0.6 + (i - 1) * 0.05 + k * 0.06]}
                    />
                  )),
                )
              : null}

            {/* Focused: continuous packets along the related connections. */}
            {motionOk && lit
              ? lit.map((id) =>
                  [0, 1, 2].map((k) => <Packet key={`f-${id}-${k}`} path={id} dur={2.4} begin={-k * 0.8} />),
                )
              : null}
          </svg>
        </div>

        {REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            className="iso__hit"
            style={{
              left: `${(r.x / W) * 100}%`,
              top: `${(r.y / H) * 100}%`,
              width: `${(r.w / W) * 100}%`,
              height: `${(r.h / H) * 100}%`,
            }}
            aria-label={r.label}
            aria-pressed={focus === r.id}
            onMouseEnter={() => setFocus(r.id)}
            onFocus={() => setFocus(r.id)}
            onBlur={() => setFocus(null)}
            onClick={() => setFocus(r.id)}
          />
        ))}
      </div>

      <figcaption className="iso__caption">
        <ol className="iso__steps" aria-label="Flow stages">
          {STEPS.map((s, i) => (
            <li key={s} className="iso__step" style={{ ["--i" as string]: i }}>
              <span className="iso__step-dot" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ol>
        <p className="iso__detail" aria-live="polite">
          {current ? (
            <>
              <strong>{current.label}.</strong> {current.detail}
            </>
          ) : (
            IDLE_TEXT
          )}
        </p>
        <p className="iso__note">Illustrative. It shows Selene's design direction, not a measured system.</p>
      </figcaption>
    </figure>
  );
}

/** One data packet travelling a link. `window` limits it to part of the loop (fractions of `dur`). */
function Packet({ path, dur, window, begin = 0 }: { path: Part; dur: number; window?: [number, number]; begin?: number }) {
  const [a, b] = window ?? [0, 1];
  const keyTimes = window ? `0;${a.toFixed(3)};${b.toFixed(3)};1` : "0;1";
  const keyPoints = window ? "0;0;1;1" : "0;1";
  const opacity = window ? `0;0;1;1;0;0` : "0;1;1;0";
  const opacityTimes = window
    ? `0;${a.toFixed(3)};${(a + 0.01).toFixed(3)};${(b - 0.01).toFixed(3)};${b.toFixed(3)};1`
    : "0;0.12;0.88;1";
  return (
    <rect className="iso__packet" x="-7" y="-7" width="14" height="14" rx="3" opacity="0">
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" keyPoints={keyPoints} keyTimes={keyTimes} calcMode="linear">
        <mpath href={`#iso-path-${path}`} />
      </animateMotion>
      <animate attributeName="opacity" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" values={opacity} keyTimes={opacityTimes} />
    </rect>
  );
}
