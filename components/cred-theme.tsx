import React, { ReactNode } from "react";

/**
 * CredTheme
 *
 * Wraps the whole page in a CRED-inspired look: near-black canvas, white type,
 * cool silver accents and a slow, living background.
 * - The animated layer is `sticky`, so it stays in view for the entire page.
 * - Colors are re-mapped in globals.css under `.theme-cred`, so the section
 *   components themselves don't need to change.
 */
export function CredTheme({ children }: { children: ReactNode }) {
  return (
    <div className="theme-cred relative">
      <div
        aria-hidden="true"
        className="cred-bg pointer-events-none sticky top-0 z-0 h-screen w-full overflow-hidden"
        style={{ marginBottom: "-100vh" }}
      >
        <div className="cred-blob cred-blob-a" />
        <div className="cred-blob cred-blob-b" />
        <div className="cred-blob cred-blob-c" />
        <div className="cred-beam" />
        <div className="cred-grid" />
        <div className="cred-grain" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default CredTheme;
