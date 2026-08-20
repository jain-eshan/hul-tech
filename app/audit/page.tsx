"use client";

import { useState } from "react";
import { FileCheck, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { assetById } from "@/data/assets";
import { evaluate } from "@/lib/engine";
import { ruleSetHash, RULE_SET_VERSION } from "@/data/rules";
import { claims } from "@/data/claims";
import { useMounted } from "@/lib/useMounted";
import { routingLabel } from "@/lib/ui";

// PRD §11.8. Append-only: this table has no edit path and no delete path, because
// defensibility is a schema property rather than a feature (§9.4).

const SEEDED = [
  { id: "S-3", timestamp: "2026-08-19 18:42:11", assetId: "REX-02", ruleSetVersion: RULE_SET_VERSION,
    status: "GREEN", findings: 0, approver: "auto-clear", action: "Cleared — no approver needed", reasoning: undefined },
  { id: "S-2", timestamp: "2026-08-19 18:41:55", assetId: "REX-12", ruleSetVersion: RULE_SET_VERSION,
    status: "RED", findings: 1, approver: "Legal Counsel", action: "Blocked — ASCI-AI-H",
    reasoning: "Unenrolled likeness. High-risk tier is prohibited; regeneration requested." },
  { id: "S-1", timestamp: "2026-08-19 18:41:02", assetId: "PF-R1", ruleSetVersion: RULE_SET_VERSION,
    status: "GREEN", findings: 0, approver: "Priya Sharma · ABM", action: "Cleared — one approver", reasoning: undefined },
];

export default function AuditTrail() {
  const mounted = useMounted();
  const { ledger } = useApp();
  const [packFor, setPackFor] = useState<string | null>(null);
  const rows = [...ledger, ...SEEDED];

  const asset = packFor && mounted ? assetById.get(packFor) : undefined;
  const verdict = asset ? evaluate(asset) : undefined;
  const dossier = asset
    ? claims.find((c) => c.productSku === asset.sku && c.status === "active")
    : undefined;

  return (
    <>
      <h1 className="text-[24px] font-semibold mb-1">Audit Trail</h1>
      <div className="mono text-[var(--text-muted)] mb-6">
        append-only · rule set {RULE_SET_VERSION} · {ruleSetHash()}
      </div>

      <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              {["Timestamp", "Asset", "Rule set", "Verdict", "Findings", "Approver", "Action", ""].map((h) => (
                <th key={h} className="section-header font-semibold px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[var(--border)] last:border-0 align-top">
                <td className="px-3 py-2.5 mono text-[var(--text-muted)] whitespace-nowrap">{r.timestamp}</td>
                <td className="px-3 py-2.5 mono">{r.assetId}</td>
                <td className="px-3 py-2.5 mono text-[var(--text-muted)]">{r.ruleSetVersion}</td>
                <td className="px-3 py-2.5 mono">{r.status}</td>
                <td className="px-3 py-2.5 mono">{r.findings}</td>
                <td className="px-3 py-2.5">{r.approver}</td>
                <td className="px-3 py-2.5">
                  {r.action}
                  {r.reasoning && (
                    <div className="text-[var(--text-muted)] text-[12px] mt-0.5 max-w-md">{r.reasoning}</div>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">
                  <button onClick={() => setPackFor(r.assetId)}
                    className="text-[12px] px-2 py-1 rounded border border-[var(--border)] hover:bg-[var(--bg)]">
                    Response pack
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="px-4 py-8 text-center text-[var(--text-muted)]">
            No decisions logged yet. Apply a fix or log an override to see the trail build.
          </div>
        )}
      </div>

      {asset && verdict && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 md:p-8 z-50"
          onClick={() => setPackFor(null)}>
          <div className="bg-[var(--surface)] rounded border border-[var(--border)] max-w-2xl w-full max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-medium">
                <FileCheck size={15} className="text-[var(--accent)]" /> Regulator Response Pack
              </div>
              <button onClick={() => setPackFor(null)}><X size={15} /></button>
            </div>
            <div className="px-5 py-4 space-y-3 text-[13px]">
              {[
                ["Asset", `${asset.brand} · ${asset.campaign} · ${asset.id}`],
                ["Market / channel", `${asset.market} · ${asset.language} · ${asset.channel}`],
                ["Asset hash", asset.hash],
                ["Rule set version", `${RULE_SET_VERSION} · ${verdict.ruleSetVersionHash}`],
                ["Verdict", `${verdict.status} · confidence ${verdict.confidence} · approved by ${routingLabel[verdict.routing].toLowerCase()}`],
                ["Clauses cited", verdict.findings.map((f) => `${f.ruleId} (${f.clauseRef})`).join("; ") || "none — cleared"],
                ["Substantiation dossier", dossier ? `${dossier.dossierRef} · ${dossier.evidenceGrade} · "${dossier.canonicalText}"` : "n/a"],
                ["Model versions", Object.entries(verdict.modelVersions).map(([k, v]) => `${k}=${v}`).join(", ")],
                ["Snapshot", `sha-${asset.hash.slice(2)} captured ${asset.createdAt.slice(0, 10)}`],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3">
                  <div className="section-header pt-0.5">{k}</div>
                  <div className="mono break-words">{v}</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-[var(--border)] mono text-[var(--text-muted)]">
              No vendor found links a live ad claim back to the study supporting it. This does.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
