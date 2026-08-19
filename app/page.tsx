"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { assets } from "@/data/assets";
import { evaluate } from "@/lib/engine";
import { VerdictDot, StatCard } from "@/components/Verdict";
import { fmtReach, cx } from "@/lib/ui";
import { useMounted } from "@/lib/useMounted";
import { SkeletonRows } from "@/components/Skeleton";
import type { VerdictStatus } from "@/lib/types";

// PRD §11.3 — the default landing. No login, no landing page, straight into work.
// Every number in the stat strip is computed from the engine over the seeded set,
// not typed in: a stat card that cannot be traced to a verdict is a liability.

export default function Inbox() {
  const mounted = useMounted();
  const rows = useMemo(
    () => assets.map((a) => ({ asset: a, verdict: evaluate(a) })),
    [],
  );

  const [brand, setBrand] = useState("all");
  const [market, setMarket] = useState("all");
  const [status, setStatus] = useState("all");

  const brands = useMemo(() => Array.from(new Set(assets.map((a) => a.brand))).sort(), []);
  const markets = useMemo(() => Array.from(new Set(assets.map((a) => a.market))).sort(), []);

  const filtered = rows.filter(
    (r) =>
      (brand === "all" || r.asset.brand === brand) &&
      (market === "all" || r.asset.market === market) &&
      (status === "all" || r.verdict.status === status),
  );

  const cleared = rows.filter((r) => r.verdict.status === "GREEN").length;
  const awaiting = rows.length - cleared;
  const firstPass = Math.round((cleared / rows.length) * 100);
  const avgMs = Math.round(
    rows.reduce((s, r) => s + r.verdict.timings.deterministicMs + r.verdict.timings.judgmentMs, 0) / rows.length,
  );

  if (!mounted) {
    return (
      <>
        <h1 className="text-[24px] font-semibold mb-5">Inbox</h1>
        <SkeletonRows rows={10} />
      </>
    );
  }

  return (
    <>
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-[24px] font-semibold">Inbox</h1>
        <div className="mono text-[var(--text-muted)]">
          {rows.length} assets · evaluated live by the engine
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <StatCard label="Awaiting clearance" value={String(awaiting)} note="needs edit or blocked" />
        <StatCard label="Cleared" value={String(cleared)} note="ship without asking" />
        <StatCard label="First-pass rate" value={`${firstPass}%`} note="target 80%" />
        <StatCard label="Engine time" value={`${avgMs}ms`} note="median, deterministic + judgment" />
      </div>

      <div className="flex gap-2 mb-3">
        {[
          { v: brand, set: setBrand, opts: brands, label: "All brands" },
          { v: market, set: setMarket, opts: markets, label: "All markets" },
          { v: status, set: setStatus, opts: ["GREEN", "AMBER", "RED"], label: "All verdicts" },
        ].map((f, i) => (
          <select key={i} value={f.v} onChange={(e) => f.set(e.target.value)}
            className="text-[13px] border border-[var(--border)] rounded px-2 py-1.5 bg-[var(--surface)]">
            <option value="all">{f.label}</option>
            {f.opts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        {filtered.length !== rows.length && (
          <button onClick={() => { setBrand("all"); setMarket("all"); setStatus("all"); }}
            className="text-[13px] text-[var(--accent)] px-2">Clear filters</button>
        )}
      </div>

      <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              {["", "Brand", "Campaign", "Format", "Market", "Findings", "Reach", "Engine"].map((h) => (
                <th key={h} className="section-header font-semibold px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ asset, verdict }) => (
              <tr key={asset.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)]">
                <td className="px-3 py-2.5 w-8"><VerdictDot status={verdict.status as VerdictStatus} /></td>
                <td className="px-3 py-2.5 font-medium">
                  <Link href={`/asset/${asset.id}`} className="hover:text-[var(--accent)]">{asset.brand}</Link>
                </td>
                <td className="px-3 py-2.5 text-[var(--text-muted)]">{asset.campaign}</td>
                <td className="px-3 py-2.5 text-[var(--text-muted)]">{asset.format}</td>
                <td className="px-3 py-2.5 mono">{asset.market} · {asset.language}</td>
                <td className={cx("px-3 py-2.5 mono", verdict.findings.length > 0 && "font-semibold")}>
                  {verdict.findings.length || "—"}
                </td>
                <td className="px-3 py-2.5 mono text-[var(--text-muted)]">{fmtReach(asset.reachEstimate)}</td>
                <td className="px-3 py-2.5 mono text-[var(--text-muted)]">
                  {verdict.timings.deterministicMs + verdict.timings.judgmentMs}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="px-4 py-8 text-center text-[var(--text-muted)]">
            No assets match. {cleared} cleared in this portfolio.
          </div>
        )}
      </div>
    </>
  );
}
