import Link from "next/link";
import { loans } from "@/data/loans";
import { brand, contact, navigation, offices } from "@/data/site";
import { FullLogo } from "./logo";

const company = [
  ...navigation.filter((n) => n.href !== "/"),
  { href: "/contact", label: "Contact Us" },
];

const socials = [
  { href: "https://www.linkedin.com", label: "LinkedIn" },
  { href: "https://www.instagram.com", label: "Instagram" },
  { href: "https://x.com", label: "X" },
  { href: "https://www.youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-navy text-on-navy">
      <div className="shell pt-16 pb-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <FullLogo tone="dark" className="w-full max-w-68" />
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-on-navy-muted">
              We help salaried professionals and business owners compare and secure loans from India&apos;s
              leading banks and NBFCs — with one advisor from application to disbursal.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-on-navy-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-saffron hover:decoration-saffron"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Loans" className="md:col-span-3">
            {loans.map((loan) => (
              <li key={loan.slug}>
                <Link href={`/loans?type=${loan.slug}`} className="footer-link">
                  {loan.name}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Company" className="md:col-span-2">
            {company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <div className="md:col-span-3">
            <h2 className="eyebrow text-saffron!">Talk to us</h2>
            <a href={contact.phoneHref} className="mt-4 block figure text-3xl leading-none hover:text-saffron">
              {contact.phone}
            </a>
            <p className="mt-2 text-sm text-on-navy-muted">Toll-free · {contact.hours}</p>
            <a href={`mailto:${contact.email}`} className="mt-4 block text-sm hover:text-saffron">
              {contact.email}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-on-navy-muted">{offices[0].address}</p>
          </div>
        </div>

        {/* oversized wordmark, cropped by the footer edge */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-16 select-none whitespace-nowrap text-center font-brand text-[4.7vw] font-bold uppercase leading-[0.8] tracking-tight text-white/[0.05] xl:text-[3.9rem]"
        >
          {brand.full}
        </p>

        <div className="relative mt-[-2rem] border-t border-white/10 pt-6 text-xs leading-relaxed text-on-navy-muted">
          <p className="max-w-4xl">
            {brand.short} ({brand.full}) is a loan facilitation and advisory firm and does not lend money
            itself. All loans are
            sanctioned and disbursed at the sole discretion of our partner banks and NBFCs, subject to their credit
            policy. Interest rates shown are indicative. Grievances: {contact.grievance.name},{" "}
            <a href={`mailto:${contact.grievance.email}`} className="underline underline-offset-2 hover:text-saffron">
              {contact.grievance.email}
            </a>
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {brand.full}. All rights reserved.</p>
            <p className="flex gap-4">
              <Link href="/contact" className="hover:text-saffron">
                Privacy policy
              </Link>
              <Link href="/contact" className="hover:text-saffron">
                Terms of use
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className, children }) {
  return (
    <div className={className}>
      <h2 className="eyebrow text-saffron!">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}
