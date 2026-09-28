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
 * The full name beneath it is typeset rather than baked into the image, so it
 * comes from `brand` in src/data/site.js and a rename never needs new art.
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

/** The full name set beneath the emblem. */
function Wordmark({ onDark, size = "header" }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap font-bold uppercase leading-none tracking-[0.16em]",
        size === "footer" ? "text-[0.62rem]" : "text-[0.5rem]",
        onDark ? "text-saffron" : "text-saffron-ink",
      )}
    >
      {brand.full}
    </span>
  );
}

/** Header lockup: the emblem with the full name beneath it. */
export function Logo({ className, tone = "auto" }) {
  return (
    <Link
      href="/"
      aria-label={`${brand.full} — home`}
      className={cn("group inline-flex flex-col items-center gap-1", className)}
    >
      <span className="transition-transform duration-500 ease-out-quint group-hover:-translate-y-0.5">
        <LogoEmblem tone={tone} priority className="h-10" />
      </span>
      <Wordmark onDark={tone === "dark"} />
    </Link>
  );
}

/** Footer lockup: emblem, the full name beneath it, then the tagline. */
export function FullLogo({ className = "w-56", tone = "auto" }) {
  const onDark = tone === "dark";
  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span className="inline-flex flex-col items-center gap-1.5 self-start">
        <LogoEmblem tone={tone} className="h-14" />
        <Wordmark onDark={onDark} size="footer" />
      </span>
      <span
        className={cn(
          "mt-4 text-[0.98rem] leading-snug tracking-[0.01em]",
          onDark ? "text-on-navy" : "text-ink",
        )}
      >
        {brand.tagline}
      </span>
    </span>
  );
}
