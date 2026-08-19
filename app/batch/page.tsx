"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";
import { rexonaVariants } from "@/data/assets";
import { evaluate } from "@/lib/engine";
import { RULE_SET_VERSION } from "@/data/rules";
import { verdictColor, verdictBg, cx } from "@/lib/ui";
import { useMounted } from "@/lib/useMounted";
import type { VerdictStatus } from "@/lib/types";

// PRD §11.5 — the market strip. Twelve markets, twelve verdicts, twelve clauses.
// The walkthrough opens here, not on the architecture: it makes the whole thesis
// concrete in about eight seconds of screen time.
//
// The chips resolve one at a time over ~4s. The verdicts themselves come from the
// engine at mount — the animation reveals a real result, it does not produce one.

const RESOLVE_MS = 4000;

export default function BatchReview() {
  const mounted = useMounted();
  const results = useMemo(
    () => rexonaVariants.map((a) => ({ asset: a, verdict: evaluate(a) })),
    [],
  );

  const [resolved, setResolved] = useState(results.length);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setResolved(0);
    setRunning(true);
    const step = RESOLVE_MS / results.length;
    results.forEach((_, i) => {
      timers.current.push(setTimeout(() => {
        setResolved(i + 1);
        if (i === results.length - 1) setRunning(false);
      }, step * (i + 1)));
    });
  };

  const shown = results.slice(0, resolved);
  const count = (s: VerdictStatus) => shown.filter((r) => r.verdict.status === s).length;
  const flagged = results.filter((r) => r.verdict.status !== "GREEN");
  const done = resolved === results.length;

  return (
    <>
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-[24px] font-semibold">Rexona · &ldquo;The Fourth Official&rdquo;</h1>
        <button onClick={run} disabled={running}
          className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white disabled:opacity-50">
          {running ? <RotateCcw size={13} className="animate-spin" /> : <Play size={13} />}
          {running ? "Clearing…" : "Run clearance"}
        </button>
      </div>
      <div className="mono text-[var(--text-muted)] mb-6">
        12 variants · 12 markets · rule set {RULE_SET_VERSION} · {resolved}/{results.length} evaluated
      </div>

      {/* The market strip. */}
      <div className="flex flex-wrap gap-2 mb-4" suppressHydrationWarning>
        {results.map((r, i) => {
          const isResolved = i < resolved;
          const s = r.verdict.status as VerdictStatus;
          return (
            <Link key={r.asset.id} href={`/asset/${r.asset.id}`}
              className={cx(
                "flex items-center gap-2 px-3 py-2 rounded border text-[13px] font-medium transition-colors duration-200",
                !isResolved && "pointer-events-none",
              )}
              style={{
                background: isResolved ? verdictBg[s] : "var(--bg)",
                borderColor: isResolved ? verdictColor[s] : "var(--border)",
                color: isResolved ? verdictColor[s] : "var(--text-muted)",
              }}>
              <span className="mono">{r.asset.market}</span>
              <span className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: isResolved ? verdictColor[s] : "var(--border)" }} />
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mb-7 text-[13px] border-y border-[var(--border)] py-3">
        {([["GREEN", "cleared"], ["AMBER", "needs edit"], ["RED", "blocked"]] as const).map(([s, label]) => (
          <span key={s} className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: verdictColor[s] }} />
            <span className="tabular-nums font-semibold" style={{ color: verdictColor[s] }}>{count(s)}</span>
            <span className="text-[var(--text-muted)]">{label}</span>
          </span>
        ))}
        <span className="mono text-[var(--text-muted)] ml-auto">
          {mounted
            ? `${shown.reduce((s, r) => s + r.verdict.timings.deterministicMs + r.verdict.timings.judgmentMs, 0)}ms engine time`
            : "measuring…"}
        </span>
      </div>

      {done && (
        <>
          <div className="section-header mb-2.5">Findings</div>
          <div className="space-y-2 mb-7">
            {flagged.map(({ asset, verdict }) => (
              <Link key={asset.id} href={`/asset/${asset.id}`}
                className="block border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3 hover:bg-[var(--bg)]">
                {verdict.findings.map((f) => (
                  <div key={f.ruleId} className="flex items-start gap-3">
                    <span className="mono font-semibold w-8 shrink-0"
                      style={{ color: verdictColor[verdict.status as VerdictStatus] }}>
                      {asset.market}
                    </span>
                    <span className="mono text-[var(--text-muted)] w-28 shrink-0">{f.ruleId}</span>
                    <span className="text-[13px]">{f.title}</span>
                  </div>
                ))}
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white">
              Ship {count("GREEN")} cleared
            </button>
            <Link href={`/asset/${flagged.find((f) => f.verdict.status === "AMBER")?.asset.id ?? ""}`}
              className="text-[13px] px-3 py-1.5 rounded border border-[var(--border)] hover:bg-[var(--bg)]">
              Fix {count("AMBER")}
            </Link>
            <Link href={`/asset/${flagged.find((f) => f.verdict.status === "RED")?.asset.id ?? ""}`}
              className="text-[13px] px-3 py-1.5 rounded border border-[var(--border)] hover:bg-[var(--bg)]">
              Regenerate {count("RED")}
            </Link>
          </div>
        </>
      )}
    </>
  );
}
