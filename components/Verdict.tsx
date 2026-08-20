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
  status, confidence, clearedIn, abstained,
}: { status: VerdictStatus; confidence?: number; clearedIn?: string; abstained?: boolean }) {
  // An abstention is not a verdict, so it does not get a verdict colour. Rendering it in
  // amber would tell a reader the engine decided something, which is the opposite of what
  // happened (§5.4 principle 7).
  if (abstained) {
    return (
      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[13px] font-medium border border-dashed border-[var(--text-muted)] text-[var(--text-muted)] bg-[var(--bg)]">
        <span className="inline-block w-2 h-2 rounded-full border border-[var(--text-muted)]" />
        Not cleared — abstained
        {confidence !== undefined && <span className="mono opacity-80">confidence {confidence.toFixed(2)}</span>}
        {clearedIn && <span className="mono opacity-80">· {clearedIn}</span>}
      </span>
    );
  }

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

export function AbstentionCard({ reasons }: { reasons: string[] }) {
  return (
    <div className="border border-dashed border-[var(--text-muted)] rounded bg-[var(--bg)] px-4 py-3">
      <div className="section-header mb-2">Escalated — not cleared, not blocked</div>
      <p className="text-[13px] leading-relaxed mb-2">
        The engine is below its confidence floor here and has escalated rather than
        guessing. The findings listed are certain; this is what it could not determine.
      </p>
      <ul className="text-[13px] leading-relaxed list-disc pl-5 space-y-1">
        {reasons.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
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
