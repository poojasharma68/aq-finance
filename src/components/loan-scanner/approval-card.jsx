"use client";

import { useId } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { formatCompactINR, formatINR } from "@/lib/finance";
import { bestMatch, sparkles } from "./lenders";
import styles from "./loan-scanner.module.css";

/**
 * The payoff: one highlighted offer, a checkmark, and LOAN APPROVED.
 *
 * Every figure is rendered at its final value and carries the `data-count-*`
 * attributes the timeline counts *towards*. That way the card is complete and
 * truthful before any JavaScript runs — which is also exactly what a visitor
 * who asked for reduced motion is shown.
 *
 * The elements tagged `data-approval-bit` are revealed in DOM order, so the
 * reading order and the animation order are the same thing.
 */
export function ApprovalCard() {
  // useId is unique per instance, so two heroes on one page keep their own
  // gradient; the sanitising keeps it valid inside url(#…).
  const gradientId = `dsa-check-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { lender, product, amount, months, rate, rateFrom, emi, emiFrom } = bestMatch;

  return (
    <div data-approval className={styles.approval}>
      <div className={styles.approvalCard}>
        <span data-approval-bit className={styles.approvalBadge}>
          <Check className={styles.approvalBadgeIcon} strokeWidth={4} aria-hidden="true" />
          Best match
        </span>

        <svg
          data-approval-check
          className={styles.check}
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2cc98a" />
              <stop offset="1" stopColor="#0a7a4e" />
            </linearGradient>
          </defs>
          <circle className={styles.checkRing} cx="32" cy="32" r="28" fill={`url(#${gradientId})`} />
          <path
            data-approval-check-path
            className={styles.checkPath}
            d="M20 33.2 L28.4 41.6 L44 25"
          />
        </svg>

        <p data-approval-bit className={styles.approvalLabel}>
          Loan option found
        </p>
        <p data-approval-bit className={styles.approvalLender}>
          {lender.name}
        </p>
        <p data-approval-bit className={styles.approvalMeta}>
          {product} · {formatCompactINR(amount)} · {months} months
        </p>

        <div data-approval-bit className={styles.approvalFigures}>
          <div className={styles.figureCell}>
            <span className={styles.figureValue}>
              <span
                data-count
                data-count-from={rateFrom}
                data-count-to={rate}
                data-count-decimals="2"
              >
                {rate.toFixed(2)}
              </span>
              %
            </span>
            <span className={styles.figureLabel}>Interest p.a.</span>
          </div>
          <div className={styles.figureCell}>
            <span className={styles.figureValue}>
              <span
                data-count
                data-count-from={Math.round(emiFrom)}
                data-count-to={Math.round(emi)}
                data-count-format="inr"
              >
                {formatINR(emi)}
              </span>
            </span>
            <span className={styles.figureLabel}>Monthly EMI</span>
          </div>
        </div>

        <div className={styles.stampWrap}>
          <span data-approval-stamp-glow className={styles.stampGlow} />
          <p data-approval-stamp className={styles.stamp}>
            <ShieldCheck className={styles.stampIcon} strokeWidth={2.5} aria-hidden="true" />
            Loan approved
          </p>
        </div>
      </div>

      <div className={styles.sparkles} aria-hidden="true">
        {sparkles.map((sparkle, index) => (
          <svg
            key={index}
            data-sparkle
            data-dx={sparkle.dx}
            data-dy={sparkle.dy}
            className={styles.sparkle}
            viewBox="0 0 10 10"
          >
            <path
              d="M5 0 L6.15 3.85 L10 5 L6.15 6.15 L5 10 L3.85 6.15 L0 5 L3.85 3.85 Z"
              fill="currentColor"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
