import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router";
import { links } from "./links.ts";
import { ArrowRight, CloseIcon, GitHubIcon, MenuIcon, SeleneMark } from "./icons.tsx";
import { scrollToSection } from "./scroll.ts";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "why-selene", label: "Why Selene" },
  { id: "how-it-works", label: "How it works" },
  { id: "contribute", label: "Contribute" },
] as const;

/** Sections the observer tracks; `get-started` keeps "Overview" etc. from staying lit while it is in view. */
const trackedIds = ["overview", "why-selene", "how-it-works", "focus", "get-started", "contribute", "team"];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("overview");
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = trackedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // The topmost visible section wins, so the highlight follows reading order.
        const first = trackedIds.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01] },
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
      if (window.innerWidth > 900) setOpen(false);
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
    <header className={`lp-nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <nav className="lp-nav__bar" aria-label="Primary">
        <a className="lp-nav__brand" href="#overview" onClick={onAnchor("overview")} aria-label="Selene, back to top">
          <SeleneMark className="lp-nav__mark" />
          <span>Selene</span>
        </a>

        <ul className="lp-nav__links">
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
        </ul>

        <div className="lp-nav__actions">
          <a className="lp-nav__text-link" href={links.docs} target="_blank" rel="noreferrer">
            Docs
          </a>
          <a className="lp-nav__icon-link" href={links.github} target="_blank" rel="noreferrer" aria-label="Selene on GitHub">
            <GitHubIcon />
          </a>
          {links.discord ? (
            <a className="lp-btn lp-btn--primary lp-btn--sm" href={links.discord} target="_blank" rel="noreferrer">
              Join Discord
            </a>
          ) : (
            <a className="lp-btn lp-btn--primary lp-btn--sm" href="#get-started" onClick={onAnchor("get-started")}>
              Get started
            </a>
          )}
          <button
            ref={menuButton}
            type="button"
            className="lp-nav__menu-button"
            aria-expanded={open}
            aria-controls="lp-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      <div id="lp-mobile-menu" className="lp-nav__panel" hidden={!open}>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={onAnchor(s.id)} className={active === s.id ? "is-active" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="lp-nav__panel-links">
          <a href={links.docs} target="_blank" rel="noreferrer">Docs</a>
          <a href={links.setup} target="_blank" rel="noreferrer">Setup</a>
          <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          {links.discord ? <a href={links.discord} target="_blank" rel="noreferrer">Discord</a> : null}
          <Link to={links.preview} onClick={() => setOpen(false)}>
            UI preview <ArrowRight />
          </Link>
        </div>
      </div>
    </header>
  );
}
