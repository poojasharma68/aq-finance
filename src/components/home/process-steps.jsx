"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Clock } from "lucide-react";
import { steps } from "@/data/site";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionLabel } from "@/components/ui";

export function ProcessSteps() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section className="border-t border-line section-y">
      <div className="shell">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel index="02">How it works</SectionLabel>
            <h2 className="mt-5 heading-2 text-ink">
              From first call to <em className="text-saffron-ink">money in your account.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:pb-2">
            <p className="text-ink-soft">
              One advisor owns your file end to end, so you never have to explain your situation twice or chase a bank
              branch for updates.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* track + scroll-linked fill: horizontal on desktop, vertical on mobile */}
          <div aria-hidden="true" className="absolute left-[1.35rem] top-0 bottom-0 w-px bg-line-strong lg:left-0 lg:right-0 lg:top-[1.35rem] lg:bottom-auto lg:h-px lg:w-auto">
            <motion.div
              className="h-full w-full origin-top bg-saffron lg:hidden"
              style={{ scaleY: progress }}
            />
            <motion.div
              className="hidden h-full w-full origin-left bg-saffron lg:block"
              style={{ scaleX: progress }}
            />
          </div>

          <Stagger as="ol" className="relative grid gap-10 lg:grid-cols-4 lg:gap-8" stagger={0.12}>
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title} className="relative pl-16 lg:pl-0">
                <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-full border border-saffron bg-bg figure text-lg text-saffron-ink tabular lg:relative">
                  {i + 1}
                </span>
                <h3 className="heading-3 text-ink lg:mt-8">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{step.body}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-saffron-soft px-3 py-1 text-xs font-semibold text-saffron-ink">
                  <Clock className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  {step.meta}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
