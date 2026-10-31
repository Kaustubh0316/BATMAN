"use client";

import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
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
}

/**
 * Hysteresis viewport visibility hook:
 * - Activates (`active = true`) when the element enters the active stage.
 * - Resets (`active = false`) ONLY when the element has completely exited
 *   the viewport plus a 140px buffer, preventing boundary flicker while
 *   re-playing the XPlace slide-change entrance whenever returning to a slide.
 */
export function useReversibleStage(reducedMotion: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node) return;

    const enterObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setActive(true);
        }
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    const exitObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && !entry.isIntersecting) {
          setActive(false);
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

  return { ref, isActive: active || reducedMotion };
}

/**
 * Beat 1 (0ms): SlideEyebrow
 * Snaps onto the dark stage first before the headline wipes open.
 */
export function SlideEyebrow({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const { ref, isActive } = useReversibleStage(reducedMotion);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (!isActive) {
      const resetId = window.setTimeout(() => setSettled(false), 0);
      return () => window.clearTimeout(resetId);
    }
    const timer = window.setTimeout(() => {
      setSettled(true);
    }, delay + 500);
    return () => window.clearTimeout(timer);
  }, [isActive, delay, reducedMotion]);

  const isSettled = settled || reducedMotion;

  return (
    <div
      ref={ref}
      style={
        !isSettled && delay > 0 ? { transitionDelay: `${delay}ms` } : undefined
      }
      className={cn(
        !isSettled &&
          (isActive ? "xplace-eyebrow-entering" : "xplace-eyebrow-hidden"),
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Beat 2 (~190ms): SlideHeading
 * Sweeps open left-to-right with XPlace's signature feathered horizontal
 * gradient mask and optical de-blur ("SPE..." -> full sharp headline).
 */
export function SlideHeading({
  children,
  delay = 190,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const { ref, isActive } = useReversibleStage(reducedMotion);
  const [triggered, setTriggered] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (!isActive) {
      const resetId = window.setTimeout(() => {
        setTriggered(false);
        setSettled(false);
      }, 0);
      return () => window.clearTimeout(resetId);
    }

    const startTimer = window.setTimeout(() => {
      setTriggered(true);
    }, delay);

    const settleTimer = window.setTimeout(() => {
      setSettled(true);
    }, delay + 840);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(settleTimer);
    };
  }, [isActive, delay, reducedMotion]);

  const isSettled = settled || reducedMotion;

  return (
    <div
      ref={ref}
      className={cn(
        !isSettled &&
          (triggered ? "xplace-wipe-entering" : "xplace-wipe-hidden"),
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Global XPlace Slide-Change Stage Curtain
 * Pulses a sleek obsidian stage veil below the fixed Navbar (z-30 < z-40)
 * when crossing between major slides or jumping via navigation links.
 */
export function SlideStageCurtain() {
  const reducedMotion = useReducedMotion();
  const veilRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    let activeSectionId = "";
    let lastPulseAt = 0;
    let fadeTimer: number | null = null;

    const pulseVeil = (peakOpacity: number, holdMs: number) => {
      const el = veilRef.current;
      if (!el) return;
      const now = performance.now();
      if (now - lastPulseAt < 420 && peakOpacity < 0.7) return;
      lastPulseAt = now;

      if (fadeTimer !== null) {
        window.clearTimeout(fadeTimer);
      }

      el.style.transition = "opacity 110ms ease-out";
      el.style.opacity = String(peakOpacity);

      fadeTimer = window.setTimeout(() => {
        if (!veilRef.current) return;
        veilRef.current.style.transition =
          "opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)";
        veilRef.current.style.opacity = "0";
      }, holdMs);
    };

    // 1. Detect active slide changes as user scrolls across major sections
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[id]")
    );

    const handleScroll = () => {
      const probeY = window.innerHeight * 0.42;
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) {
          if (activeSectionId && activeSectionId !== sec.id) {
            pulseVeil(0.46, 70);
          }
          activeSectionId = sec.id;
          break;
        }
      }
    };

    // Initialize current section without pulsing on initial load
    const initProbeY = window.innerHeight * 0.42;
    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= initProbeY && r.bottom >= initProbeY) {
        activeSectionId = sec.id;
        break;
      }
    }

    // 2. Cinema curtain dissolve when clicking anchor links (#about, #projects, etc.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash.length < 2) return;
      pulseVeil(0.82, 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleAnchorClick);
      if (fadeTimer !== null) {
        window.clearTimeout(fadeTimer);
      }
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={veilRef}
      aria-hidden="true"
      style={{ opacity: 0, backgroundColor: "#050608" }}
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}

