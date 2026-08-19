import type { Asset, ExtractedClaim, Market, ClaimType, Surface } from "@/lib/types";

// Seed assets — PRD §10.3 (~60 assets: 12 Rexona for Demo A + 48 portfolio for Demo C).
//
// `extracted` rows are CACHED claim extraction. Replay re-runs the decision plane
// over these and never re-extracts — the architectural decision that makes portfolio
// replay economically viable (PRD §5.5.7, §9.2).
//
// Display copy is localised; extracted claim text is normalised to canonical English,
// which is what extraction actually produces before ledger lookup.

let seq = 0;
const ex = (
  claimText: string, claimType: ClaimType = "performance", surface: Surface = "headline",
  extra: Partial<ExtractedClaim> = {},
): ExtractedClaim => ({
  id: `EXT-${String(++seq).padStart(4, "0")}`,
  claimText, claimType, surface, ...extra,
});

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `0x${(h >>> 0).toString(16).padStart(8, "0")}`;
};

interface Seed {
  id: string; brand: string; sku: string; campaign: string; market: Market;
  language: string; channel: string; format: Asset["format"]; copy: string;
  extracted: ExtractedClaim[];
  aiGenerated?: boolean; aiTier?: Asset["aiTier"]; c2paManifest?: boolean;
  reachEstimate?: number; spend?: number; reversibility?: number;
  durationSeconds?: number; labelDurationSeconds?: number;
  containsHumanLikeness?: boolean; likenessEnrolled?: boolean;
  sourceSystem?: string; createdAt?: string;
}

const mk = (s: Seed): Asset => ({
  id: s.id, hash: hash(s.id + s.copy), brand: s.brand, sku: s.sku, campaign: s.campaign,
  market: s.market, language: s.language, channel: s.channel, format: s.format,
  sourceSystem: s.sourceSystem ?? "Sketch Pro", copy: s.copy, extracted: s.extracted,
  aiGenerated: s.aiGenerated ?? true, aiTier: s.aiTier ?? "low",
  c2paManifest: s.c2paManifest ?? true,
  reachEstimate: s.reachEstimate ?? 120_000, spend: s.spend ?? 250_000,
  reversibility: s.reversibility ?? 0.7,
  durationSeconds: s.durationSeconds, labelDurationSeconds: s.labelDurationSeconds,
  containsHumanLikeness: s.containsHumanLikeness ?? false,
  likenessEnrolled: s.likenessEnrolled ?? true,
  createdAt: s.createdAt ?? "2026-08-19T18:40:00Z",
});

// ── Demo A — Rexona, "The Fourth Official", 12 variants (PRD §11.5) ─────────
// Expected outcome: 9 GREEN · 2 AMBER (UK, DE) · 1 RED (VN).

const CAMPAIGN = "The Fourth Official";
const REX = { brand: "Rexona", sku: "REX-AP-150", campaign: CAMPAIGN, channel: "Instagram" };

