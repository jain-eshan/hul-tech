"use client";

import { useState } from "react";
import { ExternalLink, Check, X, FileText } from "lucide-react";
import type { Finding } from "@/lib/types";
import { SeverityTag } from "./Verdict";
import { severityColor } from "@/lib/ui";
import { useApp, canOverride, approverName } from "@/lib/store";

// PRD §11.4. Four things do the work here and all four survive the build:
//   1. the underline is on the claim, not the asset
//   2. the clause is cited and clickable
//   3. three exits, including "keep as is → justify" — the BM is never trapped
//   4. the fix is one click
// Never modal (§11.13), so this renders inline.

export default function FindingCard({
  finding, assetId, onApply, applied,
}: {
  finding: Finding;
  assetId: string;
  onApply: (f: Finding) => void;
  applied: boolean;
}) {
  const { persona, override, overrides, appendLedger } = useApp();
  const [justifying, setJustifying] = useState(false);
  const [reason, setReason] = useState("");
  const key = `${assetId}::${finding.ruleId}`;
  const overridden = Boolean(overrides[key]);

  const submit = () => {
    if (!reason.trim()) return;
    override(key, reason.trim());
    appendLedger({
      assetId, ruleSetVersion: "v2026.08", status: "OVERRIDDEN",
      findings: 1, approver: approverName(persona),
      action: `Override — ${finding.ruleId}`, reasoning: reason.trim(),
    });
    setJustifying(false);
  };

  return (
    <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-start justify-between gap-3">
        <div className="font-medium text-[13px]" style={{ color: severityColor[finding.severity] }}>
          {finding.title}
        </div>
        <SeverityTag severity={finding.severity} draft={finding.draft} />
      </div>

      <div className="px-4 py-3 space-y-3">
        <p className="text-[13px] leading-relaxed">{finding.explanation}</p>

        <a href={finding.sourceUrl} target="_blank" rel="noreferrer"
          className="flex items-start gap-1.5 mono text-[var(--accent)] hover:underline">
          <span>{finding.regulator} {finding.clauseRef} — {finding.ruleId}</span>
          <ExternalLink size={11} className="mt-0.5 shrink-0" />
        </a>

        {applied || overridden ? (
          <div className="mono text-[var(--text-muted)] flex items-center gap-1.5">
            <Check size={12} /> {applied ? "Fix applied" : `Overridden — ${overrides[key]}`}
          </div>
        ) : justifying ? (
          <div className="space-y-2">
            <textarea
              autoFocus value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this acceptable? This is logged to the audit trail and becomes a training signal."
              className="w-full text-[13px] border border-[var(--border)] rounded px-2 py-1.5 h-16 resize-none" />
            <div className="flex gap-2">
              <button onClick={submit} disabled={!reason.trim()}
                className="text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white disabled:opacity-40">
                Log override
              </button>
              <button onClick={() => setJustifying(false)}
                className="text-[13px] px-3 py-1.5 text-[var(--text-muted)]">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 pt-1">
            {finding.suggestedFix && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] flex items-center gap-1.5">
                  <Check size={13} className="text-[var(--verdict-green)]" /> {finding.suggestedFix}
                </span>
                {finding.fixReplacement && (
                  <button onClick={() => onApply(finding)}
                    className="text-[12px] px-2.5 py-1 rounded border border-[var(--accent)] text-[var(--accent)] hover:bg-[#EFF6FF]">
                    Apply
                  </button>
                )}
              </div>
            )}
            {finding.altFix && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] flex items-center gap-1.5 text-[var(--text-muted)]">
                  <FileText size={13} /> {finding.altFix}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] flex items-center gap-1.5 text-[var(--text-muted)]">
                <X size={13} /> Keep as is
              </span>
              <button
                onClick={() => setJustifying(true)}
                disabled={!canOverride(persona)}
                title={canOverride(persona) ? undefined : "Override authority sits with Legal and Brand Director"}
                className="text-[12px] px-2.5 py-1 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-35 disabled:cursor-not-allowed">
                Justify →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
