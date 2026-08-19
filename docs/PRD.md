# PRAMAAN — Product Requirements Document

**Always-on AI brand governance for Hindustan Unilever**
Project NEXT · TechTonic Season 8 · Version 1.0

*PRAMAAN* (प्रमाण) — Sanskrit: *proof, evidence, valid means of knowledge*.
**"Proof at the speed of publish."**

---

## Document control

| | |
|---|---|
| **Status** | Build-ready. MVP scope frozen. |
| **Audience** | Engineering (build), judging panel (Slide 3 source), team (single source of truth) |
| **Submission** | Stage 1 — 3-slide PPT + working prototype, 20 Aug 2026 |
| **Prototype links** | Vercel web app + Google AI Studio published agent (both required) |
| **Owner** | PM |

**How to use this document**

- §1–§4 → the deck. Business case, users, prioritisation rationale.
- §5–§9 → the build. Architecture, complete feature set, rule pack, claims ledger, data model.
- §10–§13 → the prototype. Scope, screens, AI Studio agent, acceptance criteria.
- §14–§17 → the roadmap slide. Cost, metrics, risk, governance.
- §18 → read before writing any slide. Verification and do-not-assert list.

**Honesty protocol.** Every claim in this document is tagged where sourcing is weak. Regulatory rule text is *paraphrased for machine execution* and must never be presented as verbatim statutory language. Prototype data is seeded unless explicitly marked real. A judge who catches an overclaim discounts everything else.

---

# PART I — WHY

## §1 Business objectives

### 1.1 The one-line thesis

> Unilever taught its brand teams to generate 400 assets where they used to make 20, in 21 markets, with 300,000 influencers, for content that lives four days. It did not teach them to clear it. **Brand DNAi governs what the AI reads. PRAMAAN governs what the world sees.**

### 1.2 Primary objective

**Convert stranded content-AI investment into shipped content.**

This is a Theory of Constraints argument and it is the strongest one available. Every asset Sketch Pro, Beauty AI Studio and Pencil Pro produce is worth zero until cleared. Unilever has purchased ~7x generation capacity and retained ~1x clearance capacity. The constraint has moved from *making* to *clearing*. PRAMAAN is what makes the existing AI investment shippable.

### 1.3 Secondary objectives

| # | Objective | Mechanism | Measured by |
|---|---|---|---|
| **O1** | Collapse time-to-clearance | Rule-check moves to the drafting moment | Median clearance time: days → <90s automated |
| **O2** | Convert review labour into judgment labour | Deterministic checks machined; humans keep judgment | Reviewer effort −40%; % of reviewer time on mechanical checks |
| **O3** | Make portfolio risk visible for the first time | Compliance-rate telemetry that does not exist today | First-pass clearance rate; in-market drift rate |
| **O4** | Survive a rule change without a fire drill | Versioned rule graph + portfolio replay | Rule-change remediation time: weeks → <24h |
| **O5** | Close the influencer surface | Sweep against enrolled creator roster from Sangam | Creator disclosure compliance >95% |
| **O6** | Produce regulator-grade evidence on demand | Append-only ledger + point-in-time snapshots | Time to assemble a regulator response pack |

### 1.4 Explicit non-objectives

Stating these prevents scope creep and demonstrates prioritisation discipline to the panel.

| Not doing | Because |
|---|---|
| Creative generation | Sketch Pro, Beauty AI Studio, Digital Twins already lead. Pitching this is the exact trap the panel warned about. |
| Influencer selection | Sangam does it — 50k roster, millions of variables optimised monthly. |
| Demand sensing / trend detection | Phoenix.ai — 50,000 micro-markets. |
| A new DAM | Frontify/Bynder category. PRAMAAN reads from whatever is in place. |
| Horizontal enterprise search | M365 Copilot exists. PRAMAAN indexes the corpus Copilot has nothing to index. |
| GEO / AI-search visibility optimisation | That is growth. PRAMAAN takes integrity only. |
| Removing any approver | PRAMAAN removes unnecessary *approvals*, never approvers. Legal retains absolute veto. |

### 1.5 Success metrics

| Metric | Baseline today | Target | Source of target |
|---|---|---|---|
| First-pass clearance rate | **Unmeasured** | 80% | Vodori benchmark (vendor-published) |
| Time to clearance | Days to weeks | <90s automated; <24h with human | Product NFR |
| Reviewer effort | 100% | −40% | Indegene, measured at a Top-10 pharma after one year |
| Assets cleared per reviewer-hour | 1x | 10x | Derived |
| In-market drift rate | **Unmeasured — PRAMAAN creates this metric** | <2% | Product target |
| Creator disclosure compliance | ASCI: 97.3% of influencer ads required modification | >95% compliant | Product target |
| High-severity escapes | Unknown | **Zero** | Non-negotiable |
| Rule-change remediation time | Weeks | <24h | Replay capability |

> **The metric argument worth a slide:** no credible public benchmark for brand-compliance failure rates exists anywhere. That absence *is* the argument. You cannot manage what nobody measures. PRAMAAN emits the number that makes the problem visible — and numbers get managed.

---

## §2 Problem statement

### 2.1 The mechanical problem

Copy is authored at the *start* of the chain by people who do not hold the current rule set. The only people who know the current rules sit at the *end* of it. **The first contact between an asset and the rules happens in review.** That structurally guarantees rounds of amends.

Pharma quantifies this precisely because it is the only industry publishing telemetry on review cycles: **~11.6 of 29.9 US days elapse before review even begins** (Veeva Pulse, derived from PromoMats workflow logs). Prep, annotation and submission packaging consume ~40% of the cycle before a reviewer looks at anything.

The practitioner-prescribed cure is identical to the product thesis, stated unprompted on r/marketing: get the rules to the drafting stage and *"sign-off was usually same day."*

### 2.2 The scale problem

| Fact | Source |
|---|---|
| 20 assets per campaign → 400 per product | Selina Sykes, Global VP Marketing Transformation B&W (Digiday, Jul 2025) |
| 7x asset volume in one year for B&W | Fernando Fernandez, CAGNY, Feb 2026 |
| 300,000 influencers; B&W creators 75k → 180k in a year | Same |
| Social video lifespan: **four days** | Same |
| Sketch Pro: concept → consumer-testable in **2 hours**, expanding to 21 markets | Marketing Dive, Jul 2025 |
| *"There are 19,000 zip codes in India… I want one influencer in each of them"* | Fernandez, The Drum, Mar 2025 |
| 58% of marketers spend >40% of time managing reviews; 89% face ≥3 approval stages | Adobe, Jun 2025, n=1,600+ [VENDOR] |
| **91% of marketing teams use AI to create; 26% use AI to govern** | Jasper 2026 [VENDOR, sample skew — use direction, not precision] |

Generation scaled ~20x. Review remained human, serial and flat.

### 2.3 The asymmetry problem

The regulator automated first.

| ASCI | FY23-24 | FY24-25 | FY25-26 |
|---|---|---|---|
| Complaints | 10,093 | 9,599 | **11,581 (+21%)** |
| Ads scrutinised | 8,229 | 7,199 | **9,841 (+37%)** |
| **Required modification** | **98%** | **98%** | **98%** |
| Caught by ASCI's own proactive AI monitoring | 88% | 89% | **93%** |
| Digital share of violations | 85% | 94.4% | **97.3%** |

**Beauty & Personal Care, FY25-26:** 639 cases, **90% required modification**, **45% influencer-led**. Named violation patterns sit squarely in HUL's claim space — *"dandruff gone in 1 wash," "11.7x stronger hair," "220% plaque reduction," "hair growth of 23,800 strands."*

**Influencers:** 1,609 ads processed, **97.3% required modification**; 54% promoted categories disallowed by law. Compliance among Forbes India Top 100 Digital Stars *worsened* — 76% in contravention (2025) vs 69% (2024). This is content the brand never wrote, never saw, and is liable for.

**The line for the slide:** *The regulator has the agent. The advertiser does not.*

And the regulator is asking for exactly this product:

> *"The 2025–26 data reveals a digital advertising ecosystem being driven by a dangerous 'speed-first, compliance-later' culture… The findings point to the urgent need for a systemic shift from reactive correction to preventive governance. Stronger pre-publication guardrails… are critical."*
> — Manisha Kapoor, CEO & Secretary General, ASCI, FY2025-26 Annual Complaints Report

### 2.4 The velocity asymmetry — India-specific

Sign-off takes weeks. Destruction takes hours.

| Case | Elapsed |
|---|---|
| Layer'r Shot (Jun 2022): aired → ASCI suspension → I&B takedown order → FIR | **~48 hours** |
| Dabur Fem (Oct 2021): withdrawn after a single ministerial threat | **Same day** |
| Tanishq (Oct 2020): withdrawn in ~4 days — then attacked *for withdrawing* | **No costless exit** |
| Control case — Manyavar/Mohey (Sep 2021): refused to withdraw, no measurable lasting damage | **The decision problem is pre-publication** |

### 2.5 The regulatory floor is not stable

The single strongest argument for a versioned, re-runnable rule engine.

- **FDA:** >100 warning letters/yr historically → **1 in 2023 → 0 in 2024 → 100+ in Q3 2025 alone.**
- **FSSAI:** rescinded *its own* 2022 and 2024 ORS memos with immediate effect (Oct 2025). **Regulatory permission is not a durable defence.**
- **India SDC mandate:** universal from 18 Jun 2024 → narrowed to food and health advertisers on 3 Jul 2024, leaving **cosmetics in an unresolved grey zone**. HUL's portfolio straddles both.
- **CCPA:** first named dark-patterns enforcement Jun 2026 (PhysicsWallah ₹5L, McAfee India ₹1L). Small fines, new *category* — advertising governance extended into UX.

**Humans cannot re-read 40,000 live assets on the day a rule changes. That is the capability gap.**

### 2.6 The pre-testing gap

Conventional copy-testing structurally cannot measure this risk class.

- **Google "Dear Sydney"** (Olympics, Aug 2024) — pulled 2 Aug. Google's own words: *"While the ad tested well before airing…"*
- **Coca-Cola AI Christmas ad** (Nov 2024) — **System1 scored it a perfect 5.9 in both US and UK.** Then a boycott campaign.
- **IAB/Sonata (Jan 2026):** 82% of ad execs believe Gen Z feels positive about AI ads. **45% actually do.** A 37-point perception gap, widened from 32.

**Standard copy-testing scored it 5.9/5.9. The internet scored it a boycott.** That gap is uncovered by any existing tool.

### 2.7 HUL's self-created exposure

- **Dove pledged, 9 April 2024, never to use AI to represent real women** in its advertising — *"women get to decide and declare what real beauty looks like, not algorithms."* Dove is simultaneously a named brand inside the Beauty AI Studio and digital-twins pipelines across 21 markets.
- **Brand DNAi governs inputs.** *"…ensures AI models source information only from a data pool of approved brand voices, values, strategies and visual identities."*
- **Nothing governs outputs.**

> ⚠️ **Honesty guardrail — non-negotiable.** No HUL India campaign was found withdrawn after public backlash 2020–2026, and no headline ASCI complaint was found upheld against a named HUL brand. **Never claim damage that has not happened.** The accurate and still-powerful framing: *"HUL has been lucky, and it sits in India's worst-performing ASCI category."*

### 2.8 Why the brand manager cares (reframe — critical)

Nobody has ever asked for a compliance tool. Priya does not experience "a compliance gap." She experiences: *"Sketch Pro just gave me 400 variants. I have a four-day window. I cannot ship any of them until someone I don't control tells me I can."*

**Compliance is the mechanism. Velocity is the product.** Every UI label, slide headline and demo line uses the right-hand column:

| What it does | What it sells |
|---|---|
| Clears assets against regulation | **Ship 80% without asking permission** |
| Cites the clause | **Win the argument with legal in one message, not three rounds** |
| Flags claim gaps at draft time | **Never get a deck returned on day 9** |
| Monitors influencers | **Find out from us, not from ASCI** |
| Suggests compliant rewrites | **Keep the idea, change four words** |

The moment the product says "compliance dashboard," it becomes a support function.

---

## §3 Users

### 3.1 Primary — Priya Sharma, Assistant Brand Manager, Personal Care, HUL Mumbai

**Why the ABM and not the CMO:** Unilever's own job descriptions make the ABM the keeper of the guardrails.

> *"Maintain Claims Dossiers outlining guidance on key claims and guardrails for the rest of the marketing team"*
> — Unilever Senior ABM (Seventh Generation), Job ID R-64723, posted 8 Apr 2025

Unilever also runs a named counterparty function — **"Claims & Technical Insights"** (ABM Cross-Category, R-1179563) that the brand manager must route through. **A named queue is a named bottleneck.**

CPG Camp's practitioner map lists **23 cross-functional partners**; Legal is #18, Regulatory is #19 — *and neither appears anywhere in their illustrative day.* The work is high-frequency, high-consequence, and structurally invisible in how the role is defined, staffed and rewarded.

| | Today | With PRAMAAN |
|---|---|---|
| Context | 3 brands × 6 formats × 4 languages. Double-booked; *"fire drills interrupting fire drills"* | Same volume, cleared inline |
| Rule knowledge | Does not know the current ASCI position on comparative superiority | Rules arrive at the moment of drafting |
| Discovery of a problem | Legal returns the deck on day 9 | 90 seconds, with the clause cited and a rewrite offered |
| Legal's queue | 40 assets, untriaged | 4 flagged assets |

**Additional structural fact:** ABMs rotate every 12–18 months (ULIP is a 15-month stint). Institutional claim memory leaves with them. This is the justification for MEMORY (Agent E).

### 3.2 Secondary personas

