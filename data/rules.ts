import type { Rule } from "@/lib/types";

// PRAMAAN rule pack — PRD §7.
//
// ⚠️ Rule text is PARAPHRASED FOR MACHINE EXECUTION. It is not verbatim statutory
// language and must never be presented as such. Production rule packs are authored
// and maintained by regulatory counsel (PRD §7 preamble, §14.3).
//
// sourceUrl points at the governing regulator or instrument. Deep links are
// deliberately avoided: a stable official page is honest, an invented path is not.
//
// 47 rules across 8 regulators. Rules marked `draft: true` are not in force and
// render a visible "draft" tag in the UI (PRD §13 integrity).

export const RULE_SET_VERSION = "v2026.08";

const ASCI = "https://www.ascionline.in/the-asci-code/";
const ASCI_GUIDELINES = "https://www.ascionline.in/guidelines/";
const CCPA = "https://consumeraffairs.nic.in/";
const FSSAI = "https://www.fssai.gov.in/";
const LM = "https://consumeraffairs.nic.in/organisation-and-units/division/legal-metrology";
const MEITY = "https://www.meity.gov.in/";
const UNILEVER = "https://www.unilever.com/planet-and-society/responsible-business/responsible-marketing/";
const ASA = "https://www.asa.org.uk/codes-and-rulings/advertising-codes.html";
const EURLEX = "https://eur-lex.europa.eu/";
const FTC = "https://www.ftc.gov/business-guidance/resources/green-guides";

