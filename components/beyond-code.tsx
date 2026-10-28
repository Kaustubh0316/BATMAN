"use client";

import React from "react";
import { Users, Target, Sparkles } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { LEADERSHIP_EXPERIENCE, PERSONAL_INFO } from "@/lib/data";

export function BeyondCode() {
  return (
    <section
      id="beyond"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#d9b97a]/5 blur-[150px]" />

      <div className="max-w-7xl mx-auto space-y-24">
        {/* ============================================================ */}
        {/* Part 1: Leadership & Extracurricular Experience              */}
        {/* ============================================================ */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                    06 // Leadership & Extracurriculars
                  </span>
                  <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                  leadership & participation.
                </h2>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
                School leadership roles, athletic participation, event coordination, and community volunteering.
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

        {/* ============================================================ */}
        {/* Part 2: Professional Direction & Current Learning Goals      */}
        {/* ============================================================ */}
        <div id="direction" className="pt-16 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                    07 // Professional Direction
                  </span>
                  <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                  direction & learning goals.
                </h2>
              </div>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <div className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#090909]/90 mb-8">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] block mb-3">
                Career Direction Statement
              </span>
              <p className="font-serif text-xl sm:text-2xl text-white leading-relaxed font-normal">
                “{PERSONAL_INFO.careerStatement}”
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Current Learning Goals */}
            <div className="lg:col-span-7">
              <Reveal delay={120}>
                <div className="h-full p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#090909]/80">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Target className="w-4 h-4 text-[#d9b97a]" />
                    <h3 className="font-serif text-2xl text-white tracking-tight">
                      Current Learning Goals
                    </h3>
                  </div>
                  <p className="text-xs text-[#8a8a86] mb-6">
                    Areas I am actively working to develop through coursework, practice, and projects.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PERSONAL_INFO.learningGoals.map((goal) => (
                      <div
                        key={goal}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#f4f4f2]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d9b97a] mt-1.5 shrink-0" />
                        <span>{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Opportunities of Interest */}
            <div className="lg:col-span-5">
              <Reveal delay={160}>
                <div className="h-full p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#090909]/80">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Sparkles className="w-4 h-4 text-[#d9b97a]" />
                    <h3 className="font-serif text-2xl text-white tracking-tight">
                      Opportunities of Interest
                    </h3>
                  </div>
                  <p className="text-xs text-[#8a8a86] mb-6">
                    Roles, collaborations, and student initiatives I am preparing for and open to exploring.
                  </p>

                  <div className="space-y-3">
                    {PERSONAL_INFO.opportunitiesOfInterest.map((opportunity) => (
                      <div
                        key={opportunity}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-[#f4f4f2]"
                      >
                        <span>{opportunity}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8a8a86]">
                          Exploring
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BeyondCode;
