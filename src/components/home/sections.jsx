import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { loans } from "@/data/loans";
import { partners } from "@/data/partners";
import { brand, stats } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { formatCompactINR } from "@/lib/finance";
import { ButtonLink } from "@/components/button";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Initials, LoanIcon, PartnerMark, SectionLabel, Stars } from "@/components/ui";

export function StatsBand() {
  return (
    <section aria-label={`${brand.short} in numbers`} className="bg-navy text-on-navy">
      <Stagger className="shell grid grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {stats.map((stat, i) => (
          <StaggerItem
            key={stat.label}
            className={[
              "py-10 md:py-14",
              i % 2 === 1 ? "border-l border-white/10 pl-6 md:pl-10" : "",
              i === 2 ? "border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-10" : "",
              i === 3 ? "border-t border-white/10 lg:border-t-0" : "",
            ].join(" ")}
          >
            <p className="text-[0.8rem] text-on-navy-muted">{stat.label}</p>
            <p className="mt-3 figure text-[clamp(2.4rem,5vw,3.6rem)] leading-none">
              <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-[0.78rem] text-saffron">{stat.note}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function PartnerMarquee() {
  const banks = partners.filter((p) => p.type === "bank");
  const others = partners.filter((p) => p.type !== "bank");

  return (
    <section className="section-y">
      <div className="shell grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-7">
          <SectionLabel>Our banking &amp; NBFC partners</SectionLabel>
          <h2 className="mt-5 heading-2 text-ink">
            One application. <em className="text-saffron-ink">250+ lenders</em> looking at it.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5 md:pb-2">
          <p className="text-ink-soft">
            We&apos;re empanelled with public and private sector banks, NBFCs and housing finance companies, so we can
            place your file where it has the best chance — not just where we have a target.
          </p>
          <Link
            href="/partners"
            className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-saffron decoration-2 underline-offset-[6px]"
          >
            See every partner and their products
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <MarqueeRow items={banks} />
        <MarqueeRow items={others} reverse />
      </div>
    </section>
  );
}

function MarqueeRow({ items, reverse = false }) {
  const loop = [...items, ...items, ...items];
  return (
    <div className="group flex overflow-hidden">
      <ul
        className={[
          "flex w-max shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]",
          // slower on phones, where the same speed crosses a narrow screen much faster
          reverse
            ? "animate-marquee-reverse max-sm:[animation-duration:130s]"
            : "animate-marquee max-sm:[animation-duration:110s]",
        ].join(" ")}
      >
        {[...loop, ...loop].map((partner, i) => (
          <li
            key={`${partner.slug}-${i}`}
            aria-hidden={i >= items.length ? "true" : undefined}
            className="rounded-2xl bg-surface px-5 py-4 [&_span]:border-0"
          >
            <PartnerMark partner={partner} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LoanList() {
  return (
    <section className="border-t border-line section-y">
      <div className="shell">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel index="01">Loan products</SectionLabel>
            <h2 className="mt-5 heading-2 text-ink">
              Seven ways to fund <em className="text-saffron-ink">what&apos;s next.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:pb-2">
            <p className="text-ink-soft">
              Rates below are the lowest currently offered across our partners. Tap a product to see tenure, fees,
              eligibility and the documents you&apos;ll need.
            </p>
          </Reveal>
        </div>

        <Stagger as="ul" className="mt-8 border-b border-line" stagger={0.07}>
          {loans.map((loan, i) => (
            <StaggerItem as="li" key={loan.slug}>
              <Link
                href={`/loans?type=${loan.slug}`}
                className="group relative isolate grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-1 border-t border-line py-5 md:grid-cols-[3.5rem_minmax(0,1.4fr)_minmax(0,1fr)_8rem_3rem] md:gap-x-6 md:py-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-surface transition-transform duration-500 ease-out-quint group-hover:scale-y-100"
                />
                <span className="text-sm text-muted tabular md:pl-3">{String(i + 1).padStart(2, "0")}</span>

                <span className="flex items-center gap-3">
                  <span className="hidden size-10 shrink-0 place-items-center rounded-full border border-line-strong text-saffron-ink transition-colors group-hover:border-saffron sm:grid">
                    <LoanIcon name={loan.icon} />
                  </span>
                  <span className="heading-3 text-ink">
                    {loan.name}
                  </span>
                </span>

                <span className="col-start-2 text-sm text-ink-soft md:col-start-auto">{loan.tagline}</span>

                <span className="col-start-2 flex flex-col items-start gap-1 md:col-start-auto">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">From</span>
                  <span className="figure text-2xl leading-none text-ink tabular">{loan.rateFrom}%</span>
                  <span className="text-xs text-muted tabular">Up to {formatCompactINR(loan.amount.max)}</span>
                </span>

                <span className="col-start-3 row-span-3 row-start-1 grid size-11 place-items-center self-center rounded-full border border-line-strong text-ink transition-all duration-500 ease-out-quint group-hover:rotate-45 group-hover:border-saffron group-hover:bg-saffron group-hover:text-on-saffron md:col-start-auto md:row-span-1 md:row-start-auto">
                  <ArrowUpRight className="size-4.5" aria-hidden="true" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function TestimonialPreview() {
  const [featured, ...rest] = testimonials;
  const side = rest.slice(0, 2);

  return (
    <section className="section-y">
      <div className="shell">
        <Reveal>
          <SectionLabel index="03">Happy customers</SectionLabel>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal as="figure" className="lg:col-span-7">
            <span aria-hidden="true" className="block text-[7rem] font-semibold leading-[0.5] text-saffron">
              &ldquo;
            </span>
            <blockquote className="mt-4 heading-quote text-ink">
              {featured.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <Initials name={featured.name} />
              <span>
                <span className="block font-semibold text-ink">{featured.name}</span>
                <span className="block text-sm text-muted">
                  {featured.role}, {featured.city} · Personal loan in {featured.days} days
                </span>
              </span>
            </figcaption>
          </Reveal>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {side.map((t, i) => (
              <Reveal
                as="figure"
                key={t.name}
                delay={0.1 + i * 0.1}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <Stars rating={t.rating} />
                <blockquote className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{t.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Initials name={t.name} className="size-9 text-base" />
                  <span className="text-sm">
                    <span className="block font-semibold text-ink">{t.name}</span>
                    <span className="block text-muted">
                      {t.role}, {t.city}
                    </span>
                  </span>
                </figcaption>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <Link
                href="/testimonials"
                className="group flex items-center justify-between rounded-2xl border border-dashed border-line-strong px-6 py-4 text-sm font-semibold text-ink transition-colors hover:border-saffron"
              >
                Read more stories from 2,314 reviews
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title = "Ready to start your loan journey?", body }) {
  return (
    <section className="pb-20 md:pb-28">
      <div className="shell">
        <Reveal className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy px-6 dark:ring-1 dark:ring-white/10 py-12 text-on-navy sm:px-10 md:px-14 md:py-16">
          <svg
            aria-hidden="true"
            viewBox="0 0 400 300"
            className="absolute right-6 top-6 -z-10 w-32 opacity-60 md:right-12 md:top-8 md:w-40"
            fill="none"
          >
            <path d="M40 250C150 240 250 180 330 70" stroke="var(--saffron)" strokeWidth="10" strokeLinecap="round" />
            <path d="m300 60 42-8-6 42" stroke="var(--saffron)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="200" y="200" width="30" height="100" fill="var(--on-navy)" />
            <rect x="250" y="160" width="30" height="140" fill="var(--on-navy)" />
            <rect x="300" y="120" width="30" height="180" fill="var(--on-navy)" />
          </svg>
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h2 className="heading-2">{title}</h2>
              <p className="mt-4 max-w-xl text-on-navy-muted">
                {body ??
                  "Tell us what you need in two minutes. An advisor calls you back within 30 minutes with offers that fit."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
              <ButtonLink href="/apply" size="lg" arrow>
                Apply now
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="light">
                Talk to us
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
