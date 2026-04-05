"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const CATEGORIES = ["Todos", "Negocios", "Educación", "Creativo", "Portfolio"];

/* ─── Animated Preview Components ─────────────────────────── */

function PreviewPitchDeck() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #0d0020 0%, #1a0040 100%)" }}>
      {/* Moving orbs */}
      <motion.div className="absolute rounded-full"
        style={{ width: 180, height: 180, top: -40, right: -40, background: "radial-gradient(circle, rgba(192,132,252,0.35) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute rounded-full"
        style={{ width: 120, height: 120, bottom: 10, left: 10, background: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.5, 1], x: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

      {/* Animated bar chart */}
      <div className="absolute bottom-8 left-5 flex items-end gap-2">
        {[38, 55, 72, 65, 85].map((h, i) => (
          <motion.div key={i} className="w-5 rounded-t-sm"
            style={{ background: ["#c084fc", "#818cf8", "#38bdf8", "#34d399", "#c084fc"][i], opacity: 0.85 }}
            initial={{ height: 0 }}
            animate={{ height: h }}
            transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "backOut", repeat: Infinity, repeatDelay: 3, repeatType: "reverse" }} />
        ))}
      </div>

      {/* Floating line */}
      <motion.div className="absolute top-8 left-5 h-px"
        style={{ background: "linear-gradient(90deg, #c084fc, transparent)", width: 120 }}
        animate={{ width: [60, 140, 60], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute top-12 left-5 h-px w-20 opacity-30" style={{ background: "#818cf8" }} />

      {/* Stat boxes */}
      <motion.div className="absolute top-7 right-5 px-3 py-1.5 rounded-lg text-[10px] font-bold"
        style={{ background: "rgba(192,132,252,0.15)", border: "1px solid rgba(192,132,252,0.3)", color: "#c084fc" }}
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}>
        +128%
      </motion.div>

      {/* Floating particles */}
      {[{ x: "20%", y: "40%", c: "#c084fc" }, { x: "70%", y: "60%", c: "#38bdf8" }, { x: "45%", y: "25%", c: "#34d399" }].map((p, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full"
          style={{ left: p.x, top: p.y, background: p.c }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.9, 0.3], scale: [1, 1.8, 1] }}
          transition={{ duration: 2.5 + i * 0.7, repeat: Infinity, delay: i * 0.5 }} />
      ))}
    </div>
  );
}

