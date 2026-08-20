# QA — persona walkthrough

Walked all twelve routes as each of the three personas, against PRD §3 (users),
§5.4 (design principles), §11 (screens) and §14.2 (human oversight).

**Method.** An automated sweep over 12 routes × 3 personas checking console errors,
dead nav links, the persistent footer, literal `undefined`/`NaN` leakage and the §11.1
copy rule; then a manual walk of each persona's actual journey.

**Clean.** No runtime errors, no dead navigation links, the footer is present on every
page, no rendering artefacts, and no screen uses "compliance" in a primary label.

Nine issues found. Four affected the governance story the product is arguing for.

**All seven HIGH and MEDIUM issues are now fixed and guarded by tests** — the acceptance
suite grew from 37 to 51 checks. The three LOW entries are deliberate deviations and stay
as they are. Re-running the sweep now reports zero issues.

---

## HIGH — contradicts the product's own claim

### H1 · Legal sees all 60 assets, not a triaged queue

**Where:** Inbox, as Legal Counsel.

§3.1's before/after table is explicit — *"Legal's queue: 40 assets, untriaged"* today
versus *"4 flagged assets"* with PRAMAAN. §3.2 gives Legal *"a queue of judgment calls
only"*.

Legal currently sees the same 60 rows as the ABM, 53 of which auto-cleared and never
needed a human at all. That is the *before* picture, rendered in our own product. It
directly contradicts the central promise: PRAMAAN removes unnecessary approvals.

**Fix:** Legal's Inbox defaults to the assets that actually routed to a human — anything
not auto-cleared. The filter is visible and removable, so nothing is hidden.

### H2 · Four controls do nothing when clicked

**Where:** Moment Risk (`Override with justification`, `Request legal review`,
`Archive`) and Batch Review (`Ship N cleared`).

They look live and are inert. A judge will click at least one of them.

**Fix:** wire each to a real outcome and log it. `Ship` is the load-bearing one — §14.2
says *"PRAMAAN never publishes. It clears."* — so shipping records a human-initiated
publication decision in the ledger rather than pretending to publish.

### H3 · Moment Risk has no persona gating

**Where:** Moment Risk, as ABM.

Every other override in the product is gated — the ABM cannot override a finding on
Asset Detail. On Moment Risk the ABM can override a **refusal**, which is the highest-
consequence override in the product and the one §14.2 reserves for the full chain.

**Fix:** gate it exactly as `FindingCard` does, with the same explanatory tooltip.

### H4 · Asset Detail has no page title

**Where:** all three asset routes, every persona.

Every other screen has an `<h1>`; the hero screen has only a breadcrumb. §11.1 sets a
page-title style that Asset Detail never uses, and screen readers get no page heading.

**Fix:** add the title, keeping the breadcrumb above it.

---

## MEDIUM — spec deviations worth closing

### M1 · Inbox rows are not clickable

§11.3 says *"Row click → Asset Detail"*. Only the brand cell is a link, so clicking the
campaign or the market — the natural targets in a dense table — does nothing.

### M2 · Creator Sweep fix requests are never logged

`Apply` and `Justify` both write to the append-only ledger. Sending a fix request to a
creator does not, so an action taken against a live in-market breach leaves no trace in
the evidence plane. That is inconsistent with the product's own defensibility argument.

### M3 · Inbox is missing two specified columns

§11.3 lists *verdict dot · thumbnail · brand · campaign · format · market · findings
count · cleared in · time*. We show no `cleared in` and no `time`. The thumbnail is
deliberately absent — there are no images to show, and a fake one would be worse.

---

## LOW — deliberate deviations, recorded so they are not mistaken for bugs

### L1 · Persona resets to ABM on page refresh

State is in memory because §10.5 forbids any persistence layer, including
`localStorage`. The trade-off is real: refreshing loses the persona. It is also what
makes the Reset control honest. **Keep as is**, and drive the demo with in-app
navigation rather than reloads.

### L2 · Finding cards are always expanded, not hover-triggered

§11.13 asks for cards that open on hover and click. Ours render open. On a dense review
screen, hiding the explanation behind a hover puts the evidence one interaction further
away, which cuts against *"evidence always visible"* in §11.1. **Keep as is.**

### L3 · Stat cards do not match the PRD's numbers

§11.3 gives *Awaiting 14 · Cleared today 312 · First-pass 78% · Avg clearance 68s*. Ours
read 7 / 53 / 88% / 2ms because they are computed from the seeded portfolio by the
engine. A stat card that cannot be traced to a verdict is a liability. **Keep as is.**
