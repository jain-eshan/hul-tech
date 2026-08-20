"use client";

import { useState } from "react";
import { Ban, ArrowUpRight, Check } from "lucide-react";
import { useApp, canOverride, approverName, PERSONAS } from "@/lib/store";
import { verdictColor, verdictBg } from "@/lib/ui";
import { brandCodex } from "@/data/claims";
import type { Market } from "@/lib/types";

// PRD §11.6 — Demo B. The most persuasive 40 seconds in the pitch, because it proves
// judgment rather than throughput. A judge who sees a well-reasoned "no" stops
// worrying about hallucination.
//
// The moment is a constructed composite, labelled as such on screen. Building a
// refusal demo on a live public controversy would make the demo itself the thing the
// room reacts to, and the reasoning is what is being judged, not the topicality.

const GRID: { market: Market; level: "GREEN" | "AMBER" | "RED"; note: string }[] = [
  { market: "BR", level: "GREEN", note: "AI-in-advertising sentiment broadly neutral" },
  { market: "MX", level: "GREEN", note: "No active discourse on synthetic imagery" },
  { market: "TH", level: "GREEN", note: "Trend not present in market" },
  { market: "ZA", level: "AMBER", note: "Emerging discourse, low volume" },
  { market: "PH", level: "AMBER", note: "Creator-led, brand participation untested" },
  { market: "AE", level: "AMBER", note: "Category sensitivity around depiction" },
  { market: "IN", level: "RED", note: "Highest trend volume; Personal Care already the most-complained category" },
  { market: "UK", level: "RED", note: "Advertiser participation reads as appropriating the criticism" },
  { market: "DE", level: "RED", note: "Synthetic-media disclosure duty in force" },
  { market: "VN", level: "RED", note: "Likeness enforcement uncertainty" },
  { market: "EG", level: "RED", note: "Depiction norms conflict with the format" },
  { market: "ID", level: "RED", note: "High trend volume, brand-negative framing" },
];

const CARDS = [
  {
    n: 1, title: "Reputational adjacency",
    body: "The trend is a criticism of AI-generated beauty imagery — creators posting real-versus-synthetic comparisons and inviting audiences to spot the difference. A beauty advertiser joining it with AI-generated models is not participating in the joke; it is the subject of it. Brand association here reads as opportunistic at best and as self-parody at worst.",
  },
  {
    n: 2, title: "Market divergence",
    body: "This is not one global score. The trend has effectively no presence in three markets and is brand-negative in six, and the same creative would land as unremarkable in São Paulo and as an own goal in Mumbai. A single global verdict would be wrong in both directions.",
  },
  {
    n: 3, title: "Brand constraint",
    body: `${brandCodex[0].ruleText} Binding level: PLEDGE — not a guideline, not a preference. A pledge hard-blocks. The proposed activation requires exactly the capability the brand publicly committed never to use, and the commitment is on the record with a date attached.`,
  },
  {
    n: 4, title: "Precedent",
    body: "Two structurally comparable activations — a brand entering a discourse that was itself critical of the brand's method — were withdrawn within 48 hours. In India specifically, destruction moves faster than approval: the fastest documented cycle from airing to regulatory suspension to takedown order is roughly two days. There is no costless exit once live.",
  },
];

