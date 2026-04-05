"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGSAPPlugins } from "@/lib/gsap-register";

registerGSAPPlugins();

/* ─── Rich slide scenes ─────────────────────────────────────── */

function ScenePitch() {
  return (
    <div className="absolute inset-0 flex overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d0025 0%, #120040 50%, #0a001a 100%)" }}>
      {/* BG orbs */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 400, height: 400, top: -100, right: -100, background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 250, height: 250, bottom: -60, left: -60, background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

      {/* Left panel — content */}
      <div className="flex flex-col justify-center pl-10 pr-4 flex-1 relative z-10">
        <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 w-fit"
          style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)" }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-purple-300 text-[10px] font-bold uppercase tracking-widest">Pitch 2025</span>
        </motion.div>
        <motion.h2 className="font-bold leading-tight mb-4"
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)", color: "#fff", fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Transformamos el<br />
          <span style={{ color: "#a855f7" }}>Futuro Digital</span>
        </motion.h2>
        <motion.div className="h-0.5 w-16 mb-4 rounded-full"
          style={{ background: "linear-gradient(90deg, #a855f7, #06b6d4)" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }} />
        <motion.p className="text-sm mb-6 leading-relaxed max-w-[280px]"
          style={{ color: "rgba(255,255,255,0.45)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Innovación tecnológica para empresas que quieren liderar su industria con soluciones de impacto.
        </motion.p>

        {/* Stats row */}
        <motion.div className="flex gap-6"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          {[{ n: "$2.4M", l: "Ingresos", c: "#a855f7" }, { n: "340%", l: "ROI", c: "#06b6d4" }, { n: "99.9%", l: "Uptime", c: "#34d399" }].map((s, i) => (
            <div key={i}>
              <div className="font-black text-xl" style={{ color: s.c, fontFamily: "var(--font-display)" }}>{s.n}</div>
              <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — visual chart */}
      <div className="w-[38%] flex flex-col justify-center items-center relative z-10 pr-6 gap-3">
        {/* Bar chart */}
        <motion.div className="flex items-end gap-2 h-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {[45, 65, 52, 80, 72, 95].map((h, i) => (
            <motion.div key={i} className="w-6 rounded-t-sm"
              style={{ background: `linear-gradient(to top, rgba(168,85,247,0.5), rgba(168,85,247,0.9))` }}
              initial={{ height: 0 }}
              animate={{ height: h }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.6, ease: "backOut" }} />
          ))}
        </motion.div>
        {/* Glowing circle */}
        <motion.div className="rounded-full flex items-center justify-center"
          style={{ width: 80, height: 80, background: "conic-gradient(from 0deg, #a855f7, #06b6d4, #34d399, #a855f7)" }}
          animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 60, height: 60, background: "#0d0025" }}>
            <span className="text-white font-black text-lg" style={{ fontFamily: "var(--font-display)" }}>95%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ScenePortfolio() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0020 0%, #1a0035 50%, #050010 100%)" }}>
      <motion.div className="absolute inset-0"
        animate={{ background: [
          "radial-gradient(ellipse at 30% 50%, rgba(244,114,182,0.15) 0%, transparent 60%)",
          "radial-gradient(ellipse at 70% 50%, rgba(192,132,252,0.15) 0%, transparent 60%)",
          "radial-gradient(ellipse at 30% 50%, rgba(244,114,182,0.15) 0%, transparent 60%)",
        ]}}
        transition={{ duration: 5, repeat: Infinity }} />

      {/* Big text layout */}
      <div className="absolute inset-0 flex flex-col justify-center pl-10 pr-6 z-10">
        <motion.div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
          style={{ color: "rgba(244,114,182,0.6)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Diseño Visual · 2025
        </motion.div>
        <motion.h2 className="font-black leading-none mb-6"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <span style={{ color: "#fff" }}>Ana</span>
          <br />
          <span style={{ color: "#f472b6", textShadow: "0 0 40px rgba(244,114,182,0.5)" }}>García</span>
        </motion.h2>

        <div className="flex gap-3 flex-wrap">
          {["UI Design", "Branding", "Motion", "3D"].map((tag, i) => (
            <motion.span key={i} className="px-3 py-1 rounded-full text-[11px] font-bold"
              style={{ background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.3)", color: "#f472b6" }}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}>
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Floating geometric shapes */}
      <motion.div className="absolute top-8 right-12 rounded-2xl"
        style={{ width: 120, height: 120, background: "linear-gradient(135deg, rgba(244,114,182,0.3), rgba(192,132,252,0.2))", border: "1px solid rgba(244,114,182,0.3)" }}
        animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-10 right-24 rounded-full"
        style={{ width: 60, height: 60, background: "rgba(192,132,252,0.2)", border: "1px solid rgba(192,132,252,0.4)" }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
      <motion.div className="absolute top-1/2 right-6"
        style={{ width: 2, height: 160, background: "linear-gradient(to bottom, transparent, #f472b6, transparent)", transform: "translateY(-50%)" }}
        animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
    </div>
  );
}

function SceneData() {
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #000d1a 0%, #001228 100%)" }}>
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <motion.div className="absolute rounded-full"
        style={{ width: 350, height: 350, top: -80, right: -80, background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity }} />

      <div className="absolute inset-0 flex flex-col justify-center pl-10 z-10">
        <motion.div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2"
          style={{ color: "#06b6d4" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Dashboard en vivo
        </motion.div>

        <motion.h2 className="font-black mb-6 leading-tight"
          style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)", fontFamily: "var(--font-display)", color: "#fff" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Resultados que<br /><span style={{ color: "#06b6d4" }}>hablan solos</span>
        </motion.h2>

        {/* Metric cards */}
        <div className="flex gap-3">
          {[
            { v: "12.4K", l: "Usuarios", delta: "+23%", c: "#06b6d4" },
            { v: "98%", l: "Retención", delta: "+5%", c: "#34d399" },
            { v: "4.9★", l: "Rating", delta: "Top 1%", c: "#fbbf24" },
          ].map((m, i) => (
            <motion.div key={i} className="rounded-xl p-3 flex-1"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${m.c}30` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <div className="font-black text-xl mb-0.5" style={{ color: m.c, fontFamily: "var(--font-display)" }}>{m.v}</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{m.l}</div>
              <motion.div className="text-[10px] font-bold mt-1" style={{ color: m.c }}
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
                {m.delta} ↑
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Animated line chart */}
        <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <svg width="320" height="50" viewBox="0 0 320 50">
            <motion.path d="M 0 40 Q 50 30 80 25 T 160 15 T 240 20 T 320 8"
              fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.8"
              strokeDasharray="400"
              initial={{ strokeDashoffset: 400 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }} />
            <motion.path d="M 0 40 Q 50 30 80 25 T 160 15 T 240 20 T 320 8 L 320 50 L 0 50 Z"
              fill="rgba(6,182,212,0.08)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

const SCENES = [
  { Component: ScenePitch, label: "Pitch Deck", transition: "Dolly Zoom", accent: "#a855f7" },
  { Component: ScenePortfolio, label: "Portfolio", transition: "Iris", accent: "#f472b6" },
  { Component: SceneData, label: "Dashboard", transition: "Whip Pan", accent: "#06b6d4" },
];

export default function LiveDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Auto-cycle
  useEffect(() => {
    const iv = setInterval(() => {
      if (!transitioning) setActive(p => (p + 1) % SCENES.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [transitioning]);

  // Scroll entrance
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { y: 80, opacity: 0, rotateX: 8, scale: 0.95 },
      { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 80%" } }
    );
  }, []);

  const scene = SCENES[active];

  return (
    <section ref={sectionRef} id="live-demo" className="relative py-32 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030014 0%, #04001a 50%, #030014 100%)" }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>
            <motion.div className="w-1.5 h-1.5 rounded-full bg-purple-400"
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Editor en acción</span>
          </div>

          <h2 className="font-[var(--font-display)] font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#f0e6ff" }}>
            Presentaciones que
            <br />
            <span style={{
              background: "linear-gradient(135deg, #a855f7 0%, #f472b6 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>dejan sin palabras.</span>
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "rgba(240,230,255,0.4)" }}>
            Transiciones cinematográficas reales. Canvas infinito. Cada escena, una obra de arte.
          </p>
        </motion.div>

        {/* Main demo area */}
        <div ref={containerRef} className="relative" style={{ perspective: "1400px" }}>

          {/* Floating transition badge */}
          <motion.div
            key={scene.transition}
            className="absolute -top-4 right-8 z-20 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-2"
            style={{ background: `${scene.accent}20`, border: `1px solid ${scene.accent}50`, color: scene.accent }}
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Transición: {scene.transition}
          </motion.div>

          {/* Floating scene label */}
          <motion.div
            key={scene.label}
            className="absolute -top-4 left-8 z-20 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            📽 {scene.label}
          </motion.div>

          {/* Browser chrome */}
          <div className="rounded-t-2xl px-5 py-3 flex items-center gap-3"
            style={{ background: "#0f0f1e", border: "1px solid rgba(255,255,255,0.07)", borderBottom: "none" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-5 py-1 rounded-lg text-[11px] font-mono"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}>
                creativity.app/presenter
              </div>
            </div>
            <motion.div className="px-3 py-1 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
              animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
              ● LIVE
            </motion.div>
          </div>

          {/* Presentation screen */}
          <div className="relative overflow-hidden rounded-b-2xl"
            style={{ aspectRatio: "16/9", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none",
              boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 60px ${scene.accent}15` }}>
            <motion.div key={active} className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}>
              <scene.Component />
            </motion.div>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)" }} />

            {/* Scene dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {SCENES.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer"
                  style={i === active
                    ? { width: 24, height: 8, background: "rgba(255,255,255,0.7)" }
                    : { width: 8, height: 8, background: "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </div>

          {/* Reflection */}
          <div className="h-16 rounded-b-2xl -mt-1 opacity-20"
            style={{
              background: "linear-gradient(to bottom, rgba(168,85,247,0.1), transparent)",
              filter: "blur(4px)",
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }} />
        </div>

        {/* Bottom: transition pills */}
        <motion.div className="flex flex-wrap justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
          {[
            { name: "Dolly Zoom", icon: "🎬", c: "#a855f7" },
            { name: "Whip Pan", icon: "💫", c: "#f472b6" },
            { name: "Iris", icon: "◎", c: "#06b6d4" },
            { name: "Film Grain Cut", icon: "📽", c: "#fbbf24" },
            { name: "Parallax Shift", icon: "✦", c: "#34d399" },
            { name: "Zoom Blur", icon: "🔭", c: "#818cf8" },
          ].map((t, i) => (
            <motion.div key={t.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: `${t.c}10`, border: `1px solid ${t.c}25`, color: t.c }}
              whileHover={{ scale: 1.06, background: `${t.c}20` }}
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.06 }}>
              <span>{t.icon}</span> {t.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
