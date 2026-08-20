"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assets } from "@/data/assets";
import { evaluate } from "@/lib/engine";
import { VerdictDot, StatCard } from "@/components/Verdict";
import { fmtReach, cx, severityColor, severityLabel, routingLabel } from "@/lib/ui";
import { useMounted } from "@/lib/useMounted";
import { useApp, PERSONAS } from "@/lib/store";
import { SkeletonRows } from "@/components/Skeleton";
import type { VerdictStatus } from "@/lib/types";

// PRD §11.3 — the default landing. No login, no landing page, straight into work.
// Every number in the stat strip is computed from the engine over the seeded set,
// not typed in: a stat card that cannot be traced to a verdict is a liability.

export default function Inbox() {
  const mounted = useMounted();
  const { persona } = useApp();
  const router = useRouter();
  const spec = PERSONAS[persona];
  const cols = spec.columns;
  const rows = useMemo(
    () => assets.map((a) => ({ asset: a, verdict: evaluate(a) })),
    [],
  );

  // Legal lands on the triaged queue. Visible and removable — the count of what is
  // filtered out is the point being made, so it is stated rather than hidden.
  const [queueOnly, setQueueOnly] = useState(false);
  useEffect(() => setQueueOnly(spec.defaultQueue === "needs_human"), [spec.defaultQueue]);

  const [brand, setBrand] = useState("all");
  const [market, setMarket] = useState("all");
  const [status, setStatus] = useState("all");

  const brands = useMemo(() => Array.from(new Set(assets.map((a) => a.brand))).sort(), []);
  const markets = useMemo(() => Array.from(new Set(assets.map((a) => a.market))).sort(), []);

  const autoCleared = rows.filter((r) => r.verdict.routing === "auto").length;

  const filtered = rows.filter(
    (r) =>
      (!queueOnly || r.verdict.routing !== "auto") &&
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-5">
        <h1 className="text-[24px] font-semibold">Inbox</h1>
        <div className="mono text-[var(--text-muted)]">
          {rows.length} assets · evaluated live by the engine
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Awaiting clearance" value={String(awaiting)} note="needs edit or blocked" />
        <StatCard label="Cleared" value={String(cleared)} note="ship without asking" />
        <StatCard label="First-pass rate" value={`${firstPass}%`} note="target 80%" />
        <StatCard label="Engine time" value={`${avgMs}ms`} note="median, rule checks + AI checks" />
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
        {queueOnly && (
          <button onClick={() => setQueueOnly(false)}
            className="text-[13px] text-[var(--accent)] px-2">
            Judgment calls only · {autoCleared} auto-cleared hidden
          </button>
        )}
        {filtered.length !== rows.length && !queueOnly && (
          <button onClick={() => { setBrand("all"); setMarket("all"); setStatus("all"); }}
            className="text-[13px] text-[var(--accent)] px-2">Clear filters</button>
        )}
      </div>

      <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              {["", "Brand", "Campaign", "Format", "Market", "Findings", "Cleared in"].map((h) => (
                <th key={h} className="section-header font-semibold px-3 py-2">{h}</th>
              ))}
              {/* Columns follow the role. Legal reviews the routing queue; the
                  director signs off by consequence, so sees exposure. */}
              {cols.includes("severity") && <th className="section-header font-semibold px-3 py-2">Action needed</th>}
              {cols.includes("reach") && <th className="section-header font-semibold px-3 py-2">Reach</th>}
              {cols.includes("spend") && <th className="section-header font-semibold px-3 py-2">Spend</th>}
              <th className="section-header font-semibold px-3 py-2">Who approves</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ asset, verdict }) => (
              // §11.3: row click opens the asset. The brand cell stays a real link so
              // middle-click and open-in-new-tab still work.
              <tr key={asset.id}
                onClick={() => router.push(`/asset/${asset.id}`)}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)] cursor-pointer">
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
                {/* §11.3 "cleared in" — engine time, which is what clearance actually cost. */}
                <td className="px-3 py-2.5 mono text-[var(--text-muted)]">
                  {verdict.timings.deterministicMs + verdict.timings.judgmentMs}ms
                </td>
                {cols.includes("severity") && (
                  <td className="px-3 py-2.5" style={{ color: verdict.findings.length ? severityColor[verdict.findings[0].severity] : undefined }}>
                    {verdict.findings[0] ? severityLabel[verdict.findings[0].severity] : "—"}
                  </td>
                )}
                {cols.includes("reach") && (
                  <td className="px-3 py-2.5 mono text-[var(--text-muted)]">{fmtReach(asset.reachEstimate)}</td>
                )}
                {cols.includes("spend") && (
                  <td className="px-3 py-2.5 mono text-[var(--text-muted)]">₹{(asset.spend / 100000).toFixed(1)}L</td>
                )}
                <td className="px-3 py-2.5 text-[var(--text-muted)]">
                  {routingLabel[verdict.routing]}
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
