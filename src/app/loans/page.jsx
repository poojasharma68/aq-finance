import { loans } from "@/data/loans";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/home/sections";
import { LoanExplorer } from "./loan-explorer";

export const metadata = {
  title: "Loan products",
  description:
    "Personal, home, business, education, loan against property, overdraft and balance transfer / debt consolidation — compare terms, eligibility and documents.",
};

export default async function LoansPage({ searchParams }) {
  const { type } = await searchParams;
  const lowest = Math.min(...loans.map((l) => l.rateFrom));

  return (
    <>
      <PageHero
        crumb="Loan products"
        eyebrow="Loan products"
        lines={["Our loan", <em key="solutions" className="text-saffron-ink">solutions.</em>]}
        description="Multiple loan options, one trusted partner. Choose the one that fits your need and we'll find the lender that fits you."
        aside={
          <div className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface">
            {[
              [String(loans.length), "Loan products"],
              [`${lowest}%`, "Lowest rate today"],
              ["30 yrs", "Longest tenure"],
            ].map(([value, label]) => (
              <div key={label} className="px-4 py-5 sm:px-6">
                <p className="figure text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-ink tabular">{value}</p>
                <p className="mt-2 text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        }
      />
      <section id="loan-explorer" className="scroll-mt-16">
        <div className="shell">
          <LoanExplorer key={String(type)} initialSlug={typeof type === "string" ? type : undefined} />
        </div>
      </section>
      <CtaBand
        title="Not sure which loan fits?"
        body="Tell us what the money is for. An advisor will suggest the right product — and tell you honestly if a loan isn't the best route."
      />
    </>
  );
}
