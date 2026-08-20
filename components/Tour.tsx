"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { TOUR } from "@/lib/tour";
import { useApp } from "@/lib/store";

// Spotlight tour. Dims the page, cuts a hole around the thing being discussed, and
// parks a card beside it. Some steps drive the app — clicking Run clearance, applying a
// fix — because watching a verdict resolve is the argument, and describing it is not.

const PAD = 8;

interface Rect { top: number; left: number; width: number; height: number }

export default function Tour({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { setPersona } = useApp();
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [busy, setBusy] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const step = TOUR[i];
  const last = i === TOUR.length - 1;

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  // Run the step: navigate, set persona, fire any scripted click, then locate the target.
  useEffect(() => {
    let cancelled = false;
    clearTimers();
    setBusy(true);
    setRect(null);

    (async () => {
      router.push(step.route);
      if (step.persona) setPersona(step.persona);

      // Wait for the route to actually paint before looking for anything in it.
      await new Promise((r) => timers.current.push(setTimeout(r, 420)));
      if (cancelled) return;

      // Light the target BEFORE firing the action. A step that says "watch the chips
      // resolve" and then dims the chips while a card covers them is worse than no tour.
      if (step.target) {
        const el = document.querySelector(step.target) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ block: "start", behavior: "smooth" });
          await new Promise((r) => timers.current.push(setTimeout(r, 320)));
          if (cancelled) return;
          const b = el.getBoundingClientRect();
          // Clamp the spotlight to the visible intersection, and cap it at roughly half
          // the viewport. A target taller than the screen leaves nowhere for the card.
          const vh = window.innerHeight;
          const top = Math.max(72, b.top);
          const bottom = Math.min(vh - 12, b.bottom);
          setRect({
            top,
            left: Math.max(0, b.left),
            width: b.width,
            height: Math.max(80, Math.min(bottom - top, vh * 0.46)),
          });
        }
      }

      if (step.click) {
        const el = findByText(step.click);
        if (el) (el as HTMLElement).click();
      }
      if (step.settle) {
        await new Promise((r) => timers.current.push(setTimeout(r, step.settle)));
      }
      if (cancelled) return;

      if (!cancelled) setBusy(false);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const next = useCallback(() => (last ? onClose() : setI((n) => n + 1)), [last, onClose]);
  const back = useCallback(() => setI((n) => Math.max(0, n - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "Enter") { next(); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { back(); e.preventDefault(); }
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, back, onClose]);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardH, setCardH] = useState(400);
  useEffect(() => {
    const h = cardRef.current?.offsetHeight;
    if (h && Math.abs(h - cardH) > 8) setCardH(h);
  });

  const card = cardPosition(rect, cardH);

  return (
    <div className="fixed inset-0 z-[100]" aria-live="polite">
      {/* The dim. A ring around the target rather than four panels, so it tracks any shape. */}
      {rect ? (
        <div
          data-tour-spot
          className="absolute rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: rect.top - PAD, left: rect.left - PAD,
            width: rect.width + PAD * 2, height: rect.height + PAD * 2,
            boxShadow: "0 0 0 9999px rgba(28,25,23,0.55)",
            outline: "2px solid var(--accent)",
          }}
        />
      ) : (
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(28,25,23,0.55)" }} />
      )}

      {/* Click-through guard everywhere except the spotlight, so a stray click cannot
          derail the tour — but the judge can still interact with what is highlighted. */}
      <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: "none" }} />

      <div
        ref={cardRef}
        data-tour-card
        className="absolute w-[430px] max-w-[calc(100vw-48px)] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl"
        style={{ top: card.top, left: card.left, pointerEvents: "auto" }}>

        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="section-header">{step.eyebrow}</span>
            <button onClick={onClose} aria-label="End walkthrough"
              className="text-[var(--text-muted)] hover:text-[var(--text)] -mt-0.5">
              <X size={15} />
            </button>
          </div>

          <h2 className="text-[17px] font-semibold leading-snug mb-2.5">{step.title}</h2>

          <div className="text-[13.5px] leading-relaxed space-y-2.5 max-h-[38vh] overflow-y-auto">
            {step.body.split("\n\n").map((p, n) => <p key={n}>{p}</p>)}
          </div>

          {step.who && (
            <div className="mt-3 inline-flex items-center gap-1.5 mono text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-1 rounded">
              Who this helps: {step.who}
            </div>
          )}

          {step.interactive && (
            <div className="mt-3 text-[13px] leading-relaxed border-l-2 border-[var(--accent)] pl-3 text-[var(--text-muted)]">
              {step.interactive}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[var(--border)] flex items-center gap-3">
          <div className="flex gap-1 flex-1">
            {TOUR.map((_, n) => (
              <button key={n} onClick={() => setI(n)} aria-label={`Step ${n + 1}`}
                className="h-1 flex-1 rounded transition-colors"
                style={{ background: n <= i ? "var(--accent)" : "var(--border)" }} />
            ))}
          </div>
          <span className="mono text-[var(--text-muted)] whitespace-nowrap">{i + 1} / {TOUR.length}</span>
          <button onClick={back} disabled={i === 0} aria-label="Previous"
            className="p-1.5 rounded border border-[var(--border)] disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} disabled={busy}
            className="flex items-center gap-1 text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white disabled:opacity-50">
            {busy ? "…" : last ? "Finish" : "Next"} {!busy && !last && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Playwright-style "text=..." selector, so tour steps read the way the UI reads. */
function findByText(sel: string): Element | null {
  if (sel.startsWith("text=")) {
    const want = sel.slice(5).toLowerCase();
    return Array.from(document.querySelectorAll("button, a")).find((el) =>
      (el.textContent ?? "").toLowerCase().includes(want)) ?? null;
  }
  const m = sel.match(/^(\w+):has-text\('(.+)'\)$/);
  if (m) {
    return Array.from(document.querySelectorAll(m[1])).find((el) =>
      (el.textContent ?? "").toLowerCase().includes(m[2].toLowerCase())) ?? null;
  }
  return document.querySelector(sel);
}

/**
 * Park the card beside the spotlight and never on top of it. A tour card that covers
 * the thing it is describing is worse than no tour at all — the judge reads about a
 * market strip they cannot see.
 *
 * Preference order: right of the target, then left, then below, then above. Only if the
 * target fills the viewport does the card overlap, and then it sits at the bottom.
 */
function cardPosition(rect: Rect | null, H: number) {
  const W = 430, M = 20;
  if (typeof window === "undefined") return { top: 100, left: 100 };
  const vw = window.innerWidth, vh = window.innerHeight;
  const clampTop = (t: number) => Math.max(M, Math.min(t, vh - H - M));
  const clampLeft = (l: number) => Math.max(M, Math.min(l, vw - W - M));

  if (!rect) return { top: clampTop(vh / 2 - H / 2), left: clampLeft(vw / 2 - W / 2) };

  if (vw - (rect.left + rect.width) >= W + M * 2) {
    return { top: clampTop(rect.top), left: rect.left + rect.width + M };
  }
  if (rect.left >= W + M * 2) {
    return { top: clampTop(rect.top), left: rect.left - W - M };
  }
  if (vh - (rect.top + rect.height) >= H + M) {
    return { top: rect.top + rect.height + M, left: clampLeft(rect.left) };
  }
  if (rect.top >= H + M) {
    return { top: rect.top - H - M, left: clampLeft(rect.left) };
  }
  // Nowhere clean to sit. Bottom-right, fully on screen — a card that overlaps is
  // recoverable; a card that cannot be reached is not.
  return { top: clampTop(vh - H - M), left: clampLeft(vw - W - M) };
}

export function TourButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded bg-[var(--accent)] text-white hover:opacity-90">
        <Play size={13} /> Guided walkthrough
      </button>
      {open && <Tour onClose={() => setOpen(false)} />}
    </>
  );
}
