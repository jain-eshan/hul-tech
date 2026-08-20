// Builds the entire app into ONE self-contained HTML file.
//
// Why: a single file needs no server, works with the network off, and can be published
// anywhere a static page can live. It is also the honest backup for a live demo — if
// the hosted app is unreachable on the day, this file still runs from a laptop.
//
// Nothing here is a second implementation. The same components, engine and data are
// bundled; only next/link and next/navigation are shimmed for hash routing.
//
// Usage: node scripts/build-standalone.mjs   →   dist/pramaan.html

import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

mkdirSync("dist", { recursive: true });
const root = process.cwd();

// 1 — Tailwind, over the same config the served app uses.
execSync("npx tailwindcss -i app/globals.css -o dist/styles.css --minify", { stdio: "pipe" });
const css = readFileSync("dist/styles.css", "utf8");

// 2 — Inline every snapshot as a data URI. A single file cannot reference siblings, and
//     the evidence is the point of that screen.
const snapDir = "public/snapshots";
const dataUris = {};
for (const f of readdirSync(snapDir).filter((f) => f.endsWith(".png"))) {
  dataUris[`/snapshots/${f}`] = `data:image/png;base64,${readFileSync(path.join(snapDir, f)).toString("base64")}`;
}

// 3 — Bundle, with next/* resolved to the standalone shims.
const result = await esbuild.build({
  entryPoints: ["build/spa.tsx"],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  target: ["es2020"],
  jsx: "automatic",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    "next/link": path.resolve(root, "build/shims/next-link.tsx"),
    "next/navigation": path.resolve(root, "build/shims/next-navigation.ts"),
    "next/server": path.resolve(root, "build/shims/next-server.ts"),
    "@": root,
  },
  logLevel: "warning",
});

let js = result.outputFiles[0].text;
for (const [ref, uri] of Object.entries(dataUris)) js = js.split(JSON.stringify(ref)).join(JSON.stringify(uri));

// The DOM snapshot links point at sibling files that do not exist here; the modal shows
// the captured markup inline instead, so drop the dead hrefs rather than ship broken ones.
js = js.replace(/"\/snapshots\/[^"]*\.html"/g, '"#"');

const head = `<title>PRAMAAN</title>
<style>${css}</style>`;
const body = `<div id="root"></div>
<script>window.__PRAMAAN_STATIC__ = true;</script>
<script>${js}</script>`;

// Standalone: a complete document, openable from a laptop with no server.
writeFileSync(
  "dist/pramaan.html",
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${head}
</head>
<body>
${body}
</body>
</html>`,
);

// Artifact: the same page as a fragment. The Artifact host supplies the document
// skeleton, so shipping our own <html>/<head>/<body> would nest a second document.
writeFileSync("dist/pramaan-artifact.html", `${head}\n${body}`);

for (const f of ["dist/pramaan.html", "dist/pramaan-artifact.html"]) {
  console.log(`${f} — ${(readFileSync(f).length / 1024).toFixed(0)} KB`);
}
console.log(`${Object.keys(dataUris).length} snapshots inlined`);
