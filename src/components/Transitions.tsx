"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Transition Demo Components ──────────────────────────────────────────────

function DollyZoomDemo() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhase((v) => (v + 1) % 3), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #080018 0%, #15003a 100%)", perspective: "600px" }}>
      <AnimatePresence mode="wait">
        <motion.div key={phase}
          initial={{ scale: phase === 0 ? 0.4 : 1.6, z: phase === 0 ? -200 : 200, opacity: 0 }}
          animate={{ scale: 1, z: 0, opacity: 1 }}
          exit={{ scale: phase === 0 ? 1.6 : 0.4, z: phase === 0 ? 200 : -200, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute rounded-xl overflow-hidden"
          style={{ width: "60%", aspectRatio: "16/9", background: `linear-gradient(135deg, ${["#2d1b69,#0f0a2a", "#0f1a2a,#051020", "#1a0f2a,#0a0518"][phase % 3]})` }}>
          <div className="absolute inset-0 flex items-end p-3">
            <div className="space-y-1">
              <div className="h-1.5 rounded bg-white/30 w-16" />
              <div className="h-1 rounded bg-white/15 w-10" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3 inset-x-0 text-center">
        <span className="text-[9px] font-bold text-purple-300/40 uppercase tracking-widest">dolly zoom</span>
      </div>
    </div>
  );
}

function WhipPanDemo() {
  const [dir, setDir] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setDir((v) => -v), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #140800 0%, #2a1000 100%)" }}>
      <AnimatePresence mode="wait">
        <motion.div key={dir}
          initial={{ x: dir * 120, opacity: 0, filter: "blur(12px)" }}
          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ x: -dir * 120, opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="absolute rounded-xl" style={{ width: "58%", aspectRatio: "16/9", background: dir > 0 ? "linear-gradient(135deg, #fb923c20, #1a0800)" : "linear-gradient(135deg, #38bdf820, #001520)" }}>
          <div className="absolute inset-0 flex items-end p-3">
            <div className="space-y-1">
              <div className="h-1.5 rounded w-14" style={{ background: dir > 0 ? "rgba(251,146,60,0.4)" : "rgba(56,189,248,0.4)" }} />
              <div className="h-1 rounded w-9" style={{ background: dir > 0 ? "rgba(251,146,60,0.2)" : "rgba(56,189,248,0.2)" }} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Motion lines */}
      {[-20, 0, 20].map((offset, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ top: `calc(50% + ${offset}px)`, left: 0, right: 0, height: 1, background: "rgba(251,146,60,0.08)" }}
          animate={{ scaleX: [0, 1, 0], x: ["-100%", "0%", "100%"] }}
          transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }} />
      ))}
      <div className="absolute bottom-3 inset-x-0 text-center">
        <span className="text-[9px] font-bold text-orange-300/40 uppercase tracking-widest">whip pan</span>
      </div>
    </div>
  );
}

function IrisDemo() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setOpen((v) => !v), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #001214 0%, #001a1e 100%)" }}>
      <div className="relative" style={{ width: "60%", aspectRatio: "16/9" }}>
        {/* Background slide */}
        <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, #0f2a1a, #051510)" }} />
        {/* Iris mask */}
        <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ clipPath: open ? "circle(100% at 50% 50%)" : "circle(0% at 50% 50%)", transition: "clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1)" }}>
          <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, #06b6d420, #001520)" }} />
          <div className="absolute inset-0 flex items-end p-3">
            <div className="space-y-1">
              <div className="h-1.5 rounded bg-cyan-400/40 w-14" />
              <div className="h-1 rounded bg-cyan-400/20 w-9" />
            </div>
          </div>
        </div>
        {/* Iris ring */}
        <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ boxShadow: open ? "inset 0 0 0 0px rgba(6,182,212,0.5)" : "inset 0 0 0 2px rgba(6,182,212,0.4)" }}
          transition={{ duration: 0.9 }} />
      </div>
      <div className="absolute bottom-3 inset-x-0 text-center">
        <span className="text-[9px] font-bold text-cyan-300/40 uppercase tracking-widest">iris</span>
      </div>
    </div>
  );
}

