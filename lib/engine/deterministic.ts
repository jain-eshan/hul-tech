// Deterministic test library — PRD §7.10.
//
// Pure code. No LLM, ever. Mechanical checks routed through a model would be
// slower, costlier and non-reproducible (PRD §5.2). This split is not an
// implementation detail: it is why deterministic findings render in <400ms while
// judgment findings stream in over seconds, which is what makes the architecture
// visible in the demo.

export interface Span {
  text: string;
  start: number;
  end: number;
}

export interface TestResult {
  matched: boolean;
  spans: Span[];
  detail?: string;
}

const none: TestResult = { matched: false, spans: [] };

function spansFor(text: string, re: RegExp): Span[] {
  const out: Span[] = [];
  const rx = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = rx.exec(text)) !== null) {
    out.push({ text: m[0], start: m.index, end: m.index + m[0].length });
    if (m[0].length === 0) rx.lastIndex++;
  }
  return out;
}

function result(spans: Span[], detail?: string): TestResult {
  return spans.length ? { matched: true, spans, detail } : none;
}

/** Escapes a term for safe use inside a word-boundary alternation. */
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── Term-list tests ─────────────────────────────────────────────────────────

/** ASCI-IV-3, CCPA-GW-3, FSSAI-AC-6, DMR-3 */
export function prohibitedTerms(text: string, list: string[]): TestResult {
  if (!list.length) return none;
  const re = new RegExp(`(?<![\\w])(${list.map(esc).join("|")})(?![\\w])`, "gi");
  return result(spansFor(text, re));
}

export const SUPERIORITY_TERMS = ["no.1", "no 1", "#1", "number one", "best", "leading", "top-rated", "no.1 recommended"];
export const ENVIRONMENTAL_TERMS = ["eco-friendly", "eco friendly", "green", "sustainable", "natural", "carbon neutral", "planet positive", "biodegradable"];
export const FREE_TERMS = ["free", "complimentary", "no cost"];
export const HEALTH_DRINK_TERMS = ["health drink", "health food drink"];
export const NUTRITION_THRESHOLD_TERMS = ["low fat", "high protein", "source of", "sugar free", "low calorie"];

/** ASCI-IV-3 — superiority requires a dossier valid in that market. */
export function superiorityClaim(text: string): TestResult {
  return prohibitedTerms(text, SUPERIORITY_TERMS);
}

/** CCPA-100 — any "100%" claim must be literally and completely verifiable. */
export function absoluteQuantifier(text: string): TestResult {
  return result(spansFor(text, /\b100\s*%/i));
}

/**
 * ASCI-I-4 — manufactured scientific precision.
 * Decimal multipliers, implausible absolute counts, benefit percentages above 100.
 */
export function manufacturedPrecision(text: string): TestResult {
  const spans = [
    ...spansFor(text, /\b\d+\.\d+\s*x\b/i),
    // Allow thousands separators: "23,800 strands" is the exact pattern ASCI named.
    ...spansFor(text, /\b\d{1,3}(,\d{3})+\s*(strands|hairs|cells|follicles)\b/i),
    ...spansFor(text, /\b\d{4,}\s*(strands|hairs|cells|follicles)\b/i),
    ...spansFor(text, /\b(?!100\s*%)\d{3,}\s*%/),
  ].sort((a, b) => a.start - b.start);
  return result(spans);
}

/** CCPA-DP-7 — false urgency and countdown pressure. */
export function falseUrgency(text: string): TestResult {
  return result(spansFor(text, /only \d+ (left|remaining)|hurry|ends in \d|last chance|limited stock|selling fast/gi));
}

/** DMR-3 / FSSAI-AC-9 / DC-COS-1 — therapeutic verbs against a condition noun. */
const THERAPEUTIC_VERBS = ["cures", "cure", "treats", "treat", "heals", "heal", "prevents", "prevent", "repairs"];
const CONDITION_NOUNS = ["dandruff", "acne", "eczema", "psoriasis", "hair loss", "hair fall", "infection", "disease", "diabetes", "arthritis", "cancer"];

export function therapeuticVerb(text: string): TestResult {
  const re = new RegExp(
    `(?<![\\w])(${THERAPEUTIC_VERBS.map(esc).join("|")})(?![\\w])[^.!?]{0,40}?(?<![\\w])(${CONDITION_NOUNS.map(esc).join("|")})(?![\\w])`,
    "gi",
  );
  return result(spansFor(text, re));
}

// ── Disclosure tests ────────────────────────────────────────────────────────

