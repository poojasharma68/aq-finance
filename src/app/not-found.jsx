import { ButtonLink } from "@/components/button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="column-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="shell flex min-h-[70vh] flex-col items-start justify-center py-20">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-5 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-tight text-ink">
          This page took <em className="text-saffron-ink">a detour.</em>
        </h1>
        <p className="mt-6 max-w-md text-ink-soft">
          The link may be old or mistyped. Your loan journey doesn&apos;t have to be — start from one of these instead.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/loans" variant="outline">
            Loan products
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
