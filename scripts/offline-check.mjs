// PRD §13 resilience: "Full walkthrough works with wifi off, except Live Check."
//
// Simulated by aborting every request that leaves localhost — including the Gemini
// call behind Live Check, which must degrade silently rather than show an error.

import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://localhost:3150";
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-proxy-server"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let blocked = 0;
await page.route("**/*", (route) => {
  const url = route.request().url();
  if (url.startsWith(BASE) || url.startsWith("data:") || url.startsWith("blob:")) return route.continue();
  blocked++;
  return route.abort();
});

let failures = 0;
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const check = (n, ok, d = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? ` — ${d}` : ""}`);
  if (!ok) failures++;
};

const ROUTES = [
  ["/", "inbox"], ["/batch", "the fourth official"], ["/moment", "do not activate"],
  ["/ring0", "constrain at generation"], ["/watch", "creator sweep"],
  ["/audit", "audit trail"], ["/replay", "rule replay"], ["/accuracy", "accuracy card"],
  ["/asset/REX-10", "72h"],
];

for (const [route, expect] of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: "load" });
  await page.waitForTimeout(700);
  const body = (await page.locator("main").innerText()).toLowerCase();
  check(`${route} renders offline`, body.includes(expect), body.slice(0, 60));
}

// Live Check is the one screen allowed to need the network — and it must not say so.
await page.goto(`${BASE}/live`, { waitUntil: "load" });
await page.locator("button:has-text('100% natural')").click();
await page.waitForTimeout(200);
await page.locator("button:has-text('Run clearance')").click();
await page.waitForTimeout(4000);
const live = (await page.locator("main").innerText()).toLowerCase();
check("Live Check still returns findings with the network down", live.includes("ccpa-100"));
check("Live Check shows no error to the user", !/error|failed|went wrong|unavailable/.test(live));

check("No uncaught page errors while offline", errors.length === 0, errors.slice(0, 2).join("; "));
// Note the limit of this test: the Gemini call in /api/check happens server-side, so
// a browser-level block never reaches it. The model-failure path is covered separately
// by running the server with a deliberately invalid GEMINI_API_KEY.
console.log(`\n${blocked} external requests blocked from the client.`);
console.log(failures ? `${failures} FAILED` : "Full walkthrough works offline.");
await browser.close();
process.exit(failures ? 1 : 0);
