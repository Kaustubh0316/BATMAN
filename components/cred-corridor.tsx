"use client";

import React, { useEffect, useState } from "react";

interface CredCorridorProps {
  mouseParallax?: boolean;
}

export function CredCorridor({ mouseParallax = true }: CredCorridorProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mouseParallax) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseParallax]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#07080a] select-none"
      aria-hidden="true"
    >
      {/* ============================================================ */}
      {/* 1. Atmospheric Background Gradient & Ambient Sky Mist        */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,#1a1d24_0%,#0e1014_50%,#060709_100%)] opacity-90" />

      {/* Atmospheric center spotlight beam */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 0)`,
        }}
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[850px] h-[500px] md:h-[650px] rounded-full bg-[radial-gradient(circle,#9ba5b5_0%,rgba(155,165,181,0.15)_40%,transparent_70%)] blur-[90px] opacity-35 transition-transform duration-500 ease-out"
      />

      {/* Warm Golden Horizon Undercurrent */}
      <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-[#d9b97a]/10 blur-[100px] pointer-events-none" />

      {/* ============================================================ */}
      {/* 2. Central Illuminated Portal / Gateway                      */}
      {/* ============================================================ */}
      <div
        style={{
          transform: `translate3d(calc(-50% + ${mousePos.x * 4}px), calc(-50% + ${mousePos.y * 3}px), 0)`,
        }}
        className="absolute left-1/2 top-[52%] w-[130px] sm:w-[170px] md:w-[210px] h-[180px] sm:h-[230px] md:h-[280px] -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-300 ease-out"
      >
        {/* Gateway Frame */}
        <div className="relative w-full h-full bg-gradient-to-b from-[#8c94a0] via-[#5c6370] to-[#252930] p-[2px] shadow-[0_0_80px_rgba(180,195,215,0.4)]">
          {/* Inner Glowing Void */}
          <div className="w-full h-full bg-gradient-to-b from-[#b8c2d1] via-[#858f9e] to-[#404652] relative overflow-hidden flex items-end justify-center">
            {/* Soft inner horizon light */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#ffffff_0%,#a2acbc_60%,#697382_100%)] opacity-85" />
            {/* Horizon silhouetted step */}
            <div className="w-full h-6 bg-[#0a0c0f]" />
          </div>
        </div>

        {/* Halo Bloom around the Gateway */}
        <div className="absolute -inset-8 bg-[#b8c2d1]/20 blur-[45px] pointer-events-none" />
      </div>

      {/* ============================================================ */}
      {/* 3. Reflective Ground Plane                                   */}
      {/* ============================================================ */}
      <div className="absolute left-0 right-0 bottom-0 top-[52%] bg-gradient-to-b from-[#090b0e] via-[#050608] to-[#030405] z-10">
        {/* Gateway Light Reflection on Polished Floor */}
        <div
          style={{
            transform: `translate3d(calc(-50% + ${mousePos.x * 6}px), 0, 0)`,
          }}
          className="absolute left-1/2 top-0 w-[140px] sm:w-[200px] md:w-[250px] h-full bg-gradient-to-b from-[#b8c2d1]/30 via-[#707b8b]/10 to-transparent blur-[30px] transition-transform duration-300 ease-out"
        />

        {/* Converging Floor Perspective Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="none"
          viewBox="0 0 1000 500"
        >
          {/* Central road guide tracks */}
          <line x1="500" y1="0" x2="100" y2="500" stroke="#707b8b" strokeWidth="1" />
          <line x1="500" y1="0" x2="350" y2="500" stroke="#8a95a5" strokeWidth="1.5" />
          <line x1="500" y1="0" x2="650" y2="500" stroke="#8a95a5" strokeWidth="1.5" />
          <line x1="500" y1="0" x2="900" y2="500" stroke="#707b8b" strokeWidth="1" />
          {/* Subtle horizontal perspective seams */}
          <line x1="0" y1="80" x2="1000" y2="80" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.08" />
          <line x1="0" y1="180" x2="1000" y2="180" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.06" />
          <line x1="0" y1="320" x2="1000" y2="320" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.04" />
        </svg>

        {/* Ambient occlusion shadow vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
      </div>

      {/* ============================================================ */}
      {/* 4. Left Sculptural Colonnade (Curved Fins Receding into Depth)*/}
      {/* ============================================================ */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -6}px, 0)`,
        }}
        className="absolute left-0 top-0 bottom-0 w-[42%] z-20 transition-transform duration-300 ease-out"
      >
        <svg
          viewBox="0 0 500 900"
          className="w-full h-full object-cover object-left"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Fin Gradient: Front facing dark graphite with top curve light */}
            <linearGradient id="finFaceFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2e36" />
              <stop offset="25%" stopColor="#1c1f26" />
              <stop offset="70%" stopColor="#0d0e12" />
              <stop offset="100%" stopColor="#060709" />
            </linearGradient>

            <linearGradient id="finFaceMid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22252c" />
              <stop offset="30%" stopColor="#15171d" />
              <stop offset="80%" stopColor="#0a0b0e" />
              <stop offset="100%" stopColor="#050608" />
            </linearGradient>

            <linearGradient id="finFaceBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1c22" />
              <stop offset="40%" stopColor="#111317" />
              <stop offset="100%" stopColor="#07080a" />
            </linearGradient>

            {/* Specular Rim Light Gradient */}
            <linearGradient id="rimLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="20%" stopColor="#b4bed0" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#555e6d" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#101216" stopOpacity="0" />
            </linearGradient>

            {/* Subtle Warm Rim Light for Depth */}
            <linearGradient id="warmRimLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d9b97a" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#8a7650" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#101216" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fin 6 (Farthest back left, next to gateway) */}
          <path
            d="M 330 380 Q 345 420 335 480 L 335 580 L 360 580 L 360 480 Q 370 420 355 380 Z"
            fill="url(#finFaceBack)"
            stroke="url(#rimLight)"
            strokeWidth="0.8"
            opacity="0.6"
          />

          {/* Fin 5 */}
          <path
            d="M 270 320 Q 290 380 275 460 L 275 640 L 310 640 L 310 460 Q 325 380 305 320 Z"
            fill="url(#finFaceBack)"
            stroke="url(#rimLight)"
            strokeWidth="1"
            opacity="0.75"
          />

          {/* Fin 4 */}
          <path
            d="M 200 240 Q 230 320 210 440 L 210 720 L 255 720 L 255 440 Q 275 320 245 240 Z"
            fill="url(#finFaceMid)"
            stroke="url(#rimLight)"
            strokeWidth="1.2"
            opacity="0.85"
          />

          {/* Fin 3 */}
          <path
            d="M 125 150 Q 165 260 140 420 L 140 810 L 195 810 L 195 420 Q 220 260 180 150 Z"
            fill="url(#finFaceMid)"
            stroke="url(#rimLight)"
            strokeWidth="1.5"
            opacity="0.92"
          />

          {/* Fin 2 */}
          <path
            d="M 45 40 Q 95 180 65 380 L 65 900 L 130 900 L 130 380 Q 160 180 110 40 Z"
            fill="url(#finFaceFront)"
            stroke="url(#rimLight)"
            strokeWidth="1.8"
            opacity="0.97"
          />

          {/* Fin 1 (Foreground Left Pillar) */}
          <path
            d="M -30 -60 Q 30 100 -5 340 L -5 960 L 70 960 L 70 340 Q 105 100 45 -60 Z"
            fill="url(#finFaceFront)"
            stroke="url(#rimLight)"
            strokeWidth="2.2"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 5. Right Sculptural Colonnade (Mirroring the Left)           */}
      {/* ============================================================ */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * -6}px, 0)`,
        }}
        className="absolute right-0 top-0 bottom-0 w-[42%] z-20 transition-transform duration-300 ease-out"
      >
        <svg
          viewBox="0 0 500 900"
          className="w-full h-full object-cover object-right"
          preserveAspectRatio="none"
        >
          {/* Fin 6 (Farthest back right, next to gateway) */}
          <path
            d="M 170 380 Q 155 420 165 480 L 165 580 L 140 580 L 140 480 Q 130 420 145 380 Z"
            fill="url(#finFaceBack)"
            stroke="url(#rimLight)"
            strokeWidth="0.8"
            opacity="0.6"
          />

          {/* Fin 5 */}
          <path
            d="M 230 320 Q 210 380 225 460 L 225 640 L 190 640 L 190 460 Q 175 380 195 320 Z"
            fill="url(#finFaceBack)"
            stroke="url(#rimLight)"
            strokeWidth="1"
            opacity="0.75"
          />

          {/* Fin 4 */}
          <path
            d="M 300 240 Q 270 320 290 440 L 290 720 L 245 720 L 245 440 Q 225 320 255 240 Z"
            fill="url(#finFaceMid)"
            stroke="url(#rimLight)"
            strokeWidth="1.2"
            opacity="0.85"
          />

          {/* Fin 3 */}
          <path
            d="M 375 150 Q 335 260 360 420 L 360 810 L 305 810 L 305 420 Q 280 260 320 150 Z"
            fill="url(#finFaceMid)"
            stroke="url(#rimLight)"
            strokeWidth="1.5"
            opacity="0.92"
          />

          {/* Fin 2 */}
          <path
            d="M 455 40 Q 405 180 435 380 L 435 900 L 370 900 L 370 380 Q 340 180 390 40 Z"
            fill="url(#finFaceFront)"
            stroke="url(#rimLight)"
            strokeWidth="1.8"
            opacity="0.97"
          />

          {/* Fin 1 (Foreground Right Pillar) */}
          <path
            d="M 530 -60 Q 470 100 505 340 L 505 960 L 430 960 L 430 340 Q 395 100 455 -60 Z"
            fill="url(#finFaceFront)"
            stroke="url(#rimLight)"
            strokeWidth="2.2"
          />
        </svg>
      </div>

      {/* Atmospheric bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent z-20 pointer-events-none" />
    </div>
  );
}

export default CredCorridor;
