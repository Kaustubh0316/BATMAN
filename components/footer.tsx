"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/logo";
import { PERSONAL_INFO } from "@/lib/data";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#030303] py-12 px-6 sm:px-12 md:px-16 text-xs text-[#8a8a86]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Small Shield Monogram */}
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#8a8a86] hidden sm:block">
            {PERSONAL_INFO.role}
          </span>
        </div>

        {/* Center: Copyright with Auto-Updating Year */}
        <div className="text-center font-sans tracking-wide text-[11px]">
          <p>© {currentYear} {PERSONAL_INFO.name}. Built with curiosity & precision.</p>
        </div>

        {/* Right: Back to Top Button */}
        <button
          onClick={scrollToTop}
          aria-label="Back to top of page"
          className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#8a8a86] hover:text-[#d9b97a] transition-colors"
        >
          <span>Top</span>
          <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-[#d9b97a] group-hover:bg-[#d9b97a]/10">
            <ArrowUp className="w-3 h-3 text-[#d9b97a] transition-transform duration-300 group-hover:-translate-y-0.5" />
          </div>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
