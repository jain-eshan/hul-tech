"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stamp, RotateCcw } from "lucide-react";
import { useApp, personaLabel } from "@/lib/store";
import { RULE_SET_VERSION } from "@/data/rules";
import { TourButton } from "./Tour";
import type { Persona } from "@/lib/types";
import { cx } from "@/lib/ui";

// PRD §11.2. The console exists for governance. The brand manager never has to
// open it — that is the point — so the nav is built for legal and directors.

const NAV: { group: string; items: { href: string; label: string }[] }[] = [
  { group: "CLEAR", items: [
    { href: "/", label: "Inbox" },
    { href: "/batch", label: "Batch Review" },
    { href: "/moment", label: "Moment Risk" },
    { href: "/ring0", label: "Ring 0" },
  ]},
  { group: "WATCH", items: [
    { href: "/watch", label: "Creator Sweep" },
  ]},
  { group: "LEDGER", items: [
    { href: "/audit", label: "Audit Trail" },
    { href: "/replay", label: "Rule Replay" },
    { href: "/accuracy", label: "Accuracy Card" },
  ]},
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { persona, setPersona, reset } = useApp();

  // Fixture pages render bare. They exist to be captured by the snapshot pipeline as
  // if they were third-party pages, and a captured "creator post" wrapped in this
  // product's own navigation is evidence of the wrong thing entirely.
  if (path?.startsWith("/fixtures")) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-[240px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
        <div className="px-5 h-14 flex items-center gap-2 border-b border-[var(--border)]">
          <Stamp size={17} strokeWidth={2.2} className="text-[var(--accent)]" />
          <span className="font-semibold tracking-[0.14em] text-[13px]">PRAMAAN</span>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map((g) => (
            <div key={g.group} className="mb-5">
              <div className="section-header px-5 mb-1.5">{g.group}</div>
              {g.items.map((it) => {
                const active = path === it.href;
                return (
                  <Link key={it.href} href={it.href}
                    className={cx(
                      "block px-5 py-1.5 text-[13px] transition-colors",
                      active
                        ? "bg-[#EFF6FF] text-[var(--accent)] font-medium border-r-2 border-[var(--accent)]"
                        : "text-[var(--text)] hover:bg-[var(--bg)]",
                    )}>
                    {it.label}
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="px-5 pt-1 border-t border-[var(--border)] mt-1">
            <Link href="/live"
              className={cx("block py-2 text-[13px]",
                path === "/live" ? "text-[var(--accent)] font-medium" : "hover:text-[var(--accent)]")}>
              Live Check
            </Link>
          </div>
        </nav>

        <div data-tour="persona" className="border-t border-[var(--border)] p-4 space-y-2">
          <div className="section-header">Signed in as</div>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as Persona)}
            className="w-full text-[13px] border border-[var(--border)] rounded px-2 py-1.5 bg-[var(--surface)]">
            {(Object.keys(personaLabel) as Persona[]).map((p) => (
              <option key={p} value={p}>{personaLabel[p]}</option>
            ))}
          </select>
          <button onClick={reset}
            className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)] hover:text-[var(--text)]">
            <RotateCcw size={12} /> Reset demo state
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar exists for one control. A judge arriving alone needs an obvious way
            in, and "read the sidebar and guess" is not one. */}
        <div className="border-b border-[var(--border)] bg-[var(--surface)] px-8 h-14 flex items-center justify-end gap-4">
          <span className="text-[13px] text-[var(--text-muted)]">
            First time here? Take the four-minute tour.
          </span>
          <TourButton />
        </div>
        <div className="flex-1 max-w-[1280px] w-full px-8 py-7">{children}</div>
        {/* Persistent on every page. Scope honesty is cheaper than being caught (§10.2). */}
        <footer className="border-t border-[var(--border)] px-8 py-2.5 mono text-[var(--text-muted)]">
          Prototype · rule text paraphrased for machine execution · portfolio data illustrative · rule set {RULE_SET_VERSION}
        </footer>
      </main>
    </div>
  );
}
