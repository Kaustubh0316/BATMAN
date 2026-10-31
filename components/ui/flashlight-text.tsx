"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface FlashlightTextProps {
  paragraphs: string[];
  className?: string;
  paragraphClassName?: string;
  radius?: number;
}

/**
 * FlashlightText
 *
 * CRED-inspired cursor-tracked radial spotlight text effect.
 * Projects a single unified circular #ffffff beam across multiple paragraphs
 * using per-paragraph local coordinate projection + background-clip: text,
 * cutting pixel-smoothly across individual glyphs while leaving surrounding
 * copy in a calm, legible dim charcoal-silver tone.
 */
export function FlashlightText({
  paragraphs,
  className,
  paragraphClassName,
  radius = 175,
}: FlashlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let rafId: number | null = null;
    let isInView = false;
    let hasInteracted = false;

    const initRect = container.getBoundingClientRect();
    let curX = Math.max(140, initRect.width * 0.36);
    let curY = 52;
    let targetX = curX;
    let targetY = curY;

    const applySpotlight = (x: number, y: number) => {
      const list = pRefs.current;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        if (!p) continue;
        const localX = x - p.offsetLeft;
        const localY = y - p.offsetTop;
        p.style.setProperty("--fx-x", `${localX.toFixed(1)}px`);
        p.style.setProperty("--fx-y", `${localY.toFixed(1)}px`);
      }
    };

    // Paint initial spotlight position immediately
    applySpotlight(curX, curY);

    const tick = (now: number) => {
      rafId = null;
      if (!isInView) return;

      if (!hasInteracted) {
        const w = container.clientWidth || 520;
        const h = container.clientHeight || 260;
        targetX = w * 0.45 + Math.sin(now * 0.00075) * (w * 0.28);
        targetY = h * 0.42 + Math.cos(now * 0.00055) * (h * 0.26);
      }

      const dx = targetX - curX;
      const dy = targetY - curY;
      curX += dx * 0.22;
      curY += dy * 0.22;

      applySpotlight(curX, curY);

      if (!hasInteracted || Math.hypot(dx, dy) >= 0.25) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const ensureLoop = () => {
      if (rafId === null && isInView) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInView) return;
      const rect = container.getBoundingClientRect();
      const halo = 88;

      if (
        e.clientX < rect.left - halo ||
        e.clientX > rect.right + halo ||
        e.clientY < rect.top - halo ||
        e.clientY > rect.bottom + halo
      ) {
        return;
      }

      hasInteracted = true;
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      targetX = Math.min(Math.max(rawX, -28), rect.width + 28);
      targetY = Math.min(Math.max(rawY, -28), rect.height + 28);
      ensureLoop();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isInView = Boolean(entry?.isIntersecting);
        if (isInView) {
          ensureLoop();
        } else if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.05, rootMargin: "100px 0px" }
    );

    observer.observe(container);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative space-y-5 cursor-default", className)}
    >
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          ref={(el) => {
            pRefs.current[index] = el;
          }}
          style={{ "--fx-radius": `${radius}px` } as React.CSSProperties}
          className={cn(
            "flashlight-paragraph font-sans text-base sm:text-lg md:text-[19px] font-normal leading-[1.68] tracking-[-0.005em]",
            paragraphClassName
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default FlashlightText;

