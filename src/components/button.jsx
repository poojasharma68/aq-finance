import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const base =
  "group relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-quint active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary:
    "bg-saffron text-on-saffron shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] hover:bg-[color-mix(in_oklab,var(--saffron)_86%,white)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_10px_30px_-12px_var(--saffron)]",
  outline: "border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-bg",
  navy: "border border-white/20 text-on-navy hover:border-on-navy hover:bg-on-navy hover:text-navy",
  ink: "bg-ink text-bg hover:bg-[color-mix(in_oklab,var(--ink)_85%,var(--saffron))]",
};

const sizes = {
  sm: "h-9 px-4 text-[0.8rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-[0.95rem]",
};

function Content({ children, arrow }) {
  return (
    <>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-out-quint group-hover:translate-x-1"
          strokeWidth={2}
        />
      )}
    </>
  );
}

export function ButtonLink({ href, variant = "primary", size = "md", arrow = false, className, children, ...props }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}

export function Button({ variant = "primary", size = "md", arrow = false, className, children, type = "button", ...props }) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}
