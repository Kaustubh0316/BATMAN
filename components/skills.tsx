"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Code2, Brain, Sparkles, Compass, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SlideEyebrow, SlideHeading } from "@/components/ui/slide-transition";
import { SKILLS_CONTENT, SKILL_CATEGORIES, SkillCategory } from "@/lib/data";

const iconMap = {
  Code2: Code2,
  Brain: Brain,
  Sparkles: Sparkles,
  Compass: Compass,
};

function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined" ? window.matchMedia(query).matches : serverFallback,
    () => serverFallback
  );
}

interface GalleryPanelProps {
  category: SkillCategory;
  index: number;
  total: number;
  activeIndex: number;
  progress: number;
  isDesktopPinned: boolean;
}

function GalleryPanel({
  category,
  index,
  total,
  activeIndex,
  progress,
  isDesktopPinned,
}: GalleryPanelProps) {
  const IconComponent = iconMap[category.iconName];
  const chapterNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(total).padStart(2, "0");

  // Smooth relative offset [-1..1] for horizontal counter-parallax on the giant numeral
  const targetCenter = total > 1 ? index / (total - 1) : 0;
  const relativeDelta = isDesktopPinned ? progress - targetCenter : 0;
  const parallaxX = Math.max(-70, Math.min(70, relativeDelta * -110));
  const isActive = activeIndex === index;

  return (
    <article
      className={`relative shrink-0 border-l border-white/15 flex flex-col justify-between select-none transition-opacity duration-500 ${
        isDesktopPinned
          ? "w-[74vw] lg:w-[56vw] xl:w-[48vw] pl-10 lg:pl-14 pr-12 lg:pr-20 py-2"
          : "w-[86vw] sm:w-[72vw] snap-start pl-6 sm:pl-8 pr-6 py-4"
      } ${isDesktopPinned && !isActive ? "opacity-65 hover:opacity-100" : "opacity-100"}`}
    >
      {/* Giant Ghosted Parallax Numeral (No Card Box — Pure Open Stage) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-0 font-serif text-[130px] sm:text-[170px] lg:text-[210px] leading-[0.82] tracking-tighter text-white transition-transform duration-150 ease-out will-change-transform"
        style={{
          opacity: isActive ? 0.07 : 0.03,
          transform: `translate3d(${parallaxX}px, 0, 0)`,
        }}
      >
        {chapterNumber}
      </div>

      {/* Top Accent Hairline Tick */}
      <div
        aria-hidden="true"
        className={`absolute -left-[1px] top-0 w-[2px] transition-all duration-500 ${
          isActive ? "h-24 bg-white" : "h-8 bg-[#8b8f98]/40"
        }`}
      />

      {/* Open Editorial Chapter Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <IconComponent className="w-4 h-4 text-[#d9b97a]" />
          <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-[#d9b97a]">
            {SKILLS_CONTENT.chapterPrefix} {chapterNumber} / {totalNumber} —{" "}
            {category.subtitle}
          </span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.06] mb-3">
          {category.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#8a8a86] font-light leading-relaxed max-w-lg">
          {category.description}
        </p>
      </div>

      {/* Flowing Open Architectural Skill Streams (Zero Card Chrome) */}
      <div className="relative z-10 border-t border-white/10">
        {category.items.map((item, itemIdx) => {
          const itemNum = String(itemIdx + 1).padStart(2, "0");
          return (
            <div
              key={item.name}
              className="group/skill flex items-baseline justify-between gap-3 py-3 sm:py-3.5 border-b border-white/[0.08] transition-colors duration-300 hover:border-white/30"
            >
              <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                <span className="font-sans text-[10px] tracking-[0.22em] text-[#8a8a86] group-hover/skill:text-white transition-colors">
                  {itemNum}
                </span>
                <span className="font-serif text-lg sm:text-xl lg:text-2xl text-white tracking-tight transition-transform duration-300 group-hover/skill:translate-x-1.5 truncate">
                  {item.name}
                </span>
              </div>

              {/* Architectural Dotted Leader */}
              <div className="hidden sm:block flex-1 border-b border-dashed border-white/10 mx-2 transition-colors duration-300 group-hover/skill:border-white/25" />

              <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.16em] text-[#8a8a86] group-hover/skill:text-[#f4f4f2] transition-colors text-right shrink-0">
                {item.stage}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function Skills() {
  const isDesktop = useMediaQuery("(min-width: 768px)", false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);
  const isDesktopPinned = isDesktop && !reducedMotion;

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const totalChapters = SKILL_CATEGORIES.length;
  const activeIndex = Math.min(
    totalChapters - 1,
    Math.max(0, Math.round(progress * (totalChapters - 1)))
  );

  // Desktop vertical-scroll -> silky horizontal gallery scrub with RAF inertia
  useEffect(() => {
    if (!isDesktopPinned) return;

    let rafId: number | null = null;
    let targetProgress = 0;
    let currentProgress = 0;
    let maxShift = 0;

    const measureMaxShift = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return 0;
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    };

    const computeTarget = () => {
      const section = sectionRef.current;
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    const tick = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0006) {
        currentProgress += diff * 0.16;
        setProgress(currentProgress);
        setTranslateX(-currentProgress * maxShift);
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentProgress = targetProgress;
        setProgress(currentProgress);
        setTranslateX(-currentProgress * maxShift);
        rafId = null;
      }
    };

    const handleScrollOrResize = () => {
      maxShift = measureMaxShift();
      targetProgress = computeTarget();
      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // Initial sync
    maxShift = measureMaxShift();
    targetProgress = computeTarget();
    currentProgress = targetProgress;
    rafId = window.requestAnimationFrame(() => {
      setProgress(currentProgress);
      setTranslateX(-currentProgress * maxShift);
      rafId = null;
    });

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isDesktopPinned]);

  // Mobile native horizontal swipe progress sync
  const handleMobileScroll = () => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    setProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
  };

  // Jump to chapter on click
  const jumpToChapter = (idx: number) => {
    const ratio = totalChapters > 1 ? idx / (totalChapters - 1) : 0;

    if (isDesktopPinned) {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollable = section.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: sectionTop + ratio * Math.max(0, scrollable),
        behavior: "smooth",
      });
    } else {
      const el = mobileTrackRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollTo({
        left: ratio * Math.max(0, maxScroll),
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`relative border-t border-white/[0.06] bg-[#050505] ${
        isDesktopPinned ? "h-[330vh]" : "py-24 sm:py-28"
      }`}
    >
      <div
        className={
          isDesktopPinned
            ? "sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-20 sm:pt-22 pb-6"
            : "w-full"
        }
      >
        {/* Ambient Moving Light Horizon */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-[520px] h-[340px] rounded-full bg-[#d9b97a]/5 blur-[140px] transition-transform duration-300"
          style={{
            left: `${15 + progress * 55}%`,
          }}
        />

        {/* Top Section Masthead + Interactive Chapter Rail */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-5 border-b border-white/[0.08]">
            <div>
              <SlideEyebrow>
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                    {SKILLS_CONTENT.eyebrow}
                  </span>
                  <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
                </div>
              </SlideEyebrow>
              <SlideHeading delay={190}>
                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                  {SKILLS_CONTENT.heading}
                </h2>
              </SlideHeading>
            </div>

            <Reveal delay={330}>
              <p className="text-xs sm:text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
                {SKILLS_CONTENT.subtitle}
              </p>
            </Reveal>
          </div>

          {/* Interactive Chapter Selector Strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4">
            {SKILL_CATEGORIES.map((cat, idx) => {
              const isCurrent = activeIndex === idx;
              const num = String(idx + 1).padStart(2, "0");
              return (
                <button
                  key={cat.id}
                  onClick={() => jumpToChapter(idx)}
                  className={`group relative py-1.5 text-left transition-colors duration-300 ${
                    isCurrent
                      ? "text-white"
                      : "text-[#8a8a86] hover:text-white"
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.22em]">
                    <span className="mr-1.5 opacity-60">{num}</span>
                    {cat.title}
                  </span>
                  <span
                    className={`block h-[1.5px] mt-1 transition-all duration-300 ${
                      isCurrent
                        ? "w-full bg-white"
                        : "w-0 bg-[#c9ced6]/60 group-hover:w-1/2"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Exhibition Gallery Viewport */}
        {isDesktopPinned ? (
          <div
            ref={viewportRef}
            className="relative w-full overflow-hidden my-auto py-4"
          >
            <div
              ref={trackRef}
              className="flex items-stretch pl-6 sm:pl-12 md:pl-[max(4rem,calc((100vw-80rem)/2+4rem))] pr-16 will-change-transform"
              style={{
                transform: `translate3d(${translateX}px, 0, 0)`,
              }}
            >
              {SKILL_CATEGORIES.map((category, index) => (
                <GalleryPanel
                  key={category.id}
                  category={category}
                  index={index}
                  total={totalChapters}
                  activeIndex={activeIndex}
                  progress={progress}
                  isDesktopPinned={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={mobileTrackRef}
            onScroll={handleMobileScroll}
            className="mt-10 flex items-stretch overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 sm:px-12 gap-6 pb-4"
          >
            {SKILL_CATEGORIES.map((category, index) => (
              <GalleryPanel
                key={category.id}
                category={category}
                index={index}
                total={totalChapters}
                activeIndex={activeIndex}
                progress={progress}
                isDesktopPinned={false}
              />
            ))}
          </div>
        )}

        {/* Bottom Horizontal Scrub Progress Bar */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-16 pt-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-[10px] font-sans uppercase tracking-[0.26em] text-[#8a8a86]">
              <span className="text-white font-semibold">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span>/</span>
              <span>{String(totalChapters).padStart(2, "0")}</span>
            </div>

            <div className="flex-1 h-[1.5px] bg-[#8b8f98]/25 overflow-hidden relative">
              <div
                className="h-full bg-white transition-[width] duration-75 ease-out"
                style={{
                  width: `${Math.max(8, Math.round(progress * 100))}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.24em] text-[#8a8a86]">
              <span>
                {isDesktopPinned
                  ? SKILLS_CONTENT.galleryHintDesktop
                  : SKILLS_CONTENT.galleryHintMobile}
              </span>
              <ArrowRight className="w-3 h-3 text-[#d9b97a]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
