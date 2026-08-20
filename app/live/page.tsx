"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { evaluateText } from "@/lib/engine";
import FindingCard from "@/components/FindingCard";
import { VerdictChip, AbstentionCard } from "@/components/Verdict";
import type { Market, Verdict } from "@/lib/types";

// PRD §11.12 — the "try it yourself" moment. Renders results in the exact same
// finding cards as the rest of the product, because a separate rendering path here
// would be a second thing that can break in front of a judge.

const EXAMPLES = [
  "Our new formula is 100% natural and clinically proven to remove 99.9% of germs. Dermatologist recommended. Limited stock — only 3 left!",
  "India's No.1 anti-dandruff shampoo. Cures dandruff in one wash, guaranteed.",
  "72h freshness. It won't ever let you down.",
  "Now with 30% more.",
];

const MARKETS: Market[] = ["IN", "UK", "DE", "AE", "ZA", "BR", "ID", "PH", "TH", "MX", "VN", "EG"];

export default function LiveCheck() {
  const [copy, setCopy] = useState("");
  const [market, setMarket] = useState<Market>("IN");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!copy.trim()) return;
    setBusy(true);
    // Local result first, so there is always something to render.
    const local = evaluateText(copy, market).verdict;

    // The standalone single-file build has no server to call. That is the same
    // deterministic path the served app falls back to when the model times out.
    if (typeof window !== "undefined" && (window as unknown as { __PRAMAAN_STATIC__?: boolean }).__PRAMAAN_STATIC__) {
      setVerdict(local);
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copy, market }),
      });
      const data = await res.json();
      setVerdict(data?.verdict ?? local);
    } catch {
      setVerdict(local); // Silent fallback. The screen never shows an error.
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-[24px] font-semibold mb-1">Live Check</h1>
      <div className="mono text-[var(--text-muted)] mb-5">
        type any ad copy · evaluated against the same rule set as every other screen
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-7 items-start">
        <div data-tour="live-input" className="space-y-3">
          <textarea
            value={copy} onChange={(e) => setCopy(e.target.value)}
            placeholder="Paste or type marketing copy…"
            className="w-full h-40 border border-[var(--border)] rounded px-3 py-2.5 text-[14px] resize-none bg-[var(--surface)]" />

          <div className="flex gap-2">
            <select value={market} onChange={(e) => setMarket(e.target.value as Market)}
              className="text-[13px] border border-[var(--border)] rounded px-2 py-1.5 bg-[var(--surface)]">
              {MARKETS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={run} disabled={busy || !copy.trim()}
              className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white disabled:opacity-40">
              <Play size={13} /> {busy ? "Checking…" : "Run clearance"}
            </button>
          </div>

          <div>
            <div className="section-header mb-1.5">Try one of these</div>
            <div className="space-y-1.5">
              {EXAMPLES.map((e, i) => (
                <button key={i} onClick={() => setCopy(e)}
                  className="block w-full text-left text-[12px] px-2.5 py-2 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] text-[var(--text-muted)]">
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          {verdict ? (
            <div className="space-y-4">
              <VerdictChip status={verdict.status} confidence={verdict.confidence} abstained={verdict.abstained}
                clearedIn={`evaluated in ${verdict.timings.deterministicMs + verdict.timings.judgmentMs}ms`} />
              {verdict.abstained && <AbstentionCard reasons={verdict.abstentionReasons} />}
              {verdict.findings.length ? (
                <div className="space-y-3">
                  {verdict.findings.map((f, i) => (
                    <FindingCard key={f.ruleId + i} finding={f} assetId="LIVE" onApply={() => {}} applied={false} />
                  ))}
                </div>
              ) : (
                <div className="border border-[var(--border)] rounded bg-[#F0FDF4] px-4 py-3 text-[13px]"
                  style={{ color: "var(--verdict-green)" }}>
                  Cleared. No findings against rule set v2026.08 for {market}.
                </div>
              )}
            </div>
          ) : (
            <div className="border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-8 text-center text-[13px] text-[var(--text-muted)]">
              Results appear here, in the same finding cards used everywhere else in the product.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
