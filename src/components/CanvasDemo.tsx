"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Floating scene card in the infinite world
function SceneCard({
  style, gradient, label, active, delay, floatY = 0, floatX = 0,
}: {
  style?: React.CSSProperties;
  gradient: string;
  label: string;
  active?: boolean;
  delay?: number;
  floatY?: number;
  floatX?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-xl overflow-hidden shadow-2xl"
      style={style}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [floatY, floatY - 8, floatY], x: [floatX, floatX + 4, floatX] }}
      transition={{ opacity: { delay, duration: 0.6 }, scale: { delay, duration: 0.6 }, y: { duration: 5 + (delay || 0), repeat: Infinity, ease: "easeInOut" }, x: { duration: 7 + (delay || 0), repeat: Infinity, ease: "easeInOut" } }}>
      <div className="w-full h-full relative" style={{ background: gradient }}>
        {/* Orb */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.06)", filter: "blur(20px)" }} />
        {/* Lines */}
        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <div className="h-1.5 rounded-full bg-white/20 w-3/4" />
          <div className="h-1 rounded-full bg-white/10 w-1/2" />
        </div>
        {/* Label */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[8px] font-bold text-white/50"
          style={{ background: "rgba(0,0,0,0.3)" }}>
          {label}
        </div>
        {/* Active ring */}
        {active && (
          <motion.div className="absolute inset-0 rounded-xl"
            style={{ border: "2px solid rgba(192,132,252,0.8)", boxShadow: "0 0 20px rgba(192,132,252,0.4), inset 0 0 20px rgba(192,132,252,0.05)" }}
            animate={{ boxShadow: ["0 0 20px rgba(192,132,252,0.4)", "0 0 40px rgba(192,132,252,0.7)", "0 0 20px rgba(192,132,252,0.4)"] }}
            transition={{ duration: 2, repeat: Infinity }} />
        )}
      </div>
    </motion.div>
  );
}

// Animated camera path SVG line between two points
function CameraPath({ x1, y1, x2, y2, color = "rgba(192,132,252,0.2)", delay = 0 }: { x1: number; y1: number; x2: number; y2: number; color?: string; delay?: number }) {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 30;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  return (
    <motion.path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 1.2, ease: "easeInOut" }} />
  );
}

// Camera cursor that flies around
function CameraFly({ inView }: { inView: boolean }) {
  const positions = [
    { x: "28%", y: "30%" },
    { x: "55%", y: "55%" },
    { x: "75%", y: "25%" },
    { x: "42%", y: "70%" },
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % positions.length), 2200);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <motion.div className="absolute z-30 pointer-events-none"
      animate={{ left: positions[idx].x, top: positions[idx].y }}
      transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}>
      <div className="relative">
        {/* Camera icon */}
        <motion.div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(192,132,252,0.25)", border: "1.5px solid rgba(192,132,252,0.6)", backdropFilter: "blur(8px)", boxShadow: "0 0 20px rgba(192,132,252,0.4)" }}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <svg className="w-4 h-4" style={{ color: "#c084fc" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </motion.div>
        {/* Trail */}
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "rgba(192,132,252,0.15)" }}
          animate={{ width: [0, 60, 0], height: [0, 60, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }} />
      </div>
    </motion.div>
  );
}

