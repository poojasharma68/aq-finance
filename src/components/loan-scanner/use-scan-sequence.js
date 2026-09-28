"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { applyStaticApprovedState, buildScanTimeline, getScanSteps } from "./scan-timeline";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Wires the GSAP sequence to a stage element and looks after its lifecycle.
 * All the choreography lives in scan-timeline.js — this hook only decides
 * *when* it should be running:
 *
 *  - reduced motion   no timeline at all; the approved state is shown still
 *  - off screen       paused, so an above-the-fold loop costs nothing once
 *                     the visitor scrolls past it
 *  - card hovered     paused, so the story holds while they read the card
 *  - resized          re-aimed; rebuilt only if the breakpoint changed which
 *                     lenders are on screen
 *
 * Returns the stage ref plus controls, so a caller can drive the sequence
 * directly — controls.seek("match") jumps to the result, for instance.
 */
export function useScanSequence() {
  const stageRef = useRef(null);
  const timelineRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = { visible: false, hovering: false };
    let context;
    let steps = 0;
    let resizeTimer;

    const sync = () => {
      const timeline = timelineRef.current;
      if (!timeline) return;
      if (state.visible && !state.hovering) timeline.play();
      else timeline.pause();
    };

    const build = () => {
      context?.revert();
      timelineRef.current = null;
      steps = getScanSteps(stage).length;

      context = gsap.context(() => {
        if (reduceMotion.matches) {
          applyStaticApprovedState(stage);
          return;
        }
        timelineRef.current = buildScanTimeline(stage).master;
      }, stage);

      sync();
    };

    build();

    /* --- only run while the hero is on screen --------------------------- */
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 },
    );
    observer.observe(stage);

    /* --- hold the sequence while a card is hovered ---------------------- */
    const onPointerOver = (event) => {
      if (!event.target.closest?.("[data-card]")) return;
      state.hovering = true;
      sync();
    };

    const onPointerOut = (event) => {
      const card = event.target.closest?.("[data-card]");
      if (!card) return;
      // ignore moves between the card's own children
      if (event.relatedTarget && card.contains(event.relatedTarget)) return;
      state.hovering = false;
      sync();
    };

    stage.addEventListener("pointerover", onPointerOver);
    stage.addEventListener("pointerout", onPointerOut);

    /* --- keep the scan aimed at the cards ------------------------------- */
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // a breakpoint may have added or removed lenders, which changes the
        // number of scans — that needs a rebuild, a plain resize does not
        if (getScanSteps(stage).length !== steps) build();
        else timelineRef.current?.invalidate();
      }, 180);
    });
    resizeObserver.observe(stage);

    const onPreferenceChange = () => build();
    reduceMotion.addEventListener("change", onPreferenceChange);

    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
      resizeObserver.disconnect();
      stage.removeEventListener("pointerover", onPointerOver);
      stage.removeEventListener("pointerout", onPointerOut);
      reduceMotion.removeEventListener("change", onPreferenceChange);
      context?.revert();
      timelineRef.current = null;
    };
  }, []);

  const controls = useMemo(
    () => ({
      play: () => timelineRef.current?.play(),
      pause: () => timelineRef.current?.pause(),
      restart: () => timelineRef.current?.restart(),
      /** labels: scan-0 … scan-n, match, reset */
      seek: (label) => timelineRef.current?.seek(label),
      timeline: () => timelineRef.current,
    }),
    [],
  );

  return { stageRef, controls };
}
