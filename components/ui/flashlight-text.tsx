"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export interface FlashlightTextProps {
  paragraphs: string[];
  className?: string;
  paragraphClassName?: string;
  radius?: number;
}

/**
 * FlashlightText
 *
 * Exact CRED-style cursor flashlight text effect matching video:
 * - Resting state (cursor OFF text): All copy rests uniformly in a calm, muted charcoal-silver tone.
 * - Hover state (cursor ON text): A feathered circular beam of pure glowing #ffffff illuminates words directly beneath the cursor.
 * - Leave state (cursor moves OFF text): The hover effect immediately ends, vanishing the beam and restoring the uniform resting state with zero lingering artifacts.
 */
export function FlashlightText({
  paragraphs,
  className,
  paragraphClassName,
  radius = 170,
}: FlashlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlight.style.setProperty("--fx-x", `${x.toFixed(1)}px`);
    spotlight.style.setProperty("--fx-y", `${y.toFixed(1)}px`);
    spotlight.style.opacity = "1";
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlight.style.setProperty("--fx-x", `${x.toFixed(1)}px`);
    spotlight.style.setProperty("--fx-y", `${y.toFixed(1)}px`);
    spotlight.style.opacity = "1";
  };

  const handlePointerLeave = () => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;
    // When the cursor leaves the text, end the hover effect completely
    spotlight.style.opacity = "0";
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("relative space-y-5 cursor-default select-text", className)}
    >
      {/* ================================================================== */}
      {/* BASE LAYER: Muted charcoal-silver resting text (Frame 00:11)       */}
      {/* ================================================================== */}
      <div className="space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`base-${index}`}
            className={cn(
              "font-sans text-base sm:text-lg md:text-[19px] font-normal leading-[1.68] tracking-[-0.005em] text-white/[0.28] transition-colors duration-200",
              paragraphClassName
            )}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* ================================================================== */}
      {/* SPOTLIGHT LAYER: Pure #ffffff beam, visible ONLY on active hover   */}
      {/* ================================================================== */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="absolute inset-0 space-y-5 pointer-events-none select-none transition-opacity duration-200 ease-out"
        style={
          {
            opacity: 0,
            "--fx-x": "-9999px",
            "--fx-y": "-9999px",
            WebkitMaskImage: `radial-gradient(${radius}px circle at var(--fx-x) var(--fx-y), #000 0%, #000 32%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.15) 86%, transparent 100%)`,
            maskImage: `radial-gradient(${radius}px circle at var(--fx-x) var(--fx-y), #000 0%, #000 32%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.15) 86%, transparent 100%)`,
          } as React.CSSProperties
        }
      >
        {paragraphs.map((paragraph, index) => (
          <p
            key={`spot-${index}`}
            className={cn(
              "font-sans text-base sm:text-lg md:text-[19px] font-medium leading-[1.68] tracking-[-0.005em] text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.45)]",
              paragraphClassName
            )}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export default FlashlightText;