export default function CanvasDemo() {
  const ref = useRef(null);
  const cRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: cRef, offset: ["start end", "end start"] });
  const worldY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const [activeScene, setActiveScene] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setActiveScene((v) => (v + 1) % 4), 2200);
    return () => clearInterval(t);
  }, [inView]);

  const sceneNames = ["Hero", "Problema", "Solución", "Contacto"];
  const sceneColors = [
    { from: "#2d1b69", to: "#0f0a2a" },
    { from: "#0f1a2a", to: "#051020" },
    { from: "#1a0f2a", to: "#0a0518" },
    { from: "#0a1a0f", to: "#050a05" },
  ];

  return (
    <section id="canvas" ref={cRef} className="relative py-32 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, #030014 0%, #060020 50%, #030014 100%)" }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(192,132,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/15 bg-purple-500/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-purple-400/70 text-xs font-bold uppercase tracking-[0.2em]">Canvas Infinito</span>
          </div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6" style={{ color: "#f0e6ff" }}>
            Tu mundo,<br />
            <span className="relative inline-block">
              <span style={{ color: "#a78bfa" }}>sin límites</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none">
                <path d="M4 8C50 2,150 2,196 8" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "rgba(240,230,255,0.4)" }}>
            Una cámara virtual vuela entre escenas en espacio 2D/3D. No hay diapositivas — hay mundos.
          </p>
        </motion.div>

        {/* Stat pills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.7 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-12">
          {[
            { n: "∞", l: "Canvas", c: "#a78bfa" },
            { n: "60", l: "FPS", c: "#38bdf8" },
            { n: "30+", l: "Transiciones", c: "#34d399" },
            { n: "GPU", l: "Acelerado", c: "#f472b6" },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.c}20` }}>
              <span className="font-[var(--font-display)] text-xl font-[900]" style={{ color: s.c }}>{s.n}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "rgba(240,230,255,0.3)" }}>{s.l}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* THE WORLD CANVAS */}
        <motion.div initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          style={{ y: worldY }}>
          <div className="relative rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]"
            style={{ background: "#0a0a18" }}>

            {/* Editor chrome bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5" style={{ background: "#0f0f1e" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md text-xs font-mono" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>
                  creativity.app/cinema-editor
                </div>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-md text-[10px] font-bold" style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa" }}>Plantillas</div>
                <div className="px-3 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: "#7c3aed" }}>▶ Presentar</div>
              </div>
            </div>

            {/* Canvas world */}
            <div className="relative aspect-[16/7] overflow-hidden" style={{ background: "#12122a" }}>

              {/* Dot grid — the infinite canvas */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }} />

              {/* Vignette */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(12,12,26,0.8) 100%)",
              }} />

              {/* SVG paths between scenes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                {inView && (
                  <>
                    <CameraPath x1={230} y1={130} x2={420} y2={220} color="rgba(167,139,250,0.25)" delay={0.8} />
                    <CameraPath x1={420} y1={220} x2={640} y2={100} color="rgba(56,189,248,0.2)" delay={1.4} />
                    <CameraPath x1={640} y1={100} x2={350} y2={290} color="rgba(52,211,153,0.2)" delay={2} />
                  </>
                )}
              </svg>

              {/* Scene cards floating in world space */}
              <SceneCard gradient={`linear-gradient(135deg, ${sceneColors[0].from}, ${sceneColors[0].to})`} label="1 · Hero"
                style={{ left: "14%", top: "12%", width: "22%", aspectRatio: "16/9" }} active={activeScene === 0} delay={0.3} floatY={0} />

              <SceneCard gradient={`linear-gradient(135deg, ${sceneColors[1].from}, ${sceneColors[1].to})`} label="2 · Problema"
                style={{ left: "40%", top: "32%", width: "18%", aspectRatio: "16/9" }} active={activeScene === 1} delay={0.5} floatY={5} floatX={2} />

              <SceneCard gradient={`linear-gradient(135deg, ${sceneColors[2].from}, ${sceneColors[2].to})`} label="3 · Solución"
                style={{ left: "62%", top: "8%", width: "20%", aspectRatio: "16/9" }} active={activeScene === 2} delay={0.7} floatY={-3} floatX={-2} />

              <SceneCard gradient={`linear-gradient(135deg, ${sceneColors[3].from}, ${sceneColors[3].to})`} label="4 · Contacto"
                style={{ left: "30%", top: "56%", width: "16%", aspectRatio: "16/9" }} active={activeScene === 3} delay={0.9} floatY={2} floatX={3} />

              {/* Flying camera */}
              {inView && <CameraFly inView={inView} />}

              {/* Active scene name badge */}
              <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full z-20"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <AnimatePresence mode="wait">
                  <motion.span key={activeScene} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="text-[10px] font-bold" style={{ color: "#a78bfa" }}>
                    📷 Cámara → {sceneNames[activeScene]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Left toolbar */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                {["M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", "M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14", "M4 6h16M4 12h16M4 18h7"].map((d, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: i === 0 ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <svg className="w-3.5 h-3.5" style={{ color: i === 0 ? "#a78bfa" : "rgba(255,255,255,0.2)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Zoom indicator */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-20">
                <div className="px-2 py-1 rounded text-[10px] font-mono" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }}>35%</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9, duration: 0.7 }}
          className="flex items-center justify-center gap-8 flex-wrap mt-12">
          {["Cámara virtual con dolly zoom", "Espacio 2D / 3D libre", "Parallax multicapa", "Zoom infinito"].map((x, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: ["#a78bfa", "#38bdf8", "#34d399", "#f472b6"][i] }} />
              <span className="text-[11px] font-medium" style={{ color: "rgba(240,230,255,0.25)" }}>{x}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