| Persona | Today | With PRAMAAN | Key permission |
|---|---|---|---|
| **Legal / Regulatory Counsel** | Queue of everything, no triage, reviewing spelling | Queue of judgment calls only | **Absolute veto. Authors rules once, enforced everywhere** |
| **Claims & Technical Insights** | Answers the same substantiation question 40 times | Publishes dossier once into the Claims Ledger | Owns claim status and expiry |
| **Brand Director / VP** | Signs off on everything uniformly | Signs off by consequence; sees portfolio exposure | Sets routing thresholds |
| **Agency / creator** | Guesses, gets rejected, reworks | Pre-flight in the brief; ships first-time-right | Receives plain-language fix requests |
| **GDT / AI Assurance** | Manual assurance reviews | Automated evidence trail | Reads LEDGER; owns model governance |

### 3.3 Where PRAMAAN sits in the brand lifecycle

| # | Stage | HUL's existing AI | PRAMAAN's role | Depth |
|---|---|---|---|---|
| 1 | Trend & insight | Sangam, social listening, 25k consumer-connect repository | **Moment Risk pre-read** — is this moment safe to touch, per market? | Medium |
| 2 | Innovation / concept | Digital R&D, AI Innovation Centre | Claim feasibility at concept — *can we even say this in India?* | Light |
| 3 | Claims development | Claims & Technical Insights | **Claims Ledger is the system of record** | **Deep** |
| 4 | Creative production | Sketch Pro, Beauty AI Studio, Digital Twins, Brand DNAi | **Ring 0 constrain + CLEAR at export** | **Deep — hero integration** |
| 5 | Media & influencer | Sangam (50k roster) | Brief-time guardrails + post-publication sweep | **Deep** |
| 6 | Approval & governance | Maker-checker, AI Assurance | **This is the product** | **Deepest** |
| 7 | Activation & localisation | Per-platform adapts (Nykaa vs Blinkit) | Per-market rule packs | **Deep** |
| 8 | In-market | Phoenix.ai, digital shelf analytics | **WATCH** — drift, breach, relisting, ignition | **Deep** |
| 9 | Scale / kill | Annual portfolio review | **PULSE** — exposure, expiry radar, systemic patterns | Medium |

**Slide line:** *PRAMAAN does not own a lifecycle stage. It is a horizontal layer touching nine — which is exactly why it is the constraint.*

---

## §4 Competitive position

### 4.1 The whitespace, stated precisely

> **No product anywhere clears advertising claims across multiple jurisdictions, multiple formats and multiple languages for a multi-brand CPG portfolio. The capital is in banking and pharma. The exposure is in personal care.**

| Reference | What it proves | Why PRAMAAN ≠ it |
|---|---|---|
| **Veeva Vault PromoMats + Falcon MLR** (launched 23 Jun 2026) | A regulated industry proved agentic pre-clearance works at enterprise scale. Targets *"70%+ of manual MLR labor eliminated within five years"* | Pharma only. Reviews against drug labels/SmPCs, not ad codes. No in-market surveillance. No cultural risk. |
| **Haast** ($12M Series A, Apr 2026, Peak XV) | Always-on monitoring of live assets *"including partners, influencers, and anyone linked to your brand"* is funded and working | Financial services only. No pre-flight clearance. No substantiation. |
| **Norm Ai** ($120M Series C @ $1.2B, Jul 2026) | "Regulation as code" is a venture-validated $1bn+ thesis | FS/regulatory filings. Not creative assets, not multimodal. |
| **Certo** ($4M seed, May 2026) | The only CPG-facing regulatory AI. Beauty/CPG, 70+ markets | Formula, ingredient and **label** compliance — **not advertising claims**. India not in named markets. |
| **affil.ai** (YC S24) | Always-on crawling + point-in-time evidence capture works | Affiliate/financial. Third-party content only. |
| **LabelBlind** (Mumbai, $500K seed Nov 2025) | AI regulatory validation vs FSSAI + 22 country rulesets — **and HUL is already a customer** | Food labels only. **Propose as partner, not competitor.** |

> ⚠️ Could not verify any dedicated ad-compliance module in WPP Open, Publicis CoreAI or Accenture Song. State as "could not verify," never as "does not exist."

### 4.2 The moat — three layers

| Layer | What it is | Why defensible | Time to build |
|---|---|---|---|
| **1 · Distribution** | Ring 0 — clearance as a tool call *inside Sketch Pro's generation loop* | Once clearance is a step in generation, removing it means rebuilding the generation pipeline | Months |
| **2 · The Claims Ledger** | HUL's substantiation dossiers mapped to claim × market × evidence grade × expiry | **This reference standard does not exist today at any CPG.** Pharma has an approved label; CPG has nothing. Building it *is* the product | 1–2 years |
| **3 · The Precedent Store** | Every verdict, objection, override and outcome, compounding | A competitor can buy the model. **They cannot buy HUL's adjudication history.** Year 1 thin; year 3 unreplicable | Compounds forever |

**One-line moat statement:** *A foundation model is buyable. HUL's claims dossiers and its adjudication history are not. We are not building an AI product — we are building the asset that makes AI decisions defensible, and it only exists if you build it.*

**The reinforcing loop (draw this):**

```
more assets cleared → richer Claims Ledger → higher auto-clear rate
      ↑                                              ↓
 deeper embedding  ←  faster shipping  ←  fewer human escalations
      ↓
 more precedent → better judgment → more trust → wider mandate
```

### 4.3 Points of differentiation — lead with three

| POD | Why unique | Proof it matters |
|---|---|---|
| **1 · Rule-Change Replay (C3)** | **Nobody ships this** — not Veeva, Norm Ai, Haast or Certo | FDA 0 → 100+ letters in a quarter; FSSAI rescinded its own memos overnight |
| **2 · Moment Risk refusal (A7)** | Copy-testing structurally cannot do this | "Dear Sydney" *tested well* and was pulled; Coke scored **5.9/5.9** and drew a boycott |
| **3 · Ring 0 constrain-at-generation** | Everyone else checks *after*. We constrain *during* | As generation goes agentic, the caller is another agent |
| 4 · Precedent Engine (E1–E5) | No CPG has institutional claim memory | ABMs rotate every 12–18 months |
| 5 · Multi-jurisdiction *advertising* engine | Certo does labels; Veeva does drug labels; nobody compiles ad codes across markets | One concept ships into 21 markets |
| 6 · CPG + India coverage | All funded players are FS or pharma; Certo excludes India | Personal Care is India's #1 violative category |

**On stage, lead with replay, refusal, constrain.** They answer the three objections: *"isn't this a faster reviewer?"*, *"isn't this plumbing?"*, *"why now?"*

### 4.4 Points of parity — good enough, never good

**Discipline rule: every hour spent polishing a POP is an hour stolen from a POD.**

Multimodal extraction · rule engine with clause citation · compliant rewrite · crawling & monitoring · audit trail · approval routing · dashboards · DAM integrations.

**Say in Q&A:** *"Half this product is table stakes. We built the table stakes so the three things nobody has could exist on top of them."*

### 4.5 The five objections, pre-answered

| Objection | Answer |
|---|---|
| **"We already have Brand DNAi."** | Brand DNAi is an **input** guardrail — it constrains what the model reads. It cannot evaluate whether the output is legal in Tamil Nadu, whether the claim is substantiated in the India dossier, or whether an influencer rewrote it after publication. **Different layer, not a duplicate.** Brand DNAi is a *data repository*; PRAMAAN is a *decision service*. |
| **"Isn't this just plumbing?"** | The pipes exist. What's missing is **judgment**. Demo B — the agent refusing a tempting moment with market-specific reasoning — is the proof. No connector produces that. |
| **"Legal isn't the villain."** | Agreed, and we say so first, in a practitioner's own words: *"The legal team don't slow us down, they reduce the risk of us getting sued… They aren't the enemy."* We remove **no** approver. We move the rule-check to the drafting moment so legal reviews judgment calls, not spelling. |
| **"Can we trust it?"** | Three structural answers: (1) deterministic checks never touch an LLM; (2) every verdict cites a clause and is falsifiable; (3) we publish an **accuracy card** with measured precision/recall and abstain below a confidence floor. Precedent: Veeva's agent *"catches an average of 1.3 additional compliance gaps per already-approved page"* — AI finds defects humans already signed off. |
| **"Why not buy it?"** | Nothing exists for CPG advertising claims. Buy LabelBlind for FSSAI depth; build the rest, because the moat is HUL's own claims dossiers and adjudication history — proprietary data no vendor can replicate. |

---

# PART II — WHAT

## §5 Architecture

### 5.1 The four enforcement rings

Defence in depth. The earlier the ring, the cheaper the fix.

| Ring | Where | What happens | Cost of fix |
|---|---|---|---|
| **0 · Constrain** | Inside the generation agent (Sketch Pro / Beauty AI Studio) | Market claim constraints injected into the generation prompt. **Non-compliant variants are never generated.** | ~zero |
| **1 · Inline** | As the BM drafts / reviews | Grammarly-style underline, clause cited, one-click fix | seconds |
| **2 · Gate** | At export / publish / handoff | Hard block on RED; AMBER routes to one approver | minutes |
| **3 · Sweep** | After publication, forever | Crawl, snapshot, detect drift and influencer breach | hours–days |

**Ring 0 is the most forward-looking idea in the product.** As generation goes agentic, the caller is increasingly another agent, not a human. Shift-left taken to its logical end: **don't check after generating — constrain generation.**

### 5.2 The six planes

```
┌─ EXPERIENCE PLANE ─────────────────────────────────────────────┐
│  Sketch Pro panel · Beauty AI Studio panel · Web console        │
│  Slack/Teams bot · REST + webhook API · Figma/GenStudio plugin  │
└────────────────────────────────────────────────────────────────┘
┌─ ORCHESTRATION PLANE ──────────────────────────────────────────┐
│  State machine · fan-out to specialist checkers                 │
│  confidence aggregation · abstention gate · routing policy      │
└────────────────────────────────────────────────────────────────┘
┌─ DECISION PLANE ───────────────────────────────────────────────┐
│  DETERMINISTIC (pure code — no LLM)                             │
│    mandatory declarations · disclosure timing · prohibited terms │
│    net-quantity format · asterisk binding · label tier           │
│  JUDGMENT (LLM + retrieval, forced clause citation)              │
│    implied superiority · therapeutic implication · fair balance  │
│    cultural/moment risk · tone & brand register                  │
└────────────────────────────────────────────────────────────────┘
┌─ KNOWLEDGE PLANE (the moat) ───────────────────────────────────┐
│  Rule Graph (versioned) · Claims Ledger · Brand Codex            │
│  Likeness & Entity Registry · Precedent Store                    │
└────────────────────────────────────────────────────────────────┘
┌─ EVIDENCE PLANE ───────────────────────────────────────────────┐
│  Append-only ledger · rule-version hashes · rendered snapshots   │
│  regulator response packs · override log · eval/regression suite │
└────────────────────────────────────────────────────────────────┘
┌─ SURVEILLANCE PLANE ───────────────────────────────────────────┐
│  Scheduled crawlers · platform APIs · LLM probes                 │
│  snapshot pipeline · diff engine · ignition detector             │
└────────────────────────────────────────────────────────────────┘
```

**The critical design decision:** deterministic and judgment checks are **physically separate code paths**. Mechanical checks must never route through an LLM — they would be slower, costlier and non-reproducible. This split is also the best answer to the reliability question, and it is *visible in the demo*: deterministic findings render in <400ms while judgment findings stream in over 2–3s.

### 5.3 Form factor — stated once

**PRAMAAN is a headless decision engine with five surfaces. The primary surface is ambient and inline — Grammarly-style — not a dashboard.**

This is not cosmetic. **The form factor is the thesis.** The whole argument is "move the rule-check to the moment of drafting." If the BM must leave what they are doing, upload a file and wait, **you have rebuilt the queue you set out to kill.** It also directly answers the case brief's own warning: *"The challenge is not simply to build a unified dashboard."*

| Surface | Form | Users | Notes |
|---|---|---|---|
| **1 · Inline Assistant** (hero, ~70% of value) | Embedded panel + inline annotations inside Sketch Pro, Beauty AI Studio, Figma, Adobe GenStudio | BM, agency | Precedent: Saifr ships into Adobe GenStudio and Figma rather than as its own app |
| **2 · Browser Extension** | Activates contextually in DAM, agency review portals, schedulers, Docs/Slides, email | BM, agency | Grammarly's exact model. Dormant until it detects a brand asset or claim text. **Never modal, never blocking at Ring 1** |
| **3 · Background Agent + Push** | No UI to visit. Pushes into Teams/Slack | BM, legal | Fixes the pull-based problem: today a BM must *know to ask*. Nothing pushes a scored, brand-matched alert |
| **4 · Console** | Web app holding PULSE + LEDGER | Legal, regulatory, brand directors, GDT | **Say explicitly: "The dashboard exists — for governance. The brand manager never has to open it. That's the point."** |
| **5 · API / MCP** | REST + webhooks + MCP server | Mirai agents | How PRAMAAN becomes a *stack component*, not an app. `pramaan.constrain()` / `pramaan.clear()` |

### 5.4 Design principles

| # | Principle | Why |
|---|---|---|
| 1 | **Ambient, not destination.** The BM never "goes to" PRAMAAN | If they travel, you rebuilt the queue |
| 2 | **Inline and specific.** Annotate the claim, not the asset | Asset-level scores are unactionable |
| 3 | **Never block at the drafting ring.** Advise early, gate late | Blocking early kills adoption; *"local teams bypass them if it's inconvenient"* |
| 4 | **Every verdict cites a clause** | Enforced in the schema, not the prompt |
| 5 | **Always offer a fix, not just a flag** | Flagging without fixing relocates work |
| 6 | **Override is always available and always logged** | *"Human override authority is non-negotiable"* — and the log is the training signal |
| 7 | **Abstain rather than guess** | Below the confidence floor, escalate. Trust is built by admitting limits |
| 8 | **The dashboard is for governance, not for the BM** | Directly honours the case's own warning |

