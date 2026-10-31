"use client";

import React, { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiquidGlassTabProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  showChevron?: boolean;
  className?: string;
}

/**
 * LiquidGlassTab
 *
 * Apple Control-Center-inspired translucent Liquid Glass capsule/squircle tab
 * with refractive meniscus edges, a circular tactile icon orb, and a
 * pointer-tracked + orbital glowing silver sliver hover effect.
 */
export function LiquidGlassTab({
  icon,
  title,
  subtitle,
  description,
  badge,
  showChevron = true,
  className,
}: LiquidGlassTabProps) {
  const tabRef = useRef<HTMLDivElement>(null);

  const updatePointerOptics = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tabRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;
    // Convert polar angle so 0deg aligns with CSS conic-gradient 12-o'clock origin
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    el.style.setProperty("--lg-x", `${x.toFixed(1)}px`);
    el.style.setProperty("--lg-y", `${y.toFixed(1)}px`);
    el.style.setProperty("--lg-angle", `${angleDeg.toFixed(1)}deg`);
  };

  return (
    <div
      ref={tabRef}
      onPointerEnter={updatePointerOptics}
      onPointerMove={updatePointerOptics}
      className={cn(
        "liquid-glass-tab group h-full p-6 sm:p-7 md:p-8 flex flex-col justify-between select-none",
        className
      )}
    >
      {/* 1. Clipped Interior Dome & Cursor Caustic Reflection */}
      <div className="liquid-glass-surface" aria-hidden="true">
        <div className="liquid-glass-dome" />
        <div className="liquid-glass-caustic" />
      </div>

      {/* 2. Always-On Refractive Fresnel Rim */}
      <div className="liquid-glass-fresnel" aria-hidden="true" />

      {/* 3. Travelling Orbital Silver Rim Glint on Hover */}
      <div className="liquid-glass-orbit" aria-hidden="true" />

      {/* 4. Blooming Directional Silver Sliver Aura on Hover */}
      <div className="liquid-glass-sliver-bloom" aria-hidden="true" />

      {/* 5. Razor-Sharp Glowing Silver Rim Sliver on Hover */}
      <div className="liquid-glass-sliver" aria-hidden="true" />

      {/* 6. Control-Center Capsule Interior Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Capsule Bar: Circular Icon Orb + Primary/Secondary Stack + Badge/Chevron */}
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="liquid-glass-orb w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
              {icon}
            </div>

            <div className="min-w-0">
              <h3 className="font-sans text-lg sm:text-xl font-semibold text-white tracking-[-0.015em] leading-snug">
                {title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#b4bcc8] font-normal leading-snug mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {badge ? (
              <span className="liquid-glass-chip px-3 py-1 text-[10px] font-sans uppercase tracking-[0.16em] whitespace-nowrap">
                {badge}
              </span>
            ) : null}

            {showChevron ? (
              <ChevronRight
                className="w-4 h-4 text-[#9aa3b2] transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 shrink-0"
                aria-hidden="true"
              />
            ) : null}
          </div>
        </div>

        {/* Refractive Hairline Divider */}
        <div className="liquid-glass-divider my-5" aria-hidden="true" />

        {/* Specified Description Content */}
        <p className="text-xs sm:text-sm text-[#cdd3de] font-light leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default LiquidGlassTab;

