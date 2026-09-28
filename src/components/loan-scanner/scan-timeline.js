/* ---------------------------------------------------------------------------
   The DSA hero animation, as one controllable GSAP timeline.

   This module knows nothing about React. It is handed the stage element and
   finds everything it animates through `data-*` hooks, so the UI components
   stay declarative: move a card in `lenders.js`, hide one at a breakpoint in
   CSS, or drop a lender entirely, and the sequence re-reads the DOM and adapts.

   Structure
   ---------
   master
     +- intro   plays once: the cluster and the scanner arrive
     +- loop    repeat: -1 — scan, compare, match, approve, reset

   The loop both starts *and* ends in the resting state, so the repeat is
   seamless: nothing pops, nothing snaps back.

   Timings live in TIMING below — the whole story can be re-paced from there.
--------------------------------------------------------------------------- */

import gsap from "gsap";
import { formatINR } from "@/lib/finance";

export const TIMING = {
  /** dwell after the cluster settles, before the first card is read */
  lead: 0.45,
  /** one full scan: travel + read + verdict (design brief asks for 0.7–1s) */
  step: 1.05,
  /** scanner home -> result card -> LOAN APPROVED */
  finale: 3.5,
  /** how long the approved state stays on screen */
  hold: 1.85,
  /** dissolve back to the cluster */
  outro: 0.95,
  /** breath between cycles */
  gap: 0.7,
};

const EASE = {
  travel: "power2.inOut",
  out: "power3.out",
  in: "power2.in",
  pop: "back.out(2.4)",
  arrive: "back.out(1.5)",
};

const STATUS_OPENING = "Finding your best match…";
const STATUS_APPROVED = "Loan approved ✓";

/* ---------- DOM lookup ---------------------------------------------------- */

const all = (root, selector) => gsap.utils.toArray(root.querySelectorAll(selector));

function collect(stage) {
  const plane = stage.querySelector("[data-plane]");
  return {
    stage,
    plane,
    slots: all(stage, "[data-slot]"),
    floats: all(stage, "[data-float]"),
    cards: all(stage, "[data-card]"),
    orbit: stage.querySelector("[data-orbit]"),
    cardGlows: all(stage, "[data-card-glow]"),
    cardLines: all(stage, "[data-card-line]"),
    cardChecks: all(stage, "[data-card-check]"),
    cardRates: all(stage, "[data-slot] [data-count]"),
    scanner: stage.querySelector("[data-scanner]"),
    scannerFloat: stage.querySelector("[data-scanner-float]"),
    scannerTilt: stage.querySelector("[data-scanner-tilt]"),
    beam: stage.querySelector("[data-beam]"),
    ping: stage.querySelector("[data-ping]"),
    lensFlare: stage.querySelector("[data-lens-flare]"),
    particles: all(stage, "[data-particle]"),
    status: stage.querySelector("[data-status]"),
    statusText: stage.querySelector("[data-status-text]"),
    approval: stage.querySelector("[data-approval]"),
    approvalBits: all(stage, "[data-approval-bit]"),
    approvalCounts: all(stage, "[data-approval] [data-count]"),
    check: stage.querySelector("[data-approval-check]"),
    checkPath: stage.querySelector("[data-approval-check-path]"),
    stamp: stage.querySelector("[data-approval-stamp]"),
    stampGlow: stage.querySelector("[data-approval-stamp-glow]"),
    sparkles: all(stage, "[data-sparkle]"),
  };
}

/**
 * The cards the scanner visits, in order — and only the ones the current
 * breakpoint actually shows. A card hidden by CSS has no offsetParent, so the
 * phone layout (3 cards) shortens the sequence to 3 scans on its own.
 */
export function getScanSteps(stage) {
  return all(stage, "[data-slot][data-scan-order]")
    .filter((slot) => slot.offsetParent !== null)
    .sort((a, b) => Number(a.dataset.scanOrder) - Number(b.dataset.scanOrder));
}

/* ---------- small helpers ------------------------------------------------ */

