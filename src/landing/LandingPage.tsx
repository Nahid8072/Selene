import { useEffect, useRef } from "react";
import type { ComponentType, CSSProperties, ReactNode, RefObject, SVGProps } from "react";
import { Link } from "react-router";
import ShinyText from "../components/reactbits/ShinyText.tsx";
import SpotlightCard from "../components/reactbits/SpotlightCard.tsx";
import { ArchitectureDiagram } from "./ArchitectureDiagram.tsx";
import {
  ArrowRight,
  ArrowUpRight,
  BookIcon,
  BoxesIcon,
  CodeIcon,
  DatabaseIcon,
  GitBranchIcon,
  GitHubIcon,
  LayersIcon,
  LayoutIcon,
  RepeatIcon,
  SeleneMark,
  ServerIcon,
  TerminalIcon,
} from "./icons.tsx";
import { LandingNav } from "./LandingNav.tsx";
import { links, site } from "./links.ts";
import { prefersReducedMotion } from "./scroll.ts";
import "./landing.css";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const SPOTLIGHT = "rgba(140, 207, 255, 0.55)";
const CARD_STYLE = { "--spotlight-card-surface": "var(--lp-card)", "--spotlight-card-border": "var(--lp-border)" } as CSSProperties;

const problems: { icon: Icon; title: string; body: string }[] = [
  {
    icon: RepeatIcon,
    title: "Repeated repository work",
    body: "Concurrent agents may need access to the same repository data. Shared infrastructure can help avoid unnecessary duplication.",
  },
  {
    icon: BoxesIcon,
    title: "Independent workspaces",
    body: "Separate tasks need isolated environments so that one agent's work does not interfere with another's.",
  },
  {
    icon: GitBranchIcon,
    title: "Keep Git in the workflow",
    body: "Selene is designed to complement familiar Git-based development rather than replace it.",
  },
];

const steps: { title: string; body: string }[] = [
  { title: "Connect a Git repository", body: "Git remains the source of truth." },
  {
    title: "Use shared repository infrastructure",
    body: "Selene's caching layer is designed to support reuse of repository data.",
  },
  { title: "Provision isolated workspaces", body: "Separate workspaces support independent tasks." },
  { title: "Run agents concurrently", body: "Multiple coding agents can work within their own environments." },
];

const focusAreas: { icon: Icon; title: string; body: string }[] = [
  {
    icon: GitBranchIcon,
    title: "Git-compatible repository access",
    body: "Infrastructure designed around existing Git repositories.",
  },
  {
    icon: DatabaseIcon,
    title: "Shared object caching",
    body: "A shared layer for repository objects used by concurrent workloads.",
  },
  { icon: LayersIcon, title: "Workspace isolation", body: "Separate workspaces for independent coding tasks." },
  { icon: BoxesIcon, title: "Concurrent agent workloads", body: "Infrastructure for multiple agents working at once." },
  {
    icon: ServerIcon,
    title: "Self-hostable approach",
    body: "Designed for operators who want control over their own environment.",
  },
];

function ExternalLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function SectionHeader({ index, label, title, lead, id }: { index: string; label: string; title: string; lead?: string; id: string }) {
  return (
    <div className="lp-section__header lp-reveal">
      <p className="lp-eyebrow">
        <span className="lp-eyebrow__index">{index}</span>
        <span>{label}</span>
      </p>
      <h2 id={id} className="lp-h2">
        {title}
      </h2>
      {lead ? <p className="lp-lead">{lead}</p> : null}
    </div>
  );
}

function PrimaryCtas() {
  return (
    <div className="lp-cta-row">
      <ExternalLink href={links.github} className="lp-btn lp-btn--primary">
        <GitHubIcon width={16} height={16} />
        Explore on GitHub
      </ExternalLink>
      <ExternalLink href={links.docs} className="lp-btn lp-btn--ghost">
        Read the Docs
        <ArrowUpRight />
      </ExternalLink>
      {links.discord ? (
        <ExternalLink href={links.discord} className="lp-btn lp-btn--ghost">
          Join Discord
          <ArrowUpRight />
        </ExternalLink>
      ) : null}
    </div>
  );
}

/** Fades sections in as they scroll into view. Content is fully visible without JS or with reduced motion. */
function useReveal(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".lp-reveal"));
    const fold = window.innerHeight;
    for (const item of items) {
      if (item.getBoundingClientRect().top < fold) item.classList.add("is-in");
    }
    el.classList.add("lp--motion");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.filter((item) => !item.classList.contains("is-in")).forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      el.classList.remove("lp--motion");
    };
  }, [root]);
}

