"use client";

import { motion } from "motion/react";
import { BadgeCheck, Landmark, MapPin, ShieldCheck, Timer } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { EASE, MaskedHeading } from "@/components/motion";
import { OfferMatcher } from "./offer-matcher";

const trust = [
  { icon: Landmark, title: "17 lending partners", body: "Banks, NBFCs & HFCs" },
  { icon: Timer, title: "4-hour callback", body: "On working days" },
  { icon: ShieldCheck, title: "Free for you", body: "No advisory fee" },
  { icon: MapPin, title: "120+ cities", body: "Doorstep pickup" },
];

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
});

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* hairline columns, fading out towards the bottom */}
      <div
        aria-hidden="true"
        className="column-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      {/* slow saffron arc — echoes the arc around the BJ emblem */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        className="pointer-events-none absolute -right-64 -top-40 -z-10 hidden w-[60rem] text-saffron lg:block"
        fill="none"
      >
        <motion.circle
          cx="400"
          cy="400"
          r="330"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
        />
        <motion.circle
          cx="400"
          cy="400"
          r="250"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, rotate: 360 }}
          transition={{ opacity: { duration: 1.5, delay: 0.8 }, rotate: { duration: 160, ease: "linear", repeat: Infinity } }}
          style={{ originX: "50%", originY: "50%" }}
        />
      </svg>

      <div className="shell grid items-center gap-14 pb-20 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-28">
        <div className="lg:col-span-7">
          <motion.p {...fadeUp(0)} className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-saffron" />
            SBFT · Loans from India&apos;s leading banks
          </motion.p>

          <MaskedHeading
            className="mt-6 font-display text-[clamp(3rem,6.6vw,5.6rem)] font-normal leading-[1] tracking-[-0.02em] text-ink"
            lines={[
              "Aapke sapne,",
              <em key="vishwas" className="text-saffron-ink">
                hamara vishwas.
              </em>,
            ]}
          />

          <motion.p {...fadeUp(0.45)} className="mt-7 max-w-[34rem] text-[1.06rem] leading-relaxed text-ink-soft">
            Your dreams, backed by our word. We find the right loan from the right bank or NBFC, compare offers across
            our lending partners, and stay on your file until the money reaches your account.
          </motion.p>

          <motion.div {...fadeUp(0.55)} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/apply" size="lg" arrow>
              Apply for a loan
            </ButtonLink>
            <ButtonLink href="/loans" size="lg" variant="outline" arrow>
              Explore loan options
            </ButtonLink>
          </motion.div>

          <motion.ul {...fadeUp(0.7)} className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {trust.map(({ icon: Icon, title, body }) => (
              <li key={title} className="border-t border-line-strong pt-4">
                <Icon className="size-5 text-saffron-ink" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
                <p className="text-[0.8rem] text-muted">{body}</p>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          className="relative lg:col-span-5"
        >
          <OfferMatcher />

          {/* a recent disbursal note, floating off the card edge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.4 }}
            className="absolute -left-10 -top-14 hidden xl:block"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-[0_20px_40px_-24px_rgb(4_35_76/0.5)]"
            >
              <span className="grid size-9 place-items-center rounded-full bg-saffron-soft text-saffron-ink">
                <BadgeCheck className="size-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.8rem] font-semibold text-ink">₹6,00,000 disbursed</span>
                <span className="block text-[0.7rem] text-muted">Personal loan · Pune · 4 days</span>
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