/** Particle throws and sparkle spreads are authored at a 34rem stage. */
const sizeScale = (plane) => gsap.utils.clamp(0.62, 1, plane.clientWidth / 544);

function applyStatus(els, text, tone) {
  els.statusText.textContent = text;
  els.status.dataset.tone = tone;
}

/** Cross-fades the status pill to its next line. */
function pushStatus(tl, els, text, tone, at) {
  tl.to(els.statusText, { autoAlpha: 0, y: -7, duration: 0.17, ease: EASE.in }, at)
    .call(applyStatus, [els, text, tone], at + 0.17)
    .fromTo(
      els.statusText,
      { autoAlpha: 0, y: 9 },
      { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE.out },
      at + 0.18,
    );
}

function renderCount(value, el) {
  if (el.dataset.countFormat === "inr") return formatINR(value);
  return value.toFixed(Number(el.dataset.countDecimals ?? 0));
}

/**
 * Ticks an element's text from data-count-from to data-count-to. Reading the
 * numbers off the DOM keeps every figure in one place: the JSX renders the
 * final value (which is what a visitor without JavaScript, or with reduced
 * motion, sees) and the timeline animates towards that same value.
 */
function countTo(tl, el, duration, at) {
  if (!el) return;
  const to = Number(el.dataset.countTo);
  const from = Number(el.dataset.countFrom ?? to);
  const proxy = { value: from };
  tl.fromTo(
    proxy,
    { value: from },
    {
      value: to,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = renderCount(proxy.value, el);
      },
    },
    at,
  );
}

/* ---------- resting state ------------------------------------------------ */

/**
 * Winds the figures back to their opening values and clears the green
 * "checked" styling, so every cycle starts from an un-compared cluster.
 */
function rewind(els) {
  els.cardRates.forEach((el) => {
    el.textContent = renderCount(Number(el.dataset.countFrom ?? el.dataset.countTo), el);
  });
  els.cards.forEach((card) => {
    delete card.dataset.state;
  });
}

/**
 * The state the loop starts and ends in: a cluster of lenders floating around
 * an idle scanner, no verdicts yet. Written as zero-duration sets so it also
 * serves as the loop's own reset on every repeat.
 */
function reset(tl, els, at = 0) {
  tl.set(els.slots, { xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1, y: 0 }, at)
    .set(els.floats, { z: 0 }, at)
    .set(els.cardGlows, { autoAlpha: 0 }, at)
    .set(els.cardLines, { autoAlpha: 0, yPercent: -140 }, at)
    .set(els.cardChecks, { autoAlpha: 0, scale: 0.4 }, at)
    .call(rewind, [els], at)
    .set(els.scanner, { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 1, scale: 1 }, at)
    .set(els.scannerTilt, { rotate: 0 }, at)
    .set(els.ping, { autoAlpha: 0, scale: 0.35 }, at)
    .set(els.lensFlare, { autoAlpha: 0, scale: 1 }, at)
    .set(els.particles, { autoAlpha: 0, x: 0, y: 0, scale: 0.35 }, at)
    .set(els.approval, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.82, y: 8 }, at)
    .set(els.approvalBits, { autoAlpha: 0, y: 12 }, at)
    .set(els.check, { autoAlpha: 0, scale: 0.3 }, at)
    .set(els.stamp, { autoAlpha: 0, scale: 0.88, y: 8 }, at)
    .set(els.stampGlow, { autoAlpha: 0, scale: 0.85 }, at)
    .set(els.sparkles, { autoAlpha: 0, scale: 0, x: 0, y: 0 }, at)
    .set(els.orbit, { autoAlpha: 1 }, at)
    .set(els.statusText, { autoAlpha: 1, y: 0 }, at);

  if (els.checkPath) {
    const length = els.checkPath.getTotalLength?.() || 44;
    tl.set(els.checkPath, { strokeDasharray: length, strokeDashoffset: length }, at);
  }
}

/* ---------- the sequence ------------------------------------------------- */

