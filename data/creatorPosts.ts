import type { Market } from "@/lib/types";

// Creator posts for the WATCH sweep (PRD §11.9) and the evidence snapshot (B4).
//
// ⚠️ These are SIMULATED posts rendered locally. This environment has no outbound
// network access, so nothing here was crawled from a live platform. What IS real is
// the capture pipeline: scripts/capture-snapshots.mjs drives a headless browser over
// each rendered post, writes the PNG and the DOM, and hashes both with SHA-256. The
// mechanism is the thing being demonstrated; the source is a fixture, and the UI says so.

export interface CreatorPost {
  id: string;
  handle: string;
  displayName: string;
  platform: "Instagram" | "YouTube" | "X";
  followers: string;
  brand: string;
  sku?: string;
  caption: string;
  postedAt: string;
  market: Market;
  /** Character index the platform truncates at, before a "more" fold. */
  foldIndex: number;
}

export const creatorPosts: CreatorPost[] = [
  {
    id: "CR-01", handle: "@glowwithria", displayName: "Ria Menon", platform: "Instagram",
    followers: "412K", brand: "Lakmé", sku: "LAK-FND-30", market: "IN",
    postedAt: "2026-08-17T09:14:00Z", foldIndex: 125,
    caption: "obsessed with this foundation!! 16 hours and it did not budge through a full shoot day. shade 04 is my match. linking below xx",
  },
  {
    id: "CR-02", handle: "@fitfam.arjun", displayName: "Arjun Nair", platform: "Instagram",
    followers: "1.1M", brand: "Lifebuoy", sku: "LIF-SOAP-100", market: "IN",
    postedAt: "2026-08-18T06:02:00Z", foldIndex: 125,
    caption: "post-session routine is non negotiable. gym floors are filthy and I am not bringing that home to my kid. this one removes 99.9% of germs which is all I need to know honestly. been using it for years now, way before any of this. #ad",
  },
  {
    id: "CR-03", handle: "@meera.skincare", displayName: "Meera Iyer", platform: "Instagram",
    followers: "228K", brand: "Pond's", sku: "PON-CRM-50", market: "IN",
    postedAt: "2026-08-18T14:40:00Z", foldIndex: 125,
    caption: "#ad this cream literally cures acne, my derm was shocked. 100% natural too. only 3 left on the site, hurry!!",
  },
  {
    id: "CR-04", handle: "@kavya.styles", displayName: "Kavya Rao", platform: "Instagram",
    followers: "89K", brand: "Dove", sku: "DOV-BAR-100", market: "IN",
    postedAt: "2026-08-16T11:20:00Z", foldIndex: 125,
    caption: "#ad soft skin szn. dermatologist tested and it has the 1/4 moisturising cream, which is the only reason my winter skin survives.",
  },
  {
    id: "CR-05", handle: "@thehomechef", displayName: "Sanjay Bhatt", platform: "YouTube",
    followers: "640K", brand: "Kissan", sku: "KIS-JAM-500", market: "IN",
    postedAt: "2026-08-15T08:00:00Z", foldIndex: 200,
    caption: "#sponsored breakfast series ep 12. no added preservatives in this one, which matters when you are feeding kids every morning.",
  },
  {
    id: "CR-06", handle: "@urban.grooming", displayName: "Devansh Kapoor", platform: "Instagram",
    followers: "156K", brand: "Rexona", sku: "REX-AP-150", market: "IN",
    postedAt: "2026-08-19T07:30:00Z", foldIndex: 125,
    caption: "Paid partnership with Rexona. 72h freshness genuinely holds up on a 14 hour shoot day. it won't ever let you down.",
  },
];
