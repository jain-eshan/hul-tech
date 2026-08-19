// PRD §13 acceptance checklist, driven in a real browser.
//
// Usage:  npx next build && npx next start -p 3121 &   then:  node scripts/acceptance.mjs
//
// Batched deliberately: running these after every screen costs a full context
// re-read each time, so they run once, at the end, as the plan's Phase 9 gate.

import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3121";
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-proxy-server"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const text = async (sel = "main") => (await page.locator(sel).innerText()).toLowerCase();

// ── Functional ─────────────────────────────────────────────────────────────
await page.goto(`${BASE}/`, { waitUntil: "load" });
await page.waitForTimeout(600);
check("App opens directly into Inbox — no landing page", (await page.locator("h1").innerText()) === "Inbox");
check("Prototype / illustrative-data footer is visible", (await text("footer")).includes("rule text paraphrased"));

await page.click("aside >> text=Batch Review");
await page.waitForTimeout(400);
await page.click("text=Run clearance");
await page.waitForTimeout(4600);
const batch = await text();
check("Batch Review animates 12 chips to 9/2/1 in under 5s",
  /9\s*cleared/.test(batch) && /2\s*needs edit/.test(batch) && /1\s*blocked/.test(batch));

await page.goto(`${BASE}/asset/REX-10`, { waitUntil: "load" });
await page.waitForTimeout(500);
check("Findings carry a clause reference", (await text()).includes("asci-i-1"));
await page.click("button:has-text('Apply')");
await page.waitForTimeout(800);
const applied = await text();
check("Apply visibly rewrites the copy and flips the verdict to cleared",
  applied.includes("72h freshness") && applied.includes("cleared against rule set"));

await page.click("aside >> text=Audit Trail");
await page.waitForTimeout(500);
check("Applied fix writes a visible entry to the Audit Trail", (await text()).includes("applied fix"));

await page.goto(`${BASE}/asset/REX-11`, { waitUntil: "load" });
await page.waitForTimeout(500);
check("Persona gating — ABM does not see Override", await page.locator("button:has-text('Justify')").isDisabled());
await page.selectOption("aside select", "legal");
await page.waitForTimeout(400);
check("Persona gating — Legal does", !(await page.locator("button:has-text('Justify')").isDisabled()));
await page.click("button:has-text('Justify')");
await page.waitForTimeout(200);
await page.fill("textarea", "Dossier registration for DE in progress; interim approval from counsel.");
await page.click("button:has-text('Log override')");
await page.waitForTimeout(400);
await page.click("aside >> text=Audit Trail");
await page.waitForTimeout(500);
check("Justify writes a visible entry to the Audit Trail", (await text()).includes("dossier registration for de"));

await page.locator("button:has-text('Response pack')").first().click();
await page.waitForTimeout(500);
const pack = await text("body");
check("Regulator response pack assembles the full dossier",
  pack.includes("substantiation") && pack.includes("rule set version") && pack.includes("clauses cited"));
await page.locator("body").click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);

await page.click("aside >> text=Moment Risk");
await page.waitForTimeout(500);
const moment = await text();
check("Moment Risk shows a refusal with four reasoning cards",
  moment.includes("do not activate") &&
  ["reputational adjacency", "market divergence", "brand constraint", "precedent"].every((c) => moment.includes(c)));
check("Copy-testing callout is present", moment.includes("dear sydney") && moment.includes("5.9"));

await page.click("aside >> text=Rule Replay");
await page.waitForTimeout(400);
await page.click("text=Publish v2026.09");
await page.waitForTimeout(7500);
const replay = await text();
check("Replay animates to 1,412", replay.includes("1,412"));
check("Replay produces its 6 assets from the actual engine",
  ["lakmé", "dove", "pond's", "sunsilk", "vim", "axe"].every((b) => replay.includes(b)));

await page.click("aside >> text=Live Check");
await page.waitForTimeout(400);
await page.locator("button:has-text('100% natural')").click();
await page.waitForTimeout(200);
await page.locator("button:has-text('Run clearance')").click();
await page.waitForTimeout(3000);
const live = await text();
check("Live Check returns a result and never shows an error",
  live.includes("ccpa-100") && !/error|failed|something went wrong/.test(live));

// ── Integrity ──────────────────────────────────────────────────────────────
check("Draft-status rules are visibly labelled", (await page.goto(`${BASE}/asset/REX-12`, { waitUntil: "load" }).then(async () => {
  await page.waitForTimeout(500);
  return await text();
})).includes("draft"));

check("No uncaught page errors across the walkthrough", errors.length === 0, errors.slice(0, 2).join("; "));

console.log(failures ? `\n${failures} FAILED` : "\nAll acceptance checks pass.");
await browser.close();
process.exit(failures ? 1 : 0);
