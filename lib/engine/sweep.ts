import type { Finding, VerdictStatus } from "@/lib/types";
import type { CreatorPost } from "@/data/creatorPosts";
import { ruleById } from "@/data/rules";
import { evaluateText } from "./index";
import * as d from "./deterministic";

// B2 · Creator sweep — PRD §11.9, §6 B2.
//
// The largest uncovered surface: ASCI processed 1,609 influencer ads in FY25-26 and
// 97.3% required modification. This is content the brand never wrote, never saw, and
// is liable for.
//
// Disclosure is not a presence check. A token that appears after the fold has not
// disclosed anything, which is why position is part of the test.

/**
 * A creator caption is conversational, first-person and full of personal narrative.
 * Resolving every sentence of it against the claims ledger treats "soft skin szn" as
 * an unsubstantiated product claim, and that is precisely the failure affil.ai warns
 * about: software that creates more violations than the content it monitors saves
 * nobody any time. The NFR is a false-positive rate under 10% (§14.1).
 *
 * So only spans carrying an objective claim signal are resolved against the ledger.
 * Deterministic rules — absolutes, urgency, therapeutic verbs, superiority — still run
 * across the whole caption, because those are wrong wherever they appear.
 */
function isObjectiveClaim(text: string): boolean {
  const t = text.toLowerCase();
  if (/\d+\s*(%|h\b|hr|hour|x\b|ml\b|g\b|mg|spf|days?|weeks?)/.test(t)) return true;
  if (/\b(proven|clinically|dermatolog|tested|removes|kills|reduces|prevents|cures|treats|repairs|fortified|contains|made with|free from|no added)\b/.test(t)) return true;
  if (d.SUPERIORITY_TERMS.some((x) => t.includes(x))) return true;
  if (d.ENVIRONMENTAL_TERMS.some((x) => t.includes(x))) return true;
  return false;
}

export interface SweepResult {
  post: CreatorPost;
  status: VerdictStatus;
  findings: Finding[];
  disclosureOk: boolean;
  claimsOk: boolean;
}

function finding(ruleId: string, quotedText: string, explanation: string, suggestedFix?: string): Finding {
  const rule = ruleById.get(ruleId);
  if (!rule) throw new Error(`Uncitable finding: no rule "${ruleId}"`);
  return {
    ruleId: rule.id, clauseRef: rule.clauseRef, regulator: rule.regulator,
    severity: rule.severity, testType: rule.testType, title: rule.title,
    sourceUrl: rule.sourceUrl, draft: rule.draft,
    quotedText, explanation, suggestedFix,
  };
}

export function sweepPost(post: CreatorPost): SweepResult {
  const findings: Finding[] = [];

  const disclosure = d.disclosurePresent(post.caption, post.foldIndex);
  if (disclosure.matched) {
    findings.push(finding(
      "ASCI-INF-1",
      disclosure.spans[0]?.text ?? "no disclosure",
      disclosure.detail?.includes("past the")
        ? `${disclosure.detail}. A disclosure the audience must tap "more" to see has not disclosed anything — the test is position and prominence, not presence.`
        : "No material-connection disclosure found anywhere in the caption. Paid content must be disclosed upfront and prominently.",
      disclosure.detail?.includes("past the")
        ? "Move the disclosure to the first line of the caption."
        : "Add #ad or the platform's paid-partnership label to the first line.",
    ));
  }

  // The caption is copy the brand is liable for, so it runs the same engine as an
  // owned asset — no separate rulebook for creator content.
  const { verdict } = evaluateText(post.caption, post.market, { sku: post.sku, brand: post.brand });
  const claimFindings = verdict.findings.filter(
    (f) => f.ruleId !== "ASCI-INF-1" &&
      // Ledger-resolution findings only survive on spans that actually assert something
      // objective. Deterministic findings are kept regardless of where they appear.
      (f.ruleId !== "ASCI-I-1" || isObjectiveClaim(f.quotedText)),
  );
  findings.push(...claimFindings);

  const critical = findings.some((f) => f.severity === "critical");
  return {
    post,
    status: critical ? "RED" : findings.length ? "AMBER" : "GREEN",
    findings,
    disclosureOk: !disclosure.matched,
    claimsOk: claimFindings.length === 0,
  };
}

/** Plain-language fix request. The creator gets an ask, not a compliance citation. */
export function fixRequest(r: SweepResult): string {
  const asks = r.findings
    .map((f) => f.suggestedFix)
    .filter((x): x is string => Boolean(x));
  const unique = Array.from(new Set(asks));

  return [
    `Hi ${r.post.displayName.split(" ")[0]},`,
    ``,
    `Thanks for the ${r.post.brand} post from ${new Date(r.post.postedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}. We need a couple of small edits to keep it within Indian advertising rules — nothing about the post itself, just how it's worded.`,
    ``,
    ...unique.map((a, i) => `${i + 1}. ${a}`),
    ``,
    `Could you update it within 48 hours? Reply here if anything is unclear and we'll sort it out. We've saved a copy of the current version for our records.`,
    ``,
    `Thanks,`,
    `${r.post.brand} brand team`,
  ].join("\n");
}
