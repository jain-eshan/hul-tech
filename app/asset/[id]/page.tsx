"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assetById } from "@/data/assets";
import { evaluate } from "@/lib/engine";
import { useApp, approverName } from "@/lib/store";
import CreativeMock from "@/components/CreativeMock";
import FindingCard from "@/components/FindingCard";
import { VerdictChip, AbstentionCard } from "@/components/Verdict";
import { severityColor, cx } from "@/lib/ui";
import { useMounted } from "@/lib/useMounted";
import type { Finding, VerdictStatus } from "@/lib/types";

// PRD §11.4 — the hero screen.
//
// Apply must actually mutate the copy in the left pane and flip the verdict to
// GREEN with a highlight flash. The PRD is blunt that this single interaction sells
// the product, so the verdict shown is recomputed from the mutated copy rather than
// toggled: if the fix did not really clear the asset, the chip does not go green.

export default function AssetDetail({ params }: { params: { id: string } }) {
  const asset = assetById.get(params.id);
  if (!asset) notFound();

  const mounted = useMounted();
  const { appliedFixes, applyFix, overrides, appendLedger, persona } = useApp();
  const [flash, setFlash] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [cursor, setCursor] = useState(0);
  const [activeRule, setActiveRule] = useState<string | undefined>();

  // Deterministic first, judgment streaming in behind it. Never a blank spinner.
  useEffect(() => {
    setStage(0);
    const a = setTimeout(() => setStage(1), 400);
    const b = setTimeout(() => setStage(2), 2400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [asset.id]);

  const copy = appliedFixes[asset.id] ?? asset.copy;

  // Re-evaluate against the current copy. The verdict is earned, not set.
  const verdict = useMemo(() => {
    const mutated = {
      ...asset,
      copy,
      extracted: asset.extracted.map((e) => ({
        ...e,
        claimText: appliedFixes[`${asset.id}::${e.id}`] ?? e.claimText,
      })),
    };
    return evaluate(mutated);
  }, [asset, copy, appliedFixes]);

  const live = verdict.findings.filter((f) => !overrides[`${asset.id}::${f.ruleId}`]);
  const status: VerdictStatus = live.length === 0 ? "GREEN" : verdict.status;

  // What is on screen right now, given the staged reveal.
  const shown = live.filter((f) =>
    f.testType === "deterministic" ? stage >= 1 : stage >= 2);
  const streaming = stage < 2 && live.some((f) => f.testType === "judgment");

  const onApply = (f: Finding) => {
    if (!f.fixReplacement) return;
    // Mutate the copy where the span appears; also rewrite the extracted claim, which
    // is what the ledger lookup actually reads for localised assets.
    const nextCopy = copy.includes(f.quotedText)
      ? copy.replace(f.quotedText, f.fixReplacement)
      : copy;
    applyFix(asset.id, nextCopy);
    const hit = asset.extracted.find((e) => e.claimText === f.quotedText);
    if (hit) applyFix(`${asset.id}::${hit.id}`, f.fixReplacement);
    appendLedger({
      assetId: asset.id, ruleSetVersion: "v2026.08", status: "FIX APPLIED",
      findings: 1, approver: approverName(persona),
      action: `Applied fix — ${f.ruleId}`,
      reasoning: `"${f.quotedText}" → "${f.fixReplacement}"`,
    });
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  const applyActive = useCallback(() => {
    const f = shown[cursor];
    if (f?.fixReplacement) onApply(f);
  }, [shown, cursor]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      // Never hijack a key the user is typing into a justification.
      if (el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (e.key === "j") { setCursor((c) => Math.min(c + 1, Math.max(shown.length - 1, 0))); e.preventDefault(); }
      else if (e.key === "k") { setCursor((c) => Math.max(c - 1, 0)); e.preventDefault(); }
      else if (e.key === "a") { applyActive(); e.preventDefault(); }
      else if (e.key === "Escape") { setActiveRule(undefined); setOpenAccordion(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown.length, applyActive]);

  useEffect(() => { setActiveRule(shown[cursor]?.ruleId); }, [cursor, shown]);

  // Underline the claim, not the asset: split the copy around the offending spans.
  const segments = useMemo(() => {
    const marks = shown
      .map((f) => ({ f, i: copy.indexOf(f.quotedText) }))
      .filter((m) => m.i >= 0)
      .sort((a, b) => a.i - b.i);
    const out: { text: string; finding?: Finding }[] = [];
    let cursor = 0;
    for (const m of marks) {
      if (m.i < cursor) continue;
      if (m.i > cursor) out.push({ text: copy.slice(cursor, m.i) });
      out.push({ text: copy.slice(m.i, m.i + m.f.quotedText.length), finding: m.f });
      cursor = m.i + m.f.quotedText.length;
    }
    if (cursor < copy.length) out.push({ text: copy.slice(cursor) });
    return out;
  }, [copy, shown]);

  const accordions = [
    { key: "tier", label: `AI Tier: ${asset.aiTier}${asset.aiTier === "medium" ? " — label required" : ""}`,
      body: asset.aiGenerated
        ? `Classified ${asset.aiTier} risk. C2PA manifest ${asset.c2paManifest ? "present and valid" : "absent — absence is itself an alert"}.`
        : "Not AI-generated. No disclosure tier applies." },
    { key: "likeness", label: `Likeness: ${asset.containsHumanLikeness ? (asset.likenessEnrolled ? "1 enrolled, 0 unenrolled" : "1 unenrolled") : "none detected"}`,
      body: asset.containsHumanLikeness
        ? asset.likenessEnrolled
          ? "Matched to the enrolled entity registry, in scope for this market, channel and format."
          : "No matching entry in the enrolled entity registry. Unenrolled human likeness is prohibited under the high-risk tier."
        : "No human likeness detected in frame or voiceover." },
    { key: "codex", label: "Brand Codex: pass",
      body: "Tone, claim register and visual identity match the approved brand data pool. Brand DNAi governs what the AI reads; this checks what the world sees." },
  ];

  return (
    <>
      <div className="flex items-center gap-2 mb-4 text-[13px]">
        <Link href="/" className="text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1">
          <ChevronLeft size={14} /> Inbox
        </Link>
        <ChevronRight size={13} className="text-[var(--border)]" />
        <span className="font-medium">{asset.brand} · {asset.campaign}</span>
        <span className="mono text-[var(--text-muted)]">{asset.id}</span>
      </div>

      {!mounted ? (
        <div className="border border-[var(--border)] rounded bg-[var(--surface)] h-[420px]" />
      ) : (
      <div className="grid grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-7 items-start">
        <div className={cx(flash && "flash")}>
          <CreativeMock asset={asset} copy={copy} findings={shown} activeRule={activeRule} />
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <VerdictChip status={status} confidence={verdict.confidence} abstained={verdict.abstained}
              clearedIn={`evaluated in ${verdict.timings.deterministicMs + verdict.timings.judgmentMs}ms`} />
            <span className="mono text-[var(--text-muted)]">
              {verdict.timings.deterministicMs}ms deterministic · {verdict.timings.judgmentMs}ms judgment
            </span>
          </div>

          <div>
            <div className="section-header mb-2">Copy</div>
            <div className="border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3 text-[15px] leading-relaxed">
              {segments.map((s, i) =>
                s.finding ? (
                  <span key={i} className="underline-finding"
                    style={{ textDecorationColor: severityColor[s.finding.severity] }}
                    title={`${s.finding.ruleId} — ${s.finding.title}`}>
                    {s.text}
                  </span>
                ) : (
                  <span key={i}>{s.text}</span>
                ),
              )}
            </div>
          </div>

          <div>
            <div className="section-header mb-2 flex items-center gap-2">
              <span>{shown.length ? `${shown.length} finding${shown.length > 1 ? "s" : ""}` : "No findings"}</span>
              {streaming && (
                <span className="mono normal-case tracking-normal text-[var(--text-muted)]">
                  judgment checks streaming…
                </span>
              )}
              {shown.length > 0 && (
                <span className="mono normal-case tracking-normal text-[var(--text-muted)] ml-auto">
                  j / k to move · a to apply
                </span>
              )}
            </div>
            {stage === 0 ? (
              <div className="border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3 space-y-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-2.5 rounded bg-[var(--border)]" style={{ width: `${70 - i * 25}%` }} />
                ))}
              </div>
            ) : shown.length ? (
              <div className="space-y-3">
                {shown.map((f, i) => (
                  <div key={f.ruleId + f.quotedText}
                    onMouseEnter={() => { setCursor(i); setActiveRule(f.ruleId); }}
                    className={i === cursor ? "ring-1 ring-[var(--accent)] rounded" : undefined}>
                    <FindingCard finding={f} assetId={asset.id} onApply={onApply} applied={false} />
                  </div>
                ))}
                {streaming && (
                  <div className="border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3 space-y-2">
                    <div className="h-2.5 rounded bg-[var(--border)] w-1/2" />
                    <div className="h-2.5 rounded bg-[var(--border)] w-3/4 opacity-60" />
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-[var(--border)] rounded bg-[#F0FDF4] px-4 py-3 text-[13px]"
                style={{ color: "var(--verdict-green)" }}>
                Cleared against rule set v2026.08. Ship without asking.
              </div>
            )}
          </div>

          {verdict.abstained && stage >= 2 && (
            <AbstentionCard reasons={verdict.abstentionReasons} />
          )}

          <div className="border border-[var(--border)] rounded bg-[var(--surface)] divide-y divide-[var(--border)]">
            {accordions.map((a) => (
              <div key={a.key}>
                <button onClick={() => setOpenAccordion(openAccordion === a.key ? null : a.key)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-[13px] hover:bg-[var(--bg)]">
                  <span>{a.label}</span>
                  <ChevronRight size={13}
                    className={cx("transition-transform text-[var(--text-muted)]", openAccordion === a.key && "rotate-90")} />
                </button>
                {openAccordion === a.key && (
                  <div className="px-4 pb-3 text-[13px] text-[var(--text-muted)] leading-relaxed">{a.body}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </>
  );
}
