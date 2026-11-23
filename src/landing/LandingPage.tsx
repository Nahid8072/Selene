import { useEffect, useRef } from "react";
import type { MouseEvent, ReactNode, RefObject } from "react";
import { AgentWorkspace, SettledWorkspace } from "./AgentWorkspace.tsx";
import { Architecture } from "./Architecture.tsx";
import { Capabilities } from "./Capabilities.tsx";
import { IsoArchitecture } from "./IsoArchitecture.tsx";
import { ContributionFlow, DuplicatedWorkFigure, IsolationFigure, RepeatedAccessFigure } from "./figures.tsx";
import { ArrowRight, ArrowUpRight, GitHubIcon, SeleneMark } from "./icons.tsx";
import { LandingNav } from "./LandingNav.tsx";
import { contributeHref, links, site } from "./links.ts";
import { useReveal } from "./motion.ts";
import { prefersReducedMotion, scrollToSection } from "./scroll.ts";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./landing.css";

const PROBLEMS = [
  {
    title: "Repeated repository access",
    body: "Several agents often need the same repository at the same moment. Each one asking for the same refs and objects multiplies the same work.",
    figure: <RepeatedAccessFigure />,
  },
  {
    title: "Duplicated infrastructure work",
    body: "Separate clones and fetches move identical objects again and again, adding overhead that has nothing to do with the task an agent was given.",
    figure: <DuplicatedWorkFigure />,
  },
  {
    title: "Isolated development environments",
    body: "Concurrent agents need independent workspaces so their changes never collide, without giving up a shared foundation underneath them.",
    figure: <IsolationFigure />,
  },
];

