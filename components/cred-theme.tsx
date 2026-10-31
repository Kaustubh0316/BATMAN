import React, { ReactNode } from "react";

/**
 * CredTheme
 *
 * Wraps the site in the dark architectural theme.
 * - Uses `/site-bg.jpg` as a sticky full-viewport background behind all sections
 *   after the Hero (`Hero` keeps its own opaque `#07080a` + 3D `CredCorridor`).
 */
export function CredTheme({ children }: { children: ReactNode }) {
  return (
    <div className="theme-cred relative">
      <div
        aria-hidden="true"
        className="cred-bg pointer-events-none sticky top-0 z-0 h-screen w-full overflow-hidden"
        style={{ marginBottom: "-100vh" }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default CredTheme;
