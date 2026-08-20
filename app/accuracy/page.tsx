"use client";

import { useMemo } from "react";
import { computeAccuracy } from "@/lib/engine/accuracy";
import { labelled } from "@/data/labelled";
import { useMounted } from "@/lib/useMounted";
import { verdictColor } from "@/lib/ui";
import { RULE_SET_VERSION } from "@/data/rules";

// PRD §6 C6. Nobody in compliance publishes an accuracy card, which is exactly why
// publishing one is the cheapest credibility available.
//
// The card is computed live from data/labelled.ts on every render — it is not a
// number typed into a slide. It also states its own limits, because a perfect score
// on thirty author-written labels is a weak claim presented honestly and a dishonest
// one presented as "validated".

function Metric({
  label, value, target, met, note,
}: { label: string; value: string; target: string; met: boolean; note: string }) {
  return (
    <div className="flex-1 border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3">
      <div className="section-header mb-1.5">{label}</div>
      <div className="text-[24px] font-semibold leading-none"
        style={{ color: met ? verdictColor.GREEN : verdictColor.AMBER }}>
        {value}
      </div>
      <div className="mono text-[var(--text-muted)] mt-1.5">target {target}</div>
      <div className="text-[12px] text-[var(--text-muted)] mt-1.5 leading-snug">{note}</div>
    </div>
  );
}

export default function AccuracyCard() {
  const mounted = useMounted();
  const r = useMemo(() => computeAccuracy(), []);
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  if (!mounted) {
    return <><h1 className="text-[24px] font-semibold mb-5">Accuracy Card</h1>
      <div className="border border-[var(--border)] rounded h-40 bg-[var(--surface)]" /></>;
  }

  return (
    <>
      <h1 className="text-[24px] font-semibold mb-1">Accuracy Card</h1>
      <div className="mono text-[var(--text-muted)] mb-6">
        measured live over {r.totalCases} labelled cases · rule set {RULE_SET_VERSION} · recomputed on load
      </div>

      <div data-tour="accuracy-metrics" className="flex gap-3 mb-4">
        <Metric label="Recall — high severity" value={pct(r.highSeverityRecall)} target="> 95%"
          met={r.highSeverityRecall > 0.95}
          note="Missing a RED is the only unacceptable failure." />
        <Metric label="Precision" value={pct(r.precision)} target="high"
          met={r.precision > 0.9}
          note="Of the findings raised, the share that were expected." />
        <Metric label="Recall — all" value={pct(r.recall)} target="high"
          met={r.recall > 0.9}
          note="Of the findings expected, the share that fired." />
        <Metric label="False-positive rate" value={pct(r.falsePositiveRate)} target="< 10%"
          met={r.falsePositiveRate < 0.1}
          note={`Share of the ${r.cleanCases} clean cases that drew any finding.`} />
      </div>

      <div className="flex gap-6 mono text-[var(--text-muted)] mb-6 border-y border-[var(--border)] py-3">
        <span>true positives {r.truePositives}</span>
        <span>false positives {r.falsePositives}</span>
        <span>false negatives {r.falseNegatives}</span>
        <span>clean cases {r.cleanCases} of {r.totalCases}</span>
      </div>

      {/* Failures are the part of an accuracy card that carries information. */}
      <div className="section-header mb-2">Disagreements between engine and label</div>
      {r.misses.length ? (
        <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-hidden mb-6">
          {r.misses.map((m) => (
            <div key={m.id} className="px-4 py-3 border-b border-[var(--border)] last:border-0">
              <div className="flex items-baseline gap-3">
                <span className="mono text-[var(--text-muted)]">{m.id}</span>
                <span className="text-[13px]">{m.copy}</span>
              </div>
              <div className="mono mt-1.5 flex gap-4">
                {m.missed.length > 0 && (
                  <span style={{ color: verdictColor.RED }}>missed {m.missed.join(", ")}</span>
                )}
                {m.spurious.length > 0 && (
                  <span style={{ color: verdictColor.AMBER }}>spurious {m.spurious.join(", ")}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded bg-[var(--surface)] px-4 py-3 text-[13px] mb-6">
          None. The engine agrees with every label in the current set — which is a
          statement about a 30-case set, not about production accuracy. See the limits below.
        </div>
      )}

      {/* Read this before quoting any number above. */}
      <div className="border rounded px-4 py-3"
        style={{ background: "#FFFBEB", borderColor: verdictColor.AMBER }}>
        <div className="section-header mb-2" style={{ color: verdictColor.AMBER }}>
          What this card does not say
        </div>
        <ul className="text-[13px] leading-relaxed space-y-1.5">
          <li>
            <strong>{r.totalCases} cases is a small set.</strong> It is enough to catch
            regressions between releases and not enough to establish production accuracy.
          </li>
          <li>
            <strong>The labels were authored during this build, from the rule pack.</strong>{" "}
            They are not adjudicated by regulatory counsel. This measures agreement with
            one reading of the rules, not with a regulator&rsquo;s.
          </li>
          <li>
            <strong>Labels were written before the engine was measured against them.</strong>{" "}
            Three engine defects and one incorrect label were found this way; the label
            correction is recorded in <span className="mono">data/labelled.ts</span> rather
            than quietly applied.
          </li>
          <li>
            <strong>Judgment rules are under-represented.</strong> The set leans on
            deterministic checks, which are the easy half. Cultural and implied-superiority
            reasoning needs human adjudication to label at all.
          </li>
        </ul>
      </div>

      <details className="mt-4">
        <summary className="section-header cursor-pointer">The {labelled.length} labelled cases</summary>
        <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-hidden mt-2">
          {labelled.map((c) => (
            <div key={c.id} className="px-4 py-2 border-b border-[var(--border)] last:border-0 flex items-baseline gap-3 text-[13px]">
              <span className="mono text-[var(--text-muted)] w-12 shrink-0">{c.id}</span>
              <span className="mono w-10 shrink-0">{c.market}</span>
              <span className="flex-1">{c.copy}</span>
              <span className="mono text-[var(--text-muted)]">
                {c.expected.length ? c.expected.join(", ") : "clean"}
              </span>
            </div>
          ))}
        </div>
      </details>
    </>
  );
}
