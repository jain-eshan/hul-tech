import type {
  Asset, ApprovedClaim, ExtractedClaim, Finding, Market, Rule,
  Routing, Verdict, VerdictStatus,
} from "@/lib/types";
import { rules as defaultRules, ruleById, ruleSetHash, RULE_SET_VERSION } from "@/data/rules";
import { claims as ledger, brandCodex } from "@/data/claims";
import * as d from "./deterministic";

// The decision plane — PRD §5.2.
//
// Two physically separate code paths. Deterministic checks are pure code and never
// touch a model. Judgment checks are the ones a model performs in production; in the
// prototype they run locally over the same rule pack so the offline walkthrough works
// (PRD §13 resilience), and Live Check routes them to Gemini instead.
//
// evaluate() is the single entry point. Clearance, batch review and rule replay all
// call it — replay is not a separate code path, which is the whole point of §6 C3.

export interface RuleSetOptions {
  /** v2026.09 tightens ASCI-AI-M: the label must persist the full duration. */
  aiLabelFullDuration: boolean;
  version: string;
}

export const RULESET_CURRENT: RuleSetOptions = { aiLabelFullDuration: false, version: RULE_SET_VERSION };
export const RULESET_NEXT: RuleSetOptions = { aiLabelFullDuration: true, version: "v2026.09" };

// ── Finding construction ────────────────────────────────────────────────────

/**
 * The only way to build a Finding. Resolves the rule from the pack and throws if it
 * is absent, so a finding citing a rule that does not exist cannot be constructed.
 * Together with Finding.ruleId being a required field, this makes PRD §13's
 * "zero findings render without a clause reference" structural rather than tested.
 */
function finding(
  ruleId: string,
  parts: {
    quotedText: string; explanation: string; suggestedFix?: string; altFix?: string;
    evidenceRef?: string;
    /**
     * Severity is outcome-dependent for some rules. ASCI-I-1 is the clear case: the
     * PRD's own test reads "wrong-market match → AMBER; no match → RED" — same clause,
     * two consequences, because a registered claim in the wrong market is a paperwork
     * gap while an unmatched claim is an unsubstantiated assertion.
     */
    severity?: Finding["severity"];
  },
): Finding {
  const rule = ruleById.get(ruleId);
  if (!rule) throw new Error(`Uncitable finding: no rule "${ruleId}" in rule set ${RULE_SET_VERSION}`);
  return {
    ruleId: rule.id,
    clauseRef: rule.clauseRef,
    regulator: rule.regulator,
    severity: parts.severity ?? rule.severity,
    testType: rule.testType,
    title: rule.title,
    sourceUrl: rule.sourceUrl,
    draft: rule.draft,
    ...parts,
  };
}

// ── Claims Ledger match (A2) ────────────────────────────────────────────────

