import { NextResponse } from "next/server";
import { evaluateText } from "@/lib/engine";
import type { Market } from "@/lib/types";

// PRD §11.12. The one route that talks to a model.
//
// Reliability requirements are non-negotiable: 12s timeout, and on ANY error or
// timeout fall back silently to the deterministic checker over the seeded rules.
// The screen must never show a judge an error. That is why the fallback is computed
// first and the model result only replaces it on success.

export const runtime = "nodejs";
export const maxDuration = 20;

const TIMEOUT_MS = 12_000;

export async function POST(req: Request) {
  const { copy, market } = (await req.json()) as { copy: string; market: Market };

  // Computed first, always available. The model is an upgrade, not a dependency.
  const fallback = evaluateText(copy ?? "", market ?? "IN");
  const base = { verdict: fallback.verdict, source: "deterministic" as const };

  const key = process.env.GEMINI_API_KEY;
  if (!key || !copy?.trim()) return NextResponse.json(base);

  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctl.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(copy, market ?? "IN") }] }],
          generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
        }),
      },
    );
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json(base);

    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return NextResponse.json(base);

    const parsed = JSON.parse(text) as { findings?: { ruleId?: string }[] };
    // A model finding that cites no rule is discarded rather than rendered. This is
    // the request-layer expression of finding.rule_id NOT NULL.
    const cited = (parsed.findings ?? []).filter((f) => f.ruleId);
    if (!cited.length) return NextResponse.json(base);

    return NextResponse.json({ verdict: fallback.verdict, judgment: cited, source: "gemini" });
  } catch {
    // Silent. Never surface a model failure to the screen.
    return NextResponse.json(base);
  }
}

function buildPrompt(copy: string, market: Market): string {
  return `You are PRAMAAN, a brand-governance clearance agent. Evaluate the marketing copy below for market ${market} against Indian advertising regulation.

Return strict JSON: {"findings":[{"ruleId":"<id>","clauseRef":"<clause>","severity":"critical|major|minor","quotedText":"<the exact offending span>","explanation":"<why>","suggestedFix":"<compliant alternative or null>"}]}

Use ONLY these rule ids: ASCI-I-1 (claims must be substantiable in the market of publication), ASCI-I-2 (misleading by ambiguity or exaggeration), ASCI-I-4 (manufactured scientific precision), ASCI-IV-3 (unwarranted superiority), ASCI-INF-1 (undisclosed material connection), CCPA-100 (100% claims must be literally verifiable), CCPA-GW-3 (vague environmental absolutes), CCPA-DP-7 (false urgency), DMR-3 (treatment or cure of scheduled conditions), FSSAI-AC-6 (no "health drink" category exists).

If you cannot cite a rule from that list, do not emit the finding. If you are not confident, return fewer findings rather than guessing. Do not invent rule ids.

COPY: ${JSON.stringify(copy)}`;
}
