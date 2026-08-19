export function SkeletonRows({ rows = 8 }: { rows?: number }) {
  // Never a blank spinner (PRD §11.13) — structure appears first, values fill in.
  return (
    <div className="border border-[var(--border)] rounded bg-[var(--surface)] overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3 border-b border-[var(--border)] last:border-0">
          <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
          <div className="h-2.5 rounded bg-[var(--border)]" style={{ width: `${18 + (i % 4) * 9}%` }} />
          <div className="h-2.5 rounded bg-[var(--border)] opacity-60" style={{ width: `${12 + (i % 3) * 7}%` }} />
        </div>
      ))}
    </div>
  );
}
