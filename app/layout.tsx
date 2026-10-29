import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
import { SITE_METADATA } from "@/lib/data";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: SITE_METADATA.browserTitle,
  description: SITE_METADATA.browserDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${outfit.variable} dark scroll-smooth`}
    >
      <body className="bg-[#050505] text-[#f4f4f2] min-h-screen selection:bg-[#d9b97a]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
