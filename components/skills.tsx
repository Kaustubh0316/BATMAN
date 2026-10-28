"use client";

import React from "react";
import { Code2, Brain, Sparkles, Compass } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { SKILL_CATEGORIES } from "@/lib/data";

const iconMap = {
  Code2: Code2,
  Brain: Brain,
  Sparkles: Sparkles,
  Compass: Compass,
};

export function Skills() {
  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#d9b97a]/5 blur-[130px]" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  02 // Technical Skills
                </span>
                <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                foundations & learning.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
              An honest overview of the programming languages, AI concepts, research topics, and tools I am currently learning and exploring as a first-year engineering student.
            </p>
          </Reveal>
        </div>

        {/* 4-Column Grid of Spotlight GlowCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_CATEGORIES.map((category, index) => {
            const IconComponent = iconMap[category.iconName];

            return (
              <Reveal key={category.id} delay={index * 80}>
                <GlowCard
                  customSize
                  glowColor="silver"
                  className="w-full h-full min-h-[340px] grid-rows-1 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#090909]/90 border border-white/[0.08] hover:border-[#d0d4da]/40 transition-colors duration-300"
                >
                  {/* Card Header: Icon & Titles */}
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#d9b97a] mb-5">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <h3 className="font-serif text-2xl text-white tracking-tight mb-1">
                      {category.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] block mb-3">
                      {category.subtitle}
                    </span>

                    <p className="text-xs text-[#8a8a86] font-light leading-relaxed mb-6">
                      {category.description}
                    </p>
                  </div>

                  {/* Skills List with Neutral Learning Labels */}
                  <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                      >
                        <span className="text-xs font-sans font-medium text-[#f4f4f2]">
                          {item.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#8a8a86]">
                          {item.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;
