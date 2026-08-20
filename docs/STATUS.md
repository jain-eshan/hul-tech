# Build status

One line per phase. This is the handoff if a session or usage limit resets mid-build.

| Phase | Wall-clock | State | Notes |
|---|---|---|---|
| Planning | 20 Aug 04:15 IST | done | Design decisions taken, see DECISIONS.md |
| 0 · Contract freeze | 20 Aug 05:00 IST | **done** | types, 47 rules, 25 claims, 60 assets. Typecheck clean |
| 1 · Decision engine | 20 Aug 05:40 IST | **done** | `npm run verify` — 12/12 demo invariants hold |
| 2 · CLEAR surfaces | 20 Aug 07:10 IST | **done** | **Hard gate PASSED** — strip animates, Apply mutates copy and clears the asset |
| 3 · AI Studio agent | 20 Aug 11:40 IST | **ready to publish** | Team **Apex**. Agent name `Techtonic_Apex_PRAMAAN`. Paste `docs/AI-STUDIO-SYSTEM-INSTRUCTIONS.txt`, follow `docs/AI-STUDIO-AGENT.md` |
| 4 · LEDGER + Replay | 20 Aug 08:05 IST | **done** | Replay re-invokes the engine; response pack assembles |
| 5 · Moment Risk + Live Check | 20 Aug 08:30 IST | **done** | Refusal is a labelled composite; Live Check falls back silently |
| 9 · Freeze, deploy, record, slides | — | next | never cut |

| 6 · T0 completion | 20 Aug 10:30 IST | **done** | Ring 0, accuracy card, evidence snapshot, creator sweep |
| 7 · Spec details | 20 Aug 10:30 IST | **done** | Keyboard map, bounding boxes, progressive disclosure |
| 8 · Standalone build | 20 Aug 12:10 IST | **done** | Whole app as one self-contained HTML file; hosted as an Artifact |
| 9 · Engine abstention | 20 Aug 13:20 IST | **done** | ASCI-IV-2 evaluated; abstains on ambiguity instead of guessing |
| 10 · Persona QA pass | 20 Aug 14:00 IST | **done** | Seven issues found by walking as each role, all fixed |
| 11 · Guided walkthrough | 20 Aug 15:00 IST | **done** | 16-step self-driving tour behind a top-right button |

**Still cut**: PULSE (portfolio exposure), MEMORY (precedent search), marketplace monitoring.
WATCH now exists as Creator Sweep with a real capture pipeline over local fixtures.

## Persona audit (PRD §11.2, §3.2)

Four defects found and fixed:

| # | Defect | Fix |
|---|---|---|
| 1 | **Brand Director's actions were logged as the ABM** in the append-only ledger | Each persona declares its own approver name. An audit trail naming the wrong approver is worse than none |
| 2 | `canShip` was defined but never called — Ship was enabled for every persona | Ship is gated. Legal clears; it does not publish (§14.2) |
| 3 | §11.2 requires switching to change "visible columns AND available actions" — only actions changed | Legal sees routing and severity; Director sees reach and spend |
| 4 | Brand Director was a functional clone of Legal, with none of §3.2's distinct capabilities | Director owns routing thresholds and the exposure columns |

## Accuracy card — measured, with its limits stated

precision 1.00 · recall 1.00 · high-severity recall 1.00 · false-positive rate 0% over 30 cases.

Writing the labels **before** measuring found three real engine defects:

| Defect | Consequence had it shipped |
|---|---|
| `\d{4,}` did not match across a thousands separator | "23,800 strands" — the exact pattern ASCI named in FY25-26 — evaded the manufactured-precision test |
| Price and offer phrases were resolved against the product claims ledger | "only 3 left" reported as an unsubstantiated product claim on top of the correct dark-pattern finding |
| Free-text extraction defaulted unknown phrases to "tagline" | Retired claims like "Fairness guaranteed" were treated as non-objective and never checked at all |

One **label** was also wrong and is corrected in place with the reasoning recorded, because
silently retuning labels to match an engine is how an accuracy card becomes worthless.

## Verification — 98 checks across five suites, all passing

| Suite | Command | Checks | Guards |
|---|---|---|---|
| Engine invariants | `npm run verify` | 12 | Demo A resolves 9/2/1 and Demo C surfaces six, from the engine |
| Acceptance | `node scripts/acceptance.mjs` | 51 | Every §13 criterion, driven in a real browser |
| Offline | `node scripts/offline-check.mjs` | 12 | Full walkthrough with the network down |
| Standalone | `npm run verify:standalone` | 16 | The single-file build over `file://`, all requests aborted |
| Guided tour | `npm run verify:tour` | 7 | All 16 steps advance; no card covers its target or lands off-screen |

`npm run qa` sweeps every route as every persona and reports issues rather than
assertions. Currently zero.

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
