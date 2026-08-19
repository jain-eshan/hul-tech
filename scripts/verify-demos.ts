// Demo regression check. Run: npx tsx --tsconfig tsconfig.json scripts/verify-demos.ts
//
// Guards the four engine facts the pitch depends on. If any of these break, a demo
// on stage breaks with it, so this runs before every deploy.

import { rexonaVariants, portfolio, assets } from "@/data/assets";
import { evaluate, evaluateText, RULESET_CURRENT, RULESET_NEXT } from "@/lib/engine";

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

// 1 — Demo A: 12 Rexona variants resolve 9 GREEN / 2 AMBER / 1 RED.
const a = rexonaVariants.map((x) => evaluate(x));
const tally = a.reduce<Record<string, number>>((m, v) => ((m[v.status] = (m[v.status] ?? 0) + 1), m), {});
check("Demo A resolves 9/2/1", tally.GREEN === 9 && tally.AMBER === 2 && tally.RED === 1, JSON.stringify(tally));
check("Demo A RED is the unenrolled likeness variant",
  a.find((v) => v.status === "RED")?.findings.some((f) => f.ruleId === "ASCI-AI-H") === true);

// 2 — Demo C: the v2026.09 tightening surfaces exactly six, ranked by reach.
const newly = portfolio
  .map((x) => ({ x, before: evaluate(x, RULESET_CURRENT), after: evaluate(x, RULESET_NEXT) }))
  .filter((r) => r.before.status === "GREEN" && r.after.status !== "GREEN")
  .sort((p, q) => q.x.reachEstimate - p.x.reachEstimate);
check("Replay surfaces exactly 6 newly non-compliant assets", newly.length === 6, `got ${newly.length}`);
check("Replay results are ranked by reach",
  newly.every((r, i) => i === 0 || newly[i - 1].x.reachEstimate >= r.x.reachEstimate));
check("Every replay finding cites ASCI-AI-M",
  newly.every((r) => r.after.findings.some((f) => f.ruleId === "ASCI-AI-M")));

// 3 — Live Check canonical input fires the expected rule IDs (PRD §11.12).
const canonical = evaluateText(
  "Our new formula is 100% natural and clinically proven to remove 99.9% of germs. Dermatologist recommended. Limited stock — only 3 left!",
  "IN",
);
const fired = new Set(canonical.verdict.findings.map((f) => f.ruleId));
["CCPA-100", "CCPA-GW-3", "CCPA-DP-7", "ASCI-I-1"].forEach((id) =>
  check(`Canonical input fires ${id}`, fired.has(id)));
check("Canonical input verdict is RED", canonical.verdict.status === "RED");

// 4 — A clean input returns GREEN without inventing findings.
const clean = evaluateText("72h freshness. It won't ever let you down.", "IN", { sku: "REX-AP-150" });
check("Clean input returns GREEN with no invented findings",
  clean.verdict.status === "GREEN" && clean.verdict.findings.length === 0);

// 5 — The structural invariant: no finding can exist without a clause reference.
const uncited = assets.flatMap((x) => evaluate(x).findings).filter((f) => !f.ruleId || !f.clauseRef);
check("Zero findings without a clause reference", uncited.length === 0, `${uncited.length} uncited`);

console.log(failures ? `\n${failures} FAILED` : "\nAll demo invariants hold.");
process.exit(failures ? 1 : 0);
