import { ScrollTextReveal } from "@/components/ui/scroll-text-reveal";

export default function ScrollTextRevealDemo() {
  return (
    <div className="bg-[#050505] min-h-screen text-[#f4f4f2]">
      <div className="h-[50vh] flex items-center justify-center border-b border-white/10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a8a86]">
          Scroll down to see the word-by-word reveal in action ↓
        </p>
      </div>

      <ScrollTextReveal
        eyebrow="Interactive Demo"
        text="Design is not just what it looks like and feels like. Design is how it works, feels, and resonates across every single interaction."
        highlightWords={["looks", "feels", "works,", "resonates", "interaction."]}
        sticky={true}
      />

      <div className="h-[50vh] flex items-center justify-center border-t border-white/10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8a8a86]">
          All words fully illuminated ↑
        </p>
      </div>
    </div>
  );
}
