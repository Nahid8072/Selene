import { StrictMode } from "react";
<<<<<<< HEAD
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@sakaniui/react/tokens.css";
import "@sakaniui/react/style.css";
import "./styles/global.css";
=======
import { createRoot, hydrateRoot } from "react-dom/client";
import LandingPage from "./landing/LandingPage.tsx";
>>>>>>> landing-page

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element missing");
}

<<<<<<< HEAD
createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
=======
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
>>>>>>> landing-page
