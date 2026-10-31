"use client";

import React from "react";
import { ScrollTextReveal } from "@/components/ui/scroll-text-reveal";
import { MANIFESTO_CONTENT } from "@/lib/data";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative bg-[#050505] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Soft Ambient Light */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#d9b97a]/5 blur-[160px]" />

      <ScrollTextReveal
        eyebrow={MANIFESTO_CONTENT.eyebrow}
        text={MANIFESTO_CONTENT.text}
        highlightWords={MANIFESTO_CONTENT.highlightWords}
        scrollHint={MANIFESTO_CONTENT.scrollHint}
        sticky={false}
      />
    </section>
  );
}

export default Manifesto;
