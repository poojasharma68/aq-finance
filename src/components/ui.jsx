import Image from "next/image";
import {
  Briefcase,
  Building2,
  GraduationCap,
  House,
  Layers,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/cn";

const loanIcons = {
  personal: UserRound,
  home: House,
  business: Briefcase,
  property: Building2,
  education: GraduationCap,
  consolidation: Layers,
  od: Wallet,
};

export function LoanIcon({ name, className }) {
  const Icon = loanIcons[name] ?? Layers;
  return <Icon aria-hidden="true" strokeWidth={1.5} className={cn("size-5", className)} />;
}

const logoChip = {
  sm: "h-9 w-17 rounded-[0.55rem]",
  md: "h-11 w-21 rounded-[0.55rem]",
  lg: "h-12 w-26 rounded-xl",
};

const monogramChip = {
  sm: "size-9 rounded-[0.55rem] text-[0.6rem]",
  md: "size-11 rounded-[0.55rem] text-[0.66rem]",
  lg: "size-12 rounded-xl text-[0.7rem]",
};

/**
 * The chip that stands for a lender: their logo where we have one, their
 * typographic monogram where we don't. Every place a lender appears goes
 * through this, so adding `logo` to a partner in src/data/partners.js switches
 * it over site-wide.
 *
 * Bank logos vary enormously in proportion, so the image is *contained* in a
 * fixed box rather than given a width, and it sits on a white chip in both
 * themes — full-colour marks disappear against the dark theme otherwise, and
 * most brand guidelines ask for a white or clear background anyway.
 *
 * `monogramClassName` is for styling that only makes sense on the monogram —
 * a hover fill, say, which would be wrong painted over somebody's real logo.
 */
export function PartnerLogo({ partner, size = "md", className, monogramClassName, alt = "", bordered = true }) {
  if (partner.logo) {
    return (
      <span
        className={cn(
          "relative shrink-0 overflow-hidden bg-white",
          bordered && "border border-line-strong",
          logoChip[size],
          className,
        )}
      >
        <Image
          src={partner.logo}
          alt={alt}
          fill
          sizes="96px"
          // SVG stays unoptimized, so no next.config image flags are needed
          unoptimized={partner.logo.endsWith(".svg")}
          className="object-contain p-1"
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center border border-line-strong bg-surface font-sans font-extrabold tracking-tight text-ink",
        monogramChip[size],
        className,
        monogramClassName,
      )}
    >
      {partner.mark}
    </span>
  );
}

export function PartnerMark({ partner, size = "md", className, showName = true }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <PartnerLogo partner={partner} size={size} alt={showName ? "" : partner.name} />
      {showName && (
        <span
          className={cn("font-semibold leading-tight text-ink", size === "sm" ? "text-sm" : "text-[0.95rem]")}
        >
          {partner.name}
        </span>
      )}
    </span>
  );
}

export function Stars({ rating, className }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn("size-3.5", i < rating ? "fill-saffron text-saffron" : "text-line-strong")}
        />
      ))}
    </span>
  );
}

export function Initials({ name, className }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full bg-saffron-soft text-lg font-semibold text-saffron-ink",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** "01 — Loan products" style label used to open each section. */
export function SectionLabel({ index, children, className }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      {index && <span className="tabular text-muted">{index}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-saffron" />
      <span>{children}</span>
    </p>
  );
}
