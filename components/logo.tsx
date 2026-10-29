import React from "react";
import Link from "next/link";
import { SITE_METADATA } from "@/lib/data";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const isSmall = size === "sm";

  return (
    <Link
      href="#top"
      aria-label={SITE_METADATA.logoAriaLabel}
      className={`group inline-flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9ced6] rounded-sm transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* Monolithic Geometric Shield Monogram */}
      <div className="relative flex items-center justify-center">
        <svg
          width={isSmall ? "32" : "42"}
          height={isSmall ? "36" : "48"}
          viewBox="0 0 44 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.4)]"
        >
          {/* Outer Monolithic Shield */}
          <path
            d="M22 2L42 8.5V26C42 37.5 32.5 45.5 22 48.5C11.5 45.5 2 37.5 2 26V8.5L22 2Z"
            stroke="#ffffff"
            strokeWidth="2"
            fill="#090a0d"
            className="transition-all duration-300 group-hover:stroke-[#c9ced6]"
          />

          {/* Inner Geometric Shield Contour */}
          <path
            d="M22 8L36 12.8V25C36 33.5 29 39.5 22 42C15 39.5 8 33.5 8 25V12.8L22 8Z"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Interlocking 'K' */}
          <path
            d="M15 16V34M15 25L23 16M17.5 22L24 34"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interlocking 'C' */}
          <path
            d="M31 18.5C29 16.5 26.5 16 24 17C21.5 18.5 20 21.5 20 25C20 28.5 21.5 31.5 24 33C26.5 34 29 33.5 31 31.5"
            stroke="#c9ced6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Underline Brand Name in Bold Wide-Letter-Spaced Caps */}
      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.34em] text-white transition-colors duration-300 group-hover:text-[#c9ced6]">
        {SITE_METADATA.logoText}
      </span>
    </Link>
  );
}

export default Logo;
