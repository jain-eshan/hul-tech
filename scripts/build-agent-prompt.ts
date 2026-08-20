// Generates the AI Studio system instructions AND the verification sheet, both from the
// SAME data the web app uses.
//
// PRD §10.3 keeps tracks 1 and 7 independent so a failure in one cannot take the other
// down. Independent is not the same as inconsistent: a judge who gets a different verdict
// from the published agent than from the app has found the worst bug available. So the
// rule pack and ledger are generated, never transcribed.
//
// Run: npx tsx --tsconfig tsconfig.json scripts/build-agent-prompt.ts

import { writeFileSync } from "node:fs";
import { rules, RULE_SET_VERSION } from "@/data/rules";
import { claims } from "@/data/claims";
import { evaluateText } from "@/lib/engine";
import type { Market } from "@/lib/types";

const TEAM = "Apex";
const AGENT_NAME = `Techtonic_${TEAM}_PRAMAAN`;

const mkt = (m: unknown) => (m === "all" ? "all" : (m as string[]).join(","));

const rulePack = rules
  .map((r) => `${r.id} | ${r.regulator} | ${r.clauseRef} | ${r.title} | ${r.testType} | ${r.severity} | ${mkt(r.jurisdictions)}${r.draft ? " | DRAFT, not in force" : ""}`)
  .join("\n");

const active = claims.filter((c) => c.status !== "retired")
  .map((c) => `"${c.canonicalText}" | ${c.brand} ${c.productSku} | markets: ${mkt(c.markets)} | ${c.dossierRef} | ${c.evidenceGrade}${c.status === "expiring" ? ` | EXPIRES ${c.expiresOn}` : ""}`)
  .join("\n");

const retired = claims.filter((c) => c.status === "retired")
  .map((c) => `"${c.canonicalText}" | RETIRED — ${c.retiredReason}`)
  .join("\n");

// ── The system instructions ────────────────────────────────────────────────

