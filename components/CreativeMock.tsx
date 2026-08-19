"use client";

import type { Asset } from "@/lib/types";
import { Play } from "lucide-react";

// Believable creative, built entirely in CSS — no third-party logo files, no stock
// imagery. Brand names are set as typographic wordmarks. The point of the left pane
// is to make the finding on the right feel like it is attached to a real asset.

const PALETTE: Record<string, { from: string; to: string; ink: string }> = {
  Rexona:      { from: "#0B2E6F", to: "#1E6FD9", ink: "#FFFFFF" },
  Dove:        { from: "#F4F1EC", to: "#E4DED4", ink: "#1C1917" },
  Lakmé:       { from: "#3B0A2A", to: "#8C1D50", ink: "#FFFFFF" },
  "Pond's":    { from: "#0E3B4C", to: "#2C7A8C", ink: "#FFFFFF" },
  Sunsilk:     { from: "#5A2E86", to: "#B06AB3", ink: "#FFFFFF" },
  Vim:         { from: "#0F4C2A", to: "#2E9E5B", ink: "#FFFFFF" },
  Axe:         { from: "#111111", to: "#3A3A3A", ink: "#FFFFFF" },
  Lifebuoy:    { from: "#8C1616", to: "#D33B3B", ink: "#FFFFFF" },
  "Surf Excel":{ from: "#0A3D91", to: "#3F7BD8", ink: "#FFFFFF" },
  TRESemmé:    { from: "#1A1A1A", to: "#4A4A4A", ink: "#FFFFFF" },
  Horlicks:    { from: "#6B4A16", to: "#C08A2E", ink: "#FFFFFF" },
  "Brooke Bond": { from: "#4A2410", to: "#96522A", ink: "#FFFFFF" },
  Kissan:      { from: "#7A1F1F", to: "#C64B2C", ink: "#FFFFFF" },
};

export default function CreativeMock({ asset, copy }: { asset: Asset; copy: string }) {
  const p = PALETTE[asset.brand] ?? { from: "#1E3A8A", to: "#3B6BC4", ink: "#FFFFFF" };
  const isVideo = asset.format === "video" || asset.format === "reel";
  const headline = copy.split(/(?<=[.!?])\s+/)[0] ?? copy;
  const sub = copy.slice(headline.length).trim();

  return (
    <div className="border border-[var(--border)] rounded overflow-hidden bg-[var(--surface)]">
      <div
        className="relative aspect-[4/5] flex flex-col justify-between p-6"
        style={{ background: `linear-gradient(150deg, ${p.from}, ${p.to})`, color: p.ink }}>

        <div className="flex items-start justify-between">
          <div className="font-semibold tracking-[0.22em] text-[12px] uppercase" style={{ opacity: 0.9 }}>
            {asset.brand}
          </div>
          {asset.aiGenerated && asset.aiTier !== "low" && (
            <div className="mono px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,0,0,0.35)", fontSize: 10 }}>
              AI-GENERATED
            </div>
          )}
        </div>

        {/* Product silhouette — a shape, not a photograph. */}
        <div className="absolute right-6 bottom-24 opacity-25">
          <div style={{ width: 54, height: 128, background: p.ink, borderRadius: "10px 10px 5px 5px" }} />
          <div style={{ width: 30, height: 14, background: p.ink, margin: "-138px auto 0", borderRadius: 3 }} />
        </div>

        <div className="relative z-10 max-w-[78%]">
          <div className="text-[26px] font-semibold leading-[1.15] mb-2">{headline}</div>
          {sub && <div className="text-[14px]" style={{ opacity: 0.85 }}>{sub}</div>}
        </div>

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full p-3" style={{ background: "rgba(0,0,0,0.3)" }}>
              <Play size={20} fill={p.ink} color={p.ink} />
            </div>
          </div>
        )}
      </div>

      {/* Video scrubber with severity markers on the timeline (PRD §11.4). */}
      {isVideo && asset.durationSeconds && (
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <div className="relative h-1.5 rounded bg-[var(--border)]">
            {asset.labelDurationSeconds !== undefined && (
              <div className="absolute h-1.5 rounded"
                style={{
                  left: 0,
                  width: `${(asset.labelDurationSeconds / asset.durationSeconds) * 100}%`,
                  background: "var(--verdict-amber)",
                }}
                title={`Label present ${asset.labelDurationSeconds}s of ${asset.durationSeconds}s`} />
            )}
          </div>
          <div className="flex justify-between mono text-[var(--text-muted)] mt-1.5">
            <span>0:00</span>
            <span>
              {asset.labelDurationSeconds !== undefined
                ? `label ${asset.labelDurationSeconds}s of ${asset.durationSeconds}s`
                : "no label track"}
            </span>
            <span>0:{String(asset.durationSeconds).padStart(2, "0")}</span>
          </div>
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-[var(--border)] flex justify-between mono text-[var(--text-muted)]">
        <span>{asset.sku} · {asset.market} · {asset.language}</span>
        <span>{asset.sourceSystem}</span>
      </div>
    </div>
  );
}
