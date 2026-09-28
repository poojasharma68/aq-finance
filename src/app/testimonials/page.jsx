import { loans } from "@/data/loans";
import { brand } from "@/data/site";
import { ratingSummary, testimonials } from "@/data/testimonials";
import { formatCompactINR } from "@/lib/finance";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/home/sections";
import { Reveal } from "@/components/motion";
import { Initials, Stars } from "@/components/ui";
import { TestimonialWall } from "./testimonial-wall";

export const metadata = {
  title: "Customer stories",
  description: `What borrowers say about getting their loan through ${brand.short}.`,
};

export default function TestimonialsPage() {
  // featured quote is set in the display serif, so pick one without figures
  const featured = testimonials.find((t) => t.name === "Pooja Mehta") ?? testimonials[0];
  const featuredLoan = loans.find((l) => l.slug === featured.loan);

  return (
    <>
      <PageHero
        crumb="Testimonials"
        eyebrow="Happy customers"
        lines={["Real people.", <em key="stories" className="text-saffron-ink">Real stories.</em>]}
        description="Here's what our customers have to say about their loan journey with us — including the parts that took longer than they'd hoped."
        aside={
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-end gap-4">
              <p className="figure text-6xl leading-none text-ink tabular">{ratingSummary.average}</p>
              <div className="pb-1">
                <Stars rating={5} />
                <p className="mt-1 text-xs text-muted">
                  from {ratingSummary.total.toLocaleString("en-IN")} verified reviews
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-2" aria-label="Rating distribution">
              {ratingSummary.distribution.map((row) => (
                <li key={row.stars} className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3 text-xs">
                  <span className="text-ink-soft tabular">{row.stars} star</span>
                  <span className="h-2 rounded-[4px] bg-surface-2">
                    <span
                      className="block h-full rounded-[4px] bg-saffron"
                      style={{ width: `${row.share * 100}%` }}
                      title={`${row.stars} star: ${Math.round(row.share * 100)}%`}
                    />
                  </span>
                  <span className="text-right font-semibold text-ink tabular">{Math.round(row.share * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <section className="py-16 md:py-20">
        <div className="shell">
          <Reveal as="figure" className="grid gap-8 rounded-[1.75rem] bg-navy p-8 text-on-navy md:grid-cols-12 md:p-12">
            <div className="md:col-span-8">
              <span aria-hidden="true" className="block text-[6rem] font-semibold leading-[0.5] text-saffron">
                &ldquo;
              </span>
              <blockquote className="mt-2 heading-quote">
                {featured.quote}
              </blockquote>
            </div>
            <figcaption className="flex flex-col justify-end gap-4 md:col-span-4 md:border-l md:border-white/10 md:pl-10">
              <Initials name={featured.name} className="size-14 text-xl" />
              <div>
                <p className="text-lg font-semibold">{featured.name}</p>
                <p className="text-sm text-on-navy-muted">
                  {featured.role}, {featured.city}
                </p>
              </div>
              <p className="text-sm text-saffron">
                {featuredLoan?.name} · {formatCompactINR(featured.amount)} · sanctioned in {featured.days} days
              </p>
            </figcaption>
          </Reveal>

          <div className="mt-16">
            <TestimonialWall />
          </div>
        </div>
      </section>

      <CtaBand title="Write the next story with us." />
    </>
  );
}