/** Fuzzy-normalise, then exact-score. Below threshold is unmatched, never guessed. */
function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/(\d+)\s*(h|hr|hrs|hour|hours)\b/g, "$1h")
    // Keep decimal points and fractions ("99.9", "1/4"); drop sentence punctuation,
    // which would otherwise ride along on the final token and sink an exact match.
    .replace(/(?<!\d)\.(?!\d)/g, " ")
    .replace(/(?<!\d)\/(?!\d)/g, " ")
    .replace(/[^\w\s%./]/g, " ")
    .replace(/\b(the|a|an|our|new|your)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MATCH_THRESHOLD = 0.82;

function score(a: string, b: string): number {
  if (a === b) return 1;
  const ta = new Set(a.split(" ").filter(Boolean));
  const tb = new Set(b.split(" ").filter(Boolean));
  let shared = 0;
  ta.forEach((t) => { if (tb.has(t)) shared++; });
  return (2 * shared) / (ta.size + tb.size);
}

export interface LedgerMatch {
  claim?: ApprovedClaim;
  confidence: number;
  outcome: "matched" | "wrong_market" | "retired" | "unmatched" | "not_objective";
}

export function matchClaim(extracted: ExtractedClaim, market: Market, sku: string): LedgerMatch {
  if (extracted.claimType === "tagline") return { confidence: 1, outcome: "not_objective" };

  const target = normalise(extracted.claimText);
  let best: ApprovedClaim | undefined;
  let bestScore = 0;
  for (const c of ledger) {
    const s = score(target, normalise(c.canonicalText));
    // Prefer the same SKU when two claims score equally.
    const adjusted = c.productSku === sku ? s + 0.01 : s;
    if (adjusted > bestScore) { bestScore = adjusted; best = c; }
  }

  if (!best || bestScore < MATCH_THRESHOLD) return { confidence: bestScore, outcome: "unmatched" };
  if (best.status === "retired") return { claim: best, confidence: bestScore, outcome: "retired" };

  const inMarket = best.markets === "all" || (best.markets as Market[]).includes(market);
  return { claim: best, confidence: bestScore, outcome: inMarket ? "matched" : "wrong_market" };
}

/** The market-compliant alternative for the same SKU, if the ledger holds one. */
function marketAlternative(sku: string, market: Market): ApprovedClaim | undefined {
  return ledger.find(
    (c) => c.productSku === sku && c.status === "active" &&
      (c.markets === "all" || (c.markets as Market[]).includes(market)),
  );
}

// ── evaluate ────────────────────────────────────────────────────────────────

const MARKET_NAMES: Record<string, string> = {
  IN: "India", AE: "UAE", ZA: "South Africa", BR: "Brazil", ID: "Indonesia",
  PH: "Philippines", TH: "Thailand", MX: "Mexico", EG: "Egypt",
  UK: "United Kingdom", DE: "Germany", VN: "Vietnam", US: "United States",
};

function ruleApplies(rule: Rule, market: Market): boolean {
  return rule.jurisdictions === "all" || (rule.jurisdictions as Market[]).includes(market);
}

export function evaluate(asset: Asset, opts: RuleSetOptions = RULESET_CURRENT): Verdict {
  const t0 = Date.now();
  const findings: Finding[] = [];
  const market = asset.market;
  const marketName = MARKET_NAMES[market] ?? market;
  const has = (id: string) => ruleApplies(ruleById.get(id)!, market);

  // ── Deterministic path (pure code, no model) ──────────────────────────────

  const copy = asset.copy;
  const allText = [copy, ...asset.extracted.map((e) => e.claimText)].join("  ");

  if (has("CCPA-100")) {
    const r = d.absoluteQuantifier(allText);
    if (r.matched) {
      const backing = asset.extracted.some((e) => {
        const m = matchClaim(e, market, asset.sku);
        return m.outcome === "matched" && (m.claim!.evidenceGrade === "lab" || m.claim!.evidenceGrade === "clinical");
      });
      if (!backing) {
        findings.push(finding("CCPA-100", {
          quotedText: r.spans[0].text,
          explanation: `A "100%" claim must be literally and completely verifiable. No lab or clinical dossier is on file for ${asset.sku} in ${marketName}.`,
          suggestedFix: "Remove the absolute quantifier, or state the specific attribute the figure applies to.",
          altFix: "Attach the supporting lab dossier to keep the wording.",
        }));
      }
    }
  }

  if (has("ASCI-IV-3")) {
    const r = d.superiorityClaim(allText);
    if (r.matched) {
      findings.push(finding("ASCI-IV-3", {
        quotedText: r.spans[0].text,
        explanation: `"${r.spans[0].text}" implies superiority. A superiority dossier valid in ${marketName} is required and none is registered for ${asset.sku}.`,
        suggestedFix: "Replace with a substantiated performance claim from the ledger.",
        altFix: "Register a market-valid superiority dossier to keep the wording.",
      }));
    }
  }

  if (has("CCPA-GW-3")) {
    const r = d.prohibitedTerms(allText, d.ENVIRONMENTAL_TERMS);
    if (r.matched) {
      findings.push(finding("CCPA-GW-3", {
        quotedText: r.spans[0].text,
        explanation: `Environmental claims must be specific and substantiated. "${r.spans[0].text}" is a vague absolute with no environmental dossier on file for ${marketName}.`,
        suggestedFix: "Name the specific environmental attribute and its evidence.",
      }));
    }
  }

  if (has("ASCI-I-4")) {
    const r = d.manufacturedPrecision(allText);
    if (r.matched) {
      findings.push(finding("ASCI-I-4", {
        quotedText: r.spans[0].text,
        explanation: `"${r.spans[0].text}" implies greater precision than the evidence supports. This pattern is named in ASCI's FY25-26 violation report.`,
        suggestedFix: "State the effect without manufactured precision.",
      }));
    }
  }

  if (has("CCPA-DP-7")) {
    const r = d.falseUrgency(allText);
    if (r.matched) {
      findings.push(finding("CCPA-DP-7", {
        quotedText: r.spans[0].text,
        explanation: `False urgency is a listed dark pattern. "${r.spans[0].text}" applies purchase pressure that is not verifiably true.`,
        suggestedFix: "Remove the urgency device, or state the actual stock or deadline.",
      }));
    }
  }

  if (has("DMR-3")) {
    const r = d.therapeuticVerb(allText);
    if (r.matched) {
      findings.push(finding("DMR-3", {
        quotedText: r.spans[0].text,
        explanation: `"${r.spans[0].text}" suggests treatment or cure of a scheduled condition. A cosmetic may describe appearance, not therapy.`,
        suggestedFix: 'Reframe to appearance: "reduces the appearance of" rather than "treats".',
      }));
    }
  }

  if (has("FSSAI-AC-6")) {
    const r = d.prohibitedTerms(allText, d.HEALTH_DRINK_TERMS);
    if (r.matched) {
      findings.push(finding("FSSAI-AC-6", {
        quotedText: r.spans[0].text,
        explanation: 'No "health drink" category exists under the FSS Act 2006. The category was renamed to Functional Nutrition Drinks in Apr 2024.',
      }));
    }
  }

  // AI disclosure tier — the rule the replay tightens.
  if (asset.aiGenerated && asset.aiTier === "medium" && has("ASCI-AI-M")) {
    const r = asset.durationSeconds === undefined && asset.labelBelowFold
      ? { matched: opts.aiLabelFullDuration, spans: [], detail: "Label placed below the fold" }
      : d.labelDuration(asset.labelDurationSeconds, asset.durationSeconds, opts.aiLabelFullDuration);
    if (r.matched) {
      findings.push(finding("ASCI-AI-M", {
        quotedText: "AI disclosure label",
        explanation: opts.aiLabelFullDuration
          ? `Synthetic content must carry a prominent label for the full duration of the asset. ${r.detail}.`
          : `Synthetic content must carry a prominent label. ${r.detail}.`,
        suggestedFix: asset.durationSeconds
          ? `Extend the on-screen label to the full ${asset.durationSeconds}s.`
          : "Move the label above the fold so it is prominent on first view.",
      }));
    }
  }

  if (asset.aiGenerated && !asset.c2paManifest) {
    const r = d.c2paManifestValid(asset.c2paManifest);
    if (r.matched && has("MEITY-SM-1")) {
      findings.push(finding("MEITY-SM-1", {
        quotedText: "C2PA manifest",
        explanation: `${r.detail}. Absence of a valid signed manifest is itself an alert for synthetically generated information.`,
        suggestedFix: "Re-export from the generation tool with Content Credentials enabled.",
      }));
    }
  }

  // Unenrolled likeness — high tier, prohibited, no fix path.
  if (asset.containsHumanLikeness && !asset.likenessEnrolled) {
    findings.push(finding("ASCI-AI-H", {
      quotedText: "human likeness in frame",
      explanation:
        "The variant reproduces a real person's likeness with no matching entry in the enrolled entity registry. High-risk AI content is prohibited — a label does not cure it.",
      altFix: "Regenerate without the likeness, or enrol the individual with a consent scope covering this market, channel and format.",
    }));
  }

  // Brand codex pledges hard-block. A pledge is not a guideline.
  if (asset.aiGenerated && asset.containsHumanLikeness) {
    const pledge = brandCodex.find((c) => c.brand === asset.brand && c.bindingLevel === "pledge");
    if (pledge) {
      findings.push(finding("BRAND-DOVE-1", {
        quotedText: "AI-generated human likeness",
        explanation: `${pledge.ruleText} Binding level: PLEDGE — this hard-blocks, it does not advise. Source: ${pledge.source}.`,
        evidenceRef: pledge.id,
      }));
    }
  }

  const deterministicMs = Math.max(1, Date.now() - t0);
  const t1 = Date.now();

  // ── Judgment path (model in production, local over the same pack here) ────

  for (const e of asset.extracted) {
    const m = matchClaim(e, market, asset.sku);
    if (m.outcome === "matched" || m.outcome === "not_objective") continue;

    if (m.outcome === "retired") {
      findings.push(finding("ASCI-I-1", {
        quotedText: e.claimText,
        explanation: `"${e.claimText}" is on the retired register. ${m.claim!.retiredReason}`,
        altFix: "Select a current claim from the ledger for this SKU and market.",
        evidenceRef: m.claim!.id,
      }));
      continue;
    }

    if (m.outcome === "wrong_market") {
      const alt = marketAlternative(asset.sku, market);
      findings.push(finding("ASCI-I-1", {
        quotedText: e.claimText,
        severity: "major", // wrong market is AMBER, not RED — the claim exists, the registration does not
        explanation: `"${e.claimText}" is substantiated under ${m.claim!.dossierRef} (${m.claim!.evidenceGrade}), which is not registered for ${marketName}. Claims must be capable of substantiation in the market of publication.`,
        suggestedFix: alt ? `Use "${alt.canonicalText}"` : undefined,
        altFix: `Attach ${m.claim!.dossierRef} for ${marketName} to keep the original wording.`,
        evidenceRef: m.claim!.dossierRef,
      }));
      continue;
    }

    findings.push(finding("ASCI-I-1", {
      quotedText: e.claimText,
      explanation: `"${e.claimText}" does not resolve to any approved claim for ${asset.sku} in ${marketName} (best match ${(m.confidence * 100).toFixed(0)}%, below the ${MATCH_THRESHOLD * 100}% floor). Unmatched claims are never guessed.`,
      altFix: "Route to Claims & Technical Insights with a substantiation request.",
    }));
  }

  const judgmentMs = Math.max(1, Date.now() - t1);

  // ── Aggregate, confidence, routing (A9) ──────────────────────────────────

  const critical = findings.filter((f) => f.severity === "critical").length;
  const major = findings.filter((f) => f.severity === "major").length;

  let status: VerdictStatus = "GREEN";
  if (critical > 0) status = "RED";
  else if (major > 0 || findings.length > 0) status = "AMBER";

  // Confidence falls with judgment-path involvement and with near-threshold matches.
  const judgmentFindings = findings.filter((f) => f.testType === "judgment").length;
  let confidence = 0.97 - judgmentFindings * 0.04 - (status === "AMBER" ? 0.02 : 0);
  confidence = Math.max(0.4, Math.min(0.99, Number(confidence.toFixed(2))));

  // consequence = reach × spend × (1 − reversibility) × severity × enforcement intensity
  const enforcement = market === "IN" ? 1.0 : 0.7;
  const consequence =
    (asset.reachEstimate / 1_000_000) * (asset.spend / 1_000_000) *
    (1 - asset.reversibility) * (1 + critical * 2 + major) * enforcement;
  const highConsequence = consequence > 1.5;

  let routing: Routing;
  if (confidence < 0.6) routing = "abstain";
  else if (status === "RED" || highConsequence) routing = "full_chain";
  else if (status === "AMBER") routing = "single_approver";
  else if (confidence >= 0.85) routing = "auto";
  else routing = "single_approver";

  return {
    id: `V-${asset.id}-${opts.version}`,
    assetId: asset.id,
    ruleSetVersionHash: ruleSetHash(defaultRules),
    status,
    confidence,
    routing,
    findings,
    timings: { deterministicMs, judgmentMs },
    modelVersions: { deterministic: "pure-code", judgment: "local-rulepack", rulePack: opts.version },
    createdAt: new Date().toISOString(),
  };
}

// ── Free-text clearance (Live Check, and the silent fallback) ───────────────

/**
 * Extraction over typed copy. Splits into claim-bearing sentences and types them
 * heuristically, which is what the multimodal extractor (A1) produces before ledger
 * lookup. This is also the deterministic fallback Live Check drops to when the model
 * route times out — the screen must never show a judge an error (PRD §11.12).
 */
export function evaluateText(
  copy: string,
  market: Market = "IN",
  meta: Partial<Asset> = {},
): { asset: Asset; verdict: Verdict } {
  const sentences = copy
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  const typeOf = (s: string): ExtractedClaim["claimType"] => {
    const l = s.toLowerCase();
    if (/\b(eco|green|sustainab|natural|carbon|planet)/.test(l)) return "environmental";
    if (/\b(cures?|treats?|heals?|prevents?|clinical|dermatolog)/.test(l)) return "health";
    if (/\b(no\.?\s?1|#1|best|leading|better than|vs\b)/.test(l)) return "comparative";
    if (/\b(free|off|only \d|price|₹|discount)/.test(l)) return "price_offer";
    if (/\b(recommended by|users? say|reviewed)/.test(l)) return "testimonial";
    if (/\b\d/.test(l)) return "performance";
    return "tagline";
  };

  const asset: Asset = {
    id: "LIVE", hash: "live", brand: meta.brand ?? "Live Check", sku: meta.sku ?? "LIVE-SKU",
    campaign: "Live Check", market, language: "English", channel: "web", format: "static",
    sourceSystem: "Live Check", copy,
    extracted: sentences.map((s, i) => ({
      id: `LIVE-EXT-${i}`, claimText: s, claimType: typeOf(s), surface: i === 0 ? "headline" : "body",
    })),
    aiGenerated: false, aiTier: "low", c2paManifest: true,
    reachEstimate: 100_000, spend: 100_000, reversibility: 0.9,
    createdAt: new Date().toISOString(),
    ...meta,
  };

  return { asset, verdict: evaluate(asset) };
}
