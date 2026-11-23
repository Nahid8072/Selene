export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (/[?&]motion=off\b/.test(window.location.search)) return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

/** Scrolls to an in-page section, honouring reduced motion, and keeps the hash in the URL. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(null, "", id === "overview" ? window.location.pathname : `#${id}`);
  }
  // Move focus for keyboard and screen reader users without a second jump.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}
