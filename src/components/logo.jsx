import Image from "next/image";
import Link from "next/link";
import { brand } from "@/data/site";
import { cn } from "@/lib/cn";
import emblem from "../../public/brand/sbft-emblem.png";
import emblemReversed from "../../public/brand/sbft-emblem-reversed.png";

/**
 * SBFT brand assets. The emblem is the original logo artwork:
 *   sbft-emblem.png          — for light backgrounds
 *   sbft-emblem-reversed.png — navy swapped to cream, for dark backgrounds
 *
 * The wordmark beside it is typeset rather than baked into the image, so the
 * name comes from `brand` in src/data/site.js and a rename never needs new art.
 *
 * tone="auto" follows the site theme; tone="dark" always uses the reversed art
 * (for panels that stay navy in both themes, like the footer).
 */

export function LogoEmblem({ className = "h-11", tone = "auto", priority = false }) {
  if (tone === "dark") {
    return <Image src={emblemReversed} alt="" priority={priority} className={cn("w-auto", className)} />;
  }
  return (
    <>
      <Image src={emblem} alt="" priority={priority} className={cn("w-auto dark:hidden", className)} />
      <Image src={emblemReversed} alt="" priority={priority} className={cn("hidden w-auto dark:block", className)} />
    </>
  );
}

/** The wordmark: SBFT over the descriptor strip, typeset to match the emblem. */
function Wordmark({ onDark, size = "header" }) {
  const big = size === "footer";
  return (
    <span className="flex flex-col items-center leading-none">
      <span
        className={cn(
          "font-brand font-bold tracking-[0.12em]",
          big ? "text-[1.75rem]" : "text-[1.6rem]",
          onDark ? "text-on-navy" : "text-ink",
        )}
      >
        {brand.short}
      </span>
      <span
        className={cn(
          "mt-1.5 whitespace-nowrap font-bold uppercase tracking-[0.16em]",
          big ? "text-[0.5rem]" : "text-[0.46rem]",
          onDark ? "text-saffron" : "text-saffron-ink",
        )}
      >
        {brand.strip}
      </span>
    </span>
  );
}

/** Horizontal lockup for the header: the emblem plus the wordmark. */
export function Logo({ className, tone = "auto" }) {
  return (
    <Link
      href="/"
      aria-label={`${brand.short} — ${brand.full} — home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="transition-transform duration-500 ease-out-quint group-hover:-translate-y-0.5">
        <LogoEmblem tone={tone} priority className="h-12" />
      </span>
      <Wordmark onDark={tone === "dark"} />
    </Link>
  );
}

/** The full lockup for the footer: emblem, wordmark and the full form spelled out. */
export function FullLogo({ className = "w-56", tone = "auto" }) {
  const onDark = tone === "dark";
  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span className="inline-flex items-center gap-3">
        <LogoEmblem tone={tone} className="h-14" />
        <Wordmark onDark={onDark} size="footer" />
      </span>
      <span
        className={cn(
          "mt-4 font-display text-[0.98rem] leading-snug tracking-[0.01em]",
          onDark ? "text-on-navy" : "text-ink",
        )}
      >
        {brand.full}
      </span>
    </span>
  );
}
