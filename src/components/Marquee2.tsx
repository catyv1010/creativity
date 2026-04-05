"use client";

export default function Marquee2() {
  return (
    <section className="relative py-5 overflow-hidden bg-[#0a0020] rotate-[1.5deg] scale-[1.03] -my-3 z-10 border-y border-purple/20">
      <div className="marquee-right whitespace-nowrap flex" style={{ "--speed": "22s" } as React.CSSProperties}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="inline-flex items-center gap-6 mx-3 font-[var(--font-display)] text-xl sm:text-3xl md:text-5xl font-[900] uppercase tracking-tight select-none">
            <span className="text-cyan">Zoom</span>
            <span className="text-white/10">—</span>
            <span className="text-magenta">Drag</span>
            <span className="text-white/10">—</span>
            <span className="text-gold">Connect</span>
            <span className="text-white/10">—</span>
            <span className="text-white/80">Animate</span>
            <span className="text-white/10">—</span>
            <span className="text-coral">Create</span>
            <span className="text-white/10">—</span>
          </span>
        ))}
      </div>
    </section>
  );
}
