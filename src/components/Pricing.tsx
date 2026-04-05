"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  { name: "Gratis", price: "$0", period: "para siempre", desc: "Perfecto para explorar y crear tus primeras presentaciones.",
    features: ["3 presentaciones activas","Plantillas basicas","Canvas infinito","Exportar a PDF","IA: 10 generaciones/mes"],
    cta: "Comenzar Gratis", style: "bg-white border border-[#1a0030]/8", tc: "text-[#1a0030]", fc: "text-[#1a0030]/40", cc: "text-[#1a0030]/25",
    cs: "bg-[#1a0030] text-white", pop: false },
  { name: "Pro", price: "$9.99", period: "/mes", desc: "Para creadores que quieren presentaciones de otro nivel.",
    features: ["Presentaciones ilimitadas","Todas las plantillas premium","Canvas + colaboracion","Todas las transiciones","IA ilimitada","Exportar PDF, PPTX, video","Marca personalizada","Sin marca de agua"],
    cta: "Comenzar con Pro", style: "bg-[#1a0030]", tc: "text-white", fc: "text-white/40", cc: "text-coral",
    cs: "bg-coral text-white", pop: true },
  { name: "Teams", price: "$19.99", period: "/usuario/mes", desc: "Para equipos que crean juntos con superpoderes.",
    features: ["Todo lo de Pro","Workspace de equipo","Colaboracion tiempo real","Biblioteca compartida","Roles y permisos","Plantillas del equipo","Analytics","Soporte 24/7"],
    cta: "Contactar Ventas", style: "bg-white border border-[#1a0030]/8", tc: "text-[#1a0030]", fc: "text-[#1a0030]/40", cc: "text-[#1a0030]/25",
    cs: "bg-[#1a0030] text-white", pop: false },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="relative py-32 px-6 overflow-hidden bg-[#eee8f8]">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(124,58,237,0.04) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

      {/* Floating decorations */}
      <motion.svg className="absolute top-[10%] right-[8%] w-24 h-24 opacity-[0.04] pointer-events-none" viewBox="0 0 80 80" fill="none"
        animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        <circle cx="40" cy="40" r="35" stroke="#7c3aed" strokeWidth="0.5" strokeDasharray="5 3" />
      </motion.svg>
      <motion.div className="absolute bottom-[15%] left-[5%] w-1.5 h-1.5 rounded-full bg-violet/20 pointer-events-none"
        animate={{ scale: [1, 2.5, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.div className="absolute top-[35%] left-[3%] w-16 h-px bg-gradient-to-r from-transparent via-violet/8 to-transparent pointer-events-none"
        animate={{ x: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} />

      <div ref={ref} className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-20">
          <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/15 bg-violet/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-violet" />
            <span className="text-violet text-xs font-bold uppercase tracking-[0.2em]">Planes</span>
          </motion.div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6 text-[#1a0030]">
            Invierte en tu<br /><span className="relative inline-block"><span className="text-violet">creatividad</span>
              <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
                <motion.path d="M4 8C50 2,150 2,196 8" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
              </motion.svg>
            </span>
          </h2>
          <p className="text-[#1a0030]/35 text-lg max-w-md mx-auto">Comienza gratis. Escala cuando estes listo.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {plans.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative rounded-xl p-7 ${p.style} transition-all duration-500 ${p.pop ? "md:-mt-4 shadow-[0_20px_60px_rgba(26,0,48,0.15)]" : "shadow-[0_2px_12px_rgba(0,0,0,0.03)]"}`}
              style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}>
              {p.pop && (
                <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-coral text-white text-[9px] font-bold uppercase tracking-wider">
                  Mas Popular
                </motion.div>
              )}
              <h3 className={`font-[var(--font-display)] text-base font-bold mb-2 ${p.tc}`}>{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <motion.span className={`font-[var(--font-display)] text-4xl font-[900] ${p.tc}`}
                  initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1, ease: [0.19, 1, 0.22, 1] }}>
                  {p.price}
                </motion.span>
                <span className={`${p.fc} text-sm`}>{p.period}</span>
              </div>
              <p className={`${p.fc} text-sm mb-5`}>{p.desc}</p>
              <ul className="space-y-2 mb-7">
                {p.features.map((f, j) => (
                  <motion.li key={j} className="flex items-start gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 + i * 0.08 + j * 0.03 }}>
                    <svg className={`w-4 h-4 shrink-0 mt-0.5 ${p.cc}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
                    <span className={p.fc}>{f}</span>
                  </motion.li>
                ))}
              </ul>
              {/* Wipe button (Paper Tiger style) */}
              <a href="#" className={`hoverable group relative block w-full text-center py-3 rounded-lg font-bold text-sm overflow-hidden`}>
                <span className={`relative z-10 transition-colors duration-500 ${p.pop ? "text-white group-hover:text-coral" : `${p.tc} group-hover:text-white`}`}>{p.cta}</span>
                <div className={`absolute inset-0 ${p.cs} transition-transform duration-700 rounded-lg`} style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }} />
                <div className={`absolute inset-0 ${p.pop ? "bg-white" : "bg-coral"} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 rounded-lg`} style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
