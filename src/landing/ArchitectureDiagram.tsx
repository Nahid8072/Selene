import { DatabaseIcon, GitBranchIcon, SeleneMark } from "./icons.tsx";

const agents = ["Agent A", "Agent B", "Agent C"];

/**
 * A conceptual picture, not the implemented architecture: several agents, each in its own
 * workspace, reading through one shared Selene layer that sits on top of a Git repository.
 */
export function ArchitectureDiagram() {
  return (
    <figure className="lp-arch" aria-labelledby="lp-arch-caption">
      <div className="lp-arch__head">
        <span className="lp-mono-label">Conceptual architecture</span>
        <span className="lp-arch__note">Illustrative, not a measurement</span>
      </div>

      <div
        className="lp-arch__canvas"
        role="img"
        aria-label="Conceptual architecture: three AI agents, each in an isolated workspace, read repository data through a shared Selene layer with a shared object cache. The Selene layer sits on top of a Git repository, which remains the source of truth."
      >
        <div className="lp-arch__tier-label">AI agents · Isolated workspaces</div>
        <div className="lp-arch__agents">
          {agents.map((name, i) => (
            <div className="lp-arch__agent" key={name}>
              <div className="lp-arch__agent-top">
                <span className="lp-arch__dot" aria-hidden="true" />
                <span>{name}</span>
              </div>
              <div className="lp-arch__ws">
                <span className="lp-arch__ws-label">workspace</span>
                <span className="lp-arch__ws-id">ws-{i + 1}</span>
              </div>
              <span className="lp-arch__wire" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="lp-arch__layer">
          <div className="lp-arch__layer-title">
            <SeleneMark className="lp-arch__layer-mark" />
            <span>Selene layer</span>
          </div>
          <div className="lp-arch__chip">
            <DatabaseIcon width={15} height={15} />
            Shared object cache
          </div>
          <span className="lp-arch__wire lp-arch__wire--down" aria-hidden="true" />
        </div>

        <div className="lp-arch__repo">
          <GitBranchIcon width={16} height={16} />
          <span>Git repository</span>
          <span className="lp-arch__repo-note">source of truth</span>
        </div>
      </div>

      <figcaption id="lp-arch-caption" className="lp-arch__caption">
        Agents work in isolated workspaces. Repository data is shared through one Git-compatible layer, and Git stays at
        the centre.
      </figcaption>
    </figure>
  );
}
