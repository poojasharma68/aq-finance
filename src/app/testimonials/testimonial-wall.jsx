"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Timer } from "lucide-react";
import { loans } from "@/data/loans";
import { testimonials } from "@/data/testimonials";
import { formatCompactINR } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { EASE } from "@/components/motion";
import { Initials, Stars } from "@/components/ui";

const loanName = Object.fromEntries(loans.map((l) => [l.slug, l.shortName]));

export function TestimonialWall() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? testimonials : testimonials.filter((t) => t.loan === filter);
  const available = loans.filter((l) => testimonials.some((t) => t.loan === l.slug));

  return (
    <div>
      <div role="group" aria-label="Filter stories by loan type" className="flex flex-wrap gap-2">
        {[{ slug: "all", shortName: "All stories" }, ...available].map((item) => {
          const active = filter === item.slug;
          return (
            <button
              key={item.slug}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                active ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {item.shortName}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-10 columns-1 gap-4 md:columns-2 lg:columns-3"
        >
          {visible.map((t, i) => (
            <motion.li
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: Math.min(i * 0.05, 0.4) }}
              className="mb-4 break-inside-avoid"
            >
              <figure className="rounded-[1.25rem] border border-line bg-surface p-6 transition-colors hover:border-line-strong">
                <div className="flex items-center justify-between">
                  <Stars rating={t.rating} />
                  <span className="text-xs text-muted">{t.month}</span>
                </div>
                <blockquote className="mt-4 leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <Initials name={t.name} />
                  <span className="min-w-0 text-sm">
                    <span className="block font-semibold text-ink">{t.name}</span>
                    <span className="block truncate text-muted">
                      {t.role} · {t.city}
                    </span>
                  </span>
                </figcaption>
                <p className="mt-4 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full bg-saffron-soft px-2.5 py-1 font-semibold text-saffron-ink">
                    {loanName[t.loan]} · {formatCompactINR(t.amount)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-ink-soft">
                    <Timer className="size-3" aria-hidden="true" />
                    Disbursed in {t.days} days
                  </span>
                </p>
              </figure>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
