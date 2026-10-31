import React from "react";
import fs from "fs";
import path from "path";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { ArchiveLoop } from "@/components/archive-loop";
import { Research } from "@/components/research";
import { Certificates } from "@/components/certificates";
import { BeyondCode } from "@/components/beyond-code";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { CredTheme } from "@/components/cred-theme";
import { SlideStageCurtain } from "@/components/ui/slide-transition";

export default function Home() {
  // Check if photo.jpg is present in the public directory
  const photoPath = path.join(process.cwd(), "public", "photo.jpg");
  const hasPhoto = fs.existsSync(photoPath);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f4f4f2] selection:bg-white/20 selection:text-white">
      <CredTheme>
        {/* Global XPlace Slide-Change Stage Curtain */}
        <SlideStageCurtain />

        {/* Floating Header / Navigation */}
        <Navbar />

        {/* Main Content Flow */}
        <main className="flex flex-col w-full">
          <Hero />
          <Manifesto />
          <About hasPhoto={hasPhoto} />
          <Skills />
          <Projects />
          <ArchiveLoop />
          <Research />
          <Certificates />
          <BeyondCode />
          <Contact />
        </main>

        {/* Studio-Inspired 3-Column Black Editorial Footer */}
        <Footer />
      </CredTheme>
    </div>
  );
}
