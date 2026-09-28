import { faqs, contact } from "@/data/site";
import { Faq } from "@/components/faq";
import { Reveal } from "@/components/motion";
import { SectionLabel } from "@/components/ui";
import { EmiCalculator } from "@/components/home/emi-calculator";
import { LoanScannerHero } from "@/components/loan-scanner";
import { ProcessSteps } from "@/components/home/process-steps";
import {
  CtaBand,
  LoanList,
  PartnerMarquee,
  StatsBand,
  TestimonialPreview,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <LoanScannerHero />
      <EmiCalculator />
      <StatsBand />
      <PartnerMarquee />
      <LoanList />
      <ProcessSteps />
      <TestimonialPreview />

      <section className="border-t border-line section-y">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel index="04">Questions</SectionLabel>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,2.9rem)] leading-[1.02] tracking-tight text-ink">
              Before you <em className="text-saffron-ink">ask.</em>
            </h2>
            <p className="mt-5 text-ink-soft">
              Can&apos;t find what you&apos;re looking for? Call{" "}
              <a href={contact.phoneHref} className="font-semibold text-ink underline decoration-saffron underline-offset-4">
                {contact.phone}
              </a>{" "}
              or WhatsApp us — a real person answers.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8">
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
