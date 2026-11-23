import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { links, site } from "./links.ts";
import { ArrowUpRight, CloseIcon, GitHubIcon, MenuIcon, SeleneMark } from "./icons.tsx";
import { scrollToSection } from "./scroll.ts";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "features", label: "Features" },
  { id: "contribute", label: "Contribute" },
] as const;

/** Sections the observer tracks, in page order; untracked ones (problem, why) keep the previous link lit. */
const trackedIds = ["overview", "problem", "architecture", "features", "why", "contribute"];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("overview");
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = trackedIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = trackedIds.find((id) => visible.has(id));
        if (first) setActive(first === "problem" ? "overview" : first === "why" ? "features" : first);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 880) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const onAnchor = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <nav className="nav__bar" aria-label="Primary">
        <a className="nav__brand" href="#overview" onClick={onAnchor("overview")} aria-label="Selene, back to top">
          <SeleneMark className="nav__mark" width={22} height={22} />
          <span className="nav__name">SELENE</span>
          <span className="nav__label">{site.label}</span>
        </a>

        <ul className="nav__links">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={onAnchor(s.id)}
                className={active === s.id ? "is-active" : undefined}
                aria-current={active === s.id ? "location" : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>

        <div className="nav__actions">
          <a className="btn btn--quiet btn--sm" href={links.docs} target="_blank" rel="noreferrer">
            Docs
          </a>
          {links.discord ? (
            <a className="btn btn--primary btn--sm" href={links.discord} target="_blank" rel="noreferrer">
              Join Discord
            </a>
          ) : (
            <a className="btn btn--primary btn--sm" href={links.github} target="_blank" rel="noreferrer">
              <GitHubIcon width={15} height={15} />
              View source
            </a>
          )}
          <button
            ref={menuButton}
            type="button"
            className="nav__menu"
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      <div id="nav-panel" className="nav__panel" hidden={!open}>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={onAnchor(s.id)} aria-current={active === s.id ? "location" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav__panel-ext">
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight />
          </a>
          <a href={links.docs} target="_blank" rel="noreferrer">
            Documentation <ArrowUpRight />
          </a>
          {links.discord ? (
            <a href={links.discord} target="_blank" rel="noreferrer">
              Discord <ArrowUpRight />
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
