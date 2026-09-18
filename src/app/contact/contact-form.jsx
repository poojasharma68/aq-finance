"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { contactSchema, contactTopics } from "@/lib/schemas";
import { Button } from "@/components/button";
import { Field, fieldAria } from "@/components/form-parts";
import { EASE } from "@/components/motion";

const defaults = { name: "", phone: "", email: "", topic: "", message: "", website: "" };

export function ContactForm() {
  const [sent, setSent] = useState(null);
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema), mode: "onTouched", defaultValues: defaults });

  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  async function onSubmit(data) {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) {
        Object.entries(payload.fieldErrors ?? {}).forEach(([name, messages]) =>
          setError(name, { type: "server", message: messages[0] }),
        );
        setServerError(payload.message ?? "Something went wrong. Please try again.");
        return;
      }
      setSent({ reference: payload.reference, name: data.name.split(" ")[0] });
      reset(defaults);
    } catch {
      setServerError("Network problem — please check your connection and try again.");
    }
  }

  return (
    <div className="relative rounded-[1.5rem] border border-line bg-surface p-6 sm:p-8 md:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[28rem] flex-col items-start justify-center"
          >
            <CircleCheck className="size-12 text-saffron" strokeWidth={1.4} aria-hidden="true" />
            <h2 className="mt-6 font-display text-4xl text-ink">Message received, {sent.name}.</h2>
            <p className="mt-3 max-w-md text-ink-soft">
              We reply to most messages the same working day. Keep this reference handy if you call us:
            </p>
            <p className="mt-5 rounded-xl border border-dashed border-saffron px-5 py-3 figure text-2xl text-ink tabular">
              {sent.reference}
            </p>
            <Button variant="outline" className="mt-8" onClick={() => setSent(null)}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="font-display text-[2rem] leading-tight text-ink">Send us a message</h2>
            <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field id="c-name" label="Your name" required error={errors.name}>
                <input className="field" autoComplete="name" {...fieldAria("c-name", errors.name)} {...register("name")} />
              </Field>
              <Field id="c-phone" label="Mobile number" required error={errors.phone}>
                <input
                  className="field"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit number"
                  {...fieldAria("c-phone", errors.phone)}
                  {...register("phone", {
                    onChange: (e) => setValue("phone", e.target.value.replace(/\D/g, "").slice(0, 10)),
                  })}
                />
              </Field>
              <Field id="c-email" label="Email" required error={errors.email}>
                <input className="field" type="email" autoComplete="email" {...fieldAria("c-email", errors.email)} {...register("email")} />
              </Field>
              <Field id="c-topic" label="What's this about?" required error={errors.topic}>
                <select className="field" {...fieldAria("c-topic", errors.topic)} {...register("topic")}>
                  <option value="">Choose a topic</option>
                  {contactTopics.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="c-message" label="Message" required error={errors.message} className="sm:col-span-2">
                <textarea
                  className="field"
                  rows={5}
                  placeholder="A few lines about what you need…"
                  {...fieldAria("c-message", errors.message)}
                  {...register("message")}
                />
                <p className="mt-1 text-right text-xs text-muted tabular">{messageLength}/1200</p>
              </Field>
            </div>

            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>

            {serverError && (
              <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {serverError}
              </p>
            )}

            <Button type="submit" size="lg" arrow={!isSubmitting} disabled={isSubmitting} className="mt-8 w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                "Send message"
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
