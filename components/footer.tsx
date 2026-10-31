"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/logo";
import { FOOTER_CONTENT, NAV_LINKS, PERSONAL_INFO } from "@/lib/data";

const emptySubscribe = () => () => {};

export function Footer() {
  const currentYear = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getFullYear(),
    () => 2026
  );

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      data-studio-footer
      className="relative border-t border-white/10 bg-[#050505] text-white pt-20 pb-12 px-6 sm:px-12 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top 3-Column Editorial Studio Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16">
          {/* Column 1: Brand Wordmark + Uppercase Tagline */}
          <div className="md:col-span-6 space-y-5">
            <Logo variant="light-text" size="lg" />
            <p
              data-studio-muted
              className="text-xs sm:text-[13px] font-sans uppercase tracking-[0.14em] text-white/70 leading-relaxed max-w-md"
            >
              {FOOTER_CONTENT.brandDescriptionLine1}
              <br />
              {FOOTER_CONTENT.brandDescriptionLine2}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-5">
            <h3
              data-studio-muted
              className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-white/60"
            >
              {FOOTER_CONTENT.navigationHeading}
            </h3>
            <ul className="space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans font-medium uppercase tracking-[0.12em] text-white hover:text-[#c9ced6] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Socials + Email */}
          <div className="md:col-span-3 space-y-5">
            <h3
              data-studio-muted
              className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-white/60"
            >
              {FOOTER_CONTENT.socialsHeading}
            </h3>
            <ul className="space-y-3.5">
              {PERSONAL_INFO.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-sans font-medium uppercase tracking-[0.12em] text-white hover:text-[#c9ced6] transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-sm font-sans font-medium uppercase tracking-[0.12em] text-white hover:text-[#c9ced6] transition-colors"
                >
                  {FOOTER_CONTENT.emailLinkLabel}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider Bar */}
        <div
          data-studio-muted
          className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans uppercase tracking-[0.18em] text-white/60"
        >
          <p>
            © {currentYear} {PERSONAL_INFO.name}. {FOOTER_CONTENT.rightsReserved}
          </p>

          <button
            onClick={scrollToTop}
            aria-label={FOOTER_CONTENT.backToTopAriaLabel}
            data-studio-muted
            className="group inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors"
          >
            <span>{FOOTER_CONTENT.backToTopText}</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
