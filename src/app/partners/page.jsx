import { Handshake, Scale, ShieldCheck } from "lucide-react";
import { partners } from "@/data/partners";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/home/sections";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionLabel } from "@/components/ui";
import { PartnerDirectory } from "./partner-directory";

export const metadata = {
  title: "Our partners",
  description: "The banks, NBFCs and housing finance companies SBFT works with, and the loans each one offers.",
};

const reasons = [
  {
    icon: Scale,
    title: "Comparison, not a single pitch",
    body: "Because we're not tied to one lender, we can show you where your profile is priced best — and explain why.",
  },
  {
    icon: Handshake,
    title: "Direct lines to credit teams",
    body: "Years of files with each partner mean we know their policies, and can escalate when a case needs a second look.",
  },
  {
    icon: ShieldCheck,
    title: "Regulated lenders only",
    body: "Every partner is an RBI-regulated bank, NBFC or NHB-registered housing finance company. No app-only lenders.",
  },
];

export default function PartnersPage() {
  const banks = partners.filter((p) => p.type === "bank").length;
  const nbfcs = partners.length - banks;

  return (
    <>
      <PageHero
        crumb="Our partners"
        eyebrow="Banking & NBFC partners"
        lines={["Strong partnerships,", <em key="better" className="text-saffron-ink">better offers.</em>]}
        description="We work with leading banks and NBFCs to give you the best loan options at competitive rates."
        aside={
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            <div className="bg-surface p-6">
              <p className="figure text-5xl leading-none text-ink tabular">{banks}</p>
              <p className="mt-2 text-sm text-muted">Public &amp; private banks</p>
            </div>
            <div className="bg-surface p-6">
              <p className="figure text-5xl leading-none text-ink tabular">{nbfcs}</p>
              <p className="mt-2 text-sm text-muted">NBFCs &amp; housing finance</p>
            </div>
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="shell">
          <PartnerDirectory />
        </div>
      </section>

      <section className="bg-navy py-20 text-on-navy md:py-24">
        <div className="shell">
          <Reveal>
            <SectionLabel className="text-saffron!">Why it matters to you</SectionLabel>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4vw,2.9rem)] leading-[1.02] tracking-tight">
              Your trusted loan facilitator.
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-10 md:grid-cols-3" stagger={0.12}>
            {reasons.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title} className="border-t border-white/15 pt-6">
                <Icon className="size-7 text-saffron" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-on-navy-muted">{body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <div className="pt-20 md:pt-28">
        <CtaBand
          title="Are you a lender or DSA?"
          body="We're always open to new partnerships with regulated lenders and channel partners. Let's talk."
        />
      </div>
    </>
  );
}
