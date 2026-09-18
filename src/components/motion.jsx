"use client";

import { useEffect, useRef } from "react";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/cn";

export const EASE = [0.22, 1, 0.36, 1];

export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fades and lifts content in once it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div", ...props }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...props}
    >
      {children}
    </Component>
  );
}

const groupVariants = {
  hidden: {},
  show: (stagger = 0.08) => ({ transition: { staggerChildren: stagger } }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({ children, className, stagger = 0.08, as = "div" }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={groupVariants}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ children, className, as = "div", ...props }) {
  const Component = motion[as];
  return (
    <Component className={className} variants={itemVariants} {...props}>
      {children}
    </Component>
  );
}

/**
 * Headline where each line rises out of a mask. Pass one array entry per line;
 * entries can contain inline markup such as <em>.
 */
export function MaskedHeading({ lines, as = "h1", className, delay = 0.1 }) {
  const Tag = as;
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Counts up to `value` the first time it becomes visible. */
export function CountUp({ value, prefix = "", suffix = "", duration = 1.8, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const count = useMotionValue(0);
  const text = useTransform(
    count,
    (v) => `${prefix}${Math.round(v).toLocaleString("en-IN")}${suffix}`,
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, count, value, duration]);

  return (
    <span className={cn("tabular", className)}>
      <span className="sr-only">{`${prefix}${value.toLocaleString("en-IN")}${suffix}`}</span>
      <motion.span ref={ref} aria-hidden="true">
        {text}
      </motion.span>
    </span>
  );
}
