"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SlideEyebrow, SlideHeading } from "@/components/ui/slide-transition";
import {
  PROJECTS,
  PROJECTS_CONTENT,
  Project,
  ProjectCategory,
} from "@/lib/data";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );
}

/**
 * Concise display title for the bottom pill & modal switcher (matching "Tentipi", "Mikuta", "Audio Visual")
 */
function getShortTitle(title: string): string {
  if (title.includes("—")) {
    return title.split("—")[0].trim();
  }
  return title;
}

/**
 * Bespoke Atmospheric Widescreen Visual Canvas for Each of the 10 Projects
 */
const SLIDE_SCENES: Array<{
  bg: string;
  glowA: string;
  glowB: string;
  accent: string;
  horizon?: string;
}> = [
  // 01: Interactive Ocean Data Visualization (Abyssal twilight blue + warm bioluminescent amber)
  {
    bg: "linear-gradient(135deg, #071322 0%, #0b2239 48%, #040911 100%)",
    glowA:
      "radial-gradient(circle at 72% 38%, rgba(56, 189, 248, 0.34) 0%, rgba(14, 116, 144, 0.14) 42%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 26% 78%, rgba(251, 146, 60, 0.28) 0%, transparent 58%)",
    accent: "rgba(125, 211, 252, 0.32)",
    horizon:
      "linear-gradient(180deg, transparent 54%, rgba(8, 47, 73, 0.55) 75%, rgba(2, 6, 14, 0.92) 100%)",
  },
  // 02: RAG Hallucination Reduction (Warm sunlit amber flare + deep charcoal, inspired by 00:05)
  {
    bg: "linear-gradient(125deg, #1f140e 0%, #3b2416 42%, #0d0a09 100%)",
    glowA:
      "radial-gradient(circle at 64% 30%, rgba(253, 224, 71, 0.34) 0%, rgba(234, 88, 12, 0.22) 38%, transparent 70%)",
    glowB:
      "radial-gradient(circle at 22% 70%, rgba(251, 191, 36, 0.2) 0%, transparent 60%)",
    accent: "rgba(253, 186, 116, 0.3)",
  },
  // 03: Automated Policy Verification (Misty violet/indigo nebula, inspired by 00:07 Audio Visual)
  {
    bg: "linear-gradient(135deg, #12131c 0%, #232338 50%, #090a10 100%)",
    glowA:
      "radial-gradient(circle at 62% 56%, rgba(168, 85, 247, 0.42) 0%, rgba(99, 102, 241, 0.18) 42%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 28% 32%, rgba(226, 232, 240, 0.16) 0%, transparent 62%)",
    accent: "rgba(192, 132, 252, 0.3)",
  },
  // 04: RIKA — Cashew & Cashew-Apple Venture (Coastal dusk terracotta + warm lantern glow, inspired by 00:02)
  {
    bg: "linear-gradient(135deg, #1b1113 0%, #2c1c24 46%, #0c0d14 100%)",
    glowA:
      "radial-gradient(circle at 74% 36%, rgba(251, 146, 60, 0.36) 0%, rgba(190, 24, 93, 0.16) 44%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 38% 82%, rgba(249, 115, 22, 0.32) 0%, transparent 54%)",
    accent: "rgba(253, 186, 116, 0.28)",
    horizon:
      "linear-gradient(180deg, transparent 58%, rgba(30, 27, 46, 0.5) 100%)",
  },
  // 05: FreshLoop AgriTech (Deep emerald forest twilight + golden morning mist)
  {
    bg: "linear-gradient(135deg, #071914 0%, #102e24 48%, #050c0a 100%)",
    glowA:
      "radial-gradient(circle at 68% 36%, rgba(52, 211, 153, 0.3) 0%, rgba(16, 185, 129, 0.12) 45%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 24% 76%, rgba(250, 204, 21, 0.2) 0%, transparent 60%)",
    accent: "rgba(110, 231, 183, 0.28)",
  },
  // 06: Personal Portfolio Website (Monolithic silver architectural spotlight)
  {
    bg: "linear-gradient(135deg, #0b0d12 0%, #1b1f2a 50%, #060709 100%)",
    glowA:
      "radial-gradient(circle at 58% 34%, rgba(241, 245, 249, 0.28) 0%, rgba(148, 163, 184, 0.12) 44%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 22% 76%, rgba(148, 163, 184, 0.18) 0%, transparent 58%)",
    accent: "rgba(226, 232, 240, 0.3)",
  },
  // 07: College Information Webpage (Editorial cobalt blueprint + soft ivory light)
  {
    bg: "linear-gradient(135deg, #0a1224 0%, #172544 50%, #070b14 100%)",
    glowA:
      "radial-gradient(circle at 68% 40%, rgba(96, 165, 250, 0.32) 0%, rgba(59, 130, 246, 0.14) 44%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 25% 75%, rgba(226, 232, 240, 0.16) 0%, transparent 58%)",
    accent: "rgba(147, 197, 253, 0.28)",
  },
  // 08: Comparative Study of Generative AI Tools (Iridescent prism aurora)
  {
    bg: "linear-gradient(135deg, #161124 0%, #261b3d 48%, #090811 100%)",
    glowA:
      "radial-gradient(circle at 66% 42%, rgba(232, 121, 249, 0.34) 0%, rgba(56, 189, 248, 0.18) 46%, transparent 74%)",
    glowB:
      "radial-gradient(circle at 24% 68%, rgba(129, 140, 248, 0.24) 0%, transparent 60%)",
    accent: "rgba(240, 171, 252, 0.3)",
  },
  // 09: CampusPulse Bottleneck Detector (Slate cyan telemetry horizon)
  {
    bg: "linear-gradient(135deg, #09161c 0%, #132a34 48%, #060b0e 100%)",
    glowA:
      "radial-gradient(circle at 70% 42%, rgba(45, 212, 191, 0.32) 0%, rgba(20, 184, 166, 0.14) 44%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 28% 72%, rgba(56, 189, 248, 0.2) 0%, transparent 58%)",
    accent: "rgba(94, 234, 212, 0.28)",
  },
  // 10: Movie Night — College Event Proposal (Warm cinema projector beam & string-light bokeh, inspired by 00:02)
  {
    bg: "linear-gradient(135deg, #171019 0%, #291a27 46%, #09080d 100%)",
    glowA:
      "radial-gradient(circle at 72% 32%, rgba(251, 191, 36, 0.38) 0%, rgba(244, 63, 94, 0.16) 44%, transparent 72%)",
    glowB:
      "radial-gradient(circle at 36% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 56%)",
    accent: "rgba(253, 224, 71, 0.3)",
  },
];

