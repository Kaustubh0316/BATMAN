"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SlideEyebrow, SlideHeading } from "@/components/ui/slide-transition";
import { HERO_CONTENT, PERSONAL_INFO } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 px-6 sm:px-10 md:px-14 lg:px-16 overflow-hidden bg-[#07080a]"
    >
      {/* ==================================================================== */}
      {/* 1. BACKGROUND LAYERS: Architectural Grid + Luminous Radial Spotlight  */}
      {/* ==================================================================== */}
      {/* Architectural subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px]"
      />

      {/* Atmospheric Platinum Spotlight behind PORTFOLIO wordmark */}
      <div
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(201, 206, 214, 0.18) 0%, rgba(217, 185, 122, 0.06) 40%, transparent 75%)",
        }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Top & Side Vignette to frame the poster */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#07080a] via-transparent to-[#07080a]/90"
      />

      {/* ==================================================================== */}
      {/* 2. GIANT "PORTFOLIO" BACKGROUND WORDMARK (Layer Z-10)                 */}
      {/* ==================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 sm:top-20 md:top-24 z-10 flex items-center justify-center select-none"
      >
        <svg
          viewBox="0 0 1200 230"
          className="w-full max-w-7xl h-auto px-4 opacity-90"
        >
          <defs>
            <linearGradient id="heroPortfolioFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
              <stop offset="35%" stopColor="#dce3ee" stopOpacity="0.28" />
              <stop offset="75%" stopColor="#8690a0" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#222733" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="heroPortfolioStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#c9ced6" stopOpacity="0.10" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="76%"
            textAnchor="middle"
            fill="url(#heroPortfolioFill)"
            stroke="url(#heroPortfolioStroke)"
            strokeWidth="1.2"
            letterSpacing="0.04em"
            className="font-sans font-black uppercase"
            style={{
              fontSize: "196px",
              fontWeight: 900,
            }}
          >
            {HERO_CONTENT.portfolioWatermark}
          </text>
        </svg>
      </div>

      {/* Spacer to push content down from fixed top navbar */}
      <div className="h-6 sm:h-8" />

      {/* ==================================================================== */}
      {/* 3. FOREGROUND EDITORIAL CONTENT (Layer Z-30, No Photo)               */}
      {/* ==================================================================== */}
      <div className="relative z-30 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-end my-auto py-6 sm:py-10">
        {/* LEFT COLUMN: Cursive Greeting + Big Bold Condensed Name + Intro + CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left max-w-2xl">
          {/* Beat 1: "Hello, I'm" Cursive Script */}
          <SlideEyebrow>
            <div className="mb-2 sm:mb-3">
              <span
                style={{
                  fontFamily:
                    "'Caveat', 'Dancing Script', 'Alex Brush', 'Brush Script MT', var(--font-serif), cursive",
                }}
                className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#ffffff] tracking-wide drop-shadow-[0_2px_12px_rgba(255,255,255,0.35)]"
              >
                {HERO_CONTENT.greetingScript}
              </span>
            </div>
          </SlideEyebrow>

          {/* Beat 2: Tall Condensed Uppercase Name (RAYHAN ADITYA style -> KAUSTUBH CHAMANKAR) */}
          <SlideHeading delay={180}>
            <h1 className="font-sans font-black uppercase tracking-[-0.035em] leading-[0.88] select-none text-white">
              <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[88px] xl:text-[98px] text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.22)]">
                {HERO_CONTENT.firstName}
              </span>
              <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[88px] xl:text-[98px] text-[#e6ebf2]">
                {HERO_CONTENT.lastName}
              </span>
            </h1>
          </SlideHeading>

          {/* Beat 3: Student Title & Concise Bio */}
          <Reveal delay={340}>
            <div className="mt-6 sm:mt-8 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d9b97a]" />
                <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#dce2ec]">
                  {PERSONAL_INFO.role}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm md:text-base text-white/75 leading-relaxed max-w-lg pt-1">
                {HERO_CONTENT.subtitle}
              </p>
            </div>
          </Reveal>

          {/* Primary & Secondary Action Buttons */}
          <Reveal delay={440}>
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href={HERO_CONTENT.primaryButtonHref}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-[#07080a] text-xs font-sans font-bold uppercase tracking-[0.22em] transition-all duration-300 hover:bg-[#e6e8ec] hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] active:scale-[0.99]"
              >
                <span>{HERO_CONTENT.primaryButtonText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href={HERO_CONTENT.secondaryButtonHref}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-white/25 bg-black/60 backdrop-blur-md text-white text-xs font-sans font-medium uppercase tracking-[0.22em] transition-all duration-300 hover:border-white/60 hover:bg-white/[0.08] active:scale-[0.99]"
              >
                <span>{HERO_CONTENT.secondaryButtonText}</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* RIGHT COLUMN: Circular Badge + Verified Social Links */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right space-y-6">
          {/* Circular Star Badge matching reference poster */}
          <Reveal delay={380}>
            <div className="flex items-center lg:flex-row-reverse gap-3.5 p-3.5 sm:p-4.5 rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md max-w-sm shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/25 bg-white/[0.06] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#d9b97a] animate-pulse" />
              </div>
              <p className="font-sans text-xs sm:text-sm text-white/80 font-light leading-snug">
                {HERO_CONTENT.badgeTagline}
              </p>
            </div>
          </Reveal>

          {/* Verified Profile Links (GitHub, LinkedIn, Instagram) */}
          <Reveal delay={480}>
            <div className="flex flex-wrap items-center lg:justify-end gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:border-white/40 hover:bg-white/[0.06] transition-all"
              >
                <span>{HERO_CONTENT.githubLabel}</span>
                <ArrowUpRight className="w-3 h-3 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:border-white/40 hover:bg-white/[0.06] transition-all"
              >
                <span>{HERO_CONTENT.linkedinLabel}</span>
                <ArrowUpRight className="w-3 h-3 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={PERSONAL_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:border-white/40 hover:bg-white/[0.06] transition-all"
              >
                <span>{HERO_CONTENT.instagramLabel}</span>
                <ArrowUpRight className="w-3 h-3 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. BOTTOM BAR: Subtle Scroll Cue + Quick Institution Corner Card     */}
      {/* ==================================================================== */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex items-end justify-between pt-4 border-t border-white/[0.08]">
        {/* Bottom-Left: Subtle Scroll Cue */}
        <a
          href="#manifesto"
          className="group flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.24em] text-[#8a8a86] hover:text-white transition-colors pb-1"
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#d9b97a] animate-bounce" />
          <span>{HERO_CONTENT.scrollCueText}</span>
        </a>

        {/* Bottom-Right: Refined Institution Pill */}
        <Link
          href="#about"
          className="group flex items-center gap-3 px-3.5 py-2 rounded-full border border-white/15 bg-black/50 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/70 shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="font-serif text-[11px] font-bold text-black tracking-tight">
              {PERSONAL_INFO.initials}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9ced6] group-hover:text-white transition-colors flex items-center gap-1">
            {HERO_CONTENT.cornerCardLine1}
            <ArrowUpRight className="w-3 h-3 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
