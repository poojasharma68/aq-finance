import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import emblem from "../../public/brand/bala-ji-emblem.png";
import emblemReversed from "../../public/brand/bala-ji-emblem-reversed.png";
import fullLogo from "../../public/brand/bala-ji-logo.png";
import fullLogoReversed from "../../public/brand/bala-ji-logo-reversed.png";

/**
 * Bala Ji Finance brand assets, cut from the original logo artwork
 * (public/brand/bala-ji-logo-original.jpeg):
 *   bala-ji-emblem.png, bala-ji-logo.png                   — for light backgrounds
 *   bala-ji-emblem-reversed.png, bala-ji-logo-reversed.png — navy swapped to cream, for dark backgrounds
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

/** Horizontal lockup for the header: the BJ emblem plus the wordmark, typeset to match the logo. */
export function Logo({ className, tone = "auto" }) {
  const onDark = tone === "dark";
  return (
    <Link href="/" aria-label="Bala Ji Finance — home" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="transition-transform duration-500 ease-out-quint group-hover:-translate-y-0.5">
        <LogoEmblem tone={tone} priority className="h-12" />
      </span>
      <span className="flex flex-col items-center leading-none">
        <span className={cn("font-brand text-[1.3rem] font-bold tracking-[0.06em]", onDark ? "text-on-navy" : "text-ink")}>
          BALA JI
        </span>
        <span
          className={cn(
            "mt-1 flex items-center gap-1.5 text-[0.56rem] font-bold tracking-[0.42em]",
            onDark ? "text-saffron" : "text-saffron-ink",
          )}
        >
          <span aria-hidden="true" className="h-px w-2.5 bg-saffron" />
          <span className="-mr-[0.42em]">FINANCE</span>
          <span aria-hidden="true" className="h-px w-2.5 bg-saffron" />
        </span>
      </span>
    </Link>
  );
}

/** The complete original lockup, including the tagline. */
export function FullLogo({ className = "w-56", tone = "auto", sizes = "224px" }) {
  const alt = "Bala Ji Finance — Aapke sapno ka saath, hamara vishwas";
  if (tone === "dark") {
    return <Image src={fullLogoReversed} alt={alt} sizes={sizes} className={cn("h-auto", className)} />;
  }
  return (
    <>
      <Image src={fullLogo} alt={alt} sizes={sizes} className={cn("h-auto dark:hidden", className)} />
      <Image src={fullLogoReversed} alt={alt} sizes={sizes} className={cn("hidden h-auto dark:block", className)} />
    </>
  );
}
