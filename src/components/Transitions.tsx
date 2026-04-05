"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const items = [
  { name: "Morphing", desc: "Elementos que se transforman fluidamente creando transiciones organicas.", bg: "bg-[#0c0020]",
    demo: <div className="relative w-full h-full flex items-center justify-center"><div className="w-24 h-24 bg-gradient-to-br from-purple/50 to-magenta/25 morph-demo" /><div className="absolute w-16 h-16 bg-gradient-to-br from-cyan/25 to-purple/10 morph-demo" style={{ animationDelay: "-3s" }} /></div> },
  { name: "Parallax", desc: "Capas a diferentes velocidades crean profundidad cinematografica.", bg: "bg-[#140800]",
    demo: <div className="relative w-full h-full flex items-center justify-center overflow-hidden"><div className="absolute w-36 h-16 rounded-xl bg-coral/10 parallax-demo" /><div className="absolute w-28 h-12 rounded-xl bg-coral/20 parallax-demo" style={{ animationDelay: "-1s", animationDuration: "3s" }} /><div className="absolute w-20 h-8 rounded-xl bg-coral/35 parallax-demo" style={{ animationDelay: "-2s", animationDuration: "2s" }} /></div> },
  { name: "3D Rotate", desc: "Rotaciones tridimensionales con perspectiva y movimiento dinamico.", bg: "bg-[#001214]",
    demo: <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "600px" }}><div className="w-24 h-16 rounded-xl bg-gradient-to-br from-cyan/45 to-emerald-400/20 rotate3d-demo" /></div> },
];

export default function Transitions() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: cRef, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const line2H = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);

  return (
    <section ref={cRef} className="relative py-32 px-6 overflow-hidden bg-[#050510]">
      <div className="absolute inset-0 noise-animated pointer-events-none" />

      {/* Animated vertical lines that grow with scroll */}
      <motion.div style={{ height: lineH }} className="absolute top-0 left-[25%] w-px bg-gradient-to-b from-purple/15 to-transparent pointer-events-none" />
      <motion.div style={{ height: line2H }} className="absolute top-0 right-[30%] w-px bg-gradient-to-b from-cyan/15 to-transparent pointer-events-none" />

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-purple/20 pointer-events-none"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -20 - i * 5, 0], opacity: [0.15, 0.4, 0.15], scale: [1, 1.5, 1] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} />
      ))}

      <div ref={ref} className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-20">
          <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan/15 bg-cyan/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="text-cyan text-xs font-bold uppercase tracking-[0.2em]">Motion</span>
          </motion.div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6">
            <motion.span initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="text-white inline-block">Transiciones</motion.span>
            <br />
            <motion.span initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
              className="text-shimmer inline-block">cinematograficas</motion.span>
          </h2>
          <p className="text-white/30 text-lg max-w-md mx-auto">Movimiento que convierte tu presentacion en una experiencia visual.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -10, scale: 1.03, rotateX: -3 }}
              className={`${t.bg} rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-500`}
              style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}>
              <div className="aspect-square relative">
                {t.demo}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-lime" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">En Vivo</span>
                </div>
              </div>
              <div className="p-5 border-t border-white/5">
                <h3 className="font-[var(--font-display)] text-lg font-extrabold text-white mb-1.5">{t.name}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated stats bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="mt-14 flex items-center justify-center gap-8 flex-wrap">
          {["30+ transiciones", "Personalizables", "60 FPS", "GPU acelerado"].map((x, i) => (
            <motion.div key={i} className="flex items-center gap-2 text-white/20 text-xs"
              whileHover={{ scale: 1.1, color: "rgba(255,255,255,0.5)" }}>
              <motion.div className="w-1 h-1 rounded-full bg-gradient-to-r from-purple to-cyan"
                animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
              {x}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