export const rexonaVariants: Asset[] = [
  mk({ ...REX, id: "REX-01", market: "IN", language: "Hindi", format: "reel",
    copy: "72 घंटे की ताज़गी। यह आपको कभी निराश नहीं करेगा।",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 2_100_000, spend: 4_800_000 }),
  mk({ ...REX, id: "REX-02", market: "IN", language: "English", format: "reel",
    copy: "72h freshness. It won't ever let you down.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 1_800_000, spend: 4_200_000 }),
  mk({ ...REX, id: "REX-03", market: "AE", language: "Arabic", format: "reel",
    copy: "انتعاش يدوم ٧٢ ساعة. لن يخذلك أبداً.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 640_000 }),
  mk({ ...REX, id: "REX-04", market: "ZA", language: "English", format: "reel",
    copy: "72h freshness. It won't ever let you down.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 510_000 }),
  mk({ ...REX, id: "REX-05", market: "BR", language: "Portuguese", format: "reel",
    copy: "72h de frescor. Nunca vai te decepcionar.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 1_400_000 }),
  mk({ ...REX, id: "REX-06", market: "ID", language: "Bahasa Indonesia", format: "reel",
    copy: "Kesegaran 72 jam. Tak akan mengecewakanmu.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 980_000 }),
  mk({ ...REX, id: "REX-07", market: "PH", language: "English", format: "reel",
    copy: "72h freshness. It won't ever let you down.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 720_000 }),
  mk({ ...REX, id: "REX-08", market: "TH", language: "Thai", format: "reel",
    copy: "ความสดชื่นยาวนาน 72 ชั่วโมง ไม่เคยทำให้คุณผิดหวัง",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 430_000 }),
  mk({ ...REX, id: "REX-09", market: "MX", language: "Spanish", format: "reel",
    copy: "72h de frescura. Nunca te va a fallar.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 890_000 }),

  // AMBER — the claim is real, the market registration is not.
  mk({ ...REX, id: "REX-10", market: "UK", language: "English", format: "reel",
    copy: "Clinically proven 72h protection. It won't ever let you down.",
    extracted: [ex("Clinically proven 72h protection"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 380_000, spend: 1_900_000 }),
  mk({ ...REX, id: "REX-11", market: "DE", language: "German", format: "reel",
    copy: "Klinisch bewiesener 72-Stunden-Schutz. Lässt dich nie im Stich.",
    extracted: [ex("Clinically proven 72h protection"), ex("It won't ever let you down", "tagline", "body")],
    reachEstimate: 410_000, spend: 2_100_000 }),

  // RED — unenrolled human likeness. High-risk AI tier: a label does not cure it.
  mk({ ...REX, id: "REX-12", market: "VN", language: "Vietnamese", format: "reel",
    copy: "Sảng khoái 72 giờ. Không bao giờ làm bạn thất vọng.",
    extracted: [ex("72h freshness"), ex("It won't ever let you down", "tagline", "body")],
    aiTier: "high", containsHumanLikeness: true, likenessEnrolled: false,
    reachEstimate: 350_000, reversibility: 0.2 }),
];

// ── Demo C — portfolio for replay (PRD §11.7) ───────────────────────────────
// The ASCI-AI-M tightening (label must persist the FULL duration, not the first 3s)
// must surface EXACTLY these six, ranked by reach. Every other AI-medium asset below
// carries a full-duration label and stays compliant. The engine finds them; nothing
// is fixtured.

const REPLAY_TARGETS: Seed[] = [
  { id: "PF-R1", brand: "Lakmé", sku: "LAK-FND-30", campaign: "Absolute Skin", market: "IN",
    language: "English", channel: "Instagram", format: "reel", copy: "Long-lasting 16h wear.",
    extracted: [ex("Long-lasting 16h wear")], aiGenerated: true, aiTier: "medium",
    durationSeconds: 18, labelDurationSeconds: 3, reachEstimate: 2_400_000, spend: 5_200_000 },
  { id: "PF-R2", brand: "Dove", sku: "DOV-BAR-100", campaign: "Real Care", market: "IN",
    language: "English", channel: "YouTube", format: "video", copy: "Dermatologist tested. 1/4 moisturising cream.",
    extracted: [ex("Dermatologist tested", "safety"), ex("1/4 moisturising cream")],
    aiGenerated: true, aiTier: "medium", durationSeconds: 24, labelDurationSeconds: 3,
    reachEstimate: 1_900_000, spend: 4_600_000 },
  { id: "PF-R3", brand: "Pond's", sku: "PON-CRM-50", campaign: "Age Miracle", market: "IN",
    language: "English", channel: "Instagram", format: "reel", copy: "Fights 10 signs of ageing.",
    extracted: [ex("Fights 10 signs of ageing")], aiGenerated: true, aiTier: "medium",
    durationSeconds: 15, labelDurationSeconds: 0, reachEstimate: 1_100_000, spend: 2_800_000 },
  { id: "PF-R4", brand: "Sunsilk", sku: "SUN-SH-340", campaign: "Hair Fall Solution", market: "ID",
    language: "Bahasa Indonesia", channel: "Meta", format: "static",
    copy: "Mengurangi kerontokan rambut sejak keramas pertama.",
    extracted: [ex("Reduces hair fall from the first wash")], aiGenerated: true, aiTier: "medium",
    durationSeconds: 1, labelDurationSeconds: 0, reachEstimate: 840_000, spend: 1_400_000 },
  { id: "PF-R5", brand: "Vim", sku: "VIM-LIQ-500", campaign: "Tough on Grease", market: "IN",
    language: "Hindi", channel: "Instagram", format: "reel", copy: "बर्तनों पर 99.9% कीटाणुओं को खत्म करता है।",
    extracted: [ex("Kills 99.9% of germs on utensils")], aiGenerated: true, aiTier: "medium",
    durationSeconds: 15, labelDurationSeconds: 3, reachEstimate: 610_000, spend: 980_000 },
  { id: "PF-R6", brand: "Axe", sku: "AXE-DEO-150", campaign: "Find Your Magic", market: "ZA",
    language: "English", channel: "YouTube", format: "video", copy: "All-day confidence, wherever you go.",
    extracted: [ex("All-day confidence, wherever you go", "tagline")], aiGenerated: true, aiTier: "medium",
    durationSeconds: 30, labelDurationSeconds: 3, reachEstimate: 420_000, spend: 760_000 },
];

// Compliant portfolio. AI-medium assets here carry a full-duration label, so the
// replay leaves them alone — which is what makes the six above meaningful.
const COMPLIANT: Seed[] = [
  { id: "PF-01", brand: "Lifebuoy", sku: "LIF-SOAP-100", campaign: "Help a Child Reach 5", market: "IN",
    language: "Hindi", channel: "YouTube", format: "video", copy: "99.9% कीटाणुओं को हटाता है।",
    extracted: [ex("Removes 99.9% of germs")], aiTier: "medium", durationSeconds: 20, labelDurationSeconds: 20,
    reachEstimate: 3_200_000, spend: 6_400_000 },
  { id: "PF-02", brand: "Surf Excel", sku: "SUR-DET-1KG", campaign: "Daag Achhe Hain", market: "IN",
    language: "Hindi", channel: "TV", format: "video", copy: "एक धुलाई में कठिन दाग हटाए।",
    extracted: [ex("Removes tough stains in 1 wash")], aiTier: "low", durationSeconds: 30,
    reachEstimate: 5_100_000, spend: 12_000_000, reversibility: 0.3 },
  { id: "PF-03", brand: "TRESemmé", sku: "TRE-SH-340", campaign: "Salon Strong", market: "IN",
    language: "English", channel: "Instagram", format: "reel", copy: "Up to 10x stronger hair.",
    extracted: [ex("Up to 10x stronger hair")], aiTier: "medium", durationSeconds: 12, labelDurationSeconds: 12,
    reachEstimate: 900_000 },
  { id: "PF-04", brand: "Lakmé", sku: "LAK-SUN-50", campaign: "Sun Expert", market: "IN",
    language: "English", channel: "Meta", format: "static", copy: "SPF 50 PA+++",
    extracted: [ex("SPF 50 PA+++")], aiTier: "low", reachEstimate: 480_000 },
  { id: "PF-05", brand: "Brooke Bond", sku: "BRK-TEA-500", campaign: "Taj Mahal Tea", market: "IN",
    language: "Hindi", channel: "TV", format: "video", copy: "100% भारतीय चाय की पत्तियों से बनी।",
    extracted: [ex("Made with 100% Indian tea leaves")], aiTier: "low", durationSeconds: 20,
    reachEstimate: 2_700_000 },
  { id: "PF-06", brand: "Kissan", sku: "KIS-JAM-500", campaign: "Kissanpur", market: "IN",
    language: "English", channel: "Meta", format: "static", copy: "No added preservatives.",
    extracted: [ex("No added preservatives", "nutrition")], aiTier: "low", reachEstimate: 320_000 },
  { id: "PF-07", brand: "Horlicks", sku: "HOR-500", campaign: "Badhaai Ho", market: "IN",
    language: "English", channel: "YouTube", format: "video", copy: "Fortified with 2 vital nutrients.",
    extracted: [ex("Fortified with 2 vital nutrients", "nutrition")], aiTier: "medium",
    durationSeconds: 25, labelDurationSeconds: 25, reachEstimate: 1_600_000 },
  { id: "PF-08", brand: "Dove", sku: "DOV-BAR-100", campaign: "Real Care", market: "AE",
    language: "Arabic", channel: "Instagram", format: "static", copy: "مُختبَر من أطباء الجلدية.",
    extracted: [ex("Dermatologist tested", "safety")], aiTier: "low", reachEstimate: 260_000 },
  { id: "PF-09", brand: "Rexona", sku: "REX-AP-150", campaign: "Move More", market: "BR",
    language: "Portuguese", channel: "Meta", format: "static", copy: "Tecnologia ativada pelo suor.",
    extracted: [ex("Sweat-activated technology")], aiTier: "low", reachEstimate: 540_000 },
  { id: "PF-10", brand: "Vim", sku: "VIM-LIQ-500", campaign: "Tough on Grease", market: "IN",
    language: "English", channel: "Meta", format: "static", copy: "Kills 99.9% of germs on utensils.",
    extracted: [ex("Kills 99.9% of germs on utensils")], aiTier: "low", reachEstimate: 380_000 },
];

// Bulk portfolio filler. Same shape, same engine path — volume for the replay scope.
const FILLER: Seed[] = Array.from({ length: 32 }, (_, i) => {
  const base = COMPLIANT[i % COMPLIANT.length];
  const markets: Market[] = ["IN", "ID", "PH", "TH", "ZA", "BR", "MX", "AE"];
  const m = markets[i % markets.length];
  return {
    ...base,
    id: `PF-${String(11 + i).padStart(2, "0")}`,
    market: m,
    language: m === "IN" ? "English" : base.language,
    reachEstimate: Math.round((base.reachEstimate ?? 300_000) * (0.35 + ((i * 7) % 11) / 20)),
    // Deliberately compliant: any AI-medium filler labels for its full duration.
    labelDurationSeconds: base.aiTier === "medium" ? base.durationSeconds : undefined,
  };
});

export const portfolio: Asset[] = [...REPLAY_TARGETS, ...COMPLIANT, ...FILLER].map(mk);

export const assets: Asset[] = [...rexonaVariants, ...portfolio];
export const assetById = new Map(assets.map((a) => [a.id, a]));

/**
 * Live portfolio scope. The prototype evaluates the seeded set above; this is the
 * figure the replay screen reports as in-scope, and it is labelled as such in the UI
 * rather than implied (PRD §10.2 scope-honesty rule).
 */
export const LIVE_PORTFOLIO_SCOPE = 1412;
