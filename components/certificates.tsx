"use client";

import React from "react";
import { Award } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CERTIFICATES } from "@/lib/data";

export function Certificates() {
  return (
    <section
      id="certificates"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#d9b97a]/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  05 // Coursework & Credentials
                </span>
                <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                certifications.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
              Introductory coursework completed in generative AI fundamentals, prompt design, and foundational German language study.
            </p>
          </Reveal>
        </div>

        {/* Certificate List Rows */}
        <div className="border-b border-white/[0.08]">
          {CERTIFICATES.map((cert, index) => (
            <Reveal key={cert.id} delay={index * 80}>
              <div className="group block border-t border-white/[0.08] p-6 sm:p-8 md:p-10 transition-all duration-300 hover:bg-white/[0.015] rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#d9b97a] shrink-0 mt-1 sm:mt-0">
                      <Award className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-tight">
                        {cert.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs uppercase tracking-[0.2em] text-[#d9b97a]">
                        <span>{cert.focusArea}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 sm:ml-16 text-xs sm:text-sm text-[#8a8a86] font-light leading-relaxed max-w-3xl">
                  {cert.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certificates;
