"use client";

import { useEffect, useId, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { loans } from "@/data/loans";
import { formatCompactINR, formatINR, loanSummary } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/button";
import { EASE, Reveal } from "@/components/motion";
import { SectionLabel } from "@/components/ui";

const limits = {
  amount: { min: 50_000, max: 2_00_00_000, step: 50_000 },
  rate: { min: 7, max: 24, step: 0.05 },
  months: { min: 6, max: 360, step: 6 },
};

const clamp = (value, { min, max }) => Math.min(max, Math.max(min, value));

function AnimatedAmount({ value, className }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => formatINR(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: EASE });
    return () => controls.stop();
  }, [mv, value]);
  return <motion.span className={cn("tabular", className)}>{text}</motion.span>;
}

function SliderField({ label, value, display, onChange, limit, prefix, suffix, format, parse }) {
  const id = useId();
  const [draft, setDraft] = useState(null);
  const fill = ((value - limit.min) / (limit.max - limit.min)) * 100;

  function commit() {
    if (draft === null) return;
    const parsed = parse(draft);
    if (!Number.isNaN(parsed)) onChange(clamp(parsed, limit));
    setDraft(null);
  }

  return (
    <div className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
        <div className="flex items-center rounded-lg border border-line-strong bg-surface px-3 focus-within:border-saffron">
          {prefix && <span className="pr-1.5 text-sm text-muted">{prefix}</span>}
          <input
            aria-label={`${label} value`}
            inputMode="decimal"
            value={draft ?? display}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="h-9 w-28 bg-transparent text-right font-semibold text-ink tabular outline-none"
          />
          {suffix && <span className="pl-1.5 text-sm text-muted">{suffix}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={limit.min}
        max={limit.max}
        step={limit.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-4"
        style={{ "--fill": `${fill}%` }}
      />
      <div className="mt-1 flex justify-between text-xs text-muted tabular">
        <span>{format(limit.min)}</span>
        <span>{format(limit.max)}</span>
      </div>
    </div>
  );
}

export function EmiCalculator() {
  const [loanType, setLoanType] = useState("personal");
  const [amount, setAmount] = useState(5_00_000);
  const [rate, setRate] = useState(10.49);
  const [months, setMonths] = useState(36);
  const [hovered, setHovered] = useState(null);

  const { emi, totalInterest, totalPayable } = loanSummary(amount, rate, months);
  const principalShare = totalPayable > 0 ? amount / totalPayable : 1;
  const interestShare = 1 - principalShare;

  function applyPreset(slug) {
    const loan = loans.find((l) => l.slug === slug);
    setLoanType(slug);
    setAmount(loan.example.amount);
    setRate(loan.rateFrom);
    setMonths(loan.example.months);
  }

  const segments = [
    { key: "principal", label: "Principal", value: amount, share: principalShare, color: "var(--chart-principal)" },
    { key: "interest", label: "Total interest", value: totalInterest, share: interestShare, color: "var(--chart-interest)" },
  ];

  return (
    <section id="emi-calculator" className="relative border-t border-line bg-surface-2/60 py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel index="02">EMI calculator</SectionLabel>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.02] tracking-tight text-ink">
              Know the monthly number <em className="text-saffron-ink">before you apply.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:pb-2">
            <p className="text-ink-soft">
              Start from a product&apos;s typical terms, then drag or type your own. The split shows how much of what you
              repay is interest.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-12 grid overflow-hidden rounded-[1.5rem] border border-line bg-surface lg:grid-cols-12">
          {/* inputs */}
          <div className="p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <div className="flex flex-wrap gap-2 pb-6" role="group" aria-label="Start from a loan type">
              {loans.map((loan) => (
                <button
                  key={loan.slug}
                  type="button"
                  aria-pressed={loanType === loan.slug}
                  onClick={() => applyPreset(loan.slug)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors",
                    loanType === loan.slug
                      ? "border-ink bg-ink text-bg"
                      : "border-line-strong text-ink-soft hover:border-ink hover:text-ink",
                  )}
                >
                  {loan.shortName}
                </button>
              ))}
            </div>

            <SliderField
              label="Loan amount"
              value={amount}
              display={amount.toLocaleString("en-IN")}
              onChange={setAmount}
              limit={limits.amount}
              prefix="₹"
              format={formatCompactINR}
              parse={(v) => Number(v.replace(/[^\d]/g, ""))}
            />
            <SliderField
              label="Interest rate"
              value={rate}
              display={rate.toFixed(2)}
              onChange={(v) => setRate(Math.round(v * 100) / 100)}
              limit={limits.rate}
              suffix="% p.a."
              format={(v) => `${v}%`}
              parse={(v) => Number.parseFloat(v)}
            />
            <SliderField
              label="Tenure"
              value={months}
              display={String(months)}
              onChange={(v) => setMonths(Math.round(v))}
              limit={limits.months}
              suffix="months"
              format={(v) => (v >= 12 ? `${v / 12} yr` : `${v} mo`)}
              parse={(v) => Number.parseInt(v, 10)}
            />
          </div>

          {/* results */}
          <div className="flex flex-col border-t border-line bg-bg/60 p-6 sm:p-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-sm text-muted">Monthly EMI</p>
            <p className="mt-2 figure text-[clamp(2.8rem,6vw,4rem)] leading-none text-ink" aria-live="polite">
              <AnimatedAmount value={emi} />
            </p>
            <p className="mt-2 text-sm text-muted tabular">
              for {months} months ({(months / 12).toFixed(months % 12 ? 1 : 0)} yrs) at {rate.toFixed(2)}%
            </p>

            {/* principal vs interest — two-part stacked bar */}
            <div className="relative mt-10">
              <div className="flex h-3.5 w-full gap-[2px]" role="img" aria-label={`Principal ${Math.round(principalShare * 100)}%, interest ${Math.round(interestShare * 100)}%`}>
                {segments.map((s, i) => (
                  <motion.div
                    key={s.key}
                    className={cn("relative h-full", i === 0 ? "rounded-l-[4px]" : "rounded-r-[4px]")}
                    style={{ backgroundColor: s.color }}
                    initial={false}
                    animate={{ flexGrow: Math.max(s.share, 0.001), opacity: hovered && hovered !== s.key ? 0.45 : 1 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    onPointerEnter={() => setHovered(s.key)}
                    onPointerLeave={() => setHovered(null)}
                  >
                    {/* generous hit area */}
                    <span className="absolute -inset-y-3 inset-x-0" />
                    {hovered === s.key && (
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg">
                        <span className="block text-muted">{s.label}</span>
                        <span className="block font-semibold text-ink tabular">
                          {formatINR(s.value)} · {Math.round(s.share * 100)}%
                        </span>
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                {segments.map((s) => (
                  <div key={s.key} className="flex items-center justify-between gap-4">
                    <dt className="flex items-center gap-2.5 text-ink-soft">
                      <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ backgroundColor: s.color }} />
                      {s.label}
                      <span className="text-muted tabular">{Math.round(s.share * 100)}%</span>
                    </dt>
                    <dd className="font-semibold text-ink tabular">{formatINR(s.value)}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
                  <dt className="font-semibold text-ink">Total payable</dt>
                  <dd className="font-semibold text-ink tabular">{formatINR(totalPayable)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-auto pt-10">
              <ButtonLink href={`/apply?type=${loanType}&amount=${amount}`} size="lg" arrow className="w-full">
                Apply for {formatCompactINR(amount)}
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-muted">
                Excludes processing fee, GST and insurance, if any.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
