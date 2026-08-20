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

/**
 * Persona capabilities — PRD §11.2 and §3.2.
 *
 * §11.2 requires that switching persona changes "visible columns AND available
 * actions". Gating only the actions implements half the spec, so each persona also
 * declares the columns its role actually needs:
 *
 *   ABM        ships cleared work and applies fixes. No override authority.
 *   Legal      absolute veto, and the only role that reviews the routing queue.
 *              Does not ship — PRAMAAN clears, publication is a separate act (§14.2).
 *   Director   signs off by consequence, so sees exposure (reach and spend), and is
 *              the role that owns routing thresholds (§3.2).
 */
export interface PersonaSpec {
  label: string;
  role: string;
  /** Name written to the append-only ledger when this persona acts. */
  approver: string;
  canOverride: boolean;
  canShip: boolean;
  canSetRouting: boolean;
  /** Extra Inbox columns beyond the base set. */
  columns: ("routing" | "severity" | "reach" | "spend")[];
  /**
   * Legal's queue is judgment calls only (§3.2). The whole before/after in §3.1 is
   * "40 assets untriaged" becoming "4 flagged assets" — showing Legal all 60, of which
   * 53 auto-cleared, renders the *before* picture inside the product that claims to fix
   * it. Auto-cleared work never reached a human and should not sit in a human's queue.
   */
  defaultQueue: "all" | "needs_human";
}

export const PERSONAS: Record<Persona, PersonaSpec> = {
  abm: {
    label: "Priya Sharma · ABM",
    role: "Assistant Brand Manager, Personal Care",
    approver: "Priya Sharma · ABM",
    canOverride: false,
    canShip: true,
    canSetRouting: false,
    columns: [],
    defaultQueue: "all",
  },
  legal: {
    label: "Legal Counsel",
    role: "Legal & Regulatory — absolute veto",
    approver: "Legal Counsel",
    canOverride: true,
    // Legal clears; it does not publish. PRAMAAN never publishes (§14.2).
    canShip: false,
    canSetRouting: false,
    columns: ["routing", "severity"],
    defaultQueue: "needs_human",
  },
  director: {
    label: "Brand Director",
    role: "Brand Director — signs off by consequence",
    approver: "Brand Director",
    canOverride: true,
    canShip: true,
    canSetRouting: true,
    columns: ["reach", "spend"],
    defaultQueue: "all",
  },
};

export const personaLabel: Record<Persona, string> =
  Object.fromEntries(
    (Object.keys(PERSONAS) as Persona[]).map((p) => [p, PERSONAS[p].label]),
  ) as Record<Persona, string>;

export const canOverride = (p: Persona) => PERSONAS[p].canOverride;
export const canShip = (p: Persona) => PERSONAS[p].canShip;
export const approverName = (p: Persona) => PERSONAS[p].approver;
