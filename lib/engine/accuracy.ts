import { labelled } from "@/data/labelled";
import { evaluateText } from "./index";

// Accuracy card — PRD §6 C6.
//
// Nobody in compliance publishes one. Doing it is the cheapest credibility moat
// available, and it only means anything if the failures are reported too — a card
// that always reads 100% is marketing, not measurement.

export interface AccuracyResult {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  /** Share of clean cases that drew at least one finding. NFR target: <10% (§14.1). */
  falsePositiveRate: number;
  /** Recall restricted to critical-severity rules. NFR target: >95%. Missing a RED
   *  is the only unacceptable failure. */
  highSeverityRecall: number;
  cleanCases: number;
  totalCases: number;
  misses: { id: string; copy: string; missed: string[]; spurious: string[]; note: string }[];
}

const CRITICAL = new Set([
  "ASCI-I-1", "ASCI-I-2", "ASCI-I-3", "ASCI-II-2", "ASCI-III-1", "ASCI-IV-1",
  "ASCI-IV-3", "ASCI-INF-1", "ASCI-INF-2", "ASCI-INF-4", "ASCI-AI-H",
  "CCPA-MA-4", "CCPA-MA-7", "CCPA-MA-8", "CCPA-100", "CCPA-GW-3",
  "FSSAI-AC-4", "FSSAI-AC-6", "FSSAI-AC-9", "DMR-3", "DC-COS-1",
  "UL-RMC-1", "BRAND-DOVE-1",
]);

export function computeAccuracy(): AccuracyResult {
  let tp = 0, fp = 0, fn = 0;
  let hsExpected = 0, hsFound = 0;
  let cleanCases = 0, cleanWithFindings = 0;
  const misses: AccuracyResult["misses"] = [];

  for (const c of labelled) {
    const { verdict } = evaluateText(c.copy, c.market, { sku: c.sku, brand: c.brand });
    const fired = new Set(verdict.findings.map((f) => f.ruleId));
    const expected = new Set(c.expected);

    const missed = [...expected].filter((r) => !fired.has(r));
    const spurious = [...fired].filter((r) => !expected.has(r));

    tp += [...expected].filter((r) => fired.has(r)).length;
    fn += missed.length;
    fp += spurious.length;

    for (const r of expected) {
      if (!CRITICAL.has(r)) continue;
      hsExpected++;
      if (fired.has(r)) hsFound++;
    }

    if (!c.expected.length) {
      cleanCases++;
      if (fired.size) cleanWithFindings++;
    }
    if (missed.length || spurious.length) {
      misses.push({ id: c.id, copy: c.copy, missed, spurious, note: c.note });
    }
  }

  const safe = (n: number, d: number) => (d === 0 ? 1 : n / d);

  return {
    truePositives: tp,
    falsePositives: fp,
    falseNegatives: fn,
    precision: safe(tp, tp + fp),
    recall: safe(tp, tp + fn),
    falsePositiveRate: safe(cleanWithFindings, cleanCases),
    highSeverityRecall: safe(hsFound, hsExpected),
    cleanCases,
    totalCases: labelled.length,
    misses,
  };
}
