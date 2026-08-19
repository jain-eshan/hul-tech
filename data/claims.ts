import type { ApprovedClaim, BrandCodexEntry, Market } from "@/lib/types";

// The Claims Ledger — PRD §8.
//
// The reference standard that does not exist today at any CPG. Pharma has an
// approved label; CPG has nothing. Building this IS the product (§4.2 layer 2).
//
// Seeded from HUL's public brand and claim space. Dossier references are
// illustrative identifiers, not real Unilever document numbers.

const ALL: Market[] = ["IN", "AE", "ZA", "BR", "ID", "PH", "TH", "MX", "EG", "UK", "DE", "VN"];

export const claims: ApprovedClaim[] = [
  // ── 8.1 Rexona — demo-critical ───────────────────────────────────────────
  {
    id: "CLM-001", canonicalText: "Clinically proven 72h protection", claimType: "performance",
    // PRD §8.1 lists this as substantiated in "EU, UK, AE", but §11.5 requires
    // BOTH the UK and DE variants to return AMBER. The demo screen is authoritative:
    // DOS-EU-4471 is an EU-scoped clinical dossier that is not registered for
    // publication in UK or DE, so only AE resolves. Documented rather than silently
    // reconciled — this is exactly the market-registration gap the product exists to catch.
    productSku: "REX-AP-150", brand: "Rexona", markets: ["AE"],
    dossierRef: "DOS-EU-4471", evidenceGrade: "clinical",
    validFrom: "2024-03-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-002", canonicalText: "72h freshness", claimType: "performance",
    productSku: "REX-AP-150", brand: "Rexona",
    // PRD §8.1 omits UK and DE, but §11.4 and §11.5 both offer this as THE fix for
    // those two markets — a fix that resolves to nothing is worse than no fix at all.
    // It is a consumer-panel descriptive claim, not a clinical one, so registering it
    // in UK/DE is the reconciliation that keeps both sections true.
    markets: ["IN", "AE", "ZA", "BR", "ID", "PH", "VN", "TH", "MX", "EG", "UK", "DE"],
    dossierRef: "DOS-IN-2291", evidenceGrade: "consumer-panel",
    validFrom: "2024-01-15", expiresOn: null, status: "active",
  },
  {
    id: "CLM-003", canonicalText: "It won't ever let you down", claimType: "tagline",
    productSku: "REX-AP-150", brand: "Rexona", markets: "all",
    dossierRef: "DOS-GL-0001", evidenceGrade: "none",
    validFrom: "2022-01-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-004", canonicalText: "Odour protection all day", claimType: "performance",
    productSku: "REX-AP-150", brand: "Rexona", markets: ["IN", "ID", "PH", "VN", "TH"],
    dossierRef: "DOS-IN-2294", evidenceGrade: "consumer-panel",
    validFrom: "2024-02-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-005", canonicalText: "Sweat-activated technology", claimType: "performance",
    productSku: "REX-AP-150", brand: "Rexona", markets: ["IN", "BR", "MX"],
    dossierRef: "DOS-IN-2299", evidenceGrade: "lab",
    validFrom: "2024-05-01", expiresOn: null, status: "active",
  },

  // ── 8.2 Personal care portfolio ──────────────────────────────────────────
  {
    id: "CLM-006", canonicalText: "Removes 99.9% of germs", claimType: "performance",
    productSku: "LIF-SOAP-100", brand: "Lifebuoy", markets: ["IN"],
    dossierRef: "DOS-IN-1180", evidenceGrade: "lab",
    validFrom: "2023-12-01", expiresOn: "2026-11-30", status: "expiring",
  },
  {
    id: "CLM-007", canonicalText: "Dermatologist tested", claimType: "safety",
    productSku: "DOV-BAR-100", brand: "Dove", markets: ["IN", "AE", "ZA"],
    dossierRef: "DOS-IN-3310", evidenceGrade: "clinical",
    validFrom: "2023-06-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-008", canonicalText: "1/4 moisturising cream", claimType: "performance",
    productSku: "DOV-BAR-100", brand: "Dove", markets: "all",
    dossierRef: "DOS-GL-0044", evidenceGrade: "lab",
    validFrom: "2020-01-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-009", canonicalText: "Reduces hair fall from the first wash", claimType: "performance",
    productSku: "SUN-SH-340", brand: "Sunsilk", markets: ["IN"],
    dossierRef: "DOS-IN-2701", evidenceGrade: "consumer-panel",
    validFrom: "2024-04-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-010", canonicalText: "Up to 10x stronger hair", claimType: "performance",
    productSku: "TRE-SH-340", brand: "TRESemmé", markets: ["IN", "TH", "PH"],
    dossierRef: "DOS-IN-2755", evidenceGrade: "lab",
    validFrom: "2024-02-15", expiresOn: null, status: "active",
  },
  {
    id: "CLM-011", canonicalText: "SPF 50 PA+++", claimType: "performance",
    productSku: "LAK-SUN-50", brand: "Lakmé", markets: ["IN"],
    dossierRef: "DOS-IN-4120", evidenceGrade: "lab",
    validFrom: "2023-03-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-012", canonicalText: "Long-lasting 16h wear", claimType: "performance",
    productSku: "LAK-FND-30", brand: "Lakmé", markets: ["IN"],
    dossierRef: "DOS-IN-4155", evidenceGrade: "consumer-panel",
    validFrom: "2024-07-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-013", canonicalText: "Fights 10 signs of ageing", claimType: "performance",
    productSku: "PON-CRM-50", brand: "Pond's", markets: ["IN"],
    dossierRef: "DOS-IN-5010", evidenceGrade: "clinical",
    validFrom: "2023-09-01", expiresOn: null, status: "active",
  },

  // ── 8.3 Home care & foods ────────────────────────────────────────────────
  {
    id: "CLM-014", canonicalText: "Removes tough stains in 1 wash", claimType: "performance",
    productSku: "SUR-DET-1KG", brand: "Surf Excel", markets: ["IN"],
    dossierRef: "DOS-IN-6001", evidenceGrade: "lab",
    validFrom: "2024-01-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-015", canonicalText: "Kills 99.9% of germs on utensils", claimType: "performance",
    productSku: "VIM-LIQ-500", brand: "Vim", markets: ["IN"],
    dossierRef: "DOS-IN-6110", evidenceGrade: "lab",
    validFrom: "2023-11-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-016", canonicalText: "Fortified with 2 vital nutrients", claimType: "nutrition",
    productSku: "HOR-500", brand: "Horlicks", markets: ["IN"],
    dossierRef: "DOS-IN-7220", evidenceGrade: "lab",
    validFrom: "2024-05-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-017", canonicalText: "Made with 100% Indian tea leaves", claimType: "performance",
    productSku: "BRK-TEA-500", brand: "Brooke Bond", markets: ["IN"],
    dossierRef: "DOS-IN-7401", evidenceGrade: "supply-chain",
    validFrom: "2023-08-01", expiresOn: null, status: "active",
  },
  {
    id: "CLM-018", canonicalText: "No added preservatives", claimType: "nutrition",
    productSku: "KIS-JAM-500", brand: "Kissan", markets: ["IN"],
    dossierRef: "DOS-IN-7455", evidenceGrade: "lab",
    validFrom: "2024-03-01", expiresOn: null, status: "active",
  },

  // ── 8.4 The retired register (§8.4) ──────────────────────────────────────
  // The only artefact that stops a rotating ABM re-proposing a claim the company
  // already abandoned. ABMs rotate every 12–18 months; the register does not.
  {
    id: "CLM-R01", canonicalText: "100% natural ingredients", claimType: "environmental",
    productSku: "—", brand: "—", markets: [], dossierRef: "—", evidenceGrade: "none",
    validFrom: "2019-01-01", expiresOn: "2026-06-18", status: "retired",
    retiredReason: "CCPA absolute-verifiability ruling, 18 Jun 2026 (CCPA-100 + CCPA-GW-3)",
  },
  {
    id: "CLM-R02", canonicalText: "Health Food Drink", claimType: "health",
    productSku: "HOR-500", brand: "Horlicks", markets: [], dossierRef: "—", evidenceGrade: "none",
    validFrom: "2010-01-01", expiresOn: "2024-04-01", status: "retired",
    retiredReason: "No such category exists under the FSS Act 2006. Renamed to Functional Nutrition Drinks, Apr 2024 (FSSAI-AC-6)",
  },
  {
    id: "CLM-R03", canonicalText: "Reduces hair fall by 11.7x", claimType: "performance",
    productSku: "—", brand: "—", markets: [], dossierRef: "—", evidenceGrade: "none",
    validFrom: "2022-01-01", expiresOn: "2025-03-01", status: "retired",
    retiredReason: "Manufactured scientific precision (ASCI-I-4)",
  },
  {
    id: "CLM-R04", canonicalText: "Fairness guaranteed", claimType: "performance",
    productSku: "—", brand: "—", markets: [], dossierRef: "—", evidenceGrade: "none",
    validFrom: "2015-01-01", expiresOn: "2020-07-01", status: "retired",
    retiredReason: "Fair & Lovely renamed to Glow & Lovely, Jul 2020",
  },
  {
    id: "CLM-R05", canonicalText: "Hair growth of 23,800 strands", claimType: "performance",
    productSku: "—", brand: "—", markets: [], dossierRef: "—", evidenceGrade: "none",
    validFrom: "2023-01-01", expiresOn: "2025-06-01", status: "retired",
    retiredReason: "Manufactured precision (ASCI-I-4); named in ASCI FY25-26 violation patterns",
  },
  {
    id: "CLM-R06", canonicalText: "Eco-friendly formula", claimType: "environmental",
    productSku: "—", brand: "—", markets: [], dossierRef: "—", evidenceGrade: "none",
    validFrom: "2021-01-01", expiresOn: "2024-10-15", status: "retired",
    retiredReason: "Vague environmental absolute (CCPA-GW-3)",
  },
  {
    id: "CLM-R07", canonicalText: "Doctor recommended No.1", claimType: "comparative",
    productSku: "—", brand: "—", markets: [], dossierRef: "—", evidenceGrade: "none",
    validFrom: "2020-01-01", expiresOn: "2024-01-01", status: "retired",
    retiredReason: "Unsubstantiated superiority (ASCI-IV-3)",
  },
];

