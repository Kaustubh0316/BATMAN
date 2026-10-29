"use client";

import React from "react";
import { Users } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { EXPERIENCE_CONTENT, LEADERSHIP_EXPERIENCE } from "@/lib/data";

export function BeyondCode() {
  return (
    <section
      id="beyond"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#d9b97a]/5 blur-[150px]" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  {EXPERIENCE_CONTENT.eyebrow}
                </span>
                <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                {EXPERIENCE_CONTENT.heading}
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
              {EXPERIENCE_CONTENT.subtitle}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEADERSHIP_EXPERIENCE.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <GlowCard
                customSize
                glowColor="silver"
                className="w-full h-full min-h-[220px] grid-rows-1 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#090909]/90 border border-white/[0.08] hover:border-[#d0d4da]/40 transition-colors duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#d9b97a] shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans tracking-[0.18em] uppercase text-[#d9b97a] border border-white/10 bg-white/[0.03]">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-white tracking-tight mb-1">
                    {item.role}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8a86] block mb-3">
                    {item.context}
                  </span>

                  <p className="text-xs sm:text-sm text-[#8a8a86] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BeyondCode;
