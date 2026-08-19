"use client";

import { create } from "zustand";
import type { Persona } from "@/lib/types";

// React state only. No database, no localStorage (PRD §10.5 hard constraints) —
// which also means the Reset control genuinely returns a clean state.

export interface LedgerRow {
  id: string;
  timestamp: string;
  assetId: string;
  ruleSetVersion: string;
  status: string;
  findings: number;
  approver: string;
  action: string;
  reasoning?: string;
}

interface AppState {
  persona: Persona;
  setPersona: (p: Persona) => void;
  /** assetId -> the copy after an applied fix, so Apply mutates the left pane. */
  appliedFixes: Record<string, string>;
  applyFix: (assetId: string, newCopy: string) => void;
  /** assetId::ruleId of findings a human has overridden with a justification. */
  overrides: Record<string, string>;
  override: (key: string, reasoning: string) => void;
  ledger: LedgerRow[];
  appendLedger: (row: Omit<LedgerRow, "id" | "timestamp">) => void;
  reset: () => void;
}

const now = () => new Date().toISOString().replace("T", " ").slice(0, 19);

export const useApp = create<AppState>((set) => ({
  persona: "abm",
  setPersona: (persona) => set({ persona }),
  appliedFixes: {},
  applyFix: (assetId, newCopy) =>
    set((s) => ({ appliedFixes: { ...s.appliedFixes, [assetId]: newCopy } })),
  overrides: {},
  override: (key, reasoning) => set((s) => ({ overrides: { ...s.overrides, [key]: reasoning } })),
  ledger: [],
  // Append only. No update path, no delete path — defensibility is a schema
  // property, not a feature (PRD §9.4).
  appendLedger: (row) =>
    set((s) => ({
      ledger: [{ ...row, id: `L-${s.ledger.length + 1}`, timestamp: now() }, ...s.ledger],
    })),
  reset: () => set({ appliedFixes: {}, overrides: {}, ledger: [], persona: "abm" }),
}));

export const personaLabel: Record<Persona, string> = {
  abm: "Priya Sharma · ABM",
  legal: "Legal Counsel",
  director: "Brand Director",
};

/** Legal sees Override; the ABM does not. A 20-minute build that shows the
 *  governance model better than a slide (PRD §11.2). */
export const canOverride = (p: Persona) => p === "legal" || p === "director";
export const canShip = (p: Persona) => p === "abm" || p === "director";
