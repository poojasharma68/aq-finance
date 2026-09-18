"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE } from "./motion";

export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <ul className="border-b border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li key={item.q} className="border-t border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className={cn(
                    "text-[1.02rem] font-semibold leading-snug transition-colors md:text-[1.12rem]",
                    isOpen ? "text-ink" : "text-ink-soft group-hover:text-ink",
                  )}
                >
                  {item.q}
                </span>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen ? "rotate-45 border-saffron bg-saffron text-on-saffron" : "border-line-strong text-ink",
                  )}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 pr-12 leading-relaxed text-ink-soft">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