function buildIntro(els) {
  const tl = gsap.timeline();
  reset(tl, els, 0);
  tl.fromTo(
    els.slots,
    { autoAlpha: 0, scale: 0.84, y: 18 },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: EASE.out, stagger: 0.06 },
    0,
  )
    .fromTo(
      els.scanner,
      { autoAlpha: 0, scale: 0.55 },
      { autoAlpha: 1, scale: 1, duration: 0.75, ease: EASE.arrive },
      0.18,
    )
    .fromTo(
      els.statusText,
      { autoAlpha: 0, y: 9 },
      { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE.out },
      0.4,
    );
  return tl;
}

function buildLoop(els, steps) {
  const { plane } = els;
  // Function-based targets: the timeline never hard-codes a pixel, so a resize
  // only needs tl.invalidate() for the scanner to re-aim at the cards.
  // The lens settles over a card's top-right corner: close enough to be
  // reading it, clear of the lender name and the rate on the left.
  const toX = (slot) => () =>
    slot.offsetLeft - plane.clientWidth / 2 + slot.offsetWidth * 0.3;
  const toY = (slot) => () =>
    slot.offsetTop - plane.clientHeight / 2 - slot.offsetHeight * 0.3;
  const throwX = (i, el) => Number(el.dataset.dx) * sizeScale(plane);
  const throwY = (i, el) => Number(el.dataset.dy) * sizeScale(plane);

  const tl = gsap.timeline({ repeat: -1, repeatDelay: TIMING.gap });
  reset(tl, els, 0);
  tl.call(applyStatus, [els, STATUS_OPENING, "scanning"], 0);

  /* --- scan each lender in turn ---------------------------------------- */
  steps.forEach((slot, index) => {
    const at = TIMING.lead + index * TIMING.step;
    const glow = slot.querySelector("[data-card-glow]");
    const line = slot.querySelector("[data-card-line]");
    const check = slot.querySelector("[data-card-check]");
    const rate = slot.querySelector("[data-count]");
    const float = slot.querySelector("[data-float]");

    tl.addLabel(`scan-${index}`, at)
      // travel
      .to(els.scanner, { x: toX(slot), y: toY(slot), duration: 0.5, ease: EASE.travel }, at)
      .to(
        els.scannerTilt,
        { rotate: index % 2 === 0 ? 7 : -7, duration: 0.5, ease: EASE.travel },
        at,
      )
      // the card wakes up under the lens
      .to(float, { z: 30, duration: 0.42, ease: EASE.out }, at + 0.3)
      .to(glow, { autoAlpha: 1, duration: 0.3 }, at + 0.34)
      .fromTo(
        els.ping,
        { autoAlpha: 0.85, scale: 0.35 },
        { autoAlpha: 0, scale: 1.55, duration: 0.7, ease: EASE.out },
        at + 0.34,
      )
      .fromTo(
        line,
        { autoAlpha: 1, yPercent: -140 },
        { yPercent: 155, duration: 0.5, ease: "none" },
        at + 0.36,
      )
      .to(line, { autoAlpha: 0, duration: 0.14 }, at + 0.86)
      // tiny rupee / percent / tick chips puff out of the lens
      .fromTo(
        els.particles,
        { autoAlpha: 0, x: 0, y: 0, scale: 0.35 },
        {
          autoAlpha: 1,
          x: throwX,
          y: throwY,
          scale: 1,
          duration: 0.5,
          ease: EASE.out,
          stagger: 0.04,
        },
        at + 0.4,
      )
      .to(els.particles, { autoAlpha: 0, scale: 0.6, duration: 0.3, stagger: 0.04 }, at + 0.72);
    // the rate settles on this lender's real number
    countTo(tl, rate, 0.55, at + 0.5);
    // verdict
    pushStatus(tl, els, slot.dataset.statusPending, "scanning", at + 0.34);
    pushStatus(tl, els, slot.dataset.statusDone, "done", at + 0.82);
    tl.call(
      (card) => {
        card.dataset.state = "checked";
      },
      [slot.querySelector("[data-card]")],
      at + 0.84,
    )
      .fromTo(
        check,
        { autoAlpha: 0, scale: 0.3 },
        { autoAlpha: 1, scale: 1, duration: 0.45, ease: EASE.pop },
        at + 0.86,
      )
      .to(float, { z: 10, duration: 0.45, ease: EASE.out }, at + 0.92)
      .to(glow, { autoAlpha: 0.45, duration: 0.45 }, at + 0.92);
  });

  /* --- the match -------------------------------------------------------- */
  const f = TIMING.lead + steps.length * TIMING.step;
  tl.addLabel("match", f)
    // scanner comes home
    .to(els.scanner, { x: 0, y: 0, duration: 0.6, ease: EASE.travel }, f)
    .to(els.scannerTilt, { rotate: 0, duration: 0.6, ease: EASE.travel }, f)
    // the shortlist steps back
    .to(els.slots, { scale: 0.88, autoAlpha: 0.28, duration: 0.7, stagger: 0.03 }, f + 0.25)
    .to(els.floats, { z: -45, duration: 0.7, stagger: 0.03 }, f + 0.25)
    .to(els.cardGlows, { autoAlpha: 0, duration: 0.4 }, f + 0.25)
    .to(els.orbit, { autoAlpha: 0.25, duration: 0.7 }, f + 0.25)
    // the lens flares and hands over to the offer
    .fromTo(
      els.lensFlare,
      { autoAlpha: 0, scale: 1 },
      { autoAlpha: 1, scale: 1.5, duration: 0.35 },
      f + 0.55,
    )
    .to(els.scanner, { autoAlpha: 0, scale: 1.3, duration: 0.4, ease: EASE.in }, f + 0.72)
    .fromTo(
      els.approval,
      { autoAlpha: 0, scale: 0.82, y: 8 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.62, ease: EASE.arrive },
      f + 0.8,
    )
    // BEST MATCH -> checkmark -> the offer itself
    .to(els.approvalBits[0], { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.pop }, f + 0.88)
    .fromTo(
      els.check,
      { autoAlpha: 0, scale: 0.3 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.8)" },
      f + 0.98,
    )
    .to(els.checkPath, { strokeDashoffset: 0, duration: 0.42, ease: EASE.travel }, f + 1.16)
    .to(
      els.approvalBits.slice(1),
      { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.out, stagger: 0.06 },
      f + 1.16,
    );
  els.approvalCounts.forEach((el) => countTo(tl, el, 0.85, f + 1.32));
  // LOAN APPROVED
  pushStatus(tl, els, STATUS_APPROVED, "approved", f + 1.85);
  tl.fromTo(
    els.stamp,
    { autoAlpha: 0, scale: 0.88, y: 8 },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.9)" },
    f + 1.92,
  )
    .fromTo(
      els.stampGlow,
      { autoAlpha: 0, scale: 0.85 },
      { autoAlpha: 0.95, scale: 1.12, duration: 0.5, ease: EASE.out },
      f + 1.97,
    )
    .to(els.stampGlow, { autoAlpha: 0.35, duration: 0.7 }, f + 2.52)
    // a dozen sparkles, and no more than that
    .fromTo(
      els.sparkles,
      { autoAlpha: 0, scale: 0, x: 0, y: 0 },
      {
        autoAlpha: 1,
        scale: 1,
        x: throwX,
        y: throwY,
        duration: 0.75,
        ease: EASE.out,
        stagger: 0.03,
      },
      f + 1.97,
    )
    .to(els.sparkles, { autoAlpha: 0, scale: 0.2, duration: 0.5, stagger: 0.03 }, f + 2.44);

  /* --- dissolve back to the cluster ------------------------------------- */
  const out = f + TIMING.finale + TIMING.hold;
  tl.addLabel("reset", out)
    // wind the figures back while the cluster is still dimmed and unreadable,
    // so the numbers never visibly snap at the seam between cycles
    .call(rewind, [els], out + 0.08)
    .to(els.approval, { autoAlpha: 0, scale: 0.95, y: -10, duration: 0.55, ease: EASE.in }, out)
    .to(els.stampGlow, { autoAlpha: 0, duration: 0.3 }, out)
    .to(els.slots, { autoAlpha: 1, scale: 1, duration: 0.7, ease: EASE.out, stagger: 0.04 }, out + 0.15)
    .to(els.floats, { z: 0, duration: 0.7, ease: EASE.out, stagger: 0.04 }, out + 0.15)
    .to(els.orbit, { autoAlpha: 1, duration: 0.7, ease: EASE.out }, out + 0.15)
    .to(els.scanner, { autoAlpha: 1, scale: 1, duration: 0.55, ease: EASE.out }, out + 0.2)
    .to(els.cardChecks, { autoAlpha: 0, scale: 0.4, duration: 0.4 }, out + 0.25);
  pushStatus(tl, els, STATUS_OPENING, "scanning", out + 0.3);
  // pad to a whole cycle so the repeat lands on a settled stage
  tl.to({}, { duration: 0.01 }, out + TIMING.outro);

  return tl;
}