### 5.5 AI/agent design decisions worth defending on stage

1. **Retrieval, not fine-tuning.** The rule set changes monthly. Fine-tuned weights would be stale on arrival and un-versionable. Retrieval over a versioned Rule Graph means **the rules are data, and data has a version hash.**
2. **Decomposed parallel checks, not one mega-prompt.** Separate specialists for disclosure, substantiation, likeness, tier classification, brand codex, moment risk. Better precision, isolatable failures, independently evaluable.
3. **Forced clause citation as a schema constraint.** Not a prompt instruction — a `NOT NULL` column. Hallucinated findings cannot be persisted.
4. **Model routing by task.** Frontier multimodal for moment risk and implied-claim reasoning; small fast models for extraction and tier classification; **zero LLM** for deterministic checks. This is why inference is ~US$30–60k/yr, not millions.
5. **Precedent store as retrieved few-shot context.** The system inherits HUL's institutional judgment — the proprietary moat a competitor cannot buy.
6. **Abstention over guessing.** An agent that says *"I am not qualified to clear this"* is more trustworthy than one that is confidently wrong.
7. **Cached extraction, re-run decisions.** Replay reuses stored `extracted_claim` rows and re-runs only the decision plane. **This single architectural decision is what makes portfolio replay economically viable.**

---

## §6 Complete feature set — 44 features across 5 agents

Legend: **T0** = MVP prototype (built, demoable) · **T1** = Pilot (12 weeks) · **T2** = Scale India (+6mo) · **T3** = Multi-market (+9mo)

### AGENT A — CLEAR · pre-flight clearance (10 features)

*Asset in → clause-cited verdict out, in under 90 seconds.*

---

#### **A1 · Multimodal Claim Extraction** — T0

**Problem.** A claim hides in body copy, an on-pack shot, a video overlay burnt into frame 47, a voiceover, or a hashtag. Nobody has a machine-readable list of what an asset actually claims. Review begins by *reading* — which is why ~11.6 of pharma's 29.9 days elapse before review even starts.

**Spec.** Vision + OCR + ASR + copy parsing produce normalised claim objects:
`{claim_text, claim_type, quantifier, product_sku, market, channel, surface, frame_ref, bbox}`

Claim types: `performance | comparative | health | nutrition | environmental | testimonial | safety | price_offer | tagline`.

Extraction surfaces, all required: body copy · headline · CTA · on-pack text in image · video overlay text (sampled frames) · voiceover (ASR) · hashtags · alt text · caption.

**Mechanisms borrowed.** Luthor.ai's **decomposed parallel checks** — Disclosures / Testimonials / Fees / Citations / PII run as separate specialised passes rather than one mega-prompt. affil.ai's **hidden-content extraction** — render the page, trigger drop-downs and carousels, OCR video overlays, *because disclosures hide there*.

**HUL fit.** Sketch Pro exports 400 variants. Extraction must be **batch-native**, not one-at-a-time.

**Acceptance.** Given a video asset with a claim in voiceover only, extraction returns it with a timestamp. Given a static with on-pack text, extraction returns it with a bounding box.

---

#### **A2 · Claims Ledger Match (substantiation lookup)** — T0

**Problem.** *"Clinically proven 72h protection"* is substantiated in the EU dossier and **not** in the India dossier. Priya doesn't know. Legal finds out on day 9. **82% of pharma reviewer time goes to "unsupported claims or missing references"** — the single largest sink.

**Spec.** Every extracted claim is resolved against the approved-claims library, keyed by `claim × product_sku × market × dossier_ref × evidence_grade × valid_from × expires_on`.

Three outcomes:
| Outcome | Verdict contribution | Action offered |
|---|---|---|
| **Matched** | GREEN | Cite dossier ref inline |
| **Matched but wrong market** | AMBER | Offer the market-compliant variant **and** the "attach study" path |
| **Unmatched** | RED | Block; route to Claims & Technical Insights with a pre-filled request |

Matching is fuzzy-normalised (case, punctuation, stemming, numeric equivalence) then exact-scored; anything below threshold is treated as unmatched, never guessed.

**Mechanism borrowed.** Veeva's **claims auto-linking** and — the important one — **claims harvesting**: the approved-claims library *self-grows from reviewer decisions*. Without harvesting the library rots and the product dies in year two.

**HUL fit.** This formalises the Claims Dossier that Unilever's own ABM job description already makes a human accountability. **You are not inventing a process — you are giving an existing one a machine-readable spine.**

---

#### **A3 · Multi-Jurisdiction Regulatory Rule Engine** — T0

**Problem.** ASCI Code + CCPA Misleading Ads 2022 + CCPA Dark Patterns 2023 + CCPA Greenwashing 2024 + FSSAI Advertising & Claims 2018 + Legal Metrology + Drugs & Magic Remedies + IT Amendment Rules 2026 — and abroad, ASA/CAP, FTC Green Guides, EU EmpCo. No brand manager holds this. **And it moves.**

**Spec.** A **versioned Rule Graph**: `regulation → clause → machine-readable test → severity → jurisdiction → effective_from`. Two execution paths (§5.2). Full rule pack in **§7**.

**Every verdict must cite the clause.** A verdict without a clause is unusable in a regulator response — a hard schema constraint, not a nice-to-have.

**Mechanisms borrowed.** Norm Ai's **"regulation as code."** Veeva Falcon's **one upload → 24–35 country rule sets simultaneously**, each finding page-anchored to a source reference. Clearcast × Northell's **explainable ad clearance** — precedents + regulatory clauses + confidence levels.

**HUL fit.** Start with India (ASCI + FSSAI + CCPA + Legal Metrology) — HUL's largest market **and** the world's most proactively policed. Partner with **LabelBlind** for FSSAI depth; HUL already buys from them.

---

#### **A4 · Brand Codex Check** — T1

**Problem.** Brand drift. From r/marketing (Jan 2026): *"We already have solid brand guidelines and a decent library of approved assets, but still see brand drift over time."* And: *"Local teams often bypass them if it's inconvenient."* At 400 assets per product × 21 markets, drift is statistically certain.

**Spec.** Check tone, claim register, visual identity, prohibited associations and **brand-specific pledges** against a codex assembled from Brand DNAi + Unilever Advertising & Marketing Principles + category codes + brand pledges.

Critical field: `binding_level ∈ {pledge, guideline, preference}`. **The Dove Real Beauty commitment is a `pledge`, not a guideline** — it hard-blocks, it does not advise.

**Mechanisms borrowed.** Frontify Brand Assistant — RAGs your own guidelines and **links every answer back to the guideline section**. Adobe Brand Intelligence — brand ontology + knowledge graph producing a per-asset brand score.

**HUL fit and the defensibility line:** **Brand DNAi governs what the AI reads. PRAMAAN governs what the world sees.** Build on top, cite by name, never position against.

---

#### **A5 · AI-Disclosure Tier Classifier** — T1

**Problem.** ASCI's draft AI-labelling guidelines define three tiers — and a Sketch Pro asset can move between them **on a single prompt change**.

| Tier | Treatment | Examples |
|---|---|---|
| **High** | **PROHIBITED — a label does not cure it** | fabricated endorsements; exaggerating results via visuals; unauthorised deepfakes; likeness/copyright without consent; AI-generated fake doctors |
| **Medium** | **MANDATORY LABEL** | virtual influencers; replicating a real person's likeness/voice **even with consent**; synthetic product demonstrations; AI-created realistic events |
| **Low** | No label | colour correction, blemish removal, decorative AI backgrounds, ambient music, AI-assisted copy |

A CGI product shot on an AI background is *low*. Add a person who reads as a real endorser → *medium*. Imply a result the product cannot deliver → *high and unfixable*.

**Spec.** Auto-classify every asset into tier; enforce the label at render; hard-block High. Ingest **C2PA Content Credentials** where present — **absence of a valid signed manifest is itself an alert**.

**HUL fit.** *The regulator pre-wrote your rule engine. Your job is to make it executable at Sketch Pro's throughput.*

> ⚠️ Verify whether ASCI's AI-labelling guidelines are final or still draft before asserting they are in force. And correct the common error: **the draft's "10% of visual surface area" requirement was DROPPED in the final IT Rules**, replaced by intermediary discretion to label "prominently."

---

#### **A6 · Likeness & Consent Verification** — T1

**Problem.** Synthetic humans in live ads — HUL demoed exactly this at the launch event (*"all synthetic humans going through all of the legal processes"*). Brand ambassadors with scoped, expiring contracts. Indian courts actively enforcing personality rights. ASCI classifies unauthorised likeness as **High risk — prohibited.**

**Spec.** An **enrolled entity registry**: ambassadors, licensed talent, virtual influencers — with machine-readable consent scope (`markets[], channels[], formats[], valid_until, prohibited_contexts[]`). Face/voice embedding match against every asset.

- Unenrolled human likeness → **block**
- Enrolled but out-of-scope → **flag with the specific contract clause**
- Enrolled and in-scope → pass, cite the contract

**Mechanisms borrowed.** Loti AI's **enrol → sweep → pre-authorised auto-enforce** loop. Vermillio's **TraceID** — machine-readable licence terms attached to the asset ID.

**HUL fit.** Extend the registry beyond people: **enrol logos, pack shots and approved claim wordings as protected entities.** The same sweep then detects counterfeit and unauthorised reseller usage (B6).

---

#### **A7 · Moment Risk & Cultural Appropriateness Reasoning** — T0

**The genuinely hard one, and the demo that wins.**

**Problem.** Conventional pre-testing does not measure this risk class — see §2.6. In India, destruction is faster than approval — see §2.4.

**Spec.** A reasoning layer scoring a moment or asset for reputational risk **per market**, and — critically — **explaining why**.

Inputs: adjacent live events · market sensitivities · the brand's own historical public positions (the Dove pledge is a *constraint*, not a preference) · category flashpoints · simulated audience reaction · precedent from MEMORY.

Output structure (four reasoning cards, always):
1. **Reputational adjacency** — what the moment is entangled with
2. **Market divergence** — an explicit per-market grid, never a single global score
3. **Brand constraint** — which pledge or codex entry conflicts, with `binding_level`
4. **Precedent** — comparable activations and what happened to them

**Mechanisms borrowed.** Aaru's and Societies.io's **simulated populations** — test against a synthetic audience before publishing. Societies.io publishes **86% distribution accuracy vs a 91% human self-replication ceiling, <2% hallucination vs ~9% for human panels**. Unusual.ai's **interpretability-before-intervention** — diagnose *why* a claim reads adversely, then fix the source.

**HUL fit.** The agent **refusing** a tempting cultural moment, with reasoning that differs by market, is the single most persuasive 40 seconds you can put in front of a judge. It proves *judgment*, not throughput. **A judge who sees a well-reasoned "no" stops worrying about hallucination.**

---

#### **A8 · Compliant Rewrite Generation** — T0

**Problem.** Flagging without fixing relocates the work. From r/marketing: *"If you can cut their active review time from 30 mins to 10, you're onto a winner."*

**Spec.** For every AMBER, generate a compliant alternative inline with the driving rule named, plus the substantiation path as an alternative:

> *"'Clinically proven 72h protection' → '72h freshness'* — or attach Study #A-2291 to keep the original wording."

One click applies and mutates the copy in place. Rewrites must preserve claim intent where legal, and must never invent a new substantiated claim (the rewrite may only use wording already in the Claims Ledger for that market, or non-objective language).

**Mechanism borrowed.** Saifr — **flag + name the rule + generate compliant replacement, inside the design tool.**

---

#### **A9 · Verdict, Confidence & Risk-Tiered Routing** — T0

**Problem.** Uniform approval weight regardless of consequence. A ₹2 crore TVC and a Tier-3 Instagram Reel take the same path. *"There were SEVEN people who had to approve content including legal… the parent company ended up killing the project because of person number seven."*

**Spec.**

```
verdict = {
  status: RED | AMBER | GREEN,
  confidence: 0..1,
  findings[]: { clause, severity, evidence_ref, suggested_fix },
  routing: auto | single_approver | full_chain | abstain
}
```

Routing is a function of **consequence**, not format:
`consequence = reach × spend × (1 − reversibility) × claim_severity × market_enforcement_intensity`

| Condition | Route |
|---|---|
| GREEN + confidence ≥ 0.85 + low consequence | **auto-clear**, logged, sampled for QA |
| AMBER | single named approver |
| RED or high consequence | full director → VP chain, **untouched** |
| confidence < 0.60 | **abstain and escalate — never guess** |

**Mechanism borrowed.** Zefr's decoupling of classification from rules — one classifier, many brand rulebooks, output allow / review / exclude **with a reason**.

**HUL fit.** Direct answer to the stated doctrine — *"the final button is always pressed by the human in the loop."* **PRAMAAN removes no approver. It removes unnecessary approvals.**

---

#### **A10 · Machine-Readable Claim Publishing (Ring 0 + answer surfaces)** — T2

Emits the approved claim set as `schema.org` markup, `llms.txt` and C2PA assertions so downstream AI engines retrieve the *substantiated* version of a claim rather than a scraped or hallucinated one. Also the payload behind `pramaan.constrain()` (Flow 2).

---

### AGENT B — WATCH · always-on in-market surveillance (12 features)

---

