# Design gaps — what the PRD does not specify

The PRD's §11 is unusually complete for a design spec: tokens, type scale, layout
grid, motion timings, copy rules and eleven screen layouts are all fixed. **Most of
the product does not need a designer.** What follows is only what is genuinely missing,
sorted by whether it blocks the build.

Severity: **BLOCKING** (a listed acceptance criterion cannot be met) ·
**DECISION** (build can proceed once someone chooses) · **POLISH** (a sensible default exists).

---

## A. Screens required by §13 but absent from §11 — **BLOCKING**

Three acceptance criteria in §13 point at screens that were never specified, and that
have no slot in the §11.2 navigation:

| # | §13 criterion | What is missing |
|---|---|---|
| A1 | "Accuracy card shows measured numbers" | No layout in §11, no nav entry. Where does it live — a LEDGER sub-page, a footer link, a modal? What does it show beyond precision/recall/FPR — the labelled-set size, the date, the per-rule breakdown? |
| A2 | "Ring 0 split-screen demo renders the constraint pack" | §9 Flow 2 specifies the *API*; §11 specifies no *screen*. "Split-screen" implies unconstrained-vs-constrained generation side by side, but neither pane is designed |
| A3 | §11.2 nav lists **WATCH → Live Assets** | §11.9 specifies Creator Sweep only. The B1 owned-asset drift screen has a nav entry and no layout |

**Recommendation:** A1 as a panel inside Audit Trail (cheapest, and it belongs with
defensibility). A2 as a two-pane page under CLEAR. A3 cut from the nav rather than
invented — an unbuilt nav item reads worse than a shorter nav.

---

## B. Narrative content that functions as design — **DECISION**

These screens are *layout-complete but content-empty*. Their value is entirely the
words, so nobody can build them without an answer.

| # | Screen | The gap |
|---|---|---|
| B1 | **Moment Risk (§11.6)** — the most important 40 seconds of the pitch | **The moment itself is never named.** The spec says "an ongoing public dispute". Which brand, which moment, which 12 markets in the grid? §11.6 references the Dove pledge, but Demo A is Rexona — is Demo B a different brand? This is the single largest content gap in the PRD |
| B2 | **MEMORY (§11.11)** | Four query chips are given; none of the four result sets are written |
| B3 | **PULSE (§11.10)** | "brands (rows) × markets (columns)" — which brands, which markets, what exposure scale, what legend |
| B4 | **Creator Sweep (§11.9)** | "Show 3 violations" — the three are not written, nor is the auto-drafted creator message |
| B5 | **Rexona variants 1–9 (§11.5)** | The three failing variants (UK/DE/VN) are fully specified. The nine passing ones have no copy — and they render in Hindi, Arabic, Portuguese, Bahasa, Thai, Spanish, Vietnamese, German. **Who writes and checks eight non-English strings?** |

⚠️ **B1 carries a real risk.** A refusal demo built on a *live* public controversy could
itself be the thing a judge objects to. The safe construction is a clearly-labelled
fictional composite that still exercises all four reasoning cards. Recommend that unless
someone with better judgement of the room says otherwise.

---

## C. Visual assets — **DECISION**

| # | Item | The gap |
|---|---|---|
| C1 | **PRAMAAN logo** | §11.2 asks for a "[seal/stamp glyph]" — not designed. A lucide icon is the zero-cost answer |
| C2 | **Asset previews** | "CSS-mocked frame or placeholder" (§11.4). Fidelity undefined: do we render believable fake ad creatives, or honest grey placeholders? Believable creatives read better and cost hours we may not have |
| C3 | **Third-party marks** | Seeded data uses real HUL brands (Rexona, Dove, Lakmé, Sunsilk, Pond's, Vim, Surf, Horlicks). Naming them in data is inherent to the PRD. **Rendering their logos is a separate call** and should be a deliberate one |
| C4 | **Variant 12's likeness demo** | The RED case is "reproduces the match official's likeness without consent". A demo about unauthorised likeness must not itself use a real person's image. Needs an abstract or synthetic-obvious treatment |
| C5 | **Video scrubber + severity markers** (§11.4) | Called for, never drawn |
| C6 | **Bounding-box overlay** (§11.4) | Colour, stroke, label placement undefined — inherit verdict colours is the obvious default |
| C7 | Inbox thumbnails, favicon | Undefined |

---

## D. The 3-slide PPT — **BLOCKING, and the largest unspecified surface**

The PRD maps *content* to slides thoroughly (§1–4 → the business case; §6's 2×2 and §17's
four-stage loop → slide 2; §14–17 → the roadmap slide; §15.3 → the demo links). It
specifies **nothing about the deck's design**: no template, no aspect ratio, no type or
colour system, no diagram treatment for the reinforcing loop (§4.2) or the four rings (§5.1),
no QR placement.

This is a graded artefact and it cannot be cut. It needs either an existing team template
or an explicit "match the app's design system" instruction.

---

## E. Interaction detail — **POLISH** (sensible defaults exist, listing so nobody re-litigates)

| # | Gap | Proposed default |
|---|---|---|
| E1 | Loading treatment — §11.13 forbids a blank spinner but doesn't say what replaces it | Skeleton rows for deterministic findings, then judgment findings fading in |
| E2 | Persona switcher — visual, and what changes beyond "Legal sees Override" | Sidebar-footer select; persona gates action buttons only, never data |
| E3 | Reset button (§13 resilience) — no placement | Footer, right-aligned, muted |
| E4 | Confirmation pattern for Apply / Justify / Send fix request | Inline state change; §11.13 already bans modals for finding cards |
| E5 | Focus rings, disabled and hover states | shadcn defaults, re-tokened to `--accent` |
| E6 | Table row height, sort affordance | 44px rows, sort on click, no visible chrome until hover |

---

## F. One spec conflict worth resolving — **DECISION**

§12.1(5) mandates the AI Studio agent output **strict JSON**. §10.1 describes that same
agent as the artefact where "a judge types their own ad copy and gets a clause-cited
verdict".

A judge who types a sentence and receives a wall of raw JSON has had a worse experience
than the web app gives them. Recommend the system prompt emit a short human-readable
verdict **followed by** the strict JSON block — the JSON is what proves the schema
discipline, the prose is what a judge actually reads. This costs one paragraph in §12.1
and materially improves the "try it yourself" moment.

---

## G. Not gaps — specified, do not re-open

Colour tokens · type scale · 240px sidebar / 1280px content · verdict-colour discipline ·
motion timings (150–200ms, no bounce) · keyboard map (`j`/`k`/`a`/`Esc`) · copy rules
("Clearance", never "compliance") · persistent footer text · desktop-only at 1440×900 ·
light mode only · the explicit do-not-build list (§10.6).
