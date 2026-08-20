"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { buildConstraintPack, packAsPrompt } from "@/lib/engine/constrain";
import { evaluateText } from "@/lib/engine";
import { VerdictChip } from "@/components/Verdict";
import { useMounted } from "@/lib/useMounted";
import { verdictColor } from "@/lib/ui";
import { RULE_SET_LABEL } from "@/data/rules";
import type { Market } from "@/lib/types";

// Ring 0 split-screen — PRD §13 acceptance, Flow 2 (§9.5).
//
// The argument in one screen: everyone else checks after generation, we constrain
// during it. Left is what an unconstrained generator produces and what it costs to
// fix. Right is the same brief with the constraint pack injected, where the
// non-compliant variant is never generated at all.

const UNCONSTRAINED = "Our 100% natural formula is clinically proven to be India's No.1 for 72h protection. Limited stock — hurry!";
const CONSTRAINED = "72h freshness. Sweat-activated technology. It won't ever let you down.";

const MARKETS: Market[] = ["IN", "UK", "DE", "AE", "BR", "ID"];

export default function Ring0() {
  const mounted = useMounted();
  const [market, setMarket] = useState<Market>("IN");
  const [showPrompt, setShowPrompt] = useState(false);

  const pack = useMemo(
    () => buildConstraintPack("Rexona", "REX-AP-150", market, "Instagram"),
    [market],
  );
  const before = useMemo(() => evaluateText(UNCONSTRAINED, market, { sku: "REX-AP-150", brand: "Rexona" }).verdict, [market]);
  const after = useMemo(() => evaluateText(CONSTRAINED, market, { sku: "REX-AP-150", brand: "Rexona" }).verdict, [market]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <h1 className="text-[24px] font-semibold">Constrain at generation</h1>
        <select value={market} onChange={(e) => setMarket(e.target.value as Market)}
          className="text-[13px] border border-[var(--border)] rounded px-2 py-1.5 bg-[var(--surface)]">
          {MARKETS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="mono text-[var(--text-muted)] mb-6">
        the rules go into the generator, not the review queue · {RULE_SET_LABEL}
      </div>

      <div data-tour="ring0-split" className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {[
          { title: "Without constraints", sub: "generate, then check", copy: UNCONSTRAINED, verdict: before },
          { title: "With constraints", sub: "the rules go in before generation", copy: CONSTRAINED, verdict: after },
        ].map((side) => (
          <div key={side.title} className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--border)]">
              <div className="font-medium text-[13px]">{side.title}</div>
              <div className="mono text-[var(--text-muted)]">{side.sub}</div>
            </div>
            <div className="px-4 py-3 text-[14px] leading-relaxed border-b border-[var(--border)] min-h-[76px]">
              {side.copy}
            </div>
            <div className="px-4 py-3">
              {mounted ? (
                <>
                  <VerdictChip status={side.verdict.status} confidence={side.verdict.confidence} />
                  <div className="mt-2.5 space-y-1">
                    {side.verdict.findings.length ? (
                      side.verdict.findings.map((f, i) => (
                        <div key={i} className="mono" style={{ color: verdictColor[side.verdict.status] }}>
                          {f.ruleId} · {f.clauseRef}
                        </div>
                      ))
                    ) : (
                      <div className="mono text-[var(--text-muted)]">
                        no findings · the non-compliant variant was never generated
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-16" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-[var(--border)] rounded bg-[var(--surface)] mb-4">
        <button onClick={() => setShowPrompt(!showPrompt)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-[13px] hover:bg-[var(--bg)]">
          <span className="font-medium">Constraint pack for {pack.brand} {pack.sku} · {market}</span>
          <span className="mono text-[var(--text-muted)]">
            {pack.permittedClaims.length} permitted · {pack.prohibitedTerms.length} prohibited
            · {pack.hardConstraints.length} pledge {showPrompt ? "▾" : "▸"}
          </span>
        </button>
        {showPrompt && (
          <pre className="px-4 py-3 border-t border-[var(--border)] mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
{packAsPrompt(pack)}
          </pre>
        )}
      </div>

      <div className="flex items-start gap-2 text-[13px] text-[var(--text-muted)] leading-relaxed">
        <ArrowRight size={14} className="mt-0.5 shrink-0" />
        <p>
          More and more, the thing asking for 400 variants is another piece of software,
          not a person. So the cheapest place to stop a bad claim is before it is written:
          don&rsquo;t check after generating — constrain generating. Normal clearance still
          runs afterwards as the backstop, so this removes no control. Live at{" "}
          <span className="mono">/api/constrain</span>.
        </p>
      </div>
    </>
  );
}