function GlitchCutDemo() {
  const [glitch, setGlitch] = useState(false);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => { setGlitch(false); setPhase((v) => (v + 1) % 3); }, 400);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  const slides = [
    { bg: "linear-gradient(135deg, #1a0030, #0a0018)", color: "#c084fc" },
    { bg: "linear-gradient(135deg, #001a30, #000a18)", color: "#38bdf8" },
    { bg: "linear-gradient(135deg, #001a0a, #000a05)", color: "#34d399" },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0018" }}>
      <div className="relative overflow-hidden rounded-xl" style={{ width: "60%", aspectRatio: "16/9" }}>
        <div className="absolute inset-0" style={{ background: slides[phase].bg }} />
        {/* Glitch layers */}
        {glitch && (
          <>
            <motion.div className="absolute inset-0" style={{ background: slides[phase].bg, mixBlendMode: "screen" }}
              animate={{ x: [-4, 4, -2, 2, 0], opacity: [0.5, 0.7, 0.5] }} transition={{ duration: 0.25 }} />
            <motion.div className="absolute inset-0" style={{ background: slides[(phase + 1) % 3].bg, mixBlendMode: "difference" }}
              animate={{ x: [3, -3, 1, -1, 0] }} transition={{ duration: 0.25 }} />
            {[0, 30, 60].map((y, i) => (
              <motion.div key={i} className="absolute left-0 right-0 h-[2px]"
                style={{ top: `${y}%`, background: slides[phase].color, opacity: 0.6 }}
                animate={{ x: [-10, 15, -5, 10, 0] }} transition={{ duration: 0.2 }} />
            ))}
          </>
        )}
        <div className="absolute inset-0 flex items-end p-3">
          <div className="h-1.5 rounded w-12" style={{ background: `${slides[phase].color}50` }} />
        </div>
      </div>
      <div className="absolute bottom-3 inset-x-0 text-center">
        <span className="text-[9px] font-bold text-pink-300/40 uppercase tracking-widest">film grain cut</span>
      </div>
    </div>
  );
}

