"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const slides = [
  // SLIDE 1 — Title
  {
    bg: "bg-[#fdf6ee]",
    render: () => (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Watercolor blobs */}
        <motion.div className="absolute w-[500px] h-[500px] rounded-full opacity-20 top-[-15%] right-[-10%]"
          style={{ background: "radial-gradient(circle, #f9a8d4, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }} transition={{ duration: 12, repeat: Infinity }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full opacity-15 bottom-[-10%] left-[-5%]"
          style={{ background: "radial-gradient(circle, #93c5fd, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 0] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute w-[300px] h-[300px] rounded-full opacity-10 top-[30%] left-[20%]"
          style={{ background: "radial-gradient(circle, #86efac, transparent 70%)" }}
          animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity }} />

        {/* Floating petals */}
        {[
          { x: "15%", y: "20%", r: 15, s: 8, c: "#f9a8d4" },
          { x: "75%", y: "15%", r: -20, s: 12, c: "#93c5fd" },
          { x: "85%", y: "70%", r: 30, s: 10, c: "#fcd34d" },
          { x: "10%", y: "75%", r: -10, s: 14, c: "#86efac" },
        ].map((p, i) => (
          <motion.div key={i} className="absolute w-4 h-6 rounded-full opacity-20" style={{ left: p.x, top: p.y, background: p.c, rotate: `${p.r}deg` }}
            animate={{ y: [0, -15, 0], rotate: [p.r, p.r + 20, p.r], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: p.s, repeat: Infinity, delay: i * 1.5 }} />
        ))}

        <div className="relative z-10 text-center px-8">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-rose-400/50 text-sm tracking-[0.4em] uppercase mb-8 font-light">Portfolio Creativo</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="text-6xl sm:text-8xl md:text-[9rem] font-[900] leading-[0.85] tracking-tight text-[#2d1b3d]">
            Beau<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">tifu</span>l
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 mx-auto w-24 h-0.5 rounded-full bg-gradient-to-r from-rose-300 via-purple-300 to-blue-300" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="text-[#2d1b3d]/30 text-lg mt-6 font-light">Donde el arte encuentra su voz</motion.p>
        </div>
      </div>
    ),
  },
  // SLIDE 2 — About
  {
    bg: "bg-[#fdf6ee]",
    render: () => (
      <div className="relative w-full h-full flex items-center overflow-hidden px-12">
        <motion.div className="absolute w-[350px] h-[350px] rounded-full opacity-15 -top-[10%] right-[20%]"
          style={{ background: "radial-gradient(circle, #c4b5fd, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />

        <div className="relative z-10 grid grid-cols-2 gap-16 w-full items-center">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-purple-400/50 text-xs tracking-[0.4em] uppercase mb-4 font-light">Sobre nosotros</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="text-4xl sm:text-5xl font-[900] text-[#2d1b3d] leading-tight mb-6">
              Creamos con<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">el corazon</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="text-[#2d1b3d]/30 text-sm leading-relaxed max-w-sm">
              Cada proyecto es una pincelada. Cada idea, un lienzo en blanco esperando cobrar vida con colores que cuentan historias.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }}
            className="aspect-[3/4] rounded-3xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #fce4ec 0%, #e1bee7 30%, #b2dfdb 60%, #fff9c4 100%)" }}>
            {/* Abstract watercolor art */}
            <motion.div className="absolute w-[60%] h-[40%] rounded-full top-[15%] left-[20%] opacity-30"
              style={{ background: "radial-gradient(circle, #f472b6, transparent 70%)" }}
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} />
            <motion.div className="absolute w-[40%] h-[30%] rounded-full bottom-[20%] right-[15%] opacity-25"
              style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }}
              animate={{ x: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity }} />
          </motion.div>
        </div>
      </div>
    ),
  },
  // SLIDE 3 — Services
  {
    bg: "bg-[#fdf6ee]",
    render: () => (
      <div className="relative w-full h-full flex flex-col justify-center px-12 overflow-hidden">
        <motion.div className="absolute w-[400px] h-[400px] rounded-full opacity-10 bottom-[-15%] left-[-5%]"
          style={{ background: "radial-gradient(circle, #fcd34d, transparent 70%)" }} />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-amber-500/40 text-xs tracking-[0.4em] uppercase mb-6 font-light">Servicios</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl font-[900] text-[#2d1b3d] mb-12">Lo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">hacemos</span></motion.h2>
          <div className="grid grid-cols-3 gap-6">
            {[{ t: "Identidad Visual", d: "Logos, paletas, tipografia" },
              { t: "Ilustracion", d: "Arte digital y tradicional" },
              { t: "Branding", d: "Estrategia de marca completa" }].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 hover:border-rose-200 transition-all duration-500 group">
                <div className="w-10 h-10 rounded-xl mb-4 bg-gradient-to-br from-rose-200 to-purple-200 group-hover:scale-110 transition-transform" />
                <div className="text-[#2d1b3d] text-base font-bold mb-1">{s.t}</div>
                <div className="text-[#2d1b3d]/25 text-xs">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // SLIDE 4 — Contact
  {
    bg: "bg-[#fdf6ee]",
    render: () => (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "conic-gradient(from 0deg, #f9a8d4, #93c5fd, #86efac, #fcd34d, #f9a8d4)" }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity } }} />
        <div className="relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 1 }}
            className="text-5xl sm:text-7xl font-[900] text-[#2d1b3d] mb-4">
            Hable<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">mos</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-[#2d1b3d]/30 mb-10 text-lg font-light">Cada gran proyecto empieza con una conversacion</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 text-white font-bold hover:shadow-[0_10px_40px_rgba(244,114,182,0.3)] transition-all cursor-pointer hover:scale-105">
            Contactar →
          </motion.div>
        </div>
      </div>
    ),
  },
];

export default function WatercolorTemplate() {
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => { if (!isAuto) return; const t = setInterval(next, 6000); return () => clearInterval(t); }, [isAuto, next]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "ArrowRight") { next(); setIsAuto(false); } if (e.key === "ArrowLeft") { prev(); setIsAuto(false); } if (e.key === "Escape") window.history.back(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  return (
    <div className="fixed inset-0 bg-[#fdf6ee]">
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className={`absolute inset-0 ${slides[current].bg}`}>
          {slides[current].render()}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 z-50">
        {slides.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); setIsAuto(false); }}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === current ? "bg-rose-400 scale-125" : "bg-[#2d1b3d]/10 hover:bg-[#2d1b3d]/20"}`} />
        ))}
      </div>
      <button onClick={() => { prev(); setIsAuto(false); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#2d1b3d]/5 hover:bg-[#2d1b3d]/10 flex items-center justify-center text-[#2d1b3d]/30 hover:text-[#2d1b3d]/60 transition-all z-50">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={() => { next(); setIsAuto(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#2d1b3d]/5 hover:bg-[#2d1b3d]/10 flex items-center justify-center text-[#2d1b3d]/30 hover:text-[#2d1b3d]/60 transition-all z-50">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
      </button>
      <a href="/" className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-[#2d1b3d]/5 hover:bg-[#2d1b3d]/10 text-[#2d1b3d]/30 hover:text-[#2d1b3d]/60 text-xs font-bold transition-all">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver
      </a>
      <div className="absolute top-4 right-4 z-50 text-[#2d1b3d]/15 text-xs font-mono">{String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</div>
    </div>
  );
}
