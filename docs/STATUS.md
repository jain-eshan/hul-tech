# Build status

One line per phase. This is the handoff if a session or usage limit resets mid-build.

| Phase | Wall-clock | State | Notes |
|---|---|---|---|
| Planning | 20 Aug 04:15 IST | done | Design decisions taken, see DECISIONS.md |
| 0 · Contract freeze | 20 Aug 05:00 IST | **done** | types, 47 rules, 25 claims, 60 assets. Typecheck clean |
| 1 · Decision engine | 20 Aug 05:40 IST | **done** | `npm run verify` — 12/12 demo invariants hold |
| 2 · CLEAR surfaces | 20 Aug 07:10 IST | **done** | **Hard gate PASSED** — strip animates, Apply mutates copy and clears the asset |
| 3 · AI Studio agent | 20 Aug 08:45 IST | **prompt ready** | `docs/AI-STUDIO-PROMPT.md` — paste and publish. Still needs the team name |
| 4 · LEDGER + Replay | 20 Aug 08:05 IST | **done** | Replay re-invokes the engine; response pack assembles |
| 5 · Moment Risk + Live Check | 20 Aug 08:30 IST | **done** | Refusal is a labelled composite; Live Check falls back silently |
| 9 · Freeze, deploy, record, slides | — | next | never cut |

**Cut for now** (revisit only if budget allows): WATCH crawl, PULSE, MEMORY, accuracy card.

## Acceptance (`node scripts/acceptance.mjs`, real browser)

17/17 pass, including the four §13 criteria that carry the demos: the strip animating
to 9/2/1, Apply mutating copy and clearing the asset, Replay producing its six assets
from the engine, and Live Check never showing an error.

## Engine facts verified (`npm run verify`)

- Demo A resolves 9 GREEN / 2 AMBER / 1 RED at confidence 0.91 — from the engine, not a fixture.
- Demo C surfaces exactly 6 newly non-compliant assets, ranked by reach, all citing ASCI-AI-M.
- The §11.12 canonical input fires CCPA-100, CCPA-GW-3, CCPA-DP-7 and ASCI-I-1.
- A clean input returns GREEN without inventing findings.
- Zero findings exist without a clause reference, across all 60 assets.

## PRD contradictions found and resolved

| Where | Contradiction | Resolution |
|---|---|---|
| §8.1 vs §11.5 | Ledger substantiates the clinical 72h claim in "EU, UK, AE", but Demo A requires UK **and** DE to return AMBER | Demo screen treated as authoritative; DOS-EU-4471 scoped to AE. Documented in `data/claims.ts` |
| §7.1 vs §7 severity ladder | ASCI-I-1 is `critical` (→ RED), but its own test says wrong-market → AMBER | Severity made outcome-dependent for this rule. A registered claim in the wrong market is a paperwork gap; an unmatched claim is an unsubstantiated assertion |
| §11.7 row 3 | Pond's listed as "no label", but an unlabelled asset already fails v2026.08 and so can never be *newly* non-compliant | Seeded with a first-3s label, which is what actually transitions |
| §11.7 row 4 | Sunsilk is a static, and "label for the full duration" is meaningless without a duration | ASCI-AI-M given a prominence arm: below-fold labels fail the tightened rule |
| §8.1 vs §11.4/§11.5 | Both demo screens offer "72h freshness" as the fix for UK and DE, but the ledger does not register it in either | Registered in UK/DE. It is a consumer-panel descriptive claim, not a clinical one, and a fix that resolves to nothing is worse than no fix |
