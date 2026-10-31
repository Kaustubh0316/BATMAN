"use client";

import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds for staggered XPlace Beat 3 cascade
  yOffset?: number; // Distance in px to glide up from
}

/**
 * Beat 3 Reversible Slide-Change Cascade Reveal.
 * - Cascades content in with smooth vertical lift + optical de-blur when a slide enters view.
 * - Clears all inline transform/filter/will-change once settled so Liquid Glass
 *   backdrop-filter and 3D transforms render at full fidelity.
 * - Resets cleanly after scrolling 140px completely offscreen so returning to any
 *   slide re-plays the XPlace slide-change choreography smoothly.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  yOffset = 20,
}: RevealProps) {
  const [seen, setSeen] = useState(false);
  const [settled, setSettled] = useState(false);
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );

  const isVisible = seen || reducedMotion;
  const isSettled = settled || reducedMotion;
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!seen) return;

    const settleTimer = window.setTimeout(() => {
      setSettled(true);
    }, delay + 760);

    return () => window.clearTimeout(settleTimer);
  }, [seen, delay, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const node = elementRef.current;
    if (!node) return;

    const enterObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setSeen(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    const exitObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && !entry.isIntersecting) {
          setSeen(false);
          setSettled(false);
        }
      },
      {
        threshold: 0,
        rootMargin: "140px 0px 140px 0px",
      }
    );

    enterObserver.observe(node);
    exitObserver.observe(node);

    return () => {
      enterObserver.disconnect();
      exitObserver.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={elementRef}
      style={
        isSettled
          ? undefined
          : {
              transitionDuration: "680ms",
              transitionDelay: isVisible ? `${delay}ms` : "0ms",
              transform: isVisible
                ? "translate3d(0, 0, 0)"
                : `translate3d(0, ${yOffset}px, 0)`,
              filter: isVisible ? "blur(0px)" : "blur(5px)",
              opacity: isVisible ? 1 : 0,
            }
      }
      className={cn(
        !isSettled &&
          "transition-[opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform,filter]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Reveal;
