"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const features = [
  {
    title: "Hotspots",
    desc: "Agrega puntos interactivos a cualquier elemento. Al hacer clic, revelan contenido oculto, videos o enlaces.",
    color: "from-purple to-violet",
    demo: (idx: number, active: number) => (
      <div className="relative w-full h-full bg-gradient-to-br from-[#1a0040] to-[#0a0020] rounded-xl p-6">
        <div className="w-full h-3 rounded bg-white/10 mb-2" />
        <div className="w-3/4 h-2 rounded bg-white/5 mb-6" />
        <div className="w-full aspect-[16/9] rounded-lg bg-white/[0.03] relative">
          {/* Hotspot dots */}
          {[{ x: "25%", y: "30%" }, { x: "60%", y: "50%" }, { x: "40%", y: "75%" }].map((pos, i) => (
            <motion.div key={i} className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2" style={{ left: pos.x, top: pos.y }}>
              <motion.div className="w-full h-full rounded-full bg-purple" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
              <motion.div className="absolute inset-0 rounded-full bg-purple/30" animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
              {active === idx && i === 1 && (
                <motion.div initial={{ opacity: 0, scale: 0.8, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[10px] text-white/60 text-center">
                  Contenido interactivo revelado
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Pop-ups & Tooltips",
    desc: "Ventanas emergentes con contenido rico: texto, imagenes, video. Tooltips al pasar el mouse.",
    color: "from-coral to-magenta",
    demo: (idx: number, active: number) => (
      <div className="relative w-full h-full bg-gradient-to-br from-[#1a0800] to-[#0a0000] rounded-xl p-6">
        <div className="w-2/3 h-3 rounded bg-white/10 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square rounded-lg bg-white/[0.04] flex items-center justify-center text-white/15 text-xs">Card 1</div>
          <div className="aspect-square rounded-lg bg-white/[0.04] flex items-center justify-center text-white/15 text-xs relative">
            Card 2
            {active === idx && (
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-2 rounded-lg bg-coral/20 backdrop-blur-md border border-coral/30 flex items-center justify-center p-2">
                <div className="text-[9px] text-white/70 text-center leading-relaxed">Pop-up con contenido multimedia</div>
              </motion.div>
            )}
          </div>
        </div>
        <div className="mt-3 w-1/2 h-2 rounded bg-white/5" />
      </div>
    ),
  },
  {
    title: "Drag & Drop",
    desc: "Elementos arrastrables para crear quizzes, juegos de clasificacion y experiencias tactiles.",
    color: "from-cyan to-emerald-400",
    demo: (idx: number, active: number) => (
      <div className="relative w-full h-full bg-gradient-to-br from-[#001214] to-[#000a0c] rounded-xl p-6">
        <div className="w-1/2 h-3 rounded bg-white/10 mb-4" />
        <div className="flex gap-3 mb-4">
          {["A", "B", "C"].map((l, i) => (
            <motion.div key={i} animate={active === idx ? { y: [0, -8, 0], rotate: [0, i === 1 ? 5 : -3, 0] } : {}}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: active === idx ? Infinity : 0 }}
              className="w-10 h-10 rounded-lg bg-cyan/20 border border-cyan/30 flex items-center justify-center text-cyan/60 text-xs font-bold">{l}</motion.div>
          ))}
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-white/10 text-[10px]">?</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Navegacion No-Lineal",
    desc: "Crea rutas de navegacion ramificadas. El espectador elige su propio camino por la presentacion.",
    color: "from-gold to-orange-400",
    demo: (idx: number, active: number) => (
      <div className="relative w-full h-full bg-gradient-to-br from-[#0f0c00] to-[#0a0800] rounded-xl p-6 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-full h-auto">
          <motion.circle cx="100" cy="20" r="12" fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth="1"
            animate={active === idx ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} />
          <motion.line x1="100" y1="32" x2="50" y2="60" stroke="rgba(245,158,11,0.2)" strokeWidth="1"
            animate={active === idx ? { opacity: [0.2, 0.6, 0.2] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.line x1="100" y1="32" x2="150" y2="60" stroke="rgba(245,158,11,0.2)" strokeWidth="1"
            animate={active === idx ? { opacity: [0.2, 0.6, 0.2] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
          <circle cx="50" cy="70" r="10" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          <circle cx="150" cy="70" r="10" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          <line x1="50" y1="80" x2="30" y2="105" stroke="rgba(245,158,11,0.1)" strokeWidth="1" />
          <line x1="50" y1="80" x2="70" y2="105" stroke="rgba(245,158,11,0.1)" strokeWidth="1" />
          <line x1="150" y1="80" x2="150" y2="105" stroke="rgba(245,158,11,0.1)" strokeWidth="1" />
          <circle cx="30" cy="110" r="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.2)" strokeWidth="0.5" />
          <circle cx="70" cy="110" r="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.2)" strokeWidth="0.5" />
          <circle cx="150" cy="110" r="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.2)" strokeWidth="0.5" />
        </svg>
      </div>
    ),
  },
];

export default function Interactivity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[#030014]">
      <div className="absolute inset-0 noise-animated pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-purple/3 blur-[100px] pointer-events-none" />

      {/* Floating decos */}
      <motion.div className="absolute top-[15%] right-[4%] w-1.5 h-1.5 rounded-full bg-coral/30 pointer-events-none" animate={{ scale: [1, 2.5, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.svg className="absolute bottom-[10%] left-[3%] w-16 h-16 opacity-[0.06] pointer-events-none" viewBox="0 0 60 60" fill="none" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        <polygon points="30,5 55,50 5,50" stroke="#a855f7" strokeWidth="0.5" />
      </motion.svg>

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-16">
          <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-magenta/15 bg-magenta/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-magenta animate-pulse" />
            <span className="text-magenta text-xs font-bold uppercase tracking-[0.2em]">Interactividad</span>
          </motion.div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6 text-white">
            Cada elemento<br /><span className="text-shimmer">cobra vida</span>
          </h2>
          <p className="text-white/30 text-lg max-w-lg mx-auto">Convierte contenido estatico en experiencias que tu audiencia quiere explorar.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Interactive demo area */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-black/30">
            {features[active].demo(active, active)}
          </motion.div>

          {/* Feature selector */}
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 * i + 0.3, ease: [0.19, 1, 0.22, 1] }}
                onClick={() => setActive(i)}
                className={`group p-5 rounded-xl cursor-pointer transition-all duration-500 ${active === i ? "bg-white/[0.06] border border-white/10" : "bg-transparent border border-transparent hover:bg-white/[0.02]"}`}
                style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center text-white font-bold text-sm shrink-0 transition-transform duration-500 ${active === i ? "scale-110" : "scale-100"}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className={`font-[var(--font-display)] text-base font-extrabold mb-1 transition-colors duration-300 ${active === i ? "text-white" : "text-white/50"}`}>{f.title}</h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${active === i ? "text-white/40" : "text-white/20"}`}>{f.desc}</p>
                  </div>
                </div>
                {/* Progress bar */}
                {active === i && (
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5, ease: "linear" }}
                    onAnimationComplete={() => setActive((active + 1) % features.length)}
                    className="mt-3 h-0.5 rounded-full bg-gradient-to-r from-white/20 to-white/5 origin-left" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
