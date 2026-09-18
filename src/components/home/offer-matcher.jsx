"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { indicativeRate, partnersFor } from "@/data/partners";
import { calculateEmi, formatCompactINR, formatINR, formatTenure } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { PartnerMark } from "@/components/ui";
import { EASE } from "@/components/motion";

const presets = {
  personal: { label: "Personal", min: 1_00_000, max: 40_00_000, step: 50_000, amount: 8_00_000, tenures: [24, 36, 48, 60], months: 48 },
  home: { label: "Home", min: 10_00_000, max: 2_00_00_000, step: 5_00_000, amount: 60_00_000, tenures: [120, 180, 240, 300], months: 240 },
  business: { label: "Business", min: 3_00_000, max: 75_00_000, step: 1_00_000, amount: 20_00_000, tenures: [24, 36, 48, 60], months: 36 },
};

export function OfferMatcher() {
  const [product, setProduct] = useState("personal");
  const [amount, setAmount] = useState(presets.personal.amount);
  const [months, setMonths] = useState(presets.personal.months);
  const preset = presets[product];

  const offers = useMemo(
    () =>
      partnersFor(product)
        .map((partner) => {
          const rate = indicativeRate(partner, product, amount, months);
          return { partner, rate, emi: calculateEmi(amount, rate, months) };
        })
        .sort((a, b) => a.rate - b.rate || a.partner.sanctionDays - b.partner.sanctionDays)
        .slice(0, 4),
    [product, amount, months],
  );

  function selectProduct(next) {
    setProduct(next);
    setAmount(presets[next].amount);
    setMonths(presets[next].months);
  }

  const fill = ((amount - preset.min) / (preset.max - preset.min)) * 100;

  return (
    <div className="relative rounded-[1.5rem] border border-line bg-surface p-5 shadow-[0_30px_80px_-40px_rgb(4_35_76/0.45)] sm:p-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[0.78rem] font-semibold text-ink">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Offer preview
        </p>
        <p className="text-[0.7rem] text-muted">Indicative · Sep 2026</p>
      </div>

      {/* product switch */}
      <div role="tablist" aria-label="Loan type" className="mt-4 grid grid-cols-3 rounded-full bg-surface-2 p-1">
        {Object.entries(presets).map(([key, p]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={product === key}
            onClick={() => selectProduct(key)}
            className={cn(
              "relative rounded-full py-2 text-[0.8rem] font-semibold transition-colors",
              product === key ? "text-bg" : "text-ink-soft hover:text-ink",
            )}
          >
            {product === key && (
              <motion.span
                layoutId="matcher-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative">{p.label}</span>
          </button>
        ))}
      </div>

      {/* amount */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <label htmlFor="matcher-amount" className="text-[0.78rem] font-medium text-muted">
            Loan amount
          </label>
          <output htmlFor="matcher-amount" className="figure text-[1.7rem] leading-none text-ink tabular">
            {formatINR(amount)}
          </output>
        </div>
        <input
          id="matcher-amount"
          type="range"
          min={preset.min}
          max={preset.max}
          step={preset.step}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="range mt-2"
          style={{ "--fill": `${fill}%` }}
        />
        <div className="flex justify-between text-[0.68rem] text-muted tabular">
          <span>{formatCompactINR(preset.min)}</span>
          <span>{formatCompactINR(preset.max)}</span>
        </div>
      </div>

      {/* tenure */}
      <fieldset className="mt-4">
        <legend className="text-[0.78rem] font-medium text-muted">Tenure</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {preset.tenures.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={months === t}
              onClick={() => setMonths(t)}
              className={cn(
                "rounded-lg border py-1.5 text-[0.8rem] font-semibold tabular transition-colors",
                months === t
                  ? "border-saffron bg-saffron-soft text-ink"
                  : "border-line text-ink-soft hover:border-line-strong hover:text-ink",
              )}
            >
              {formatTenure(t)}
            </button>
          ))}
        </div>
      </fieldset>

      {/* ranked offers */}
      <div className="mt-5 border-t border-line pt-4">
        <div className="grid grid-cols-[1fr_4.5rem_6rem] px-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
          <span>Lender</span>
          <span className="text-right">Rate</span>
          <span className="text-right">EMI / mo</span>
        </div>
        <ul className="relative mt-2 space-y-1.5" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {offers.map((offer, i) => (
              <motion.li
                key={offer.partner.slug}
                layout
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
                className={cn(
                  "grid grid-cols-[1fr_4.5rem_6rem] items-center rounded-xl px-2 py-2",
                  i === 0 ? "bg-saffron-soft" : "bg-transparent",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <PartnerMark partner={offer.partner} size="sm" className="min-w-0 [&>span:last-child]:truncate" />
                </span>
                <span className="text-right text-sm font-semibold text-ink tabular">{offer.rate.toFixed(2)}%</span>
                <span className="text-right text-sm text-ink-soft tabular">{formatINR(offer.emi)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <Link
        href={`/apply?type=${product}&amount=${amount}`}
        className="group mt-5 flex items-center justify-between rounded-xl bg-ink px-4 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-[color-mix(in_oklab,var(--ink)_85%,var(--saffron))]"
      >
        Get these offers checked for you
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </Link>
      <p className="mt-3 text-[0.68rem] leading-snug text-muted">
        Illustrative rates. Your final rate depends on credit score, income and the lender&apos;s policy.
      </p>
    </div>
  );
}
