import type { ConstraintPack, Market } from "@/lib/types";
import { rules, RULE_SET_VERSION } from "@/data/rules";
import { claims, brandCodex } from "@/data/claims";
import * as d from "./deterministic";

// Ring 0 — constrain at generation. PRD §5.1 and Flow 2 (§9.5).
//
// Everyone else checks after. This constrains during: the permitted claim set and the
// prohibited patterns are injected into the generation prompt, so non-compliant
// variants are never generated and the cost of the fix is roughly zero.
//
// Thin, fast and cacheable — a constraint pack changes only when rules or dossiers
// change, so it caches on (brand, sku, market, ruleVersion).

export function buildConstraintPack(
  brand: string, sku: string, market: Market, channel: string,
): ConstraintPack {
  const permitted = claims
    .filter((c) => c.status !== "retired" && c.productSku === sku &&
      (c.markets === "all" || (c.markets as Market[]).includes(market)))
    .map((c) => c.canonicalText);

  const applicable = rules.filter(
    (r) => r.jurisdictions === "all" || (r.jurisdictions as Market[]).includes(market),
  );

  // Retired wording is a prohibition, not an omission: the register exists so a
  // rotating brand manager cannot re-propose a claim the company already abandoned.
  const retired = claims.filter((c) => c.status === "retired").map((c) => c.canonicalText);

  const hardConstraints = brandCodex
    .filter((c) => c.brand === brand && c.bindingLevel === "pledge")
    .map((c) => ({ source: c.source, text: c.ruleText, bindingLevel: c.bindingLevel }));

  const requiredDisclosures: string[] = [
    "If the asset is synthetically generated and reads as medium risk, carry a prominent AI-generated label for the full duration.",
    "If published by a creator, disclose the material connection within the first two lines or first three seconds.",
  ];

  return {
    brand, sku, market, channel,
    ruleSetVersion: RULE_SET_VERSION,
    permittedClaims: permitted,
    prohibitedTerms: [
      ...d.SUPERIORITY_TERMS,
      ...d.ENVIRONMENTAL_TERMS,
      ...d.HEALTH_DRINK_TERMS,
      ...retired,
    ],
    prohibitedPatterns: [
      "any absolute 100% claim without a lab or clinical dossier",
      "decimal multipliers or implausible absolute counts (manufactured precision)",
      "false urgency: countdowns, 'only N left', 'hurry', 'last chance'",
      "therapeutic verbs against a condition: cures, treats, heals, prevents",
      "any objective claim not present in permittedClaims above",
    ],
    hardConstraints,
    requiredDisclosures: hardConstraints.length
      ? [...requiredDisclosures, `Brand pledge in force — ${hardConstraints[0].source}. This hard-blocks; it does not advise.`]
      : requiredDisclosures,
  };
}

/** The constraint pack rendered as the text a generation agent receives. */
export function packAsPrompt(p: ConstraintPack): string {
  return [
    `# Generation constraints — ${p.brand} ${p.sku} · market ${p.market} · ${p.channel}`,
    `# Rule set ${p.ruleSetVersion}. Injected by PRAMAAN before generation.`,
    ``,
    `PERMITTED CLAIMS — you may use these and no other objective claim:`,
    ...p.permittedClaims.map((c) => `  - "${c}"`),
    ``,
    `PROHIBITED TERMS:`,
    `  ${p.prohibitedTerms.slice(0, 12).join(", ")}${p.prohibitedTerms.length > 12 ? `, +${p.prohibitedTerms.length - 12} more` : ""}`,
    ``,
    `PROHIBITED PATTERNS:`,
    ...p.prohibitedPatterns.map((c) => `  - ${c}`),
    ``,
    ...(p.hardConstraints.length
      ? [`HARD CONSTRAINTS (bindingLevel: PLEDGE — non-negotiable):`,
         ...p.hardConstraints.map((c) => `  - ${c.text} [${c.source}]`), ``]
      : []),
    `REQUIRED DISCLOSURES:`,
    ...p.requiredDisclosures.map((c) => `  - ${c}`),
  ].join("\n");
}
