// The guided walkthrough — a judge should be able to understand this product alone,
// in about four minutes, without anyone standing next to them.
//
// The arc is deliberate. It opens on the constraint (generation scaled, clearance did
// not), proves throughput, then proves judgment, then proves the thing no competitor
// ships. Governance is shown by switching persona mid-tour rather than described,
// because "Legal keeps the veto and stops being the queue" is a claim you either
// demonstrate or leave unbelieved.
//
// Every step names who it helps. A feature tour is forgettable; a tour that says
// "this is Priya's Tuesday" is not.

import type { Persona } from "@/lib/types";

export interface TourStep {
  /** Route to be on before this step renders. */
  route: string;
  /** CSS selector to spotlight. Omit for a centred card. */
  target?: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Who this step is for, shown as a chip. */
  who?: string;
  /** Switch persona before the step renders — the governance model, demonstrated. */
  persona?: Persona;
  /** Click this selector on arrival, then wait. */
  click?: string;
  /** Wait after arriving, for animations that carry meaning. */
  settle?: number;
  /** Invite the judge to act rather than watch. */
  interactive?: string;
}

export const TOUR: TourStep[] = [
  {
    route: "/",
    eyebrow: "Start here · about four minutes",
    title: "Unilever learned to make 400 assets. It did not learn to clear them.",
    body:
      "Sketch Pro turns one concept into 400 variants in two hours, across 21 markets. Social video lives about four days. But every one of those assets is worth nothing until someone confirms it is legal to publish — and that step is still a human reading copy, in order, one asset at a time.\n\nGeneration scaled roughly sevenfold. Clearance did not move. PRAMAAN is the missing half.\n\nThis walkthrough drives itself. Use Next, or the arrow keys.",
  },
  {
    route: "/",
    target: "table",
    eyebrow: "The morning queue",
    title: "Sixty assets. Fifty-three cleared without asking anyone.",
    body:
      "This is Priya's inbox — an Assistant Brand Manager in Personal Care. Every row was evaluated against 47 rules from 8 regulators the moment it was created.\n\nThe green ones are done. Not 'probably fine' — cleared, with the reasoning stored. She ships them without waiting for anybody.\n\nWatch the Findings and Route columns. That is the triage that used to be a person's whole week.",
    who: "Priya · Assistant Brand Manager",
    persona: "abm",
  },
  {
    route: "/batch",
    target: '[data-tour="market-strip"]',
    eyebrow: "Demo A · throughput",
    title: "One campaign, twelve markets, twelve different answers.",
    body:
      "A Rexona campaign going to twelve markets. The same creative is legal in nine of them and not in three — and the reasons differ by country.\n\nWatch the chips resolve. Each one is a real evaluation, not an animation playing back a stored result.",
    who: "Priya · and every market team downstream",
    click: "text=Run clearance",
    settle: 5200,
  },
  {
    route: "/batch",
    target: '[data-tour="verdict-summary"]',
    eyebrow: "Demo A · the result",
    title: "Nine ship now. Two need four words changed. One cannot be fixed at all.",
    body:
      "Nine cleared, two need an edit, one is blocked — and each carries the clause that decided it.\n\nThe UK and Germany failures are the same claim: 'clinically proven 72h protection' is substantiated under an EU dossier that was never registered in those two markets. Vietnam is different — it reproduces a real person's likeness without consent, which is prohibited outright. A label does not cure it.\n\nNobody read twelve assets. The reading already happened.",
    who: "Priya · Legal · the market teams",
  },
  {
    route: "/asset/REX-10",
    target: '[data-tour="findings"]',
    eyebrow: "The interaction that matters",
    title: "The flag is on the claim, not the asset. And it comes with the fix.",
    body:
      "An asset-level score tells you something is wrong somewhere. That is not actionable.\n\nHere the exact phrase is underlined, the clause is cited and clickable, and the ledger already knows which wording is registered for the UK. Three ways out: apply the fix, attach the study to keep the original wording, or keep it as is and justify — which is logged.\n\nPress Next and watch the copy change on the left.",
    who: "Priya · the agency writing the copy",
    settle: 3200,
  },
  {
    route: "/asset/REX-10",
    target: '[data-tour="creative"]',
    eyebrow: "One click",
    title: "Fixed, re-evaluated, cleared.",
    body:
      "The copy changed on the left and the verdict went green — because the asset was evaluated again, not because a chip was flipped. If the fix had not actually cleared it, it would still be amber.\n\nThat is the difference between a compliance report and a tool. One tells you about a problem; this one ends it.\n\nDay nine of a review cycle just became four seconds.",
    who: "Priya · saves the round trip",
    click: "button:has-text('Apply')",
    settle: 1400,
  },
  {
    route: "/",
    target: '[data-tour="persona"]',
    eyebrow: "Governance",
    title: "Now sign in as Legal. The same portfolio looks completely different.",
    body:
      "Sixty assets became twenty-one. The fifty-three that auto-cleared never reached a human, so they are not in a human's queue.\n\nThis is the whole argument in one number. Legal keeps an absolute veto — they simply stop being the queue for work that never needed judgment.\n\nPRAMAAN removes no approver. It removes unnecessary approvals.",
    who: "Legal Counsel · judgment calls only",
    persona: "legal",
    settle: 900,
  },
  {
    route: "/audit",
    target: "table",
    eyebrow: "Defensibility",
    title: "Every decision, append-only — including the ones a human overruled.",
    body:
      "No edit path, no delete path. Each row carries the asset, the rule-set version that produced the verdict, the approver and the reasoning.\n\nPress 'Response pack' on any row. That is what gets sent when a regulator writes and asks why an ad ran — the asset, the clearance record, the rule version, the substantiation dossier, the approver and the snapshot, assembled in one click.\n\nNo vendor found links a live ad claim back to the study supporting it.",
    who: "Legal · Regulatory · AI Assurance",
  },
  {
    route: "/moment",
    target: '[data-tour="reasoning-cards"]',
    eyebrow: "Demo B · judgment, not throughput",
    title: "The most valuable thing this agent does is say no.",
    body:
      "A creator trend is contrasting real and AI-generated beauty imagery, and a brand team wants to join it — using AI-generated models.\n\nRead the four cards. The moment is a criticism of the exact method proposed; the risk differs sharply by market; it collides with a public brand pledge that hard-blocks rather than advises; and comparable activations were withdrawn inside 48 hours.\n\nConventional copy-testing cannot catch this. Google's 'Dear Sydney' tested well and was pulled. Coca-Cola's AI ad scored 5.9 out of 5.9 and drew a boycott.",
    who: "Brand Director · and the CMO who never hears about it",
    persona: "director",
  },
  {
    route: "/replay",
    target: '[data-tour="replay-counter"]',
    eyebrow: "Demo C · the capability nobody ships",
    title: "A rule changes. What happens to everything already live?",
    body:
      "Regulators move without warning. The FDA issued one warning letter in 2023 and over a hundred in a single quarter of 2025. FSSAI rescinded its own guidance overnight.\n\nWhen that happens today, nobody can answer 'which of our live assets just became non-compliant?' — because no human org can re-read a live portfolio in a day.\n\nPress Publish and watch. This re-runs the real engine over the portfolio and ranks what broke by reach.",
    who: "Legal · Brand Director · the board",
    click: "text=Publish v2026.09",
    settle: 8000,
  },
  {
    route: "/replay",
    target: '[data-tour="replay-results"]',
    eyebrow: "Demo C · the answer",
    title: "Six assets. Ranked by exposure. Overnight, not never.",
    body:
      "The rule tightened: synthetic content now needs its label for the full duration, not the first three seconds. Six live assets just became non-compliant, biggest reach first.\n\nThis is the complete answer to 'isn't this just a faster reviewer?' No reviewer re-reads 40,000 live assets on the day a rule changes. This is not a faster human — it is a capability the organisation has never had.",
    who: "Legal · Brand Director",
  },
  {
    route: "/watch",
    target: "table",
    eyebrow: "The largest uncovered surface",
    title: "300,000 influencers. Content the brand never wrote and is liable for.",
    body:
      "ASCI processed 1,609 influencer ads last year. 97.3% needed modification, and 45% of Personal Care cases were influencer-led.\n\nTwo of these creators failed on disclosure — one has none at all, one buried it past the 'more' fold, which is not disclosure. A third made a claim the brand never approved.\n\nOpen a snapshot. Violating posts get edited or deleted before anyone can prove what they said, so every detection captures a rendered page, expands hidden text, and hashes it. That turns monitoring into evidence.",
    who: "Priya · Legal · the agency",
  },
  {
    route: "/ring0",
    target: '[data-tour="ring0-split"]',
    eyebrow: "The idea furthest ahead",
    title: "Everyone else checks after generating. This constrains during.",
    body:
      "Left: an unconstrained generator produces copy that breaks four rules, and someone pays to fix it.\n\nRight: the permitted claims and prohibited patterns for that market were injected into the prompt first, so the non-compliant version was never generated. Cost of the fix: nothing.\n\nAs generation goes agentic the caller is another agent, not a person. This is the interface that survives that shift.",
    who: "The AI pipeline itself",
  },
  {
    route: "/accuracy",
    target: '[data-tour="accuracy-metrics"]',
    eyebrow: "Why you can believe any of this",
    title: "We publish our own error rate. Nobody in this category does.",
    body:
      "Measured live over a labelled set, every time this page loads.\n\nRead the amber box at the bottom before you trust the numbers above it — it says what a small, author-labelled set can and cannot establish. We would rather tell you that than have you find it.\n\nAn agent that admits its limits is more useful than one that is confidently wrong. Which is the next screen.",
    who: "AI Assurance · and any sceptic in the room",
  },
  {
    route: "/live",
    target: '[data-tour="live-input"]',
    eyebrow: "Your turn",
    title: "Type anything. It is the same engine, not a demo path.",
    body:
      "Write ad copy — a real one, or something deliberately awful. Pick a market and run it.\n\nTry 'Now with 30% more.' The engine declines to clear it and says why: 30% more than what? It abstains rather than guessing, because an agent that says 'I am not qualified to clear this' is worth more than one that is confidently wrong.\n\nEvery verdict you get here cites a clause. It structurally cannot do otherwise.",
    who: "You",
    interactive: "Type in the box on the left, then press Run clearance. Take as long as you like — the tour will wait.",
  },
  {
    route: "/",
    eyebrow: "That is the product",
    title: "Governance is not the brake. It is the throttle.",
    body:
      "HUL already has the hands and the ears. Sketch Pro makes the variants; Sangam finds the moment. What was missing is the thing that lets you actually ship them inside a four-day window.\n\nPriya ships without asking permission. Legal reviews judgment calls instead of spelling. The Brand Director sees exposure before it becomes news. And the company can answer, for the first time, a question it currently cannot: how compliant are we, right now?\n\nBrand DNAi governs what the AI reads. PRAMAAN governs what the world sees.",
  },
];
