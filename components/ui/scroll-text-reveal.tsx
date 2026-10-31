"use client";

import React, { useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { SlideEyebrow } from "@/components/ui/slide-transition";

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
  const [scrollProgress, setProgress] = useState(0);
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  const progress = reducedMotion ? 1 : scrollProgress;

  const textRef = useRef<HTMLDivElement | null>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = textRef.current?.getBoundingClientRect();
    if (!r) return;
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, active: true });
  };

  const words = useMemo(() => text.split(" "), [text]);

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
            const currentScrolled = -rect.top + windowHeight * 0.45;
            const rawProgress =
              totalDistance > 0
                ? currentScrolled / (totalDistance + windowHeight * 0.45)
                : 0;
            const earlyProgress = Math.min(1, Math.max(0, rawProgress / 0.45));
            setProgress(earlyProgress);
          } else {
            const startReveal = windowHeight * 0.95;
            const endReveal = windowHeight * 0.4;
            const currentY = rect.top;
            const rawProgress =
              (startReveal - currentY) / (startReveal - endReveal);
            setProgress(Math.min(1, Math.max(0, rawProgress)));
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
        sticky ? "h-[130vh] sm:h-[150vh]" : "py-20 sm:py-28"
      )}
    >
      <div
        className={cn(
          "w-full flex flex-col items-center justify-center px-6 sm:px-12 md:px-16",
          sticky ? "sticky top-0 h-screen" : ""
        )}
      >
        <div className="max-w-5xl mx-auto text-center w-full">
          {eyebrow && (
            <SlideEyebrow>
              <div className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9b97a] animate-pulse" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  {eyebrow}
                </span>
              </div>
            </SlideEyebrow>
          )}

          <div
            ref={textRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setSpot((s) => ({ ...s, active: false }))}
            className="relative"
          >
            <p
              aria-hidden="true"
              className={cn(
                "absolute inset-0 pointer-events-none font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.2] sm:leading-[1.18] tracking-[-0.02em] select-none text-white transition-opacity duration-300",
                className
              )}
              style={{
                opacity: spot.active ? 1 : 0,
                WebkitMaskImage: `radial-gradient(circle 150px at ${spot.x}px ${spot.y}px, #000 0%, rgba(0,0,0,0.55) 45%, transparent 100%)`,
                maskImage: `radial-gradient(circle 150px at ${spot.x}px ${spot.y}px, #000 0%, rgba(0,0,0,0.55) 45%, transparent 100%)`,
              }}
            >
              {words.map((word, index) => (
                <span
                  key={`spot-${word}-${index}`}
                  className="inline-block mr-[0.26em]"
                >
                  {word}
                </span>
              ))}
            </p>
            <p
              className={cn(
                "font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.2] sm:leading-[1.18] tracking-[-0.02em] select-none",
                className
              )}
            >
              {words.map((word, index) => {
                const totalWords = words.length;
                const wordStart = index / (totalWords + 1);
                const wordEnd = (index + 1.8) / (totalWords + 1);

                const wordProgress = Math.min(
                  1,
                  Math.max(0, (progress - wordStart) / (wordEnd - wordStart))
                );

                const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
                const isHighlight = normalizedHighlights.includes(cleanWord);
                const textAlpha = 0.12 + 0.88 * wordProgress;

                return (
                  <span
                    key={`${word}-${index}`}
                    className="inline-block mr-[0.26em] transition-colors duration-150 will-change-[color,filter]"
                    style={{
                      color:
                        wordProgress > 0.2
                          ? isHighlight
                            ? `rgba(226, 230, 238, ${textAlpha})`
                            : `rgba(244, 244, 242, ${textAlpha})`
                          : `rgba(255, 255, 255, ${textAlpha})`,
                      filter:
                        wordProgress > 0.3 && isHighlight
                          ? `drop-shadow(0 0 16px rgba(226, 230, 238, ${wordProgress * 0.4}))`
                          : "none",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>

          {sticky && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <div className="w-40 sm:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d9b97a] to-[#f0dbaf] transition-all duration-75 ease-out"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#8a8a86]">
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
