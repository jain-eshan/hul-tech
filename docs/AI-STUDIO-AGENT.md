# PRAMAAN — Google AI Studio agent

**Agent name: `Techtonic_Apex_PRAMAAN`**

Generated from `data/rules.ts` and `data/claims.ts` at rule set v2026.08.
Regenerate with:

```
npx tsx --tsconfig tsconfig.json scripts/build-agent-prompt.ts
```

Do not edit the system instructions by hand. They are generated so the published agent
and the web app cannot disagree about what a rule says — a judge who gets two different
verdicts for the same copy has found the worst bug this project can have.

---

## Publish it — seven steps, about fifteen minutes

1. Open **https://aistudio.google.com** and sign in with the account that owns the team
   Drive folder.
2. **Create Prompt** → **New chat prompt**.
3. Open **System instructions** and paste everything in `docs/AI-STUDIO-SYSTEM-INSTRUCTIONS.txt`.
4. Set the model to the **most capable** one in the dropdown. This agent does multi-step
   reasoning over a 47-rule pack; a fast small model will drop findings.
5. Run the six test inputs below and check them against the expected rule ids. Do this
   **before** sharing — a published agent that misfires is worse than an unpublished one.
6. **Save** as exactly `Techtonic_Apex_PRAMAAN`. Save to the team Google Drive when prompted.
7. **Share** → **Anyone with the link can view**. Then open the link in an
   **incognito window while signed out**. This single check has killed more competition
   demos than any bug.

Put the URL on Slide 3 with a QR code.

---

## Test vectors

Expected rule ids are computed by PRAMAAN's own engine, so agreement here is the same
thing as agreement with the web app.

### 1. Canonical input (PRD §11.12)

**Input** (market IN):
> Our new formula is 100% natural and clinically proven to remove 99.9% of germs. Dermatologist recommended. Limited stock — only 3 left!

**Expected status:** RED
**Expected rule ids:** CCPA-100, CCPA-GW-3, CCPA-DP-7, ASCI-I-1

### 2. Clean input — must not invent findings

**Input** (market IN, SKU REX-AP-150):
> 72h freshness. It won't ever let you down.

**Expected status:** GREEN
**Expected rule ids:** none — must return GREEN with an empty findings array

### 3. Wrong-market claim — must be AMBER, not RED

**Input** (market UK, SKU REX-AP-150):
> Clinically proven 72h protection.

**Expected status:** AMBER
**Expected rule ids:** ASCI-I-1

### 4. Therapeutic crossover

**Input** (market IN, SKU SUN-SH-340):
> Cures dandruff in one wash.

**Expected status:** RED
**Expected rule ids:** DMR-3, ASCI-I-1

### 5. Superiority without a dossier

**Input** (market IN, SKU TRE-SH-340):
> India's No.1 shampoo for damaged hair.

**Expected status:** RED
**Expected rule ids:** ASCI-IV-3, ASCI-I-1

### 6. Ambiguous — must abstain, not guess

**Input** (market IN):
> Now with 30% more.

**Expected status:** abstain, routing "abstain", confidence < 0.6, empty findings
**Expected rule ids:** ASCI-IV-2

> **On abstention.** The engine now abstains here too, so the agent and the app agree. It fires ASCI-IV-2 — a comparison must be verifiable, and "30% more" names nothing to compare against — then declines to resolve the claim, because "more than the old formula", "more than a competitor" and "more than nothing" are three different assertions with three different verdicts. The agent should do the same: cite ASCI-IV-2 if it wishes, set routing to "abstain", keep confidence below 0.6, and say what it would need. What it must NOT do is report the claim as unsubstantiated, which presumes it knows what was claimed.

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
- Every finding in every test must carry a `ruleId` that exists in the rule pack. If one
  does not, the instruction at the end of the output contract is not landing and the model
  needs to be told again, more bluntly.

If a test fails, the fix belongs in `scripts/build-agent-prompt.ts`, not in the pasted
text — otherwise the next regeneration silently undoes it.

---

## Optional: run the tests automatically

With a Gemini API key you can check all six in one command instead of by hand:

```
GEMINI_API_KEY=your-key node scripts/test-agent-prompt.mjs
```

This calls the model with the same system instructions and validates the JSON against the
expectations above. It does not replace step 7 — only a human can confirm the published
link opens for a signed-out visitor.
