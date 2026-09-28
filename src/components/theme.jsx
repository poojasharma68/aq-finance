"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export const THEME_STORAGE_KEY = "sbft-theme";

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.dataset.theme ?? "light";
const getServerSnapshot = () => null;

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function applyTheme(next) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // storage blocked (private mode) — theme still applies for this visit
  }
}

export function ThemeToggle({ className }) {
  const theme = useTheme();
  const isDark = theme === "dark";

  function toggle(event) {
    const next = isDark ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }

    // circular reveal that grows out of the toggle button
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 700,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full border border-line-strong text-ink transition-colors hover:border-saffron hover:text-saffron-ink",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            initial={{ y: 14, opacity: 0, rotate: -40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            {isDark ? <Sun className="size-[1.05rem]" strokeWidth={1.8} /> : <Moon className="size-[1.05rem]" strokeWidth={1.8} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
