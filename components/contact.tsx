"use client";

import React, { useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CONTACT_CONTENT, PERSONAL_INFO } from "@/lib/data";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 sm:py-36 px-6 sm:px-12 md:px-16 border-t border-white/[0.06] bg-[#050505] overflow-hidden"
    >
      {/* Background Soft Light Dome */}
      <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[350px] rounded-t-full bg-radial from-[#d9b97a]/15 via-[#d9b97a]/5 to-transparent blur-[100px]" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Section Eyebrow */}
        <Reveal>
          <div className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9b97a]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#d9b97a] font-medium">
              {CONTACT_CONTENT.eyebrow}
            </span>
          </div>
        </Reveal>

        {/* Huge Serif Heading */}
        <Reveal delay={100}>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-[-0.03em] leading-[1.02] mb-8">
            {CONTACT_CONTENT.headingLine1}
            <br />
            {CONTACT_CONTENT.headingLine2}
          </h2>
        </Reveal>

        {/* Short Subtitle */}
        <Reveal delay={150}>
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#8a8a86] max-w-xl mx-auto font-light leading-relaxed mb-12">
            {CONTACT_CONTENT.subtitle}
          </p>
        </Reveal>

        {/* Public Email as Big Underlined Link + Copy Button */}
        <Reveal delay={200}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="font-serif text-2xl sm:text-4xl md:text-5xl text-white hover:text-[#d9b97a] transition-colors underline decoration-[#d9b97a]/40 hover:decoration-[#d9b97a] underline-offset-8"
            >
              {PERSONAL_INFO.email}
            </a>

            <button
              onClick={handleCopyEmail}
              aria-label={CONTACT_CONTENT.copyAriaLabel}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs font-sans text-[#8a8a86] hover:text-white hover:border-[#d9b97a]/50 transition-all duration-300 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">
                    {CONTACT_CONTENT.copiedButtonText}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#d9b97a]" />
                  <span>{CONTACT_CONTENT.copyButtonText}</span>
                </>
              )}
            </button>
          </div>
        </Reveal>

        {/* Social Links Row */}
        <Reveal delay={250}>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-10 border-t border-white/[0.06]">
            {PERSONAL_INFO.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8a8a86] hover:text-[#d9b97a] transition-colors py-2"
              >
                <span>{social.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d9b97a] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