const SYSTEM = `You are PRAMAAN, a brand-governance clearance agent for Hindustan Unilever. You evaluate marketing copy against Indian advertising regulation and an approved-claims ledger.

You do not write marketing copy. You do not clear anything you cannot cite a rule for.

Rule text below is paraphrased for machine execution. It is not verbatim statutory language and you must never present it as such.

## RULE PACK — ${rules.length} rules, rule set ${RULE_SET_VERSION}

Format: id | regulator | clauseRef | title | testType | severity | jurisdictions

${rulePack}

## APPROVED CLAIMS LEDGER

A claim is substantiated because it appears below for the stated market. Not because it sounds reasonable.

Format: claim | brand SKU | markets | dossier | evidence grade

${active}

## RETIRED CLAIMS — never clear these, and cite the reason

${retired}

## DECISION PROCEDURE — follow in this order

1. Run the deterministic checks first. These need no judgment: prohibited terms, "100%" claims, false urgency, disclosure presence AND position, therapeutic verbs against a condition, superiority terms, manufactured precision (decimal multipliers, implausible absolute counts).

2. Extract every objective claim in the copy. Resolve each against the ledger FOR THE STATED MARKET.
   - Matched for that market → contributes GREEN.
   - Matched but the market is not listed → AMBER. The claim exists; the registration does not. Offer the market-valid alternative from the ledger, and offer attaching the dossier as the alternative path.
   - No match → RED. Never guess a dossier.
   - On the retired register → RED, and name the reason.
   - Taglines and pure price or offer phrases are not objective claims and need no dossier. They are still subject to the deterministic rules.

3. Apply the judgment rules: implied superiority, therapeutic implication, misleading by ambiguity or omission, cultural and moment risk.

4. Aggregate. Any critical finding → RED. Any major or minor finding → AMBER. No findings → GREEN. State a confidence between 0 and 1.

5. Route by consequence, not by format:
   - GREEN and confidence >= 0.85 → auto
   - AMBER → single_approver
   - RED, or high reach and spend → full_chain
   - confidence < 0.6 → abstain

6. If confidence is below 0.6, ABSTAIN AND ESCALATE. Do not guess. An agent that says it is not qualified to clear something is more useful than one that is confidently wrong.

## WHEN TO ABSTAIN

Abstain when you genuinely cannot tell, not merely when the answer is complicated. Concretely: the market is not stated and the verdict depends on it; the product or SKU is unidentifiable so the ledger cannot be searched; the copy is too fragmentary to carry a claim; or the decision turns on facts not in evidence, such as whether a study exists.

Set status to AMBER, routing to "abstain", confidence below 0.6, and say plainly in the summary what you would need in order to decide.

## OUTPUT CONTRACT

Reply in two parts, in this order, always.

FIRST — a short plain-language verdict a brand manager can act on. What the status is, what is wrong, and what to change. Three sentences at most. No JSON in this part.

THEN — the strict JSON block, fenced as json:

{
  "status": "RED | AMBER | GREEN",
  "confidence": 0.0,
  "routing": "auto | single_approver | full_chain | abstain",
  "market": "<the market evaluated>",
  "findings": [
    {
      "ruleId": "<id from the rule pack above>",
      "clauseRef": "<clause reference for that rule>",
      "severity": "critical | major | minor",
      "quotedText": "<the exact offending span, copied from the input>",
      "explanation": "<why, naming the market and the dossier where relevant>",
      "suggestedFix": "<compliant alternative, or null if no fix exists>"
    }
  ]
}

Hard constraints on the JSON:
- Every finding MUST carry a ruleId drawn from the rule pack above. If you cannot cite a rule, do not emit the finding. This mirrors a NOT NULL constraint in the production database: an uncited finding physically cannot be stored.
- Never invent a rule id, a clause reference, or a dossier reference.
- quotedText must be copied verbatim from the input, not paraphrased.
- A rewrite may only use wording already in the ledger for that market, or non-objective language. Never invent a new objective claim.
- Where no fix exists — a prohibited high-risk AI tier, a retired claim, a therapeutic claim on a cosmetic — set suggestedFix to null and say so. Offering a cosmetic reword for an unfixable claim is worse than offering nothing.
- If no market is stated, assume IN and say that you assumed it.

## EXAMPLES

### Example 1 — GREEN

Input: market IN — "72h freshness. It won't ever let you down."

Cleared. Both claims resolve for India: "72h freshness" under DOS-IN-2291, and the second line is a non-objective tagline. Nothing to change.

\`\`\`json
{"status":"GREEN","confidence":0.96,"routing":"auto","market":"IN","findings":[]}
\`\`\`

### Example 2 — AMBER, with a rewrite that works

Input: market UK — "Clinically proven 72h protection."

Needs one edit before it can ship. The clinical claim is substantiated under DOS-EU-4471, which is not registered for the UK, so it cannot run there as written. Either switch to "72h freshness", which is registered, or attach UK trial data to keep the original wording.

\`\`\`json
{"status":"AMBER","confidence":0.91,"routing":"single_approver","market":"UK","findings":[{"ruleId":"ASCI-I-1","clauseRef":"Ch. I, 1.1","severity":"major","quotedText":"Clinically proven 72h protection","explanation":"Substantiated under DOS-EU-4471 (clinical), which is not registered for the United Kingdom. Claims must be capable of substantiation in the market of publication.","suggestedFix":"72h freshness"}]}
\`\`\`

### Example 3 — RED, with no fix available

Input: market IN — "Our shampoo cures dandruff and is 100% natural."

Blocked, and neither problem is fixable by rewording. "Cures dandruff" is a therapeutic claim a cosmetic cannot make, and "100% natural" was retired after the June 2026 absolute-verifiability ruling. This needs a different claim, not different phrasing.

\`\`\`json
{"status":"RED","confidence":0.94,"routing":"full_chain","market":"IN","findings":[{"ruleId":"DMR-3","clauseRef":"s.3","severity":"critical","quotedText":"cures dandruff","explanation":"Suggests treatment or cure of a scheduled condition. A cosmetic may describe appearance, not therapy.","suggestedFix":"reduces the appearance of dandruff"},{"ruleId":"CCPA-100","clauseRef":"Ruling, 18 Jun 2026","severity":"critical","quotedText":"100% natural","explanation":"A \\"100%\\" claim must be literally and completely verifiable, and no lab or clinical dossier is on file. This exact wording is on the retired register.","suggestedFix":null}]}
\`\`\`

### Example 4 — ABSTAIN rather than guess

Input: "Now with 30% more."

I cannot clear this. Thirty percent more than what is not stated, no product is identified, and no market is given, so there is nothing to resolve against the ledger. Tell me the SKU, the market, and the comparison basis and I will evaluate it.

\`\`\`json
{"status":"AMBER","confidence":0.35,"routing":"abstain","market":"IN","findings":[]}
\`\`\`
`;

// ── Verification sheet, computed by the engine ─────────────────────────────
// The §12.2 checklist says to test the agent against several inputs. That is only
// executable if someone knows what the right answer is, so the expected rule ids are
// computed here rather than asserted.

const VECTORS: {
  label: string; copy: string; market: Market; sku?: string; expect: string;
  /** Set where the agent is expected to differ from the deterministic engine. */
  agentOnly?: string;
}[] = [
  { label: "Canonical input (PRD §11.12)", market: "IN",
    copy: "Our new formula is 100% natural and clinically proven to remove 99.9% of germs. Dermatologist recommended. Limited stock — only 3 left!",
    expect: "RED" },
  { label: "Clean input — must not invent findings", market: "IN", sku: "REX-AP-150",
    copy: "72h freshness. It won't ever let you down.", expect: "GREEN" },
  { label: "Wrong-market claim — must be AMBER, not RED", market: "UK", sku: "REX-AP-150",
    copy: "Clinically proven 72h protection.", expect: "AMBER" },
  { label: "Therapeutic crossover", market: "IN", sku: "SUN-SH-340",
    copy: "Cures dandruff in one wash.", expect: "RED" },
  { label: "Superiority without a dossier", market: "IN", sku: "TRE-SH-340",
    copy: "India's No.1 shampoo for damaged hair.", expect: "RED" },
  { label: "Ambiguous — must abstain, not guess", market: "IN",
    copy: "Now with 30% more.", expect: "abstain, routing \"abstain\", confidence < 0.6, empty findings",
    agentOnly: `This is the one vector where the agent is expected to do something the deterministic engine cannot. The engine resolves "Now with 30% more" against the ledger, finds nothing, and reports an unsubstantiated claim under ASCI-I-1. That is a defensible answer — but the better answer is to notice that "30% more" than *what* is not stated, no product is identified, and there is nothing to resolve. Recognising that a question is unanswerable is a judgment-path capability, which is exactly why the agent is worth having on top of the engine.` },
];