export function Projects() {
  const reducedMotion = useReducedMotion();
  const allLabel = PROJECTS_CONTENT.allFilterLabel;
  const categories = useMemo(
    () => [allLabel, ...PROJECTS_CONTENT.filterCategories],
    [allLabel]
  );

  const [activeCategory, setActiveCategory] = useState<string>(allLabel);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { labels } = PROJECTS_CONTENT;

  const filteredProjects = useMemo(
    () =>
      activeCategory === allLabel
        ? PROJECTS
        : PROJECTS.filter(
            (p) => p.category === (activeCategory as ProjectCategory)
          ),
    [activeCategory, allLabel]
  );

  const safeActiveIndex = Math.min(
    Math.max(0, activeIndex),
    Math.max(0, filteredProjects.length - 1)
  );
  const currentProject = filteredProjects[safeActiveIndex];

  // DOM Refs for zero-rerender 120fps 3D concave cylinder + chromatic aberration
  const sectionRef = useRef<HTMLElement | null>(null);
  const aberrationRef = useRef<HTMLDivElement | null>(null);
  const redOffsetRef = useRef<SVGFEOffsetElement | null>(null);
  const blueOffsetRef = useRef<SVGFEOffsetElement | null>(null);
  const arcGliderRef = useRef<SVGPathElement | null>(null);

  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const artRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Continuous physics state stored in ref so RAF runs at native display refresh
  const physicsRef = useRef({
    currentIdx: 0,
    targetIdx: 0,
    rafId: null as number | null,
    lastReportedIdx: 0,
  });

  // Drag gesture tracking
  const dragRef = useRef({
    isDown: false,
    moved: false,
    startX: 0,
    startScrollY: 0,
  });

  // Scroll the page smoothly to put slide `idx` dead-center on the 3D cylinder
  const scrollToSlide = useCallback(
    (idx: number, smooth = true) => {
      const count = filteredProjects.length;
      const clamped = Math.max(0, Math.min(count - 1, idx));
      const section = sectionRef.current;

      if (!section || count <= 1) {
        physicsRef.current.targetIdx = clamped;
        setActiveIndex(clamped);
        return;
      }

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollable = Math.max(0, section.offsetHeight - window.innerHeight);
      const ratio = clamped / (count - 1);

      window.scrollTo({
        top: sectionTop + ratio * scrollable,
        behavior: smooth && !reducedMotion ? "smooth" : "auto",
      });
    },
    [filteredProjects.length, reducedMotion]
  );

  // Render a single frame of the 3D Concave Cylindrical Panorama + Arc + RGB Split
  const renderCylinderFrame = useCallback(
    (floatIdx: number, velocity: number) => {
      const count = filteredProjects.length;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;

      // Responsive widescreen slide width + uniform gap matching the video
      const slideW =
        vw >= 1024
          ? Math.min(vw * 0.55, 860)
          : vw >= 640
            ? vw * 0.68
            : vw * 0.8;
      const gap = Math.max(22, Math.min(46, vw * 0.032));

      // Inscribed polygonal concave cylinder math:
      // Each slide sits tangent to an inner cylinder wrapping around the viewer
      const stepAngle = vw >= 768 ? 0.48 : 0.42; // radians (~27.5 deg desktop)
      const chord = slideW + gap;
      const radius = chord / (2 * Math.tan(stepAngle / 2));

      for (let i = 0; i < count; i++) {
        const slideEl = slideRefs.current[i];
        if (!slideEl) continue;

        const delta = i - floatIdx;
        if (Math.abs(delta) > 2.6) {
          slideEl.style.visibility = "hidden";
          slideEl.style.pointerEvents = "none";
          continue;
        }

        slideEl.style.visibility = "visible";
        slideEl.style.pointerEvents = "auto";

        const theta = delta * stepAngle;
        const x = Math.sin(theta) * radius;
        const z = (1 - Math.cos(theta)) * radius * 0.86;
        const rotYDeg = -(theta * 180) / Math.PI;

        // Center slide is 100% bright; peripheral slides gently dim into cinema shadow
        const brightness = Math.max(0.38, 1 - Math.abs(delta) * 0.3);

        slideEl.style.width = `${slideW}px`;
        slideEl.style.transform = `translate3d(calc(-50% + ${x.toFixed(
          1
        )}px), -50%, ${z.toFixed(1)}px) rotateY(${rotYDeg.toFixed(2)}deg)`;
        slideEl.style.opacity = brightness.toFixed(3);
        slideEl.style.zIndex = String(100 - Math.round(Math.abs(delta) * 20));

        // Internal widescreen backdrop counter-parallax
        const artEl = artRefs.current[i];
        if (artEl) {
          const parallaxX = Math.max(-52, Math.min(52, delta * -30));
          artEl.style.transform = `translate3d(${parallaxX.toFixed(
            1
          )}px, 0, 0) scale(1.12)`;
        }
      }

      // Update Curved SVG Arc Scrub Glider (00:04 -> 00:09 bottom arc dial)
      const arcEl = arcGliderRef.current;
      if (arcEl) {
        const arcTotalLen = 120;
        const segLen = count <= 1 ? arcTotalLen : Math.max(22, arcTotalLen / Math.min(count, 4.5));
        const norm = count > 1 ? Math.max(0, Math.min(1, floatIdx / (count - 1))) : 0;
        const maxTravel = arcTotalLen - segLen;
        arcEl.style.strokeDasharray = `${segLen} ${arcTotalLen}`;
        arcEl.style.strokeDashoffset = `${-(norm * maxTravel)}`;
      }

      // Velocity-Driven RGB Chromatic Aberration (00:04 -> 00:06)
      const wrapEl = aberrationRef.current;
      if (wrapEl) {
        const rgbShift = reducedMotion
          ? 0
          : Math.max(-13, Math.min(13, velocity * 24));
        if (Math.abs(rgbShift) > 0.32) {
          redOffsetRef.current?.setAttribute("dx", rgbShift.toFixed(2));
          blueOffsetRef.current?.setAttribute("dx", (-rgbShift).toFixed(2));
          wrapEl.style.filter = "url(#projects-rgb-aberration)";
        } else if (wrapEl.style.filter !== "none") {
          wrapEl.style.filter = "none";
        }
      }
    },
    [filteredProjects.length, reducedMotion]
  );

  // Sync vertical page scroll -> continuous targetIdx + RAF physics loop
  useEffect(() => {
    const state = physicsRef.current;
    const count = filteredProjects.length;

    const computeTargetFromScroll = () => {
      const section = sectionRef.current;
      if (!section || count <= 1) return 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      return progress * (count - 1);
    };

    const stepPhysics = () => {
      const diff = state.targetIdx - state.currentIdx;
      const damping = reducedMotion ? 1 : 0.12;

      if (Math.abs(diff) > 0.0008) {
        state.currentIdx += diff * damping;
        renderCylinderFrame(state.currentIdx, diff);

        const nearest = Math.max(
          0,
          Math.min(count - 1, Math.round(state.currentIdx))
        );
        if (nearest !== state.lastReportedIdx) {
          state.lastReportedIdx = nearest;
          setActiveIndex(nearest);
        }

        state.rafId = window.requestAnimationFrame(stepPhysics);
      } else {
        state.currentIdx = state.targetIdx;
        renderCylinderFrame(state.currentIdx, 0);

        const nearest = Math.max(
          0,
          Math.min(count - 1, Math.round(state.currentIdx))
        );
        if (nearest !== state.lastReportedIdx) {
          state.lastReportedIdx = nearest;
          setActiveIndex(nearest);
        }

        state.rafId = null;
      }
    };

    const scheduleStep = () => {
      state.targetIdx = computeTargetFromScroll();
      if (state.rafId === null) {
        state.rafId = window.requestAnimationFrame(stepPhysics);
      }
    };

    // Initial position sync
    const initial = computeTargetFromScroll();
    state.targetIdx = initial;
    state.currentIdx = initial;
    state.lastReportedIdx = Math.round(initial);
    state.rafId = window.requestAnimationFrame(() => {
      setActiveIndex(state.lastReportedIdx);
      renderCylinderFrame(state.currentIdx, 0);
      state.rafId = null;
    });

    window.addEventListener("scroll", scheduleStep, { passive: true });
    window.addEventListener("resize", scheduleStep);

    return () => {
      window.removeEventListener("scroll", scheduleStep);
      window.removeEventListener("resize", scheduleStep);
      if (state.rafId !== null) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    };
  }, [filteredProjects.length, reducedMotion, renderCylinderFrame]);

  // Modal keyboard navigation (Escape to close, Left/Right arrows to switch project)
  useEffect(() => {
    if (!selectedProject) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      } else if (e.key === "ArrowRight") {
        const idx = filteredProjects.findIndex(
          (p) => p.id === selectedProject.id
        );
        if (idx >= 0 && idx < filteredProjects.length - 1) {
          const next = filteredProjects[idx + 1];
          setSelectedProject(next);
          scrollToSlide(idx + 1, false);
        }
      } else if (e.key === "ArrowLeft") {
        const idx = filteredProjects.findIndex(
          (p) => p.id === selectedProject.id
        );
        if (idx > 0) {
          const prev = filteredProjects[idx - 1];
          setSelectedProject(prev);
          scrollToSlide(idx - 1, false);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [selectedProject, filteredProjects, scrollToSlide]);

  // Pointer drag on the 3D stage translates seamlessly into vertical scroll runway
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      isDown: true,
      moved: false,
      startX: e.clientX,
      startScrollY: window.scrollY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 6) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved && filteredProjects.length > 1) {
      const section = sectionRef.current;
      if (!section) return;
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const pxPerSlide = scrollable / (filteredProjects.length - 1);
      const scrollDelta = (-dx / (window.innerWidth * 0.45)) * pxPerSlide;
      window.scrollTo({
        top: dragRef.current.startScrollY + scrollDelta,
        behavior: "auto",
      });
    }
  };

  const handlePointerUp = () => {
    dragRef.current.isDown = false;
  };

  // Horizontal two-finger trackpad swipe support
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (
      Math.abs(e.deltaX) > Math.abs(e.deltaY) &&
      Math.abs(e.deltaX) > 3 &&
      filteredProjects.length > 1
    ) {
      window.scrollBy({ top: e.deltaX * 1.35, behavior: "auto" });
    }
  };

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    physicsRef.current.currentIdx = 0;
    physicsRef.current.targetIdx = 0;
    physicsRef.current.lastReportedIdx = 0;
    setActiveIndex(0);

    const section = sectionRef.current;
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "auto" });
    }
  };

  // Dynamic runway height so scrolling through N projects feels paced and fluid
  const runwayVh =
    filteredProjects.length <= 1
      ? 100
      : Math.max(220, 100 + (filteredProjects.length - 1) * 44);

  const selectedModalIndex = selectedProject
    ? filteredProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        height: `${runwayVh}vh`,
      }}
      className="relative border-t border-white/[0.06] bg-transparent select-none"
    >
      {/* Zero-size SVG Chromatic Aberration Filter + Concave Panoramic Lens ClipPath */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed w-0 h-0 opacity-0"
      >
        <defs>
          <clipPath
            id="projects-concave-lens"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M -0.02,0 Q 0.5,0.085 1.02,0 L 1.02,1 Q 0.5,0.915 -0.02,1 Z" />
          </clipPath>
          <filter
            id="projects-rgb-aberration"
            x="-12%"
            y="-12%"
            width="124%"
            height="124%"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="redChannel"
            />
            <feOffset
              ref={redOffsetRef}
              in="redChannel"
              dx="0"
              dy="0"
              result="redShifted"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="greenChannel"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blueChannel"
            />
            <feOffset
              ref={blueOffsetRef}
              in="blueChannel"
              dx="0"
              dy="0"
              result="blueShifted"
            />
            <feBlend
              in="redShifted"
              in2="greenChannel"
              mode="screen"
              result="redGreen"
            />
            <feBlend in="redGreen" in2="blueShifted" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Sticky Full-Screen 3D Concave Panoramic Cinema Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 pb-7 bg-transparent">
        {/* Top Compact Masthead & Minimalist Category Filter Bar */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-16 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <SlideEyebrow>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  {PROJECTS_CONTENT.eyebrow}
                </span>
                <div className="h-[1px] w-10 bg-[#c9ced6]/35" />
                <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-[#8a8a86]">
                  {String(safeActiveIndex + 1).padStart(2, "0")} /{" "}
                  {String(filteredProjects.length).padStart(2, "0")}
                </span>
              </div>
            </SlideEyebrow>
            <SlideHeading delay={190}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none">
                {PROJECTS_CONTENT.heading}
              </h2>
            </SlideHeading>
          </div>

          {/* Open Minimalist Category Tabs */}
          <Reveal delay={330}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleSelectCategory(category)}
                    className={`group relative py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-[#8a8a86] hover:text-white"
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`block h-[1.5px] mt-1 transition-all duration-300 ${
                        isActive
                          ? "w-full bg-white"
                          : "w-0 bg-[#c9ced6]/60 group-hover:w-1/2"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* CENTER: 3D Concave Cylindrical Panoramic Strip clipped with Curved IMAX Lens */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          style={{
            clipPath: "url(#projects-concave-lens)",
          }}
          className="relative w-full flex-1 my-3 sm:my-4 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {/* Outer Chromatic Aberration Post-Processing Wrapper (preserves true 3D inside!) */}
          <div
            ref={aberrationRef}
            className="relative w-full h-full flex items-center justify-center will-change-[filter]"
          >
            {/* 3D Perspective Camera */}
            <div
              style={{
                perspective: "1150px",
                perspectiveOrigin: "50% 50%",
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* 3D Preserve-3D Cylinder Ring */}
              <div
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full h-full"
              >
                {filteredProjects.map((project, index) => {
                  const globalIdx = PROJECTS.findIndex(
                    (p) => p.id === project.id
                  );
                  const scene =
                    SLIDE_SCENES[
                      (globalIdx >= 0 ? globalIdx : index) % SLIDE_SCENES.length
                    ];
                  const isCenter = index === safeActiveIndex;

                  return (
                    <div
                      key={project.id}
                      ref={(el) => {
                        slideRefs.current[index] = el;
                      }}
                      onClick={() => {
                        if (dragRef.current.moved) return;
                        if (index === safeActiveIndex) {
                          setSelectedProject(project);
                        } else {
                          scrollToSlide(index);
                        }
                      }}
                      style={{
                        left: "50%",
                        top: "50%",
                        backfaceVisibility: "hidden",
                      }}
                      className="group/slide absolute h-[86%] sm:h-[90%] max-h-[500px] overflow-hidden will-change-[transform,opacity]"
                    >
                      {/* Parallax Widescreen Atmospheric Visual Scene */}
                      <div
                        ref={(el) => {
                          artRefs.current[index] = el;
                        }}
                        style={{ background: scene.bg }}
                        className="absolute inset-0 will-change-transform"
                      >
                        <div
                          style={{ background: scene.glowA }}
                          className="absolute inset-0"
                        />
                        <div
                          style={{ background: scene.glowB }}
                          className="absolute inset-0"
                        />
                        {scene.horizon && (
                          <div
                            style={{ background: scene.horizon }}
                            className="absolute inset-0"
                          />
                        )}

                        {/* Subtle Architectural Optical Grid & Ambient Specular Rim */}
                        <div
                          style={{
                            borderColor: scene.accent,
                          }}
                          className="absolute inset-0 border opacity-40"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(3,4,7,0.72)_100%)]" />

                        {/* Oversized Atmospheric Watermark Number */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-6 sm:right-10 bottom-3 font-serif text-[110px] sm:text-[170px] leading-none text-white/[0.06] tracking-tighter"
                        >
                          {project.number}
                        </span>
                      </div>

                      {/* Widescreen Cinema Typography Overlay (Modeled directly on 00:02 "Tentipi") */}
                      <div className="relative z-10 w-full h-full flex flex-col justify-center px-7 sm:px-12 md:px-16 py-8">
                        <div className="max-w-xl space-y-3 sm:space-y-4">
                          {/* Subtle Domain & Status Line */}
                          <div className="flex flex-wrap items-center gap-2.5 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.24em] text-white/75">
                            <span className="font-semibold text-white">
                              {project.number}
                            </span>
                            <span>•</span>
                            <span>{project.category}</span>
                            <span>•</span>
                            <span className="text-[#c9ced6]">
                              {project.status}
                            </span>
                          </div>

                          {/* Bold Editorial Widescreen Headline */}
                          <h3 className="font-sans font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-white tracking-[-0.025em] leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                            {project.title}
                          </h3>

                          {/* Concise Lead Description */}
                          <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-lg">
                            {project.summary}
                          </p>

                          {/* Crisp White Rounded Pill CTA (Identical to "Browse our products" in 00:02) */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCenter) {
                                  setSelectedProject(project);
                                } else {
                                  scrollToSlide(index);
                                }
                              }}
                              style={{
                                backgroundColor: "#ffffff",
                                color: "#07080a",
                              }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-medium tracking-wide shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-105 active:scale-95"
                            >
                              <span>{labels.exploreSlideButton}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HUD: Curved SVG Arc Progress Dial + Active Project Pill (00:04 -> 00:09) */}
        <div className="relative z-30 flex flex-col items-center justify-center gap-2 px-6">
          {/* Shallow Curved Arc Progress Indicator */}
          <svg
            width="136"
            height="24"
            viewBox="0 0 136 24"
            fill="none"
            aria-hidden="true"
            className="overflow-visible"
          >
            {/* Dim Curved Base Arc */}
            <path
              d="M 10 20 Q 68 3 126 20"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={120}
            />
            {/* Sliding Bright White Arc Segment */}
            <path
              ref={arcGliderRef}
              d="M 10 20 Q 68 3 126 20"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={120}
              style={{
                strokeDasharray: "28 120",
                strokeDashoffset: 0,
              }}
            />
          </svg>

          {/* Frosted Active Project Pill + Subtle Prev/Next Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSlide(safeActiveIndex - 1)}
              disabled={safeActiveIndex <= 0}
              aria-label={labels.prevProjectAriaLabel}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a8a86] hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {currentProject && (
              <button
                type="button"
                onClick={() => setSelectedProject(currentProject)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                }}
                className="px-5 py-2 rounded-full border border-white/15 backdrop-blur-md text-xs sm:text-[13px] font-sans font-medium text-white tracking-wide hover:border-white/35 transition-all duration-200"
              >
                {getShortTitle(currentProject.title)}
              </button>
            )}

            <button
              type="button"
              onClick={() => scrollToSlide(safeActiveIndex + 1)}
              disabled={safeActiveIndex >= filteredProjects.length - 1}
              aria-label={labels.nextProjectAriaLabel}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a8a86] hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CASE-STUDY DETAIL OVERLAY SHEET (Modeled on 00:00 -> 00:01 with Bottom "<- Title ->" & "X") */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
          style={{ backgroundColor: "rgba(5, 6, 8, 0.94)" }}
          className="fixed inset-0 z-50 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200 select-text"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-12 pt-16 sm:pt-24 pb-32">
            {/* Top Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#d9b97a]">
                <span className="text-white font-semibold">
                  {selectedProject.number}
                </span>
                <span>•</span>
                <span>{selectedProject.domain}</span>
              </div>

              <span className="px-3.5 py-1 rounded-full border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white">
                {selectedProject.status}
              </span>
            </div>

            {/* Editorial Title & Summary */}
            <div className="mt-8 space-y-6">
              <h3 className="font-serif text-3xl sm:text-5xl text-white tracking-tight leading-[1.08]">
                {selectedProject.title}
              </h3>

              <p className="text-base sm:text-lg text-[#f4f4f2] font-light leading-relaxed">
                {selectedProject.summary}
              </p>

              {/* My Contribution So Far */}
              <div className="border-l-2 border-white/35 pl-5 py-1">
                <span className="block text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-white mb-1.5">
                  {labels.contributionPrefix}
                </span>
                <p className="text-sm text-[#8a8a86] leading-relaxed">
                  {selectedProject.contribution}
                </p>
              </div>
            </div>

            {/* Structured Objectives, Deliverables, Next Steps & Verification Note */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              {selectedProject.objectives &&
                selectedProject.objectives.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.24em] text-white font-semibold mb-3 pb-2 border-b border-white/10">
                      {labels.objectivesHeading}
                    </h4>
                    <ul className="space-y-2 text-[#8a8a86]">
                      {selectedProject.objectives.map((item) => (
                        <li
                          key={item}
                          className="leading-relaxed pl-3 border-l border-white/15"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedProject.plannedDeliverables &&
                selectedProject.plannedDeliverables.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.24em] text-white font-semibold mb-3 pb-2 border-b border-white/10">
                      {labels.deliverablesHeading}
                    </h4>
                    <ul className="space-y-2 text-[#8a8a86]">
                      {selectedProject.plannedDeliverables.map((item) => (
                        <li
                          key={item}
                          className="leading-relaxed pl-3 border-l border-white/15"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedProject.nextSteps &&
                selectedProject.nextSteps.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.24em] text-white font-semibold mb-3 pb-2 border-b border-white/10">
                      {labels.nextStepsHeading}
                    </h4>
                    <ul className="space-y-2 text-[#8a8a86]">
                      {selectedProject.nextSteps.map((item) => (
                        <li
                          key={item}
                          className="leading-relaxed pl-3 border-l border-white/15"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedProject.accuracyNote && (
                <div className="md:col-span-2 pt-5 border-t border-white/10">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] block mb-1.5">
                    {labels.verificationNoteHeading}
                  </span>
                  <p className="text-xs sm:text-sm text-[#8a8a86] leading-relaxed">
                    {selectedProject.accuracyNote}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Floating Bottom Navigation Bar ("<- Project Title ->") + Bottom-Right "X" Close Button (00:00 -> 00:01) */}
          <div className="fixed bottom-6 inset-x-0 z-50 px-6 flex items-center justify-center pointer-events-none">
            <div
              style={{ backgroundColor: "rgba(24, 26, 32, 0.88)" }}
              className="pointer-events-auto flex items-center justify-between gap-6 px-5 py-3 rounded-xl border border-white/15 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] min-w-[260px] sm:min-w-[320px]"
            >
              <button
                type="button"
                disabled={selectedModalIndex <= 0}
                aria-label={labels.prevProjectAriaLabel}
                onClick={() => {
                  if (selectedModalIndex > 0) {
                    const prev = filteredProjects[selectedModalIndex - 1];
                    setSelectedProject(prev);
                    scrollToSlide(selectedModalIndex - 1, false);
                  }
                }}
                className="text-white/75 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <span className="text-xs sm:text-sm font-sans font-medium text-white truncate max-w-[200px]">
                {getShortTitle(selectedProject.title)}
              </span>

              <button
                type="button"
                disabled={
                  selectedModalIndex < 0 ||
                  selectedModalIndex >= filteredProjects.length - 1
                }
                aria-label={labels.nextProjectAriaLabel}
                onClick={() => {
                  if (
                    selectedModalIndex >= 0 &&
                    selectedModalIndex < filteredProjects.length - 1
                  ) {
                    const next = filteredProjects[selectedModalIndex + 1];
                    setSelectedProject(next);
                    scrollToSlide(selectedModalIndex + 1, false);
                  }
                }}
                className="text-white/75 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label={labels.closeDetailsAriaLabel}
              style={{ backgroundColor: "rgba(24, 26, 32, 0.9)" }}
              className="pointer-events-auto fixed right-6 bottom-6 w-11 h-11 rounded-full border border-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
