"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, PERSONAL_INFO } from "@/lib/data";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  // Close menu on Escape key press & prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050505]/98 backdrop-blur-2xl px-6 py-8 md:px-16 md:py-12 animate-in fade-in duration-300"
    >
      {/* Background ambient gold aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-[#d9b97a]/5 blur-[140px] pointer-events-none" />
      </div>

      {/* Top Bar with Close Button */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#d9b97a] animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a8a86]">
            {PERSONAL_INFO.badge}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f4f4f2] transition-all duration-300 hover:border-[#d9b97a] hover:bg-[#d9b97a]/10"
        >
          <span className="hidden sm:inline text-[#8a8a86] group-hover:text-white">Close</span>
          <X className="w-4 h-4 text-[#d9b97a] transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>

      {/* Main Nav Links (Large Serif with Staggered Entrance) */}
      <nav className="relative z-10 my-auto py-8">
        <ul className="flex flex-col gap-4 md:gap-6">
          {NAV_LINKS.map((link, idx) => (
            <li
              key={link.name}
              style={{
                animationDelay: `${idx * 60 + 50}ms`,
              }}
              className="animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="group flex items-baseline justify-between border-b border-white/[0.05] pb-3 md:pb-4 transition-colors duration-300"
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-sans text-xs md:text-sm text-[#8a8a86] group-hover:text-[#d9b97a] transition-colors">
                    0{idx + 1}
                  </span>
                  <span className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#f4f4f2] transition-all duration-300 group-hover:text-[#d9b97a] group-hover:translate-x-2">
                    {link.name}
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7 text-[#8a8a86] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-[#d9b97a] group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Bar: Direct Email & Socials */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/5 pt-6 text-xs text-[#8a8a86]">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.25em] text-[#8a8a86] mb-1">
            Direct Inquiries
          </span>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="text-sm font-sans text-[#f4f4f2] hover:text-[#d9b97a] transition-colors underline decoration-white/20 underline-offset-4"
          >
            {PERSONAL_INFO.email}
          </a>
        </div>

        <div className="flex items-center gap-6">
          {PERSONAL_INFO.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d9b97a] transition-colors uppercase tracking-[0.2em] text-[11px]"
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuOverlay;
