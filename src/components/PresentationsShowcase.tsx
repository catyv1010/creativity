"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-register";

registerGSAPPlugins();

// ─── 5 real presentation slide previews ──────────────────────────────────────

function SlidePitch() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0a2a 0%, #1a0e3a 50%, #0c1445 100%)" }}>
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)", filter: "blur(30px)" }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)", filter: "blur(20px)" }} />
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#a78bfa" }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Pitch 2025</span>
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3" style={{ fontFamily: "DM Serif Display, serif", textShadow: "0 0 40px rgba(124,58,237,0.4)" }}>
            Transformamos<br />el Futuro Digital
          </h3>
          <div className="w-14 h-1 rounded-full mb-4" style={{ background: "linear-gradient(90deg, #7c3aed, #818cf8)" }} />
          <p className="text-white/50 text-sm leading-relaxed max-w-md">Innovación tecnológica para empresas que quieren liderar su industria con soluciones de impacto.</p>
        </div>
        <div className="flex gap-8">
          {[{ v: "$2.4M", l: "INGRESOS", c: "#818cf8" }, { v: "340%", l: "ROI", c: "#a78bfa" }, { v: "99.9%", l: "UPTIME", c: "#38bdf8" }].map((s, i) => (
            <div key={i}>
              <div className="text-2xl font-black" style={{ color: s.c, fontFamily: "Bebas Neue, sans-serif" }}>{s.v}</div>
              <div className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideEducacion() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #001810 0%, #002018 50%, #001a15 100%)" }}>
      <div className="absolute -top-20 right-0 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(35px)" }} />
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.25)" }}>🔬</div>
            <span className="text-sm font-bold" style={{ color: "rgba(52,211,153,0.8)" }}>Biología Molecular · Unidad 3</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black mb-3 leading-tight" style={{ color: "#f0fff4", fontFamily: "DM Serif Display, serif" }}>
            La Doble Hélice<br />del ADN
          </h3>
          <div className="w-14 h-1 rounded-full mb-4" style={{ background: "linear-gradient(90deg, #34d399, #06b6d4)" }} />
          <p className="text-sm leading-relaxed" style={{ color: "rgba(240,255,244,0.5)" }}>Descubre la estructura que contiene toda la información genética del ser humano.</p>
        </div>
        <div className="flex gap-3">
          {["Núcleos", "Proteínas", "ARN", "Síntesis"].map((t, i) => (
            <div key={i} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideNeon() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #000a14 0%, #001020 100%)" }}>
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.03) 2px, rgba(6,182,212,0.03) 3px)" }} />
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #06b6d4, transparent)" }} />
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #ec4899, transparent)" }} />
      {/* Grid */}
      {[20, 40, 60, 80].map(p => <div key={p} className="absolute top-0 bottom-0 w-px" style={{ left: `${p}%`, background: "rgba(6,182,212,0.08)" }} />)}
      <div className="relative z-10 p-8 h-full flex flex-col justify-center gap-5">
        <div className="text-xs font-mono font-bold uppercase tracking-[0.3em]" style={{ color: "rgba(6,182,212,0.6)" }}>// SISTEMA NEURAL v4.2</div>
        <h3 className="text-4xl sm:text-5xl font-black" style={{ color: "#06b6d4", fontFamily: "Bebas Neue, sans-serif", textShadow: "0 0 30px rgba(6,182,212,0.6), 0 0 60px rgba(6,182,212,0.3)", letterSpacing: "0.05em" }}>
          CYBERPUNK<br /><span style={{ color: "#ec4899", textShadow: "0 0 30px rgba(236,72,153,0.6)" }}>NEURAL</span>
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #06b6d4, transparent)" }} />
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>ACTIVADO</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["SYS", "98%", "#06b6d4"], ["NET", "ONLINE", "#34d399"], ["CPU", "4.2GHz", "#ec4899"]].map(([k, v, c], i) => (
            <div key={i} className="p-2 rounded" style={{ background: `${c}10`, border: `1px solid ${c}30` }}>
              <div className="text-[9px] font-mono font-bold" style={{ color: `${c}80` }}>{k}</div>
              <div className="text-xs font-mono font-black" style={{ color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlidePortfolio() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0018 0%, #2d0030 50%, #1a001a 100%)" }}>
      <div className="absolute top-0 left-0 w-full h-full" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(244,114,182,0.2) 0%, transparent 60%)" }} />
      <div className="absolute -bottom-10 left-1/4 w-56 h-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(192,132,252,0.15) 0%, transparent 70%)", filter: "blur(30px)" }} />
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(244,114,182,0.7)" }}>Portfolio 2025</p>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "#fff0f8", fontFamily: "DM Serif Display, serif" }}>
              Arte que<br />habla solo
            </h3>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.2)" }}>✦</div>
        </div>
        <div className="space-y-2">
          <div className="w-14 h-1 rounded-full" style={{ background: "linear-gradient(90deg, #f472b6, #c084fc)" }} />
          <p className="text-sm" style={{ color: "rgba(255,240,248,0.5)" }}>Diseño, identidad visual y experiencias que trascienden lo ordinario.</p>
          <div className="flex gap-2 mt-3">
            {["Branding", "UI/UX", "Motion", "3D"].map((t, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.2)", color: "#f472b6" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideStartup() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0800 0%, #1a1000 100%)" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
      {[[15, 15], [82, 25], [88, 72], [8, 78], [50, 8], [25, 88]].map(([x, y], i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full animate-pulse" style={{ left: `${x}%`, top: `${y}%`, background: "#fb923c", opacity: 0.4 + i * 0.08 }} />
      ))}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.25)" }}>
            <span className="text-base">🚀</span>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(251,146,60,0.9)" }}>Series A · 2025</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3" style={{ fontFamily: "DM Serif Display, serif" }}>
            Del sueño al<br />mercado global
          </h3>
          <div className="w-14 h-1 rounded-full mb-4" style={{ background: "linear-gradient(90deg, #fb923c, #fbbf24)" }} />
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>La plataforma que conecta founders con inversores de impacto a escala mundial.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full self-start" style={{ background: "#fb923c", boxShadow: "0 0 30px rgba(251,146,60,0.5)" }}>
          <span className="text-black font-black text-sm">Lanzar Ahora</span>
          <span className="text-black font-bold">→</span>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { id: 0, Component: SlidePitch, label: "Pitch Deck", tag: "Negocios", accent: "#818cf8", textAccent: "#a78bfa" },
  { id: 1, Component: SlideEducacion, label: "Educación", tag: "Aprendizaje", accent: "#34d399", textAccent: "#6ee7b7" },
  { id: 2, Component: SlideNeon, label: "Neon Cyberpunk", tag: "Creativo", accent: "#06b6d4", textAccent: "#38bdf8" },
  { id: 3, Component: SlidePortfolio, label: "Portfolio", tag: "Arte", accent: "#f472b6", textAccent: "#f9a8d4" },
  { id: 4, Component: SlideStartup, label: "Startup Launch", tag: "Emprendimiento", accent: "#fb923c", textAccent: "#fdba74" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function PresentationsShowcase() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = SLIDES[active];
  const prev = SLIDES[(active - 1 + SLIDES.length) % SLIDES.length];
  const next = SLIDES[(active + 1) % SLIDES.length];

  // Auto-cycle every 3.5s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % SLIDES.length);
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goTo = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(i);
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % SLIDES.length);
    }, 3500);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030014 0%, #050018 100%)" }}
    >
      {/* Dynamic ambient glow that changes with active slide */}
      <motion.div
        key={active}
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${current.accent}12 0%, transparent 70%)`,
        }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: `${current.accent}40`, background: `${current.accent}10`, color: current.textAccent }}
            animate={{ borderColor: `${current.accent}40`, background: `${current.accent}10`, color: current.textAccent }}
            transition={{ duration: 0.6 }}
          >
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: current.accent }} animate={{ background: current.accent }} transition={{ duration: 0.6 }}
              initial={false} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Galería de presentaciones</span>
          </motion.div>

          <h2 className="font-[var(--font-display)] font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#f0e6ff" }}>
            Cada historia,
            <br />
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: `linear-gradient(135deg, ${current.accent}, ${current.textAccent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              un mundo diferente.
            </motion.span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(240,230,255,0.45)" }}>
            Desde pitches de inversión hasta clases interactivas, portfolios artísticos y lanzamientos de startups. Todo con animaciones cinematográficas.
          </p>
        </div>

        {/* 3-panel carousel */}
        <div className="flex items-center justify-center gap-4 lg:gap-6 mb-12">

          {/* Left preview (prev) */}
          <motion.div
            className="hidden md:block relative rounded-xl overflow-hidden cursor-pointer shrink-0"
            style={{ width: "22%", aspectRatio: "16/9" }}
            whileHover={{ scale: 1.03 }}
            onClick={() => goTo((active - 1 + SLIDES.length) % SLIDES.length)}
            animate={{ opacity: 0.45, scale: 0.9, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <prev.Component />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(5,0,24,0.6))" }} />
          </motion.div>

          {/* Center — active slide */}
          <div className="relative flex-1 max-w-2xl" style={{ aspectRatio: "16/9" }}>
            {/* Glow ring */}
            <motion.div
              key={`ring-${active}`}
              className="absolute -inset-1 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ background: `linear-gradient(135deg, ${current.accent}40, transparent, ${current.textAccent}30)`, borderRadius: "18px", padding: "2px" }}
            >
              <div className="absolute inset-0 rounded-2xl" style={{ background: "#030014" }} />
            </motion.div>

            <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9", boxShadow: `0 30px 80px ${current.accent}25, 0 0 0 1px ${current.accent}20` }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
                >
                  <current.Component />
                </motion.div>
              </AnimatePresence>

              {/* "Live" badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-20"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: current.accent }}
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Vista previa</span>
              </div>

              {/* Slide label bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 z-20"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{current.label}</p>
                    <p className="text-white/40 text-xs">{current.tag}</p>
                  </div>
                  <a href={`/cinema-editor?template=${['pitch-profesional', 'parallax-story', 'efectos-showcase', 'agencia-creativa', 'epic-reveal'][active]}`}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={{ background: current.accent, color: "#000" }}
                    onClick={e => e.stopPropagation()}>
                    Usar →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right preview (next) */}
          <motion.div
            className="hidden md:block relative rounded-xl overflow-hidden cursor-pointer shrink-0"
            style={{ width: "22%", aspectRatio: "16/9" }}
            whileHover={{ scale: 1.03 }}
            onClick={() => goTo((active + 1) % SLIDES.length)}
            animate={{ opacity: 0.45, scale: 0.9, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <next.Component />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to left, transparent, rgba(5,0,24,0.6))" }} />
          </motion.div>
        </div>

        {/* Dot indicators + labels */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <motion.div
                animate={{
                  width: i === active ? 32 : 8,
                  background: i === active ? s.accent : "rgba(255,255,255,0.15)",
                }}
                className="h-2 rounded-full transition-all"
              />
              <span className="text-[10px] font-semibold transition-all duration-300 hidden sm:block"
                style={{ color: i === active ? s.textAccent : "rgba(255,255,255,0.2)" }}>
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom strip — feature tags */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: "🎬", text: "8 transiciones cinemáticas", c: "#818cf8" },
            { icon: "✦", text: "20+ animaciones GSAP", c: "#c084fc" },
            { icon: "∞", text: "Canvas 2D / 3D infinito", c: "#38bdf8" },
            { icon: "🎮", text: "Quizzes interactivos", c: "#34d399" },
            { icon: "🚀", text: "Exportar a HTML / PDF", c: "#fb923c" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: `${f.c}10`, border: `1px solid ${f.c}25`, color: f.c }}
            >
              <span>{f.icon}</span>
              {f.text}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