/* ---------- ambient motion ---------------------------------------------- */

/**
 * The never-ending bits: the cluster breathing and the radar sweep in the
 * lens. Kept out of the main timeline so pausing the story (on hover) doesn't
 * freeze the scene solid, and so they animate properties the timeline doesn't.
 */
function buildAmbient(els) {
  els.floats.forEach((float, index) => {
    gsap.to(float, {
      y: index % 2 === 0 ? -9 : 7,
      duration: 3.1 + (index % 3) * 0.55,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.28,
    });
  });

  gsap.to(els.scannerFloat, {
    y: -7,
    duration: 3.4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(els.beam, { rotate: 360, duration: 3.6, ease: "none", repeat: -1 });
}

/* ---------- public API --------------------------------------------------- */

/**
 * Builds the whole hero animation for a stage element.
 *
 * Returns { master, loop, els }. The master is paused — the caller decides
 * when it runs (see use-scan-sequence.js, which waits for the hero to scroll
 * into view). The loop carries labels: scan-0 … scan-n, match, reset.
 */
export function buildScanTimeline(stage) {
  const els = collect(stage);
  const steps = getScanSteps(stage);

  buildAmbient(els);

  const intro = buildIntro(els);
  const loop = buildLoop(els, steps);
  const master = gsap.timeline({ paused: true });
  master.add(intro).add(loop);

  // lift the loop's labels onto the master so master.seek("match") works
  const offset = intro.duration();
  Object.entries(loop.labels).forEach(([name, time]) => master.addLabel(name, offset + time));

  return { master, loop, els };
}

/**
 * What a visitor who asked for reduced motion gets: the end of the story,
 * held still. No timeline is created, so nothing animates and nothing loops.
 */
export function applyStaticApprovedState(stage) {
  const els = collect(stage);
  const scanned = all(stage, "[data-slot][data-scan-order]");

  gsap.set(els.slots, { xPercent: -50, yPercent: -50, autoAlpha: 0.32, scale: 0.9 });
  gsap.set(els.floats, { z: -30 });
  gsap.set(
    scanned.map((slot) => slot.querySelector("[data-card-check]")),
    { autoAlpha: 1, scale: 1 },
  );
  scanned.forEach((slot) => {
    slot.querySelector("[data-card]").dataset.state = "checked";
  });
  gsap.set(els.scanner, { autoAlpha: 0 });
  gsap.set(els.approval, { xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1, y: 0 });
  gsap.set(els.approvalBits, { autoAlpha: 1, y: 0 });
  gsap.set(els.check, { autoAlpha: 1, scale: 1 });
  gsap.set(els.stamp, { autoAlpha: 1, scale: 1, y: 0 });
  gsap.set(els.stampGlow, { autoAlpha: 0.45, scale: 1 });
  applyStatus(els, STATUS_APPROVED, "approved");
}
