"use client";

import React, { useState } from "react";
import { Logo } from "@/components/logo";
import { MenuOverlay } from "@/components/menu-overlay";
import { NAVIGATION_CONTENT } from "@/lib/data";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 md:px-12 md:py-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Top-Left Monolithic Shield Logo */}
          <div className="pointer-events-auto">
            <Logo />
          </div>

          {/* Top-Right Split Rectangular Box (CRED Style) */}
          <div className="pointer-events-auto flex items-center rounded-none border border-white/20 bg-black/40 backdrop-blur-md transition-all duration-300 hover:border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            {/* Left Half: Uppercase Wide-Letter-Spaced Label */}
            <div className="hidden sm:flex flex-col justify-center px-4 py-2.5 border-r border-white/20 text-left">
              <span className="text-[9px] font-bold tracking-[0.24em] uppercase text-white leading-tight">
                {NAVIGATION_CONTENT.topBadge}
              </span>
              <span className="text-[8px] font-medium tracking-[0.2em] uppercase text-[#8a8a86] leading-tight mt-0.5">
                {NAVIGATION_CONTENT.topSubBadge}
              </span>
            </div>

            {/* Right Half: Hamburger Button (3 lines) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label={NAVIGATION_CONTENT.openMenuAriaLabel}
              aria-expanded={isMenuOpen}
              className="group flex flex-col items-center justify-center w-12 h-12 text-white hover:text-[#d9b97a] hover:bg-white/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <div className="w-5 flex flex-col gap-1 items-end">
                <span className="w-5 h-[1.5px] bg-white transition-all duration-300" />
                <span className="w-3.5 h-[1.5px] bg-white transition-all duration-300 group-hover:w-5" />
                <span className="w-5 h-[1.5px] bg-white transition-all duration-300" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Navigation Modal */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

export default Navbar;
