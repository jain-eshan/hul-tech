# PRAMAAN

**Always-on AI brand governance for Hindustan Unilever.**
*Proof at the speed of publish.*

Pre-flight clearance for marketing assets: every verdict cites a regulatory clause,
every fix is one click, and the whole portfolio re-runs the day a rule changes.

Full product spec in [`docs/PRD.md`](docs/PRD.md). Build plan in [`docs/PLAN.md`](docs/PLAN.md).
Current state in [`docs/STATUS.md`](docs/STATUS.md).

---

## Run it locally

Requires **Node 18.17+** (Node 20 or 22 recommended). Nothing else — no database, no
API keys, no accounts.

```bash
git clone https://github.com/jain-eshan/hul-tech.git
cd hul-tech
git checkout claude/prd-project-planning-huyu5w
npm install
npm run dev
```

Then open **http://localhost:3000**.

The app opens straight into the Inbox — there is no login and no landing page, by design.

### Optional

Live Check runs its judgment pass through Gemini when a key is present, and falls back
silently to the deterministic engine when it is not. To enable it:

```bash
echo "GEMINI_API_KEY=your-key-here" > .env.local
```

Without a key, every screen still works. The walkthrough is designed to run with wifi off.

---

## Start here: the guided walkthrough

Press **Guided walkthrough**, top right. Sixteen spotlighted steps, about four minutes,
and it drives the app rather than describing it — clearance runs, a fix applies, the
persona switches to Legal, a rule publishes and the portfolio re-evaluates.

It is built for someone exploring alone. Every step names who it helps, and the last one
hands over: type your own copy into Live Check and see what comes back.

## The three demos, in walkthrough order

If you would rather drive yourself. Open with the market strip, not the architecture.

| | Screen | What to do | What it proves |
|---|---|---|---|
| **A** | **Batch Review** | Click `Run clearance`. 12 Rexona variants resolve to 9 cleared / 2 needs-edit / 1 blocked over ~4s. Click the amber `UK` chip, then `Apply` on the finding | Throughput and precision. The fix rewrites the copy in the left pane and the verdict is recomputed — not toggled |
| **B** | **Moment Risk** | Read the four reasoning cards. Hover the market grid | Judgment, not throughput. The agent refuses, and the reasoning differs by market |
| **C** | **Rule Replay** | Click `Publish v2026.09` | The capability no reviewer has. Six assets surface from the real engine, ranked by reach |
| *D* | **Live Check** | Type anything, or click a preset | It isn't a video |

Worth showing alongside: switch the persona (bottom left) from **Priya Sharma · ABM** to
**Legal Counsel** on any asset — Override unlocks. Then check **Audit Trail**, where
every applied fix and logged override appears append-only, with a one-click regulator
response pack.

---

## Verify the demos before trusting them

```bash
npm run verify        # 12 engine invariants — the facts the pitch depends on
```

```bash
npm run build && npx next start -p 3121 &
node scripts/acceptance.mjs      # 17 checks from PRD §13, driven in a real browser
```

Both suites should be fully green. `npm run verify` is the one that matters most: it
guards that Demo A really resolves 9/2/1 and Demo C really surfaces six assets, from
the engine rather than from a fixture.

---

## How it is built

```
lib/types.ts        the contract. Finding.ruleId is REQUIRED, so an uncited
                    finding is a compile error rather than a test we hope runs
lib/engine/
  deterministic.ts  pure code, no model, sub-50ms — PRD §7.10
  index.ts          claims matching, aggregation, confidence, routing
data/rules.ts       47 rules across 8 regulators, every one with a sourceUrl
data/claims.ts      25 approved claims + the retired register + brand codex
data/assets.ts      12 Rexona variants (Demo A) + 48 portfolio assets (Demo C)
```

Two design decisions are load-bearing and worth knowing before reading the code:

1. **Deterministic and judgment checks are physically separate code paths.** Mechanical
   checks never touch a model — they would be slower, costlier and non-reproducible.
   The split is visible in the UI as the latency breakdown on every verdict.
2. **Clause citation is structural, not tested.** Findings can only be built through a
   constructor that resolves the rule from the pack and throws if it is absent. A
   finding citing a rule that does not exist cannot be constructed.

Stack: Next.js 14 (App Router), TypeScript, Tailwind, Zustand, Playwright for the
acceptance run. No database, no auth, no persistence — state resets on reload, which is
what the `Reset demo state` control in the sidebar makes explicit.

---

## Honesty notes

These are deliberate and should be said aloud rather than discovered.

- Rule text is **paraphrased for machine execution**. It is not verbatim statutory
  language. Production rule packs would be authored by regulatory counsel.
- Draft-status rules (`ASCI-AI-*`) are labelled "draft" in the UI because they are not
  in force.
- The Moment Risk scenario is a **constructed composite**, labelled on screen.
- Replay animates to 1,412 — the production scope for that rule — while actually
  re-evaluating the 48 seeded portfolio assets. The screen states both figures.
- PULSE, MEMORY and WATCH are not built. See `docs/PLAN.md` for why they were cut.
