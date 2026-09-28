"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  ChevronRight,
  Clock,
  FileText,
  Handshake,
  House,
  Layers,
  Mail,
  Menu,
  MessageCircle,
  MessageSquareQuote,
  Phone,
  Users,
  X,
} from "lucide-react";
import { contact, navigation } from "@/data/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "./button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme";
import { EASE } from "./motion";

const menuIcons = {
  "/": House,
  "/apply": FileText,
  "/loans": Layers,
  "/partners": Handshake,
  "/testimonials": MessageSquareQuote,
  "/about": Users,
  "/contact": Mail,
};

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
            <nav aria-label="Mobile" className="shell flex min-h-full flex-col gap-6 pb-8 pt-4">
              <ul className="space-y-1">
                {[...navigation, { href: "/contact", label: "Contact Us" }].map((item, i) => {
                  const active = isActive(pathname, item.href);
                  const Icon = menuIcons[item.href] ?? ChevronRight;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.04, duration: 0.45, ease: EASE }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-colors",
                          active ? "bg-saffron-soft" : "active:bg-surface-2",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                            active
                              ? "bg-saffron text-on-saffron"
                              : "border border-line bg-surface text-saffron-ink",
                          )}
                        >
                          <Icon className="size-[1.1rem]" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <span className="flex-1 text-[1.05rem] font-semibold text-ink">{item.label}</span>
                        <ChevronRight
                          className={cn("size-4", active ? "text-saffron-ink" : "text-muted")}
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
                className="mt-auto rounded-3xl bg-navy p-5 text-on-navy"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-saffron">
                  Need help choosing?
                </p>
                <p className="mt-1.5 text-sm text-on-navy-muted">
                  Talk to an advisor · {contact.hours}
                </p>
                <ButtonLink href="/apply" size="md" arrow className="mt-4 w-full" onClick={() => setOpen(false)}>
                  Apply now
                </ButtonLink>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  <a
                    href={contact.phoneHref}
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 text-sm font-semibold text-on-navy"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    Call
                  </a>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 text-sm font-semibold text-on-navy"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
