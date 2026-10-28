"use client";

import React from "react";
import { ScrollTextReveal } from "@/components/ui/scroll-text-reveal";
import { PERSONAL_INFO } from "@/lib/data";

export function Manifesto() {
  return (
    <section id="manifesto" className="relative bg-[#050505] border-t border-white/[0.06] overflow-hidden">
      {/* Background Soft Ambient Light */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#d9b97a]/5 blur-[160px]" />

      <ScrollTextReveal
        eyebrow="Approach & Perspective"
        text={PERSONAL_INFO.manifestoText}
        highlightWords={PERSONAL_INFO.manifestoHighlights}
        sticky={true}
      />
    </section>
  );
}

export default Manifesto;
