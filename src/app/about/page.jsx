import { brand } from "@/data/site";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/home/sections";
import { FounderSpotlight, Journey, TeamMarquee, TeamGrid } from "./about-sections";

export const metadata = {
  title: "About us",
  description: `Meet the founder and the team behind ${brand.short} — the people who compare lenders and see your loan through to disbursal.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About us"
        eyebrow="Our people"
        lines={["The people behind", <em key="loan" className="text-saffron-ink">your loan.</em>]}
        description={`${brand.full} is a team of lending specialists who have sat on the bank's side of the table — and now sit on yours.`}
        aside={<TeamMarquee />}
        align="start"
      />
      <FounderSpotlight />
      <Journey />
      <TeamGrid />
      <CtaBand
        title="Talk to someone who knows lending."
        body="Tell us what you need. One of the people above will call you back within 30 minutes."
      />
    </>
  );
}
