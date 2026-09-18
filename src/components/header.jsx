"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Clock, Menu, Phone, X } from "lucide-react";
import { contact, navigation } from "@/data/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme";
import { EASE } from "./motion";

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* utility strip */}
      <div className="hidden border-b border-line bg-bg text-[0.74rem] text-muted md:block">
        <div className="shell flex h-9 items-center justify-between">
          <p>
            Loan facilitation across 17 banks &amp; NBFCs <span className="mx-2 text-line-strong">|</span> Free
            advice, no hidden charges
          </p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
              {contact.hours}
            </span>
            <a href={contact.phoneHref} className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-saffron-ink">
              <Phone className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
              {contact.phone}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || open
            ? "border-b border-line bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent bg-bg",
        )}
      >
        <div
          className={cn(
            "shell flex items-center justify-between gap-6 transition-[height] duration-300",
            scrolled ? "h-16" : "h-[4.75rem]",
          )}
        >
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block px-3.5 py-2 text-[0.86rem] font-medium transition-colors",
                        active ? "text-ink" : "text-ink-soft hover:text-ink",
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3.5 -bottom-px h-[2px] rounded-full bg-saffron"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <span className="hidden sm:block">
              <ButtonLink href="/contact" size="sm">
                Contact us
              </ButtonLink>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-line-strong text-ink lg:hidden"
            >
              {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-bg lg:hidden"
          >
            <nav aria-label="Mobile" className="shell flex min-h-full flex-col pb-10 pt-6">
              <ul className="divide-y divide-line border-y border-line">
                {[...navigation, { href: "/contact", label: "Contact Us" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-4"
                    >
                      <span
                        className={cn(
                          "font-display text-[2rem] leading-none",
                          isActive(pathname, item.href) ? "text-saffron-ink" : "text-ink",
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs text-muted tabular">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-1 pt-10 text-sm text-muted">
                <p>Talk to an advisor</p>
                <a href={contact.phoneHref} className="block figure text-2xl text-ink">
                  {contact.phone}
                </a>
                <p>{contact.hours}</p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