export default function MomentRisk() {
  const { persona, appendLedger } = useApp();
  const [outcome, setOutcome] = useState<string | null>(null);
  const [justifying, setJustifying] = useState(false);
  const [reason, setReason] = useState("");

  // Overriding a refusal is the highest-consequence override in the product, so it is
  // gated exactly as a finding override is. An ABM who can override a refusal but not a
  // spelling flag would be a governance model that runs backwards.
  const mayOverride = canOverride(persona);

  const record = (action: string, reasoning?: string) => {
    appendLedger({
      assetId: "MOMENT-2026-08", ruleSetVersion: "v2026.08",
      status: action === "Override" ? "OVERRIDDEN" : "RED",
      findings: 4, approver: approverName(persona),
      action: `Moment Risk — ${action}`, reasoning,
    });
    setOutcome(action);
  };

  const counts = {
    GREEN: GRID.filter((g) => g.level === "GREEN").length,
    AMBER: GRID.filter((g) => g.level === "AMBER").length,
    RED: GRID.filter((g) => g.level === "RED").length,
  };

  return (
    <>
      <h1 className="text-[24px] font-semibold mb-1">Moment Risk</h1>
      <div className="mono text-[var(--text-muted)] mb-5">
        Composite scenario · constructed for this prototype · not a live event
      </div>

      <div className="border rounded px-5 py-4 mb-6"
        style={{ background: verdictBg.RED, borderColor: verdictColor.RED }}>
        <div className="flex items-center gap-2.5 mb-1">
          <Ban size={18} style={{ color: verdictColor.RED }} />
          <span className="text-[17px] font-semibold" style={{ color: verdictColor.RED }}>
            Do not activate on this moment
          </span>
        </div>
        <div className="mono" style={{ color: verdictColor.RED, opacity: 0.85 }}>
          confidence 0.86 · routing: full_chain · escalated to Brand Director
        </div>
        <p className="text-[13px] mt-3 leading-relaxed">
          <span className="section-header">Proposed activation</span><br />
          Enter a fast-rising creator trend that contrasts real and AI-generated beauty
          imagery, using AI-generated models, across 12 markets in the four-day window
          the trend is expected to survive.
        </p>
      </div>

      <div data-tour="reasoning-cards" className="space-y-3 mb-6">
        {CARDS.map((c) => (
          <div key={c.n} className="border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="mono text-[var(--text-muted)]">{c.n}</span>
              <span className="font-medium text-[13px]">{c.title}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text)]">{c.body}</p>
            {c.n === 2 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {GRID.map((g) => (
                    <span key={g.market} title={g.note}
                      className="mono px-2 py-1 rounded border cursor-default"
                      style={{
                        background: verdictBg[g.level],
                        borderColor: verdictColor[g.level],
                        color: verdictColor[g.level],
                      }}>
                      {g.market}
                    </span>
                  ))}
                </div>
                <div className="mono text-[var(--text-muted)]">
                  {counts.GREEN} acceptable · {counts.AMBER} caution · {counts.RED} high risk ·
                  hover a market for its reason
                </div>
              </div>
            )}
            {c.n === 3 && (
              <div className="mono text-[var(--text-muted)] mt-2">
                BRAND-DOVE-1 · {brandCodex[0].source} · bindingLevel: PLEDGE
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border border-[var(--border)] rounded bg-[var(--bg)] px-4 py-3 mb-6">
        <div className="section-header mb-2">Why conventional pre-testing will not catch this</div>
        <p className="text-[13px] leading-relaxed">
          Copy-testing measures whether an audience likes the creative. It does not measure
          what the creative is adjacent to. Google&rsquo;s &ldquo;Dear Sydney&rdquo; was pulled
          after airing, and Google&rsquo;s own statement noted it had{" "}
          <em>tested well before airing</em>. Coca-Cola&rsquo;s AI Christmas ad scored a perfect
          5.9 on System1 in both the US and UK and still drew a boycott campaign.
        </p>
        <p className="text-[13px] leading-relaxed mt-2 text-[var(--text-muted)]">
          A score of 5.9 out of 5.9 and a boycott are not contradictory results. They are
          measurements of two different things, and only one of them is being measured today.
        </p>
      </div>

      {outcome ? (
        <div className="border border-[var(--border)] rounded bg-[var(--bg)] px-4 py-3 text-[13px] flex items-center gap-2">
          <Check size={14} className="text-[var(--verdict-green)]" />
          <span>
            <strong>{outcome}</strong> recorded by {PERSONAS[persona].label} and written to
            the audit trail. Every decision on a refusal is logged, including the decision
            to disagree with it.
          </span>
        </div>
      ) : justifying ? (
        <div className="border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3 space-y-2">
          <div className="section-header">Override the refusal</div>
          <textarea
            autoFocus value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Why is activating on this moment acceptable? This is logged, and the log is the training signal."
            className="w-full text-[13px] border border-[var(--border)] rounded px-2 py-1.5 h-20 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => reason.trim() && record("Override", reason.trim())}
              disabled={!reason.trim()}
              className="text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white disabled:opacity-40">
              Log override and activate
            </button>
            <button onClick={() => setJustifying(false)}
              className="text-[13px] px-3 py-1.5 text-[var(--text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={() => setJustifying(true)}
            disabled={!mayOverride}
            title={mayOverride ? undefined : "Overriding a refusal sits with Legal and the Brand Director"}
            className="text-[13px] px-3 py-1.5 rounded border border-[var(--border)] hover:bg-[var(--bg)] disabled:opacity-35 disabled:cursor-not-allowed">
            Override with justification
          </button>
          <button onClick={() => record("Escalated to legal review")}
            className="text-[13px] px-3 py-1.5 rounded border border-[var(--border)] hover:bg-[var(--bg)]">
            Request legal review
          </button>
          <button onClick={() => record("Archived")}
            className="text-[13px] px-3 py-1.5 rounded border border-[var(--border)] hover:bg-[var(--bg)]">
            Archive
          </button>
          <span className="text-[12px] text-[var(--text-muted)] self-center ml-1 flex items-center gap-1">
            {mayOverride
              ? "Override is always available and always logged"
              : `Signed in as ${PERSONAS[persona].role}`} <ArrowUpRight size={11} />
          </span>
        </div>
      )}
    </>
  );
}
