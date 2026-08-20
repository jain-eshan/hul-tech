// Verifies dist/pramaan.html works with no server and no network: loaded from file://,
// with every non-file request aborted.

import { chromium } from "playwright-core";
import path from "node:path";

const FILE = "file://" + path.resolve("dist/pramaan.html");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let blocked = 0;
await page.route("**/*", (r) => {
  const u = r.request().url();
  if (u.startsWith("file://") || u.startsWith("data:") || u.startsWith("blob:")) return r.continue();
  blocked++; return r.abort();
});

let failures = 0;
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const check = (n, ok, d = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? ` — ${d}` : ""}`); if (!ok) failures++; };
const text = async (sel = "main") => (await page.locator(sel).innerText()).toLowerCase();

await page.goto(FILE, { waitUntil: "load" });
await page.waitForTimeout(900);
check("Loads from file:// straight into Inbox", (await page.locator("h1").innerText()) === "Inbox");

for (const [hash, expect] of [
  ["#/batch", "the fourth official"], ["#/moment", "do not activate"],
  ["#/ring0", "constrain at generation"], ["#/watch", "creator sweep"],
  ["#/audit", "audit trail"], ["#/replay", "rule replay"], ["#/accuracy", "accuracy card"],
  ["#/asset/REX-10", "72h"],
]) {
  await page.goto(FILE + hash, { waitUntil: "load" });
  await page.waitForTimeout(800);
  check(`${hash} renders`, (await text()).includes(expect));
}

await page.goto(FILE + "#/batch", { waitUntil: "load" });
await page.waitForTimeout(600);
await page.click("text=Run clearance");
await page.waitForTimeout(4600);
const b = await text();
check("Demo A resolves 9/2/1", /9\s*cleared/.test(b) && /2\s*needs edit/.test(b) && /1\s*blocked/.test(b));

await page.goto(FILE + "#/asset/REX-10", { waitUntil: "load" });
await page.waitForTimeout(3200);
await page.click("button:has-text('Apply')");
await page.waitForTimeout(900);
check("Apply rewrites copy and clears the asset",
  (await text()).includes("72h freshness") && (await text()).includes("cleared against rule set"));

await page.goto(FILE + "#/replay", { waitUntil: "load" });
await page.waitForTimeout(600);
await page.click("text=Publish v2026.09");
await page.waitForTimeout(7500);
const r = await text();
check("Demo C surfaces the 6 assets", ["lakmé", "dove", "pond's", "sunsilk", "vim", "axe"].every((x) => r.includes(x)));

await page.goto(FILE + "#/watch", { waitUntil: "load" });
await page.waitForTimeout(800);
await page.locator("button.mono").filter({ hasText: "sha256" }).first().click();
await page.waitForTimeout(700);
const s = await text("body");
check("Snapshot modal shows the captured render, timestamp and hash",
  s.includes("sha256-") && s.includes("captured at"));
const img = await page.locator('img[alt*="Captured render"]').first().evaluate((e) => e.naturalWidth > 0).catch(() => false);
check("Inlined snapshot image renders", img === true);

await page.goto(FILE + "#/live", { waitUntil: "load" });
await page.waitForTimeout(600);
await page.locator("button:has-text('100% natural')").click();
await page.waitForTimeout(200);
await page.locator("button:has-text('Run clearance')").click();
await page.waitForTimeout(1500);
const l = await text();
check("Live Check works with no server", l.includes("ccpa-100") && !/error|failed/.test(l));

check("No uncaught errors", errors.length === 0, errors.slice(0, 2).join("; "));
console.log(`\n${blocked} network requests attempted (should be 0).`);
console.log(failures ? `${failures} FAILED` : "Standalone build works with no server and no network.");
await browser.close();
process.exit(failures ? 1 : 0);
