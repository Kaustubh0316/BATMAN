"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { ARCHIVE_LOOP_CONTENT, ArchiveTapeItem } from "@/lib/data";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface ProjectedVert {
  x: number;
  y: number;
  z: number; // camera-space depth (z > 0 in front of camera)
}

function rotateXYZ(v: Vec3, rx: number, ry: number, rz: number): Vec3 {
  // Rotate around X
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = v.y * cosX - v.z * sinX;
  const z1 = v.y * sinX + v.z * cosX;

  // Rotate around Y
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = v.x * cosY + z1 * sinY;
  const z2 = -v.x * sinY + z1 * cosY;

  // Rotate around Z
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

function sub3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross3(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot3(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function norm3(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

/**
 * Generates an ultra-crisp 800x500 monochrome technical cassette shell texture
 */
function createCassetteTexture(
  tape: ArchiveTapeItem,
  silverVariant: boolean
): HTMLCanvasElement {
  const w = 800;
  const h = 500;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Base metallic noir or brushed silver shell
  const baseGrad = ctx.createLinearGradient(0, 0, w, h);
  if (silverVariant) {
    baseGrad.addColorStop(0, "#cfd4dc");
    baseGrad.addColorStop(0.45, "#9aa1ad");
    baseGrad.addColorStop(1, "#69707c");
  } else {
    baseGrad.addColorStop(0, "#191b20");
    baseGrad.addColorStop(0.5, "#0d0e12");
    baseGrad.addColorStop(1, "#060709");
  }
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle horizontal brushed-metal hairline striations
  ctx.strokeStyle = silverVariant
    ? "rgba(255,255,255,0.16)"
    : "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let y = 8; y < h; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Outer chamfered rim frame
  ctx.strokeStyle = silverVariant
    ? "rgba(255,255,255,0.75)"
    : "rgba(255,255,255,0.34)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Inner recessed label panel
  ctx.strokeStyle = silverVariant
    ? "rgba(20,22,28,0.45)"
    : "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 38, w - 92, 336);

  // 4 Corner precision screws
  const screws = [
    [32, 32],
    [w - 32, 32],
    [32, h - 32],
    [w - 32, h - 32],
    [w / 2, h - 42],
  ];
  for (const [sx, sy] of screws) {
    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, Math.PI * 2);
    ctx.fillStyle = silverVariant ? "#3a3e47" : "#07080a";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(sx - 5, sy);
    ctx.lineTo(sx + 5, sy);
    ctx.moveTo(sx, sy - 5);
    ctx.lineTo(sx, sy + 5);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.stroke();
  }

  // Top Header Typography (Brand on left, Model Code on right)
  const ink = silverVariant ? "#0d0f13" : "#f4f6fa";
  const subInk = silverVariant
    ? "rgba(13,15,19,0.68)"
    : "rgba(244,246,250,0.68)";

  ctx.fillStyle = ink;
  ctx.font = "800 34px system-ui, -apple-system, sans-serif";
  ctx.fillText(tape.brandLabel, 72, 92);

  ctx.font = "600 13px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = subInk;
  ctx.fillText(tape.sideLabel, 74, 118);

  // Right bold technical tape model code (e.g. "METAL-ES 100", "UX-S 46")
  ctx.textAlign = "right";
  ctx.fillStyle = ink;
  ctx.font = "italic 800 32px system-ui, -apple-system, sans-serif";
  ctx.fillText(tape.tapeCode, w - 72, 92);

  ctx.font = "600 12px ui-monospace, SFMono-Regular, monospace";
  ctx.fillStyle = subInk;
  ctx.fillText("HIGH PRECISION SHELL // BIAS 70μs EQ", w - 72, 118);
  ctx.textAlign = "left";

  // Horizontal calibration rule across label
  ctx.strokeStyle = silverVariant
    ? "rgba(15,17,22,0.35)"
    : "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(72, 134);
  ctx.lineTo(w - 72, 134);
  ctx.stroke();

  // Center Smoked Acrylic Reel Window
  const winX = 128;
  const winY = 154;
  const winW = w - 256;
  const winH = 178;

  ctx.fillStyle = "#050608";
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 3;
  ctx.strokeRect(winX, winY, winW, winH);

  // Magnetic tape packs around left & right hubs
  const leftHubX = 248;
  const rightHubX = w - 248;
  const hubY = winY + winH / 2;

  for (const [hx, packR] of [
    [leftHubX, 82],
    [rightHubX, 66],
  ]) {
    const tapeGrad = ctx.createRadialGradient(hx, hubY, 36, hx, hubY, packR);
    tapeGrad.addColorStop(0, "#14161b");
    tapeGrad.addColorStop(0.6, "#22252d");
    tapeGrad.addColorStop(1, "#0d0f13");
    ctx.beginPath();
    ctx.arc(hx, hubY, packR, 0, Math.PI * 2);
    ctx.fillStyle = tapeGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // Central transparent gauge ticks (100 - 50 - 0)
  ctx.strokeStyle = "rgba(255,255,255,0.38)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(w / 2 - 74, hubY - 34, 148, 68);
  for (let i = 0; i <= 10; i++) {
    const tx = w / 2 - 60 + i * 12;
    const th = i % 5 === 0 ? 14 : 7;
    ctx.beginPath();
    ctx.moveTo(tx, hubY - th / 2);
    ctx.lineTo(tx, hubY + th / 2);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "600 10px ui-monospace, SFMono-Regular, monospace";
  ctx.fillText("100", w / 2 - 68, hubY + 24);
  ctx.fillText("50", w / 2 - 6, hubY + 24);
  ctx.fillText("0", w / 2 + 56, hubY + 24);

  // Dual Precision Spoked White/Silver Tape Reels
  for (const hx of [leftHubX, rightHubX]) {
    // Outer metallic hub ring
    ctx.beginPath();
    ctx.arc(hx, hubY, 44, 0, Math.PI * 2);
    ctx.fillStyle = "#dcdfe6";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(hx, hubY, 34, 0, Math.PI * 2);
    ctx.fillStyle = "#08090c";
    ctx.fill();

    // 6 internal drive teeth
    ctx.fillStyle = "#f4f6fa";
    for (let t = 0; t < 6; t++) {
      const ang = (t * Math.PI) / 3;
      ctx.save();
      ctx.translate(hx, hubY);
      ctx.rotate(ang);
      ctx.fillRect(-3.5, 22, 7, 11);
      ctx.restore();
    }

    // Inner bearing ring
    ctx.beginPath();
    ctx.arc(hx, hubY, 15, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Side "A" Square Badge + Bottom Technical Legend
  ctx.fillStyle = ink;
  ctx.fillRect(72, 344, 24, 22);
  ctx.fillStyle = silverVariant ? "#cfd4dc" : "#0a0b0e";
  ctx.font = "800 15px system-ui, sans-serif";
  ctx.fillText("A", 79, 360);

  ctx.fillStyle = subInk;
  ctx.font = "600 12px ui-monospace, SFMono-Regular, monospace";
  ctx.fillText(tape.hudTitle, 108, 360);

  // Bottom Raised Trapezoid Magnetic Head Housing
  ctx.beginPath();
  ctx.moveTo(148, h - 14);
  ctx.lineTo(184, h - 104);
  ctx.lineTo(w - 184, h - 104);
  ctx.lineTo(w - 148, h - 14);
  ctx.closePath();
  ctx.fillStyle = silverVariant
    ? "rgba(180,186,196,0.65)"
    : "rgba(26,29,36,0.95)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Capstan & alignment holes inside trapezoid
  const holes = [
    [235, h - 54, 15],
    [305, h - 46, 11],
    [w - 305, h - 46, 11],
    [w - 235, h - 54, 15],
  ];
  for (const [cx, cy, cr] of holes) {
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fillStyle = "#030405";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  return canvas;
}

/**
 * Perspective-subdivided affine triangle texture mapper
 */
function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  u2: number,
  v2: number
) {
  // Expand triangle vertices by 0.45px outward from centroid to prevent subpixel gaps
  const cx = (x0 + x1 + x2) / 3;
  const cy = (y0 + y1 + y2) / 3;
  const expand = (px: number, py: number): [number, number] => {
    const dx = px - cx;
    const dy = py - cy;
    const len = Math.hypot(dx, dy) || 1;
    return [px + (dx / len) * 0.48, py + (dy / len) * 0.48];
  };
  const [ex0, ey0] = expand(x0, y0);
  const [ex1, ey1] = expand(x1, y1);
  const [ex2, ey2] = expand(x2, y2);

  const du1 = u1 - u0;
  const dv1 = v1 - v0;
  const du2 = u2 - u0;
  const dv2 = v2 - v0;
  const det = du1 * dv2 - du2 * dv1;
  if (Math.abs(det) < 1e-4) return;

  const dx1 = x1 - x0;
  const dy1 = y1 - y0;
  const dx2 = x2 - x0;
  const dy2 = y2 - y0;

  const a = (dx1 * dv2 - dx2 * dv1) / det;
  const c = (dx2 * du1 - dx1 * du2) / det;
  const e = x0 - a * u0 - c * v0;
  const b = (dy1 * dv2 - dy2 * dv1) / det;
  const d = (dy2 * du1 - dy1 * du2) / det;
  const f = y0 - b * u0 - d * v0;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ex0, ey0);
  ctx.lineTo(ex1, ey1);
  ctx.lineTo(ex2, ey2);
  ctx.closePath();
  ctx.clip();
  ctx.transform(a, b, c, d, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

export function ArchiveLoop() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tapes = ARCHIVE_LOOP_CONTENT.tapes;
    // Pre-render offscreen high-res cassette shell textures
    const textures = tapes.map((tape, idx) =>
      createCassetteTexture(tape, idx === 3)
    );

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, rect.width);
      height = Math.max(460, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Subtle pointer tilt parallax
    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      pointer.targetX = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
      pointer.targetY = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
    };
    container.addEventListener("pointermove", onPointerMove, { passive: true });

    // Pause RAF when scrolled completely offscreen for 0% background CPU usage
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const keyLight = norm3({ x: 0.52, y: -0.58, z: 0.63 });
    const rimLight = norm3({ x: -0.74, y: -0.22, z: 0.63 });
    const viewVec: Vec3 = { x: 0, y: 0, z: 1 };
    const halfKey = norm3({
      x: keyLight.x + viewVec.x,
      y: keyLight.y + viewVec.y,
      z: keyLight.z + viewVec.z,
    });
    const halfRim = norm3({
      x: rimLight.x + viewVec.x,
      y: rimLight.y + viewVec.y,
      z: rimLight.z + viewVec.z,
    });

    const LOOP_SECONDS = 14.0;
    const ITEM_COUNT = 8; // 6 full cassettes + 2 exploded structural sub-frames
    let rafId: number | null = null;
    const startTs = performance.now();

    const projectPoint = (
      p: Vec3,
      camDist: number,
      focal: number,
      cx: number,
      cy: number
    ): ProjectedVert => {
      const zCam = camDist - p.z;
      const safeZ = Math.max(0.6, zCam);
      const scale = focal / safeZ;
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        z: safeZ,
      };
    };

    const renderFrame = (now: number) => {
      rafId = window.requestAnimationFrame(renderFrame);
      if (!isVisible) return;

      const elapsed = reducedMotion ? 2.4 : (now - startTs) / 1000;
      const loopT = (elapsed % LOOP_SECONDS) / LOOP_SECONDS;

      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Transparent canvas so the site's dark architectural grid background shows through seamlessly
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.52;
      const cy = height * 0.5;
      const camDist = 9.2;
      const focal = Math.min(width, height * 1.25) * 0.96;

      // 1. Draw 3D Tilted Dashed & Solid Orbital Trajectories (Back & Midground)
      const orbits = [
        { rx: 1.08, ry: 0.22, rz: -0.24, radX: 4.5, radY: 2.35, dashed: true },
        { rx: 1.18, ry: -0.32, rz: 0.19, radX: 3.8, radY: 1.95, dashed: false },
        { rx: 0.96, ry: 0.44, rz: -0.12, radX: 5.1, radY: 2.6, dashed: true },
      ];

      for (const orb of orbits) {
        ctx.save();
        if (orb.dashed) {
          ctx.setLineDash([3, 5]);
        }
        ctx.beginPath();
        const steps = 84;
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2 + loopT * Math.PI * 2 * 0.25;
          const local: Vec3 = {
            x: Math.cos(a) * orb.radX,
            y: Math.sin(a) * orb.radY,
            z: 0,
          };
          const world = rotateXYZ(
            local,
            orb.rx + pointer.y * 0.08,
            orb.ry + pointer.x * 0.1,
            orb.rz
          );
          const pr = projectPoint(world, camDist, focal, cx, cy);
          if (s === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        }
        ctx.strokeStyle = orb.dashed
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(255, 255, 255, 0.11)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Build 3D Helical Cassette Assembly State for Current Timestamp
      interface RenderableObject {
        idx: number;
        tapeIdx: number;
        kind: "cassette" | "rail" | "frame";
        centerWorld: Vec3;
        camDepth: number;
        rx: number;
        ry: number;
        rz: number;
        edgeFade: number;
        anchorScreen?: ProjectedVert;
        bounds?: { minX: number; minY: number; maxX: number; maxY: number };
      }

      const objects: RenderableObject[] = [];

      for (let i = 0; i < ITEM_COUNT; i++) {
        // Seamless modular helical phase u in [0, 1)
        const u = (loopT + i / ITEM_COUNT) % 1;
        const helixAngle = u * Math.PI * 2 + 0.65;

        // Smooth fade near extreme top/bottom entry & exit of the endless helix
        const edgeFade = Math.sin(Math.PI * Math.min(1, Math.max(0, u)));
        const smoothFade = Math.pow(edgeFade, 0.45);

        const kind: "cassette" | "rail" | "frame" =
          i === 2 ? "rail" : i === 6 ? "frame" : "cassette";

        const worldCenter: Vec3 = {
          x:
            Math.sin(helixAngle) * 1.55 +
            (kind === "rail" ? -0.95 : kind === "frame" ? 0.75 : 0),
          y: (0.5 - u) * 7.8,
          z: Math.cos(helixAngle) * 1.65,
        };

        // Dramatic noir tilt angles matching 00:00 -> 00:12
        const rx =
          -0.88 +
          Math.sin(helixAngle * 1.0 + i) * 0.36 +
          pointer.y * 0.12;
        const ry =
          Math.cos(helixAngle) * 0.58 +
          (i % 2 === 0 ? 0.18 : -0.22) +
          pointer.x * 0.16;
        const rz = -0.26 + Math.sin(helixAngle + i * 0.7) * 0.32;

        objects.push({
          idx: i,
          tapeIdx: i % tapes.length,
          kind,
          centerWorld: worldCenter,
          camDepth: camDist - worldCenter.z,
          rx,
          ry,
          rz,
          edgeFade: smoothFade,
        });
      }

      // Sort back-to-front by camera depth
      objects.sort((a, b) => b.camDepth - a.camDepth);

      const bloomFlares: Array<{
        x: number;
        y: number;
        rx: number;
        ry: number;
        angle: number;
        intensity: number;
      }> = [];

      // 3. Rasterize Each 3D Cassette / Exploded Frame
      for (const obj of objects) {
        if (obj.edgeFade <= 0.03) continue;

        const hx = obj.kind === "rail" ? 1.85 : obj.kind === "frame" ? 1.65 : 1.96;
        const hy = obj.kind === "rail" ? 0.19 : obj.kind === "frame" ? 1.02 : 1.22;
        const hz = obj.kind === "rail" ? 0.15 : obj.kind === "frame" ? 0.07 : 0.21;

        const transformVert = (lx: number, ly: number, lz: number): Vec3 => {
          const r = rotateXYZ({ x: lx, y: ly, z: lz }, obj.rx, obj.ry, obj.rz);
          return {
            x: r.x + obj.centerWorld.x,
            y: r.y + obj.centerWorld.y,
            z: r.z + obj.centerWorld.z,
          };
        };

        // 8 Box corners: top (+hz) 0..3, bottom (-hz) 4..7
        const cornersWorld: Vec3[] = [
          transformVert(-hx, -hy, hz),
          transformVert(hx, -hy, hz),
          transformVert(hx, hy, hz),
          transformVert(-hx, hy, hz),
          transformVert(-hx, -hy, -hz),
          transformVert(hx, -hy, -hz),
          transformVert(hx, hy, -hz),
          transformVert(-hx, hy, -hz),
        ];

        const cornersProj = cornersWorld.map((v) =>
          projectPoint(v, camDist, focal, cx, cy)
        );

        // Compute screen bounding box & HUD anchor vertex for lock-on scanner
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        for (const p of cornersProj) {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        }
        obj.bounds = { minX, minY, maxX, maxY };
        obj.anchorScreen = cornersProj[1];

        ctx.save();
        ctx.globalAlpha = obj.edgeFade;

        // 6 Oriented Quad Faces (indices in counter-clockwise outward winding)
        const faces: Array<{
          ids: [number, number, number, number];
          isFrontTex?: boolean;
          isSpineSlots?: boolean;
        }> = [
          { ids: [0, 1, 2, 3], isFrontTex: true }, // +Z Front Label Face
          { ids: [5, 4, 7, 6] }, // -Z Back Shell Face
          { ids: [4, 5, 1, 0], isSpineSlots: true }, // -Y Top Spine
          { ids: [3, 2, 6, 7], isSpineSlots: true }, // +Y Bottom Magnetic Opening Spine
          { ids: [4, 0, 3, 7] }, // -X Left Edge
          { ids: [1, 5, 6, 2] }, // +X Right Edge
        ];

        // Sort visible faces back-to-front
        const visibleFaces = faces
          .map((face) => {
            const [i0, i1, i2, i3] = face.ids;
            const w0 = cornersWorld[i0];
            const w1 = cornersWorld[i1];
            const w2 = cornersWorld[i2];
            const normal = norm3(cross3(sub3(w1, w0), sub3(w2, w0)));
            const faceCenter: Vec3 = {
              x: (w0.x + cornersWorld[i2].x) * 0.5,
              y: (w0.y + cornersWorld[i2].y) * 0.5,
              z: (w0.z + cornersWorld[i2].z) * 0.5,
            };
            const toCam = norm3({
              x: -faceCenter.x,
              y: -faceCenter.y,
              z: camDist - faceCenter.z,
            });
            const facing = dot3(normal, toCam);
            const avgDepth =
              (cornersProj[i0].z +
                cornersProj[i1].z +
                cornersProj[i2].z +
                cornersProj[i3].z) *
              0.25;
            return { ...face, normal, facing, avgDepth };
          })
          .filter((f) => f.facing > -0.04 || obj.kind === "frame")
          .sort((a, b) => b.avgDepth - a.avgDepth);

        for (const face of visibleFaces) {
          const [i0, i1, i2, i3] = face.ids;
          const p0 = cornersProj[i0];
          const p1 = cornersProj[i1];
          const p2 = cornersProj[i2];
          const p3 = cornersProj[i3];

          const n =
            face.facing < 0
              ? { x: -face.normal.x, y: -face.normal.y, z: -face.normal.z }
              : face.normal;

          const diffKey = Math.max(0, dot3(n, keyLight));
          const diffRim = Math.max(0, dot3(n, rimLight));
          const specKey = Math.pow(Math.max(0, dot3(n, halfKey)), 22);
          const specRim = Math.pow(Math.max(0, dot3(n, halfRim)), 18);
          const totalSpec = Math.min(1.4, specKey * 1.15 + specRim * 0.95);

          if (obj.kind === "frame") {
            // Deconstructed hollow metallic slip-frame plate (seen in 00:02 & 00:03)
            if (face.isFrontTex) {
              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.lineTo(p3.x, p3.y);
              ctx.closePath();
              ctx.fillStyle = `rgba(180, 188, 202, ${0.06 + totalSpec * 0.16})`;
              ctx.fill();
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.42 + totalSpec * 0.5})`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            continue;
          }

          if (face.isFrontTex && obj.kind === "cassette" && face.facing > 0) {
            // Perspective-subdivided 3x2 grid texture projection (12 triangles)
            const tex = textures[obj.tapeIdx];
            const cols = 3;
            const rows = 2;
            const w0 = cornersWorld[i0];
            const w1 = cornersWorld[i1];
            const w2 = cornersWorld[i2];
            const w3 = cornersWorld[i3];

            const bilerpWorld = (u: number, v: number): ProjectedVert => {
              const topX = w0.x + (w1.x - w0.x) * u;
              const topY = w0.y + (w1.y - w0.y) * u;
              const topZ = w0.z + (w1.z - w0.z) * u;
              const botX = w3.x + (w2.x - w3.x) * u;
              const botY = w3.y + (w2.y - w3.y) * u;
              const botZ = w3.z + (w2.z - w3.z) * u;
              return projectPoint(
                {
                  x: topX + (botX - topX) * v,
                  y: topY + (botY - topY) * v,
                  z: topZ + (botZ - topZ) * v,
                },
                camDist,
                focal,
                cx,
                cy
              );
            };

            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const uA = c / cols;
                const uB = (c + 1) / cols;
                const vA = r / rows;
                const vB = (r + 1) / rows;

                const g00 = bilerpWorld(uA, vA);
                const g10 = bilerpWorld(uB, vA);
                const g11 = bilerpWorld(uB, vB);
                const g01 = bilerpWorld(uA, vB);

                const tuA = uA * tex.width;
                const tuB = uB * tex.width;
                const tvA = vA * tex.height;
                const tvB = vB * tex.height;

                drawTexturedTriangle(
                  ctx,
                  tex,
                  g00.x,
                  g00.y,
                  g10.x,
                  g10.y,
                  g11.x,
                  g11.y,
                  tuA,
                  tvA,
                  tuB,
                  tvA,
                  tuB,
                  tvB
                );
                drawTexturedTriangle(
                  ctx,
                  tex,
                  g00.x,
                  g00.y,
                  g11.x,
                  g11.y,
                  g01.x,
                  g01.y,
                  tuA,
                  tvA,
                  tuB,
                  tvB,
                  tuA,
                  tvB
                );
              }
            }

            // Noir Chiaroscuro Lighting Overlay + Metallic Specular Glaze
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();

            const shadowAlpha = Math.max(0, 0.58 - (diffKey * 0.52 + diffRim * 0.25));
            if (shadowAlpha > 0.02) {
              ctx.fillStyle = `rgba(2, 3, 5, ${shadowAlpha.toFixed(3)})`;
              ctx.fill();
            }
            if (totalSpec > 0.05) {
              ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(
                0.55,
                totalSpec * 0.38
              ).toFixed(3)})`;
              ctx.fill();
            }

            // Crisp Metallic Bevel Rim Line
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(
              0.95,
              0.24 + totalSpec * 0.72
            ).toFixed(3)})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          } else {
            // Extruded 3D Side Walls, Back Face & Perforated Spine Rails
            const lum = Math.min(
              255,
              Math.round(14 + diffKey * 78 + diffRim * 58 + totalSpec * 165)
            );
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fillStyle = `rgb(${lum}, ${lum}, ${Math.min(255, lum + 5)})`;
            ctx.fill();

            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(
              0.92,
              0.2 + diffRim * 0.35 + totalSpec * 0.65
            ).toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Perforated Rectangular Spine Slots (matching 00:00, 00:03, 00:12)
            if (face.isSpineSlots || (obj.kind === "rail" && face.isFrontTex)) {
              const slotCount = 5;
              for (let s = 0; s < slotCount; s++) {
                const tA = (s + 0.22) / slotCount;
                const tB = (s + 0.78) / slotCount;
                const lerpEdge = (
                  a: ProjectedVert,
                  b: ProjectedVert,
                  t: number
                ) => ({
                  x: a.x + (b.x - a.x) * t,
                  y: a.y + (b.y - a.y) * t,
                });
                const topL = lerpEdge(p0, p1, tA);
                const topR = lerpEdge(p0, p1, tB);
                const botR = lerpEdge(p3, p2, tB);
                const botL = lerpEdge(p3, p2, tA);

                ctx.beginPath();
                ctx.moveTo(
                  topL.x * 0.8 + botL.x * 0.2,
                  topL.y * 0.8 + botL.y * 0.2
                );
                ctx.lineTo(
                  topR.x * 0.8 + botR.x * 0.2,
                  topR.y * 0.8 + botR.y * 0.2
                );
                ctx.lineTo(
                  botR.x * 0.8 + topR.x * 0.2,
                  botR.y * 0.8 + topR.y * 0.2
                );
                ctx.lineTo(
                  botL.x * 0.8 + topL.x * 0.2,
                  botL.y * 0.8 + topL.y * 0.2
                );
                ctx.closePath();
                ctx.fillStyle = "#020304";
                ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.28)";
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          }

          // Collect Intense Studio Specular Edge Bloom Flares (00:01, 00:03, 00:05, 00:08)
          if (totalSpec > 0.36) {
            const edgeMidX = (p1.x + p2.x) * 0.5;
            const edgeMidY = (p1.y + p2.y) * 0.5;
            const edgeAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            bloomFlares.push({
              x: edgeMidX,
              y: edgeMidY,
              rx: Math.min(130, 52 + totalSpec * 75),
              ry: Math.min(48, 18 + totalSpec * 26),
              angle: edgeAngle,
              intensity: Math.min(0.95, (totalSpec - 0.32) * 1.15) * obj.edgeFade,
            });
          }
        }

        ctx.restore();
      }

      // 4. Additive White Specular Bloom Pass
      if (bloomFlares.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        for (const fl of bloomFlares) {
          ctx.save();
          ctx.translate(fl.x, fl.y);
          ctx.rotate(fl.angle);
          ctx.scale(1, fl.ry / Math.max(1, fl.rx));
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, fl.rx);
          grad.addColorStop(0, `rgba(255, 255, 255, ${fl.intensity.toFixed(3)})`);
          grad.addColorStop(
            0.35,
            `rgba(230, 236, 248, ${(fl.intensity * 0.45).toFixed(3)})`
          );
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, fl.rx, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      // 5. Cybernetic HUD Scanner + Pixel-Mosaic Glitch Window (00:00 -> 00:12)
      const scanPeriod = 2.35;
      const scanCycle = Math.floor(elapsed / scanPeriod);
      const scanPhase = (elapsed % scanPeriod) / scanPeriod; // 0..1

      // Pick the foreground cassette closest to vertical center for HUD lock-on
      const candidates = objects
        .filter(
          (o) =>
            o.kind === "cassette" &&
            o.edgeFade > 0.55 &&
            Math.abs(o.centerWorld.y) < 2.2
        )
        .sort((a, b) => a.camDepth - b.camDepth);

      const targetObj =
        candidates[scanCycle % Math.max(1, candidates.length)] || objects[0];

      if (targetObj && targetObj.anchorScreen && targetObj.bounds) {
        const tapeInfo = tapes[targetObj.tapeIdx];
        const anchor = targetObj.anchorScreen;
        const b = targetObj.bounds;

        const boxW = Math.min(340, Math.max(220, width * 0.28));
        const boxH = 112;
        const onLeftSide = anchor.x > width * 0.54;
        const boxX = Math.max(
          24,
          Math.min(
            width - boxW - 24,
            onLeftSide ? b.minX - boxW * 0.45 : b.minX + 18
          )
        );
        const boxY = Math.max(
          64,
          Math.min(height - boxH - 64, (b.minY + b.maxY) * 0.5 - boxH * 0.5)
        );

        ctx.save();

        // Phase A (0.00..0.18): High-contrast White Rectangular Scan Flash (00:09, 00:10)
        if (scanPhase < 0.18) {
          const p = scanPhase / 0.18;
          const flashW = boxW * (0.4 + p * 0.85);
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.88 * (1 - p * 0.45)).toFixed(
            2
          )})`;
          ctx.fillRect(boxX, boxY + 14, flashW, boxH - 24);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fillRect(boxX - 14, boxY + 4, 34, 10);
        }

        // Phase B (0.08..0.90): Tracking Reticle + Wireframe Bounding Frame + Pixel-Mosaic Glitch
        if (scanPhase >= 0.08 && scanPhase <= 0.92) {
          const hudAlpha =
            scanPhase > 0.82 ? Math.max(0, (0.92 - scanPhase) / 0.1) : 1;
          ctx.globalAlpha = hudAlpha;

          // Target Reticle on 3D Cassette Vertex + Diagonal Leader Line
          ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(anchor.x, anchor.y, 4.5, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(anchor.x, anchor.y);
          ctx.lineTo(boxX + boxW * 0.65, boxY);
          ctx.stroke();

          // Sharp 1px White HUD Bounding Box
          ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
          ctx.strokeRect(boxX, boxY, boxW, boxH);

          // Corner Micro-Coordinates (e.g. "x: 431 y: 493", "w: 620 h: 1080")
          ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
          ctx.font = "500 9px ui-monospace, SFMono-Regular, monospace";
          const coordText = `x: ${Math.round(boxX)} y: ${Math.round(boxY)}`;
          const sizeText = `w: ${Math.round(b.maxX - b.minX)} h: ${Math.round(
            b.maxY - b.minY
          )}`;
          ctx.fillText(coordText, boxX, boxY - 6);
          ctx.fillText(sizeText, boxX + boxW - 88, boxY + boxH + 12);

          // Upper-Left Technical Title & Metadata Callout (matching 00:00, 00:05, 00:07, 00:11)
          const labelX = Math.max(24, boxX - 24);
          const labelY = Math.max(40, boxY - 34);
          ctx.fillStyle = "#ffffff";
          ctx.font = "700 10px system-ui, -apple-system, sans-serif";
          ctx.fillText(tapeInfo.hudTitle, labelX, labelY);

          ctx.fillStyle = "rgba(220, 226, 236, 0.72)";
          ctx.font = "500 8.5px ui-monospace, SFMono-Regular, monospace";
          ctx.fillText(tapeInfo.hudMeta, labelX, labelY + 12);

          // Procedural Blocky Pixel-Mosaic Glitch Tiles Inside Scan Frame (00:02, 00:03, 00:07, 00:11)
          const cellCols = 14;
          const cellRows = 5;
          const cw = boxW / cellCols;
          const ch = boxH / cellRows;
          const tickSeed = Math.floor(elapsed * 14);

          for (let r = 0; r < cellRows; r++) {
            for (let c = 0; c < cellCols; c++) {
              // Deterministic pseudo-random hash for crisp cybernetic block flicker
              const hVal =
                Math.sin((c + 1) * 12.9898 + (r + 1) * 78.233 + tickSeed * 3.17) *
                43758.5453;
              const frac = hVal - Math.floor(hVal);

              const density = scanPhase < 0.36 ? 0.58 : 0.34;
              if (frac < density) {
                const lum =
                  frac < 0.08
                    ? "rgba(255, 255, 255, 0.9)"
                    : frac < 0.16
                      ? "rgba(182, 196, 224, 0.65)"
                      : frac < 0.24
                        ? "rgba(120, 128, 145, 0.48)"
                        : "rgba(38, 42, 52, 0.72)";
                ctx.fillStyle = lum;
                const spanW = frac < 0.1 ? cw * 2 : cw - 1;
                ctx.fillRect(
                  boxX + c * cw + 0.5,
                  boxY + r * ch + 0.5,
                  Math.min(spanW, boxX + boxW - (boxX + c * cw) - 1),
                  ch - 1
                );
              }
            }
          }

          // Horizontal Telemetry Scan Sweep Line
          const sweepY = boxY + ((scanPhase * 2.4) % 1) * boxH;
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.fillRect(boxX - 10, sweepY, boxW + 20, 1.2);
        }

        ctx.restore();
      }

      ctx.restore();
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", onPointerMove);
      io.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [reducedMotion]);

  return (
    <section
      id="archive"
      ref={containerRef}
      aria-label={ARCHIVE_LOOP_CONTENT.ariaLabel}
      className="relative w-full h-[78vh] sm:h-[88vh] min-h-[520px] max-h-[860px] overflow-hidden border-t border-white/[0.06] bg-transparent select-none"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </section>
  );
}

export default ArchiveLoop;

