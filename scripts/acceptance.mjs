// PRD §13 acceptance checklist, driven in a real browser.
//
// Usage:  npx next build && npx next start -p 3121 &   then:  node scripts/acceptance.mjs
//
// Batched deliberately: running these after every screen costs a full context
// re-read each time, so they run once, at the end, as the plan's Phase 9 gate.

import { chromium } from "playwright-core";

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
// Judgment findings stream in behind the deterministic ones, so wait past the reveal.
await page.waitForTimeout(3000);
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

// ── T0 features added after the first pass ────────────────────────────────
await page.click("aside >> text=Ring 0");
await page.waitForTimeout(600);
const ring = await text();
check("Ring 0 split-screen renders the constraint pack",
  ring.includes("without ring 0") && ring.includes("with ring 0") && ring.includes("permitted"));
await page.click("text=Constraint pack for");
await page.waitForTimeout(300);
check("Constraint pack expands to the injected prompt",
  (await text()).includes("permitted claims"));

const api = await page.evaluate(async () => {
  const r = await fetch("/api/constrain?brand=Rexona&sku=REX-AP-150&market=IN");
  const j = await r.json();
  return { claims: j.pack.permittedClaims.length, prohibited: j.pack.prohibitedTerms.length };
});
check("pramaan.constrain() endpoint returns a pack", api.claims > 0 && api.prohibited > 0,
  `${api.claims} permitted, ${api.prohibited} prohibited`);

await page.click("aside >> text=Accuracy Card");
await page.waitForTimeout(700);
const acc = await text();
check("Accuracy card shows measured numbers",
  /recall/.test(acc) && /precision/.test(acc) && /%/.test(acc));
check("Accuracy card states its own limits",
  acc.includes("what this card does not say") && acc.includes("not adjudicated by regulatory counsel"));

await page.click("aside >> text=Creator Sweep");
await page.waitForTimeout(700);
const sweep = await text();
check("Creator sweep shows 3 violations", (sweep.match(/send fix request/g) ?? []).length === 3);
await page.locator("button:has-text('Send fix request')").first().click();
await page.waitForTimeout(400);
check("Fix request is plain language, not a clause citation",
  (await text("body")).includes("thanks for the"));
await page.locator("body").click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);

await page.locator("button.mono").filter({ hasText: "sha256" }).first().click();
await page.waitForTimeout(600);
const snapText = await text("body");
check("Snapshot modal shows a real captured render with timestamp and hash",
  snapText.includes("sha256-") && snapText.includes("captured at") && snapText.includes("gmt"));
const imgOk = await page.locator('img[alt*="Captured render"]').first()
  .evaluate((el) => el.naturalWidth > 0).catch(() => false);
check("Snapshot PNG actually loads", imgOk === true);
await page.locator("body").click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);

// ── Spec details ──────────────────────────────────────────────────────────
await page.goto(`${BASE}/asset/REX-10`, { waitUntil: "load" });
await page.waitForTimeout(300);
const early = await page.locator("main").innerText();
await page.waitForTimeout(2600);
const late = await page.locator("main").innerText();
check("Progressive disclosure — findings are not all present at once",
  early.length < late.length || early.includes("streaming"));
check("Bounding box is drawn on the offending region",
  (await page.locator('text=ASCI-I-1').count()) > 0 &&
  (await page.locator('div[style*="border: 2px solid"]').count()) > 0);
await page.keyboard.press("a");
await page.waitForTimeout(800);
check("Keyboard: 'a' applies the active fix",
  (await text()).includes("cleared against rule set"));

// ── Personas ──────────────────────────────────────────────────────────────
await page.goto(`${BASE}/`, { waitUntil: "load" });
await page.waitForTimeout(600);
const abmCols = await page.locator("thead th").allInnerTexts();
await page.selectOption("aside select", "legal");
await page.waitForTimeout(500);
const legalCols = await page.locator("thead th").allInnerTexts();
await page.selectOption("aside select", "director");
await page.waitForTimeout(500);
const dirCols = await page.locator("thead th").allInnerTexts();
check("Persona changes visible columns — ABM baseline", !abmCols.join().toLowerCase().includes("routing"));
check("Persona changes visible columns — Legal sees routing",
  legalCols.join().toLowerCase().includes("routing") && legalCols.length > abmCols.length);
check("Persona changes visible columns — Director sees exposure",
  dirCols.join().toLowerCase().includes("reach") && dirCols.join().toLowerCase().includes("spend"));

await page.click("aside >> text=Batch Review");
await page.waitForTimeout(400);
await page.click("text=Run clearance");
await page.waitForTimeout(4600);
check("Director can ship", !(await page.locator("button:has-text('Ship')").isDisabled()));
await page.selectOption("aside select", "legal");
await page.waitForTimeout(500);
check("Legal clears but does not publish", await page.locator("button:has-text('Ship')").isDisabled());

// ── Integrity ──────────────────────────────────────────────────────────────
await page.goto(`${BASE}/asset/REX-12`, { waitUntil: "load" });
await page.waitForTimeout(3000);
check("Draft-status rules are visibly labelled", (await text()).includes("draft"));

check("No uncaught page errors across the walkthrough", errors.length === 0, errors.slice(0, 2).join("; "));

console.log(failures ? `\n${failures} FAILED` : "\nAll acceptance checks pass.");
await browser.close();
process.exit(failures ? 1 : 0);
