"use client";

import React, { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children?: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange" | "silver";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const colorMap = {
  silver: {
    accent: "#d0d4da",
    spotlight: "rgba(208, 212, 218, 0.16)",
    borderGlow: "rgba(220, 224, 230, 0.75)",
    boxShadow: "rgba(208, 212, 218, 0.20)",
    borderHover: "rgba(208, 212, 218, 0.45)",
  },
  orange: {
    accent: "#d9b97a",
    spotlight: "rgba(217, 185, 122, 0.18)",
    borderGlow: "rgba(217, 185, 122, 0.75)",
    boxShadow: "rgba(217, 185, 122, 0.22)",
    borderHover: "rgba(217, 185, 122, 0.45)",
  },
  blue: {
    accent: "#60a5fa",
    spotlight: "rgba(96, 165, 250, 0.18)",
    borderGlow: "rgba(96, 165, 250, 0.75)",
    boxShadow: "rgba(96, 165, 250, 0.22)",
    borderHover: "rgba(96, 165, 250, 0.45)",
  },
  purple: {
    accent: "#c084fc",
    spotlight: "rgba(192, 132, 252, 0.18)",
    borderGlow: "rgba(192, 132, 252, 0.75)",
    boxShadow: "rgba(192, 132, 252, 0.22)",
    borderHover: "rgba(192, 132, 252, 0.45)",
  },
  green: {
    accent: "#4ade80",
    spotlight: "rgba(74, 222, 128, 0.18)",
    borderGlow: "rgba(74, 222, 128, 0.75)",
    boxShadow: "rgba(74, 222, 128, 0.22)",
    borderHover: "rgba(74, 222, 128, 0.45)",
  },
  red: {
    accent: "#f87171",
    spotlight: "rgba(248, 113, 113, 0.18)",
    borderGlow: "rgba(248, 113, 113, 0.75)",
    boxShadow: "rgba(248, 113, 113, 0.22)",
    borderHover: "rgba(248, 113, 113, 0.45)",
  },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

/**
 * GlowCard
 * 
 * High-performance spotlight card with warm ambient aura.
 * - Entire card glows with a rich ambient aura when hovered.
 * - Dynamic 380px cursor spotlight tracks smoothly across the whole surface.
 * - Remains completely dark/muted when the pointer is outside the card.
 * - Bulletproof against child element bubbling.
 */
export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "silver",
  size = "md",
  width,
  height,
  customSize = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = colorMap[glowColor] || colorMap.orange;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const inlineStyles: React.CSSProperties = {
    ...(width !== undefined
      ? { width: typeof width === "number" ? `${width}px` : width }
      : {}),
    ...(height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : {}),
    "--spotlight-color": theme.spotlight,
    "--border-glow-color": theme.borderGlow,
    "--hover-box-shadow": `0 12px 36px -6px rgba(0, 0, 0, 0.8), 0 0 35px -5px ${theme.boxShadow}`,
    "--hover-border": theme.borderHover,
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={inlineStyles}
      className={cn(
        "group relative rounded-2xl bg-[#090909]/95 border border-white/[0.08] backdrop-blur-md overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:border-[var(--hover-border)] hover:shadow-[var(--hover-box-shadow)]",
        !customSize ? sizeMap[size] : "",
        className
      )}
    >
      {/* 1. Dynamic Cursor Spotlight (Follows mouse everywhere across the card) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(380px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--spotlight-color, rgba(217,185,122,0.18)), transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* 2. Dynamic Specular Border Highlight (Lights up border under mouse) */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--border-glow-color, rgba(217,185,122,0.75)), transparent 60%)`,
          mask: "linear-gradient(white, white) content-box, linear-gradient(white, white)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(white, white) content-box, linear-gradient(white, white)",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        aria-hidden="true"
      />

      {/* 3. Ambient Overall Hover Wash (Ensures the whole card glows everywhere) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-white/[0.025] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
