"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export function Field({ id, label, required, error, hint, className, children }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
          {required ? (
            <span className="req" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>
          )}
        </label>
      )}
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 overflow-hidden pt-1.5 text-xs font-medium text-danger"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {error.message}
          </motion.p>
        ) : hint ? (
          <p key="hint" id={`${id}-hint`} className="pt-1.5 text-xs text-muted">
            {hint}
          </p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** aria props for an input registered with react-hook-form */
export function fieldAria(id, error, hint) {
  return {
    id,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}

export function FormSection({ index, title, description, children, className }) {
  return (
    <fieldset className={cn("border-t border-line pt-8 first:border-t-0 first:pt-0", className)}>
      <legend className="float-left mb-6 w-full">
        <span className="flex items-baseline gap-3">
          <span className="figure text-lg text-saffron-ink tabular">{index}</span>
          <span className="heading-3 text-ink">{title}</span>
        </span>
        {description && <span className="mt-1 block text-sm text-muted">{description}</span>}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export function ChoicePills({ name, options, register, error, columns = 3 }) {
  return (
    <div
      role="radiogroup"
      className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "grid-cols-3")}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${name}-error` : undefined}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[0.65rem] border bg-surface text-sm font-semibold text-ink-soft transition-colors",
            "hover:border-ink/40 has-[:checked]:border-saffron has-[:checked]:bg-saffron-soft has-[:checked]:text-ink",
            "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-saffron/25",
            error ? "border-danger" : "border-line-strong",
          )}
        >
          <input type="radio" value={option.value} className="sr-only" {...register(name)} />
          {option.label}
        </label>
      ))}
    </div>
  );
}
