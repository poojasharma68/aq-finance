"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { Check, CircleAlert, LoaderCircle, Lock, Phone } from "lucide-react";
import { amountRanges, amountToRange, loans, salaryRanges, turnoverRanges } from "@/data/loans";
import { brand, contact } from "@/data/site";
import {
  applicationDefaults,
  applicationSchema,
  contactModes,
  employmentTypes,
  genders,
} from "@/lib/schemas";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/button";
import { ChoicePills, Field, FormSection, fieldAria } from "@/components/form-parts";
import { EASE } from "@/components/motion";
import { LoanIcon } from "@/components/ui";

function sectionsFor(values) {
  const employment =
    values.employmentType === "self-employed"
      ? ["employmentType", "businessName", "annualTurnover"]
      : ["employmentType", "companyName", "monthlySalary"];
  return [
    { title: "Loan requirement", fields: ["loanType", "amountRange", "purpose"] },
    { title: "Personal details", fields: ["fullName", "mobile", "email", "dob", "gender"] },
    { title: "Employment & income", fields: employment },
    { title: "Contact preferences", fields: ["city", "pincode", "contactMode", "consent"] },
  ];
}

function isFilled(name, value) {
  if (name === "mobile") return /^[6-9]\d{9}$/.test(value);
  if (name === "pincode") return /^[1-9]\d{5}$/.test(value);
  if (name === "email") return /.+@.+\..+/.test(value);
  if (name === "consent") return value === true;
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function ApplyForm({ initialType, initialAmount }) {
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: {
      ...applicationDefaults,
      loanType: loans.some((l) => l.slug === initialType) ? initialType : "",
      amountRange: initialAmount ? amountToRange(initialAmount) : "",
    },
  });

  const values = useWatch({ control });
  const sections = sectionsFor(values);
  const totalFields = sections.reduce((sum, s) => sum + s.fields.length, 0);
  const doneFields = sections.reduce((sum, s) => sum + s.fields.filter((f) => isFilled(f, values[f])).length, 0);
  const progress = Math.round((doneFields / totalFields) * 100);

  const selectedLoan = loans.find((l) => l.slug === values.loanType);
  const isSelfEmployed = values.employmentType === "self-employed";

  async function onSubmit(data) {
    setServerError(null);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload.fieldErrors) {
          Object.entries(payload.fieldErrors).forEach(([name, messages]) =>
            setError(name, { type: "server", message: messages[0] }, { shouldFocus: true }),
          );
        }
        setServerError(payload.message ?? "We couldn't submit your application. Please try again.");
        return;
      }

      setResult({ data });
      requestAnimationFrame(() =>
        document.getElementById("application")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch {
      setServerError("Network problem — check your connection and try again. Nothing was lost.");
    }
  }

  if (result) {
    return (
      <SuccessPanel
        result={result}
        onReset={() => {
          reset(applicationDefaults);
          setResult(null);
        }}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[1.5rem] border border-line bg-surface p-6 sm:p-8 md:p-10 lg:col-span-8"
      >
        {/* compact progress for small screens */}
        <div className="mb-8 lg:hidden">
          <div className="flex justify-between text-xs font-semibold text-muted">
            <span>Application progress</span>
            <span className="tabular text-ink">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <motion.div className="h-full rounded-full bg-saffron" animate={{ width: `${progress}%` }} transition={{ ease: EASE }} />
          </div>
        </div>

        <div className="space-y-10">
          <FormSection index="01" title="Loan requirement" description="Pick the product and a rough amount — you can change it on the call.">
            <div role="radiogroup" aria-label="Loan type" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {loans.map((loan) => (
                <label
                  key={loan.slug}
                  className={cn(
                    "group relative flex min-h-12 cursor-pointer items-center gap-2.5 rounded-[0.65rem] border bg-surface px-3 py-2 transition-colors last:col-span-full",
                    "hover:border-ink/40 has-[:checked]:border-saffron has-[:checked]:bg-saffron-soft",
                    "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-saffron/25",
                    errors.loanType ? "border-danger" : "border-line-strong",
                  )}
                >
                  <input
                    type="radio"
                    value={loan.slug}
                    className="sr-only"
                    {...register("loanType", {
                      onChange: (e) => {
                        const next = loans.find((l) => l.slug === e.target.value);
                        if (next && !next.purposes.includes(getValues("purpose"))) setValue("purpose", "");
                      },
                    })}
                  />
                  <LoanIcon name={loan.icon} className="size-4 text-saffron-ink group-has-[:checked]:hidden" />
                  <span className="hidden size-4 place-items-center rounded-full bg-saffron text-on-saffron group-has-[:checked]:grid">
                    <Check className="size-2.5" strokeWidth={3.5} aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-semibold leading-tight text-ink-soft group-has-[:checked]:text-ink">
                    {loan.shortName}
                  </span>
                  <span className="shrink-0 text-xs text-muted tabular">{loan.rateFrom}%</span>
                </label>
              ))}
            </div>
            <Field id="loanType" error={errors.loanType} className="-mt-1" />

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field id="amountRange" label="Loan amount required" required error={errors.amountRange}>
                <select className="field" {...fieldAria("amountRange", errors.amountRange)} {...register("amountRange")}>
                  <option value="">Select amount range</option>
                  {amountRanges.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                id="purpose"
                label="Purpose of loan"
                required
                error={errors.purpose}
                hint={selectedLoan ? undefined : "Choose a loan type first"}
              >
                <select
                  className="field"
                  disabled={!selectedLoan}
                  {...fieldAria("purpose", errors.purpose, !selectedLoan)}
                  {...register("purpose")}
                >
                  <option value="">Select purpose</option>
                  {selectedLoan?.purposes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection index="02" title="Personal details" description="As they appear on your PAN card.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="fullName" label="Full name" required error={errors.fullName} className="sm:col-span-2">
                <input
                  className="field"
                  autoComplete="name"
                  placeholder="e.g. Priya Raghavan"
                  {...fieldAria("fullName", errors.fullName)}
                  {...register("fullName")}
                />
              </Field>
              <Field id="mobile" label="Mobile number" required error={errors.mobile}>
                <div className="flex">
                  <span className="grid h-12 place-items-center rounded-l-[0.65rem] border border-r-0 border-line-strong bg-surface-2 px-3.5 text-sm font-semibold text-ink-soft">
                    +91
                  </span>
                  <input
                    className="field rounded-l-none"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="10-digit number"
                    {...fieldAria("mobile", errors.mobile)}
                    {...register("mobile", {
                      onChange: (e) => setValue("mobile", e.target.value.replace(/\D/g, "").slice(0, 10)),
                    })}
                  />
                </div>
              </Field>
              <Field id="email" label="Email address" required error={errors.email}>
                <input
                  className="field"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...fieldAria("email", errors.email)}
                  {...register("email")}
                />
              </Field>
              <Field id="dob" label="Date of birth" required error={errors.dob}>
                <input className="field" type="date" min="1950-01-01" {...fieldAria("dob", errors.dob)} {...register("dob")} />
              </Field>
              <Field id="gender" label="Gender" required error={errors.gender}>
                <select className="field" {...fieldAria("gender", errors.gender)} {...register("gender")}>
                  <option value="">Select gender</option>
                  {genders.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="pan" label="PAN" error={errors.pan} hint="Speeds up the lender's eligibility check.">
                <input
                  className="field uppercase placeholder:normal-case"
                  maxLength={10}
                  autoComplete="off"
                  placeholder="ABCDE1234F"
                  {...fieldAria("pan", errors.pan, true)}
                  {...register("pan")}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection index="03" title="Employment & income" description="Lenders price loans largely on income stability.">
            <div className="max-w-sm">
              <ChoicePills name="employmentType" options={employmentTypes} register={register} error={errors.employmentType} columns={2} />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isSelfEmployed ? "self" : "salaried"}
                initial={{ opacity: 0, x: isSelfEmployed ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSelfEmployed ? -24 : 24 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-5 grid gap-5 sm:grid-cols-2"
              >
                {isSelfEmployed ? (
                  <>
                    <Field id="businessName" label="Business or practice name" required error={errors.businessName}>
                      <input
                        className="field"
                        autoComplete="organization"
                        placeholder="Registered name"
                        {...fieldAria("businessName", errors.businessName)}
                        {...register("businessName")}
                      />
                    </Field>
                    <Field id="annualTurnover" label="Annual turnover" required error={errors.annualTurnover}>
                      <select className="field" {...fieldAria("annualTurnover", errors.annualTurnover)} {...register("annualTurnover")}>
                        <option value="">Select turnover</option>
                        {turnoverRanges.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </>
                ) : (
                  <>
                    <Field id="companyName" label="Company name" required error={errors.companyName}>
                      <input
                        className="field"
                        autoComplete="organization"
                        placeholder="Your current employer"
                        {...fieldAria("companyName", errors.companyName)}
                        {...register("companyName")}
                      />
                    </Field>
                    <Field id="monthlySalary" label="Monthly salary (in hand)" required error={errors.monthlySalary}>
                      <select className="field" {...fieldAria("monthlySalary", errors.monthlySalary)} {...register("monthlySalary")}>
                        <option value="">Select salary range</option>
                        {salaryRanges.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field
                      id="workEmail"
                      label="Work email"
                      error={errors.workEmail}
                      hint="Some banks offer better rates when they can verify your employer."
                      className="sm:col-span-2"
                    >
                      <input
                        className="field"
                        type="email"
                        placeholder="name@company.com"
                        {...fieldAria("workEmail", errors.workEmail, true)}
                        {...register("workEmail")}
                      />
                    </Field>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </FormSection>

          <FormSection index="04" title="Contact preferences">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="city" label="City / State" required error={errors.city}>
                <input
                  className="field"
                  autoComplete="address-level2"
                  placeholder="e.g. Indore, Madhya Pradesh"
                  {...fieldAria("city", errors.city)}
                  {...register("city")}
                />
              </Field>
              <Field id="pincode" label="PIN code" required error={errors.pincode}>
                <input
                  className="field"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="6 digits"
                  {...fieldAria("pincode", errors.pincode)}
                  {...register("pincode", {
                    onChange: (e) => setValue("pincode", e.target.value.replace(/\D/g, "").slice(0, 6)),
                  })}
                />
              </Field>
              <div className="sm:col-span-2">
                <p className="field-label">
                  Preferred contact mode<span className="req" aria-hidden="true">*</span>
                </p>
                <div className="max-w-md">
                  <ChoicePills name="contactMode" options={contactModes} register={register} error={errors.contactMode} />
                </div>
                <Field id="contactMode" error={errors.contactMode} />
              </div>
            </div>

            <div className="mt-7">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-[var(--saffron)]"
                  {...fieldAria("consent", errors.consent)}
                  {...register("consent")}
                />
                <span>
                  I agree to the{" "}
                  <Link href="/contact" className="font-semibold text-ink underline decoration-saffron underline-offset-2">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/contact" className="font-semibold text-ink underline decoration-saffron underline-offset-2">
                    Privacy Policy
                  </Link>
                  , and authorise {brand.short} and its lending partners to contact me about this application, overriding
                  DND.
                </span>
              </label>
              <Field id="consent" error={errors.consent} className="pl-7" />
            </div>
          </FormSection>
        </div>

        {/* honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {serverError}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-10 flex flex-col-reverse items-stretch gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            Encrypted and shared only with the lender you choose.
          </p>
          <Button type="submit" size="lg" arrow={!isSubmitting} disabled={isSubmitting} className="sm:min-w-56">
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                Submitting…
              </>
            ) : (
              "Submit application"
            )}
          </Button>
        </div>
      </form>

      <aside className="lg:col-span-4">
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[1.25rem] border border-line bg-surface p-6">
            <div className="flex items-end justify-between">
              <p className="text-sm font-semibold text-ink">Your application</p>
              <p className="figure text-3xl leading-none text-ink tabular">{progress}%</p>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <motion.div className="h-full rounded-full bg-saffron" animate={{ width: `${progress}%` }} transition={{ ease: EASE }} />
            </div>
            <ol className="mt-6 space-y-3.5">
              {sections.map((section, i) => {
                const done = section.fields.filter((f) => isFilled(f, values[f])).length;
                const complete = done === section.fields.length;
                return (
                  <li key={section.title} className="flex items-center gap-3 text-sm">
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full border text-[0.7rem] font-bold tabular transition-colors",
                        complete ? "border-saffron bg-saffron text-on-saffron" : "border-line-strong text-muted",
                      )}
                    >
                      {complete ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : i + 1}
                    </span>
                    <span className={complete ? "text-ink" : "text-ink-soft"}>{section.title}</span>
                    <span className="ml-auto text-xs text-muted tabular">
                      {done}/{section.fields.length}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-[1.25rem] bg-navy p-6 text-on-navy">
            <p className="eyebrow text-saffron!">After you submit</p>
            <ol className="mt-4 space-y-4 text-sm">
              {[
                ["Shortlist of offers", "Two or three lenders, with rate, fee and tenure side by side."],
                ["Documents", "Upload from your phone or book a doorstep pickup."],
              ].map(([title, body]) => (
                <li key={title} className="border-l border-saffron/50 pl-4">
                  <p className="font-semibold">{title}</p>
                  <p className="text-on-navy-muted">{body}</p>
                </li>
              ))}
            </ol>
          </div>

          <a
            href={contact.phoneHref}
            className="group flex items-center gap-4 rounded-[1.25rem] border border-line p-5 transition-colors hover:border-saffron"
          >
            <span className="grid size-11 place-items-center rounded-full bg-saffron-soft text-saffron-ink">
              <Phone className="size-4.5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs text-muted">Prefer to talk it through?</span>
              <span className="block figure text-xl text-ink">{contact.phone}</span>
            </span>
          </a>
        </div>
      </aside>
    </div>
  );
}

function SuccessPanel({ result, onReset }) {
  const { data } = result;
  const loan = loans.find((l) => l.slug === data.loanType);
  const amount = amountRanges.find((a) => a.value === data.amountRange);
  const channel = { call: "phone", whatsapp: "WhatsApp", email: "email" }[data.contactMode];
  const firstName = data.fullName.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mx-auto max-w-3xl rounded-[1.75rem] border border-line bg-surface p-8 text-center sm:p-12"
    >
      <svg viewBox="0 0 80 80" className="mx-auto size-20" aria-hidden="true">
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="var(--saffron)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <motion.path
          d="M25 41.5 35 51l20-22"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
        />
      </svg>

      <h2 className="mt-8 heading-1 text-ink">
        Thank you, {firstName}. <em className="text-saffron-ink">We&apos;re on it.</em>
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-ink-soft">
        Your application has been received. An advisor will reach you by {channel} within 30
        minutes.
      </p>

      <dl className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line text-left text-sm sm:grid-cols-3">
        {[
          ["Loan", loan?.name],
          ["Amount", amount?.label],
          ["Purpose", data.purpose],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface p-4">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/loans" variant="outline" arrow>
          Read about your loan
        </ButtonLink>
        <Button variant="primary" onClick={onReset}>
          Submit another application
        </Button>
      </div>
    </motion.div>
  );
}
