import { LoanScannerHero } from "@/components/loan-scanner";

export const metadata = {
  title: "DSA — Find the right loan, not just any loan",
  description:
    "We compare loan options from multiple banks and NBFCs to help you find the one that fits you best.",
};

export default function DsaHeroPage() {
  return <LoanScannerHero ctaHref="/apply" />;
}
