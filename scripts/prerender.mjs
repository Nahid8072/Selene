// Prerenders the landing page into dist/index.html after `vite build`, so search engines and
// link previews get the full page copy without running JavaScript.
import { readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { build } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ssrOut = path.join(root, "node_modules/.cache/selene-prerender");
const indexFile = path.join(root, "dist/index.html");

await build({
  root,
  logLevel: "warn",
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ssrOut,
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
  },
});

const { render } = await import(pathToFileURL(path.join(ssrOut, "entry-server.mjs")).href);
const markup = render("/");
const html = await readFile(indexFile, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}
await writeFile(indexFile, html.replace(marker, `<div id="root">${markup}</div>`));
await rm(ssrOut, { recursive: true, force: true });
console.log(`prerender: landing page written to dist/index.html (${(markup.length / 1024).toFixed(1)} KB of HTML)`);
