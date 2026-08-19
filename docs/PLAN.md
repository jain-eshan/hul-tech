# PRAMAAN — Execution Plan

Derived from `PRAMAAN PRD v1.0`. This document plans **only the build**: what gets
made, in what order, by whom, and what gets cut when time or model budget runs out.
The PRD remains the single source of truth for *content* (rules, claims, copy, lines).

---

## 0. The situation, stated plainly

| | |
|---|---|
| Now | **20 Aug 2026, ~04:15 IST** |
| Submission | **20 Aug 2026** (PRD §10.4 schedule runs T-24 → T-0) |
| Working time remaining | **~18–20 hours**, one of which must be sleep-adjacent |
| Repo state | **Empty.** No commits, no scaffold, no `package.json` |
| Deliverables | (1) Vercel web app, (2) published AI Studio agent, (3) 3-slide PPT |

**Consequence.** The PRD's §10.3 track table assumes ~6 parallel humans. We do not
have that. This plan converts 8 parallel tracks into **one serial critical path with
a pre-agreed cut ladder**, so that whatever the clock does, the three demos survive.

⚠️ PRD §18.1 item 5 flags an unresolved deadline reconciliation (rulebook says
20 Aug; launch session said top-5 announced 25 Aug). **Confirm the real cutoff before
trusting any buffer.** This plan assumes the earlier date.

---

## 1. What "done" means — ranked, not listed

Everything below the line dies without discussion if the clock demands it.

| Rank | Must exist | Why it is above the line |
|---|---|---|
| 1 | **Demo A** — Batch Review, 12 chips animate to 9/2/1, each clause-cited | The walkthrough opens here (§15.3). No Demo A, no pitch |
| 2 | **Asset Detail + `Apply` mutating copy → GREEN** | "This single interaction sells the product" (§11.4) |
| 3 | **AI Studio agent, published, incognito-verified** | Explicitly demanded by the rulebook. Costs no code |
| 4 | **Demo C** — Rule Replay re-invoking the real `evaluate()` | The POD nobody ships (§4.3) |
| 5 | **Demo B** — Moment Risk refusal, 4 reasoning cards | "The most important 40 seconds" (§15.3) |
| 6 | **3-slide PPT** | The graded artefact. Cannot be cut |
| — | — line — | — |
| 7 | Live Check `/api/check` with silent fallback | Nice; the AI Studio agent already covers "try it yourself" |
| 8 | Ring 0 `/api/constrain` + split-screen | 90 min of work, top-3 POD — cheap, so it stays if at all possible |
| 9 | Accuracy card | Cheapest credibility moat, but needs 30 hand-labels |
| 10 | WATCH thin crawl (8–10 URLs) | Upgrades "always-on" from claim to fact |
| 11 | PULSE heat map, MEMORY precedent search | Labelled illustrative. Context, not proof |

---

## 2. Serial critical path

Wall-clock estimates assume one operator driving Claude, not a team.

### Phase 0 · Contract freeze — 60–90 min · **blocks everything**

Nothing parallelises until this lands and is committed.

```
package.json / next.config / tailwind / shadcn init
/lib/types.ts       Rule, ApprovedClaim, Finding, Asset, Verdict, ConstraintPack, Observation
/lib/engine/index.ts  evaluate(asset, market) -> Verdict     [typed stub, throws]
/data/rules.ts      ~40 rules  (PRD §7 — verbatim from the PRD, no invention)
/data/claims.ts     ~25 claims (PRD §8)
/data/assets.ts     ~60 assets (12 Rexona §11.5 + 48 portfolio for replay)
```

`/data/labelled.ts` (30 hand-labelled) is deferred to Phase 6 — it is only needed
by the accuracy card, which is rank 9.

**Rule:** every later phase imports from these files and never edits them.

### Phase 1 · Decision engine — 2 h

- `/lib/engine/deterministic.ts` — the 13 validators listed in PRD §7.10, pure code, no LLM.
- Claims-ledger match: fuzzy-normalise → exact-score → below threshold = unmatched, never guessed.
- Aggregation → `{status, confidence, findings[], routing}` per §6/A9.
- **Enforced invariant:** `Finding` requires a non-optional `ruleId`. Make it a
  TypeScript required field *and* a runtime assert in the aggregator, so §13's
  "zero findings without a clause reference" is structurally true, not tested for.

### Phase 2 · CLEAR surfaces — 3 h · **HARD GATE**

Shell + sidebar (§11.2) → Inbox (§11.3) → Asset Detail (§11.4) → Batch Review (§11.5).

> **Gate, T-16 in PRD terms:** market strip animating **and** `Apply` mutating copy.
> If this is not true when the gate arrives, phases 7–9 below are cancelled outright
> and their time is redeployed here. This is the PRD's own instruction (§10.4).

### Phase 3 · AI Studio agent — 45 min · **do this early, not last**

Pure prompt work (§12), no repo code, minimal model spend. Publishing and link-sharing
is what "has killed more competition demos than any bug" (§12.2) — so it gets done while
there is still time to fix a sharing problem.

- Assemble system instructions in §12.1's order; rule pack + claims ledger inline.
- Three few-shot examples (GREEN / AMBER-with-rewrite / RED-no-fix) — these matter most.
- Test against §11.12's canonical input, a clean input, and an ambiguous input.
- Save as `Techtonic_<TeamName>_PRAMAAN`, share "anyone with the link", **open incognito**.

### Phase 4 · LEDGER + Replay — 2 h

