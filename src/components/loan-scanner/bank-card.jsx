"use client";

import { useCallback, useRef } from "react";
import { Building2, Check, Landmark } from "lucide-react";
import styles from "./loan-scanner.module.css";

/**
 * One small floating lender card.
 *
 * The component is deliberately dumb: it renders a resting state and publishes
 * the `data-*` hooks the timeline animates (see scan-timeline.js). It holds no
 * animation state of its own, so the sequence can be re-paced or re-routed
 * without touching this file.
 *
 * The only motion it owns is the pointer tilt, which follows the cursor and so
 * can't live in a pre-built timeline. It writes two custom properties; the
 * transform that uses them is in the stylesheet.
 */
export function BankCard({ lender, hidden = false }) {
  const cardRef = useRef(null);
  const frame = useRef(0);

  const tilt = useCallback((event) => {
    const card = cardRef.current;
    if (!card || frame.current) return;
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const box = card.getBoundingClientRect();
      const x = (clientX - box.left) / box.width - 0.5;
      const y = (clientY - box.top) / box.height - 0.5;
      card.dataset.tilting = "true";
      card.style.setProperty("--tilt-y", `${(x * 16).toFixed(2)}deg`);
      card.style.setProperty("--tilt-x", `${(-y * 12).toFixed(2)}deg`);
    });
  }, []);

  const untilt = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    delete card.dataset.tilting;
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  }, []);

  const { name, kind, rate, rateFrom, tint, pos, posSm, scan } = lender;

  return (
    <div
      data-slot
      data-scan-order={scan?.order}
      data-status-pending={scan?.pending}
      data-status-done={scan?.done}
      className={`${styles.slot} ${hidden ? styles.slotCompactHidden : ""}`}
      style={{
        "--x": `${pos.x}%`,
        "--y": `${pos.y}%`,
        "--x-sm": posSm ? `${posSm.x}%` : undefined,
        "--y-sm": posSm ? `${posSm.y}%` : undefined,
      }}
    >
      <div data-float className={styles.float}>
        <span data-card-glow className={styles.cardGlow} />

        <article
          ref={cardRef}
          data-card
          className={styles.card}
          onPointerMove={tilt}
          onPointerLeave={untilt}
          style={{ "--mark-bg": tint.bg, "--mark-ink": tint.ink }}
        >
          <div className={styles.cardTop}>
            <span className={styles.mark}>
              {kind === "NBFC" ? (
                <Building2 className={styles.markIcon} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Landmark className={styles.markIcon} strokeWidth={2} aria-hidden="true" />
              )}
            </span>
            <span className={styles.cardIdentity}>
              <span className={styles.cardName}>{name}</span>
              <span className={styles.cardKind}>{kind}</span>
            </span>
          </div>

          <div className={styles.cardBottom}>
            <span className={styles.cardRate}>
              {/* The final figure is what is rendered; the timeline counts down
                  to it from data-count-from. */}
              <span
                data-count
                data-count-from={scan ? rateFrom : undefined}
                data-count-to={rate}
                data-count-decimals="2"
              >
                {rate.toFixed(2)}
              </span>
              %
            </span>
            <span className={styles.cardRateUnit}>p.a.</span>
          </div>

          <span data-card-line className={styles.cardLine} />
          <span data-card-check className={styles.cardCheck}>
            <Check className={styles.cardCheckIcon} strokeWidth={3.5} aria-hidden="true" />
          </span>
        </article>
      </div>
    </div>
  );
}
