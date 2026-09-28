"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { EASE, MaskedHeading } from "./motion";

/** Shared opening block for inner pages. `aside` renders in the right column. */
export function PageHero({ crumb, eyebrow, lines, description, aside, align = "end" }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="column-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className={`shell grid gap-10 pb-14 pt-10 md:pb-20 md:pt-14 lg:grid-cols-12 ${align === "start" ? "lg:items-start" : "lg:items-end"}`}>
        <div className="lg:col-span-7">
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ol className="flex items-center gap-1.5 text-xs text-muted">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3" />
              </li>
              <li aria-current="page" className="text-ink-soft">
                {crumb}
              </li>
            </ol>
          </motion.nav>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow mt-8 flex items-center gap-3"
          >
            <span aria-hidden="true" className="h-px w-8 bg-saffron" />
            {eyebrow}
          </motion.p>
          <MaskedHeading
            lines={lines}
            className="mt-5 heading-hero text-ink"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft"
          >
            {description}
          </motion.p>
        </div>
        {aside && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="lg:col-span-5"
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}
