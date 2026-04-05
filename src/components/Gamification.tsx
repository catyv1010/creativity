"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const games = [
  {
    title: "Escape Rooms",
    desc: "Desafios interactivos con pistas ocultas, codigos secretos y efectos de sonido. Ideal para educacion y team building.",
    gradient: "from-[#2a0045] to-[#0f001a]",
    accent: "purple",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div className="w-20 h-20 rounded-xl border-2 border-purple/30 flex items-center justify-center"
          animate={{ rotateY: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <svg className="w-8 h-8 text-purple/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </motion.div>
        {/* Lock particles */}
        {[0, 1, 2, 3].map(i => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-purple/40"
            style={{ left: `${30 + i * 12}%`, top: `${25 + (i % 2) * 30}%` }}
            animate={{ y: [0, -10, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
        ))}
      </div>
    ),
  },
  {
    title: "Quizzes Interactivos",
    desc: "Preguntas de opcion multiple, verdadero/falso con feedback instantaneo, puntuacion y temporizador.",
    gradient: "from-[#1a0800] to-[#0a0000]",
    accent: "coral",
    visual: (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 px-6">
        <div className="w-full h-3 rounded bg-white/10 mb-2" />
        {["A", "B", "C"].map((l, i) => (
          <motion.div key={i} className={`w-full py-2.5 rounded-lg border text-center text-xs font-bold transition-all ${i === 1 ? "border-coral/40 bg-coral/10 text-coral/60" : "border-white/8 text-white/20"}`}
            animate={i === 1 ? { scale: [1, 1.03, 1] } : {}} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
            Opcion {l}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    title: "Juegos de Memoria",
    desc: "Tarjetas que se voltean, parejas para encontrar. Perfecto para aprendizaje y engagement.",
    gradient: "from-[#001a10] to-[#000a08]",
    accent: "lime",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <motion.div key={i} className="w-12 h-12 rounded-lg bg-lime/10 border border-lime/20 flex items-center justify-center"
              animate={i === 2 || i === 4 ? { rotateY: [0, 180], backgroundColor: ["rgba(132,204,22,0.1)", "rgba(132,204,22,0.25)"] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: i === 4 ? 0.3 : 0 }}>
              <span className="text-lime/30 text-[10px] font-bold">{i === 2 || i === 4 ? "★" : "?"}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function Gamification() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, #030014 0%, #08001a 50%, #030014 100%)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(251,146,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <motion.svg className="absolute top-[8%] left-[5%] w-20 h-20 opacity-[0.04] pointer-events-none" viewBox="0 0 80 80" fill="none"
        animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}>
        <polygon points="40,5 75,65 5,65" stroke="#f59e0b" strokeWidth="0.5" />
      </motion.svg>

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-20">
          <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/15 bg-amber-700/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span className="text-amber-700/60 text-xs font-bold uppercase tracking-[0.2em]">Gamificacion</span>
          </motion.div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6" style={{ color: "#f0e6ff" }}>
            Aprende<br />
            <span className="relative inline-block"><span style={{ color: "#fb923c" }}>jugando</span>
              <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
                <motion.path d="M4 8C50 2,150 2,196 8" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              </motion.svg>
            </span>
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "rgba(240,230,255,0.4)" }}>Escape rooms, quizzes y juegos de memoria que transforman cualquier contenido en una aventura.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {games.map((g, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -10, scale: 1.03 }}
              className={`bg-gradient-to-br ${g.gradient} rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500`}>
              <div className="aspect-square relative">{g.visual}</div>
              <div className="p-6 border-t border-white/5">
                <h3 className="font-[var(--font-display)] text-lg font-extrabold text-white mb-2">{g.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{g.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
