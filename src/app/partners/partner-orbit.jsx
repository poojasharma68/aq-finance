"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BadgeCheck } from "lucide-react";
import { partners } from "@/data/partners";
import { stats } from "@/data/site";
import { EASE } from "@/components/motion";
import { LogoEmblem } from "@/components/logo";

const totalPartners = stats.find((s) => s.label === "Lending partners");

const withLogo = partners.filter((p) => p.logo);
const rings = [
  { radius: 27, duration: 38, direction: 1, items: withLogo.slice(0, 4) },
  { radius: 45, duration: 60, direction: -1, items: withLogo.slice(4, 11) },
];

/** A point on a ring, as a percentage of the square it sits in. */
function position(i, count, radius, offset = 0) {
  const angle = (i / count) * Math.PI * 2 + offset - Math.PI / 2;
  return { left: `${50 + radius * Math.cos(angle)}%`, top: `${50 + radius * Math.sin(angle)}%` };
}

/**
 * The "one application, many lenders" picture for the partners hero: our
 * emblem at the hub, partner logos circling it, and pulses running out along
 * the spokes. Each ring spins as a whole and every logo counter-spins, so the
 * logos stay upright. Reduced-motion users get the still arrangement
 * (MotionProvider sets reducedMotion="user").
 */
export function PartnerOrbit() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[28rem] select-none">
      {/* soft glow behind the hub */}
      <div className="absolute inset-[22%] rounded-full bg-saffron/15 blur-3xl" />

      {rings.map((ring, r) => (
        <motion.div
          key={r}
          className="absolute inset-0"
          animate={{ rotate: 360 * ring.direction }}
          transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
            <circle
              cx="50"
              cy="50"
              r={ring.radius}
              fill="none"
              stroke="var(--line-strong)"
              strokeWidth="0.25"
              strokeDasharray="0.8 1.4"
            />
            {ring.items.map((p, i) => {
              const angle = (i / ring.items.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + ring.radius * Math.cos(angle);
              const y = 50 + ring.radius * Math.sin(angle);
              return (
                <g key={p.slug}>
                  <line x1="50" y1="50" x2={x} y2={y} stroke="var(--line)" strokeWidth="0.25" />
                  {/* a pulse travelling hub → lender */}
                  <motion.line
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke="var(--saffron)"
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="0.12 0.88"
                    initial={{ strokeDashoffset: 0.12 }}
                    animate={{ strokeDashoffset: -0.88 }}
                    transition={{
                      duration: 2.4,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      delay: (i * 0.7 + r * 0.35) % 3,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {ring.items.map((p, i) => (
            <motion.div
              key={p.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={position(i, ring.items.length, ring.radius)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 + r * 0.3 + i * 0.08 }}
            >
              <motion.div
                animate={{ rotate: -360 * ring.direction }}
                transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
                className="relative h-9 w-[4.5rem] overflow-hidden rounded-md bg-white shadow-[0_6px_18px_-8px_rgb(4_35_76/0.35)] sm:h-10 sm:w-20"
              >
                <Image src={p.logo} alt="" fill sizes="80px" className="object-contain px-1.5 py-1" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      ))}

      {/* hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.span
          className="absolute inset-0 rounded-full border border-saffron"
          animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border border-saffron"
          animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, delay: 1.2 }}
        />
        <div className="relative grid size-24 place-items-center rounded-full border border-line-strong bg-surface shadow-[0_18px_40px_-18px_rgb(4_35_76/0.45)] sm:size-28">
          <LogoEmblem className="h-14 sm:h-16" />
        </div>
      </div>

      {/* floating chips */}
      <motion.div
        className="absolute right-0 top-[6%] rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{ opacity: { delay: 1.1, duration: 0.5 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="text-saffron-ink">
          {totalPartners.value}
          {totalPartners.suffix}
        </span>{" "}
        lending partners
      </motion.div>
      <motion.div
        className="absolute bottom-[5%] left-0 flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.4, duration: 0.5 }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
      >
        <BadgeCheck className="size-4 text-success" />
        One application, many offers
      </motion.div>
    </div>
  );
}
