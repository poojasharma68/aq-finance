"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { founder, promises } from "@/data/team";
import { CountUp, EASE, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionLabel } from "@/components/ui";
import { cn } from "@/lib/cn";

function initialsOf(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

/** A person's photo, or their initials on a warm tile when there isn't one yet. */
function Portrait({ person, className, sizes, initialsClassName, priority = false }) {
  return (
    <div className={cn("relative overflow-hidden bg-saffron-soft", className)}>
      {person.photo ? (
        <Image src={person.photo} alt={person.name} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 grid place-items-center font-semibold tracking-tight text-saffron-ink",
            initialsClassName,
          )}
        >
          {initialsOf(person.name)}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function FounderSpotlight() {
  return (
    <section className="py-16 md:py-24">
      <div className="shell">
        <SectionLabel index="01">Meet our founder</SectionLabel>

        <div className="mt-10 grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* portrait */}
          <Reveal className="relative mx-auto w-full max-w-[20rem] sm:max-w-88 lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-4/5">
              {/* offset saffron block behind the photo for depth */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-saffron-soft md:translate-x-5 md:translate-y-5"
              />
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0 round 1.5rem)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0 round 1.5rem)" }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 1.1, ease: EASE }}
                className="absolute inset-0"
              >
                <Portrait
                  person={founder}
                  sizes="(min-width: 1024px) 40vw, 352px"
                  priority
                  className="size-full rounded-3xl"
                  initialsClassName="text-7xl"
                />
                <div className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-linear-to-t from-black/75 via-black/30 to-transparent p-5 pt-16 text-white">
                  <p className="text-lg font-semibold leading-tight">{founder.name}</p>
                  <p className="text-sm opacity-85">{founder.role}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
                className="absolute -left-3 top-6 rounded-xl bg-navy px-4 py-2.5 text-on-navy shadow-[0_16px_32px_-16px_rgb(4_35_76/0.6)] md:-left-5"
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-saffron">Founded</p>
                <p className="figure text-2xl leading-none tabular">{founder.since}</p>
              </motion.div>
            </div>
          </Reveal>

          {/* story */}
          <div className="lg:col-span-7">
            <Reveal>
              <Quote className="size-8 text-saffron" aria-hidden="true" />
              <blockquote className="mt-4 heading-quote text-ink">&ldquo;{founder.quote}&rdquo;</blockquote>
            </Reveal>

            <Reveal delay={0.12} className="mt-7 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-saffron" />
              <div>
                <p className="heading-4 text-ink">{founder.name}</p>
                <p className="text-sm text-muted">{founder.role}</p>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-7 max-w-2xl space-y-4 leading-relaxed text-ink-soft">
              {founder.bio.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </Reveal>

            <Stagger className="mt-9 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {founder.highlights.map((h) => (
                <StaggerItem key={h.label} className="bg-surface px-4 py-4 md:px-5">
                  <CountUp
                    value={h.value}
                    suffix={h.suffix}
                    className="figure text-2xl leading-none text-ink md:text-3xl"
                  />
                  <p className="mt-2 text-xs text-muted">{h.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function FounderPromise() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy px-6 py-12 text-on-navy dark:ring-1 dark:ring-white/10 sm:px-10 md:px-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-saffron">
                <span aria-hidden="true" className="h-px w-8 bg-saffron" />
                02 · The promise
              </p>
              <Reveal as="h2" className="heading-2 mt-5">
                What we promise <em className="text-saffron">every customer.</em>
              </Reveal>
              <Reveal delay={0.1} as="p" className="mt-5 text-on-navy-muted">
                The firm was built on a few simple rules. Every file we handle is held to them.
              </Reveal>
              <Reveal delay={0.15} className="mt-8 flex items-center gap-3">
                <Portrait
                  person={founder}
                  sizes="48px"
                  className="size-12 shrink-0 rounded-full ring-2 ring-saffron"
                  initialsClassName="text-base"
                />
                <div>
                  <p className="font-semibold leading-tight">{founder.name}</p>
                  <p className="text-sm text-on-navy-muted">{founder.role}</p>
                </div>
              </Reveal>
            </div>

            <Stagger as="ol" stagger={0.08} className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:col-span-8">
              {promises.map((p, i) => (
                <StaggerItem as="li" key={p.title} className="bg-navy p-6 md:p-7">
                  <p className="figure text-sm text-saffron tabular">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="heading-4 mt-3">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-navy-muted">{p.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