export const rules: Rule[] = [
  // ── 7.1 ASCI Code for Self-Regulation (14) ────────────────────────────────
  {
    id: "ASCI-I-1", regulator: "ASCI", clauseRef: "Ch. I, 1.1",
    title: "Claims must be capable of substantiation in the market of publication",
    test: "Every extracted objective claim must resolve to an ApprovedClaim whose markets[] includes the asset market. Wrong-market match → AMBER; no match → RED.",
    testType: "judgment", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-I-2", regulator: "ASCI", clauseRef: "Ch. I, 1.2",
    title: "No claim that misleads by ambiguity, exaggeration or omission",
    test: "Judgment check for implied benefit exceeding substantiated benefit.",
    testType: "judgment", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-I-3", regulator: "ASCI", clauseRef: "Ch. I, 1.3",
    title: "Testimonials must be genuine, current and relate to actual experience",
    test: "Any testimonial-type claim requires a testimonial_ref. A synthetic or AI-generated testimonial escalates to ASCI-AI-H.",
    testType: "judgment", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-I-4", regulator: "ASCI", clauseRef: "Ch. I, 1.4",
    title: "Scientific and statistical claims must not imply greater precision than the evidence supports",
    test: "Pattern match for manufactured precision: decimal multipliers, implausible absolute counts, benefit percentages above 100.",
    testType: "deterministic", severity: "major", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-I-5", regulator: "ASCI", clauseRef: "Ch. I, 1.5",
    title: "Disclaimers must not contradict the main claim and must be legible or audible",
    test: "A qualified claim requires resolving disclaimer text. Every asterisk must bind to a footnote; on-screen duration at least 4s.",
    testType: "deterministic", severity: "major", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-II-1", regulator: "ASCI", clauseRef: "Ch. II, 2.1",
    title: "No content offensive to public decency",
    test: "Judgment pass against per-market decency sensitivities.",
    testType: "judgment", severity: "major", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-II-2", regulator: "ASCI", clauseRef: "Ch. II, 2.2",
    title: "No derogatory depiction by gender, caste, religion, region or disability",
    test: "Judgment pass with a per-market sensitivity list.",
    testType: "judgment", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-III-1", regulator: "ASCI", clauseRef: "Ch. III, 3.1",
    title: "No depiction of unsafe practices, especially where children may imitate",
    test: "Judgment pass; auto-escalate if minors are detected in the asset.",
    testType: "judgment", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-IV-1", regulator: "ASCI", clauseRef: "Ch. IV, 4.1",
    title: "Comparative advertising must not disparage a competitor",
    test: "Named-competitor detection plus disparagement judgment. Sebamed precedent (Bombay HC, 16 Jun 2022) attached to every finding.",
    testType: "judgment", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-IV-2", regulator: "ASCI", clauseRef: "Ch. IV, 4.2",
    title: "Comparisons must be factual, verifiable and on like-for-like attributes",
    test: "A comparative claim requires a comparison_basis field and a dossier reference.",
    testType: "judgment", severity: "major", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-IV-3", regulator: "ASCI", clauseRef: "Ch. IV, 4.3",
    title: "No unwarranted implication of superiority",
    test: "Term list (no.1, #1, best, leading, top-rated) requires a superiority dossier valid in that market.",
    testType: "deterministic", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI,
  },
  {
    id: "ASCI-INF-1", regulator: "ASCI", clauseRef: "Influencer Guidelines, 2.1",
    title: "Material connection must be disclosed upfront and prominently",
    test: "A disclosure token must be present and positioned within the first two lines or first three seconds, and not hidden behind a 'more' fold.",
    testType: "deterministic", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2023-06-01", sourceUrl: ASCI_GUIDELINES,
  },
  {
    id: "ASCI-INF-2", regulator: "ASCI", clauseRef: "Influencer Guidelines, 3.1",
    title: "Influencers must not promote categories disallowed by law",
    test: "SKU category checked against the prohibited-category list for that market.",
    testType: "deterministic", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2023-06-01", sourceUrl: ASCI_GUIDELINES,
  },
  {
    id: "ASCI-INF-4", regulator: "ASCI", clauseRef: "Influencer Guidelines, 4.2",
    title: "Virtual and AI influencers require dual disclosure",
    test: "If entity_type is virtual_influencer, both a paid-partnership token and a synthetic-content token are required.",
    testType: "deterministic", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-01-01", sourceUrl: ASCI_GUIDELINES,
  },

  // ── 7.2 ASCI draft AI-labelling guidelines (3) — DRAFT, not in force ───────
  {
    id: "ASCI-AI-H", regulator: "ASCI", clauseRef: "AI Labelling (draft), Tier 1",
    title: "High-risk AI content is prohibited — a label does not cure it",
    test: "Triggers on fabricated endorsement, unauthorised likeness, visual exaggeration of results, or AI-generated authority figures. No fix path is offered — regenerate.",
    testType: "judgment", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-05-12", sourceUrl: ASCI_GUIDELINES, draft: true,
  },
  {
    id: "ASCI-AI-M", regulator: "ASCI", clauseRef: "AI Labelling (draft), Tier 2",
    title: "Medium-risk AI content requires a prominent label",
    test: "Triggers on virtual influencers, replicated likeness even with consent, synthetic product demonstrations and AI-created realistic events. The label must persist for the full duration of the asset.",
    testType: "deterministic", severity: "major", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-05-12", sourceUrl: ASCI_GUIDELINES, draft: true,
  },
  {
    id: "ASCI-AI-L", regulator: "ASCI", clauseRef: "AI Labelling (draft), Tier 3",
    title: "Low-risk AI content requires no label",
    test: "Pass-through classification: colour correction, blemish removal, decorative background, ambient music, AI-assisted copy.",
    testType: "deterministic", severity: "minor", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-05-12", sourceUrl: ASCI_GUIDELINES, draft: true,
  },

  // ── 7.3 CCPA (9) ──────────────────────────────────────────────────────────
  {
    id: "CCPA-MA-4", regulator: "CCPA", clauseRef: "Misleading Ads Guidelines 2022, s.4",
    title: "Objective claims require prior adequate substantiation",
    test: "Mirrors ASCI-I-1 with penalty metadata attached: up to ₹10L, ₹50L on repeat, endorser ban of one to three years.",
    testType: "judgment", severity: "critical", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2022-06-09", sourceUrl: CCPA,
  },
  {
    id: "CCPA-MA-5", regulator: "CCPA", clauseRef: "Misleading Ads Guidelines 2022, s.5",
    title: "Bait advertising prohibited",
    test: "Offer claims require an inventory attestation flag.",
    testType: "judgment", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2022-06-09", sourceUrl: CCPA,
  },
  {
    id: "CCPA-MA-6", regulator: "CCPA", clauseRef: "Misleading Ads Guidelines 2022, s.6",
    title: "'Free' claims must be genuinely free of cost",
    test: "Term list (free, complimentary, no cost) requires a free_basis field.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2022-06-09", sourceUrl: CCPA,
  },
  {
    id: "CCPA-MA-7", regulator: "CCPA", clauseRef: "Misleading Ads Guidelines 2022, s.7",
    title: "Surrogate advertising prohibited",
    test: "Category and brand-extension check against the prohibited-category list.",
    testType: "judgment", severity: "critical", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2022-06-09", sourceUrl: CCPA,
  },
  {
    id: "CCPA-MA-8", regulator: "CCPA", clauseRef: "Misleading Ads Guidelines 2022, s.8",
    title: "Advertisements targeting children must not exaggerate or induce unrealistic expectations",
    test: "If the audience or depiction includes minors, apply the stricter child rule set. Cross-references Unilever Responsible Marketing to Children.",
    testType: "judgment", severity: "critical", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2022-06-09", sourceUrl: CCPA,
  },
  {
    id: "CCPA-MA-12", regulator: "CCPA", clauseRef: "Misleading Ads Guidelines 2022, s.12",
    title: "Due-diligence duty falls on manufacturer, advertiser, agency and endorser",
    test: "Metadata rule: every cleared asset must record a responsible party.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2022-06-09", sourceUrl: CCPA,
  },
  {
    id: "CCPA-100", regulator: "CCPA", clauseRef: "Ruling, 18 Jun 2026",
    title: "Any '100%' claim must be literally and completely verifiable",
    test: "A 100% pattern in a claim context requires an ApprovedClaim of evidence grade lab or clinical for that market. Default verdict: RED.",
    testType: "deterministic", severity: "critical", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-06-18", sourceUrl: CCPA,
  },
  {
    id: "CCPA-DP-7", regulator: "CCPA", clauseRef: "Dark Patterns 2023, Sch. 1(7)",
    title: "False urgency and countdown pressure prohibited",
    test: "Pattern family: 'only N left', 'hurry', 'ends in', 'last chance', countdown components.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2023-11-30", sourceUrl: CCPA,
  },
  {
    id: "CCPA-GW-3", regulator: "CCPA", clauseRef: "Greenwashing Guidelines 2024, s.3",
    title: "Environmental claims must be specific, substantiated and free of vague absolutes",
    test: "Term list (eco-friendly, green, sustainable, natural, carbon neutral, planet positive) requires an ApprovedClaim with environmental evidence for that market.",
    testType: "deterministic", severity: "critical", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-10-15", sourceUrl: CCPA,
  },

  // ── 7.4 FSSAI (5) ─────────────────────────────────────────────────────────
  {
    id: "FSSAI-AC-4", regulator: "FSSAI", clauseRef: "Advertising & Claims Regs 2018, Reg. 4",
    title: "Food claims must be truthful, unambiguous and not misleading",
    test: "Judgment pass on all food-category assets.",
    testType: "judgment", severity: "critical", jurisdictions: ["IN"], categories: ["foods", "beverages", "nutrition"],
    version: RULE_SET_VERSION, effectiveFrom: "2018-11-01", sourceUrl: FSSAI,
  },
  {
    id: "FSSAI-AC-5", regulator: "FSSAI", clauseRef: "Advertising & Claims Regs 2018, Reg. 5",
    title: "Nutrition claims must meet prescribed thresholds",
    test: "Term list (low fat, high protein, source of) mapped to the threshold table; requires a nutrition dossier per SKU.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: ["foods", "beverages", "nutrition"],
    version: RULE_SET_VERSION, effectiveFrom: "2018-11-01", sourceUrl: FSSAI,
  },
  {
    id: "FSSAI-AC-6", regulator: "FSSAI", clauseRef: "Advertising & Claims Regs 2018, Reg. 6",
    title: "Health claims must meet prescribed conditions — no 'health drink' category exists under the FSS Act 2006",
    test: "Term list (health drink, health food drink) returns RED with no fix available. Precedent attached: the category was renamed to Functional Nutrition Drinks, Apr 2024.",
    testType: "deterministic", severity: "critical", jurisdictions: ["IN"], categories: ["foods", "beverages", "nutrition"],
    version: RULE_SET_VERSION, effectiveFrom: "2018-11-01", sourceUrl: FSSAI,
  },
  {
    id: "FSSAI-AC-9", regulator: "FSSAI", clauseRef: "Advertising & Claims Regs 2018, Reg. 9",
    title: "Prohibited claims — no claim of disease prevention, treatment or cure",
    test: "Cross-references DMR-3. Term family: prevents, cures, treats, heals, plus a condition noun.",
    testType: "deterministic", severity: "critical", jurisdictions: ["IN"], categories: ["foods", "beverages", "nutrition"],
    version: RULE_SET_VERSION, effectiveFrom: "2018-11-01", sourceUrl: FSSAI,
  },
  {
    id: "FSSAI-ORS", regulator: "FSSAI", clauseRef: "Advisory, Oct 2025",
    title: "Trademark use of restricted nutritional designations may be rescinded retroactively",
    test: "Watch rule. Flags any claim whose permission derives from a rescindable memo. Precedent: FSSAI rescinded its own 2022 and 2024 ORS memos with immediate effect.",
    testType: "judgment", severity: "major", jurisdictions: ["IN"], categories: ["foods", "beverages", "nutrition"],
    version: RULE_SET_VERSION, effectiveFrom: "2025-10-01", sourceUrl: FSSAI,
  },

  // ── 7.5 Legal Metrology (3) ───────────────────────────────────────────────
  {
    id: "LM-PC-6", regulator: "Legal Metrology", clauseRef: "Packaged Commodities Rules, Rule 6",
    title: "Mandatory declarations — net quantity, MRP inclusive of taxes, consumer-care details, country of origin",
    test: "Presence check across pack-shot OCR and listing copy.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2011-04-01", sourceUrl: LM,
  },
  {
    id: "LM-PC-9", regulator: "Legal Metrology", clauseRef: "Packaged Commodities Rules, Rule 9",
    title: "Declarations must meet prescribed size and prominence",
    test: "Bounding-box height threshold relative to the principal display panel.",
    testType: "deterministic", severity: "minor", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2011-04-01", sourceUrl: LM,
  },
  {
    id: "LM-PC-18", regulator: "Legal Metrology", clauseRef: "Packaged Commodities Rules, Rule 18",
    title: "E-commerce listings must carry the same mandatory declarations as the pack",
    test: "Applies LM-PC-6 to marketplace listings.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2017-01-01", sourceUrl: LM,
  },

  // ── 7.6 Drugs, Cosmetics & Magic Remedies (2) ─────────────────────────────
  {
    id: "DMR-3", regulator: "Drugs & Magic Remedies Act 1954", clauseRef: "s.3",
    title: "No advertisement suggesting treatment or cure of scheduled conditions",
    test: "Scheduled-condition term list crossed with a treatment-verb list. Critical for personal-care adjacency: 'cures dandruff', 'treats acne'.",
    testType: "deterministic", severity: "critical", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "1954-04-30", sourceUrl: CCPA,
  },
  {
    id: "DC-COS-1", regulator: "Drugs & Cosmetics Rules", clauseRef: "Cosmetics",
    title: "Cosmetic claims must not cross into therapeutic territory",
    test: "Cosmetic/therapeutic boundary judgment: 'reduces the appearance of' is cosmetic; 'repairs' and 'heals' are therapeutic.",
    testType: "judgment", severity: "critical", jurisdictions: ["IN"], categories: ["personal care", "beauty"],
    version: RULE_SET_VERSION, effectiveFrom: "1945-01-01", sourceUrl: CCPA,
  },

  // ── 7.7 MeitY IT Amendment Rules 2026 (2) ─────────────────────────────────
  {
    id: "MEITY-SM-1", regulator: "MeitY", clauseRef: "IT Amd. Rules 2026",
    title: "Synthetically generated information must be prominently labelled",
    test: "If the asset is AI-generated and tier is medium or above, a visible label is required. Asserts prominence, not a fixed surface-area percentage — the draft's 10% requirement was dropped in the final rules.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-02-20", sourceUrl: MEITY,
  },
  {
    id: "MEITY-TD-1", regulator: "MeitY", clauseRef: "IT Amd. Rules 2026",
    title: "Takedown windows — 3 hours for court or government orders, 2 hours for impersonation or intimate content",
    test: "Operational SLA rule. Drives WATCH alert priority, not asset clearance.",
    testType: "deterministic", severity: "major", jurisdictions: ["IN"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-02-20", sourceUrl: MEITY,
  },

  // ── 7.8 Internal — Unilever policy & brand codex (4) ──────────────────────
  {
    id: "UL-AMP-1", regulator: "Unilever (internal)", clauseRef: "Advertising & Marketing Principles",
    title: "Advertising must be legal, decent, honest and truthful across all markets",
    test: "Umbrella judgment pass at internal-policy severity.",
    testType: "judgment", severity: "major", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2023-01-01", sourceUrl: UNILEVER,
  },
  {
    id: "UL-RMC-1", regulator: "Unilever (internal)", clauseRef: "Responsible Marketing to Children",
    title: "No marketing of restricted categories to children; stricter depiction rules apply",
    test: "Minor detection applies the child rule set.",
    testType: "deterministic", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2023-01-01", sourceUrl: UNILEVER,
  },
  {
    id: "BRAND-DOVE-1", regulator: "Unilever (internal)", clauseRef: "Dove Real Beauty Pledge, 9 Apr 2024",
    title: "Dove will never use AI to represent real women in its advertising",
    test: "If brand is Dove and the asset contains an AI-generated human likeness: RED, no fix path. bindingLevel is PLEDGE — a pledge hard-blocks, it does not advise.",
    testType: "deterministic", severity: "critical", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2024-04-09", sourceUrl: UNILEVER,
  },
  {
    id: "BRAND-CODEX-1", regulator: "Unilever (internal)", clauseRef: "Brand DNAi",
    title: "Tone, visual identity and claim register must match the approved brand data pool",
    test: "Retrieval over Brand DNAi with a citation back to the guideline section.",
    testType: "judgment", severity: "minor", jurisdictions: "all", categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2025-01-01", sourceUrl: UNILEVER,
  },

  // ── 7.9 International packs (5) — stubs in the prototype ──────────────────
  {
    id: "ASA-CAP-3.7", regulator: "ASA/CAP (UK)", clauseRef: "CAP Code 3.7",
    title: "Claims must be supported by documentary evidence held on file",
    test: "Objective claims must resolve to a dossier registered for the UK market.",
    testType: "judgment", severity: "critical", jurisdictions: ["UK"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2010-09-01", sourceUrl: ASA,
  },
  {
    id: "ASA-CAP-3.33", regulator: "ASA/CAP (UK)", clauseRef: "CAP Code 3.33",
    title: "Comparative claims must be verifiable",
    test: "A comparative claim requires a published verification route.",
    testType: "judgment", severity: "major", jurisdictions: ["UK"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2010-09-01", sourceUrl: ASA,
  },
  {
    id: "EU-EMPCO-1", regulator: "EU", clauseRef: "Empowering Consumers Directive",
    title: "Generic environmental claims prohibited without recognised proof",
    test: "Environmental term list requires recognised certification for the EU market.",
    testType: "deterministic", severity: "critical", jurisdictions: ["DE"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-09-27", sourceUrl: EURLEX, draft: true,
  },
  {
    id: "EU-AIA-50", regulator: "EU", clauseRef: "AI Act, Art. 50",
    title: "Deployer disclosure duty for synthetic media",
    test: "AI-generated assets published in the EU require deployer disclosure. ⚠️ Application date unconfirmed — verify before asserting.",
    testType: "deterministic", severity: "major", jurisdictions: ["DE"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2026-08-02", sourceUrl: EURLEX, draft: true,
  },
  {
    id: "FTC-GG-1", regulator: "FTC (US)", clauseRef: "Green Guides",
    title: "Environmental marketing claims must be specific and substantiated",
    test: "Environmental term list requires substantiation held on file for the US market.",
    testType: "deterministic", severity: "major", jurisdictions: ["US"], categories: "all",
    version: RULE_SET_VERSION, effectiveFrom: "2012-10-01", sourceUrl: FTC,
  },
];

export const ruleById = new Map(rules.map((r) => [r.id, r]));

/** Every verdict is meaningful only relative to the rule version that produced it (§6 C2). */
export function ruleSetHash(rs: Rule[] = rules): string {
  const basis = rs.map((r) => `${r.id}@${r.version}`).join("|");
  let h = 0;
  for (let i = 0; i < basis.length; i++) h = (Math.imul(31, h) + basis.charCodeAt(i)) | 0;
  return `sha-${(h >>> 0).toString(16).padStart(8, "0")}`;
}
