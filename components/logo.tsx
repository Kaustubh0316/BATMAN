import React, { useId } from "react";
import Link from "next/link";
import { SITE_METADATA } from "@/lib/data";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "shield" | "dark-text" | "light-text";
  showWordmark?: boolean;
}

/**
 * Precision 3D-faceted "KC" Swoosh Monogram rendered in the site's
 * brushed platinum / liquid-silver CRED dark-luxury colour palette.
 */
function KcMonogramSvg({
  uid,
  width,
  height,
  className = "",
}: {
  uid: string;
  width: number;
  height: number;
  className?: string;
}) {
  const diagUpperId = `${uid}-diag-upper`;
  const diagLowerId = `${uid}-diag-lower`;
  const stemLeftId = `${uid}-stem-left`;
  const stemRightId = `${uid}-stem-right`;
  const swooshUpperId = `${uid}-swoosh-upper`;
  const swooshTipFlareId = `${uid}-swoosh-flare`;
  const swooshLowerId = `${uid}-swoosh-lower`;
  const ridgeGleamId = `${uid}-ridge-gleam`;
  const dropShadowId = `${uid}-swoosh-shadow`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="-2 -2 124 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* 1. Diagonal K Arm — Upper-Left Bevel Facet */}
        <linearGradient
          id={diagUpperId}
          x1="79.6"
          y1="0"
          x2="38"
          y2="62"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="16%" stopColor="#dfe6f0" />
          <stop offset="52%" stopColor="#9aa3b2" />
          <stop offset="100%" stopColor="#565e6b" />
        </linearGradient>

        {/* 2. Diagonal K Arm — Lower-Right Bevel Facet */}
        <linearGradient
          id={diagLowerId}
          x1="116"
          y1="2"
          x2="26"
          y2="94"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#b8c1cf" />
          <stop offset="45%" stopColor="#8690a0" />
          <stop offset="82%" stopColor="#5b6372" />
          <stop offset="100%" stopColor="#3e4450" />
        </linearGradient>

        {/* 3. Vertical K Stem — Left Satin Facet */}
        <linearGradient
          id={stemLeftId}
          x1="22"
          y1="0"
          x2="24"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c4ccd9" />
          <stop offset="48%" stopColor="#949ead" />
          <stop offset="82%" stopColor="#6f7887" />
          <stop offset="100%" stopColor="#505764" />
        </linearGradient>

        {/* 4. Vertical K Stem — Right Specular Wedge Facet */}
        <linearGradient
          id={stemRightId}
          x1="47.9"
          y1="2"
          x2="24"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#eef3fa" />
          <stop offset="48%" stopColor="#adb6c5" />
          <stop offset="78%" stopColor="#727b8a" />
          <stop offset="100%" stopColor="#4c5360" />
        </linearGradient>

        {/* 5. Sweeping C-Swoosh — Upper Bevel Facet */}
        <linearGradient
          id={swooshUpperId}
          x1="6"
          y1="18"
          x2="116"
          y2="98"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#eef2f8" />
          <stop offset="18%" stopColor="#d7dee9" />
          <stop offset="52%" stopColor="#9ba5b5" />
          <stop offset="84%" stopColor="#7c8596" />
          <stop offset="100%" stopColor="#cfd7e4" />
        </linearGradient>

        {/* 6. Sweeping C-Swoosh — Lower Bevel Facet */}
        <linearGradient
          id={swooshLowerId}
          x1="2"
          y1="26"
          x2="119"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8d96a6" />
          <stop offset="32%" stopColor="#a7b0bf" />
          <stop offset="68%" stopColor="#9aa4b4" />
          <stop offset="88%" stopColor="#dce3ee" />
          <stop offset="97%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f2" />
        </linearGradient>

        {/* 7. Bottom-Right Specular Tip Highlight */}
        <radialGradient
          id={swooshTipFlareId}
          cx="108"
          cy="97"
          r="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="45%" stopColor="#e2e8f2" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#9aa4b4" stopOpacity="0" />
        </radialGradient>

        {/* 8. Razor-Sharp Central Ridge Gleam */}
        <linearGradient
          id={ridgeGleamId}
          x1="8"
          y1="22"
          x2="118"
          y2="99"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="24%" stopColor="#ffffff" stopOpacity="0.88" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="76%" stopColor="#e4eaf4" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>

        {/* Soft 3D Cast Shadow Between Overlapping Ribbon & K Stem */}
        <filter
          id={dropShadowId}
          x="-12%"
          y="-12%"
          width="128%"
          height="128%"
        >
          <feDropShadow
            dx="0"
            dy="2.2"
            stdDeviation="2.4"
            floodColor="#000000"
            floodOpacity="0.58"
          />
        </filter>
      </defs>

      {/* LAYER 1: Diagonal Upper-Right Arm of K */}
      <g>
        <path
          d="M 79.6 0 L 120 0 L 19.4 100 Z"
          fill={`url(#${diagLowerId})`}
        />
        <path
          d="M 79.6 0 L 47.9 31.7 L 19.4 100 Z"
          fill={`url(#${diagUpperId})`}
        />
        {/* Ambient occlusion shadow cast by vertical stem onto diagonal arm */}
        <path
          d="M 47.9 31.7 L 53.5 26.1 L 51.5 63.5 L 47.9 65 Z"
          fill="rgba(7, 9, 13, 0.34)"
        />
      </g>

      {/* LAYER 2: Vertical Stem of K */}
      <g>
        <path
          d="M 19.4 0 L 47.9 0 L 19.4 100 Z"
          fill={`url(#${stemLeftId})`}
        />
        <path
          d="M 47.9 0 L 47.9 68 L 19.4 100 Z"
          fill={`url(#${stemRightId})`}
        />
      </g>

      {/* LAYER 3: Sweeping 3D Beveled C-Swoosh Ribbon */}
      <g filter={`url(#${dropShadowId})`}>
        {/* Upper Swoosh Facet (Inner curve to central 3D ridge) */}
        <path
          d="M 18.0 14.2 C 8.8 18.5, 9.8 31.5, 23.5 43.0 C 42.0 58.2, 82.0 78.5, 119.8 100.0 C 78.5 82.8, 42.0 64.5, 18.5 48.0 C 2.5 36.8, 2.2 21.8, 18.0 14.2 Z"
          fill={`url(#${swooshUpperId})`}
        />

        {/* Lower Swoosh Facet (Central 3D ridge to outer curve & flat base) */}
        <path
          d="M 18.0 14.2 C 2.2 21.8, 2.5 36.8, 18.5 48.0 C 42.0 64.5, 78.5 82.8, 119.8 100.0 L 64.2 100.0 C 42.5 85.5, 20.5 68.2, 8.2 52.0 C -3.5 36.5, -1.5 20.5, 18.0 14.2 Z"
          fill={`url(#${swooshLowerId})`}
        />

        {/* Specular Metallic Flare at Bottom-Right Apex */}
        <path
          d="M 18.0 14.2 C 2.2 21.8, 2.5 36.8, 18.5 48.0 C 42.0 64.5, 78.5 82.8, 119.8 100.0 L 64.2 100.0 C 42.5 85.5, 20.5 68.2, 8.2 52.0 C -3.5 36.5, -1.5 20.5, 18.0 14.2 Z"
          fill={`url(#${swooshTipFlareId})`}
        />

        {/* Crisp Specular Highlight Along Central 3D Crease */}
        <path
          d="M 16.2 15.2 C 2.6 22.2, 3.0 36.8, 18.5 48.0 C 42.0 64.5, 78.5 82.8, 119.2 99.7"
          stroke={`url(#${ridgeGleamId})`}
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function Logo({
  className = "",
  size = "md",
  variant = "shield",
  showWordmark = true,
}: LogoProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");

  if (variant === "dark-text" || variant === "light-text") {
    const sizeClass =
      size === "lg"
        ? "text-2xl sm:text-3xl"
        : size === "sm"
          ? "text-lg"
          : "text-xl sm:text-2xl";

    const textColor =
      variant === "dark-text" ? "text-[#111111]" : "text-white";

    const iconW = size === "lg" ? 36 : size === "sm" ? 24 : 30;
    const iconH = Math.round(iconW * 0.84);

    return (
      <Link
        href="#top"
        aria-label={SITE_METADATA.logoAriaLabel}
        className={`group inline-flex items-center gap-3 font-sans font-extrabold uppercase tracking-[-0.03em] focus-visible:outline-none ${sizeClass} ${textColor} ${className}`}
      >
        <KcMonogramSvg
          uid={uid}
          width={iconW}
          height={iconH}
          className="shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_14px_rgba(232,238,248,0.38)]"
        />
        <span className="inline-flex items-baseline">
          <span>{SITE_METADATA.logoText}</span>
          <span className="text-[#d94f4f] ml-[1px] transition-transform duration-200 group-hover:scale-125">
            .
          </span>
        </span>
      </Link>
    );
  }

  const iconWidth = size === "sm" ? 34 : size === "lg" ? 56 : 46;
  const iconHeight = Math.round(iconWidth * 0.84);

  return (
    <Link
      href="#top"
      aria-label={SITE_METADATA.logoAriaLabel}
      className={`group inline-flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9ced6] rounded-sm transition-transform duration-300 hover:scale-[1.03] ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <KcMonogramSvg
          uid={uid}
          width={iconWidth}
          height={iconHeight}
          className="transition-all duration-300 drop-shadow-[0_4px_14px_rgba(0,0,0,0.65)] group-hover:drop-shadow-[0_0_18px_rgba(232,238,248,0.45)]"
        />
      </div>

      {showWordmark ? (
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.34em] text-white transition-colors duration-300 group-hover:text-[#c9ced6]">
          {SITE_METADATA.logoText}
        </span>
      ) : null}
    </Link>
  );
}

export default Logo;
