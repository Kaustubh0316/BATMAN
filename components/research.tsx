"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowLeft, ArrowRight, FlaskConical, Pause, Play } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SlideEyebrow, SlideHeading } from "@/components/ui/slide-transition";
import {
  RESEARCH_CONTENT,
  RESEARCH_INTERESTS,
  RESEARCH_TOPICS,
} from "@/lib/data";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );
}

/**
 * 3 Distinct 8-Bit Pixel Suit Emblems
 */
const SUIT_GRIDS: string[][] = [
  [
    ".##...##.",
    "###...###",
    ".###.###.",
    "...###...",
    "...###...",
    "...###...",
    ".###.###.",
    "###...###",
    ".##...##.",
  ],
  [
    "..##.##..",
    ".#######.",
    "###.#.###",
    ".##...##.",
    "..#...#..",
    ".##...##.",
    "###.#.###",
    ".#######.",
    "..##.##..",
  ],
  [
    "...###...",
    ".##...##.",
    ".#..#..#.",
    "##.###.##",
    "#..###..#",
    "##.###.##",
    ".#..#..#.",
    ".##...##.",
    "...###...",
  ],
];

function PixelSuitEmblem({ variant }: { variant: number }) {
  const rows = SUIT_GRIDS[variant % SUIT_GRIDS.length];
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="shrink-0"
    >
      {rows.map((row, y) =>
        row
          .split("")
          .map((ch, x) =>
            ch === "#" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill="#111111"
              />
            ) : null
          )
      )}
    </svg>
  );
}

/**
 * Symmetric 4-Quadrant 8-Bit Pixel-Art Ornamental Playing-Card Back
 */
const TOP_LEFT_QUADRANT: string[] = [
  "...............",
  ".#####...###...",
  ".#...##.#...#..",
  ".#.###..#.##...",
  ".#.#..###....#.",
  ".###....#.##...",
  ".....##........",
  "..##....#......",
  ".#..#..........",
  ".#.##..........",
  "...#...........",
  ".###...........",
  ".#..#..........",
  "..##...........",
  "............##.",
  ".###.......###.",
  ".#..#.....##.#.",
  "..##.......###.",
  ".#.........#...",
];