#### **B1 · Owned-Asset Drift Monitoring** — T1
An asset cleared at t=0 gets re-cropped, re-captioned, re-uploaded by a local team or relisted by a retailer. The cleared version and the live version diverge silently. Continuous re-check of live assets against their clearance record; diff → alert. **Metric borrowed from AthenaHQ:** *discrepancy rate* as a first-class KPI — "% of in-market claims that diverge from the approved claim set."

#### **B2 · Influencer & Creator Sweep** — T1
**The largest uncovered surface.** ASCI FY25-26: 1,609 influencer ads processed, **97.3% required modification**; 54% promoted categories disallowed by law. In Beauty & Personal Care, **45% of cases were influencer-led**. Unilever has 300,000 influencers.
Sweep enrolled creator handles for brand mentions → check disclosure presence and prominence, claim accuracy vs the approved brief, prohibited-category adjacency, AI-influencer dual disclosure.
**HUL fit: Sangam already holds the roster.** WATCH consumes it. **No new data acquisition needed — the cheapest, highest-value integration in the product.**

#### **B3 · Marketplace & Q-Commerce Listing Monitoring** — T2
Blinkit, Instamart, Nykaa, Amazon and distributors write their own product copy. Legal Metrology e-commerce declarations are mandatory. The brand is liable for text it never authored. Crawl listings per SKU per platform; check mandatory declarations, claim drift, price/offer dark patterns.

#### **B4 · Point-in-Time Evidence Snapshot** — T0 *(thin, but real)*
**The single most transferable mechanism in the competitive set.** Violating content gets edited or deleted before you can prove what it said. At every detection, capture a rendered snapshot — DOM + PNG + expanded collapsed disclosures + OCR'd video overlays — hashed and stored immutably. affil.ai calls it *"a modern Wayback Machine."* **It converts monitoring into evidence.**

