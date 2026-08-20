// Runs the published agent's system instructions against Gemini and validates the output
// against the same expectations the verification sheet lists.
//
// This automates steps 5 of the publish guide. It cannot automate step 7 — only a human
// can confirm the shared link opens for a signed-out visitor, and that is the check that
// most often fails.
//
// Usage:  GEMINI_API_KEY=... node scripts/test-agent-prompt.mjs
//         GEMINI_API_KEY=... GEMINI_MODEL=gemini-2.5-pro node scripts/test-agent-prompt.mjs

import { readFileSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("GEMINI_API_KEY is not set.\n");
  console.error("Get a key at https://aistudio.google.com/apikey, then:");
  console.error("  GEMINI_API_KEY=your-key node scripts/test-agent-prompt.mjs");
  process.exit(2);
}

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-pro";
const SYSTEM = readFileSync("docs/AI-STUDIO-SYSTEM-INSTRUCTIONS.txt", "utf8");

// Mirrors the vectors in docs/AI-STUDIO-AGENT.md.
const VECTORS = [
  { label: "Canonical input", market: "IN",
    copy: "Our new formula is 100% natural and clinically proven to remove 99.9% of germs. Dermatologist recommended. Limited stock — only 3 left!",
    status: "RED", mustFire: ["CCPA-100", "CCPA-DP-7"] },
  { label: "Clean input", market: "IN", sku: "REX-AP-150",
    copy: "72h freshness. It won't ever let you down.",
    status: "GREEN", mustFire: [], mustBeEmpty: true },
  { label: "Wrong market — AMBER not RED", market: "UK", sku: "REX-AP-150",
    copy: "Clinically proven 72h protection.",
    status: "AMBER", mustFire: ["ASCI-I-1"] },
  { label: "Therapeutic crossover", market: "IN", sku: "SUN-SH-340",
    copy: "Cures dandruff in one wash.",
    status: "RED", mustFire: ["DMR-3"] },
  { label: "Superiority without a dossier", market: "IN", sku: "TRE-SH-340",
    copy: "India's No.1 shampoo for damaged hair.",
    status: "RED", mustFire: ["ASCI-IV-3"] },
  { label: "Ambiguous — must abstain", market: "IN",
    copy: "Now with 30% more.",
    routing: "abstain", maxConfidence: 0.6 },
];

// Every rule id the agent is allowed to cite. Anything else is a hallucinated rule, which
// is the failure this whole design exists to prevent.
const VALID = new Set(
  [...SYSTEM.matchAll(/^([A-Z]+[A-Z0-9-]*-[A-Z0-9.]+) \| /gm)].map((m) => m[1]),
);

async function ask(v) {
  const prompt = `Market: ${v.market}${v.sku ? `\nSKU: ${v.sku}` : ""}\n\nCopy:\n${v.copy}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 },
      }),
    },
  );
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  const block = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/(\{[\s\S]*\})/);
  if (!block) throw new Error("no JSON block in the reply");
  return { parsed: JSON.parse(block[1]), text };
}

let failures = 0;
const note = (ok, msg) => { console.log(`   ${ok ? "ok  " : "FAIL"} ${msg}`); if (!ok) failures++; };

console.log(`Testing ${VECTORS.length} vectors against ${MODEL}\n`);

for (const v of VECTORS) {
  console.log(`▸ ${v.label}`);
  try {
    const { parsed, text } = await ask(v);
    const ids = (parsed.findings ?? []).map((f) => f.ruleId);

    // The prose-before-JSON contract: a judge should read a sentence, not a payload.
    const prose = text.split("```")[0].trim();
    note(prose.length > 20, `plain-language verdict present (${prose.length} chars)`);

    if (v.status) note(parsed.status === v.status, `status ${parsed.status} (expected ${v.status})`);
    if (v.routing) note(parsed.routing === v.routing, `routing ${parsed.routing} (expected ${v.routing})`);
    if (v.maxConfidence !== undefined) {
      note(parsed.confidence < v.maxConfidence, `confidence ${parsed.confidence} (expected < ${v.maxConfidence})`);
    }
    for (const id of v.mustFire ?? []) note(ids.includes(id), `fired ${id}`);
    if (v.mustBeEmpty) note(ids.length === 0, `no invented findings (got ${ids.length})`);

    const bogus = ids.filter((id) => !VALID.has(id));
    note(bogus.length === 0, bogus.length ? `hallucinated rule ids: ${bogus.join(", ")}` : "all rule ids exist in the pack");

    const uncited = (parsed.findings ?? []).filter((f) => !f.ruleId || !f.clauseRef);
    note(uncited.length === 0, "every finding carries a ruleId and clauseRef");
  } catch (e) {
    note(false, `request failed — ${e.message}`);
  }
  console.log();
}

console.log(failures ? `${failures} checks FAILED` : "All checks pass. Safe to publish.");
process.exit(failures ? 1 : 0);
