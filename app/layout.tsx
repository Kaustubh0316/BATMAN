import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
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
  title: "Kaustubh Chamankar | Computer Science Engineering Student",
  description:
    "First-year B.Tech Computer Science Engineering student at ITM Skills University exploring AI/ML, Generative AI, research and development, web development, and entrepreneurship.",
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
