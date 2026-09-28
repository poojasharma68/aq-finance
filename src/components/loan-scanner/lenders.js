// DEMO DATA for the DSA hero animation — lender names and rates are
// placeholders. Only publish a lender's name or logo once empanelment and
// co-branding approvals are in place, and source every rate from the
// partner's current rate card.
//
// Positions are percentages of the animation stage (card centres). `pos` is
// used from the `sm` breakpoint up, `posSm` on phones. The scanner derives its
// travel targets from wherever the DOM puts these cards, so changing a
// position here is all it takes to re-route the scan — no timeline edits.
//
// `scan.order` marks the cards the magnifier visits, in order. Cards without a
// scan order stay in the cluster as un-scanned options. Cards flagged
// `compact: false` are hidden on phones (only 3 remain, per the design spec),
// and the sequence automatically shortens to the cards that are still visible.

import { calculateEmi } from "@/lib/finance";

const tints = {
  navy: { bg: "#E9F0F9", ink: "#12345C" },
  slate: { bg: "#EDEFF3", ink: "#33404F" },
  indigo: { bg: "#ECEBFA", ink: "#3A3480" },
  teal: { bg: "#E5F5F3", ink: "#0C5B54" },
  plum: { bg: "#F6ECF4", ink: "#6B2557" },
  amber: { bg: "#FBF1E3", ink: "#7A4A10" },
};

/** The enquiry the animation is "running" — drives the EMI on the result card. */
export const brief = {
  product: "Personal loan",
  amount: 500000,
  months: 36,
};

export const lenders = [
  {
    id: "sbi",
    name: "SBI",
    kind: "Bank",
    tint: tints.navy,
    rate: 11.15,
    rateFrom: 12.8,
    pos: { x: 32, y: 19 },
    posSm: { x: 27, y: 18 },
    compact: true,
    scan: { order: 1, pending: "Scanning…", done: "Checking rate ✓" },
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    kind: "Bank",
    tint: tints.indigo,
    rate: 10.75,
    rateFrom: 12.4,
    pos: { x: 70, y: 21 },
    posSm: { x: 73, y: 26 },
    compact: true,
    scan: { order: 2, pending: "Comparing…", done: "Offer checked ✓" },
  },
  {
    id: "icici",
    name: "ICICI Bank",
    kind: "Bank",
    tint: tints.amber,
    rate: 10.99,
    rateFrom: 12.6,
    pos: { x: 83, y: 47 },
    posSm: { x: 33, y: 74 },
    compact: true,
    scan: { order: 3, pending: "Finding better fit…", done: "Compared ✓" },
  },
  {
    id: "axis",
    name: "Axis Bank",
    kind: "Bank",
    tint: tints.plum,
    rate: 11.25,
    rateFrom: 13.1,
    pos: { x: 72, y: 77 },
    compact: false,
    scan: { order: 4, pending: "Matching your profile…", done: "Best fit found ✓" },
  },
  {
    id: "kotak",
    name: "Kotak",
    kind: "Bank",
    tint: tints.teal,
    rate: 11.6,
    rateFrom: 13.4,
    pos: { x: 26, y: 74 },
    compact: false,
  },
  {
    id: "nbfc",
    name: "Partner NBFC",
    kind: "NBFC",
    tint: tints.slate,
    rate: 13.5,
    rateFrom: 15.2,
    pos: { x: 17, y: 45 },
    compact: false,
  },
];

/** The winning offer: the lowest-rate lender the scanner actually visits. */
const winner = lenders
  .filter((lender) => lender.scan)
  .reduce((best, lender) => (lender.rate < best.rate ? lender : best));

/** The offer the scan starts from, so the result card counts *down* to the win. */
const openingOffer = lenders.reduce((worst, lender) => (lender.rate > worst.rate ? lender : worst));

export const bestMatch = {
  lender: winner,
  product: brief.product,
  amount: brief.amount,
  months: brief.months,
  rate: winner.rate,
  rateFrom: openingOffer.rate,
  emi: calculateEmi(brief.amount, winner.rate, brief.months),
  emiFrom: calculateEmi(brief.amount, openingOffer.rate, brief.months),
};

/** Tiny ₹ / % / ✓ chips that puff out of the lens on every scan. Offsets are
 *  deliberately fixed rather than random so each loop of the hero is identical. */
export const lensParticles = [
  { glyph: "₹", dx: -78, dy: -46 },
  { glyph: "%", dx: 70, dy: -58 },
  { glyph: "✓", dx: 10, dy: -86 },
  { glyph: "₹", dx: -92, dy: 16 },
  { glyph: "%", dx: 86, dy: 10 },
  { glyph: "✓", dx: 76, dy: 54 },
  { glyph: "%", dx: -62, dy: 62 },
  { glyph: "₹", dx: 18, dy: 78 },
];

/** Sparkles around the approved card — subtle, 12 of them, no confetti storm. */
export const sparkles = [
  { dx: -104, dy: -86 }, { dx: -46, dy: -108 }, { dx: 34, dy: -112 },
  { dx: 96, dy: -80 }, { dx: 124, dy: -18 }, { dx: 112, dy: 52 },
  { dx: 52, dy: 104 }, { dx: -34, dy: 112 }, { dx: -98, dy: 86 },
  { dx: -126, dy: 22 }, { dx: -72, dy: -40 }, { dx: 78, dy: 24 },
];
