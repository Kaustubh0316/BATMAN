"use client";

import React, { useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface ScrollTextRevealProps {
  /** The full text to reveal word by word. */
  text: string;
  /** Words or phrases to highlight once revealed. */
  highlightWords?: string[];
  /** Optional custom eyebrow label above the text. */
  eyebrow?: string;
  /** Label shown beneath the scroll progress bar. */
  scrollHint?: string;
  /** Additional classes for the text container. */
  className?: string;
  /** Whether to use a sticky scroll container for an immersive scrub effect. Default: true. */
  sticky?: boolean;
}

export function ScrollTextReveal({
  text,
  highlightWords = [],
  eyebrow,
  scrollHint = "Scroll to reveal",
  className = "",
  sticky = true,
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setProgress] = useState(0);
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const reducedMotion = useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );

  const progress = reducedMotion ? 1 : scrollProgress;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = textRef.current?.getBoundingClientRect();
    if (!r) return;
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, active: true });
  };

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const normalizedHighlights = useMemo(
    () => highlightWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")),
    [highlightWords]
  );

  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = containerRef.current;
          if (!container) {
            ticking = false;
            return;
          }

          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (sticky) {
            const totalDistance = rect.height - windowHeight;
            // Begin the reveal slightly early as the section enters the viewport
            const scrolled = -rect.top + windowHeight * 0.38;
            const raw = totalDistance > 0 ? scrolled / (totalDistance * 0.82) : 0;
            setProgress(Math.min(1, Math.max(0, raw)));
          } else {
            // Calibrated scroll window so words reveal progressively in this exact space
            const startReveal = windowHeight * 0.65;
            const endReveal = windowHeight * 0.04;
            const currentY = rect.top;
            const raw = (startReveal - currentY) / (startReveal - endReveal);
            setProgress(Math.min(1, Math.max(0, raw)));
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sticky, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full",
        sticky ? "h-[160vh] sm:h-[175vh]" : "pt-20 sm:pt-24 pb-10 sm:pb-12"
      )}
    >
      <div
        className={cn(
          "w-full flex flex-col justify-center px-6 sm:px-12 md:px-16",
          sticky ? "sticky top-0 h-screen" : ""
        )}
      >
        <div className="max-w-4xl lg:max-w-5xl mx-auto w-full text-left">
          {eyebrow && (
            <div className="mb-6 sm:mb-10">
              <span className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.24em] text-white select-none">
                {eyebrow}
              </span>
            </div>
          )}

          <div
            ref={textRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setSpot((s) => ({ ...s, active: false }))}
            className="relative"
          >
            {/* Interactive Flashlight Layer (illuminates text near cursor) */}
            {spot.active && (
              <p
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 pointer-events-none font-sans font-bold text-3xl sm:text-5xl md:text-[54px] lg:text-[60px] leading-[1.22] sm:leading-[1.16] tracking-[-0.03em] select-none text-left text-white transition-opacity duration-200",
                  className
                )}
                style={{
                  WebkitMaskImage: `radial-gradient(circle 200px at ${spot.x}px ${spot.y}px, #ffffff 0%, rgba(255,255,255,0.45) 50%, transparent 100%)`,
                  maskImage: `radial-gradient(circle 200px at ${spot.x}px ${spot.y}px, #ffffff 0%, rgba(255,255,255,0.45) 50%, transparent 100%)`,
                }}
              >
                {words.map((word, index) => (
                  <span
                    key={`spot-${word}-${index}`}
                    className="inline-block mr-[0.24em]"
                  >
                    {word}
                  </span>
                ))}
              </p>
            )}

            {/* Base Scroll Scrub Layer: Muted (0.18) -> Solid White (1.0) */}
            <p
              className={cn(
                "font-sans font-bold text-3xl sm:text-5xl md:text-[54px] lg:text-[60px] leading-[1.22] sm:leading-[1.16] tracking-[-0.03em] select-none text-left",
                className
              )}
            >
              {words.map((word, index) => {
                const totalWords = words.length;
                // Progressive word-by-word reveal calibrated across the scroll space
                const start = (index / totalWords) * 0.90;
                const end = start + 1.25 / totalWords;
                const wordProgress = Math.min(
                  1,
                  Math.max(0, (progress - start) / (end - start))
                );

                const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                const isHighlight = normalizedHighlights.includes(cleanWord);
                const alpha = 0.18 + 0.82 * wordProgress;

                return (
                  <span
                    key={`${word}-${index}`}
                    className="inline-block mr-[0.24em] transition-colors duration-200 ease-out will-change-[color]"
                    style={{
                      color: `rgba(255, 255, 255, ${alpha.toFixed(3)})`,
                      textShadow:
                        wordProgress > 0.6
                          ? `0 0 24px rgba(255, 255, 255, ${(
                              wordProgress * (isHighlight ? 0.35 : 0.22)
                            ).toFixed(3)})`
                          : "none",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>

          {scrollHint && (
            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <div className="w-28 sm:w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/50">
                {scrollHint}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScrollTextReveal;
