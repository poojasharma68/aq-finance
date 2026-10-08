import { brand } from "@/data/site";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/home/sections";
import { FounderPromise, FounderSpotlight } from "./about-sections";

export const metadata = {
  title: "About us",
  description: `Meet the founder of ${brand.short} — a lending specialist who compares lenders for you and sees your loan through to disbursal.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About us"
        eyebrow="Our story"
        lines={["Built by a banker,", <em key="you" className="text-saffron-ink">for borrowers.</em>]}
        description={`${brand.full} was founded by a lending specialist who sat on the bank's side of the table for years — and now sits on yours.`}
      />
      <FounderSpotlight />
      <FounderPromise />
      <CtaBand
        title="Talk to someone who knows lending."
        body="Tell us what you need and we'll call you back within 30 minutes."
      />
    </>
  );
}
