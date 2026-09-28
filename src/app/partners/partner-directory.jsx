"use client";

import { AnimatePresence, motion } from "motion/react";
import { loans } from "@/data/loans";
import { partners, partnerTypes } from "@/data/partners";
import { stats } from "@/data/site";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion";
import { PartnerLogo } from "@/components/ui";

// "250+" — the same figure the home page stats show
const totalPartners = stats.find((s) => s.label === "Lending partners");

export function PartnerDirectory() {
  return (
    <div>
      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {partners.map((partner) => (
            <motion.li
              key={partner.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="group relative flex flex-col rounded-[1.25rem] border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-saffron hover:shadow-[0_24px_50px_-30px_rgb(4_35_76/0.45)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <PartnerLogo
                    partner={partner}
                    size="lg"
                    bordered={false}
                    monogramClassName="group-hover:bg-saffron group-hover:text-on-saffron"
                  />
                  <div>
                    <h3 className="heading-4 text-ink">{partner.name}</h3>
                    <p className="mt-0.5 text-xs text-muted">
                      {partnerTypes[partner.type]} · partner since {partner.since}
                    </p>
                  </div>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-3 gap-2 border-y border-line py-4 text-sm">
                <div>
                  <dt className="text-xs text-muted">Rates from</dt>
                  <dd className="mt-0.5 figure text-xl text-ink tabular">
                    {Math.min(...Object.values(partner.rates)).toFixed(2)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Up to</dt>
                  <dd className="mt-0.5 figure text-xl text-ink">{partner.maxLoan}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Sanction</dt>
                  <dd className="mt-0.5 figure text-xl text-ink tabular">
                    {partner.sanctionDays}d
                  </dd>
                </div>
              </dl>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {partner.products.map((slug) => {
                  const loan = loans.find((l) => l.slug === slug);
                  return (
                    <li
                      key={slug}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium",
                        "border-line text-ink-soft",
                      )}
                    >
                      {loan.shortName}
                    </li>
                  );
                })}
              </ul>
            </motion.li>
          ))}
          <motion.li
            key="many-more"
            layout
            className="flex flex-col justify-center rounded-[1.25rem] bg-navy p-6 text-on-navy"
          >
            <p className="figure text-4xl leading-none text-saffron tabular">
              + {totalPartners.value - partners.length}
              {totalPartners.suffix}
            </p>
            <h3 className="heading-4 mt-3">And many more lenders</h3>
            <p className="mt-2 text-sm text-on-navy-muted">
              These are just a few of our {totalPartners.value}
              {totalPartners.suffix} banking &amp; NBFC partners. Tell us what you need and your advisor will match
              you with the right one.
            </p>
          </motion.li>
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
