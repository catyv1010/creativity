"use client";

export default function Marquee() {
  return (
    <section className="relative py-5 overflow-hidden bg-coral rotate-[-1.5deg] scale-[1.03] -my-3 z-10">
      <div className="marquee-left whitespace-nowrap flex" style={{ "--speed": "18s" } as React.CSSProperties}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="inline-flex items-center gap-6 mx-3 font-[var(--font-display)] text-xl sm:text-3xl md:text-5xl font-[900] uppercase tracking-tight select-none">
            <span className="text-white">Crea</span>
            <span className="text-white/30">•</span>
            <span className="text-white">Imagina</span>
            <span className="text-white/30">•</span>
            <span className="text-white">Inspira</span>
            <span className="text-white/30">•</span>
            <span className="text-white">Transforma</span>
            <span className="text-white/30">•</span>
            <span className="text-white">Disena</span>
            <span className="text-white/30">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}