function ParallaxDemo() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let frame: number;
    let t = 0;
    const loop = () => { t += 0.015; setOffset(Math.sin(t) * 30); frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020a14 0%, #050d1a 100%)" }}>
      <div className="relative overflow-hidden rounded-xl" style={{ width: "60%", aspectRatio: "16/9" }}>
        {/* Layer 3 (far) */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f1a40, #050d20)", transform: `translateX(${offset * 0.2}px)` }}>
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-indigo-500/10" />
        </div>
        {/* Layer 2 (mid) */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateX(${offset * 0.5}px)` }}>
          <div className="w-3/4 h-1/2 rounded-lg bg-indigo-500/8 border border-indigo-500/10" />
        </div>
        {/* Layer 1 (near) */}
        <div className="absolute inset-0 flex items-end p-4" style={{ transform: `translateX(${offset * 1.0}px)` }}>
          <div className="space-y-1">
            <div className="h-2 rounded bg-indigo-400/30 w-16" />
            <div className="h-1 rounded bg-indigo-400/15 w-10" />
          </div>
        </div>
        {/* Depth indicators */}
        <div className="absolute right-2 inset-y-0 flex flex-col items-center justify-center gap-1">
          {["far", "mid", "near"].map((l, i) => (
            <div key={i} className="text-[7px] font-bold text-indigo-300/20 uppercase">{l}</div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-3 inset-x-0 text-center">
        <span className="text-[9px] font-bold text-indigo-300/40 uppercase tracking-widest">parallax shift</span>
      </div>
    </div>
  );
}

function ZoomBlurDemo() {
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setZoom((v) => !v), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a080a 0%, #140a14 100%)" }}>
      <div className="relative overflow-hidden rounded-xl" style={{ width: "60%", aspectRatio: "16/9" }}>
        <motion.div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #2a0a2a, #0a0518)" }}
          animate={{ scale: zoom ? [1, 1.4] : [1.4, 1], filter: zoom ? ["blur(0px)", "blur(8px)"] : ["blur(8px)", "blur(0px)"] }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <div className="absolute inset-0 flex items-end p-3">
            <div className="space-y-1">
              <div className="h-1.5 rounded bg-fuchsia-400/40 w-14" />
              <div className="h-1 rounded bg-fuchsia-400/20 w-9" />
            </div>
          </div>
        </motion.div>
        {/* Radial blur rings */}
        {zoom && [0.85, 0.7, 0.55].map((s, i) => (
          <motion.div key={i} className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ border: "1px solid rgba(217,70,239,0.15)", transform: `scale(${s})` }}
            animate={{ opacity: [0, 0.8, 0] }} transition={{ duration: 0.5, delay: i * 0.05 }} />
        ))}
      </div>
      <div className="absolute bottom-3 inset-x-0 text-center">
        <span className="text-[9px] font-bold text-fuchsia-300/40 uppercase tracking-widest">zoom blur</span>
      </div>
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const transitions = [
  { name: "Dolly Zoom", desc: "La cámara retrocede mientras hace zoom — profundidad vertiginosa.", Demo: DollyZoomDemo, color: "#a78bfa", bg: "from-[#0c0020] to-[#1a0040]" },
  { name: "Whip Pan", desc: "Barrido veloz de cámara que conecta escenas con energía.", Demo: WhipPanDemo, color: "#fb923c", bg: "from-[#140800] to-[#2a1000]" },
  { name: "Iris", desc: "Apertura circular — como una lente fotográfica abriéndose.", Demo: IrisDemo, color: "#06b6d4", bg: "from-[#001214] to-[#001e20]" },
  { name: "Film Grain Cut", desc: "Corte directo con efecto glitch analógico de celuloide.", Demo: GlitchCutDemo, color: "#f472b6", bg: "from-[#1a0018] to-[#0a0010]" },
  { name: "Parallax Shift", desc: "Capas a velocidades distintas crean profundidad cinematográfica.", Demo: ParallaxDemo, color: "#818cf8", bg: "from-[#020a14] to-[#050d1a]" },
  { name: "Zoom Blur", desc: "Expansión con desenfoque radial — teleportación entre mundos.", Demo: ZoomBlurDemo, color: "#d946ef", bg: "from-[#0a080a] to-[#140a14]" },
];

export default function Transitions() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: cRef, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const line2H = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);

  return (
    <section ref={cRef} className="relative py-32 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, #030014 0%, #060020 50%, #030014 100%)" }}>
      {/* Animated vertical lines */}
      <motion.div style={{ height: lineH, background: "linear-gradient(to bottom, rgba(167,139,250,0.15), transparent)" }} className="absolute top-0 left-[20%] w-px pointer-events-none" />
      <motion.div style={{ height: line2H, background: "linear-gradient(to bottom, rgba(6,182,212,0.15), transparent)" }} className="absolute top-0 right-[25%] w-px pointer-events-none" />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: 2 + (i % 3), height: 2 + (i % 3), left: `${10 + i * 11}%`, top: `${15 + (i % 4) * 20}%`, background: ["#a78bfa", "#06b6d4", "#f472b6", "#fb923c"][i % 4], opacity: 0.2 }}
          animate={{ y: [0, -15 - i * 3, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.3 }} />
      ))}

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-20">
          <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/15 bg-cyan-500/5 mb-8">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-cyan-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-cyan-400/70 text-xs font-bold uppercase tracking-[0.2em]">Transiciones Cinematográficas</span>
          </motion.div>

          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6">
            <motion.span initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="text-white inline-block">Movimiento</motion.span>
            <br />
            <motion.span initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
              className="inline-block" style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              que hipnotiza
            </motion.span>
          </h2>
          <p className="text-white/30 text-lg max-w-md mx-auto">
            6 transiciones cinematográficas reales — todas animadas en tiempo real, sin video.
          </p>
        </motion.div>

        {/* 6-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {transitions.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 50, rotateX: 12 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.1 * i, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              {/* Demo area */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <t.Demo />
                {/* Live badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-white/30">En vivo</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 border-t border-white/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                  <h3 className="font-[var(--font-display)] text-sm font-extrabold text-white">{t.name}</h3>
                </div>
                <p className="text-white/25 text-xs leading-relaxed">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mt-16 flex items-center justify-center gap-6 flex-wrap">
          {["30+ transiciones", "Personalizables", "60 FPS garantizados", "GPU acelerado"].map((x, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div className="w-1 h-1 rounded-full"
                style={{ background: ["#a78bfa", "#06b6d4", "#34d399", "#f472b6"][i] }}
                animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
              <span className="text-white/20 text-[11px] font-medium">{x}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