export default function LandingPage() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  useEffect(() => {
    document.title = "Selene — Open-Source Infrastructure for AI Coding Agents";
    document.documentElement.classList.add("lp-html");
    return () => document.documentElement.classList.remove("lp-html");
  }, []);

  return (
    <div className="lp" ref={root}>
      <a className="lp-skip" href="#main">
        Skip to content
      </a>
      <LandingNav />

      <main id="main">
        {/* A. Hero */}
        <section id="overview" className="lp-hero" aria-labelledby="lp-title">
          <div className="lp-hero__grid" aria-hidden="true" />
          <div className="lp-container lp-hero__inner">
            <div className="lp-hero__copy">
              <p className="lp-hero__eyebrow">
                <ShinyText
                  text="OPEN SOURCE · SELF-HOSTABLE · GIT-COMPATIBLE"
                  color="#8b929c"
                  shineColor="#e6f4ff"
                  speed={3.2}
                  delay={2.5}
                />
              </p>
              <h1 id="lp-title" className="lp-h1">
                Make Git work better for <span className="lp-accent-text">AI agents.</span>
              </h1>
              <p className="lp-hero__body">
                AI coding agents are increasingly expected to work on software in parallel. Selene explores the
                infrastructure behind that workflow: shared repository access, object caching, and isolated
                workspaces, while keeping Git at the centre.
              </p>
              <PrimaryCtas />
              <p className="lp-status">
                <span className="lp-status__pill">
                  <span className="lp-status__dot" aria-hidden="true" />
                  In development
                </span>
                <span>An open-source project by {site.organization}.</span>
              </p>
            </div>
            <div className="lp-hero__visual">
              <ArchitectureDiagram />
            </div>
          </div>
        </section>

        {/* B. Why Selene */}
        <section id="why-selene" className="lp-section" aria-labelledby="why-title">
          <div className="lp-container">
            <SectionHeader
              id="why-title"
              index="01"
              label="Why Selene"
              title="Parallel agents need more than parallel prompts."
              lead="When multiple agents work across repositories at the same time, repeated repository access and workspace coordination become infrastructure concerns. Selene is an open-source effort to explore a shared foundation for these workloads."
            />
            <div className="lp-grid lp-grid--3">
              {problems.map(({ icon: IconCmp, title, body }) => (
                <SpotlightCard
                  key={title}
                  className="lp-card lp-reveal"
                  spotlightColor={SPOTLIGHT}
                  intensity={0.12}
                  borderGlow={0.5}
                  style={CARD_STYLE}
                >
                  <span className="lp-card__icon">
                    <IconCmp />
                  </span>
                  <h3 className="lp-h3">{title}</h3>
                  <p className="lp-card__body">{body}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* C. How it works */}
        <section id="how-it-works" className="lp-section" aria-labelledby="how-title">
          <div className="lp-container">
            <SectionHeader
              id="how-title"
              index="02"
              label="How it works"
              title="A shared layer. Independent workspaces."
              lead="A conceptual flow of how Selene is designed to fit around Git. It describes the project's direction, not a finished release."
            />
            <ol className="lp-steps">
              {steps.map((step, i) => (
                <li key={step.title} className="lp-step lp-reveal">
                  <span className="lp-step__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="lp-h3">{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="lp-status-board lp-reveal" aria-label="Implementation status">
              <div className="lp-status-board__col">
                <p className="lp-mono-label lp-mono-label--ok">Available in the repository</p>
                <p>
                  Architecture and design documents, recorded decisions, and a UI preview that runs on sample data.
                </p>
              </div>
              <div className="lp-status-board__col">
                <p className="lp-mono-label lp-mono-label--wip">In progress</p>
                <p>
                  The control plane for repository registration, shared mirrors, and workspace provisioning, built in
                  documented milestones.
                </p>
              </div>
              <div className="lp-status-board__col">
                <p className="lp-mono-label">Not yet</p>
                <p>Released builds and measured performance results. The repository tracks current status.</p>
              </div>
            </div>
          </div>
        </section>

        {/* D. Focus areas */}
        <section id="focus" className="lp-section" aria-labelledby="focus-title">
          <div className="lp-container">
            <SectionHeader
              id="focus-title"
              index="03"
              label="Focus"
              title="What Selene focuses on."
              lead="Self-hosted infrastructure for agentic development, kept deliberately narrow."
            />
            <ul className="lp-focus">
              {focusAreas.map(({ icon: IconCmp, title, body }) => (
                <li key={title} className="lp-focus__item lp-reveal">
                  <span className="lp-focus__icon">
                    <IconCmp />
                  </span>
                  <div>
                    <h3 className="lp-h3">{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
              <li className="lp-focus__item lp-focus__item--status lp-reveal">
                <span className="lp-status__pill">
                  <span className="lp-status__dot" aria-hidden="true" />
                  In development
                </span>
                <p>Planned capabilities are not released or production-ready. Check the repository for status.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* E. Get started */}
        <section id="get-started" className="lp-section" aria-labelledby="start-title">
          <div className="lp-container">
            <SectionHeader
              id="start-title"
              index="04"
              label="Get started"
              title="Curious about the implementation? Start with the source."
              lead="Selene is an open-source project. The repository is the source of truth for installation instructions, prerequisites, documentation, and the current development status."
            />
            <div className="lp-grid lp-grid--links">
              <LinkCard href={links.docs} icon={BookIcon} title="Documentation" body="Read the project documentation and design decisions." />
              <LinkCard href={links.setup} icon={TerminalIcon} title="Setup guide" body="Run the current preview locally by following the README." />
              <LinkCard href={links.github} icon={CodeIcon} title="Source code" body="Explore the implementation on GitHub." />
              <SpotlightCard className="lp-card lp-link-card lp-reveal" spotlightColor={SPOTLIGHT} intensity={0.12} style={CARD_STYLE}>
                <Link to={links.preview} className="lp-link-card__link">
                  <span className="lp-card__icon">
                    <LayoutIcon />
                  </span>
                  <h3 className="lp-h3">
                    UI preview <ArrowRight className="lp-link-card__arrow" />
                  </h3>
                  <p className="lp-card__body">Browse the dashboard preview. It runs on sample data, not live measurements.</p>
                </Link>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* F. Contribute */}
        <section id="contribute" className="lp-section" aria-labelledby="contribute-title">
          <div className="lp-container lp-split">
            <SectionHeader
              id="contribute-title"
              index="05"
              label="Contribute"
              title="Help shape the infrastructure for agentic development."
              lead={`Selene is an open-source project by ${site.organization}. Contributions, technical feedback, testing, and documentation improvements are welcome.`}
            />
            <ul className="lp-link-list lp-reveal">
              {links.contributing ? (
                <li>
                  <ExternalLink href={links.contributing}>
                    Contributing guidelines <ArrowUpRight />
                  </ExternalLink>
                </li>
              ) : null}
              <li>
                <ExternalLink href={links.issues}>
                  Browse issues <ArrowUpRight />
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={links.pullRequests}>
                  Open a pull request <ArrowUpRight />
                </ExternalLink>
              </li>
              {links.discord ? (
                <li>
                  <ExternalLink href={links.discord}>
                    Join the community <ArrowUpRight />
                  </ExternalLink>
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        {/* G. Founders */}
        <section id="team" className="lp-section" aria-labelledby="team-title">
          <div className="lp-container">
            <SectionHeader
              id="team-title"
              index="06"
              label="Project"
              title={`Built by ${site.organization}.`}
              lead={`Selene is an open-source project from ${site.organization}, focused on practical infrastructure for AI-assisted software development.`}
            />
            <ul className="lp-founders">
              {site.founders.map((name) => (
                <li key={name} className="lp-founder lp-reveal">
                  <span className="lp-founder__initials" aria-hidden="true">
                    {name
                      .split(" ")
                      .filter((_, i, all) => i === 0 || i === all.length - 1)
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="lp-founder__name">{name}</p>
                    <p className="lp-founder__role">Founder</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* H. Closing CTA */}
        <section className="lp-closing" aria-labelledby="closing-title">
          <div className="lp-container lp-closing__inner lp-reveal">
            <SeleneMark className="lp-closing__mark" width={40} height={40} />
            <h2 id="closing-title" className="lp-h2 lp-closing__title">
              Explore the project. Help build what comes next.
            </h2>
            <PrimaryCtas />
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer__inner">
          <div className="lp-footer__brand">
            <p className="lp-footer__wordmark">
              <SeleneMark width={20} height={20} />
              Selene
            </p>
            <p className="lp-footer__desc">{site.tagline}</p>
          </div>
          <nav className="lp-footer__nav" aria-label="Footer">
            <ExternalLink href={links.github}>GitHub</ExternalLink>
            <ExternalLink href={links.docs}>Docs</ExternalLink>
            <ExternalLink href={links.setup}>Setup</ExternalLink>
            {links.discord ? <ExternalLink href={links.discord}>Discord</ExternalLink> : null}
            <ExternalLink href={links.contributing ?? links.issues}>Contribute</ExternalLink>
            {links.license ? <ExternalLink href={links.license}>License</ExternalLink> : null}
            <Link to={links.preview}>UI preview</Link>
          </nav>
          <div className="lp-footer__meta">
            <p>A project by {site.organization}</p>
            <p>Founders: {site.founders.join(" · ")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LinkCard({ href, icon: IconCmp, title, body }: { href: string; icon: Icon; title: string; body: string }) {
  return (
    <SpotlightCard className="lp-card lp-link-card lp-reveal" spotlightColor={SPOTLIGHT} intensity={0.12} style={CARD_STYLE}>
      <a href={href} target="_blank" rel="noreferrer" className="lp-link-card__link">
        <span className="lp-card__icon">
          <IconCmp />
        </span>
        <h3 className="lp-h3">
          {title} <ArrowUpRight className="lp-link-card__arrow" />
        </h3>
        <p className="lp-card__body">{body}</p>
      </a>
    </SpotlightCard>
  );
}
