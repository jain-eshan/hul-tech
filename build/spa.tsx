import React from "react";
import { createRoot } from "react-dom/client";
import { usePathname } from "./shims/next-navigation";

import Shell from "@/components/Shell";
import Inbox from "@/app/page";
import BatchReview from "@/app/batch/page";
import MomentRisk from "@/app/moment/page";
import Ring0 from "@/app/ring0/page";
import CreatorSweep from "@/app/watch/page";
import AuditTrail from "@/app/audit/page";
import RuleReplay from "@/app/replay/page";
import AccuracyCard from "@/app/accuracy/page";
import LiveCheck from "@/app/live/page";
import AssetDetail from "@/app/asset/[id]/page";

// Standalone single-file build of the same components the served app uses. There is no
// second implementation to drift: every screen, the engine and the data are imported
// from the same modules.
//
// Live Check's model route needs a server, so in this build it runs the deterministic
// engine directly — which is the same silent fallback the served app uses when the
// model times out.

const STATIC: Record<string, React.ComponentType> = {
  "/": Inbox,
  "/batch": BatchReview,
  "/moment": MomentRisk,
  "/ring0": Ring0,
  "/watch": CreatorSweep,
  "/audit": AuditTrail,
  "/replay": RuleReplay,
  "/accuracy": AccuracyCard,
  "/live": LiveCheck,
};

function Router() {
  const path = usePathname();

  const asset = path.match(/^\/asset\/([^/]+)$/);
  if (asset) return <AssetDetail params={{ id: decodeURIComponent(asset[1]) }} />;

  const Page = STATIC[path];
  if (Page) return <Page />;

  return (
    <div>
      <h1 className="text-[24px] font-semibold mb-2">Not found</h1>
      <p className="text-[13px] text-[var(--text-muted)]">
        No screen at <span className="mono">{path}</span>. <a href="#/" className="text-[var(--accent)]">Back to Inbox</a>.
      </p>
    </div>
  );
}

class Boundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div>
          <h1 className="text-[24px] font-semibold mb-2">Not found</h1>
          <p className="text-[13px] text-[var(--text-muted)]">
            <a href="#/" className="text-[var(--accent)]">Back to Inbox</a>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

if (!window.location.hash) window.location.hash = "/";

createRoot(document.getElementById("root")!).render(
  <Shell><Boundary><Router /></Boundary></Shell>,
);
