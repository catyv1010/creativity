"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  { title: "Genera Slides con IA", description: "Describe tu idea y la IA crea una presentacion completa con diseño, imagenes y contenido.", accent: "border-l-purple shadow-[inset_4px_0_20px_-8px_rgba(168,85,247,0.3)]", bg: "bg-[#0c0020]",
    icon: <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11"><rect x="6" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><rect x="26" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /><rect x="6" y="24" width="36" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.7" /><path d="M18 33l4-4 4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" /></svg> },
  { title: "Paletas Inteligentes", description: "Analiza tu contenido y sugiere colores que transmiten la emocion perfecta.", accent: "border-l-coral shadow-[inset_4px_0_20px_-8px_rgba(242,88,62,0.3)]", bg: "bg-[#140800]",
    icon: <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11"><circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.7" /><circle cx="30" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /><circle cx="22" cy="28" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.6" /></svg> },
  { title: "Imagenes Generativas", description: "Crea imagenes unicas directamente desde el editor. Arte, fotos, iconos — todo con IA.", accent: "border-l-cyan shadow-[inset_4px_0_20px_-8px_rgba(6,182,212,0.3)]", bg: "bg-[#001214]",
    icon: <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11"><rect x="6" y="6" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.7" /><path d="M6 26l12-10 8 6 10-12 6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" /><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.4" /></svg> },
  { title: "Reescritura Magica", description: "Transforma tu texto en contenido impactante. Cambia tono, resume o traduce con un clic.", accent: "border-l-gold shadow-[inset_4px_0_20px_-8px_rgba(245,158,11,0.3)]", bg: "bg-[#0f0c00]",
    icon: <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11"><path d="M10 12h28M10 20h20M10 28h24M10 36h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" /><path d="M10 12h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" /><circle cx="36" cy="28" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.6" /></svg> },
];

export default function AIFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [-50, 80]);

  return (
    <section id="features" ref={containerRef} className="relative py-32 px-6 overflow-hidden bg-[#06001a]">
      <div className="absolute inset-0 noise-animated pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(168,85,247,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      {/* Parallax orbs */}
      <motion.div style={{ y: orbY }} className="absolute top-[5%] right-[3%] w-[400px] h-[400px] rounded-full bg-purple/5 blur-[100px] pointer-events-none" />
      <motion.div style={{ y: orb2Y }} className="absolute bottom-[5%] left-[5%] w-[300px] h-[300px] rounded-full bg-coral/4 blur-[80px] pointer-events-none" />

      {/* Floating geometric decorations */}
      <motion.svg className="absolute top-[8%] left-[4%] w-16 h-16 opacity-10 pointer-events-none" viewBox="0 0 60 60" fill="none" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
        <circle cx="30" cy="30" r="25" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="4 3" />
      </motion.svg>
      <motion.svg className="absolute bottom-[12%] right-[6%] w-20 h-20 opacity-10 pointer-events-none" viewBox="0 0 80 80" fill="none" animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}>
        <rect x="10" y="10" width="60" height="60" rx="4" stroke="#F2583E" strokeWidth="0.5" />
      </motion.svg>
      <motion.div className="absolute top-[40%] right-[2%] w-1 h-1 rounded-full bg-purple/40 pointer-events-none" animate={{ scale: [1, 3, 1], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.div className="absolute top-[60%] left-[3%] w-1.5 h-1.5 rounded-full bg-cyan/30 pointer-events-none" animate={{ scale: [1, 2, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
      <motion.div className="absolute top-[20%] left-[50%] w-20 h-px bg-gradient-to-r from-transparent via-purple/10 to-transparent pointer-events-none" animate={{ x: [0, 40, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 6, repeat: Infinity }} />

      <div ref={ref} className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-20">
          <motion.div initial={{ scale: 0, rotate: -10 }} animate={inView ? { scale: 1, rotate: 0 } : {}} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple/20 bg-purple/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
            <span className="text-purple text-xs font-bold uppercase tracking-[0.2em]">AI Studio</span>
          </motion.div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6 text-white">
            Tu copiloto<br /><span className="text-shimmer">creativo</span>
          </h2>
          <p className="text-white/30 text-lg max-w-md mx-auto">Inteligencia artificial que entiende tu vision y la lleva al siguiente nivel.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, rotateY: i % 2 === 0 ? 5 : -5 }}
              animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.12 * i, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ x: 8, scale: 1.02, rotateY: -2 }}
              className={`group ${f.bg} rounded-xl p-7 border-l-[3px] ${f.accent} hover:border-l-[5px] transition-all duration-300`}>
              <motion.div className="text-white/50 mb-4 group-hover:text-white/80 transition-colors duration-500"
                whileHover={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
                {f.icon}
              </motion.div>
              <h3 className="font-[var(--font-display)] text-lg font-extrabold mb-2 text-white">{f.title}</h3>
              <p className="text-white/30 text-sm leading-relaxed group-hover:text-white/50 transition-colors">{f.description}</p>
              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-tr-xl">
                <motion.div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white/[0.02]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 3, repeat: Infinity }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
