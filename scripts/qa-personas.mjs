// Persona QA sweep — every route as every persona.
//
// Checks what a human reviewer would: runtime errors, dead navigation, the persistent
// footer, rendering artefacts, and the §11.1 copy rule. Reports issues rather than
// asserting pass/fail, because the point is to find things nobody thought to assert.
//
// Usage: BASE=http://localhost:3000 node scripts/qa-personas.mjs

import { chromium } from "playwright-core";
const BASE = process.env.BASE ?? "http://localhost:3230";
const S = "/tmp/claude-0/-home-user-hul-tech/b918760a-5c9b-5c38-b247-bc00887ecdcc/scratchpad";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });

const PAGES = [
  ["/", "Inbox"], ["/batch", "Batch Review"], ["/moment", "Moment Risk"], ["/ring0", "Ring 0"],
  ["/watch", "Creator Sweep"], ["/audit", "Audit Trail"], ["/replay", "Rule Replay"],
  ["/accuracy", "Accuracy Card"], ["/live", "Live Check"],
  ["/asset/REX-10", "Asset REX-10"], ["/asset/REX-12", "Asset REX-12"], ["/asset/PF-R4", "Asset PF-R4"],
];
const PERSONAS = ["abm", "legal", "director"];
const issues = [];
const log = (persona, page, sev, msg) => issues.push({ persona, page, sev, msg });

for (const persona of PERSONAS) {
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text()); });

  // Set persona once, then navigate in-app so the store survives.
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(700);
  await page.selectOption("aside select", persona);
  await page.waitForTimeout(400);

  for (const [path, name] of PAGES) {
    errs.length = 0;
    await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(persona === "abm" ? 3200 : 1200);
    // Re-apply persona after a hard nav (store is in-memory by design).
    await page.selectOption("aside select", persona).catch(() => {});
    await page.waitForTimeout(persona === "abm" ? 900 : 600);

    const body = await page.locator("body").innerText().catch(() => "");
    const main = await page.locator("main").innerText().catch(() => "");

    if (errs.length) log(persona, name, "ERROR", `console/page errors: ${errs.slice(0, 2).join(" | ")}`);
    if (!body.includes("Prototype · rule text paraphrased")) log(persona, name, "SPEC", "persistent footer missing");
    const h1 = await page.locator("h1").count();
    if (h1 !== 1) log(persona, name, "SPEC", `expected exactly one h1, found ${h1}`);
    for (const bad of ["undefined", "NaN", "[object Object]", "Infinity"]) {
      if (main.includes(bad)) log(persona, name, "ERROR", `renders literal "${bad}"`);
    }
    if (/\bcompliance\b/i.test(main) && !/disclosure compliance|compliance rate/i.test(main)) {
      log(persona, name, "SPEC", 'uses "compliance" in UI copy (§11.1 copy rule)');
    }
  }

  // Nav integrity
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  const hrefs = await page.locator("aside a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) {
    const r = await page.request.get(`${BASE}${h}`).catch(() => null);
    if (!r || r.status() >= 400) log(persona, "nav", "ERROR", `dead nav link ${h} (${r ? r.status() : "no response"})`);
  }

  // Inbox row click → Asset Detail (§11.3). Test the behaviour, not the markup: the row
  // navigates via a handler, so probing for an anchor reports a false positive.
  await page.waitForTimeout(400);
  await page.locator("tbody tr").first().click({ position: { x: 400, y: 10 } }).catch(() => {});
  await page.waitForTimeout(800);
  if (!page.url().includes("/asset/")) {
    log(persona, "Inbox", "SPEC", "§11.3 says row click → Asset Detail; the row does not navigate");
  }

  await page.screenshot({ path: `${S}/qa-${persona}-inbox.png` });
  await page.close();
}

console.log(`${issues.length} issues\n`);
for (const sev of ["ERROR", "SPEC"]) {
  const g = issues.filter((i) => i.sev === sev);
  if (!g.length) continue;
  console.log(`── ${sev} (${g.length}) ──`);
  const seen = new Set();
  for (const i of g) {
    const key = `${i.page}|${i.msg}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const who = [...new Set(g.filter((x) => `${x.page}|${x.msg}` === key).map((x) => x.persona))];
    console.log(`  [${i.page}] ${i.msg}  (${who.join(", ")})`);
  }
  console.log();
}
await b.close();