export const activeClaims = claims.filter((c) => c.status !== "retired");
export const retiredClaims = claims.filter((c) => c.status === "retired");

/** Brand codex. binding_level is the field that does the work (§9.1). */
export const brandCodex: BrandCodexEntry[] = [
  {
    id: "CDX-001", brand: "Dove",
    ruleText: "Dove will never use AI to represent real women in its advertising. Women get to decide and declare what real beauty looks like, not algorithms.",
    source: "Dove Real Beauty Pledge, 9 April 2024",
    bindingLevel: "pledge", marketScope: "all",
  },
  {
    id: "CDX-002", brand: "Dove",
    ruleText: "No digital distortion of body shape, skin or facial features in any Dove asset.",
    source: "Dove Real Beauty Pledge",
    bindingLevel: "pledge", marketScope: "all",
  },
  {
    id: "CDX-003", brand: "Rexona",
    ruleText: "Performance register is confidence and movement, never clinical authority.",
    source: "Brand DNAi — Rexona tone of voice",
    bindingLevel: "guideline", marketScope: "all",
  },
  {
    id: "CDX-004", brand: "Lifebuoy",
    ruleText: "Germ-protection claims must be framed as protection, never as disease treatment or cure.",
    source: "Brand DNAi — Lifebuoy claim register",
    bindingLevel: "guideline", marketScope: "all",
  },
  {
    id: "CDX-005", brand: "Lakmé",
    ruleText: "No skin-tone alteration in retouching. Shade range must be shown as offered.",
    source: "Brand DNAi — Lakmé visual identity",
    bindingLevel: "pledge", marketScope: ["IN"],
  },
];

export const ALL_MARKETS = ALL;
