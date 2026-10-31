"use client";

import React from "react";
import { Award, Languages, SlidersHorizontal, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SlideEyebrow, SlideHeading } from "@/components/ui/slide-transition";
import { LiquidGlassTab } from "@/components/ui/liquid-glass-tab";
import { CERTIFICATES, CERTIFICATES_CONTENT } from "@/lib/data";

function getCertificateIcon(id: string) {
  switch (id) {
    case "german-for-beginners":
      return <Languages className="w-5 h-5 sm:w-6 sm:h-6" />;
    case "intro-to-generative-ai":
      return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
    case "intro-to-generative-ai-studio":
      return <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />;
    default:
      return <Award className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
}

export function Certificates() {
  return (
    <section
      id="certificates"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Subtle Silver Refractive Ambient Light Pools Behind Liquid Glass */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 -translate-y-1/2 w-96 h-96 rounded-full blur-[130px]"
        style={{ background: "rgba(210, 220, 236, 0.08)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/5 bottom-1/4 w-80 h-80 rounded-full blur-[120px]"
        style={{ background: "rgba(180, 194, 216, 0.07)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SlideEyebrow>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  {CERTIFICATES_CONTENT.eyebrow}
                </span>
                <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
              </div>
            </SlideEyebrow>
            <SlideHeading delay={190}>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                {CERTIFICATES_CONTENT.heading}
              </h2>
            </SlideHeading>
          </div>

          <Reveal delay={330}>
            <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
              {CERTIFICATES_CONTENT.subtitle}
            </p>
          </Reveal>
        </div>

        {/* Control-Center Liquid Glass Tabs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {CERTIFICATES.map((cert, index) => (
            <Reveal key={cert.id} delay={360 + index * 90} className="h-full">
              <LiquidGlassTab
                icon={getCertificateIcon(cert.id)}
                title={cert.title}
                subtitle={cert.focusArea}
                description={cert.description}
                badge={String(index + 1).padStart(2, "0")}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certificates;
