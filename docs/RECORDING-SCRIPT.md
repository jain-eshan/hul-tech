# PRAMAAN — demo recording script

Why record at all: PRD §16 names "live demo fails on stage" as a medium-likelihood risk,
mitigated by having all three demos recorded in advance. This script is the narration
for that recording — the *words*, not new content. Everything said here is lifted or
trimmed from `lib/tour.ts`, which is the one already-reviewed source of truth for what
this product says about itself.

**Two ways to use this:**

1. **Full tour recording** (~4 min, safest) — open the app, press **Guided walkthrough**
   top-right, and read each card's body text aloud as it advances itself. This is the
   entire `lib/tour.ts` script already built into the product — you don't need to click
   anything, just talk over it.
2. **Tight 3-demo recording** (~90 sec, for a time-boxed slide/video slot) — the script
   below. Manual clicks, no tour overlay.

Use whichever fits the submission's actual video constraint (check the rulebook for a
length cap before recording).

---

## Tight script — Demos A, B, C (~90 seconds)

Record at `https://hul-tech.vercel.app`. Do two dry runs
before recording (PRD §10.4) — the second one is always tighter.

### Open (0:00–0:10)

*[Screen: Inbox, "/"]*

> "Sixty assets. Fifty-three of them cleared without asking anyone. This is PRAMAAN —
> it clears every marketing asset before it ships, against live regulation, and cites
> the clause for every verdict."

### Demo A — Rexona moment, throughput (0:10–0:35)

*[Navigate to /batch. Click "Run clearance."]*

> "One Rexona campaign, twelve markets. Watch the chips resolve — each one is a real
> evaluation, not an animation."

*[Wait ~5s for the run to finish.]*

> "Nine cleared, two need an edit, one is blocked — and each one carries the clause
> that decided it. The UK and Germany failures are the same claim, unregistered in
> those two markets. Vietnam reproduces a real person's likeness without consent, which
> a label can't cure."

*[Optional: click into REX-10, show the underlined claim + Apply → chip turns green.]*

> "The flag sits on the exact phrase, not the asset. Apply the fix, and it's
> re-evaluated — not toggled."

### Demo B — the refusal, judgment (0:35–1:00)

*[Navigate to /moment.]*

> "This is the part that isn't throughput. A creator trend contrasts real and
> AI-generated beauty imagery, and a brand team wants to join it using AI-generated
> models."

*[Point at the four reasoning cards.]*

> "The agent declines. The moment is a criticism of the exact method proposed, the risk
> differs by market, and it collides with a public brand pledge. Google's 'Dear Sydney'
> tested well and was pulled anyway. Conventional copy-testing doesn't catch this."

### Demo C — the replay, the capability nobody ships (1:00–1:25)

*[Navigate to /replay. Click "Publish v2026.09."]*

> "A rule changes: synthetic content now needs its label for the full duration, not
> just the first three seconds. Watch what happens to everything already live."

*[Wait ~8s for the re-evaluation to finish.]*

> "Six assets just became non-compliant, ranked by reach — found overnight, not never.
> No human org re-reads a live portfolio the day a rule changes. This does."

### Close (1:25–1:35)

> "Brand DNAi governs what the AI reads. PRAMAAN governs what the world sees."

---

## Recording checklist (PRD §10.4, §16)

- [ ] Two dry runs before the recording take
- [ ] Record all three demos before anyone is tired
- [ ] Confirm the deployed URL loads in a fresh/incognito window first — an
      un-refreshed cache showing stale state has killed demos before
- [ ] If including the AI Studio agent: verify its link opens in an incognito window,
      signed out, before it goes anywhere near a slide or a recording
- [ ] Keep the recording as a backup even if you plan to demo live — don't skip it
      because the live run looked fine in rehearsal
