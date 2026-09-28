"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, FileText } from "lucide-react";
import { loans } from "@/data/loans";
import { partnersFor } from "@/data/partners";
import { stats } from "@/data/site";
import { calculateEmi, formatCompactINR, formatINR } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/button";
import { EASE } from "@/components/motion";
import { LoanIcon } from "@/components/ui";

function tenureLabel({ max }) {
  const fmt = (m) => (m % 12 === 0 ? `${m / 12}` : `${(m / 12).toFixed(1)}`);
  return `Up to ${fmt(max)} years`;
}

// "250+" — the same figure the home page stats show
const totalPartners = stats.find((s) => s.label === "Lending partners");

export function LoanExplorer({ initialSlug }) {
  const [slug, setSlug] = useState(loans.some((l) => l.slug === initialSlug) ? initialSlug : loans[0].slug);
  const loan = loans.find((l) => l.slug === slug);
  const lenders = partnersFor(slug).map((p) => ({ partner: p }));
  const exampleEmi = calculateEmi(loan.example.amount, loan.rateFrom, loan.example.months);

  function select(next) {
    setSlug(next);
    // keep the URL shareable without a navigation
    window.history.replaceState(null, "", `?type=${next}`);
  }

  const terms = [
    ["Loan amount", `Up to ${formatCompactINR(loan.amount.max)}`],
    ["Tenure", tenureLabel(loan.tenure)],
    ["Interest rate", `From ${loan.rateFrom}% p.a.`],
    ["Processing fee", loan.processingFee],
    ["Processing time", loan.processingTime],
  ];

  return (
    <div>
      {/* tabs */}
      <div className="sticky top-16 z-20 -mx-2 md:-mx-8 border-b border-line bg-[color-mix(in_oklab,var(--bg)_90%,transparent)] px-2 md:px-8 backdrop-blur-lg">
        <div role="tablist" aria-label="Loan products" className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {loans.map((item) => {
            const active = item.slug === slug;
            return (
              <button
                key={item.slug}
                role="tab"
                type="button"
                id={`tab-${item.slug}`}
                aria-selected={active}
                aria-controls="loan-panel"
                onClick={() => select(item.slug)}
                className={cn(
                  "relative shrink-0 px-4 py-4 text-sm font-semibold transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {item.name}
                {active && (
                  <motion.span
                    layoutId="loan-tab"
                    className="absolute inset-x-2 bottom-0 h-[2px] bg-saffron"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slug}
          id="loan-panel"
          role="tabpanel"
          aria-labelledby={`tab-${slug}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="grid gap-6 py-10 lg:grid-cols-12 lg:py-14"
        >
          {/* overview */}
          <article className="rounded-[1.5rem] border border-line bg-surface p-6 sm:p-8 lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-saffron-soft text-saffron-ink">
                <LoanIcon name={loan.icon} className="size-6" />
              </span>
              <div>
                <h2 className="heading-2 text-ink">{loan.name}</h2>
                <p className="mt-1.5 text-sm text-muted">Starting at {loan.rateFrom}% p.a.</p>
              </div>
            </div>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-ink">{loan.tagline}</p>
            <p className="mt-3 leading-relaxed text-ink-soft">{loan.summary}</p>

            <dl className="mt-8 divide-y divide-line border-y border-line">
              {terms.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 py-3.5 text-sm">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right font-semibold text-ink tabular">{value}</dd>
                </div>
              ))}
              <div className="py-3.5 text-sm">
                <dt className="text-muted">Eligibility</dt>
                <dd className="mt-1 font-semibold text-ink">{loan.eligibility}</dd>
              </div>
            </dl>

            <div className="mt-8 rounded-xl bg-surface-2 p-4 text-sm">
              <p className="text-muted">Example</p>
              <p className="mt-1 text-ink">
                {formatINR(loan.example.amount)} over {loan.example.months} months at {loan.rateFrom}% ≈{" "}
                <span className="font-semibold tabular">{formatINR(exampleEmi)}/month</span>
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/apply?type=${loan.slug}`} arrow>
                Apply now
              </ButtonLink>
              <ButtonLink href="/#emi-calculator" variant="outline">
                Calculate EMI
              </ButtonLink>
            </div>
          </article>

          {/* features + documents */}
          <div className="grid content-start gap-6 lg:col-span-4">
            <section className="rounded-[1.5rem] border border-line bg-surface p-6 sm:p-8">
              <h3 className="eyebrow">Key features</h3>
              <ul className="mt-5 space-y-3.5">
                {loan.features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: EASE }}
                    className="flex gap-3 text-[0.95rem] text-ink"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-saffron text-on-saffron">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </section>
            <section className="rounded-[1.5rem] border border-line bg-surface p-6 sm:p-8">
              <h3 className="eyebrow">Documents required</h3>
              <ul className="mt-5 space-y-3.5">
                {loan.documents.map((d) => (
                  <li key={d} className="flex gap-3 text-[0.95rem] text-ink-soft">
                    <FileText className="mt-0.5 size-4.5 shrink-0 text-muted" strokeWidth={1.6} aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-xs text-muted">
                Lenders may ask for more depending on your profile. We&apos;ll confirm the final list on the call.
              </p>
            </section>
          </div>

          {/* other options */}
          <div className="grid content-start gap-6 lg:col-span-3">
            <section className="rounded-[1.5rem] border border-line bg-surface p-6">
              <h3 className="eyebrow">Other options</h3>
              <ul className="mt-4 divide-y divide-line">
                {loans
                  .filter((l) => l.slug !== slug)
                  .map((l) => (
                    <li key={l.slug}>
                      <button
                        type="button"
                        onClick={() => {
                          select(l.slug);
                          document.getElementById("loan-explorer")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="group flex w-full items-center gap-3 py-3 text-left"
                      >
                        <LoanIcon name={l.icon} className="size-4.5 text-saffron-ink" />
                        <span className="flex-1 text-sm font-medium text-ink-soft group-hover:text-ink">{l.name}</span>
                        <ArrowRight className="size-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          </div>

          {/* partner strip */}
          <div className="lg:col-span-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              A few of our {totalPartners.value}
              {totalPartners.suffix} lending partners
            </p>
            <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10">
              {lenders.map(({ partner }) => (
                <li
                  key={partner.slug}
                  title={partner.name}
                  className="relative grid h-14 place-items-center overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgb(15_23_42/0.06)] transition-all duration-300 ease-out-quint hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgb(15_23_42/0.18)]"
                >
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      sizes="(min-width: 1024px) 120px, 30vw"
                      className="object-contain px-2 py-1.5"
                    />
                  ) : (
                    <span className="px-3 text-center text-sm font-semibold text-slate-800">{partner.name}</span>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/partners"
                  className="group grid h-14 place-items-center rounded-lg bg-navy px-2 text-center text-on-navy transition-colors hover:bg-saffron hover:text-on-saffron"
                >
                  <span className="text-xs font-semibold leading-tight">
                    {totalPartners.value - lenders.length}+ more
                    <span className="mt-0.5 flex items-center justify-center gap-1 text-[0.65rem] font-medium opacity-80">
                      View all
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
