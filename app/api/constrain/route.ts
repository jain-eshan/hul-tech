import { NextResponse } from "next/server";
import { buildConstraintPack, packAsPrompt } from "@/lib/engine/constrain";
import type { Market } from "@/lib/types";

// pramaan.constrain() — the Ring 0 surface. GET so it is trivially callable from a
// generation pipeline, a notebook, or a judge's browser address bar.
//
//   /api/constrain?brand=Rexona&sku=REX-AP-150&market=IN&channel=Instagram

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const pack = buildConstraintPack(
    q.get("brand") ?? "Rexona",
    q.get("sku") ?? "REX-AP-150",
    (q.get("market") ?? "IN") as Market,
    q.get("channel") ?? "Instagram",
  );
  return NextResponse.json(
    { pack, prompt: packAsPrompt(pack) },
    // Constraint packs change only when rules or dossiers change.
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } },
  );
}
