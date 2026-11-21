import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element missing");
}

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// The production build prerenders the landing page into index.html (see scripts/prerender.mjs).
// Hydrate it on "/"; every other route renders from scratch and replaces that markup.
if (window.location.pathname === "/" && root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  root.replaceChildren();
  createRoot(root).render(tree);
}
