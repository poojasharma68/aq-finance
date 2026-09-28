"use client";

import { useEffect, useId, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { loans } from "@/data/loans";
import { formatINR, loanSummary } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/button";
import { EASE, Reveal } from "@/components/motion";
import { LoanIcon } from "@/components/ui";

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
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
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
            className="h-8 w-24 bg-transparent text-right font-semibold text-ink tabular outline-none"
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
        className="range mt-2.5"
        style={{ "--fill": `${fill}%` }}
      />
      <div className="flex justify-between text-xs text-muted tabular">
        <span>{format(limit.min)}</span>
        <span>{format(limit.max)}</span>
      </div>
    </div>
  );
}

/** One line of the result panel: label on the left, amount on the right. */
function ResultRow({ label, value, dot }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="flex items-center gap-2.5 text-sm text-ink-soft">
        {dot && <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ backgroundColor: dot }} />}
        {label}
      </dt>
      <dd className="font-semibold text-ink tabular">{formatINR(value)}</dd>
    </div>
  );
}

export function EmiCalculator() {
  const [loanType, setLoanType] = useState("personal");
  const [amount, setAmount] = useState(5_00_000);
  const [rate, setRate] = useState(10.49);
  const [months, setMonths] = useState(36);

  const { emi, totalInterest, totalPayable } = loanSummary(amount, rate, months);
  const principalShare = totalPayable > 0 ? amount / totalPayable : 1;

  function applyPreset(slug) {
    const loan = loans.find((l) => l.slug === slug);
    setLoanType(slug);
    setAmount(loan.example.amount);
    setRate(loan.rateFrom);
    setMonths(loan.example.months);
  }

  return (
    <section id="emi-calculator" className="relative border-t border-line bg-surface-2/50 section-y">
      <div className="shell">
        <Reveal className="text-center">
          <h2 className="font-display text-[clamp(1.9rem,3.8vw,2.75rem)] leading-[1.06] tracking-tight text-ink">
            Simplify financial planning with <em className="text-saffron-ink">the right tools.</em>
          </h2>
          <p className="mt-3 text-ink-soft">Flexible EMIs to address your needs.</p>
        </Reveal>

        {/* product presets — the look of tabs, the semantics of a button group */}
        <Reveal delay={0.08}>
          <div
            role="group"
            aria-label="Start from a loan type"
            className="mt-7 flex gap-1 overflow-x-auto border-b border-line pb-px md:justify-center scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {loans.map((loan) => {
              const active = loanType === loan.slug;
              return (
                <button
                  key={loan.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => applyPreset(loan.slug)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 whitespace-nowrap px-3.5 pb-3 pt-1.5 text-[0.86rem] font-semibold transition-colors",
                    active ? "text-saffron-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  <LoanIcon name={loan.icon} className="size-4" />
                  {loan.shortName}
                  {active && (
                    <motion.span
                      layoutId="emi-preset-underline"
                      aria-hidden="true"
                      className="absolute inset-x-1.5 -bottom-px h-0.5 rounded-full bg-saffron"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* inputs */}
          <div className="rounded-[1.25rem] border border-line bg-surface p-5 sm:p-6">
            {/* spread the three fields so this card fills the same height as
                the result card beside it */}
            <div className="flex h-full flex-col justify-between gap-5">
              <SliderField
                label="Loan Amount"
                value={amount}
                display={amount.toLocaleString("en-IN")}
                onChange={setAmount}
                limit={limits.amount}
                prefix="₹"
                format={(v) => `₹${v.toLocaleString("en-IN")}`}
                parse={(v) => Number.parseInt(v.replace(/[^\d]/g, ""), 10)}
              />
              <SliderField
                label="Loan Tenure"
                value={months}
                display={String(months)}
                onChange={setMonths}
                limit={limits.months}
                suffix="months"
                format={(v) => (v >= 12 ? `${v / 12} years` : `${v} months`)}
                parse={(v) => Number.parseInt(v, 10)}
              />
              <SliderField
                label="Interest Rate"
                value={rate}
                display={rate.toFixed(2)}
                onChange={setRate}
                limit={limits.rate}
                suffix="%"
                format={(v) => `${v.toFixed(2)}% PA`}
                parse={(v) => Number.parseFloat(v)}
              />
            </div>
          </div>

          {/* result */}
          <div className="flex flex-col rounded-[1.25rem] border border-line bg-surface p-5 sm:p-6">
            {/* the EMI figure, with a saffron glow drifting behind it */}
            <div className="relative isolate overflow-hidden rounded-2xl border border-saffron/25 bg-saffron-soft/60 px-5 py-5 text-center">
              <span
                aria-hidden="true"
                className="animate-emi-glow pointer-events-none absolute -inset-y-full left-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_center,var(--saffron),transparent_68%)] opacity-55"
              />
              <p className="text-sm font-medium text-saffron-ink">Your Monthly EMI will be</p>
              <p className="mt-1.5 figure text-[clamp(2rem,4vw,2.6rem)] leading-none text-ink" aria-live="polite">
                <AnimatedAmount value={emi} />
              </p>
            </div>

            {/* how the total splits — principal against interest */}
            <div
              className="mt-5 flex h-2 w-full gap-0.5"
              role="img"
              aria-label={`Principal is ${Math.round(principalShare * 100)}% of what you repay, interest ${Math.round((1 - principalShare) * 100)}%`}
            >
              <span
                className="h-full rounded-l-full transition-[flex-grow] duration-500 ease-out-quint"
                style={{ flexGrow: Math.max(principalShare, 0.001), backgroundColor: "var(--chart-principal)" }}
              />
              <span
                className="h-full rounded-r-full transition-[flex-grow] duration-500 ease-out-quint"
                style={{ flexGrow: Math.max(1 - principalShare, 0.001), backgroundColor: "var(--chart-interest)" }}
              />
            </div>

            <dl className="mt-3">
              <ResultRow label="Amount Payable" value={totalPayable} />
              <ResultRow label="Interest Amount" value={totalInterest} dot="var(--chart-interest)" />
              <ResultRow label="Principal Amount" value={amount} dot="var(--chart-principal)" />
            </dl>

            <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
              <ButtonLink href={`/apply?type=${loanType}&amount=${amount}`} arrow className="flex-1 justify-center">
                Apply Now
              </ButtonLink>
              <ButtonLink href={`/loans?type=${loanType}`} variant="outline" arrow className="flex-1 justify-center">
                Know More
              </ButtonLink>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Indicative only — excludes processing fee, GST and insurance.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