#### **B5 · Sentiment Ignition Detection** — T3
By the time a backlash is measurable it is unrecoverable (Layer'r Shot: ~48h). Unsampled ingestion so **low-volume breaches surface pre-virality**; velocity-of-negative-sentiment as trigger, not absolute volume. Measured precedent: Under Armour/Anthony Joshua — CARMA measured positive sentiment 31.7% → 16.1%, negative 1.0% → 7.3%. ⚠️ Single-source; flag it.

#### **B6 · Unauthorised Use, Counterfeit & Impersonation** — T2
The enrolled-entity registry (A6) doubles as a detection index for logos, pack shots and approved claim wordings appearing where they shouldn't. Pre-authorised auto-takedown for clear-cut cases.

#### **B7 · Competitor Claim Monitoring** — T3
Comparative advertising is live litigation for HUL — **Bombay HC permanently restrained Sebamed on 16 Jun 2022** and ordered destruction of all copies. Monitor competitor claims for disparagement and unsubstantiated superiority; assemble the evidence pack automatically. **Turns PRAMAAN from a cost centre into an offensive capability** — this materially helps the business-impact score.

#### **B8 · Answer Surface Monitoring** — T3
Consumers increasingly ask an LLM, not Google. Probe ChatGPT, Gemini, Claude, Perplexity, Copilot and AI Overviews per brand × market × language. **A 2026-native risk surface most teams won't have thought of.**

#### **B9 · Claim Discrepancy Detection** — T3
Diff what engines assert against the approved claim set — unsubstantiated, retired, or hallucinated.

#### **B10 · Citation Source Audit** — T3
Trace which sources engines cite; flag stale HUL-owned content quoting the company against itself (e.g. an archived page still saying *"Health Food Drink"*).

#### **B11 · Adverse Narrative Detection** — T3
Run adversarial questions per brand; score both sentiment and factual accuracy of the answers.

#### **B12 · Model-Drift Early Warning** — T3
Track answer deltas across model versions; alert on material change.

---

### AGENT C — LEDGER · audit, defensibility & replay (6 features)

---

#### **C1 · Immutable Clearance Record** — T0
Every decision written append-only: `asset_hash · rule_set_version_hash · claim_ids · findings · verdict · confidence · human_approver · timestamp · evidence_refs`. **Reference:** Hadrius routes AI-generated content into a WORM supervised archive.

#### **C2 · Rule-Set Versioning** — T0
Rules are content. Every rule carries `version, effective_from, source_citation, author`. **A verdict is only meaningful relative to the rule version that produced it.** **Reference:** Norm Ai's supervisory agent that audits other agents' output back to the clause.

#### **C3 · Rule-Change Replay** — T0 — **the capability nobody ships**
Publish a new rule version → PRAMAAN **re-runs every live asset in the portfolio overnight** and returns a remediation list ranked by exposure (`reach × severity × market enforcement intensity`).
**Why it wins:** humans structurally cannot do this. It is the complete answer to *"isn't this just a faster reviewer?"* — **no reviewer can re-read 40,000 live assets on the day a rule changes.**
**Implementation note:** reuses cached `extracted_claim` rows and re-runs *only the decision plane*. This is what makes replay economically viable.

#### **C4 · Regulator Response Pack** — T1
One click → a dossier for an ASCI or CCPA query: the asset, its clearance record, the rule version, the substantiation dossier, the approver, the snapshot. **The highest-value artefact when a regulator writes** — and no vendor found links a live ad claim back to the study supporting it.

#### **C5 · Override Log as Training Signal** — T1
Every human override captured with reasoning. Feeds claims harvesting (A2) and rule refinement. **The system gets smarter from disagreement** — and the log is itself the evidence that human authority is real. *"Human override authority is non-negotiable"* (Indegene).

#### **C6 · Accuracy Card** — T0
Publish measured precision / recall / false-positive rate on a held-out labelled set, refreshed each release. Recycle production traces as **regression evals** to prove the agent hasn't drifted.
**Nobody in compliance publishes an accuracy card. Doing it is the cheapest credibility moat available** — for the prototype it costs 30 hand-labelled assets. Direct answer to the panel's stated reliability bar.

---

### AGENT D — PULSE · portfolio risk (7 features)

| # | Feature | Tier | Problem it solves |
|---|---|---|---|
| **D1** | **Exposure heat map** — brand × market × format × severity | T2 | Nobody can answer "where is our risk concentrated?" across 400 brands |
| **D2** | **Claim inventory** — what the portfolio actually claims, where, on what evidence | T2 | **This inventory does not exist anywhere today at any CPG** |
| **D3** | **Expiry radar** — dossiers and consent contracts approaching expiry | T2 | Claims silently become unsubstantiated when a study lapses |
| **D4** | **Systemic pattern detection** — the same bad claim pattern across brands | T3 | A category-wide error repeats 40 times before anyone notices |
| **D5** | **Compliance-rate telemetry** — first-pass clearance, cycle time, drift rate | T1 | **PRAMAAN creates the metric that makes the problem visible** |
| **D6** | **Routing configuration** — governance authors the consequence thresholds | T2 | Approval weight is currently uniform |
| **D7** | **Answer-surface exposure index** | T3 | Rolls discrepancy rate × reach into a portfolio KPI |

**D5 deserves its own slide.** Before PRAMAAN, "how compliant are we?" is unanswerable at HUL. After it, it's a number on a dashboard.

---

### AGENT E — MEMORY · the Precedent Engine (6 features)

**Why this exists:** ABMs rotate every 12–18 months. The knowledge leaves with them. No CPG has institutional claim memory.

| # | Feature | Tier | What it answers |
|---|---|---|---|
| **E1** | **Claim precedent search** | T2 | *"Have we ever run a 72-hour protection claim in India, and what happened?"* |
| **E2** | **Objection & outcome history** | T2 | What legal actually said and why — turning three rounds of re-litigation into one citation |
| **E3** | **Regulatory correspondence archive** | T3 | ASCI complaints, CCPA notices, competitor disputes indexed against the claims that caused them |
| **E4** | **Retired-claim register** | T2 | Every claim HUL stopped making and why — *Fair & Lovely*, *"Health Food Drinks"* — feeding B10 |
| **E5** | **Cross-brand precedent transfer** | T3 | A claim adjudicated for Lifebuoy informs Lux, across 400 teams who will never speak |
| **E6** | **Scoped connector reads** | T3 | Reads consumer-connect repository, brand guidelines, campaign history — **and nothing outside governance** |

---

### CROSS-CUTTING F · workflow (3 features)

| # | Feature | Tier | Spec |
|---|---|---|---|
| **F1** | **Multi-party workspace** | T2 | One finding, three lenses — brand sees launch risk, agency sees a rework ticket, creator sees a plain-language fix |
| **F2** | **Remediation loop** | T1 | Auto-generated fix requests routed to the actual content owner, with deadline, escalation ladder and auto re-check. **Without F2, WATCH is an alarm nobody can act on** |
| **F3** | **Autonomous scope discovery** | T2 | Give it a handle or a domain; it finds the entire brand surface itself, including pages nobody knew existed |

---

### The prioritisation 2×2 (Slide 2)

```
                    HIGH VALUE
                         │
      C3 Replay      ●   │   ●  A2 Claims Ledger
      A7 Moment Risk ●   │   ●  A3 Rule Engine
      Ring 0         ●   │   ●  A1 Extraction
      E1–E5 Memory   ●   │   ●  A8 Rewrite
      F2 Remediation ●   │   ●  C1 Ledger
                         │
   UNIQUE ───────────────┼─────────────── TABLE STAKES
                         │
      D4 Systemic     ●  │   ●  D1 Heat map
      B12 Model drift ●  │   ●  B3 Marketplace
      B7 Competitor   ●  │   ●  D6 Routing config
                         │
                    LOWER VALUE

           BUILD LEFT-TOP FIRST. Buy or defer right-bottom.
```

---

## §7 The Rule Pack — 40 rules

> ⚠️ **Mandatory disclaimer, must appear in the UI footer and on the slide:**
> *"Rule text paraphrased for machine execution. Production rule packs authored and maintained by regulatory counsel."*
> These are working approximations built for a prototype. They are **not** verbatim statutory language and must never be presented as such.

**Schema for every rule:**
`id · regulator · clauseRef · title · testType · severity · jurisdictions[] · categories[] · version · effectiveFrom · sourceUrl · test`

**Severity ladder:** `critical` (blocks — RED) · `major` (AMBER, single approver) · `minor` (AMBER, advisory).

---

### 7.1 ASCI — Code for Self-Regulation (14 rules)

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **ASCI-I-1** | Ch. I, 1.1 | Claims must be capable of substantiation **in the market of publication** | Every extracted objective claim must resolve to an ApprovedClaim whose `markets[]` includes the asset market. Wrong-market match → AMBER; no match → RED | judgment | critical |
| **ASCI-I-2** | Ch. I, 1.2 | No claim that misleads by ambiguity, exaggeration or omission | LLM check for implied benefit exceeding substantiated benefit | judgment | critical |
| **ASCI-I-3** | Ch. I, 1.3 | Testimonials must be genuine, current and relate to actual experience | Any testimonial-type claim requires a `testimonial_ref`; synthetic/AI-generated testimonial → escalate to ASCI-AI-H | judgment | critical |
| **ASCI-I-4** | Ch. I, 1.4 | Scientific/statistical claims must not imply greater precision than the evidence supports | Regex for manufactured precision: decimal multipliers (`\d+\.\d+x`), implausible absolute counts (`\b\d{4,}\s*(strands\|hairs\|cells)`), percentages >100 in benefit context | deterministic | major |
| **ASCI-I-5** | Ch. I, 1.5 | Disclaimers must not contradict the main claim and must be legible/audible | Disclaimer text present when a qualified claim is used; font-size proxy (bbox height ratio ≥ 0.4 of claim text); on-screen duration ≥ 4s | deterministic | major |
| **ASCI-II-1** | Ch. II, 2.1 | No content offensive to public decency | judgment pass | judgment | major |
| **ASCI-II-2** | Ch. II, 2.2 | No derogatory depiction by gender, caste, religion, region or disability | judgment pass with per-market sensitivity list | judgment | critical |
| **ASCI-III-1** | Ch. III, 3.1 | No depiction of unsafe practices, especially where children may imitate | judgment pass; auto-escalate if minors detected in asset | judgment | critical |
| **ASCI-IV-1** | Ch. IV, 4.1 | Comparative advertising must not disparage a competitor | Named-competitor detection + disparagement judgment. **Sebamed precedent attached to every finding** | judgment | critical |
| **ASCI-IV-2** | Ch. IV, 4.2 | Comparisons must be factual, verifiable and on like-for-like attributes | Comparative claim requires a `comparison_basis` field and a dossier ref | judgment | major |
| **ASCI-IV-3** | Ch. IV, 4.3 | No unwarranted implication of superiority ("No. 1", "best", "leading") | Deterministic term list `["no.1","no 1","#1","best","leading","top-rated"]` → requires a superiority dossier valid in that market | deterministic | critical |
| **ASCI-INF-1** | Influencer Guidelines, 2.1 | Material connection must be disclosed **upfront and prominently** | Disclosure token present (`#ad`, `#sponsored`, `#collab`, `#partnership`, paid-partnership tag) **and** within the first 2 lines / first 3 seconds / not hidden behind "more" | deterministic | critical |
| **ASCI-INF-2** | Influencer Guidelines, 3.1 | Influencers must not promote categories disallowed by law | SKU category × prohibited-category list per market | deterministic | critical |
| **ASCI-INF-4** | Influencer Guidelines, 4.2 | Virtual / AI influencers require **dual disclosure** (paid **and** synthetic) | If `entity_type == virtual_influencer`, require both disclosure tokens | deterministic | critical |

### 7.2 ASCI — Draft Guidelines on Labelling AI-Generated Content (3 rules)

> ⚠️ **Status flag:** released as draft 12 May 2026, consultation closed 13 Jun 2026. **Verify final status before asserting these are in force.** Label them "draft" in the UI.

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **ASCI-AI-H** | AI Labelling (draft), Tier 1 | High-risk AI content is **prohibited** — a label does not cure it | Triggers on: fabricated endorsement, unauthorised likeness (A6 unenrolled match), visual exaggeration of results, AI-generated authority figures (doctor/expert). **No fix path offered — regenerate** | judgment | critical |
| **ASCI-AI-M** | AI Labelling (draft), Tier 2 | Medium-risk AI content requires a **prominent label** | Triggers on: virtual influencer, replicated likeness even with consent, synthetic product demonstration, AI-created realistic event. Requires label present **for the full duration** of the asset | deterministic | major |
| **ASCI-AI-L** | AI Labelling (draft), Tier 3 | Low-risk AI content requires no label | Pass-through classification: colour correction, blemish removal, decorative background, ambient music, AI-assisted copy | deterministic | minor |

### 7.3 CCPA — Consumer Protection Authority (9 rules)

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **CCPA-MA-4** | Misleading Ads Guidelines 2022, s.4 | Objective claims require **prior adequate substantiation**. Penalties to ₹10L; ₹50L repeat; endorser ban 1–3 yrs | Mirrors ASCI-I-1 with penalty metadata attached to the finding | judgment | critical |
| **CCPA-MA-5** | s.5 | Bait advertising prohibited — no advertising stock the advertiser cannot reasonably supply | Offer claims require an inventory attestation flag | judgment | major |
| **CCPA-MA-6** | s.6 | "Free" claims must be genuinely free of cost | Term list `["free","complimentary","no cost"]` requires a `free_basis` field | deterministic | major |
| **CCPA-MA-7** | s.7 | Surrogate advertising prohibited | Category × brand-extension check against prohibited-category list | judgment | critical |
| **CCPA-MA-8** | s.8 | Advertisements targeting children must not exaggerate or induce unrealistic expectations | If audience or depiction includes minors, apply the stricter child rule set. **Cross-references Unilever Responsible Marketing to Children** | judgment | critical |
| **CCPA-MA-12** | s.12 | Due-diligence duty falls on manufacturer, advertiser, agency **and endorser** | Metadata rule: every cleared asset must record a responsible party | deterministic | major |
| **CCPA-100** | Ruling, 18 Jun 2026 | Any **"100%"** claim must be literally and completely verifiable | Regex `\b100\s*%` in a claim context → requires an ApprovedClaim of `evidence_grade: lab\|clinical` for that market. **Default: RED** | deterministic | critical |
| **CCPA-DP-7** | Dark Patterns 2023, Sch. 1(7) | False urgency / countdown pressure prohibited | Regex family: `only \d+ left`, `hurry`, `ends in`, `last chance`, countdown components | deterministic | major |
| **CCPA-GW-3** | Greenwashing Guidelines 2024, s.3 | Environmental claims must be specific, substantiated and not use vague absolutes | Term list `["eco-friendly","green","sustainable","natural","carbon neutral","planet positive"]` → requires an ApprovedClaim with environmental evidence for that market | deterministic | critical |

### 7.4 FSSAI — Food Safety and Standards (Advertising and Claims) Regulations 2018 (5 rules)

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **FSSAI-AC-4** | Reg. 4 | General principles — food claims must be truthful, unambiguous and not misleading | judgment pass on all food-category assets | judgment | critical |
| **FSSAI-AC-5** | Reg. 5 | Nutrition claims must meet prescribed thresholds ("low fat", "high protein", "source of") | Term list mapped to threshold table; requires a nutrition dossier per SKU | deterministic | major |
| **FSSAI-AC-6** | Reg. 6 | Health claims must meet prescribed conditions. **No "health drink" category exists under the FSS Act 2006** | Term list `["health drink","health food drink"]` → **RED, no fix available**. Precedent attached: HUL renamed the category to *Functional Nutrition Drinks*, Apr 2024 | deterministic | critical |
| **FSSAI-AC-9** | Reg. 9 | Prohibited claims — no claim of disease prevention, treatment or cure | Cross-references DMR-3. Term family: `prevents/cures/treats/heals` + condition noun | deterministic | critical |
| **FSSAI-ORS** | Advisory, Oct 2025 | Trademark use of restricted nutritional designations may be rescinded retroactively | Watch rule — flags any claim whose permission derives from a rescindable memo. **Precedent: FSSAI rescinded its own 2022 and 2024 ORS memos with immediate effect** | judgment | major |

### 7.5 Legal Metrology (Packaged Commodities) Rules (3 rules)

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **LM-PC-6** | Rule 6 | Mandatory declarations — net quantity, MRP (inclusive of all taxes), consumer-care details, country of origin | Presence check across pack shot OCR and listing copy | deterministic | major |
| **LM-PC-9** | Rule 9 | Declarations must meet prescribed size and prominence | bbox height threshold relative to principal display panel | deterministic | minor |
| **LM-PC-18** | Rule 18 | E-commerce listings must carry the same mandatory declarations as the pack | Applies LM-PC-6 to marketplace listings (B3) | deterministic | major |

### 7.6 Drugs, Cosmetics & Magic Remedies (2 rules)

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **DMR-3** | Drugs & Magic Remedies (Objectionable Advertisements) Act 1954, s.3 | No advertisement suggesting treatment or cure of scheduled conditions | Scheduled-condition term list × treatment-verb list. **Critical for personal care adjacency** — "cures dandruff", "treats acne" | deterministic | critical |
| **DC-COS-1** | Drugs & Cosmetics Rules — cosmetics | Cosmetic claims must not cross into therapeutic territory | Cosmetic/therapeutic boundary judgment: *"reduces the appearance of"* (cosmetic) vs *"repairs"/"heals"* (therapeutic) | judgment | critical |

### 7.7 MeitY — IT (Intermediary Guidelines) Amendment Rules 2026 (2 rules)

> Notified 10 Feb 2026, in effect 20 Feb 2026.
> ⚠️ **Correct a common error:** the draft's *"10% of visual surface area"* label requirement was **DROPPED in the final rules**, replaced by intermediary discretion to label "prominently."

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **MEITY-SM-1** | IT Amd. Rules 2026 | Synthetically generated information must be prominently labelled | If `aiGenerated == true` and tier ≥ medium, require a visible label; assert *prominence*, not a fixed percentage | deterministic | major |
| **MEITY-TD-1** | IT Amd. Rules 2026 | Takedown windows: 3 hours (court/government order), 2 hours (impersonation/intimate content) | Operational SLA rule — drives WATCH alert priority, not asset clearance | deterministic | major |

### 7.8 Internal — Unilever policy & brand codex (4 rules)

| id | clauseRef | Title | Test | Type | Sev |
|---|---|---|---|---|---|
| **UL-AMP-1** | Unilever Advertising & Marketing Principles | Advertising must be legal, decent, honest and truthful across all markets | Umbrella judgment pass; internal-policy severity | judgment | major |
| **UL-RMC-1** | Responsible Marketing to Children | No marketing of restricted categories to children; stricter depiction rules | Minor detection → apply child rule set | deterministic | critical |
| **BRAND-DOVE-1** | Dove Real Beauty Pledge, 9 Apr 2024 | **Dove will never use AI to represent real women in its advertising.** `binding_level: PLEDGE` | If `brand == Dove` and asset contains an AI-generated human likeness → **RED, no fix path.** A pledge hard-blocks; it does not advise | deterministic | critical |
| **BRAND-CODEX-1** | Brand DNAi | Tone, visual identity and claim register must match the approved brand data pool | RAG over Brand DNAi with a citation back to the guideline section | judgment | minor |

### 7.9 International rule packs (Tier 2/3 — stubs in the prototype)

| id | Regulator | Title | Markets |
|---|---|---|---|
| **ASA-CAP-3.7** | ASA/CAP (UK) | Claims must be supported by documentary evidence held on file | UK |
| **ASA-CAP-3.33** | ASA/CAP (UK) | Comparative claims must be verifiable | UK |
| **EU-EMPCO-1** | EU Empowering Consumers Directive | Generic environmental claims prohibited without recognised proof (applies 27 Sep 2026) | EU/DE |
| **EU-AIA-50** | EU AI Act, Art. 50 | Deployer disclosure duty for synthetic media (applies 2 Aug 2026) | EU/DE |
| **FTC-GG-1** | FTC Green Guides | Environmental marketing claims must be specific and substantiated | US |

> ⚠️ **HIGHEST-PRIORITY VERIFICATION:** the Nov 2025 Digital Omnibus proposal reportedly seeks to delay parts of the EU AI Act. **Status as of Aug 2026 unconfirmed — re-verify before putting the date on a slide.**

### 7.10 Deterministic test library (implementation reference)

These run in pure code, sub-50ms, no LLM. This is what makes the demo's latency split visible.

```ts
// /lib/engine/deterministic.ts
prohibitedTerms(text, list)              // ASCI-IV-3, CCPA-GW-3, FSSAI-AC-6, DMR-3
absoluteQuantifier(text)                 // CCPA-100  →  /\b100\s*%/i
manufacturedPrecision(text)              // ASCI-I-4  →  /\d+\.\d+\s*x/i, /\b\d{4,}\s*(strands|hairs)/i
superiorityClaim(text)                   // ASCI-IV-3
falseUrgency(text)                       // CCPA-DP-7 →  /only \d+ left|hurry|ends in|last chance/i
disclosurePresent(text, position)        // ASCI-INF-1 (token AND position AND prominence)
dualDisclosure(text, entityType)         // ASCI-INF-4
labelDuration(overlays, assetDuration)   // ASCI-AI-M (full duration, not first 3s)
mandatoryDeclarations(ocrText, market)   // LM-PC-6 / LM-PC-18
netQuantityFormat(ocrText)               // LM-PC-6
asteriskBinding(text)                    // ASCI-I-5 (every * has a resolving footnote)
therapeuticVerb(text, category)          // DMR-3 / DC-COS-1
c2paManifestValid(asset)                 // A5 — absence is itself an alert
```

**Rule authoring principle to state on stage:** *Regulation → clause → machine-readable test → version hash. The rules are data. Data has a version. That is why we can replay.*

---

## §8 The Claims Ledger — 25 seed claims

The reference standard that **does not exist today at any CPG**. Pharma has an approved label; CPG has nothing. **Building this is the product.**

### 8.1 Rexona (demo-critical)

| canonicalText | sku | markets substantiated | dossier | grade | status |
|---|---|---|---|---|---|
| "Clinically proven 72h protection" | REX-AP-150 | EU, UK, AE | DOS-EU-4471 | clinical | active |
| "72h freshness" | REX-AP-150 | IN, AE, ZA, BR, ID, PH, VN, TH, MX, EG | DOS-IN-2291 | consumer-panel | active |
| "It won't ever let you down" | REX-AP-150 | *all* | DOS-GL-0001 | none *(non-objective tagline)* | active |
| "Odour protection all day" | REX-AP-150 | IN, ID, PH, VN, TH | DOS-IN-2294 | consumer-panel | active |
| "Sweat-activated technology" | REX-AP-150 | IN, BR, MX | DOS-IN-2299 | lab | active |

### 8.2 Personal care portfolio

| canonicalText | sku | markets | dossier | grade | status |
|---|---|---|---|---|---|
| "Removes 99.9% of germs" | LIF-SOAP-100 | IN | DOS-IN-1180 | lab | **expiring 2026-11-30** |
| "Dermatologist tested" | DOV-BAR-100 | IN, AE, ZA | DOS-IN-3310 | clinical | active |
| "1/4 moisturising cream" | DOV-BAR-100 | *all* | DOS-GL-0044 | lab | active |
| "Reduces hair fall from the first wash" | SUN-SH-340 | IN | DOS-IN-2701 | consumer-panel | active |
| "Up to 10x stronger hair" | TRE-SH-340 | IN, TH, PH | DOS-IN-2755 | lab | active |
| "SPF 50 PA+++" | LAK-SUN-50 | IN | DOS-IN-4120 | lab | active |
| "Long-lasting 16h wear" | LAK-FND-30 | IN | DOS-IN-4155 | consumer-panel | active |
| "Fights 10 signs of ageing" | PON-CRM-50 | IN | DOS-IN-5010 | clinical | active |

### 8.3 Home care & foods

| canonicalText | sku | markets | dossier | grade | status |
|---|---|---|---|---|---|
| "Removes tough stains in 1 wash" | SUR-DET-1KG | IN | DOS-IN-6001 | lab | active |
| "Kills 99.9% of germs on utensils" | VIM-LIQ-500 | IN | DOS-IN-6110 | lab | active |
| "Fortified with 2 vital nutrients" | HOR-500 | IN | DOS-IN-7220 | lab | active |
| "Made with 100% Indian tea leaves" | BRK-TEA-500 | IN | DOS-IN-7401 | supply-chain | active |
| "No added preservatives" | KIS-JAM-500 | IN | DOS-IN-7455 | lab | active |

### 8.4 The retired register (E4 — powers the demo and B10)

| canonicalText | sku | status | reason |
|---|---|---|---|
| "100% natural ingredients" | — | **retired** | CCPA absolute-verifiability ruling, 18 Jun 2026 (CCPA-100 + CCPA-GW-3) |
| "Health Food Drink" | HOR-500 | **retired** | No such category under FSS Act 2006. HUL renamed to *Functional Nutrition Drinks*, Apr 2024 (FSSAI-AC-6) |
| "Reduces hair fall by 11.7x" | — | **retired** | Manufactured scientific precision (ASCI-I-4) |
| "Fairness guaranteed" | — | **retired** | Fair & Lovely → Glow & Lovely, Jul 2020 |
| "Hair growth of 23,800 strands" | — | **retired** | Manufactured precision (ASCI-I-4); named in ASCI FY25-26 violation patterns |
| "Eco-friendly formula" | — | **retired** | Vague absolute (CCPA-GW-3) |
| "Doctor recommended No.1" | — | **retired** | Unsubstantiated superiority (ASCI-IV-3) |

**Why the retired register matters:** it is the only artefact that stops a rotating ABM from re-proposing a claim the company already abandoned. It also feeds citation audit (B10) — flagging stale HUL-owned pages that still quote the company against itself.

---

## §9 Data model

### 9.1 Knowledge plane

```sql
rule(id, regulator, clause_ref, title, text, machine_test, test_type,
     severity, jurisdictions[], categories[], version, effective_from,
     source_url, author, superseded_by NULLABLE)

claim(id, canonical_text, claim_type, product_sku, markets[],
      dossier_ref, evidence_grade, valid_from, expires_on, status,
      retired_reason NULLABLE, harvested_from_verdict_id NULLABLE)

brand_codex(id, brand, rule_text, source, binding_level, market_scope[])
   -- binding_level: pledge | guideline | preference
   -- Dove Real Beauty commitment = 'pledge'  → hard block, never advisory

entity_registry(id, entity_type, name, embedding, consent_scope_json,
                markets[], channels[], formats[], valid_until,
                prohibited_contexts[])
   -- entity_type: person | logo | packshot | claim_wording | virtual_influencer

precedent(id, claim_text, market, verdict, rationale, objection_text,
          outcome, adjudicated_by, adjudicated_at, source_verdict_id)
```

### 9.2 Decision & evidence plane

```sql
asset(id, hash, brand, sku, campaign, market, language, channel, format,
      source_system, copy, media_ref, c2pa_manifest, ai_generated, ai_tier,
      reach_estimate, spend, reversibility, created_at)

extracted_claim(id, asset_id, claim_text, claim_type, surface, frame_ref,
                bbox_json, matched_claim_id NULLABLE, match_confidence)
   -- CACHED. Replay re-runs decisions over these rows, never re-extracts.

verdict(id, asset_id, rule_set_version_hash, status, confidence, routing,
        model_versions_json, created_at)               -- APPEND ONLY

finding(id, verdict_id, rule_id NOT NULL, severity, quoted_text,
        explanation, suggested_fix, alt_fix, evidence_ref,
        region_json, timestamp_range, human_disposition)

approval(id, verdict_id, approver_id, decision, reasoning, timestamp)
                                                        -- APPEND ONLY

override(id, finding_id, approver_id, original, override, reasoning, timestamp)
```

### 9.3 Surveillance plane

```sql
observation(id, asset_id NULLABLE, url, platform, handle,
            snapshot_png_ref, snapshot_dom_ref, content_hash,
            observed_at, drift_from_verdict_id NULLABLE)

remediation(id, observation_id, owner_type, owner_ref, message,
            deadline, escalation_level, status, resolved_at)
```

### 9.4 The two schema constraints that are product decisions

1. **`finding.rule_id` is `NOT NULL`.** A finding without a rule cannot exist. This forces clause citation *at the storage layer* — the model physically cannot emit an uncited verdict. Not a prompt instruction; a database constraint.
2. **`verdict` and `approval` are append-only.** No updates, no deletes. **Defensibility is a schema property, not a feature.**

### 9.5 Runtime flows

**FLOW 1 — Synchronous clearance (Ring 1, the hot path)**

```
BM finishes a variant in Sketch Pro
  → panel fires automatically (no button)
  → A1 extract  [vision + OCR + ASR + copy parse]        ~8s
  → parallel fan-out:
       A2 claims match      (vector + exact lookup)       ~2s
       A3 rule engine       (deterministic <50ms, then LLM+RAG)  ~25s
       A4 brand codex       (RAG over Brand DNAi)         ~10s
       A5 AI-tier classify  (small model)                 ~3s
       A6 likeness match    (face/logo embedding)         ~5s
  → aggregate + confidence + abstention gate              ~3s
  → A8 rewrite for each AMBER                             ~12s
  → A9 verdict + routing → render market strip
  → C1 write append-only ledger record
                                          TOTAL p95 < 90s
```

**Build note:** deterministic checks return in <2s and render immediately; LLM findings stream in. **Never show a blank spinner** — progressive disclosure is what makes 90s feel instant, and it makes the deterministic/judgment split *visible* to a judge.

**FLOW 2 — Constrain at generation (Ring 0, the differentiator)**

```
Sketch Pro is about to generate 400 variants for market=IN, brand=Rexona
  → calls pramaan.constrain(brand, sku, market, channel)
  → returns a constraint pack:
       · permitted claim set for IN (from Claims Ledger)
       · prohibited terms + patterns (from Rule Graph)
       · brand codex hard constraints (Dove pledge = binding)
       · required disclosures for the AI tier
  → injected into the generation system prompt
  → variants come out pre-constrained
  → Flow 1 still runs as the backstop
```

**Build note:** a thin, fast, cacheable API — constraint packs change only when rules or dossiers change. Cache by `(brand, sku, market, rule_version)`. **Cheap to build, disproportionate to demo.**

**FLOW 3 — Continuous sweep (Ring 3)**

```
Scheduler (hourly / daily by risk tier)
  → F3 scope discovery: expand handles + domains → full URL set
  → headless render → expand accordions → OCR video frames
  → B4 snapshot (PNG + DOM + hash) → object store
  → diff vs last observation + vs clearance record
  → if drift or violation:
       B1/B2/B3 classify → severity
       C1 log → F2 generate remediation request
       → push to Teams (BM) + agency ticket + creator plain-language ask
  → auto re-check on resubmission; escalate on deadline miss
```

**FLOW 4 — Replay (batch, the killer demo)**

```
Regulatory analyst publishes rule_set v-next
  → C2 diff v-current → v-next → identify affected rule IDs
  → query LEDGER for all live assets touched by those rules
  → re-run Flow 1 DECISION PLANE ONLY (reuse cached extracted_claim rows)
  → rank newly non-compliant by reach × severity × market enforcement
  → emit remediation queue + PULSE exposure delta
                              100k assets < 8h overnight
```

---

# PART III — THE PROTOTYPE

## §10 MVP scope

### 10.1 Two artefacts, both required

| Artefact | Job | Intelligence |
|---|---|---|
| **Google AI Studio published app** | The **functional agent demonstration** the rulebook demands and the HUL guide specifies. A judge types their own ad copy and gets a clause-cited verdict | **Real.** Gemini reasoning over the real rule pack |
| **Web prototype** (Next.js → Vercel) | The product surface, the workflow, the three demo moments | Real engine + real replay; seeded assets |

Both links go on Slide 3 with QR codes. AI Studio naming convention: `Techtonic_<TeamName>_PRAMAAN`.

### 10.2 Real vs seeded — declare this explicitly

| Component | Status | Rationale |
|---|---|---|
| Rule pack (§7, ~40 rules) | **Real** authored data | The moat, and the cheapest real thing you own |
| Claims ledger (§8, ~25 claims) | **Real** authored data | Same |
| Deterministic validators | **Real**, pure code | Sub-50ms, reproducible, visible in the latency split |
| Claims matching | **Real** lookup | Wrong-market AMBER must come from data, not a fixture |
| Judgment findings on judge-typed input | **Real** (Gemini) | The "try it yourself" moment |
| Rule-change replay | **Real** — re-invokes the engine | Same code path as clearance |
| WATCH crawl + snapshot | **Real, thin** — 8–10 live public URLs | Upgrades "always-on" from claim to fact |
| Accuracy card | **Real** — 30 hand-labelled assets | Cheapest credibility moat available |
| Ring 0 constrain endpoint | **Real** | 90 minutes of work, top-3 POD |
| 12 Rexona variant verdicts | **Seeded** | Deterministic demo, zero live-failure risk |
| Moment Risk refusal | **Seeded** | Narrative screen; its value is the reasoning text |
| PULSE heat map, MEMORY search | **Illustrative**, labelled | Context, not proof |

> **Scope-honesty rule:** label PULSE data "illustrative," say WATCH is a 10-URL crawl, and state that Stage 1 ships as a web app while the production form factor is an embedded panel plus extension. **Judges reward accurate scoping and punish overclaiming.**

### 10.3 Build tracks (parallel, non-colliding)

**Step 0 — freeze the contract before anyone else starts.** One person, 60–90 minutes, merged to main. Nothing parallelises until this lands.

```
/lib/types.ts     Rule, ApprovedClaim, Finding, Asset, Verdict, ConstraintPack, Observation
/data/rules.ts    ~40 rules from §7
/data/claims.ts   ~25 claims from §8
/data/assets.ts   ~60 assets (12 Rexona + 48 portfolio for replay)
/data/labelled.ts 30 hand-labelled assets for the accuracy card
/lib/engine/      evaluate(asset, market) → Verdict   [typed stub first]
```

Every track imports from this and never edits it. Changes route through the one owner.

| # | Track | Deliverable | Depends on |
|---|---|---|---|
| **1** | Decision engine | Deterministic validators + judgment path with forced `ruleId` | Step 0 |
| **2** | CLEAR surfaces | Asset Detail, Batch Review + market strip, Inbox | Step 0, 1 |
| **3** | Judgment surfaces | Moment Risk refusal, Live Check with silent fallback | Step 0, 1 |
| **4** | LEDGER + Replay | Append-only log, version hashing, real replay | Step 0, 1 |
| **5** | WATCH | Headless crawl + PNG/DOM snapshot + hash on 8–10 URLs | Step 0 |
| **6** | PULSE + MEMORY | Heat map, expiry radar, precedent search | Step 0 |
| **7** | AI Studio agent | Published public link | §7, §8 only |
| **8** | Ring 0 + accuracy card | `/api/constrain`, measured precision/recall | Step 0, 1 |

Tracks 1 and 7 share the rule pack but are otherwise independent — deliberately, so a failure in one doesn't take the other down.

### 10.4 Sequencing and the hard gate

| Window | Lands |
|---|---|
| T-24 → T-22 | Contract frozen, merged. Rule pack + claims authored |
| T-22 → T-16 | Tracks 1, 2, 7. **HARD GATE at T-16: market strip animating and Apply-fix mutating copy.** If not met, cut tracks 5 and 6 and redeploy onto 2 and 4 |
| T-16 → T-10 | Tracks 3, 4, 5, 8 |
| T-10 → T-7 | Track 6 + integration freeze. One person owns end-to-end click-through and files bugs; nobody else touches main |
| T-7 → T-5 | Accuracy card computed. Deploy. Verify AI Studio link **in incognito** |
| T-5 → T-3 | Record all three demos **before anyone is tired** |
| T-3 → T-0 | Slides, QR codes, two dry runs, submit with buffer |

### 10.5 Tech stack

```
Framework      Next.js 14+ (App Router), TypeScript
Styling        Tailwind CSS + shadcn/ui
Icons          lucide-react
Charts         recharts
State          React state + Zustand. NO database
Data           Typed files in /data
AI             Single route /api/check → Gemini, used ONLY for Live Check
Crawl          Playwright (track 5 only)
Deploy         Vercel
```

**Hard constraints:** no database · no auth (persona switcher only) · **no localStorage/sessionStorage** · everything works offline except Live Check.

### 10.6 Explicitly do not build

Login, signup, onboarding, settings · a landing or marketing page · real video processing (the scrubber is a mock) · any persistence layer · dark mode · mobile layouts (**desktop only, optimised for 1440×900 projection**) · charts beyond one heat map and one sparkline · answer-surface monitoring (B8–B12) · multi-party workspace (F1) · scope discovery (F3).

---

## §11 Screen specifications

### 11.1 Design system

| | |
|---|---|
| **Principles** | Enterprise, not consumer — dense, calm, information-first. Light mode (projects better). **Verdict colour is sacred** — green/amber/red used only for verdicts, never decoratively. Evidence always visible. Fast and quiet: 150–200ms transitions, no bounce, no gradients |
| **Tokens** | `--bg #FAFAF9` · `--surface #FFFFFF` · `--border #E7E5E4` · `--text #1C1917` · `--text-muted #78716C` · `--verdict-green #15803D` · `--verdict-amber #B45309` · `--verdict-red #B91C1C` · `--green-bg #F0FDF4` · `--amber-bg #FFFBEB` · `--red-bg #FEF2F2` · `--accent #1E3A8A` · `--accent-soft #EFF6FF` |
| **Type** | Inter. Page titles 24/600. Section headers 14/600 uppercase, 0.05em tracking, muted. Body 14/400. Data and clause refs in `ui-monospace` 12–13px |
| **Layout** | 240px fixed sidebar. Content max-width 1280px, 32px padding. Cards: 1px border, 8px radius, **no drop shadows** except hover popovers |

**Copy rules.** Never use "compliance" in primary UI labels — use **Clearance / Cleared / Needs edit / Blocked**. The product sells velocity. Empty states are useful, not cute: *"No assets awaiting clearance. 312 cleared today."*

**Persistent footer, every page:** *"Prototype · rule text paraphrased · portfolio data illustrative · rule set v2026.08"*

### 11.2 Navigation

```
PRAMAAN                    [seal/stamp glyph]
─────────────────────────
CLEAR
  Inbox                    ← default landing
  Batch Review
  Moment Risk
WATCH
  Live Assets
  Creator Sweep
LEDGER
  Audit Trail
  Rule Replay
PULSE
  Portfolio Exposure
MEMORY
  Precedent Search
─────────────────────────
Live Check
─────────────────────────
[persona switcher]  Priya Sharma · ABM
```

Persona switcher options: **Priya Sharma · ABM** / **Legal Counsel** / **Brand Director**. Switching changes visible columns and available actions — *Legal sees Override; ABM does not.* This is a 20-minute build that demonstrates the governance model better than a slide.

### 11.3 Inbox *(default landing)*

Dense table: verdict dot · thumbnail · brand · campaign · format · market · findings count · cleared in · time.
Top strip, four stat cards: **Awaiting 14 · Cleared today 312 · First-pass rate 78% · Avg clearance 68s**.
Filters: brand, market, verdict, format. Row click → Asset Detail.

### 11.4 Asset Detail — the hero screen

Two columns: asset preview left, findings right.

**Left.** The creative (CSS-mocked frame or placeholder). For video, a scrubber with **severity markers on the timeline**. For images, **bounding boxes overlaid** on the offending region.

**Right.** Verdict chip (`● AMBER · confidence 0.91 · cleared in 71s`), then the copy rendered with **Grammarly-style underlines** on offending spans, colour-matched to severity. Hover or click a span → finding card:

```
┌────────────────────────────────────────────────┐
│ ⚠  Unsubstantiated in this market              │
│                                                 │
│ "Clinically proven 72h protection" is           │
│ substantiated in EU dossier DOS-EU-4471.        │
│ No UK trial data on file for REX-AP-150.        │
│                                                 │
│ ASCI Ch. I, 1.1 — claims must be capable of     │
│ substantiation in the market of publication ↗   │
│                                                 │
│ ✓ Use "72h freshness"            [Apply]        │
│ ✓ Attach Study #A-2291           [Request]      │
│ ✗ Keep as is                     [Justify →]    │
└────────────────────────────────────────────────┘
```

**Four things doing work here, and all four must survive the build:**
1. The underline is on **the claim, not the asset** — specificity is what makes it actionable.
2. The clause is **cited and clickable** — a verdict without a clause is unusable.
3. **Three exits, including "keep as is → justify"** — the BM is never trapped. Override is logged and becomes training signal.
4. **The fix is one click** — *"If you can cut their active review time from 30 mins to 10, you're onto a winner."*

**`Apply` must actually mutate the copy in the left pane and flip the verdict to GREEN** with a brief highlight flash. **This single interaction sells the product.** `Justify` opens a reasoning modal, then writes to Audit Trail.

Below findings, collapsed accordions: *AI Tier: Medium — label required* · *Likeness: 1 enrolled, 0 unenrolled* · *Brand Codex: pass*.

### 11.5 Batch Review — the market strip, the money screen

```
Rexona · "The Fourth Official" · 12 variants
Cleared in 71s · rule set v2026.08

 IN●  AE●  ZA●  BR●  ID●  PH●  TH●  MX●  EG●  UK🟠  DE🟠  VN🔴
 ─────────────────────────────────────────────────────────────
 ● cleared 9        🟠 needs edit 2        🔴 blocked 1

 ▸ UK  ASCI I.1 — "clinically proven" requires trial data on file
 ▸ DE  ASCI I.1 — substantiation dossier not registered for DE
 ▸ VN  ASCI AI Tier 1 — unauthorised likeness. Prohibited.
```

Each chip clickable → that variant's Asset Detail. Buttons: `[Ship 9 cleared]` `[Fix 2]` `[Regenerate 1]`.

**A `Run clearance` button animates the 12 chips resolving one by one over ~4 seconds** (grey → verdict colour) with a live counter. **The single most demo-able animation in the build — make it feel fast and inevitable.**

**The 12 variants (seed data):**

| # | Market | Lang | Verdict | Finding |
|---|---|---|---|---|
| 1–2 | IN | Hindi, English | 🟢 | — |
| 3 | AE | Arabic | 🟢 | — |
| 4 | ZA | English | 🟢 | — |
| 5 | BR | Portuguese | 🟢 | — |
| 6 | ID | Bahasa | 🟢 | — |
| 7 | PH | English | 🟢 | — |
| 8 | TH | Thai | 🟢 | — |
| 9 | MX | Spanish | 🟢 | — |
| 10 | **UK** | English | 🟠 | ASA/CAP 3.7 — *"Clinically proven 72h protection"* substantiated under **DOS-EU-4471**, no UK trial data on file. Fix: *"72h freshness"* · Alt: attach Study #A-2291 |
| 11 | **DE** | German | 🟠 | Same claim, **dossier not registered for DE**. Same two fixes |
| 12 | **VN** | Vietnamese | 🔴 | **ASCI-AI-H** — variant reproduces the match official's likeness without consent. High-risk tier: **prohibited, a label does not cure it.** Secondary: broadcaster IP exposure. **No fix — regenerate without likeness** |

### 11.6 Moment Risk — Demo B, the most important screen

```
⛔  DO NOT ACTIVATE ON THIS MOMENT
    Confidence 0.86 · escalated to Brand Director

 1. Reputational adjacency — the moment is entangled with an ongoing
    public dispute; brand association reads as opportunistic
 2. Market divergence — acceptable in 3 markets, high-risk in 6
    [market grid: 3 green · 3 amber · 6 red]
 3. Brand constraint — conflicts with the Dove Real Beauty pledge
    (bindingLevel: PLEDGE, not guideline)
 4. Precedent — 2 comparable activations withdrawn within 48h
    [links to MEMORY records]

 ⚠ Conventional copy-testing will not catch this.
   Google's "Dear Sydney" tested well and was pulled.
   Coca-Cola's AI ad scored 5.9/5.9 on System1 and drew a boycott.

 [Override with justification]  [Request legal review]  [Archive]
```

### 11.7 Rule Replay — Demo C

Rule-set version selector + `[Publish v2026.09]`. On click: diff panel → counter animates 0 → 1,412 over ~6s → results table.

```
Diff:   ASCI-AI-M tightened — synthetic product demonstrations now
        require an on-screen label for the FULL duration, not first 3s
Scope:  1,412 live assets re-evaluated
Result: 6 newly non-compliant, ranked by reach

  1. Lakmé  · Reel   · IN · 2.4M reach · label 3s of 18s   [Remediate]
  2. Dove   · Video  · IN · 1.9M       · label 3s of 24s   [Remediate]
  3. Pond's · Reel   · IN · 1.1M       · no label          [Remediate]
  4. Sunsilk· Static · ID · 840K       · label below fold  [Remediate]
  5. Vim    · Reel   · IN · 610K       · label 3s of 15s   [Remediate]
  6. Axe    · Video  · ZA · 420K       · label 3s of 30s   [Remediate]

Footer: "Re-evaluated in 6.2s using cached claim extraction.
         Full portfolio replay: 1,412 assets · est. 4m 12s"
```

**This must genuinely re-invoke `evaluate()`** over `/data/assets.ts`, not read a fixture. Same code path as clearance.

### 11.8 Audit Trail

Append-only table: timestamp · asset · rule set version · verdict · findings · approver · action. `[Generate Regulator Response Pack]` on any row → modal showing the assembled dossier: asset, clearance record, rule version, substantiation dossier, approver, snapshot hash.

### 11.9 Creator Sweep (WATCH)

Table of monitored posts: handle · brand · platform · disclosure present? · claim match · snapshot · status. Show 3 violations with `[Send fix request]` → modal with an auto-drafted plain-language message to the creator, deadline and escalation ladder. Each row has `[View snapshot]` → modal showing a **real captured render with timestamp and hash**. *This proves the evidence primitive.*

### 11.10 Portfolio Exposure (PULSE)

Heat map: brands (rows) × markets (columns), shaded by exposure. Side panels: *Claims expiring in 90 days: 7* · *In-market drift rate: 1.8%* · *Creator disclosure compliance: 91%*. **Visible label: "Illustrative data."**

### 11.11 Precedent Search (MEMORY)

Single search box, four pre-seeded query chips:
- *"Have we run a 72-hour protection claim in India?"*
- *"Why did we stop saying Health Food Drink?"*
- *"What did legal say about 99.9% germ claims?"*
- *"Any precedent for activating on a live sports moment?"*

Results: claim · market · verdict · date · dossier · outcome · linked assets. Retired claims show a red **RETIRED** badge with the reason.

### 11.12 Live Check — the "try it yourself" moment

Textarea + market dropdown + optional image upload → `[Run clearance]`. POSTs to `/api/check`; renders results in the **exact same finding cards**.

**Reliability requirements — non-negotiable:**
- Timeout at 12 seconds
- On any error or timeout, fall back **silently** to the deterministic checker over the seeded rules
- **The screen must never show an error to a judge**
- Three pre-loaded example chips so it demos with no network

**Canonical test input:**
> *"Our new formula is 100% natural and clinically proven to remove 99.9% of germs. Dermatologist recommended. Limited stock — only 3 left!"*

Expected findings: **CCPA-100** (critical) · **CCPA-GW-3** (critical) · **ASCI-I-1** (critical, unsubstantiated in market) · **CCPA-DP-7** (major, false urgency) · **ASCI-IV-3** if "recommended" reads as superiority.

### 11.13 Interaction & motion

- Verdict chips resolve with a 200ms colour transition. No spring, no bounce.
- **Progressive disclosure:** deterministic findings at ~400ms, judgment findings stream over 2–3s. Never a blank spinner. This makes the architecture visible.
- Finding cards open on hover (desktop) and click. **Never modal.**
- `Apply` mutates copy inline with a highlight flash, then the chip animates to GREEN.
- Counters animate with `requestAnimationFrame`.
- Keyboard: `j`/`k` between findings, `a` to apply, `Esc` to close.

---

## §12 The AI Studio agent

The artefact HUL's guide explicitly asks for, and the "functional agent demonstration" the rulebook requires.

### 12.1 System Instructions architecture

Order matters. Build in this sequence:

1. **Identity + scope.** *"You are PRAMAAN, a brand-governance clearance agent for Hindustan Unilever. You evaluate marketing copy against Indian advertising regulation and an approved-claims ledger. You do not write marketing copy. You do not clear anything you cannot cite a rule for."*
2. **The rule pack**, inline — §7 as compact structured text: `id | regulator | clauseRef | title | test | severity | jurisdictions`.
3. **The claims ledger** — §8 with markets, dossier ref, evidence grade, status.
4. **Decision procedure, in strict order:**
   a. Run deterministic checks (prohibited terms, 100% claims, false urgency, disclosure presence, therapeutic verbs)
   b. Extract every objective claim; resolve each against the ledger **for the stated market**
   c. Apply judgment rules
   d. Aggregate → RED / AMBER / GREEN + confidence
   e. **If confidence < 0.6, abstain and escalate. Never guess.**
5. **Output contract.** Strict JSON matching the `Finding` schema. Every finding carries `ruleId` and `clauseRef`. Explicit instruction: *"If you cannot cite a rule from the pack above, do not emit the finding."* — the prompt-level expression of the `NOT NULL` constraint.
6. **Three few-shot examples** — one GREEN, one AMBER with a working rewrite, one RED with no available fix. **These teach format and calibration and matter more than any other part of the prompt.**

### 12.2 Publishing checklist

- [ ] Model: most capable available in the dropdown for multi-step reasoning
- [ ] Tested against the §11.12 canonical input until it reliably fires the expected rule IDs
- [ ] Tested against a clean input to confirm it returns GREEN without inventing findings
- [ ] Tested against an ambiguous input to confirm it abstains rather than guessing
- [ ] Saved as `Techtonic_<TeamName>_PRAMAAN`
- [ ] Saved to team Google Drive when prompted
- [ ] Sharing set to **"Anyone with the link can view"**
- [ ] **Link opened in an incognito window while signed out** — this single check has killed more competition demos than any bug
- [ ] URL on Slide 3 with a QR code

---

## §13 Acceptance criteria

Run as a two-person checklist — one driving, one watching.

**Functional**
- [ ] App opens directly into Inbox — no landing page
- [ ] Batch Review animates 12 chips to 9/2/1 in under 5 seconds
- [ ] **Zero findings render without a clause reference** — grep the codebase for any path that can emit one
- [ ] `Apply` visibly rewrites the copy and flips the verdict to GREEN
- [ ] `Justify` writes a visible entry to Audit Trail
- [ ] Moment Risk shows a refusal with four reasoning cards and the copy-testing callout
- [ ] Replay animates to 1,412 and produces its 6 assets **from the actual engine**, not a fixture
- [ ] Live Check returns a result or falls back silently — **never shows an error**
- [ ] Snapshot modal shows a real captured render with timestamp and hash
- [ ] Persona switcher changes available actions (Legal sees Override, ABM does not)
- [ ] Accuracy card shows measured numbers
- [ ] Ring 0 split-screen demo renders the constraint pack

**Integrity**
- [ ] Prototype/illustrative-data footer visible on every page
- [ ] Every rule in `/data/rules.ts` has a `sourceUrl`
- [ ] Draft-status rules (ASCI-AI-*) are visibly labelled "draft"
- [ ] No verbatim statutory text anywhere in the UI

**Resilience**
- [ ] **Full walkthrough works with wifi off**, except Live Check
- [ ] Reset button returns to a clean state
- [ ] AI Studio link opens for a signed-out user
- [ ] Screen recordings of Demos A, B, C exist as backup

---

# PART IV — HOW IT RUNS

## §14 Non-functional requirements & governance

### 14.1 NFRs

| Dimension | Target | Note |
|---|---|---|
| Latency — deterministic only | **< 2s** | Must feel instant inside Sketch Pro |
| Latency — full multimodal clearance | **< 90s p95** | The number on the slide |
| Latency — batch (400-variant set) | < 15 min | Parallel fan-out |
| Replay — full portfolio | Overnight (<8h) for 100k assets | The killer feature must be operationally real |
| Throughput | 100k checks/yr HUL India; architect for **1M+ global** | 400 assets × brands × markets compounds fast |
| **Recall on high-severity violations** | **> 95%** | **Missing a RED is the only unacceptable failure** |
| False-positive rate | **< 10%** | affil.ai's warning: *"If your compliance software creates more violations than the amount of content you have to monitor, you aren't really saving time"* |
| Abstention | Below confidence floor → escalate, never guess | |
| Data residency | India data in India | **DPDP Act 2023** — first-party consumer and creator data |
| Access | RBAC + SSO; legal holds absolute override | Maker-checker preserved |
| Retention | 7 years, WORM | Regulator lookback |

### 14.2 Human oversight architecture

| Layer | Rule |
|---|---|
| Deterministic + low consequence | **Auto-clear**, logged, sampled for QA |
| Probabilistic anything | **A human presses the final button** |
| High consequence | Full director → VP chain, **untouched** |
| Below confidence floor | Agent **abstains** and escalates |
| Any finding | Human override authority is **absolute and logged** |
| Publication | **PRAMAAN never publishes. It clears.** Publication is always human-initiated |

**Say the constraint out loud — it is a strength:** *"This does not flatten a 130-year-old organisation. It moves the rule-check to the drafting moment. Legal keeps the veto; legal stops being the queue."*

**Maps directly onto HUL's existing governance vocabulary:** deterministic vs probabilistic outputs, maker-checker at multiple levels, and the AI Assurance process. **LEDGER produces the evidence AI Assurance currently gathers by hand.**

### 14.3 Model & data governance

- Model versions recorded on every verdict (`model_versions_json`) — a verdict is reproducible only against the model *and* rule version that produced it.
- Production traces recycled as **regression evals** to prove the agent has not drifted between releases.
- Rule authorship is a human role with named accountability (`rule.author`), never model-generated.
- The Claims Ledger is written only by Claims & Technical Insights or by harvested reviewer decisions — never by the model unilaterally.

---

## §15 Cost & roadmap

### 15.1 Cost structure — the seniority signal

**Inference is not the cost driver, and saying so signals seniority.**

~30k tokens per multimodal check × ~100k checks/yr ≈ 3B tokens/yr ≈ **US$30–60k/yr** at list rates *[⚠️ verify current rates before the slide]*.

**The cost is the regulatory analyst and the integration, not the GPU.**

| Phase | Scope | Duration | Indicative |
|---|---|---|---|
| **0 — Pilot** | 3 brands (1 personal care, 1 food, 1 home care), India only, CLEAR + LEDGER | 12 weeks | ~₹1.0–1.5 Cr |
| **1 — Scale India** | 25 brands, WATCH live, PULSE, Brand DNAi + Sketch Pro integration | +6 months | ~₹3–4 Cr |
| **2 — Multi-market** | 6 markets, local-language rule packs, full influencer sweep | +9 months | ~₹5–7 Cr |

**Team:** 1 PM · 4 engineers · 1 ML · **1 regulatory analyst (non-negotiable — the rule packs are the moat, not the model)** · 1 designer.

**Adoption lesson to quote on the roadmap slide** — Moderna, live on Veeva AI: *"the full value of AI is 30% about the technology and 70% about people and process."*

### 15.2 Partnership strategy

| Partner | Why | Instead of |
|---|---|---|
| **LabelBlind** (Mumbai) | FSSAI + 22-country ruleset depth. **HUL is already a customer** | Building food-label rules from scratch |
| **ASCI Ad Advice / Advisory Service** | A paid pre-clearance market already exists. Automating and scaling it is the pitch | Positioning against the regulator |
| C2PA / provenance vendors | Content Credentials ingestion | Building provenance infrastructure |

### 15.3 The three demos

| # | Demo | What it proves | Screen |
|---|---|---|---|
| **A** | **Rexona moment** — 12 variants pre-flighted in 90s → 9 GREEN, 2 AMBER, 1 RED, each clause-cited | Throughput + precision + **it's their own opening story** | §11.5 |
| **B** | **The refusal** — a tempting cultural moment declined, reasoning differing by market | **Judgment, not throughput.** The most important 40 seconds | §11.6 |
| **C** | **The replay** — rule change → 1,412 assets re-evaluate → 6 surface, ranked by reach | The capability **no human org and no competitor has** | §11.7 |
| *D* | *Live Check* — a judge types their own copy | *It isn't a video* | §11.12 / AI Studio |

**Walkthrough order:** open with the market strip (§11.5), not the architecture. Twelve markets, twelve verdicts, twelve clauses, 90 seconds — that frame makes the whole thesis concrete in about eight seconds of screen time.

---

## §16 Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| **Live demo fails on stage** | Medium | Screen recordings of all three demos made in advance. Full walkthrough works offline |
| **AI Studio link inaccessible to judges** | Medium | Verified in incognito, signed out, before submission |
| **A judge asks "isn't this Brand DNAi?"** | **High** | §4.5, answer 1. Input vs output layer. Data repository vs decision service |
| **A judge asks "isn't legal the real problem?"** | High | §4.5, answer 3. Lead with the practitioner quote that legal isn't the enemy |
| **A judge challenges a regulatory citation** | Medium | Every rule carries a `sourceUrl`. Draft-status rules visibly labelled. Never claim verbatim text |
| **A judge challenges the ROI number** | Medium | Lead with the *unlock* framing (Theory of Constraints), not the saving. Use Indegene's measured 30%/40% — the only measured outcome in the pack |
| **Overclaiming detected** | **Fatal if it happens** | Seeded-vs-live labelled in UI and stated aloud. §18 do-not-assert list observed absolutely |
| **The panel wants speed, not governance** | **High — the biggest strategic risk** | Reframe first, early, explicitly: *governance is the throttle, not the brake.* Demo A **is** a speed demo |
| Rule pack looks thin | Low | 40 rules across 8 regulators, each with clause ref and source |
| Scope creep into creative generation | Medium | §1.4 cut list, stated on stage as prioritisation rationale |

### 16.1 The strategic risk, named

The case opens with the Rexona meme — a **speed and creativity** story. A panel primed by that story may instinctively want a product that makes brands *faster at capturing moments*, not one that clears what's already been made.

**The reframe must be said explicitly and early, not left implicit:**

> *"HUL already has the hands and the ears. Sketch Pro makes 400 variants in two hours; Sangam finds the moment. What's missing is the thing that lets you actually ship them inside a four-day window. Governance isn't the brake here — it's the throttle. Right now it's stuck at 1x while generation runs at 7x."*

If a judge has to connect "compliance" to "speed" themselves, you lose them before you reach the differentiation argument.

---

## §17 Where PRAMAAN sits in the wider portfolio (Slide 2)

PRAMAAN is **Sanction** in a four-stage decision loop. Do not present it standing alone.

| Stage | Product | Mechanism | Status |
|---|---|---|---|
| **Signal** | Router | Fuses existing feeds (Sangam trends, social, q-commerce, search intent, Shikhar reorders) and **pushes** brand-matched opportunities to the owning team, rather than waiting to be queried | Concept |
| **Score** | Durability Index | Separates fad from trend using **repeat-consumption and organic-pull proxies** rather than engagement volume. **Shikhar reorder-without-promo is the offline pull signal** — an asset only HUL has | Concept |
| **Sanction** | **PRAMAAN** | Risk-tiered clearance with clause-cited verdicts | **This PRD** |
| **Scale** | Escalation gate | Once a bet clears a defined pull threshold, auto-escalate into the machine HUL alone owns — Shikhar, Samadhan, 2.2M outlets | Concept |

**Why Score matters even though it isn't built:** the panel explicitly planted the fads-vs-trends question on camera — *"nobody can predict trends… I'd love to see this surface in the stories you tell us."* It is a scored dimension of the pitch that does not appear in the written rubric. Score needs one clear paragraph and a formula on Slide 2, not a prototype.

**Why PRAMAAN is the one to build first:** Theory of Constraints. Signal, Score and Scale all produce *more things to ship*. Sanction is the stage that currently caps throughput. Relieving a non-constraint produces nothing.

---

## §18 Verification & do-not-assert list

**Read this before writing any slide.**

### 18.1 Must verify before asserting

| # | Item | Why it matters |
|---|---|---|
| 1 | **EU AI Act Art. 50 status** — Nov 2025 Digital Omnibus reportedly seeks to delay parts | Highest priority. Do not put the 2 Aug 2026 date on a slide unverified |
| 2 | **ASCI AI-labelling guidelines — final or still draft?** | Released draft 12 May 2026, consultation closed 13 Jun 2026 |
| 3 | Current LLM list pricing | The US$30–60k/yr inference figure depends on it |
| 4 | HUL A&P spend figure if used | BMI was 16.1% of turnover in H1 2026 on €25.6bn — check before extrapolating |
| 5 | Submission deadline reconciliation | Rulebook says 20 Aug; the launch session said top-5 announced 25 Aug |

### 18.2 Do not assert — and scoring opportunities if a rival does

| Claim | Verdict |
|---|---|
| "Consistent branding increases revenue 23–33%" | **Hypothetical self-estimate**, n=200–450, vendor-sponsored, and the vendor has quietly retired it. The published band was 10–20%, not 33% |
| "Lucidpress 2026 study, 1,800 brands, 23.4% uplift" | **Fabricated. No such study exists.** Lucidpress hasn't existed as a brand since 2022. Almost certainly AI-generated statistical fabrication |
| "Gartner: 80% of creative content will be AI-generated by 2026" | **Unlocatable in any Gartner document** |
| "Asset costs dropped by more than 1,000%" | **Arithmetically impossible** |
| "MLR takes 50–60 days per content piece" | **No primary source.** Use Veeva's 29.9 days |
| "60–70% of content goes unused" | Usable **only** with B2B + 2013 + no-methodology caveats |
| Gartner martech-utilisation % off the CMO Spend release | **Wrong survey. Not in that document** |
| A Marketing Week "% time on admin" figure | **Does not appear to exist publicly** |
| **"HUL had an ad pulled"** | **No such instance found 2020–2026.** Say *"HUL has been lucky, and it sits in India's worst-performing ASCI category"* |
| ZoomRx Ferma as an MLR tool | It is competitive intelligence, not promotional review |
| Commercial damage from Coca-Cola's AI ads | **No sales, share or tracker impact was published for either campaign** |
| Criticism of Unilever's AI push | **Weak.** No consumer backlash, no union statement, no on-record agency criticism naming Unilever. Frame as *risk exposure*, not damage done |
| Linking the CMO departure (announced 18 Dec 2025) to AI | **No evidence.** Do not |

### 18.3 Sourcing hierarchy for the deck

1. **Primary regulator documents** (ASCI annual reports, PIB releases, MeitY FAQs) — strongest
2. **Company-primary** (Unilever press releases, results announcements, named execs on record)
3. **System telemetry** (Veeva Pulse — workflow logs, not survey opinion)
4. **Measured third-party outcomes** (Indegene's 30%/40% — the only measured client outcome in the pack)
5. **Practitioner verbatim** (r/marketing, LinkedIn) — excellent for texture, never for numbers
6. **Vendor surveys** (Adobe, Jasper, Bynder) — label as [VENDOR], use direction not precision
7. **Vendor marketing claims** (Falcon MLR, Saifr) — label explicitly, use for feasibility only

**Pre-empt your own weaknesses inline.** Put the counter-quote on the slide yourself: *"The legal team don't slow us down, they reduce the risk of us getting sued and people losing their jobs. They aren't the enemy."* Acknowledging the strongest objection before a judge raises it is worth more than any additional supporting statistic.

---

## Appendix A — The pitch in one paragraph

> Unilever taught its brand teams to generate 400 assets where they used to make 20, in 21 markets, with 300,000 influencers, for content that lives four days. It did not teach them to clear it. Ninety-one percent of marketing teams now use AI to create; twenty-six percent use it to govern. Meanwhile ASCI catches ninety-three percent of violations through its own always-on AI, finds ninety-eight percent of scrutinised ads need modification, and names Personal Care India's worst category. **The regulator has the agent. The advertiser does not.** PRAMAAN is that agent: it clears every asset before it ships and every day after — against live regulation, approved claims, brand code, likeness consent and cultural risk — cites the clause for every verdict, and re-runs the entire portfolio the day a rule changes. It removes no approver and flattens no hierarchy. It moves the rule-check to the moment of drafting, which is the one place it has never been. **Brand DNAi governs what the AI reads. PRAMAAN governs what the world sees.**

## Appendix B — Lines to say on stage, verbatim

**On relevance:** *"Personal Care is the most-complained-about category in India, ninety percent of its cases need modification, and forty-five percent come from influencers the brand never briefed. This isn't a pharma problem borrowed for a CPG deck. Pharma is just the only industry that publishes its cycle times — so we used it to prove the solution works, not to prove the problem exists."*

**On form factor:** *"PRAMAAN is not a dashboard. A dashboard would be a queue with better lighting. It's Grammarly for brand claims — ambient, inline, in the tools where the work already happens — with a governance console the brand manager never has to open."*

**On the pharma disanalogy:** *"Pharma solved this with committees CPG will never staff. That's why CPG needs the agent more than pharma did — and why nobody has built it: the reference standard doesn't exist yet. Building it is the product."*

**On table stakes:** *"Half this product is table stakes. We built the table stakes so the three things nobody has could exist on top of them."*

**On Ring 0:** *"Everyone else checks after. We constrain during."*

**On the moat:** *"A foundation model is buyable. HUL's claims dossiers and its adjudication history are not."*

**On scope honesty:** *"CLEAR and LEDGER are live — type into them. WATCH is a ten-URL crawl. PULSE is seeded. We'd rather tell you that than have you find it."*
