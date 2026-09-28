"use client";

import { lensParticles } from "./lenders";
import styles from "./loan-scanner.module.css";

/**
 * The scanner: a small 3D magnifying glass with a green rim, a glass lens, a
 * radar beam and a puff of ₹ / % / ✓ chips.
 *
 * Three nested wrappers, each owned by exactly one piece of motion, so the
 * transforms never collide:
 *   data-scanner        travel between cards (main timeline)
 *   data-scanner-float  idle bob (ambient tween)
 *   data-scanner-tilt   lean into the direction of travel (main timeline)
 */
export function LoanScanner() {
  return (
    <div data-scanner className={styles.scanner}>
      <div data-scanner-float className={styles.scannerFloat}>
        <div data-scanner-tilt className={styles.scannerTilt}>
          <span data-ping className={styles.ping} />

          <div className={styles.lensRing}>
            <div className={styles.lensGlass}>
              <span data-beam className={styles.beam} />
              <span className={styles.lensGrid} />
              <span className={styles.lensCross} />
              <span data-lens-flare className={styles.lensFlare} />
            </div>
          </div>

          <span className={styles.handle} />

          <div className={styles.particles}>
            {lensParticles.map((particle, index) => (
              <span
                key={index}
                data-particle
                data-dx={particle.dx}
                data-dy={particle.dy}
                className={`${styles.particle} ${particle.glyph === "✓" ? styles.particleOk : ""}`}
              >
                {particle.glyph}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
