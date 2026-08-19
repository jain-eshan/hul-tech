// PRAMAAN — the contract. PRD §10.3 Step 0.
//
// Every track imports from this file and never edits it. Two type-level decisions
// below are product decisions, not modelling convenience (PRD §9.4):
//
//   1. Finding.ruleId is REQUIRED. A finding without a rule cannot be constructed.
//      This is the type-system expression of `finding.rule_id NOT NULL` — the model
//      physically cannot emit an uncited verdict.
//   2. Verdict and Approval are append-only. Nothing in this codebase mutates one.

export type Market =
  | "IN" | "AE" | "ZA" | "BR" | "ID" | "PH" | "TH" | "MX" | "EG"
  | "UK" | "DE" | "VN" | "US";

export type Severity = "critical" | "major" | "minor";
export type TestType = "deterministic" | "judgment";
export type VerdictStatus = "RED" | "AMBER" | "GREEN";
export type Routing = "auto" | "single_approver" | "full_chain" | "abstain";

export type ClaimType =
  | "performance" | "comparative" | "health" | "nutrition" | "environmental"
  | "testimonial" | "safety" | "price_offer" | "tagline";

export type EvidenceGrade = "clinical" | "lab" | "consumer-panel" | "supply-chain" | "none";
export type ClaimStatus = "active" | "retired" | "expiring";
export type AiTier = "high" | "medium" | "low";
export type BindingLevel = "pledge" | "guideline" | "preference";

// ── Knowledge plane ─────────────────────────────────────────────────────────

/** A rule is data, and data has a version hash. That is why we can replay (§7.10). */
export interface Rule {
  id: string;
  regulator: string;
  clauseRef: string;
  title: string;
  testType: TestType;
  severity: Severity;
  jurisdictions: Market[] | "all";
  categories: string[] | "all";
  version: string;
  effectiveFrom: string;
  sourceUrl: string;
  /** Marks rules not yet in force. Rendered as a visible "draft" tag (§13 integrity). */
  draft?: boolean;
  /** Human-readable description of the machine test, for the finding explanation. */
  test: string;
}

export interface ApprovedClaim {
  id: string;
  canonicalText: string;
  claimType: ClaimType;
  productSku: string;
  brand: string;
  markets: Market[] | "all";
  dossierRef: string;
  evidenceGrade: EvidenceGrade;
  validFrom: string;
  expiresOn: string | null;
  status: ClaimStatus;
  retiredReason?: string;
}

export interface BrandCodexEntry {
  id: string;
  brand: string;
  ruleText: string;
  source: string;
  /** A pledge hard-blocks. It does not advise. (§7.8 BRAND-DOVE-1) */
  bindingLevel: BindingLevel;
  marketScope: Market[] | "all";
}

export interface Precedent {
  id: string;
  claimText: string;
  market: Market;
  verdict: VerdictStatus;
  rationale: string;
  objectionText?: string;
  outcome: string;
  adjudicatedBy: string;
  adjudicatedAt: string;
}

// ── Decision plane ──────────────────────────────────────────────────────────

export type Surface =
  | "headline" | "body" | "cta" | "on_pack" | "overlay" | "voiceover"
  | "hashtag" | "alt_text" | "caption";

export interface ExtractedClaim {
  id: string;
  claimText: string;
  claimType: ClaimType;
  surface: Surface;
  /** Video: seconds into the asset. Static: undefined. */
  frameRef?: number;
  bbox?: { x: number; y: number; w: number; h: number };
  matchedClaimId?: string;
  matchConfidence?: number;
}

export interface Asset {
  id: string;
  hash: string;
  brand: string;
  sku: string;
  campaign: string;
  market: Market;
  language: string;
  channel: string;
  format: "static" | "video" | "reel" | "listing" | "story";
  sourceSystem: string;
  copy: string;
  /** Cached extraction. Replay re-runs decisions over these, never re-extracts (§5.5.7). */
  extracted: ExtractedClaim[];
  aiGenerated: boolean;
  aiTier: AiTier;
  c2paManifest: boolean;
  /** Consequence inputs for routing (§6 A9). */
  reachEstimate: number;
  spend: number;
  reversibility: number;
  durationSeconds?: number;
  labelDurationSeconds?: number;
  /** Statics have no duration, so prominence is the label test that applies to them. */
  labelBelowFold?: boolean;
  containsHumanLikeness?: boolean;
  likenessEnrolled?: boolean;
  createdAt: string;
}

/**
 * ruleId and clauseRef are required. Construction of an uncited finding is a
 * compile error — the enforcement point for PRD §13's "zero findings render
 * without a clause reference".
 */
export interface Finding {
  ruleId: string;
  clauseRef: string;
  regulator: string;
  severity: Severity;
  testType: TestType;
  title: string;
  /** The exact span in the copy that triggered this. Underline the claim, not the asset. */
  quotedText: string;
  explanation: string;
  suggestedFix?: string;
  /** The literal replacement text, so Apply can mutate the copy rather than describe a fix. */
  fixReplacement?: string;
  altFix?: string;
  evidenceRef?: string;
  sourceUrl: string;
  draft?: boolean;
  humanDisposition?: "accepted" | "overridden";
}

export interface Verdict {
  id: string;
  assetId: string;
  ruleSetVersionHash: string;
  status: VerdictStatus;
  confidence: number;
  routing: Routing;
  findings: Finding[];
  /** Milliseconds of engine time, split so the architecture is visible (§5.2). */
  timings: { deterministicMs: number; judgmentMs: number };
  modelVersions: Record<string, string>;
  createdAt: string;
}

// ── Ring 0 ──────────────────────────────────────────────────────────────────

export interface ConstraintPack {
  brand: string;
  sku: string;
  market: Market;
  channel: string;
  ruleSetVersion: string;
  permittedClaims: string[];
  prohibitedTerms: string[];
  prohibitedPatterns: string[];
  hardConstraints: { source: string; text: string; bindingLevel: BindingLevel }[];
  requiredDisclosures: string[];
}

// ── Evidence & surveillance planes ──────────────────────────────────────────

export interface LedgerEntry {
  id: string;
  timestamp: string;
  assetId: string;
  ruleSetVersionHash: string;
  status: VerdictStatus;
  findingCount: number;
  approver: string;
  action: string;
  reasoning?: string;
}

export interface Observation {
  id: string;
  assetId?: string;
  url: string;
  platform: string;
  handle: string;
  snapshotHash: string;
  observedAt: string;
  disclosurePresent: boolean;
  claimMatch: boolean;
  status: "clean" | "drift" | "breach";
}

export type Persona = "abm" | "legal" | "director";
