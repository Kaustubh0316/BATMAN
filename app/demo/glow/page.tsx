import { GlowCard } from "@/components/ui/spotlight-card";

export default function GlowCardDemo() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center gap-10 bg-[#050505]">
      <GlowCard glowColor="silver" />
      <GlowCard glowColor="silver" />
      <GlowCard glowColor="silver" />
    </div>
  );
}
