import { useEffect, useRef } from "react";
import { Button } from "@sakaniui/react";

export function ReviewDialog({
  title,
  target,
  happens,
  impact,
  configuration,
  onClose,
}: {
  title: string;
  target: string;
  happens: string;
  impact: string;
  configuration: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => dialogRef.current?.querySelector("button")?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button")].filter((el) => !el.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      previous.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-layer">
      <div className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="review-title" ref={dialogRef}>
        <p className="section-note">Preview. This does not run the action.</p>
        <h2 id="review-title">{title}</h2>
        <dl className="detail-meta detail-meta--stack">
          <div>
            <dt>Target repository</dt>
            <dd>{target}</dd>
          </div>
          <div>
            <dt>What would happen</dt>
            <dd>{happens}</dd>
          </div>
          <div>
            <dt>Potential impact</dt>
            <dd>{impact}</dd>
          </div>
          <div>
            <dt>Configuration</dt>
            <dd>{configuration}</dd>
          </div>
        </dl>
        <div className="detail-actions inert-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" variant="primary" disabled>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
