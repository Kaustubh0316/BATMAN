"use client";

import React from "react";
import { FlaskConical } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { RESEARCH_INTERESTS, RESEARCH_TOPICS } from "@/lib/data";

export function Research() {
  return (
    <section
      id="research"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#d9b97a]/5 blur-[140px]" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  04 // Research & Development
                </span>
                <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                research interests.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
              Early-stage research questions and literature explorations — presented separately from completed research outputs or published papers.
            </p>
          </Reveal>
        </div>

        {/* Core Areas of Interest Pills */}
        <Reveal delay={120}>
          <div className="mb-12 p-6 rounded-2xl border border-white/[0.08] bg-[#090909]/80">
            <div className="flex items-center gap-2.5 mb-4">
              <FlaskConical className="w-4 h-4 text-[#d9b97a]" />
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] font-medium">
                Focus Areas Under Exploration
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {RESEARCH_INTERESTS.map((interest) => (
                <div
                  key={interest}
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-[#f4f4f2] leading-relaxed"
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Structured Breakdown for Each Research Topic */}
        <div className="space-y-8">
          {RESEARCH_TOPICS.map((topic, index) => (
            <Reveal key={topic.id} delay={index * 80}>
              <div className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#090909]/90">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] block mb-1">
                      {topic.domain}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-tight">
                      {topic.title}
                    </h3>
                  </div>

                  <span className="self-start lg:self-auto px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#f4f4f2] border border-white/10 bg-white/[0.03]">
                    {topic.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] lg:col-span-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1">
                      Research Question
                    </span>
                    <p className="text-sm text-[#f4f4f2] font-normal leading-relaxed">
                      {topic.researchQuestion}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1.5">
                      Published Literature Reviewed
                    </span>
                    <p className="text-[#8a8a86] leading-relaxed">
                      {topic.literatureReviewed}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1.5">
                      My Own Analysis
                    </span>
                    <p className="text-[#8a8a86] leading-relaxed">
                      {topic.ownAnalysis}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1.5">
                      Proposed Methodology
                    </span>
                    <p className="text-[#8a8a86] leading-relaxed">
                      {topic.proposedMethodology}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1.5">
                      Experiments Conducted
                    </span>
                    <p className="text-[#8a8a86] leading-relaxed">
                      {topic.experimentsConducted}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1.5">
                      Verified Findings
                    </span>
                    <p className="text-[#8a8a86] leading-relaxed">
                      {topic.verifiedFindings}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1.5">
                      Future Work
                    </span>
                    <p className="text-[#8a8a86] leading-relaxed">
                      {topic.futureWork}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Research;