function External({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function onAnchor(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    scrollToSection(id);
  };
}

/** Lets the hero workspace drift a few pixels against the pointer on desktop. Transform-only. */
function useHeroParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return undefined;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = ((event.clientX - r.left) / r.width) * 2 - 1;
      y = ((event.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);
}

/** Pauses the hero's ambient background motion while the hero is off screen. */
function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

export default function LandingPage() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  useReveal(root);
  useHeroParallax(hero);
  usePauseOffscreen(hero);

  return (
    <div className="lp" ref={root}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <LandingNav />

      <main id="main">
        {/* ---------------- Hero ---------------- */}
        <section id="overview" className="hero" aria-labelledby="hero-title" ref={hero}>
          <div className="hero__wave" aria-hidden="true">
            <div className="hero__wave-img" />
            <div className="hero__wave-sweep" />
          </div>
          <div className="hero__grid" aria-hidden="true" />
          <div className="wrap hero__layout">
            <h1 id="hero-title" className="hero__title">
              <span className="ln">
                <span>Infrastructure for</span>
              </span>{" "}
              <span className="ln">
                <span>coding agents</span>
              </span>{" "}
              <span className="ln">
                <span>working in parallel.</span>
              </span>
            </h1>
            <div className="hero__side">
              <p className="hero__lead">
                Selene is an open-source, Git-compatible infrastructure layer designed to make repository access, shared
                object caching, and isolated workspace provisioning more efficient for concurrent AI coding agents.
              </p>
              <div className="hero__ctas">
                <External href={links.github} className="btn btn--primary btn--lg">
                  <GitHubIcon width={17} height={17} />
                  Explore on GitHub
                  <ArrowRight className="btn__arrow" />
                </External>
                <a className="btn btn--quiet btn--lg" href="#architecture" onClick={onAnchor("architecture")}>
                  Discover the architecture
                </a>
              </div>
            </div>
            <ul className="hero__facts" aria-label="Project facts">
                <li>Open source</li>
                <li>Self-hostable</li>
                <li>Git-compatible</li>
                <li>Built for agentic workflows</li>
              </ul>

          <div className="hero__stage">
            <figure className="hero__figure" aria-labelledby="hero-figure-caption">
              <div aria-hidden="true">
                <AgentWorkspace />
              </div>
              <figcaption id="hero-figure-caption" className="hero__caption">
                <span>
                  Illustrative simulation: one repository synced into a shared object cache, three isolated workspaces,
                  three agents working at once.
                </span>
                <span className="hero__caption-strong">
                  Selene is not a coding agent. It is the layer your agents run on.
                </span>
              </figcaption>
            </figure>
          </div>
          </div>
        </section>

        {/* ---------------- Problem ---------------- */}
        <section id="problem" className="sec" aria-labelledby="problem-title">
          <div className="wrap">
            <div className="sec__head" data-reveal>
              <h2 id="problem-title" className="h2">
                More agents. More parallel work. More infrastructure complexity.
              </h2>
              <p className="sec__lead">
                One coding agent against one repository is easy. Several agents against the same repository, at the same
                time, turn repository access into an infrastructure problem.
              </p>
            </div>
            <div className="problems">
              {PROBLEMS.map((p, i) => (
                <article key={p.title} className="problem" data-reveal style={{ ["--stagger" as string]: `${i * 110}ms` }}>
                  <div className="problem__figure">{p.figure}</div>
                  <h3 className="h3">{p.title}</h3>
                  <p className="problem__body">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Architecture ---------------- */}
        <section id="architecture" className="sec sec--arch" aria-labelledby="arch-title">
          <div className="wrap">
            <div className="sec__head" data-reveal>
              <h2 id="arch-title" className="h2">
                A shared foundation for independent workspaces.
              </h2>
              <p className="sec__lead">
                Selene sits between a Git repository and the agents working on it. Repository data is fetched once,
                shared, and handed to each agent in a workspace of its own.
              </p>
            </div>
            <div className="arch-overview" data-reveal>
              <IsoArchitecture />
            </div>
            <Architecture />
          </div>
        </section>

        {/* ---------------- Capabilities ---------------- */}
        <section id="features" className="sec" aria-labelledby="features-title">
          <div className="wrap">
            <div className="sec__head" data-reveal>
              <h2 id="features-title" className="h2">
                One layer of the stack, built carefully.
              </h2>
              <p className="sec__lead">
                Selene stays narrow on purpose: getting repository data to many agents, efficiently and in isolation,
                without asking anyone to give up Git.
              </p>
            </div>
            <div data-reveal>
              <Capabilities />
            </div>
          </div>
        </section>

        {/* ---------------- Philosophy ---------------- */}
        <section id="why" className="sec sec--essay" aria-labelledby="why-title">
          <div className="wrap essay">
            <h2 id="why-title" className="essay__title" data-reveal>
              The next generation of software development needs better infrastructure.
            </h2>
            <div className="essay__body" data-reveal>
              <p className="essay__first">
                Coding agents changed how much work one developer can start at once. A refactor goes to one agent, a test
                suite to another, a review to a third: all against the same repository, all at the same time.
              </p>
              <p>
                Most of the tooling underneath was shaped around a different picture, one person and one working copy.
                Every new workspace clones, fetches and checks out as if it were the first, and the same objects cross the
                same wire again and again. That cost is small once. It is not small when it happens for every agent, on
                every task, all day.
              </p>
              <p>
                We think that layer deserves infrastructure of its own: a shared foundation that keeps repository data
                close, gives each agent an isolated place to work, and leaves Git exactly where it is. Self-hosted, so
                teams keep control of their code. Open source, so anyone can read how it works and help decide what it
                becomes.
              </p>
            </div>
            <ul className="essay__tenets" data-reveal aria-label="What Selene optimises for">
              <li>
                <span>Developer productivity</span>
                <span>Agents start working sooner.</span>
              </li>
              <li>
                <span>Efficient repository access</span>
                <span>Fetch once, read many times.</span>
              </li>
              <li>
                <span>Isolated execution</span>
                <span>One workspace per task.</span>
              </li>
              <li>
                <span>Compatible with Git</span>
                <span>Your history stays in Git.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------- Founders ---------------- */}
        <section id="team" className="sec sec--team" aria-labelledby="team-title">
          <div className="wrap team">
            <div className="team__lockup" data-reveal>
              <h2 id="team-title" className="h2">
                Built by engineers, for the next generation of engineering.
              </h2>
              <p className="team__org">
                <SeleneMark width={20} height={20} />
                <span>
                  Selene is an open-source project by <strong>{site.organization}</strong>.
                </span>
              </p>
            </div>
            <ul className="team__founders" aria-label="Founders" data-reveal>
              {site.founders.map((name) => (
                <li key={name} className="founder">
                  <span className="founder__name">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- Open source ---------------- */}
        <section id="contribute" className="sec sec--open" aria-labelledby="open-title">
          <div className="wrap open">
            <div className="open__copy" data-reveal>
              <h2 id="open-title" className="h2">
                Built in the open. Improved together.
              </h2>
              <p className="sec__lead">
                Selene is an open-source infrastructure project. Explore the source code, understand its architecture,
                report issues, and contribute to its development.
              </p>
            </div>
            <div className="open__flow" data-reveal>
              <ContributionFlow />
            </div>
            <ul className="open__actions" data-reveal>
              <li>
                <External href={links.github} className="action">
                  <span className="action__title">Explore the repository</span>
                  <span className="action__meta action__meta--path">github.com/{site.repoSlug}</span>
                  <ArrowUpRight className="action__arrow" />
                </External>
              </li>
              <li>
                <External href={contributeHref} className="action">
                  <span className="action__title">
                    {links.contributing ? "Read the contribution guidelines" : "Pick up an issue"}
                  </span>
                  <span className="action__meta">{links.contributing ? "CONTRIBUTING.md" : "Report bugs, propose changes"}</span>
                  <ArrowUpRight className="action__arrow" />
                </External>
              </li>
              <li>
                <External href={links.discord ?? links.docs} className="action">
                  <span className="action__title">{links.discord ? "Join the community" : "Read the documentation"}</span>
                  <span className="action__meta">{links.discord ? "Discord" : "Architecture and design docs"}</span>
                  <ArrowUpRight className="action__arrow" />
                </External>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="closing" aria-labelledby="closing-title">
          <div className="wrap closing__inner" data-reveal>
            <div className="closing__copy">
            <h2 id="closing-title" className="closing__title">
              Explore what powers parallel development.
            </h2>
            <div className="closing__ctas">
              <External href={links.github} className="btn btn--primary btn--lg">
                <GitHubIcon width={17} height={17} />
                Explore Selene on GitHub
                <ArrowRight className="btn__arrow" />
              </External>
              {links.discord ? (
                <External href={links.discord} className="btn btn--quiet btn--lg">
                  Join the Discord community
                </External>
              ) : (
                <External href={links.docs} className="btn btn--quiet btn--lg">
                  Read the documentation
                </External>
              )}
            </div>
            </div>
            <figure className="closing__figure" aria-label="Illustrative simulation: all three agent workspaces settled, their commits merged back into main through Git.">
              <div aria-hidden="true">
                <SettledWorkspace />
              </div>
            </figure>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot__inner">
          <div className="foot__brand">
            <p className="foot__name">
              <SeleneMark width={18} height={18} />
              SELENE
            </p>
            <p className="foot__by">An open-source project by {site.organization}.</p>
          </div>
          <nav className="foot__nav" aria-label="Footer">
            <External href={links.github}>GitHub</External>
            <External href={links.docs}>Documentation</External>
            {links.discord ? <External href={links.discord}>Discord</External> : null}
            <External href={contributeHref}>Contribute</External>
            {links.license ? <External href={links.license}>License</External> : null}
          </nav>
          <p className="foot__copy" suppressHydrationWarning>
            © {new Date().getFullYear()} {site.organization}
          </p>
        </div>
      </footer>
    </div>
  );
}
