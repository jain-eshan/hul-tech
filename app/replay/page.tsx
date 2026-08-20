"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { GitCompare } from "lucide-react";
import { portfolio, LIVE_PORTFOLIO_SCOPE } from "@/data/assets";
import { evaluate, RULESET_CURRENT, RULESET_NEXT } from "@/lib/engine";
import { ruleById, ruleSetHash } from "@/data/rules";
import { fmtReach, verdictColor, severityLabel } from "@/lib/ui";
import type { Asset, Verdict } from "@/lib/types";

// PRD §11.7 — Demo C, the capability nobody ships.
//
// This genuinely re-invokes evaluate() over the seeded portfolio. Same code path as
// clearance, reusing cached extraction and re-running only the decision plane, which
// is the architectural decision that makes portfolio replay economically viable.
// Nothing here reads a fixture.

const COUNT_MS = 6000;

export default function RuleReplay() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [counter, setCounter] = useState(0);
  const [results, setResults] = useState<{ asset: Asset; verdict: Verdict }[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number>();

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const publish = () => {
    setPhase("running");
    setResults([]);

    // The real work: re-evaluate every asset under both rule versions.
    const t0 = performance.now();
    const newly = portfolio
      .map((a) => ({ asset: a, before: evaluate(a, RULESET_CURRENT), verdict: evaluate(a, RULESET_NEXT) }))
      .filter((r) => r.before.status === "GREEN" && r.verdict.status !== "GREEN")
      .sort((a, b) => b.asset.reachEstimate - a.asset.reachEstimate);
    const took = performance.now() - t0;

    const start = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / COUNT_MS);
      setCounter(Math.round(p * LIVE_PORTFOLIO_SCOPE));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setResults(newly);
        setElapsed(took);
        setPhase("done");
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const rule = ruleById.get("ASCI-AI-M")!;

  return (
    <>
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-[24px] font-semibold">Rule Replay</h1>
        <button onClick={publish} disabled={phase === "running"}
          className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white disabled:opacity-50">
          <GitCompare size={13} /> Publish v2026.09
        </button>
      </div>
      <div className="mono text-[var(--text-muted)] mb-6">
        current v2026.08 · {ruleSetHash()} · humans cannot re-read a live portfolio on the day a rule changes
      </div>

      {phase === "idle" && (
        <div className="border border-[var(--border)] rounded bg-[var(--surface)] px-5 py-8 text-center">
          <p className="text-[13px] text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            Publishing a rule version re-runs every live asset against it and returns a
            remediation list ranked by exposure. No reviewer can re-read a portfolio on
            the day a rule changes — this is the answer to &ldquo;isn&rsquo;t this just a
            faster reviewer?&rdquo;
          </p>
        </div>
      )}

      {phase !== "idle" && (
        <>
          <div className="border border-[var(--border)] rounded bg-[var(--surface)] mb-5">
            <div className="px-4 py-2.5 border-b border-[var(--border)] section-header">What changed · Aug 2026 rules → Sep 2026</div>
            <div className="px-4 py-3 text-[13px] leading-relaxed">
              <span className="mono text-[var(--accent)]">{rule.id}</span> tightened — synthetic
              product demonstrations now require an on-screen label for the{" "}
              <strong>full duration</strong> of the asset, not the first 3 seconds. Statics
              must carry the label above the fold.
              <div className="mono text-[var(--text-muted)] mt-2">
                {rule.regulator} {rule.clauseRef} · {severityLabel[rule.severity].toLowerCase()} · draft guideline
              </div>
            </div>
          </div>

          <div data-tour="replay-counter" className="flex gap-8 items-baseline mb-6 border-y border-[var(--border)] py-4">
            <div>
              <div className="section-header mb-1">Live assets re-evaluated</div>
              <div className="text-[34px] font-semibold leading-none tabular-nums">
                {counter.toLocaleString()}
              </div>
            </div>
            {phase === "done" && (
              <div>
                <div className="section-header mb-1">Newly non-compliant</div>
                <div className="text-[34px] font-semibold leading-none tabular-nums"
                  style={{ color: verdictColor.AMBER }}>
                  {results.length}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {phase === "done" && (
        <>
          <div className="section-header mb-2.5">Remediation queue · ranked by reach</div>
          <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-hidden mb-4">
            <table className="w-full text-[13px]">
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.asset.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-3 py-2.5 mono text-[var(--text-muted)] w-8">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium">{r.asset.brand}</td>
                    <td className="px-3 py-2.5 text-[var(--text-muted)]">{r.asset.format}</td>
                    <td className="px-3 py-2.5 mono">{r.asset.market}</td>
                    <td className="px-3 py-2.5 mono">{fmtReach(r.asset.reachEstimate)} reach</td>
                    <td className="px-3 py-2.5 text-[var(--text-muted)]">
                      {r.verdict.findings.find((f) => f.ruleId === "ASCI-AI-M")?.explanation.split(". ").pop()}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Link href={`/asset/${r.asset.id}`}
                        className="text-[12px] px-2.5 py-1 rounded border border-[var(--accent)] text-[var(--accent)] hover:bg-[#EFF6FF]">
                        Remediate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scope honesty: say what was actually evaluated, and what production scope means. */}
          <p className="mono text-[var(--text-muted)] leading-relaxed">
            Re-evaluated {portfolio.length} seeded assets in {elapsed.toFixed(1)}ms using cached
            claim extraction — the decision plane re-runs, extraction does not.
            <br />
            Production scope for this rule: {LIVE_PORTFOLIO_SCOPE.toLocaleString()} live assets,
            estimated 4m 12s. The prototype evaluates the seeded portfolio only.
          </p>
        </>
      )}
    </>
  );
}
