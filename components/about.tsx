"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GraduationCap, Compass } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PERSONAL_INFO } from "@/lib/data";

interface AboutProps {
  hasPhoto?: boolean;
}

export function About({ hasPhoto = true }: AboutProps) {
  const [photoError, setPhotoError] = useState(false);
  const showPhoto = hasPhoto && !photoError;

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-0 top-1/3 w-96 h-96 rounded-full bg-[#d9b97a]/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto">
        {/* Section Eyebrow */}
        <Reveal>
          <div className="flex items-center gap-3 mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
              01 // About & Education
            </span>
            <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
          </div>
        </Reveal>

        {/* 2-Column Grid: Photo Frame on Left, Narrative & Education on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Architectural Photo Frame with "KC" Fallback */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <Reveal delay={100}>
              <div className="relative group aspect-[4/5] rounded-2xl p-2 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-sm overflow-hidden">
                {/* Corner accent notches */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d9b97a] z-20" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d9b97a] z-20" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d9b97a] z-20" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d9b97a] z-20" />

                {/* Inner Frame */}
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#090909] flex flex-col items-center justify-center border border-white/[0.04]">
                  {showPhoto ? (
                    <Image
                      src="/photo.jpg"
                      alt="Kaustubh Chamankar"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-105"
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#181818] via-[#090909] to-[#040404]">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
                      <div className="absolute w-40 h-40 rounded-full bg-[#d9b97a]/10 blur-[40px] pointer-events-none" />
                      <span className="relative z-10 font-serif text-8xl md:text-9xl tracking-tight text-[#d9b97a]/25 select-none transition-all duration-500 group-hover:text-[#d9b97a]/40 group-hover:scale-105">
                        KC
                      </span>
                      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 w-3/4">
                        <span className="block font-serif text-base tracking-wide text-[#f4f4f2]">
                          {PERSONAL_INFO.name}
                        </span>
                        <span className="block text-[10px] uppercase tracking-[0.24em] text-[#8a8a86] mt-1">
                          ITM Skills University • B.Tech CSE
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Subtle caption bar on bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#8a8a86] z-10">
                    <span>{PERSONAL_INFO.institution}</span>
                    <span className="text-[#d9b97a]">{PERSONAL_INFO.currentStage}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Bio Narrative, Education Card & Current Interests */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal delay={150}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.1] mb-6">
                curious about how ideas become real, usable things.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-4 text-sm sm:text-base text-[#8a8a86] font-light leading-relaxed">
                {PERSONAL_INFO.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            {/* Education Block */}
            <Reveal delay={250}>
              <div className="mt-8 p-6 rounded-2xl border border-white/[0.08] bg-[#090909]/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#d9b97a]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] block">
                      Education
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white tracking-tight">
                      {PERSONAL_INFO.degree}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a86] block mb-1">
                      Institution
                    </span>
                    <span className="text-[#f4f4f2] font-medium">
                      {PERSONAL_INFO.institution}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a86] block mb-1">
                      Current Stage
                    </span>
                    <span className="text-[#f4f4f2] font-medium">
                      {PERSONAL_INFO.currentStage}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a86] block mb-1">
                      Expected Graduation
                    </span>
                    <span className="text-[#f4f4f2] font-medium">
                      {PERSONAL_INFO.expectedGraduation}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a86] block mb-2">
                    Relevant Learning Areas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PERSONAL_INFO.learningAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 rounded-full text-xs text-[#f4f4f2] bg-white/[0.03] border border-white/10"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Current Interests */}
            <Reveal delay={300}>
              <div className="mt-6 p-6 rounded-2xl border border-white/[0.08] bg-[#090909]/50">
                <div className="flex items-center gap-2.5 mb-3">
                  <Compass className="w-4 h-4 text-[#d9b97a]" />
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] font-medium">
                    Current Areas of Interest
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PERSONAL_INFO.currentInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#8a8a86] bg-white/[0.02] border border-white/[0.06] hover:text-[#f4f4f2] transition-colors"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
