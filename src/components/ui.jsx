import {
  Briefcase,
  Building2,
  GraduationCap,
  House,
  Layers,
  Star,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/cn";

const loanIcons = {
  personal: UserRound,
  home: House,
  business: Briefcase,
  property: Building2,
  education: GraduationCap,
  consolidation: Layers,
};

export function LoanIcon({ name, className }) {
  const Icon = loanIcons[name] ?? Layers;
  return <Icon aria-hidden="true" strokeWidth={1.5} className={cn("size-5", className)} />;
}

/** Typographic monogram used in place of partner logos until co-branding is cleared. */
export function PartnerMark({ partner, size = "md", className }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "grid shrink-0 place-items-center rounded-[0.55rem] border border-line-strong bg-surface font-sans font-extrabold tracking-tight text-ink",
          size === "sm" ? "size-9 text-[0.6rem]" : "size-11 text-[0.66rem]",
        )}
      >
        {partner.mark}
      </span>
      <span className={cn("font-semibold leading-tight text-ink", size === "sm" ? "text-sm" : "text-[0.95rem]")}>
        {partner.name}
      </span>
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
        "grid size-11 shrink-0 place-items-center rounded-full bg-saffron-soft font-display text-lg text-saffron-ink",
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
