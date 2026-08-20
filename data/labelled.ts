import type { Market } from "@/lib/types";

// Hand-labelled evaluation set — PRD §6 C6, §10.2.
//
// ⚠️ PROVENANCE, STATED PLAINLY: these labels were authored during the build from the
// rule pack as specified in PRD §7. They are NOT adjudicated by regulatory counsel and
// they are NOT a production ground truth. A real accuracy card would be labelled by
// the people who own the rules. The number this produces is honest about the engine
// and dishonest about nothing — but it measures agreement with an author's reading of
// the rules, not with a regulator's.
//
// Labels were written from the rules, not from the engine's output. Tuning labels to
// match the implementation would make the measurement circular and worthless, so where
// the engine disagrees with a label the card reports the failure rather than hiding it.

export interface LabelledCase {
  id: string;
  copy: string;
  market: Market;
  sku?: string;
  brand?: string;
  /** Rule ids a correct engine must fire. Empty means the copy is clean. */
  expected: string[];
  note: string;
}

export const labelled: LabelledCase[] = [
  // ── Clean copy: must return GREEN without inventing findings ──────────────
  { id: "L-01", copy: "72h freshness. It won't ever let you down.", market: "IN", sku: "REX-AP-150",
    expected: [], note: "Both claims in the India ledger" },
  { id: "L-02", copy: "Dermatologist tested.", market: "IN", sku: "DOV-BAR-100",
    expected: [], note: "Substantiated, clinical grade" },
  { id: "L-03", copy: "1/4 moisturising cream.", market: "IN", sku: "DOV-BAR-100",
    expected: [], note: "Global dossier" },
  { id: "L-04", copy: "SPF 50 PA+++", market: "IN", sku: "LAK-SUN-50",
    expected: [], note: "Lab dossier, India" },
  { id: "L-05", copy: "Removes tough stains in 1 wash.", market: "IN", sku: "SUR-DET-1KG",
    expected: [], note: "Lab dossier, India" },
  { id: "L-06", copy: "Sweat-activated technology.", market: "BR", sku: "REX-AP-150",
    expected: [], note: "Registered for Brazil" },
  { id: "L-07", copy: "Fights 10 signs of ageing.", market: "IN", sku: "PON-CRM-50",
    expected: [], note: "Clinical dossier, India" },
  { id: "L-08", copy: "No added preservatives.", market: "IN", sku: "KIS-JAM-500",
    expected: [], note: "Lab dossier, India" },

  // ── Wrong market: registered claim, unregistered market → ASCI-I-1 ────────
  { id: "L-09", copy: "Clinically proven 72h protection.", market: "UK", sku: "REX-AP-150",
    expected: ["ASCI-I-1"], note: "EU dossier not registered for UK" },
  { id: "L-10", copy: "Clinically proven 72h protection.", market: "DE", sku: "REX-AP-150",
    expected: ["ASCI-I-1"], note: "EU dossier not registered for DE" },
  { id: "L-11", copy: "Fights 10 signs of ageing.", market: "ZA", sku: "PON-CRM-50",
    expected: ["ASCI-I-1"], note: "India-only dossier" },
  { id: "L-12", copy: "Up to 10x stronger hair.", market: "DE", sku: "TRE-SH-340",
    expected: ["ASCI-I-1"], note: "Not registered for Germany" },

  // ── Absolute quantifiers → CCPA-100 ──────────────────────────────────────
  { id: "L-13", copy: "100% natural ingredients in every bottle.", market: "IN",
    expected: ["CCPA-100", "CCPA-GW-3", "ASCI-I-1"], note: "Absolute + vague environmental + retired wording" },
  { id: "L-14", copy: "100% effective against odour.", market: "IN", sku: "REX-AP-150",
    expected: ["CCPA-100", "ASCI-I-1"], note: "Absolute with no lab dossier" },

  // ── Environmental absolutes → CCPA-GW-3 ──────────────────────────────────
  { id: "L-15", copy: "Our eco-friendly formula protects the planet.", market: "IN",
    expected: ["CCPA-GW-3", "ASCI-I-1"], note: "Vague environmental absolute" },
  { id: "L-16", copy: "A sustainable choice for your family.", market: "IN",
    expected: ["CCPA-GW-3", "ASCI-I-1"], note: "Unsubstantiated environmental claim" },

  // ── Superiority → ASCI-IV-3 ──────────────────────────────────────────────
  { id: "L-17", copy: "India's No.1 anti-dandruff shampoo.", market: "IN", sku: "SUN-SH-340",
    expected: ["ASCI-IV-3", "ASCI-I-1"], note: "Superiority without a market dossier" },
  { id: "L-18", copy: "The best shampoo for damaged hair.", market: "IN", sku: "TRE-SH-340",
    expected: ["ASCI-IV-3", "ASCI-I-1"], note: "Superiority term" },
  { id: "L-19", copy: "Our leading formula, trusted by millions.", market: "IN",
    expected: ["ASCI-IV-3", "ASCI-I-1"], note: "'leading' implies superiority" },

  // ── Therapeutic crossover → DMR-3 ────────────────────────────────────────
  { id: "L-20", copy: "Cures dandruff in one wash.", market: "IN", sku: "SUN-SH-340",
    expected: ["DMR-3", "ASCI-I-1"], note: "Cosmetic claiming a cure" },
  { id: "L-21", copy: "Treats acne and prevents infection.", market: "IN",
    expected: ["DMR-3", "ASCI-I-1"], note: "Two therapeutic verbs against conditions" },
  { id: "L-22", copy: "Heals eczema from the first application.", market: "IN",
    expected: ["DMR-3", "ASCI-I-1"], note: "Therapeutic claim on a cosmetic" },

  // ── Dark patterns → CCPA-DP-7 ────────────────────────────────────────────
  { id: "L-23", copy: "72h freshness. Hurry, only 3 left!", market: "IN", sku: "REX-AP-150",
    expected: ["CCPA-DP-7"], note: "False urgency on otherwise clean copy" },
  // LABEL CORRECTED during the build. Originally labelled ["CCPA-DP-7", "ASCI-I-1"].
  // The ASCI-I-1 expectation was wrong: a pure offer statement is governed by the
  // offer and dark-pattern rules, not by a product substantiation dossier. Recorded
  // here rather than quietly edited, because correcting labels to match an engine is
  // how an accuracy card becomes worthless.
  { id: "L-24", copy: "Last chance — this offer ends in 2 hours.", market: "IN",
    expected: ["CCPA-DP-7"], note: "Countdown pressure; offer phrase needs no dossier" },

  // ── Manufactured precision → ASCI-I-4 ────────────────────────────────────
  { id: "L-25", copy: "Reduces hair fall by 11.7x versus ordinary shampoo.", market: "IN",
    expected: ["ASCI-I-4", "ASCI-I-1"], note: "Decimal multiplier, named in ASCI FY25-26 patterns" },
  { id: "L-26", copy: "Regrows 23,800 strands in 30 days.", market: "IN",
    expected: ["ASCI-I-4", "ASCI-I-1"], note: "Implausible absolute count" },

  // ── Food and category rules ──────────────────────────────────────────────
  { id: "L-27", copy: "The health drink that helps children grow taller.", market: "IN", sku: "HOR-500",
    expected: ["FSSAI-AC-6", "ASCI-I-1"], note: "No 'health drink' category under the FSS Act 2006" },
  { id: "L-28", copy: "Fortified with 2 vital nutrients.", market: "IN", sku: "HOR-500",
    expected: [], note: "Registered nutrition claim, India" },

  // ── Retired register ─────────────────────────────────────────────────────
  { id: "L-29", copy: "Fairness guaranteed with every wash.", market: "IN",
    expected: ["ASCI-I-1"], note: "Retired claim — Fair & Lovely renamed Jul 2020" },
  { id: "L-30", copy: "Doctor recommended No.1 for sensitive skin.", market: "IN", sku: "DOV-BAR-100",
    expected: ["ASCI-IV-3", "ASCI-I-1"], note: "Retired superiority wording" },
];