function PixelCardBackPattern() {
  const rects = useMemo(() => {
    const out: Array<{ x: number; y: number }> = [];
    const qH = TOP_LEFT_QUADRANT.length;
    const qW = TOP_LEFT_QUADRANT[0].length;
    const fullW = qW * 2 - 1;
    const fullH = qH * 2 - 1;

    for (let y = 0; y < fullH; y++) {
      const sy = y < qH ? y : fullH - 1 - y;
      for (let x = 0; x < fullW; x++) {
        const sx = x < qW ? x : fullW - 1 - x;
        if (TOP_LEFT_QUADRANT[sy]?.[sx] === "#") {
          out.push({ x, y });
        }
      }
    }
    return { cells: out, fullW, fullH };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${rects.fullW} ${rects.fullH}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="w-full h-full p-3.5 sm:p-4 select-none pointer-events-none"
    >
      {rects.cells.map((cell, idx) => (
        <rect
          key={idx}
          x={cell.x}
          y={cell.y}
          width={1.03}
          height={1.03}
          fill="#0b0c0e"
        />
      ))}
    </svg>
  );
}

// Continuous auto-rotation interval: exactly 3 seconds as requested
const DECK_INTERVAL_MS = 3000;

export function Research() {
  const reducedMotion = useReducedMotion();
  const { fieldLabels } = RESEARCH_CONTENT;
  const count = RESEARCH_TOPICS.length; // 3 topics

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoldingDeck, setIsHoldingDeck] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  // Virtual index in [0 .. count*3 - 1] (starts at middle copy `count` = 3) for seamless infinite carousel loop
  const [virtualIdx, setVirtualIdx] = useState(count);
  const [enableCarouselTransition, setEnableCarouselTransition] =
    useState(true);
  const [carouselMetrics, setCarouselMetrics] = useState({
    anchorLeft: 48,
    leadW: 380,
    dossierW: 660,
    innerGap: 20,
    pairGap: 20,
    isMobileStack: false,
  });

  const [cursorBadge, setCursorBadge] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const researchSectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const deckProgressBarRef = useRef<HTMLDivElement | null>(null);
  const dossierAnchorRef = useRef<HTMLDivElement | null>(null);
  const dossierSectionRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const innerFlipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressBarRefs = useRef<Array<HTMLDivElement | null>>([]);

  const timerStateRef = useRef({
    elapsed: 0,
    lastTs: 0,
    isHovered: false,
    isHeld: false,
    isManuallyPaused: false,
    inView: false,
  });

  // Continuous spring-driven 360-degree circular wheel state
  const wheelRef = useRef({
    pos: 0,
    target: 0,
    vel: 0,
    isDragging: false,
    moved: false,
    startX: 0,
    startPos: 0,
    rafId: null as number | null,
    reportedIdx: 0,
  });

  const normalizeIndex = useCallback(
    (val: number) => (((Math.round(val) % count) + count) % count),
    [count]
  );

  // Measure responsive widths & exact left alignment for the peeking horizontal paired-card track
  useEffect(() => {
    const updateMetrics = () => {
      const vw = window.innerWidth;
      const anchorEl = dossierAnchorRef.current;
      const anchorLeft = anchorEl
        ? Math.max(20, Math.round(anchorEl.getBoundingClientRect().left))
        : 48;
      const containerW = anchorEl
        ? Math.round(anchorEl.getBoundingClientRect().width)
        : Math.min(1152, vw - 48);

      if (vw < 860) {
        const cardW = Math.min(containerW, Math.round(vw * 0.86));
        setCarouselMetrics({
          anchorLeft,
          leadW: cardW,
          dossierW: cardW,
          innerGap: 0,
          pairGap: 16,
          isMobileStack: true,
        });
      } else {
        const innerGap = 20;
        const pairGap = 20;
        // Pair spans ~94% of container width so previous card peeks on far-left & next card peeks on far-right
        const totalPairW = Math.max(760, Math.round(containerW * 0.95));
        const leadW = Math.round(totalPairW * 0.365);
        const dossierW = totalPairW - leadW - innerGap;
        setCarouselMetrics({
          anchorLeft,
          leadW,
          dossierW,
          innerGap,
          pairGap,
          isMobileStack: false,
        });
      }
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  /**
   * Position all 3 playing cards along a closed 360° elliptical Ferris wheel:
   * - d =  0 (12 o'clock): Upright warm-ivory card front at top-center (0°).
   * - d = +1 (right side): Gunmetal pixel-art card back on RIGHT side, tilted 37.5° LEFT.
   * - d = -1 (left side):  Gunmetal pixel-art card back on LEFT side, tilted 37.5° RIGHT.
   */
  const renderWheelFrame = useCallback(
    (wheelPos: number) => {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const isDesktop = vw >= 768;
      const rx = isDesktop ? 358 : 254;
      const ry = isDesktop ? 294 : 238;
      const tiltBoost = isDesktop ? 26 : 28;

      for (let i = 0; i < count; i++) {
        const cardEl = cardRefs.current[i];
        const flipEl = innerFlipRefs.current[i];
        if (!cardEl || !flipEl) continue;

        let d = (((i - wheelPos) % count) + count) % count;
        if (d >= count / 2) d -= count;

        const thetaDeg = d * (360 / count);
        const thetaRad = (thetaDeg * Math.PI) / 180;

        const x = Math.sin(thetaRad) * rx;
        const y = (1 - Math.cos(thetaRad)) * ry;
        const rotZ = thetaDeg + tiltBoost * Math.sin(thetaRad);

        const rawFlip = Math.max(0, Math.min(1, (Math.abs(d) - 0.28) / 0.3));
        const smoothFlip = rawFlip * rawFlip * (3 - 2 * rawFlip);
        const flipDeg = smoothFlip * 180 * (d >= 0 ? 1 : -1);

        const scale = 1 - Math.min(1, Math.abs(d)) * (isDesktop ? 0.08 : 0.11);
        const zIdx = 50 - Math.round(Math.abs(d) * 20);

        cardEl.style.transform = `translate3d(calc(-50% + ${x.toFixed(
          1
        )}px), ${y.toFixed(1)}px, 0) rotate(${rotZ.toFixed(
          2
        )}deg) scale(${scale.toFixed(3)})`;
        cardEl.style.zIndex = String(zIdx);

        flipEl.style.transform = `rotateY(${flipDeg.toFixed(2)}deg)`;
      }
    },
    [count]
  );

  const resetProgressBars = useCallback(() => {
    timerStateRef.current.elapsed = 0;
    timerStateRef.current.lastTs = 0;
    if (deckProgressBarRef.current) {
      deckProgressBarRef.current.style.transform = "scaleX(0)";
    }
    for (const el of progressBarRefs.current) {
      if (el) {
        el.style.transform = "scaleX(0)";
      }
    }
  }, []);

  const toggleManualPause = useCallback(() => {
    setIsManuallyPaused((prev) => {
      const next = !prev;
      timerStateRef.current.isManuallyPaused = next;
      setIsHoldingDeck(
        next || timerStateRef.current.isHovered || timerStateRef.current.isHeld
      );
      return next;
    });
  }, []);

  const syncCarouselToModIndex = useCallback(
    (targetModIdx: number) => {
      setVirtualIdx((prev) => {
        const currentMod = (((prev % count) + count) % count);
        let delta = targetModIdx - currentMod;
        if (delta > count / 2) delta -= count;
        if (delta < -count / 2) delta += count;
        if (delta === 0) return prev;
        setEnableCarouselTransition(true);
        return prev + delta;
      });
      resetProgressBars();
    },
    [count, resetProgressBars]
  );

  const startSpringLoop = useCallback(() => {
    const state = wheelRef.current;
    if (state.rafId !== null) return;

    const tick = () => {
      if (state.isDragging) {
        renderWheelFrame(state.pos);
        const idx = normalizeIndex(state.pos);
        if (idx !== state.reportedIdx) {
          state.reportedIdx = idx;
          setActiveIndex(idx);
          syncCarouselToModIndex(idx);
        }
        state.rafId = window.requestAnimationFrame(tick);
        return;
      }

      const diff = state.target - state.pos;
      if (reducedMotion) {
        state.pos = state.target;
        state.vel = 0;
        renderWheelFrame(state.pos);
        const idx = normalizeIndex(state.pos);
        state.reportedIdx = idx;
        setActiveIndex(idx);
        state.rafId = null;
        return;
      }

      state.vel = (state.vel + diff * 0.12) * 0.76;
      state.pos += state.vel;
      renderWheelFrame(state.pos);

      const idx = normalizeIndex(state.pos);
      if (idx !== state.reportedIdx) {
        state.reportedIdx = idx;
        setActiveIndex(idx);
      }

      if (Math.abs(diff) > 0.001 || Math.abs(state.vel) > 0.001) {
        state.rafId = window.requestAnimationFrame(tick);
      } else {
        state.pos = state.target;
        state.vel = 0;
        renderWheelFrame(state.pos);
        state.rafId = null;
      }
    };

    state.rafId = window.requestAnimationFrame(tick);
  }, [normalizeIndex, reducedMotion, renderWheelFrame, syncCarouselToModIndex]);

  // Unified jump: spins both the 3D playing-card wheel AND the paired horizontal dossier carousel
  const goToTopic = useCallback(
    (targetIdx: number) => {
      const modTarget = (((targetIdx % count) + count) % count);
      const state = wheelRef.current;
      const currentMod = (((state.pos % count) + count) % count);
      let delta = modTarget - currentMod;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      state.target = Math.round(state.pos + delta);
      state.reportedIdx = modTarget;
      setActiveIndex(modTarget);
      syncCarouselToModIndex(modTarget);
      startSpringLoop();
    },
    [count, startSpringLoop, syncCarouselToModIndex]
  );

  // Step +1 or -1 endlessly in the horizontal paired-card carousel (and sync wheel)
  const stepCarousel = useCallback(
    (dir: 1 | -1) => {
      setEnableCarouselTransition(true);
      setVirtualIdx((prev) => {
        const nextVirtual = prev + dir;
        const nextMod = (((nextVirtual % count) + count) % count);
        const state = wheelRef.current;
        state.target = Math.round(state.target) + dir;
        state.reportedIdx = nextMod;
        setActiveIndex(nextMod);
        startSpringLoop();
        return nextVirtual;
      });
      resetProgressBars();
    },
    [count, resetProgressBars, startSpringLoop]
  );

  // Silently recenter virtualIdx back into middle copy [count .. 2*count - 1] after slide glide finishes
  const handleCarouselTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (e.target !== e.currentTarget) return;
    if (virtualIdx < count || virtualIdx >= count * 2) {
      const normalized = count + (((virtualIdx % count) + count) % count);
      setEnableCarouselTransition(false);
      setVirtualIdx(normalized);
    }
  };

  // Re-enable CSS transition on the frame after an instant silent recenter
  useEffect(() => {
    if (!enableCarouselTransition) {
      const id = window.requestAnimationFrame(() => {
        setEnableCarouselTransition(true);
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, [enableCarouselTransition]);

  // Continuous 60fps auto-rotation every DECK_INTERVAL_MS (3 seconds)
  // Pauses seamlessly when held, hovered, dragged, or manually toggled
  useEffect(() => {
    if (reducedMotion) return;
    const sectionNode =
      researchSectionRef.current || stageRef.current || dossierSectionRef.current;
    if (!sectionNode) return;

    let rafId: number | null = null;

    const tick = (now: number) => {
      const ts = timerStateRef.current;
      if (!ts.inView) {
        rafId = null;
        return;
      }

      if (ts.lastTs === 0) {
        ts.lastTs = now;
      }
      const dt = now - ts.lastTs;
      ts.lastTs = now;

      const isPaused =
        ts.isManuallyPaused ||
        ts.isHeld ||
        ts.isHovered ||
        wheelRef.current.isDragging;

      if (!isPaused) {
        ts.elapsed += dt;
        const progress = Math.min(1, ts.elapsed / DECK_INTERVAL_MS);

        if (deckProgressBarRef.current) {
          deckProgressBarRef.current.style.transform = `scaleX(${progress.toFixed(
            4
          )})`;
        }

        for (let v = 0; v < count * 3; v++) {
          const bar = progressBarRefs.current[v];
          if (!bar) continue;
          const isCurrentTopic =
            (((v % count) + count) % count) === activeIndex;
          bar.style.transform = isCurrentTopic
            ? `scaleX(${progress.toFixed(4)})`
            : "scaleX(0)";
        }

        if (ts.elapsed >= DECK_INTERVAL_MS) {
          ts.elapsed = 0;
          ts.lastTs = now;
          stepCarousel(1);
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const visible = Boolean(entry?.isIntersecting);
        timerStateRef.current.inView = visible;
        timerStateRef.current.lastTs = 0;
        if (visible && rafId === null) {
          rafId = window.requestAnimationFrame(tick);
        } else if (!visible && rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionNode);

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [activeIndex, count, reducedMotion, stepCarousel]);

  useEffect(() => {
    const state = wheelRef.current;
    renderWheelFrame(state.pos);
    const onResize = () => renderWheelFrame(state.pos);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (state.rafId !== null) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    };
  }, [renderWheelFrame]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    timerStateRef.current.isHeld = true;
    setIsHoldingDeck(true);
    const state = wheelRef.current;
    state.isDragging = true;
    state.moved = false;
    state.startX = e.clientX;
    state.startPos = state.pos;
    state.vel = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    startSpringLoop();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (stage) {
      const r = stage.getBoundingClientRect();
      setCursorBadge({
        visible: true,
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      });
    }

    const state = wheelRef.current;
    if (!state.isDragging) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 5) state.moved = true;
    state.pos = state.startPos - dx / 260;
  };

  const handlePointerUp = () => {
    timerStateRef.current.isHeld = false;
    if (
      !timerStateRef.current.isHovered &&
      !timerStateRef.current.isManuallyPaused
    ) {
      setIsHoldingDeck(false);
    }
    resetProgressBars();
    const state = wheelRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;
    const snapped = Math.round(state.pos);
    state.target = snapped;
    const modIdx = normalizeIndex(snapped);
    state.reportedIdx = modIdx;
    setActiveIndex(modIdx);
    syncCarouselToModIndex(modIdx);
    startSpringLoop();
  };

  // 3x virtual strip [0,1,2, 0,1,2, 0,1,2] for seamless infinite peeking left & right
  const virtualTopics = useMemo(
    () => [
      ...RESEARCH_TOPICS,
      ...RESEARCH_TOPICS,
      ...RESEARCH_TOPICS,
    ],
    []
  );

  const pairWidth = carouselMetrics.isMobileStack
    ? carouselMetrics.leadW
    : carouselMetrics.leadW +
      carouselMetrics.innerGap +
      carouselMetrics.dossierW;
  const pairStep = pairWidth + carouselMetrics.pairGap;
  const trackTranslateX = carouselMetrics.anchorLeft - virtualIdx * pairStep;

  return (
    <section
      id="research"
      ref={researchSectionRef}
      className="relative py-24 sm:py-32 border-t border-white/[0.06] bg-[#050505] overflow-hidden"
    >
      {/* ==================================================================== */}
      {/* PART 1: ZERO-OVERLAP 3D PLAYING-CARD WHEEL STAGE                     */}
      {/* ==================================================================== */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="text-center max-w-3xl mx-auto">
          <SlideEyebrow>
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                {RESEARCH_CONTENT.eyebrow}
              </span>
            </div>
          </SlideEyebrow>

          <SlideHeading delay={190}>
            <h2 className="font-sans font-medium text-2xl sm:text-4xl md:text-[44px] tracking-[-0.025em] leading-[1.18] select-none">
              <span style={{ color: "rgba(255, 255, 255, 0.38)" }}>
                {RESEARCH_CONTENT.headlineLead}
              </span>
              {RESEARCH_CONTENT.headlineTopics.map((phrase, idx) => {
                const isCurrent = activeIndex === idx;
                const isLast =
                  idx === RESEARCH_CONTENT.headlineTopics.length - 1;
                return (
                  <React.Fragment key={phrase}>
                    {isLast && (
                      <span style={{ color: "rgba(255, 255, 255, 0.38)" }}>
                        {RESEARCH_CONTENT.headlineConjunction}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => goToTopic(idx)}
                      style={{
                        color: isCurrent
                          ? "#ffffff"
                          : "rgba(255, 255, 255, 0.38)",
                      }}
                      className="inline font-semibold transition-colors duration-300 hover:text-white focus-visible:outline-none mr-[0.22em]"
                    >
                      {phrase}
                    </button>
                  </React.Fragment>
                );
              })}
            </h2>
          </SlideHeading>

          {/* Deck Controls Dock: [<- BACK] [1] [2] [3] [NEXT ->] [STATUS / HOLD] */}
          <Reveal delay={330}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
              {/* Back / Previous Deck Button */}
              <button
                type="button"
                onClick={() => {
                  stepCarousel(-1);
                  resetProgressBars();
                }}
                aria-label="Go back to previous deck"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.05] text-xs font-mono text-[#dce2ec] hover:bg-white/[0.14] hover:border-white/50 hover:text-white transition-all duration-200 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="font-semibold tracking-wider">BACK</span>
              </button>

              {/* Mini Tactile Keycap Number Indicators [1] [2] [3] */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] border border-white/10">
                {RESEARCH_TOPICS.map((topic, idx) => {
                  const isCurrent = activeIndex === idx;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        goToTopic(idx);
                        resetProgressBars();
                      }}
                      aria-label={`Deck ${idx + 1}: ${topic.title}`}
                      style={{
                        backgroundColor: isCurrent
                          ? "rgba(255, 255, 255, 0.25)"
                          : "rgba(255, 255, 255, 0.05)",
                        borderColor: isCurrent
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(255, 255, 255, 0.15)",
                        color: isCurrent
                          ? "#ffffff"
                          : "rgba(255, 255, 255, 0.45)",
                      }}
                      className="w-6 h-6 rounded-[5px] border border-b-2 text-[11px] font-mono font-bold flex items-center justify-center transition-all duration-200 hover:scale-105"
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Next Deck Button */}
              <button
                type="button"
                onClick={() => {
                  stepCarousel(1);
                  resetProgressBars();
                }}
                aria-label="Advance to next deck"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.05] text-xs font-mono text-[#dce2ec] hover:bg-white/[0.14] hover:border-white/50 hover:text-white transition-all duration-200 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              >
                <span className="font-semibold tracking-wider">NEXT</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Interactive Hold / Auto-Cycle Status Pill */}
              <button
                type="button"
                onClick={toggleManualPause}
                aria-label={
                  isHoldingDeck || isManuallyPaused
                    ? "Click to resume 3s auto-advance"
                    : "Click to hold / pause deck"
                }
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono tracking-wider transition-all duration-200 active:scale-95 ${
                  isHoldingDeck || isManuallyPaused
                    ? "bg-[#d9b97a]/15 border-[#d9b97a]/55 text-[#f2efe8] shadow-[0_0_14px_rgba(217,185,122,0.22)]"
                    : "bg-emerald-500/10 border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/20"
                }`}
              >
                {isHoldingDeck || isManuallyPaused ? (
                  <>
                    <Play className="w-3 h-3 text-[#d9b97a] fill-current" />
                    <span className="font-semibold text-[#d9b97a]">
                      PAUSED (HOLDING)
                    </span>
                    <span className="text-[10px] text-white/60 hidden sm:inline">
                      • CLICK RESUME
                    </span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-emerald-400" />
                    <span className="font-semibold">AUTO-CYCLE 3S</span>
                    <span className="text-[10px] text-emerald-300/70 hidden sm:inline">
                      • HOLD TO FREEZE
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Deck 3-Second Countdown Progress Bar */}
            <div className="mt-4 max-w-[280px] mx-auto h-[2.5px] rounded-full bg-white/10 overflow-hidden">
              <div
                ref={deckProgressBarRef}
                style={{
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  backgroundColor:
                    isHoldingDeck || isManuallyPaused ? "#d9b97a" : "#ffffff",
                  boxShadow:
                    isHoldingDeck || isManuallyPaused
                      ? "0 0 10px rgba(217, 185, 122, 0.8)"
                      : "0 0 10px rgba(255, 255, 255, 0.75)",
                }}
                className="h-full w-full rounded-full will-change-transform transition-[background-color,box-shadow] duration-200"
              />
            </div>
          </Reveal>
        </div>

        {/* 3-Card Circular Wheel: Right card tilted left (-37.5°), Left card tilted right (+37.5°), Zero Overlap */}
        <Reveal delay={420}>
          <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseEnter={() => {
              timerStateRef.current.isHovered = true;
              setIsHoldingDeck(true);
            }}
            onMouseLeave={() => {
              timerStateRef.current.isHovered = false;
              if (
                !timerStateRef.current.isHeld &&
                !timerStateRef.current.isManuallyPaused
              ) {
                setIsHoldingDeck(false);
              }
              setCursorBadge((prev) => ({ ...prev, visible: false }));
            }}
            className="relative mt-8 sm:mt-10 h-[790px] md:h-[970px] w-full select-none cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {cursorBadge.visible && (
              <div
                aria-hidden="true"
                style={{
                  transform: `translate3d(${cursorBadge.x + 14}px, ${
                    cursorBadge.y + 16
                  }px, 0)`,
                  backgroundColor:
                    isHoldingDeck || isManuallyPaused ? "#d9b97a" : "#f2efe8",
                  color: "#111111",
                }}
                className="hidden md:inline-block pointer-events-none absolute left-0 top-0 z-50 px-2.5 py-0.5 rounded-[4px] text-[11px] font-sans font-semibold shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
              >
                {isHoldingDeck || isManuallyPaused
                  ? "Holding (Paused) — Release to resume"
                  : "Hold to pause • Drag to rotate"}
              </div>
            )}

            {RESEARCH_TOPICS.map((topic, idx) => {
              const shortCardTitle =
                RESEARCH_CONTENT.cardShortTitles[idx] ?? topic.title;
              const isCurrent = activeIndex === idx;

              return (
                <div
                  key={topic.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => {
                    if (wheelRef.current.moved) return;
                    if (!isCurrent) {
                      goToTopic(idx);
                    } else {
                      dossierSectionRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                  style={{
                    left: "50%",
                    top: "12px",
                    perspective: "1100px",
                  }}
                  className="absolute w-[288px] sm:w-[344px] h-[396px] sm:h-[456px] will-change-transform"
                >
                  <div
                    ref={(el) => {
                      innerFlipRefs.current[idx] = el;
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-full h-full will-change-transform"
                  >
                    {/* FRONT FACE: Warm Ivory Reversible Playing Card */}
                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        backgroundColor: "#f2efe8",
                        color: "#111111",
                      }}
                      className="absolute inset-0 rounded-[20px] p-5 sm:p-6.5 flex flex-col justify-between shadow-[0_26px_64px_rgba(0,0,0,0.68)] border border-black/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span
                            style={{ color: "#57554f" }}
                            className="block text-[9px] font-mono uppercase tracking-[0.18em] mb-1"
                          >
                            0{idx + 1} {"//"} {topic.domain}
                          </span>
                          <h3
                            style={{ color: "#111111" }}
                            className="font-sans font-bold text-[15px] sm:text-[17px] tracking-[-0.02em] leading-[1.22]"
                          >
                            {topic.title}
                          </h3>
                        </div>
                        <PixelSuitEmblem variant={idx} />
                      </div>

                      <div className="my-auto py-3 space-y-2.5 border-y border-black/10">
                        <span
                          style={{
                            backgroundColor: "rgba(17, 17, 17, 0.07)",
                            color: "#22211e",
                          }}
                          className="inline-block px-2 py-0.5 rounded-[4px] text-[9px] font-mono uppercase tracking-[0.14em]"
                        >
                          {topic.status}
                        </span>
                        <p
                          style={{ color: "#141414" }}
                          className="font-sans font-medium text-xs sm:text-[13px] leading-[1.48] tracking-[-0.008em]"
                        >
                          {topic.researchQuestion}
                        </p>
                      </div>

                      <div
                        style={{ transform: "rotate(180deg)" }}
                        className="flex items-center justify-between gap-3"
                      >
                        <span
                          style={{ color: "#111111" }}
                          className="font-sans font-semibold text-xs sm:text-sm tracking-[-0.02em] leading-snug"
                        >
                          {shortCardTitle}
                        </span>
                        <PixelSuitEmblem variant={idx} />
                      </div>
                    </div>

                    {/* BACK FACE: Gunmetal 8-Bit Pixel-Art Ornamental Playing-Card Back */}
                    <div
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        backgroundColor: "#7c7e82",
                      }}
                      className="group/card relative inset-0 rounded-[20px] overflow-hidden shadow-[0_26px_64px_rgba(0,0,0,0.72)] border border-white/15 flex items-center justify-center w-full h-full"
                    >
                      <PixelCardBackPattern />

                      {/* Directional Action Pill on Side Cards: Go Back or Advance */}
                      {(() => {
                        let d = (((idx - activeIndex) % count) + count) % count;
                        if (d >= count / 2) d -= count;
                        const isLeft = d < 0;
                        return (
                          <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex justify-center pointer-events-none transition-transform duration-200 group-hover/card:scale-105">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-white/25 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-white shadow-[0_8px_20px_rgba(0,0,0,0.7)] backdrop-blur-sm">
                              {isLeft ? (
                                <>
                                  <ArrowLeft className="w-3 h-3 text-[#d9b97a]" />
                                  <span>GO BACK</span>
                                </>
                              ) : (
                                <>
                                  <span>NEXT CARD</span>
                                  <ArrowRight className="w-3 h-3 text-[#d9b97a]" />
                                </>
                              )}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* ==================================================================== */}
      {/* PART 2: PAIRED HORIZONTAL AUTO-TIMER DOSSIER CAROUSEL                */}
      {/* (Matches Screen_Recording_2026-10-31_at_11.07.00_AM.mov)             */}
      {/* ==================================================================== */}
      <div
        ref={dossierSectionRef}
        onMouseEnter={() => {
          timerStateRef.current.isHovered = true;
          setIsHoldingDeck(true);
        }}
        onMouseLeave={() => {
          timerStateRef.current.isHovered = false;
          if (
            !timerStateRef.current.isHeld &&
            !timerStateRef.current.isManuallyPaused
          ) {
            setIsHoldingDeck(false);
          }
        }}
        className="mt-16 sm:mt-20 pt-16 sm:pt-20 border-t border-white/[0.08]"
      >
        {/* Alignment Reference Container + Stacked Uppercase Heading + Circular (<-) (->) Controls */}
        <div
          ref={dossierAnchorRef}
          className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 mb-10 sm:mb-12"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <SlideHeading delay={140}>
                <h3 className="font-sans font-bold uppercase text-2xl sm:text-4xl md:text-[42px] text-white tracking-[-0.03em] leading-[1.04]">
                  {RESEARCH_CONTENT.dossierHeadingLine1}
                  <br />
                  {RESEARCH_CONTENT.dossierHeadingLine2}
                </h3>
              </SlideHeading>
            </div>

            {/* Circular Arrow Buttons (<-) (->) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                aria-label={RESEARCH_CONTENT.prevTopicAriaLabel}
                onClick={() => stepCarousel(-1)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#dce2ec] transition-all duration-250 hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.52)] hover:text-white active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                type="button"
                aria-label={RESEARCH_CONTENT.nextTopicAriaLabel}
                onClick={() => stepCarousel(1)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#dce2ec] transition-all duration-250 hover:bg-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.52)] hover:text-white active:scale-95"
              >
                <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Viewport Peeking Infinite Horizontal Track */}
        <div className="relative w-full overflow-hidden py-2">
          <div
            onTransitionEnd={handleCarouselTransitionEnd}
            style={{
              transform: `translate3d(${trackTranslateX}px, 0, 0)`,
              gap: `${carouselMetrics.pairGap}px`,
              transition: enableCarouselTransition
                ? "transform 680ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}
            className="flex items-stretch will-change-transform"
          >
            {virtualTopics.map((topic, vIdx) => {
              const topicModIdx = vIdx % count;
              const isPairActive = vIdx === virtualIdx;
              const numberLabel = `0${topicModIdx + 1}`;

              return (
                <div
                  key={`${topic.id}-${vIdx}`}
                  onClick={() => {
                    if (vIdx === virtualIdx - 1) stepCarousel(-1);
                    else if (vIdx === virtualIdx + 1) stepCarousel(1);
                    else if (!isPairActive) goToTopic(topicModIdx);
                  }}
                  style={{
                    width: `${pairWidth}px`,
                    gap: carouselMetrics.isMobileStack
                      ? "14px"
                      : `${carouselMetrics.innerGap}px`,
                  }}
                  className={`shrink-0 flex ${
                    carouselMetrics.isMobileStack ? "flex-col" : "flex-row"
                  } items-stretch ${!isPairActive ? "cursor-pointer" : ""}`}
                >
                  {/* CARD A (LEFT PRIMARY LEAD CARD): Title + Status + Research Question + Auto-Timer Bar */}
                  <article
                    style={{
                      width: `${carouselMetrics.leadW}px`,
                      background: isPairActive
                        ? "linear-gradient(155deg, rgba(20, 23, 30, 0.96) 0%, rgba(9, 11, 15, 0.98) 100%)"
                        : "linear-gradient(155deg, rgba(44, 48, 58, 0.32) 0%, rgba(24, 27, 34, 0.38) 100%)",
                      borderColor: isPairActive
                        ? "rgba(255, 255, 255, 0.17)"
                        : "rgba(255, 255, 255, 0.07)",
                      opacity: isPairActive ? 1 : 0.42,
                      boxShadow: isPairActive
                        ? "0 26px 60px -14px rgba(0, 0, 0, 0.82), inset 0 1px 0 rgba(255, 255, 255, 0.22)"
                        : "none",
                    }}
                    className="shrink-0 rounded-[28px] border p-7 sm:p-8 flex flex-col justify-between transition-[opacity,background,border-color,box-shadow] duration-500"
                  >
                    <div>
                      <span
                        style={{
                          color: isPairActive
                            ? "#c9ced6"
                            : "rgba(201, 206, 214, 0.55)",
                        }}
                        className="block text-[10px] font-sans uppercase tracking-[0.24em] mb-3"
                      >
                        {numberLabel} {"//"} {topic.domain}
                      </span>

                      <h4
                        style={{
                          color: isPairActive
                            ? "#ffffff"
                            : "rgba(255, 255, 255, 0.62)",
                        }}
                        className="font-sans font-semibold text-xl sm:text-2xl tracking-[-0.02em] leading-[1.22]"
                      >
                        {topic.title}
                      </h4>

                      <span
                        style={{
                          backgroundColor: isPairActive
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(255, 255, 255, 0.04)",
                          borderColor: isPairActive
                            ? "rgba(255, 255, 255, 0.16)"
                            : "rgba(255, 255, 255, 0.08)",
                          color: isPairActive
                            ? "#e6ebf2"
                            : "rgba(230, 235, 242, 0.55)",
                        }}
                        className="mt-4 inline-block px-3 py-1 rounded-full border text-[9.5px] font-sans uppercase tracking-[0.18em]"
                      >
                        {topic.status}
                      </span>
                    </div>

                    <div className="my-7 pt-5 border-t border-white/10">
                      <span
                        style={{
                          color: isPairActive
                            ? "#c9ced6"
                            : "rgba(201, 206, 214, 0.5)",
                        }}
                        className="block text-[10px] font-sans uppercase tracking-[0.22em] mb-2"
                      >
                        {fieldLabels.researchQuestion}
                      </span>
                      <p
                        style={{
                          color: isPairActive
                            ? "#dce2ec"
                            : "rgba(220, 226, 236, 0.55)",
                        }}
                        className="font-sans text-[13px] sm:text-sm font-light leading-[1.6]"
                      >
                        {topic.researchQuestion}
                      </p>
                    </div>

                    {/* Bottom Animated White Progress Timer Bar (00:01 -> 00:06 & 00:08 -> 00:10) */}
                    <div
                      style={{
                        opacity: isPairActive ? 1 : 0,
                        backgroundColor: "rgba(255, 255, 255, 0.16)",
                      }}
                      className="w-full h-[2.5px] rounded-full overflow-hidden transition-opacity duration-300"
                    >
                      <div
                        ref={(el) => {
                          progressBarRefs.current[vIdx] = el;
                        }}
                        style={{
                          transform: "scaleX(0)",
                          transformOrigin: "left center",
                          backgroundColor: "#ffffff",
                          boxShadow: "0 0 10px rgba(255, 255, 255, 0.65)",
                        }}
                        className="h-full w-full rounded-full will-change-transform"
                      />
                    </div>
                  </article>

                  {/* CARD B (RIGHT WIDE STRUCTURED 6-FIELD DOSSIER PANEL) */}
                  <div
                    style={{
                      width: `${carouselMetrics.dossierW}px`,
                      background: isPairActive
                        ? "linear-gradient(148deg, rgba(36, 40, 50, 0.62) 0%, rgba(15, 17, 22, 0.80) 100%)"
                        : "linear-gradient(148deg, rgba(36, 40, 50, 0.24) 0%, rgba(15, 17, 22, 0.30) 100%)",
                      borderColor: isPairActive
                        ? "rgba(255, 255, 255, 0.14)"
                        : "rgba(255, 255, 255, 0.06)",
                      opacity: isPairActive ? 1 : 0.35,
                      boxShadow: isPairActive
                        ? "0 26px 60px -14px rgba(0, 0, 0, 0.76), inset 0 1px 0 rgba(255, 255, 255, 0.18)"
                        : "none",
                    }}
                    className="shrink-0 rounded-[28px] border backdrop-blur-xl p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4 transition-[opacity,background,border-color,box-shadow] duration-500"
                  >
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="block text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#c9ced6] mb-1.5">
                        {fieldLabels.literatureReviewed}
                      </span>
                      <p className="text-xs text-[#b8c0cc] font-light leading-relaxed">
                        {topic.literatureReviewed}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="block text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#c9ced6] mb-1.5">
                        {fieldLabels.ownAnalysis}
                      </span>
                      <p className="text-xs text-[#b8c0cc] font-light leading-relaxed">
                        {topic.ownAnalysis}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="block text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#c9ced6] mb-1.5">
                        {fieldLabels.proposedMethodology}
                      </span>
                      <p className="text-xs text-[#b8c0cc] font-light leading-relaxed">
                        {topic.proposedMethodology}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="block text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#c9ced6] mb-1.5">
                        {fieldLabels.experimentsConducted}
                      </span>
                      <p className="text-xs text-[#b8c0cc] font-light leading-relaxed">
                        {topic.experimentsConducted}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="block text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#c9ced6] mb-1.5">
                        {fieldLabels.verifiedFindings}
                      </span>
                      <p className="text-xs text-[#b8c0cc] font-light leading-relaxed">
                        {topic.verifiedFindings}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="block text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#c9ced6] mb-1.5">
                        {fieldLabels.futureWork}
                      </span>
                      <p className="text-xs text-[#b8c0cc] font-light leading-relaxed">
                        {topic.futureWork}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus Areas Under Exploration Footer Strip */}
        <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 mt-12 pt-8 border-t border-white/[0.08]">
          <Reveal delay={200}>
            <div className="flex items-center gap-2.5 mb-3.5">
              <FlaskConical className="w-4 h-4 text-[#d9b97a]" />
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] font-medium">
                {RESEARCH_CONTENT.focusBoxHeading}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RESEARCH_INTERESTS.map((interest) => (
                <div
                  key={interest}
                  className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-xs text-[#e6e8ec] font-light leading-relaxed"
                >
                  {interest}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default Research;
