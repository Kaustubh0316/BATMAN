"use client";

import React, { useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface ScrollTextRevealProps {
  /** The full text to reveal word by word. */
  text: string;
  /** Words or phrases to highlight with the warm gold accent (#d9b97a) once revealed. */
  highlightWords?: string[];
  /** Optional custom eyebrow label above the text. */
  eyebrow?: string;
  /** Additional classes for the text container. */
  className?: string;
  /** Whether to use a sticky scroll container for an immersive scrub effect. Default: true. */
  sticky?: boolean;
}

/**
 * ScrollTextReveal
 * 
 * Cinematic, scroll-driven word-by-word reveal component.
 * - Words start in muted charcoal.
 * - Progress is accelerated and tuned so words begin revealing immediately as you scroll,
 *   reaching full illumination earlier in the scroll track.
 * - Smooth wave-like word transitions with warm gold highlights.
 * - Fully respects prefers-reduced-motion with instant 100% illumination fallback.
 */
export function ScrollTextReveal({
  text,
  highlightWords = [],
  eyebrow,
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
            // Distance available to scroll while pinned
            const totalDistance = rect.height - windowHeight;
            // Start revealing before the section is fully pinned (lead of 45% viewport)
            const currentScrolled = -rect.top + windowHeight * 0.45;
            
            // Raw ratio from 0 to 1 over the pinned track
            const rawProgress = totalDistance > 0 ? currentScrolled / (totalDistance + windowHeight * 0.45) : 0;
            
            // Complete the reveal by ~45% of the track so the last line lights up well before unpinning
            const earlyProgress = Math.min(1, Math.max(0, rawProgress / 0.45));
            setProgress(earlyProgress);
          } else {
            // Standard in-flow scroll entry: trigger 100px before bottom
            const startReveal = windowHeight * 0.95;
            const endReveal = windowHeight * 0.40;
            const currentY = rect.top;
            const rawProgress = (startReveal - currentY) / (startReveal - endReveal);
            setProgress(Math.min(1, Math.max(0, rawProgress)));
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial measure

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
          {/* Optional Eyebrow */}
          {eyebrow && (
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d9b97a] animate-pulse" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                {eyebrow}
              </span>
            </div>
          )}

          {/* Scrubbed Words Container */}
          <div
            ref={textRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setSpot((s) => ({ ...s, active: false }))}
            className="relative"
          >
          {/* Spotlight overlay: bright copy of the text revealed only around the cursor */}
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
              <span key={`spot-${word}-${index}`} className="inline-block mr-[0.26em]">
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
              // Word start and end threshold with soft wave overlap so text reveals smoothly and earlier
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

          {/* Visual Scroll Progress Bar Indicator */}
          {sticky && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <div className="w-40 sm:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d9b97a] to-[#f0dbaf] transition-all duration-75 ease-out"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#8a8a86]">
                Scroll to reveal
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScrollTextReveal;
