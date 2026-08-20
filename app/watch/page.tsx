"use client";

import { useState, useMemo } from "react";
import { X, Send, Camera } from "lucide-react";
import { creatorPosts } from "@/data/creatorPosts";
import { snapshots } from "@/data/observations";
import { sweepPost, fixRequest } from "@/lib/engine/sweep";
import { useMounted } from "@/lib/useMounted";
import { useApp, approverName } from "@/lib/store";
import { VerdictDot } from "@/components/Verdict";
import { verdictColor, verdictLabel } from "@/lib/ui";
import type { VerdictStatus } from "@/lib/types";

// PRD §11.9 — Creator Sweep, and the surface B4's evidence primitive is proved on.
//
// ASCI processed 1,609 influencer ads in FY25-26 and 97.3% required modification.
// This is content the brand never wrote, never saw, and is liable for.

export default function CreatorSweep() {
  const mounted = useMounted();
  const { persona, appendLedger } = useApp();
  const [sent, setSent] = useState<string[]>([]);
  const [snapFor, setSnapFor] = useState<string | null>(null);
  const [fixFor, setFixFor] = useState<string | null>(null);

  const results = useMemo(() => creatorPosts.map(sweepPost), []);
  const snapById = useMemo(() => new Map(snapshots.map((s) => [s.postId, s])), []);

  const violations = results.filter((r) => r.status !== "GREEN").length;
  const disclosureOk = results.filter((r) => r.disclosureOk).length;

  const snap = snapFor ? snapById.get(snapFor) : undefined;
  const snapPost = snapFor ? creatorPosts.find((p) => p.id === snapFor) : undefined;
  const fixResult = fixFor ? results.find((r) => r.post.id === fixFor) : undefined;

  return (
    <>
      <h1 className="text-[24px] font-semibold mb-1">Creator Sweep</h1>
      <div className="mono text-[var(--text-muted)] mb-5">
        {results.length} enrolled creator posts · {violations} need action ·
        disclosure compliance {Math.round((disclosureOk / results.length) * 100)}%
      </div>

      {/* Say what this is before anyone asks. */}
      <div className="border border-[var(--border)] rounded bg-[var(--bg)] px-4 py-2.5 mb-5 text-[13px] leading-relaxed">
        <span className="section-header">Scope</span> — these posts are simulated and
        rendered locally; nothing here was crawled from a live platform. The{" "}
        <strong>capture pipeline is real</strong>: a headless browser renders each page,
        expands content hidden behind &ldquo;more&rdquo; folds, and hashes the PNG and DOM
        with SHA-256. Open a snapshot to see the render, the timestamp and the hash.
      </div>

      <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              {["", "Handle", "Brand", "Platform", "Disclosure", "Claims", "Findings", "Snapshot", ""].map((h) => (
                <th key={h} className="section-header font-semibold px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const s = snapById.get(r.post.id);
              return (
                <tr key={r.post.id} className="border-b border-[var(--border)] last:border-0 align-top">
                  <td className="px-3 py-2.5 w-8"><VerdictDot status={r.status as VerdictStatus} /></td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{r.post.handle}</div>
                    <div className="text-[12px] text-[var(--text-muted)]">{r.post.followers}</div>
                  </td>
                  <td className="px-3 py-2.5">{r.post.brand}</td>
                  <td className="px-3 py-2.5 text-[var(--text-muted)]">{r.post.platform}</td>
                  <td className="px-3 py-2.5 mono" style={{ color: r.disclosureOk ? undefined : verdictColor.RED }}>
                    {r.disclosureOk ? "present" : "missing"}
                  </td>
                  <td className="px-3 py-2.5 mono" style={{ color: r.claimsOk ? undefined : verdictColor.RED }}>
                    {r.claimsOk ? "match" : "drift"}
                  </td>
                  <td className="px-3 py-2.5">
                    {r.findings.length ? (
                      <div className="space-y-0.5">
                        {r.findings.map((f, i) => (
                          <div key={i} className="mono text-[var(--text-muted)]">{f.ruleId}</div>
                        ))}
                      </div>
                    ) : <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => setSnapFor(r.post.id)}
                      className="mono text-[var(--accent)] hover:underline">
                      {s ? s.pngHash.slice(0, 14) + "…" : "—"}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {r.status !== "GREEN" && (
                      sent.includes(r.post.id) ? (
                        <span className="mono text-[var(--text-muted)]">sent · 48h clock</span>
                      ) : (
                        <button onClick={() => setFixFor(r.post.id)}
                          className="text-[12px] px-2.5 py-1 rounded border border-[var(--accent)] text-[var(--accent)] hover:bg-[#EFF6FF]">
                          Send fix request
                        </button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {mounted && snap && snapPost && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 md:p-8 z-50" onClick={() => setSnapFor(null)}>
          <div className="bg-[var(--surface)] rounded border border-[var(--border)] max-w-3xl w-full max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-medium">
                <Camera size={15} className="text-[var(--accent)]" />
                Point-in-time evidence snapshot · {snapPost.handle}
              </div>
              <button onClick={() => setSnapFor(null)}><X size={15} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-5 px-5 py-4">
              <img src={snap.pngRef} alt={`Captured render of ${snapPost.handle}`}
                className="w-full border border-[var(--border)] rounded" />
              <div className="space-y-2.5 text-[13px]">
                {[
                  ["Captured at", new Date(snap.capturedAt).toUTCString()],
                  ["Source", snap.url],
                  ["PNG hash", snap.pngHash],
                  ["DOM hash", snap.domHash],
                  ["Size", `${(snap.bytes / 1024).toFixed(0)} KB`],
                  ["Collapsed regions expanded", String(snap.expandedRegions)],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1 sm:gap-3">
                    <div className="section-header pt-0.5">{k}</div>
                    <div className="mono break-all">{v}</div>
                  </div>
                ))}
                <details className="pt-1">
                  <summary className="mono text-[var(--accent)] cursor-pointer">
                    View captured DOM
                  </summary>
                  <pre className="mono text-[10px] leading-relaxed whitespace-pre-wrap break-all mt-2 max-h-48 overflow-auto border border-[var(--border)] rounded p-2 bg-[var(--bg)]">
{snap.domExcerpt}
                  </pre>
                  <div className="mono text-[var(--text-muted)] mt-1">
                    excerpt shown · the DOM hash above is over the complete capture
                  </div>
                </details>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-[var(--border)] mono text-[var(--text-muted)] leading-relaxed">
              Violating content gets edited or deleted before you can prove what it said.
              This converts monitoring into evidence.
            </div>
          </div>
        </div>
      )}

      {mounted && fixResult && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 md:p-8 z-50" onClick={() => setFixFor(null)}>
          <div className="bg-[var(--surface)] rounded border border-[var(--border)] max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-medium">
                <Send size={14} className="text-[var(--accent)]" />
                Fix request · {fixResult.post.handle}
              </div>
              <button onClick={() => setFixFor(null)}><X size={15} /></button>
            </div>
            {/* One finding, three lenses: the creator gets an ask, not a clause. */}
            <pre className="px-5 py-4 text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
{fixRequest(fixResult)}
            </pre>
            <div className="px-5 py-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
              <span className="mono text-[var(--text-muted)]">
                deadline 48h · escalates to agency, then to brand team
              </span>
              <button
                onClick={() => {
                  // Apply and Justify both write to the ledger. An action taken against a
                  // live in-market breach must too, or the evidence plane has a hole
                  // exactly where enforcement happens.
                  appendLedger({
                    assetId: fixResult.post.id, ruleSetVersion: "v2026.08",
                    status: fixResult.status, findings: fixResult.findings.length,
                    approver: approverName(persona),
                    action: `Fix request sent — ${fixResult.post.handle}`,
                    reasoning: `${fixResult.findings.map((f) => f.ruleId).join(", ")} · 48h deadline · escalates to agency then brand team`,
                  });
                  setSent((s) => [...s, fixResult.post.id]);
                  setFixFor(null);
                }}
                className="text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white">
                Send and start the clock
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
