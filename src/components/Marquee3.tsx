"use client";

export default function Marquee3() {
  return (
    <section className="relative py-4 overflow-hidden bg-[#1a0030] rotate-[-1deg] scale-[1.02] -my-2 z-10">
      <div className="marquee-left whitespace-nowrap flex" style={{ "--speed": "25s" } as React.CSSProperties}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="inline-flex items-center gap-6 mx-3 font-[var(--font-display)] text-lg sm:text-2xl md:text-4xl font-[900] uppercase tracking-tight select-none">
            <span className="text-purple/70">Hotspots</span>
            <span className="text-white/10">✦</span>
            <span className="text-magenta/70">Quizzes</span>
            <span className="text-white/10">✦</span>
            <span className="text-cyan/70">Escape Rooms</span>
            <span className="text-white/10">✦</span>
            <span className="text-gold/70">Drag & Drop</span>
            <span className="text-white/10">✦</span>
            <span className="text-coral/70">Pop-ups</span>
            <span className="text-white/10">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
