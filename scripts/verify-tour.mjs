// Walks the guided tour end to end the way a judge would: click Next, read the card.
//
// Guards the two failure modes that make a tour worse than none — a card that covers
// the thing it is describing, and a step that does not advance.
//
// Usage: BASE=http://localhost:3000 node scripts/verify-tour.mjs

import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

let failures = 0;
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
const check = (n, ok, d = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? ` — ${d}` : ""}`); if (!ok) failures++; };

await p.goto(`${BASE}/`, { waitUntil: "load" });
await p.waitForTimeout(800);
check("Tour button is present on first load",
  await p.locator("button:has-text('Guided walkthrough')").isVisible());

await p.click("button:has-text('Guided walkthrough')");
await p.waitForTimeout(900);

const seen = [];
let stalled = 0, covered = 0, offscreen = 0;

for (let step = 1; step <= 16; step++) {
  const title = await p.locator("h2").first().innerText().catch(() => "(no card)");
  const route = new URL(p.url()).pathname;
  seen.push(title);

  const geom = await p.evaluate(() => {
    const card = document.querySelector("[data-tour-card]");
    const spot = document.querySelector("[data-tour-spot]");
    if (!card) return null;
    const c = card.getBoundingClientRect();
    const inView = c.top >= 0 && c.left >= 0 && c.bottom <= innerHeight + 4 && c.right <= innerWidth + 4;
    if (!spot) return { inView, overlap: 0 };
    const a = spot.getBoundingClientRect();
    const ox = Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left));
    const oy = Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
    return { inView, overlap: Math.round((ox * oy) / (c.width * c.height) * 100) };
  });

  if (!geom) { console.log(`  step ${step}: no card found`); failures++; }
  else {
    if (!geom.inView) { offscreen++; console.log(`  step ${step} card is off-screen`); }
    if (geom.overlap > 30) { covered++; console.log(`  step ${step} card covers ${geom.overlap}% of its target`); }
  }
  console.log(`  ${String(step).padStart(2)} ${route.padEnd(15)} ${title.slice(0, 52)}`);

  if (step < 16) {
    await p.waitForFunction(() => {
      const b = [...document.querySelectorAll("button")].find((x) => /Next|Finish/.test(x.textContent || ""));
      return b && !b.disabled;
    }, { timeout: 25000 }).catch(() => {});
    await p.locator("button:has-text('Next')").click({ force: true }).catch(() => {});
    await p.waitForTimeout(600);
    const after = await p.locator("h2").first().innerText().catch(() => "");
    if (after === title) { stalled++; console.log(`  step ${step} did not advance`); }
  }
}

check("All 16 steps advance", stalled === 0, `${stalled} stalled`);
check("No card covers the element it is describing", covered === 0, `${covered} covered`);
check("Every card is on screen", offscreen === 0, `${offscreen} off-screen`);
check("Every step has distinct content", new Set(seen).size === seen.length,
  `${seen.length - new Set(seen).size} duplicates`);
check("No page errors during the tour", errs.length === 0, errs.slice(0, 2).join(" | "));

await p.locator("button:has-text('Finish')").click({ force: true }).catch(() => {});
await p.waitForTimeout(600);
check("Finishing closes the tour", (await p.locator("[data-tour-card]").count()) === 0);

console.log(failures ? `\n${failures} FAILED` : "\nGuided tour walks cleanly.");
await b.close();
process.exit(failures ? 1 : 0);
