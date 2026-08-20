import type { VerdictStatus, Severity, Routing } from "@/lib/types";

// Verdict colour is sacred: green/amber/red appear only on verdicts, never
// decoratively (PRD §11.1). Everything that needs one comes through here.

export const verdictColor: Record<VerdictStatus, string> = {
  GREEN: "var(--verdict-green)",
  AMBER: "var(--verdict-amber)",
  RED: "var(--verdict-red)",
};

export const verdictBg: Record<VerdictStatus, string> = {
  GREEN: "#F0FDF4", AMBER: "#FFFBEB", RED: "#FEF2F2",
};

export const severityColor: Record<Severity, string> = {
  critical: "var(--verdict-red)",
  major: "var(--verdict-amber)",
  minor: "var(--text-muted)",
};

/**
 * Severity is stored as critical/major/minor because that is what the regulators'
 * own taxonomies use. On screen it answers a simpler question: do I have to act?
 */
export const severityLabel: Record<Severity, string> = {
  critical: "Must fix",
  major: "Should fix",
  minor: "Optional",
};

/** Copy rule: never "compliance" in a primary label. The product sells velocity. */
export const verdictLabel: Record<VerdictStatus, string> = {
  GREEN: "Cleared", AMBER: "Needs edit", RED: "Blocked",
};

/**
 * Routing is stored snake_case and must never reach a screen that way. These say who
 * has to look at the asset, which is the only thing a reader wants from this column.
 */
export const routingLabel: Record<Routing, string> = {
  auto: "No one — cleared",
  single_approver: "One approver",
  full_chain: "Legal + director",
  abstain: "Sent to a human",
};

export const fmtReach = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}K` : String(n);

export const cx = (...parts: (string | false | undefined | null)[]) => parts.filter(Boolean).join(" ");
