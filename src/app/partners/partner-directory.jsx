"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { loans } from "@/data/loans";
import { partners, partnerTypes } from "@/data/partners";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion";

const filters = [
  { value: "all", label: "All partners" },
  { value: "bank", label: "Banks" },
  { value: "nbfc", label: "NBFCs" },
  { value: "hfc", label: "Housing finance" },
];

const productFilters = [{ slug: "any", shortName: "Any product" }, ...loans];

export function PartnerDirectory() {
  const [type, setType] = useState("all");
  const [product, setProduct] = useState("any");

  const visible = partners.filter(
    (p) => (type === "all" || p.type === type) && (product === "any" || p.products.includes(product)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by lender type" className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = f.value === "all" ? partners.length : partners.filter((p) => p.type === f.value).length;
            const active = type === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setType(f.value)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active ? "text-bg" : "text-ink-soft hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="partner-filter"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {f.label} <span className={cn("tabular", active ? "text-bg/60" : "text-muted")}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-3 text-sm text-muted">
          Offers
          <select value={product} onChange={(e) => setProduct(e.target.value)} className="field h-10 w-56 rounded-full text-sm">
            {productFilters.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.shortName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        Showing <span className="font-semibold text-ink tabular">{visible.length}</span> of {partners.length} lenders
      </p>

      <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((partner) => (
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
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line-strong font-extrabold text-[0.7rem] tracking-tight text-ink transition-colors group-hover:border-saffron group-hover:bg-saffron group-hover:text-on-saffron">
                    {partner.mark}
                  </span>
                  <div>
                    <h3 className="font-semibold leading-tight text-ink">{partner.name}</h3>
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
                        product === slug ? "border-saffron bg-saffron-soft text-ink" : "border-line text-ink-soft",
                      )}
                    >
                      {loan.shortName}
                    </li>
                  );
                })}
              </ul>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && (
        <p className="py-16 text-center text-muted">No partners match that combination yet.</p>
      )}
    </div>
  );
}
