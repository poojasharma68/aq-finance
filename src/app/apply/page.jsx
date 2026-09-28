import { Clock, Lock, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ApplyForm } from "./apply-form";

export const metadata = {
  title: "Apply for a loan",
  description: "Tell us what you need in two minutes. An SBFT advisor calls back within four working hours.",
};

const promises = [
  { icon: Clock, title: "Simple process", body: "About 2 minutes to fill" },
  { icon: Lock, title: "Secure & confidential", body: "Shared only with your chosen lender" },
  { icon: ShieldCheck, title: "No effect on credit score", body: "Until you pick an offer" },
];

export default async function ApplyPage({ searchParams }) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : undefined;
  const amount = Number(params.amount) || undefined;

  return (
    <>
      <PageHero
        crumb="Apply now"
        eyebrow="Loan application form"
        lines={["Tell us about", <em key="needs" className="text-saffron-ink">your needs.</em>]}
        description="Fill in the details below and an advisor will get back to you with the best offers from our partner banks and NBFCs."
        aside={
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-1">
            {promises.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-center gap-4 bg-surface px-5 py-4">
                <Icon className="size-5 shrink-0 text-saffron-ink" strokeWidth={1.6} aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold text-ink">{title}</span>
                  <span className="block text-xs text-muted">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        }
      />
      <section id="application" className="scroll-mt-20 py-12 md:py-16">
        <div className="shell">
          <ApplyForm initialType={type} initialAmount={amount} />
        </div>
      </section>
    </>
  );
}
