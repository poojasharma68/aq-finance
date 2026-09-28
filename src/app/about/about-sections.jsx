"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Languages, Quote } from "lucide-react";
import { founder, milestones, team } from "@/data/team";
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
function Portrait({ person, className, sizes, initialsClassName }) {
  return (
    <div className={cn("relative overflow-hidden bg-saffron-soft", className)}>
      {person.photo ? (
        <Image src={person.photo} alt={person.name} fill sizes={sizes} className="object-cover" />
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
    <section className="py-14 md:py-20">
      <div className="shell">
        <SectionLabel index="01">Meet our founder</SectionLabel>

        <div className="mt-8 grid items-center gap-10 md:grid-cols-12 md:gap-12">
          {/* portrait */}
          <Reveal className="relative mx-auto w-full max-w-[16rem] md:col-span-4 md:max-w-[18rem]">
            <div className="relative aspect-[4/5]">
              <motion.div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[1.75rem] border border-dashed border-saffron/50"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0 round 1.25rem)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0 round 1.25rem)" }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 1.1, ease: EASE }}
                className="absolute inset-0"
              >
                <Portrait
                  person={founder}
                  sizes="288px"
                  className="size-full rounded-[1.25rem]"
                  initialsClassName="text-6xl"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
                className="absolute -bottom-4 -right-4 rounded-xl bg-navy px-4 py-2.5 text-on-navy shadow-[0_16px_32px_-16px_rgb(4_35_76/0.6)]"
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-saffron">Since</p>
                <p className="figure text-2xl leading-none tabular">{founder.since}</p>
              </motion.div>
            </div>
          </Reveal>

          {/* story */}
          <div className="md:col-span-8">
            <Reveal>
              <Quote className="size-7 text-saffron" aria-hidden="true" />
              <blockquote className="mt-3 text-xl leading-snug font-medium text-ink md:text-[1.4rem]">
                &ldquo;{founder.quote}&rdquo;
              </blockquote>
            </Reveal>

            <Reveal delay={0.12} className="mt-6 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-saffron" />
              <div>
                <p className="heading-4 text-ink">{founder.name}</p>
                <p className="text-sm text-muted">{founder.role}</p>
              </div>
            </Reveal>

            <Reveal delay={0.2} as="p" className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {founder.bio.join(" ")}
            </Reveal>

            <Stagger className="mt-7 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {founder.highlights.map((h) => (
                <StaggerItem key={h.label} className="bg-surface px-4 py-3">
                  <CountUp value={h.value} suffix={h.suffix} className="figure text-2xl leading-none text-ink" />
                  <p className="mt-1.5 text-xs text-muted">{h.label}</p>
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

export function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="border-y border-line bg-surface py-16 md:py-24">
      <div className="shell">
        <SectionLabel index="02">Our journey</SectionLabel>
        <Reveal as="h2" className="heading-2 mt-5 max-w-xl text-ink">
          From one desk to <em className="text-saffron-ink">250+ lenders.</em>
        </Reveal>

        <div ref={ref} className="relative mt-14">
          {/* rail: grey track, saffron fill that draws with scroll */}
          <div aria-hidden="true" className="absolute left-[0.6875rem] top-2 bottom-2 w-px bg-line md:left-0 md:right-0 md:top-[0.6875rem] md:bottom-auto md:h-px md:w-auto" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="absolute left-[0.6875rem] top-2 bottom-2 w-px origin-top bg-saffron md:hidden"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleX: lineScale }}
            className="absolute left-0 right-0 top-[0.6875rem] hidden h-px origin-left bg-saffron md:block"
          />

          <Stagger as="ol" stagger={0.12} className="grid gap-10 md:grid-cols-5 md:gap-6">
            {milestones.map((m) => (
              <StaggerItem as="li" key={m.year} className="relative pl-10 md:pl-0 md:pt-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0.5 grid size-[1.375rem] place-items-center rounded-full border-2 border-saffron bg-surface md:top-0"
                >
                  <span className="size-2 rounded-full bg-saffron" />
                </span>
                <p className="figure text-3xl leading-none text-saffron-ink tabular">{m.year}</p>
                <h3 className="heading-4 mt-3 text-ink">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function TeamGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03">The team</SectionLabel>
            <Reveal as="h2" className="heading-2 mt-5 max-w-xl text-ink">
              The people who <em className="text-saffron-ink">pick up your call.</em>
            </Reveal>
          </div>
          <Reveal delay={0.1} as="p" className="max-w-sm text-ink-soft">
            Advisors, credit analysts and documentation specialists — one of them stays with your file from the first
            call to disbursal.
          </Reveal>
        </div>

        <Stagger as="ul" stagger={0.07} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person) => (
            <StaggerItem as="li" key={person.name}>
              <article className="group relative h-full overflow-hidden rounded-[1.25rem] border border-line bg-surface transition-[border-color,box-shadow,transform] duration-500 ease-out-quint hover:-translate-y-1 hover:border-saffron hover:shadow-[0_24px_50px_-30px_rgb(4_35_76/0.45)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Portrait
                    person={person}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="size-full transition-transform duration-700 ease-out-quint group-hover:scale-105"
                    initialsClassName="text-5xl"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[0.7rem] font-semibold text-ink backdrop-blur">
                    {person.experience}
                  </span>
                  {/* focus line slides up over the portrait on hover */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-navy/95 p-4 text-sm leading-snug text-on-navy transition-transform duration-500 ease-out-quint group-hover:translate-y-0">
                    {person.focus}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="heading-4 text-ink">{person.name}</h3>
                  <p className="mt-0.5 text-sm text-saffron-ink">{person.role}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                    <Languages className="size-3.5" aria-hidden="true" />
                    {person.languages.join(" · ")}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Hero aside: two columns of team photos and stat cards scrolling past each
 * other in opposite directions, faded out at the top and bottom. Each column
 * renders its list twice so the loop is seamless.
 */
export function TeamMarquee() {
  const people = [founder, ...team];
  const facts = founder.highlights;
  const left = [people[0], facts[0], people[2], people[4], facts[2], people[6]].filter(Boolean);
  const right = [people[1], people[3], facts[1], people[5], people[0]].filter(Boolean);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto grid h-[26rem] w-full max-w-[26rem] select-none grid-cols-2 gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] md:h-[30rem]"
    >
      <MarqueeColumn items={left} duration={26} />
      <MarqueeColumn items={right} duration={30} reverse className="pt-10" />
    </div>
  );
}

function MarqueeColumn({ items, duration, reverse = false, className }) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="flex flex-col gap-4"
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) =>
          item.name ? (
            <figure key={i} className="relative overflow-hidden rounded-2xl shadow-[0_14px_30px_-18px_rgb(4_35_76/0.5)]">
              <Portrait person={item} sizes="208px" className="aspect-[4/5] w-full" initialsClassName="text-4xl" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-white">
                <p className="text-sm font-semibold leading-tight">{item.name}</p>
                <p className="text-[0.7rem] opacity-80">{item.role}</p>
              </figcaption>
            </figure>
          ) : (
            <div key={i} className="rounded-2xl bg-navy p-5 text-on-navy">
              <p className="figure text-4xl leading-none text-saffron tabular">
                {item.value.toLocaleString("en-IN")}
                {item.suffix}
              </p>
              <p className="mt-2 text-sm text-on-navy-muted">{item.label}</p>
            </div>
          ),
        )}
      </motion.div>
    </div>
  );
}
