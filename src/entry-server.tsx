import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import LandingPage from "./landing/LandingPage.tsx";

/** Renders the landing page to HTML at build time so its copy is indexable without JavaScript. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <LandingPage />
    </StrictMode>,
  );
}