export const DISCLOSURE_TOKENS = ["#ad", "#sponsored", "#collab", "#partnership", "#paidpartnership", "paid partnership"];
export const SYNTHETIC_TOKENS = ["#ai", "#aigenerated", "ai-generated", "ai generated", "synthetic", "#virtualinfluencer"];

/**
 * ASCI-INF-1 — material connection disclosed upfront and prominently.
 * Presence alone is not compliance: position and prominence are the test.
 */
export function disclosurePresent(text: string, foldIndex = 125): TestResult {
  const lower = text.toLowerCase();
  const hit = DISCLOSURE_TOKENS.map((t) => ({ t, i: lower.indexOf(t) })).filter((x) => x.i >= 0).sort((a, b) => a.i - b.i)[0];
  if (!hit) return { matched: true, spans: [], detail: "No disclosure token found" };
  if (hit.i > foldIndex) {
    return {
      matched: true,
      spans: [{ text: hit.t, start: hit.i, end: hit.i + hit.t.length }],
      detail: `Disclosure "${hit.t}" appears at character ${hit.i}, past the ${foldIndex}-character fold`,
    };
  }
  return none;
}

/** ASCI-INF-4 — virtual and AI influencers require BOTH tokens. */
export function dualDisclosure(text: string, entityType: string): TestResult {
  if (entityType !== "virtual_influencer") return none;
  const lower = text.toLowerCase();
  const paid = DISCLOSURE_TOKENS.some((t) => lower.includes(t));
  const synth = SYNTHETIC_TOKENS.some((t) => lower.includes(t));
  if (paid && synth) return none;
  const missing = [!paid && "paid-partnership", !synth && "synthetic-content"].filter(Boolean).join(" and ");
  return { matched: true, spans: [], detail: `Missing ${missing} disclosure` };
}

/**
 * ASCI-AI-M — the label must persist for the FULL duration, not the first 3s.
 * This is the rule the replay demo tightens.
 */
export function labelDuration(labelSeconds: number | undefined, assetDuration: number | undefined, requireFullDuration: boolean): TestResult {
  if (assetDuration === undefined) return none;
  const label = labelSeconds ?? 0;
  if (label === 0) return { matched: true, spans: [], detail: "No on-screen label present" };
  if (requireFullDuration && label < assetDuration) {
    return { matched: true, spans: [], detail: `Label present for ${label}s of ${assetDuration}s` };
  }
  if (!requireFullDuration && label < 3) {
    return { matched: true, spans: [], detail: `Label present for ${label}s, minimum 3s` };
  }
  return none;
}

// ── Pack and listing tests ──────────────────────────────────────────────────

const DECLARATIONS = [
  { key: "net quantity", re: /\b\d+(\.\d+)?\s?(g|kg|ml|l|gm|gms)\b/i },
  { key: "MRP", re: /\bmrp\b|₹\s?\d/i },
  { key: "consumer care details", re: /consumer care|customer care|helpline|grievance/i },
  { key: "country of origin", re: /country of origin|made in|manufactured in/i },
];

/** LM-PC-6 / LM-PC-18 — mandatory declarations. */
export function mandatoryDeclarations(text: string): TestResult {
  const missing = DECLARATIONS.filter((d) => !d.re.test(text)).map((d) => d.key);
  if (!missing.length) return none;
  return { matched: true, spans: [], detail: `Missing: ${missing.join(", ")}` };
}

/** LM-PC-6 — net quantity must be a recognised unit format. */
export function netQuantityFormat(text: string): TestResult {
  if (!/\b\d+(\.\d+)?\s?(g|kg|ml|l)\b/i.test(text) && /\b\d+(\.\d+)?\s?(grams?|litres?|liters?)\b/i.test(text)) {
    return { matched: true, spans: spansFor(text, /\b\d+(\.\d+)?\s?(grams?|litres?|liters?)\b/i), detail: "Unit spelled out; prescribed abbreviation required" };
  }
  return none;
}

/** ASCI-I-5 — every asterisk must bind to a resolving footnote. */
export function asteriskBinding(text: string): TestResult {
  const marks = spansFor(text, /\*/);
  if (marks.length === 0) return none;
  // A binding footnote is an asterisk that begins a line or trails a sentence with text after it.
  const footnotes = spansFor(text, /(^|\n)\s*\*\s*\S+/);
  if (footnotes.length >= 1) return none;
  return { matched: true, spans: marks, detail: "Asterisk present with no resolving footnote" };
}

/** A5 — absence of a valid signed manifest is itself an alert. */
export function c2paManifestValid(present: boolean): TestResult {
  return present ? none : { matched: true, spans: [], detail: "No valid C2PA manifest on the asset" };
}