function PreviewNeonCyberpunk() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #000a1a 0%, #001020 100%)" }}>
      {/* Scanline effect */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(6,182,212,0.03) 3px, rgba(6,182,212,0.03) 4px)" }} />

      {/* Animated grid lines */}
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i} className="absolute top-0 bottom-0 w-px"
          style={{ left: `${20 + i * 22}%`, background: "rgba(6,182,212,0.2)" }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
      ))}
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute left-0 right-0 h-px"
          style={{ top: `${25 + i * 25}%`, background: "rgba(6,182,212,0.2)" }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }} />
      ))}

      {/* Neon title bar */}
      <motion.div className="absolute top-6 left-5 h-3 rounded"
        style={{ background: "#06b6d4", boxShadow: "0 0 12px #06b6d4, 0 0 24px rgba(6,182,212,0.5)" }}
        animate={{ width: [80, 140, 80] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-12 left-5 h-2 rounded"
        style={{ background: "#ec4899", boxShadow: "0 0 8px #ec4899" }}
        animate={{ width: [50, 110, 50] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />

      {/* Glowing corner boxes */}
      {[
        { x: 10, y: 45, c: "#06b6d4" },
        { x: 105, y: 45, c: "#ec4899" },
        { x: 210, y: 45, c: "#a855f7" },
      ].map((b, i) => (
        <motion.div key={i} className="absolute rounded"
          style={{ left: b.x, top: b.y, width: 80, height: 70, border: `1px solid ${b.c}`, boxShadow: `0 0 10px ${b.c}40` }}
          animate={{ boxShadow: [`0 0 6px ${b.c}30`, `0 0 18px ${b.c}80`, `0 0 6px ${b.c}30`] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }} />
      ))}

      {/* Moving data line */}
      <motion.svg className="absolute bottom-6 left-5" width="280" height="30" viewBox="0 0 280 30">
        <motion.path d="M 0 20 Q 50 5 100 18 T 200 12 T 280 20"
          fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7"
          strokeDasharray="280"
          animate={{ strokeDashoffset: [280, 0, -280] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      </motion.svg>
    </div>
  );
}

function PreviewEducacion() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #001510 0%, #001a15 100%)" }}>
      {/* Floating orb */}
      <motion.div className="absolute rounded-full"
        style={{ width: 200, height: 200, top: -60, right: -60, background: "radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ scale: { duration: 6, repeat: Infinity }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }} />

      {/* Progress bar animated */}
      <div className="absolute top-8 left-5 right-5">
        <div className="text-[9px] font-bold mb-1" style={{ color: "rgba(52,211,153,0.7)" }}>Progreso del curso</div>
        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #34d399, #06b6d4)" }}
            animate={{ width: ["20%", "75%", "20%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>

      {/* Floating subject cards */}
      {[
        { top: 55, left: 8, emoji: "📐", label: "Álgebra", c: "#34d399", delay: 0 },
        { top: 55, left: 108, emoji: "🧬", label: "Biología", c: "#38bdf8", delay: 0.3 },
        { top: 55, left: 208, emoji: "🔭", label: "Física", c: "#c084fc", delay: 0.6 },
      ].map((card, i) => (
        <motion.div key={i} className="absolute rounded-lg flex flex-col items-center justify-center gap-1"
          style={{ top: card.top, left: card.left, width: 88, height: 90, background: "rgba(255,255,255,0.03)", border: `1px solid ${card.c}25` }}
          animate={{ y: [0, -6, 0], borderColor: [`${card.c}25`, `${card.c}60`, `${card.c}25`] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: card.delay }}>
          <span style={{ fontSize: 22 }}>{card.emoji}</span>
          <span className="text-[9px] font-semibold" style={{ color: card.c }}>{card.label}</span>
        </motion.div>
      ))}

      {/* Stars / achievement */}
      <motion.div className="absolute bottom-5 right-5 flex gap-1"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        {["★", "★", "★"].map((s, i) => (
          <span key={i} style={{ color: "#fbbf24", fontSize: 14, textShadow: "0 0 8px #fbbf24" }}>{s}</span>
        ))}
      </motion.div>
    </div>
  );
}

function PreviewPortfolio() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0010 0%, #2d0020 100%)" }}>
      {/* Shifting gradient wash */}
      <motion.div className="absolute inset-0"
        animate={{ background: [
          "radial-gradient(ellipse at 30% 40%, rgba(244,114,182,0.2) 0%, transparent 60%)",
          "radial-gradient(ellipse at 70% 60%, rgba(192,132,252,0.2) 0%, transparent 60%)",
          "radial-gradient(ellipse at 30% 40%, rgba(244,114,182,0.2) 0%, transparent 60%)",
        ]}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      {/* Artwork frame */}
      <motion.div className="absolute rounded-xl overflow-hidden"
        style={{ top: 12, left: 12, width: 160, height: 145, background: "rgba(244,114,182,0.07)", border: "1px solid rgba(244,114,182,0.2)" }}
        animate={{ borderColor: ["rgba(244,114,182,0.2)", "rgba(244,114,182,0.5)", "rgba(244,114,182,0.2)"] }}
        transition={{ duration: 4, repeat: Infinity }}>
        {/* Abstract art inside */}
        <motion.div className="absolute rounded-full"
          style={{ width: 80, height: 80, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(244,114,182,0.4) 0%, rgba(192,132,252,0.2) 50%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute inset-0 flex items-center justify-center text-3xl"
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
          ✦
        </motion.div>
      </motion.div>

      {/* Sidebar tags */}
      <div className="absolute top-12 right-5 flex flex-col gap-2">
        {[
          { label: "UI Design", c: "#f472b6" },
          { label: "Branding", c: "#c084fc" },
          { label: "Motion", c: "#818cf8" },
        ].map((t, i) => (
          <motion.div key={i} className="px-2 py-1 rounded text-[9px] font-bold"
            style={{ background: `${t.c}15`, border: `1px solid ${t.c}30`, color: t.c }}
            animate={{ opacity: [0.5, 1, 0.5], x: [0, 3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}>
            {t.label}
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div className="absolute bottom-6 right-5 px-3 py-1.5 rounded-full text-[10px] font-bold"
        style={{ background: "#f472b6", color: "#fff", boxShadow: "0 0 12px rgba(244,114,182,0.5)" }}
        animate={{ boxShadow: ["0 0 8px rgba(244,114,182,0.4)", "0 0 20px rgba(244,114,182,0.8)", "0 0 8px rgba(244,114,182,0.4)"] }}
        transition={{ duration: 2, repeat: Infinity }}>
        Ver Portfolio →
      </motion.div>
    </div>
  );
}

function PreviewStartup() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0800 0%, #1a0e00 100%)" }}>
      {/* Radial burst from center */}
      <motion.div className="absolute rounded-full"
        style={{ width: 300, height: 300, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [0.8, 1.4, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

      {/* Rocket with trail */}
      <motion.div className="absolute text-4xl select-none"
        style={{ left: "50%", top: "30%", transform: "translateX(-50%)" }}
        animate={{ y: [0, -15, 0], filter: ["drop-shadow(0 0 0px #fb923c)", "drop-shadow(0 0 16px #fb923c)", "drop-shadow(0 0 0px #fb923c)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        🚀
      </motion.div>

      {/* Particle trail */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: 3 + i * 0.5, height: 3 + i * 0.5,
            left: `${42 + (i % 3) * 5}%`,
            top: `${55 + i * 5}%`,
            background: ["#fb923c", "#fbbf24", "#f472b6"][i % 3],
          }}
          animate={{ y: [0, 20, 0], opacity: [0.8, 0, 0.8], scale: [1, 0.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
      ))}

      {/* CTA */}
      <motion.div className="absolute bottom-7 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-[11px] font-bold whitespace-nowrap"
        style={{ background: "#fb923c", color: "#000", boxShadow: "0 0 20px rgba(251,146,60,0.6)" }}
        animate={{ scale: [1, 1.04, 1], boxShadow: ["0 0 12px rgba(251,146,60,0.5)", "0 0 28px rgba(251,146,60,0.9)", "0 0 12px rgba(251,146,60,0.5)"] }}
        transition={{ duration: 2, repeat: Infinity }}>
        Lanzar Ahora →
      </motion.div>

      {/* Stars */}
      {[[15, 15], [82, 25], [88, 70], [8, 75], [50, 8], [25, 88]].map(([x, y], i) => (
        <motion.div key={i} className="absolute rounded-full w-1.5 h-1.5"
          style={{ left: `${x}%`, top: `${y}%`, background: "#fb923c" }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.8, 1] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }} />
      ))}
    </div>
  );
}

function PreviewMinimalista() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #08081a 0%, #0d0d20 100%)" }}>
      {/* Subtle shifting gradient */}
      <motion.div className="absolute inset-0"
        animate={{ background: [
          "radial-gradient(ellipse at 20% 50%, rgba(129,140,248,0.08) 0%, transparent 60%)",
          "radial-gradient(ellipse at 80% 50%, rgba(129,140,248,0.12) 0%, transparent 60%)",
          "radial-gradient(ellipse at 20% 50%, rgba(129,140,248,0.08) 0%, transparent 60%)",
        ]}}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />

      {/* Vertical accent line */}
      <motion.div className="absolute top-6 bottom-6 w-px"
        style={{ left: 32, background: "#818cf8" }}
        animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity }} />

      {/* Animated text lines */}
      {[
        { w: "55%", y: 28, o: 0.85, c: "#f0e6ff" },
        { w: "42%", y: 46, o: 0.35, c: "#818cf8" },
        { w: "65%", y: 72, o: 0.2, c: "#f0e6ff" },
        { w: "50%", y: 88, o: 0.15, c: "#f0e6ff" },
        { w: "58%", y: 104, o: 0.12, c: "#f0e6ff" },
      ].map((l, i) => (
        <motion.div key={i} className="absolute h-2 rounded-full"
          style={{ left: 48, top: l.y, width: l.w, background: l.c, opacity: l.o }}
          animate={{ width: [l.w, `calc(${l.w} + 20px)`, l.w] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
      ))}

      {/* Large ghost letter */}
      <motion.div className="absolute font-black select-none pointer-events-none"
        style={{ fontSize: 110, bottom: -10, right: 10, color: "rgba(129,140,248,0.05)", fontFamily: "var(--font-display)", lineHeight: 1 }}
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 5, repeat: Infinity }}>
        M
      </motion.div>

      {/* Orbiting circle */}
      <motion.div className="absolute rounded-full border"
        style={{ width: 50, height: 50, bottom: 16, right: 16, borderColor: "rgba(129,140,248,0.3)" }}
        animate={{ rotate: 360, borderColor: ["rgba(129,140,248,0.2)", "rgba(129,140,248,0.6)", "rgba(129,140,248,0.2)"] }}
        transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" }, borderColor: { duration: 3, repeat: Infinity } }} />
    </div>
  );
}

const TEMPLATES = [
  { name: "Pitch Deck", category: "Negocios", badge: "Popular", badgeColor: "#c084fc", accent: "#c084fc", Preview: PreviewPitchDeck, href: "/cinema-editor?template=pitch-profesional" },
  { name: "Neon Cyberpunk", category: "Creativo", badge: "Futurista", badgeColor: "#06b6d4", accent: "#06b6d4", Preview: PreviewNeonCyberpunk, href: "/cinema-editor?template=efectos-showcase" },
  { name: "Educación Moderna", category: "Educación", badge: "Nuevo", badgeColor: "#34d399", accent: "#34d399", Preview: PreviewEducacion, href: "/cinema-editor?template=parallax-story" },
  { name: "Portfolio Artista", category: "Portfolio", badge: "Premium", badgeColor: "#f472b6", accent: "#f472b6", Preview: PreviewPortfolio, href: "/cinema-editor?template=agencia-creativa" },
  { name: "Startup Launch", category: "Negocios", badge: "Hot", badgeColor: "#fb923c", accent: "#fb923c", Preview: PreviewStartup, href: "/cinema-editor?template=epic-reveal" },
  { name: "Minimalista Pro", category: "Creativo", badge: "Elegante", badgeColor: "#818cf8", accent: "#818cf8", Preview: PreviewMinimalista, href: "/cinema-editor?template=noir-spotlight" },
];

export default function Templates() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = activeCategory === "Todos"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <section id="templates" ref={ref} className="relative py-32 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030014 0%, #050020 50%, #030014 100%)" }}>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(129,140,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(129,140,248,0.25)", background: "rgba(129,140,248,0.07)", color: "#818cf8" }}>
            <motion.div className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#818cf8" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Galería de plantillas</span>
          </div>

          <h2 className="font-[var(--font-display)] font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0e6ff" }}>
            Empieza con estilo.
            <br />
            <span style={{
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Termina impresionando.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "rgba(240,230,255,0.45)" }}>
            Cada plantilla tiene fondo animado, transiciones y paleta de color lista para usar.
          </p>

          {/* Category filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300"
                style={activeCategory === cat ? {
                  background: "linear-gradient(135deg, #818cf8, #c084fc)",
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(129,140,248,0.4)",
                } : {
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(240,230,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.19, 1, 0.22, 1] }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
              style={{
                border: hovered === i ? `1px solid ${t.accent}50` : "1px solid rgba(255,255,255,0.06)",
                boxShadow: hovered === i
                  ? `0 20px 60px ${t.accent}25, 0 0 0 1px ${t.accent}20`
                  : "0 4px 24px rgba(0,0,0,0.4)",
                transform: hovered === i ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
              }}
            >
              {/* Animated preview */}
              <div className="aspect-[16/10] relative overflow-hidden">
                <t.Preview />
                {/* Hover overlay with CTA */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ background: hovered === i ? `rgba(0,0,0,0.45)` : "rgba(0,0,0,0)" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ opacity: hovered === i ? 1 : 0, scale: hovered === i ? 1 : 0.8, y: hovered === i ? 0 : 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <a href={t.href} className="px-5 py-2.5 rounded-full text-sm font-bold inline-block"
                      style={{ background: t.accent, color: "#000" }}>
                      Usar plantilla →
                    </a>
                  </motion.div>
                </motion.div>
              </div>

              {/* Card footer */}
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${t.accent}15`, background: "rgba(3,0,20,0.8)" }}>
                <div>
                  <div className="font-[var(--font-display)] font-bold text-sm" style={{ color: "#f0e6ff" }}>{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(240,230,255,0.35)" }}>{t.category}</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: `${t.badgeColor}15`, color: t.badgeColor, border: `1px solid ${t.badgeColor}30` }}>
                  {t.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <a href="/cinema-editor"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:-translate-y-1"
            style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.25)", color: "#818cf8" }}>
            <span>Explorar todas las plantillas</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="mt-4 text-xs" style={{ color: "rgba(240,230,255,0.25)" }}>
            Más de 20 plantillas disponibles · Nuevas cada semana
          </p>
        </motion.div>
      </div>
    </section>
  );
}
