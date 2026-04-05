"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const slides = [
  // SLIDE 1 — Title
  {
    bg: "bg-black",
    render: () => (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Neon grid floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%]" style={{
          background: "linear-gradient(transparent 0%, rgba(6,182,212,0.03) 40%)",
          backgroundImage: "linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 40px",
          transform: "perspective(500px) rotateX(45deg)",
          transformOrigin: "bottom",
        }} />
        {/* Glow orbs */}
        <motion.div className="absolute w-[400px] h-[400px] rounded-full bg-cyan/10 blur-[120px] top-[10%] left-[10%]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute w-[300px] h-[300px] rounded-full bg-magenta/10 blur-[100px] bottom-[10%] right-[10%]"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }} />
        {/* Horizontal neon lines */}
        <motion.div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.div className="absolute bottom-[25%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-magenta/30 to-transparent"
          animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />

        <div className="relative z-10 text-center px-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-cyan/60 text-sm font-mono uppercase tracking-[0.5em] mb-6">// Proyecto 2026</motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="text-6xl sm:text-8xl md:text-[10rem] font-[900] leading-[0.85] tracking-tighter text-white"
            style={{ textShadow: "0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(6,182,212,0.2)" }}>
            NEON<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-purple to-magenta">FUTURE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="text-white/30 text-lg mt-8 font-light max-w-md mx-auto">La tecnologia del manana, presentada hoy.</motion.p>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-8 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
        </div>
      </div>
    ),
  },
  // SLIDE 2 — Stats
  {
    bg: "bg-black",
    render: () => (
      <div className="relative w-full h-full flex flex-col justify-center px-12 overflow-hidden">
        <motion.div className="absolute w-[500px] h-[500px] rounded-full bg-purple/5 blur-[100px] -top-[20%] -right-[10%]"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="text-cyan/50 text-xs font-mono uppercase tracking-[0.4em] mb-8">// Metricas clave</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="text-4xl sm:text-6xl font-[900] text-white mb-12">Los numeros<br /><span className="text-cyan">hablan.</span></motion.h2>
          <div className="grid grid-cols-3 gap-8">
            {[{ n: "98%", l: "Engagement", d: 0.6 }, { n: "3.2M", l: "Usuarios activos", d: 0.8 }, { n: "150+", l: "Paises", d: 1 }].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.d, ease: [0.19, 1, 0.22, 1] }}
                className="border border-cyan/10 rounded-xl p-6 bg-cyan/[0.02]">
                <div className="text-4xl sm:text-5xl font-[900] text-white mb-2" style={{ textShadow: "0 0 20px rgba(6,182,212,0.3)" }}>{s.n}</div>
                <div className="text-white/30 text-sm">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // SLIDE 3 — Features
  {
    bg: "bg-black",
    render: () => (
      <div className="relative w-full h-full flex items-center overflow-hidden">
        <motion.div className="absolute w-[300px] h-[300px] rounded-full bg-magenta/8 blur-[80px] top-[20%] left-[5%]"
          animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} />
        <div className="relative z-10 grid grid-cols-2 gap-8 px-12 w-full">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-magenta/50 text-xs font-mono uppercase tracking-[0.4em] mb-6">// Caracteristicas</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl font-[900] text-white leading-tight mb-6">
              Construido para<br /><span className="text-magenta">el futuro</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/25 text-sm leading-relaxed max-w-sm">
              Cada componente diseñado con precision. Cada interaccion pensada para impactar.
            </motion.p>
          </div>
          <div className="space-y-4">
            {[{ t: "Velocidad extrema", d: "Renderizado en tiempo real a 120fps" },
              { t: "IA integrada", d: "Genera contenido con inteligencia artificial" },
              { t: "Sin limites", d: "Canvas infinito para ideas infinitas" },
              { t: "Colaboracion", d: "Edita en equipo en tiempo real" }].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15, ease: [0.19, 1, 0.22, 1] }}
                className="p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:border-cyan/20 hover:bg-cyan/[0.03] transition-all duration-500 group">
                <div className="text-white text-sm font-bold mb-1 group-hover:text-cyan transition-colors">{f.t}</div>
                <div className="text-white/20 text-xs">{f.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // SLIDE 4 — CTA
  {
    bg: "bg-black",
    render: () => (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
          style={{ background: "conic-gradient(from 0deg, #06b6d4, #a855f7, #ec4899, #06b6d4)" }}
          animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        <div className="relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-[900] text-white mb-6" style={{ textShadow: "0 0 60px rgba(168,85,247,0.3)" }}>
            El futuro es<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-purple to-magenta">ahora.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-white/30 mb-10 text-lg">¿Listo para crear algo extraordinario?</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="inline-block px-10 py-4 rounded-full border border-cyan/30 text-white font-bold hover:bg-cyan/10 transition-all cursor-pointer"
            style={{ boxShadow: "0 0 30px rgba(6,182,212,0.15)" }}>
            Comenzar →
          </motion.div>
        </div>
      </div>
    ),
  },
];

const transitions = [
  { initial: { opacity: 0, scale: 1.1, filter: "blur(10px)" }, animate: { opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { opacity: 0, scale: 0.9, filter: "blur(10px)" } },
  { initial: { opacity: 0, x: "100%" }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: "-100%" } },
  { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 }, exit: { opacity: 0, rotateY: -90 } },
  { initial: { opacity: 0, clipPath: "circle(0% at 50% 50%)" }, animate: { opacity: 1, clipPath: "circle(100% at 50% 50%)" }, exit: { opacity: 0, clipPath: "circle(0% at 50% 50%)" } },
];

export default function NeonCyberpunkTemplate() {
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (!isAuto) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [isAuto, next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { next(); setIsAuto(false); }
      if (e.key === "ArrowLeft") { prev(); setIsAuto(false); }
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const t = transitions[current % transitions.length];

  return (
    <div className="fixed inset-0 bg-black" style={{ perspective: "1200px" }}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={t.initial} animate={t.animate} exit={t.exit}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className={`absolute inset-0 ${slides[current].bg}`}>
          {slides[current].render()}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 z-50">
        {slides.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); setIsAuto(false); }}
            className={`w-8 h-1 rounded-full transition-all duration-500 ${i === current ? "bg-cyan w-12" : "bg-white/15 hover:bg-white/30"}`} />
        ))}
      </div>

      {/* Nav arrows */}
      <button onClick={() => { prev(); setIsAuto(false); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-50">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={() => { next(); setIsAuto(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-50">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Back button */}
      <a href="/" className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs font-bold transition-all">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver
      </a>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 z-50 text-white/20 text-xs font-mono">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </div>
  );
}
