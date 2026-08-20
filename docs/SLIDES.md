# PRAMAAN — 3-slide submission deck (content draft)

Source content only — pulled from `docs/PRD.md` (Appendix A/B, §17, the prioritisation
2×2, §10.4, §12.2, §18) so nothing here contradicts what's already been decided and
verified. Paste into your house PPT template; don't invent new numbers on the way in —
anything not in this file wasn't verified in time (see the Honesty notes at the bottom).

---

## Slide 1 — The problem and the product

**Headline:** The regulator has the agent. The advertiser does not.

**Body (verbatim, Appendix A of the PRD):**

> Unilever taught its brand teams to generate 400 assets where they used to make 20, in
> 21 markets, with 300,000 influencers, for content that lives four days. It did not
> teach them to clear it. Ninety-one percent of marketing teams now use AI to create;
> twenty-six percent use it to govern. Meanwhile ASCI catches ninety-three percent of
> violations through its own always-on AI, finds ninety-eight percent of scrutinised ads
> need modification, and names Personal Care India's worst category. PRAMAAN is that
> agent: it clears every asset before it ships and every day after — against live
> regulation, approved claims, brand code, likeness consent and cultural risk — cites
> the clause for every verdict, and re-runs the entire portfolio the day a rule
> changes. It removes no approver and flattens no hierarchy. It moves the rule-check to
> the moment of drafting, which is the one place it has never been.

**Line to say on stage (reframe the speed-vs-governance risk early — PRD §16.1):**

> "HUL already has the hands and the ears. Sketch Pro makes 400 variants in two hours;
> Sangam finds the moment. What's missing is the thing that lets you actually ship them
> inside a four-day window. Governance isn't the brake here — it's the throttle. Right
> now it's stuck at 1x while generation runs at 7x."

**On form factor (say this explicitly — it pre-empts "isn't this just a dashboard?"):**

> "PRAMAAN is not a dashboard. A dashboard would be a queue with better lighting. It's
> Grammarly for brand claims — ambient, inline, in the tools where the work already
> happens — with a governance console the brand manager never has to open."

**Footer (mandatory, PRD §7):** *Rule text paraphrased for machine execution.
Production rule packs authored and maintained by regulatory counsel.*

---

## Slide 2 — Where it sits, and why this piece first

**Headline:** PRAMAAN is Sanction in a four-stage loop. Build the constraint, not the
stage that already has slack.

**The loop (PRD §17):**

| Stage | Product | Mechanism | Status |
|---|---|---|---|
| Signal | Router | Fuses existing feeds (Sangam, social, q-commerce, search intent, Shikhar reorders) and *pushes* brand-matched opportunities | Concept |
| Score | Durability Index | Separates fad from trend using repeat-consumption and organic-pull proxies — Shikhar reorder-without-promo is the offline signal only HUL has | Concept |
| **Sanction** | **PRAMAAN** | **Risk-tiered clearance with clause-cited verdicts** | **This submission** |
| Scale | Escalation gate | Once a bet clears a pull threshold, auto-escalate into Shikhar / Samadhan / 2.2M outlets | Concept |

**Why Sanction first (Theory of Constraints, say it plainly):** Signal, Score and Scale
all produce *more things to ship*. Sanction is the stage currently capping throughput —
relieving a non-constraint produces nothing.

**The prioritisation 2×2 (PRD §7, verbatim structure):**

```
                    HIGH VALUE
                         |
      C3 Replay      *   |   *  A2 Claims Ledger
      A7 Moment Risk *   |   *  A3 Rule Engine
      Ring 0         *   |   *  A1 Extraction
                         |
   UNIQUE ───────────────┼─────────────── TABLE STAKES
                         |
      D4 Systemic     *  |   *  D1 Heat map
      B12 Model drift *  |   *  B3 Marketplace
                         |
                    LOWER VALUE

           Build left-top first. Buy or defer right-bottom.
```

**Pre-empt the strongest objection yourself (PRD §18.3):**

> "The legal team don't slow us down, they reduce the risk of us getting sued and
> people losing their jobs. They aren't the enemy."

---

## Slide 3 — The prototype, live

**Headline:** Two artefacts, both real. Not a mockup.

| Artefact | What a judge does | Intelligence |
|---|---|---|
| Web prototype (this build) | Click through Batch Review, Moment Risk, Rule Replay, Live Check — or press "Guided walkthrough" and let it drive itself | Real engine + real replay; seeded assets, labelled as such |
| Google AI Studio agent | Type your own ad copy, get a clause-cited verdict back | Real Gemini reasoning over the real rule pack |

**Links (add QR codes for both before printing):**

- Web prototype: `https://hul-tech.vercel.app`
- AI Studio agent: `<paste after publishing — see docs/AI-STUDIO-AGENT.md, PRD §12.2 checklist>`

**The three demos, in order (PRD §15.3):**

1. **Rexona moment** — 12 variants, 9 GREEN / 2 AMBER / 1 RED, each clause-cited, ~4s
2. **The refusal** — a tempting cultural moment declined, reasoning differs by market
3. **The replay** — a rule changes, the real engine re-evaluates the portfolio, 6 assets surface ranked by reach

**Closing line:**

> "Brand DNAi governs what the AI reads. PRAMAAN governs what the world sees."

---

## Honesty notes — read before finalising

Everything above is sourced from content already decided and verified in `docs/PRD.md`
and `docs/STATUS.md`. Three things are deliberately **not** on these slides because
PRD §18.1 flags them as unverified and the cost of an overclaim on stage is worse than
the cost of a thinner deck:

- No LLM inference cost figure (§18.1 item 3 — pricing not re-verified today)
- No EU AI Act Art. 50 date (§18.1 item 1 — status contested as of the PRD's writing)
- No ROI / % uplift number (§18.2 — every such figure PRD research found was either
  vendor-sponsored, fabricated, or off-topic; do not add one under deadline pressure)

If you have time to re-verify any of these before printing, PRD §18.3 gives the
sourcing hierarchy to use.
