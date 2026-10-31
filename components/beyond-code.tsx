"use client";

import React from "react";
import { Calendar, Mic, Trophy, Users, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SlideEyebrow, SlideHeading } from "@/components/ui/slide-transition";
import { LiquidGlassTab } from "@/components/ui/liquid-glass-tab";
import { EXPERIENCE_CONTENT, LEADERSHIP_EXPERIENCE } from "@/lib/data";

function getExperienceIcon(id: string) {
  switch (id) {
    case "class-representative":
      return <Users className="w-5 h-5 sm:w-6 sm:h-6" />;
    case "sports-captain":
      return <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />;
    case "track-sprinting":
      return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
    case "event-farewell-trip-planning":
      return <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />;
    case "society-volunteering-anchoring":
      return <Mic className="w-5 h-5 sm:w-6 sm:h-6" />;
    default:
      return <Users className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
}

export function BeyondCode() {
  return (
    <section
      id="beyond"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Subtle Silver Refractive Ambient Light Pools Behind Liquid Glass */}
      <div
        className="pointer-events-none absolute left-1/3 top-1/3 -translate-y-1/2 w-[460px] h-[460px] rounded-full blur-[145px]"
        style={{ background: "rgba(210, 220, 236, 0.08)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-1/5 w-96 h-96 rounded-full blur-[135px]"
        style={{ background: "rgba(182, 196, 218, 0.07)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SlideEyebrow>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  {EXPERIENCE_CONTENT.eyebrow}
                </span>
                <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
              </div>
            </SlideEyebrow>
            <SlideHeading delay={190}>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                {EXPERIENCE_CONTENT.heading}
              </h2>
            </SlideHeading>
          </div>

          <Reveal delay={330}>
            <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
              {EXPERIENCE_CONTENT.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Control-Center Bento Grid of Liquid Glass Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-7">
          {LEADERSHIP_EXPERIENCE.map((item, index) => {
            const spanClass =
              index < 3
                ? "lg:col-span-2"
                : index === LEADERSHIP_EXPERIENCE.length - 1
                  ? "md:col-span-2 lg:col-span-3"
                  : "lg:col-span-3";

            return (
              <Reveal
                key={item.id}
                delay={360 + index * 80}
                className={`h-full ${spanClass}`}
              >
                <LiquidGlassTab
                  icon={getExperienceIcon(item.id)}
                  title={item.role}
                  subtitle={item.context}
                  description={item.description}
                  badge={item.category}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BeyondCode;
