"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds for staggered effects
  yOffset?: number; // Distance in px to slide up from
}

/**
 * Reusable Reveal component using IntersectionObserver.
 * Features:
 * - Early trigger margin (80px before entering viewport bottom) for immediate response
 * - Stagger delay support
 * - Automatic 2.5s fallback so content NEVER stays hidden if JS or IO fails
 * - Honors prefers-reduced-motion immediately
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  yOffset = 18,
}: RevealProps) {
  const [seen, setIsVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  const isVisible = seen || reducedMotion;
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    // Safety fallback: ensure content is visible after 2.5s unconditionally
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.02,
        // Trigger 80px before reaching the viewport bottom so elements reveal early and smoothly
        rootMargin: "0px 0px 15% 0px",
      }
    );

    const node = elementRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      clearTimeout(safetyTimer);
      if (node) {
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={elementRef}
      style={{
        transitionDuration: "650ms",
        transitionDelay: `${delay}ms`,
        transform: isVisible ? "translateY(0)" : `translateY(${yOffset}px)`,
        opacity: isVisible ? 1 : 0,
      }}
      className={cn(
        "transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Reveal;
