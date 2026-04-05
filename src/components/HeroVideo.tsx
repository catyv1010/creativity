"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-register";

registerGSAPPlugins();

/**
 * HeroVideo — Cinematic editor reveal.
 * Animates in automatically when the section enters the viewport.
 */
export default function HeroVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!frameRef.current || !sectionRef.current) return;

    const frame = frameRef.current;
    const cards = frame.querySelectorAll("[data-animate]");

    // Set initial state
    gsap.set(frame, { scale: 0.6, rotateX: 14, rotateY: -5, borderRadius: 28, opacity: 0 });
    gsap.set(cards, { y: 30, opacity: 0, scale: 0.95 });

    const playReveal = () => {
      if (hasPlayed.current) return;
      hasPlayed.current = true;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(frame, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        borderRadius: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      });

      tl.to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.07,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.6");
    };

    // IntersectionObserver: play when section enters viewport at ≥20%
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playReveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="demo-video" ref={sectionRef} className="relative min-h-screen bg-[#030014] flex items-center justify-center py-16 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>

      <div
        ref={frameRef}
        className="relative w-full max-w-[95vw] max-h-[90vh] aspect-[16/9] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)]"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {/* REAL-LOOKING EDITOR */}
        <div className="w-full h-full bg-[#0a0a1a] flex flex-col">

          {/* Chrome bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-[#0f0f1a] border-b border-white/5 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-5 py-1 rounded-md bg-white/5 text-white/25 text-xs font-medium font-mono">creativity.app/cinema-editor</div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold">Plantillas</div>
              <div className="px-3 py-1 rounded-md bg-white/5 text-white/25 text-[10px] font-bold">Media</div>
              <div className="px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">▶ Presentar</div>
            </div>
          </div>

          {/* Editor body */}
          <div className="flex-1 flex overflow-hidden">

            {/* Left panel — Scene thumbnails */}
            <div className="w-52 border-r border-white/5 bg-[#0f0f1a] p-3 space-y-2 shrink-0 hidden lg:block">
              <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-3">Escenas</div>
              {[
                { bg: "from-indigo-900 to-purple-900", label: "Hero", active: true },
                { bg: "from-slate-900 to-slate-800", label: "Problema" },
                { bg: "from-purple-900/50 to-pink-900/50", label: "Solucion" },
                { bg: "from-indigo-900/30 to-cyan-900/30", label: "Resultados" },
                { bg: "from-violet-900/30 to-fuchsia-900/30", label: "Contacto" },
              ].map((s, i) => (
                <div key={i} data-animate className={`rounded-lg overflow-hidden ${s.active ? "ring-2 ring-purple-500" : "ring-1 ring-white/5"}`}>
                  <div className={`h-16 bg-gradient-to-br ${s.bg} relative`}>
                    <div className="absolute bottom-1 left-2 text-[8px] text-white/40 font-medium">{i + 1}. {s.label}</div>
                  </div>
                </div>
              ))}
              {/* Transition indicator */}
              <div className="flex items-center justify-center py-1">
                <div className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400/60 text-[8px] font-bold">zoom-blur ↓</div>
              </div>
            </div>

            {/* Canvas area — THE STAR */}
            <div className="flex-1 bg-[#1a1a2e] flex items-center justify-center relative p-8">
              {/* Dot grid */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />

              {/* The "slide" being edited */}
              <div data-animate className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]">
                {/* Slide background — rich gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a2a] via-[#1a0e36] to-[#0c1445]" />

                {/* Decorative orbs */}
                <div data-animate className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-500/15 blur-[80px]" />
                <div data-animate className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-pink-500/12 blur-[60px]" />
                <div data-animate className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-indigo-500/10 blur-[40px]" />

                {/* Content on the slide */}
                <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
                  {/* Badge */}
                  <div data-animate className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/20 mb-4 w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span className="text-purple-300/80 text-[10px] font-bold uppercase tracking-wider">Pitch 2025</span>
                  </div>

                  {/* Title */}
                  <h3 data-animate className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "DM Serif Display, serif" }}>
                    Transformamos el<br />Futuro Digital
                  </h3>

                  {/* Accent line */}
                  <div data-animate className="w-16 h-1 rounded-full bg-purple-500 mb-4" />

                  {/* Subtitle */}
                  <p data-animate className="text-white/50 text-xs md:text-sm max-w-md leading-relaxed mb-6">
                    Innovacion tecnologica para empresas que quieren liderar su industria con soluciones de impacto.
                  </p>

                  {/* Stats row */}
                  <div className="flex gap-4 md:gap-8">
                    {[
                      { num: "$2.4M", label: "Ingresos", color: "text-indigo-400" },
                      { num: "340%", label: "ROI", color: "text-purple-400" },
                      { num: "99.9%", label: "Uptime", color: "text-cyan-400" },
                    ].map((stat, i) => (
                      <div key={i} data-animate className="text-center">
                        <div className={`text-lg md:text-2xl font-bold ${stat.color}`} style={{ fontFamily: "Bebas Neue, sans-serif" }}>{stat.num}</div>
                        <div className="text-white/25 text-[9px] md:text-[10px] font-medium uppercase tracking-wider">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection handles on "selected" element */}
                <div data-animate className="absolute top-[25%] left-[6%] right-[35%] bottom-[30%] border-2 border-purple-500/60 rounded pointer-events-none">
                  {["-top-1.5 -left-1.5", "-top-1.5 -right-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map((pos, j) => (
                    <div key={j} className={`absolute ${pos} w-2.5 h-2.5 rounded-sm bg-white border-2 border-purple-500`} />
                  ))}
                </div>
              </div>

              {/* Zoom indicator */}
              <div data-animate className="absolute bottom-3 right-3 flex items-center gap-1.5">
                <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-white/20 text-[10px] font-mono">55%</div>
                <div className="w-6 h-6 rounded bg-white/5 border border-white/5 flex items-center justify-center text-white/20 text-xs">+</div>
                <div className="w-6 h-6 rounded bg-white/5 border border-white/5 flex items-center justify-center text-white/20 text-xs">−</div>
              </div>

              {/* Scene name badge */}
              <div data-animate className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 border border-white/5">
                <span className="text-white/30 text-[10px] font-medium">Hero</span>
              </div>
            </div>

            {/* Right panel — Properties */}
            <div className="w-56 border-l border-white/5 bg-[#0f0f1a] p-3 shrink-0 hidden xl:block">
              {/* Tabs */}
              <div data-animate className="flex gap-1 mb-4">
                {["Diseno", "Animacion", "Transicion"].map((tab, i) => (
                  <div key={i} className={`px-2 py-1 rounded text-[9px] font-bold ${i === 0 ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-white/20"}`}>{tab}</div>
                ))}
              </div>

              {/* Properties */}
              <div className="space-y-3">
                <div data-animate>
                  <div className="text-white/20 text-[9px] font-bold uppercase tracking-wider mb-1.5">Posicion</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["X 140", "Y 300", "W 1000", "H 280"].map((v, i) => (
                      <div key={i} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-white/30 text-[10px] font-mono">{v}</div>
                    ))}
                  </div>
                </div>

                <div data-animate>
                  <div className="text-white/20 text-[9px] font-bold uppercase tracking-wider mb-1.5">Fuente</div>
                  <div className="px-2 py-1.5 rounded bg-white/5 border border-white/5 text-white/30 text-[10px]">DM Serif Display</div>
                </div>

                <div data-animate>
                  <div className="text-white/20 text-[9px] font-bold uppercase tracking-wider mb-1.5">Tamano</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 relative">
                      <div className="absolute left-0 top-0 h-full w-3/4 rounded-full bg-purple-500/50" />
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-purple-500" style={{ left: "75%" }} />
                    </div>
                    <span className="text-white/30 text-[10px] font-mono">88px</span>
                  </div>
                </div>

                <div data-animate>
                  <div className="text-white/20 text-[9px] font-bold uppercase tracking-wider mb-1.5">Animacion</div>
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300/70 text-[10px] font-medium flex items-center justify-between">
                      <span>cinematicZoom</span>
                      <span className="text-white/20">0.9s</span>
                    </div>
                    <div className="px-2 py-1.5 rounded bg-white/5 border border-white/5 text-white/25 text-[10px] flex items-center justify-center gap-1">
                      <span>+</span> Agregar
                    </div>
                  </div>
                </div>

                <div data-animate>
                  <div className="text-white/20 text-[9px] font-bold uppercase tracking-wider mb-1.5">Color</div>
                  <div className="flex gap-1.5">
                    {["#ffffff", "#a855f7", "#6366f1", "#ec4899", "#06b6d4", "#f59e0b"].map((c, i) => (
                      <div key={i} className={`w-5 h-5 rounded-full border ${i === 0 ? "border-purple-500" : "border-white/10"}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
