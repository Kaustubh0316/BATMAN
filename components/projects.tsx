"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PROJECTS, Project, ProjectCategory } from "@/lib/data";

const CATEGORIES: ("All" | ProjectCategory)[] = [
  "All",
  "AI & Research",
  "Web Development",
  "Entrepreneurship",
  "Academic Work",
  "Event Planning",
];

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const filteredProjects =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  const toggleDetails = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505]"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#d9b97a]/5 blur-[140px]" />

      <div className="max-w-7xl mx-auto">
        {/* Section Eyebrow & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
                  03 // Project Portfolio
                </span>
                <div className="h-[1px] w-12 bg-[#d9b97a]/30" />
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
                projects & explorations.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-sm text-[#8a8a86] max-w-md font-light leading-relaxed">
              Research inquiries, coursework assignments, web development, and early-stage venture concepts — each labeled with its current stage of progress.
            </p>
          </Reveal>
        </div>

        {/* Category Filter Tabs */}
        <Reveal delay={120}>
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] transition-all duration-200 border ${
                    isActive
                      ? "bg-white text-[#07080a] border-white font-semibold"
                      : "bg-white/[0.02] text-[#8a8a86] border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Project Rows */}
        <div className="border-b border-white/[0.08]">
          {filteredProjects.map((project: Project, index: number) => {
            const isExpanded = !!expandedIds[project.id];

            return (
              <Reveal key={project.id} delay={index * 60}>
                <div className="group relative border-t border-white/[0.08] p-6 sm:p-8 md:p-10 transition-all duration-300 hover:bg-white/[0.015] rounded-2xl">
                  {/* Top Line: Number, Title, Category & Status */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <span className="font-sans text-xs sm:text-sm font-medium tracking-[0.24em] text-[#8a8a86] mt-1.5">
                        {project.number}
                      </span>

                      <div>
                        <span className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] block mb-1">
                          {project.domain}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge & View Details Toggle */}
                    <div className="flex flex-wrap items-center gap-3 self-start lg:self-center ml-8 sm:ml-10 lg:ml-0 shrink-0">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#0a0a0a]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d9b97a]" />
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#f4f4f2] font-medium">
                          {project.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDetails(project.id)}
                        aria-expanded={isExpanded}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-[11px] uppercase tracking-[0.18em] text-[#8a8a86] hover:text-white hover:border-white/35 transition-colors"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Summary & My Contribution */}
                  <div className="ml-0 sm:ml-10 md:ml-12 max-w-4xl space-y-3">
                    <p className="text-sm sm:text-base text-[#f4f4f2] font-light leading-relaxed">
                      {project.summary}
                    </p>
                    <p className="text-xs sm:text-sm text-[#8a8a86] font-light leading-relaxed">
                      <strong className="font-medium text-[#f4f4f2] uppercase tracking-[0.14em] text-[11px] mr-2">
                        My Contribution So Far:
                      </strong>
                      {project.contribution}
                    </p>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                        {project.objectives && project.objectives.length > 0 && (
                          <div>
                            <h4 className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] font-medium mb-2.5">
                              Objectives & Scope
                            </h4>
                            <ul className="space-y-1.5 text-[#8a8a86] list-disc list-inside">
                              {project.objectives.map((item) => (
                                <li key={item} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {project.plannedDeliverables &&
                          project.plannedDeliverables.length > 0 && (
                            <div>
                              <h4 className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] font-medium mb-2.5">
                                Planned Deliverables
                              </h4>
                              <ul className="space-y-1.5 text-[#8a8a86] list-disc list-inside">
                                {project.plannedDeliverables.map((item) => (
                                  <li key={item} className="leading-relaxed">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {project.nextSteps && project.nextSteps.length > 0 && (
                          <div>
                            <h4 className="text-[10px] uppercase tracking-[0.24em] text-[#d9b97a] font-medium mb-2.5">
                              Potential Next Steps
                            </h4>
                            <ul className="space-y-1.5 text-[#8a8a86] list-disc list-inside">
                              {project.nextSteps.map((item) => (
                                <li key={item} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {project.accuracyNote && (
                          <div className="md:col-span-2 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                            <span className="text-[10px] uppercase tracking-[0.22em] text-[#d9b97a] block mb-1">
                              Current Stage & Verification Note
                            </span>
                            <p className="text-xs text-[#8a8a86] leading-relaxed">
                              {project.accuracyNote}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Projects;