const sheet = VECTORS.map((v, i) => {
  const { verdict } = evaluateText(v.copy, v.market, { sku: v.sku });
  const ids = Array.from(new Set(verdict.findings.map((f) => f.ruleId)));
  return `### ${i + 1}. ${v.label}

**Input** (market ${v.market}${v.sku ? `, SKU ${v.sku}` : ""}):
> ${v.copy}

**Expected status:** ${v.expect}
**Expected rule ids:** ${v.agentOnly ? "none" : ids.length ? ids.join(", ") : "none — must return GREEN with an empty findings array"}
${v.agentOnly ? `\n> **The engine and the agent differ here, deliberately.** ${v.agentOnly}\n> For reference, the deterministic engine returns: ${ids.join(", ") || "no findings"}.\n` : ""}`;
}).join("\n");

// ── The document ───────────────────────────────────────────────────────────

const DOC = `# PRAMAAN — Google AI Studio agent

**Agent name: \`${AGENT_NAME}\`**

Generated from \`data/rules.ts\` and \`data/claims.ts\` at rule set ${RULE_SET_VERSION}.
Regenerate with:

\`\`\`
npx tsx --tsconfig tsconfig.json scripts/build-agent-prompt.ts
\`\`\`

Do not edit the system instructions by hand. They are generated so the published agent
and the web app cannot disagree about what a rule says — a judge who gets two different
verdicts for the same copy has found the worst bug this project can have.

---

## Publish it — seven steps, about fifteen minutes

1. Open **https://aistudio.google.com** and sign in with the account that owns the team
   Drive folder.
2. **Create Prompt** → **New chat prompt**.
3. Open **System instructions** and paste everything in \`docs/AI-STUDIO-SYSTEM-INSTRUCTIONS.txt\`.
4. Set the model to the **most capable** one in the dropdown. This agent does multi-step
   reasoning over a 47-rule pack; a fast small model will drop findings.
5. Run the six test inputs below and check them against the expected rule ids. Do this
   **before** sharing — a published agent that misfires is worse than an unpublished one.
6. **Save** as exactly \`${AGENT_NAME}\`. Save to the team Google Drive when prompted.
7. **Share** → **Anyone with the link can view**. Then open the link in an
   **incognito window while signed out**. This single check has killed more competition
   demos than any bug.

Put the URL on Slide 3 with a QR code.

---

## Test vectors

Expected rule ids are computed by PRAMAAN's own engine, so agreement here is the same
thing as agreement with the web app.

${sheet}
---

## What "pass" means

- Test 2 must return **GREEN with an empty findings array**. An agent that invents a
  finding on clean copy is the failure mode judges notice fastest.
- Test 3 must return **AMBER, not RED**. A registered claim in the wrong market is a
  paperwork gap; treating it as an unsubstantiated assertion is the single most common
  error in this rule set.
- Test 6 must **abstain**: routing "abstain", confidence below 0.6, and a plain statement
  of what it would need to decide. Confident nonsense here fails the reliability question
  the panel will ask.
- Every finding in every test must carry a \`ruleId\` that exists in the rule pack. If one
  does not, the instruction at the end of the output contract is not landing and the model
  needs to be told again, more bluntly.

If a test fails, the fix belongs in \`scripts/build-agent-prompt.ts\`, not in the pasted
text — otherwise the next regeneration silently undoes it.

---

## Optional: run the tests automatically

With a Gemini API key you can check all six in one command instead of by hand:

\`\`\`
GEMINI_API_KEY=your-key node scripts/test-agent-prompt.mjs
\`\`\`

This calls the model with the same system instructions and validates the JSON against the
expectations above. It does not replace step 7 — only a human can confirm the published
link opens for a signed-out visitor.
`;

writeFileSync("docs/AI-STUDIO-AGENT.md", DOC);
writeFileSync("docs/AI-STUDIO-SYSTEM-INSTRUCTIONS.txt", SYSTEM);
writeFileSync("dist/agent-system-instructions.txt", SYSTEM);

console.log(`docs/AI-STUDIO-AGENT.md — publish guide + ${VECTORS.length} test vectors`);
console.log(`docs/AI-STUDIO-SYSTEM-INSTRUCTIONS.txt — ${(SYSTEM.length / 1024).toFixed(1)} KB, paste this`);
console.log(`agent name: ${AGENT_NAME}`);
