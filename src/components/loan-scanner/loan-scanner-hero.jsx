"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ApprovalCard } from "./approval-card";
import { BankCard } from "./bank-card";
import { brand } from "@/data/site";
import { bestMatch, lenders } from "./lenders";
import { LoanScanner } from "./loan-scanner";
import { useScanSequence } from "./use-scan-sequence";
import styles from "./loan-scanner.module.css";

/**
 * DSA hero — "we scan multiple banks & NBFCs, compare their offers, find the
 * right match, loan approved", told in about eleven seconds without asking
 * anyone to read much.
 *
 * Composition only: the copy on the left, the stage on the right, and the
 * `data-*` hooks the timeline drives. Sequencing lives in scan-timeline.js and
 * its lifecycle in use-scan-sequence.js.
 *
 * @param {string}   [eyebrow]  the small label above the headline
 * @param {string}   [ctaHref]  where "Find My Best Loan" goes (default /apply)
 * @param {Function} [onCtaClick] use instead of ctaHref to open a flow in place
 */
export function LoanScannerHero({
  eyebrow = `${brand.short} · Loan comparison`,
  ctaHref = "/apply",
  onCtaClick,
}) {
  const { stageRef } = useScanSequence();

  const cta = (
    <>
      Find My Best Loan
      <ArrowRight className={styles.ctaArrow} strokeWidth={2.4} aria-hidden="true" />
    </>
  );

  return (
    <section className={styles.hero} aria-labelledby="dsa-hero-heading">
      <span aria-hidden="true" className={styles.backdrop} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.eyebrowDot} />
            {eyebrow}
          </p>

          <h1 id="dsa-hero-heading" className={styles.headline}>
            <span className={styles.headlineLine}>Find the{" "}
              <em className={styles.accent}>
                Right
                <svg
                  aria-hidden="true"
                  className={styles.accentStroke}
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M2 8.5C36 3.6 92 2.2 198 4.4"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </em>{" "}
              Loan.
            </span>
            <span className={styles.headlineLine}>Not Just Any Loan.</span>
          </h1>

          <p className={styles.support}>
            We compare loan options from multiple banks &amp; NBFCs to help you find the one that
            fits you best.
          </p>

          <div className={styles.actions}>
            {onCtaClick ? (
              <button type="button" className={styles.cta} onClick={onCtaClick}>
                {cta}
              </button>
            ) : (
              <Link href={ctaHref} className={styles.cta}>
                {cta}
              </Link>
            )}
          </div>

          <p className={styles.trust}>
            Compare <span className={styles.trustSep}>•</span> Choose{" "}
            <span className={styles.trustSep}>•</span> Apply
          </p>
        </div>

        <div className={styles.stageWrap}>
          {/* The animation is decorative storytelling, so it is hidden from
              assistive tech and summarised in one sentence instead. */}
          <p className={styles.srOnly}>
            We scan our lending partners — {lenders.map((lender) => lender.name).join(", ")} —
            compare their offers and surface the best match. Today that is {bestMatch.lender.name}{" "}
            at {bestMatch.rate}% a year on a {bestMatch.product.toLowerCase()}.
          </p>

          <div ref={stageRef} className={styles.stage} aria-hidden="true">
            <div data-plane className={styles.plane}>
              <span className={styles.platform} />
              <span data-orbit className={styles.orbit} />

              {lenders.map((lender) => (
                <BankCard key={lender.id} lender={lender} hidden={!lender.compact} />
              ))}
            </div>

            {/* flat layer above the plane — see .overlay in the stylesheet */}
            <div className={styles.overlay}>
              <LoanScanner />
              <ApprovalCard />
            </div>

            <p data-status data-tone="scanning" className={styles.status}>
              <span className={styles.statusDot} />
              <span data-status-text className={styles.statusText}>
                Finding your best match…
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