Append-only audit table, rule-set version hashing, and Replay (§11.7) that genuinely
re-invokes `evaluate()` over `/data/assets.ts`. Reuses cached extraction — the same
architectural point the PRD makes in §5.5(7).

### Phase 5 · Moment Risk + Live Check — 1.5 h

Moment Risk (§11.6) is a narrative screen — its value is the reasoning text, not logic.
Live Check (§11.12) needs the 12s timeout and **silent** deterministic fallback.

### Phase 6 · Ring 0 + accuracy card — 1.5 h

`/api/constrain` returning a constraint pack keyed `(brand, sku, market, rule_version)`,
plus a split-screen render. Accuracy card computed over `/data/labelled.ts`.

### Phase 7 · WATCH thin — 1 h · *first to be cut*

Playwright over 8–10 public URLs → PNG + DOM + hash. Creator Sweep table (§11.9).

### Phase 8 · PULSE + MEMORY — 1 h · *second to be cut*

Heat map, expiry radar, precedent search. Visibly labelled "Illustrative data."

### Phase 9 · Freeze, deploy, record, slides — 3 h · **never cut**

Integration freeze (one person owns click-through, nobody else touches main) → Vercel
deploy → **record all three demos before anyone is tired** → 3 slides + QR codes →
two dry runs → submit with buffer.

---

## 3. The cut ladder

Read top-down when the clock or the budget bites. Do not improvise cuts.

1. Phase 8 (PULSE + MEMORY) → replace nav entries with a labelled "Roadmap" placeholder.
2. Phase 7 (WATCH) → keep the Creator Sweep table with a **pre-captured** snapshot PNG;
   say aloud it is pre-captured. Honesty is cheaper than a live crawl.
3. Accuracy card → cut the screen, keep the *claim* off the slide entirely.
4. Live Check → the AI Studio agent is the "try it yourself" artefact; the web one is a duplicate.
5. Ring 0 → keep only if ≥90 min remain; it is a top-3 POD, so cut it last of the optionals.
6. **Never cut:** Demo A, Demo B, Demo C, the AI Studio link, the slides, the recordings.

---

## 4. Model-budget policy (daily + weekly limits)

The binding constraint on this build is not wall-clock alone — it is Claude usage.
Debugging loops, not authoring, are what exhaust a weekly limit.

**Spend profile.** Roughly two-thirds of total output tokens land in two places:
`/data/*` authoring (Phase 0, one-shot, ~15–20k output tokens) and React screen
generation (Phases 2–8). Both are predictable. The unpredictable cost is iterative
debugging, which is where a budget dies.

**Rules of engagement**

| # | Rule | Reason |
|---|---|---|
| 1 | **One file per turn.** Write it completely, first time | Re-generating a 400-line data file twice is the single most wasteful thing available |
| 2 | **Never re-read a file just written** | The harness already tracks it |
| 3 | **No subagent fleets, no workflows, no parallel Explore sweeps** | A 6-agent fan-out on a 60-file repo costs more than the repo |
| 4 | **Commit after every phase**, push at every gate | Context loss after a limit reset must not cost work |
| 5 | **Batch acceptance checks** into one pass at Phase 9, not after each screen | Each verification round is a full context re-read |
| 6 | **Reserve ~25% of the remaining budget for Phase 9** | Deploy + recording + slides cannot be cut, so they must be funded first |
| 7 | If a bug takes **3 attempts**, stub it and move on; revisit only if Phase 9 has slack | Debug spirals are where weekly limits actually go |
| 8 | Route mechanical screen work to a smaller model where the option exists; keep the strongest model for the engine, the aggregator invariant, and the §12 system prompt | The prompt and the engine are where quality is load-bearing |

**Checkpoint discipline.** At the end of each phase, record one line in `docs/STATUS.md`:
phase, wall-clock, commit SHA, and what is unfinished. If a limit resets mid-build,
that file is the handoff.

---

## 5. Verification gates (from PRD §13)

Run as a two-person checklist at Phase 9 — one driving, one watching. Not earlier;
batching these is a budget decision.

**Structural, checked once by grep rather than by eye**
- No code path can emit a finding without a `ruleId`.
- Every rule in `/data/rules.ts` carries a `sourceUrl`.
- Draft-status rules (`ASCI-AI-*`) render a visible "draft" tag.
- No verbatim statutory text anywhere in the UI.
- Prototype/illustrative footer present on every page.

**Resilience**
- Full walkthrough works **with wifi off**, except Live Check.
- AI Studio link opens for a signed-out user in incognito.
- Screen recordings of Demos A, B, C exist as backup **before** the deploy is trusted.

---

## 6. Open decisions — blocking (see §7 for the design gaps behind these)

These cannot be inferred from the PRD and must be answered before the phase that needs them:

| # | Decision | Needed by | Default if no answer |
|---|---|---|---|
| 1 | Team name for `Techtonic_<TeamName>_PRAMAAN` | Phase 3 | — blocks publish |
| 2 | The Moment Risk scenario — *which* cultural moment | Phase 5 | A fictional, clearly-labelled composite |
| 3 | Brand imagery treatment (real logos vs CSS-mocked frames) | Phase 2 | CSS-mocked, no third-party marks |
| 4 | The 8–10 URLs for the WATCH crawl | Phase 7 | Cut Phase 7 |
| 5 | Who hand-labels the 30 accuracy-card assets | Phase 6 | Cut the accuracy card |

