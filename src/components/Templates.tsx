"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const templates = [
  { name: "Acuarela", style: "template-watercolor", badge: "Artistico", bc: "bg-rose-500 text-white", href: "/templates/watercolor" },
  { name: "Neon Cyberpunk", style: "template-neon", badge: "Futurista", bc: "bg-cyan text-black", href: "/templates/neon-cyberpunk" },
  { name: "Minimalista", style: "template-minimalist", badge: "Elegante", bc: "bg-zinc-800 text-white", href: "#" },
  { name: "Retro Vintage", style: "template-retro", badge: "Nostalgico", bc: "bg-orange-600 text-white", href: "#" },
  { name: "Collage Art", style: "template-collage", badge: "Experimental", bc: "bg-violet text-white", href: "#" },
  { name: "Dark Elegant", style: "template-elegant", badge: "Premium", bc: "bg-rose text-white", href: "#" },
];

const previews: Record<string, React.ReactNode> = {
  Acuarela: <><div className="absolute top-3 left-3 w-16 h-2 rounded bg-rose-400/60" /><div className="absolute top-8 left-3 w-24 h-1.5 rounded bg-purple-400/40" /><div className="absolute bottom-6 right-4 w-14 h-14 rounded-full bg-teal-300/40 blur-sm" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-14 rounded-lg bg-white/30" /></>,
  "Neon Cyberpunk": <><div className="absolute top-4 left-4 w-20 h-2 rounded bg-cyan shadow-[0_0_10px_#06b6d4]" /><div className="absolute top-9 left-4 w-14 h-1.5 rounded bg-magenta shadow-[0_0_8px_#ec4899]" /><div className="absolute bottom-4 right-4 w-16 h-16 border border-cyan/50 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)]" /></>,
  Minimalista: <><div className="absolute top-6 left-6 w-24 h-2.5 rounded bg-zinc-800" /><div className="absolute top-12 left-6 w-16 h-1.5 rounded bg-zinc-400" /><div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-zinc-800" /></>,
  "Retro Vintage": <><div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-3 rounded bg-white/40" /><div className="absolute top-10 left-4 w-12 h-12 rounded-full border-2 border-white/30" /><div className="absolute bottom-4 right-4 w-16 h-8 rounded bg-white/20" /></>,
  "Collage Art": <><div className="absolute top-2 left-2 w-14 h-10 bg-white/20 rotate-3 rounded" /><div className="absolute top-6 right-3 w-10 h-14 bg-white/15 -rotate-6 rounded" /><div className="absolute bottom-3 left-6 w-16 h-8 bg-white/20 rotate-2 rounded" /></>,
  "Dark Elegant": <><div className="absolute top-4 left-4 w-20 h-0.5 bg-gradient-to-r from-rose to-transparent" /><div className="absolute top-7 left-4 w-28 h-2 rounded bg-white/10" /><div className="absolute bottom-4 right-4 w-14 h-14 rounded border border-rose/30" /></>,
};

export default function Templates() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: cRef, offset: ["start end", "end start"] });
  const decorY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const decor2Y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="templates" ref={cRef} className="relative py-32 px-6 overflow-hidden bg-[#faf5ef]">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(180,130,80,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      {/* Parallax decorations */}
      <motion.svg style={{ y: decorY }} className="absolute top-[5%] right-[5%] w-32 h-32 opacity-[0.04] pointer-events-none" viewBox="0 0 100 100" fill="none" >
        <circle cx="50" cy="50" r="45" stroke="#1a0030" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="30" stroke="#1a0030" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="15" stroke="#1a0030" strokeWidth="0.3" />
      </motion.svg>
      <motion.svg style={{ y: decor2Y }} className="absolute bottom-[10%] left-[4%] w-24 h-24 opacity-[0.04] pointer-events-none" viewBox="0 0 80 80" fill="none">
        <rect x="5" y="5" width="70" height="70" rx="4" stroke="#1a0030" strokeWidth="0.5" transform="rotate(15 40 40)" />
      </motion.svg>
      <motion.div style={{ y: decorY }} className="absolute top-[30%] left-[2%] w-16 h-px bg-gradient-to-r from-transparent via-[#1a0030]/5 to-transparent pointer-events-none" />
      <motion.div style={{ y: decor2Y }} className="absolute bottom-[25%] right-[3%] w-20 h-px bg-gradient-to-r from-transparent via-coral/10 to-transparent rotate-[-20deg] pointer-events-none" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-20">
          <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1a0030]/10 bg-[#1a0030]/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-coral" />
            <span className="text-[#1a0030]/50 text-xs font-bold uppercase tracking-[0.2em]">Galeria</span>
          </motion.div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6 text-[#1a0030]">
            Plantillas que<br />
            <span className="relative inline-block"><span className="text-coral">inspiran</span>
              <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
                <motion.path d="M4 8C50 2,150 2,196 8" stroke="#F2583E" strokeWidth="2.5" strokeLinecap="round" />
              </motion.svg>
            </span>
          </h2>
          <p className="text-[#1a0030]/35 text-lg max-w-md mx-auto">100+ plantillas artísticas creadas por diseñadores profesionales.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 10 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -12, scale: 1.04, rotateX: -2 }}
              data-tooltip={t.name + " — " + t.badge}
              className="group cursor-pointer rounded-xl overflow-hidden bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-shadow duration-500">
              <div className={`${t.style} aspect-[4/3] relative overflow-hidden`}>
                {previews[t.name]}
                {/* Image zoom on hover */}
                <motion.div className="absolute inset-0" whileHover={{ scale: 1.06 }} transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }} />
                <a href={t.href} className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-[600ms] flex items-center justify-center" style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}>
                  <span className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm"
                    style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}>
                    {t.href !== "#" ? "Ver Demo →" : "Proximamente"}
                  </span>
                </a>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-[var(--font-display)] font-bold text-[#1a0030] text-sm">{t.name}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.bc}`}>{t.badge}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, ease: [0.19, 1, 0.22, 1] }} className="text-center mt-14">
          <a href="#" className="hoverable group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#1a0030]/10 overflow-hidden font-bold text-sm transition-colors duration-700">
            <span className="relative z-10 text-[#1a0030]/60 group-hover:text-white transition-colors duration-500 flex items-center gap-2">
              Explorar todas las plantillas
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
            <div className="absolute inset-0 bg-[#1a0030] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 rounded-full" style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
