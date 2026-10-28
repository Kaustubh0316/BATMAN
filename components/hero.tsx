"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CredCorridor } from "@/components/cred-corridor";
import { PERSONAL_INFO } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-10 px-6 sm:px-12 md:px-16 overflow-hidden bg-[#07080a]"
    >
      {/* Iconic 3D Perspective Colonnade & Illuminated Portal */}
      <CredCorridor mouseParallax={true} />

      {/* Spacer to balance navbar */}
      <div className="h-6" />

      {/* Central Typography */}
      <div className="relative z-30 max-w-5xl mx-auto w-full text-center my-auto py-8">
        {/* Eyebrow with Name & Professional Title */}
        <div className="inline-flex items-center justify-center gap-2.5 mb-6 px-4 py-1.5 rounded-none border border-white/15 bg-black/50 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d9b97a]" />
          <TextShimmer
            text={`${PERSONAL_INFO.name} • ${PERSONAL_INFO.title}`}
            as="span"
            duration={3}
            baseColor="#8a8a86"
            shimmerColor="#ffffff"
            className="text-[10px] sm:text-xs uppercase tracking-[0.26em] font-medium"
          />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[82px] text-white tracking-[-0.03em] leading-[1.02] max-w-4xl mx-auto select-none">
          Exploring AI, Research, and the{" "}
          <span className="text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.25)]">
            Possibilities of Code.
          </span>
        </h1>

        {/* Concise Introduction */}
        <p className="mt-6 sm:mt-8 font-sans font-normal text-white/75 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {PERSONAL_INFO.heroSubtitle}
        </p>

        {/* Primary & Secondary Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#projects"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-[#07080a] text-xs font-sans font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:bg-[#e6e8ec] active:scale-[0.99]"
          >
            <span>Explore My Projects</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="#contact"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-white/25 bg-black/50 backdrop-blur-md text-white text-xs font-sans font-medium uppercase tracking-[0.22em] transition-all duration-300 hover:border-white/60 hover:bg-white/[0.06] active:scale-[0.99]"
          >
            <span>Connect With Me</span>
          </Link>
        </div>

        {/* Verified Profile Links (GitHub & LinkedIn) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] uppercase tracking-[0.22em] text-[#8a8a86]">
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-3 py-1 border border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/30 hover:text-white transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <span className="text-[#d9b97a]/50">•</span>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-3 py-1 border border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/30 hover:text-white transition-colors"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Bottom Bar: Scroll Indicator + Quick Contact Box */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex items-end justify-between pt-6 border-t border-white/[0.08]">
        {/* Bottom-Left: Subtle Scroll Cue */}
        <a
          href="#manifesto"
          className="group flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.24em] text-[#8a8a86] hover:text-white transition-colors pb-2"
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#d9b97a] animate-bounce" />
          <span>Scroll to explore</span>
        </a>

        {/* Bottom-Right: Rectangular Box */}
        <Link
          href="#about"
          className="group flex items-center gap-4 rounded-none border border-white/20 bg-black/50 backdrop-blur-md p-3.5 transition-all duration-300 hover:border-white/50 hover:bg-black/70 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
        >
          <div className="w-10 h-10 p-1 bg-white rounded-none flex items-center justify-center shrink-0">
            <span className="font-serif text-sm font-bold text-black tracking-tight">
              KC
            </span>
          </div>

          <div className="flex flex-col text-left pr-2">
            <span className="text-[11px] font-sans font-normal text-white group-hover:text-[#d9b97a] transition-colors leading-tight">
              First-Year B.Tech CSE
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a8a86] group-hover:text-white transition-colors leading-tight mt-0.5 flex items-center gap-1">
              ITM Skills University
              <ArrowUpRight className="w-3 h-3 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
