import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import LandingPage from "./landing/LandingPage.tsx";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element missing");
}

const tree = (
  <StrictMode>
    <LandingPage />
  </StrictMode>
);

// `npm run build` prerenders the page into index.html (scripts/prerender.mjs): hydrate that markup.
// The dev server ships an empty root, so render from scratch there.
if (root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
