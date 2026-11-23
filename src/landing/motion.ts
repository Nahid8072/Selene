import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { prefersReducedMotion } from "./scroll.ts";

/**
 * Marks `[data-reveal]` elements inside `root` with `is-in` as they scroll into view.
 * Hidden states only exist under `html.motion` (set before first paint by index.html), so without
 * JavaScript or with reduced motion every element is simply visible.
 */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    document.documentElement.classList.add("app-ready");
    const el = root.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      document.documentElement.classList.remove("motion");
      return undefined;
    }
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [root]);
}

/** True once the element has entered the viewport (always true with reduced motion). */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px 0px -15% 0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
