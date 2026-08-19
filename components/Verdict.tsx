"use client";

import type { VerdictStatus, Severity } from "@/lib/types";
import { verdictColor, verdictBg, verdictLabel, severityColor } from "@/lib/ui";

export function VerdictDot({ status, size = 8 }: { status: VerdictStatus; size?: number }) {
  return (
    <span
      aria-label={verdictLabel[status]}
      style={{ background: verdictColor[status], width: size, height: size }}
      className="inline-block rounded-full shrink-0"
    />
  );
}

export function VerdictChip({
  status, confidence, clearedIn,
}: { status: VerdictStatus; confidence?: number; clearedIn?: string }) {
  return (
    <span
      style={{ background: verdictBg[status], color: verdictColor[status] }}
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[13px] font-medium">
      <VerdictDot status={status} />
      {verdictLabel[status]}
      {confidence !== undefined && (
        <span className="mono opacity-80">confidence {confidence.toFixed(2)}</span>
      )}
      {clearedIn && <span className="mono opacity-80">· {clearedIn}</span>}
    </span>
  );
}

export function SeverityTag({ severity, draft }: { severity: Severity; draft?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span style={{ color: severityColor[severity] }} className="mono uppercase tracking-wide">
        {severity}
      </span>
      {draft && (
        <span className="mono uppercase px-1 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]">
          draft
        </span>
      )}
    </span>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex-1 border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3">
      <div className="section-header mb-1.5">{label}</div>
      <div className="text-[22px] font-semibold leading-none">{value}</div>
      {note && <div className="mono text-[var(--text-muted)] mt-1.5">{note}</div>}
    </div>
  );
}
