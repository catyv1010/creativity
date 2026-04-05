"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  {
    tag: "Canvas cinematográfico",
    headline: "Tu presentación vive en un mundo infinito",
    body: "Olvida las diapositivas lineales. Coloca escenas donde quieras en un canvas 2D/3D infinito — horizontal, espiral, fractal. La cámara vuela entre ellas como en una película.",
    accent: "#c084fc",
    visual: (
      <div className="relative w-full h-52 rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0d001a 0%, #1a003a 100%)" }}>
        {[
          { x: "10%", y: "20%", w: "35%", h: "55%", color: "#c084fc" },
          { x: "55%", y: "10%", w: "38%", h: "50%", color: "#818cf8" },
          { x: "30%", y: "62%", w: "30%", h: "28%", color: "#38bdf8" },
        ].map((s, i) => (
          <div key={i} className="absolute rounded-lg border" style={{ left: s.x, top: s.y, width: s.w, height: s.h, borderColor: `${s.color}40`, background: `${s.color}08` }}>
            <div className="absolute inset-2 flex flex-col gap-1">
              <div className="h-1.5 w-3/4 rounded" style={{ background: `${s.color}60` }} />
              <div className="h-1 w-1/2 rounded" style={{ background: `${s.color}30` }} />
            </div>
          </div>
        ))}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200">
          <path d="M 70 70 Q 180 40 240 70" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.6" />
          <path d="M 240 70 Q 180 120 130 155" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.6" />
          <circle cx="70" cy="70" r="5" fill="#c084fc" opacity="0.9" />
          <circle cx="240" cy="70" r="4" fill="#818cf8" opacity="0.7" />
          <circle cx="130" cy="155" r="4" fill="#38bdf8" opacity="0.7" />
        </svg>
        <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(192,132,252,0.15)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
          Vista mapa · 3 escenas
        </div>
      </div>
    ),
  },
  {
    tag: "Transiciones cine",
    headline: "Dolly-zoom, iris, whip-pan. En tu presentación.",
    body: "8 transiciones cinematográficas que ninguna otra herramienta tiene. El efecto Hitchcock, el barrido rápido, la máscara de iris — ahora en tus slides.",
    accent: "#f472b6",
    visual: (
      <div className="relative w-full h-52 rounded-xl overflow-hidden p-4" style={{ background: "linear-gradient(135deg, #1a0010 0%, #2d0020 100%)" }}>
        <div className="grid grid-cols-4 gap-2 w-full h-full">
          {[
            { name: "Dolly Zoom", icon: "🎥", color: "#f472b6" },
            { name: "Iris", icon: "◉", color: "#c084fc" },
            { name: "Whip Pan", icon: "→→", color: "#818cf8" },
            { name: "Parallax", icon: "⧉", color: "#38bdf8" },
            { name: "Fade", icon: "◐", color: "#34d399" },
            { name: "Film Cut", icon: "✂", color: "#fbbf24" },
            { name: "Zoom Blur", icon: "◎", color: "#fb923c" },
            { name: "Cámara", icon: "▶", color: "#f0abfc" },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg cursor-pointer hover:scale-105 transition-transform"
              style={{ background: `${t.color}10`, border: `1px solid ${t.color}25` }}>
              <div className="text-lg">{t.icon}</div>
              <div className="text-center" style={{ fontSize: "9px", color: t.color, fontWeight: 700, lineHeight: 1.2 }}>{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: "IA integrada",
    headline: "Escribe un tema, la IA arma la presentación",
    body: "Como Gamma, pero con animaciones cinematográficas reales. Describe tu idea, elige el layout y la IA genera contenido, sugiere colores y organiza las escenas automáticamente.",
    accent: "#38bdf8",
    visual: (
      <div className="relative w-full h-52 rounded-xl overflow-hidden p-4" style={{ background: "linear-gradient(135deg, #001020 0%, #001a30 100%)" }}>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "rgba(56,189,248,0.2)", color: "#38bdf8" }}>T</div>
            <div className="px-3 py-2 rounded-xl rounded-tl-none text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>
              &quot;Crea una presentación de mi startup de fintech para inversores&quot;
            </div>
          </div>
          <div className="flex gap-2 items-start flex-row-reverse">
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#fff" }}>✦</div>
            <div className="px-3 py-2 rounded-xl rounded-tr-none text-xs" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }}>
              Generando 6 escenas con layout espiral...
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= 4 ? "#38bdf8" : "rgba(56,189,248,0.2)" }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["Fintech","Inversores","6 slides","Layout espiral"].map(tag => (
              <div key={tag} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(56,189,248,0.08)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.15)" }}>{tag}</div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full animate-pulse" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.2)" }}>
          Próximamente ✦
        </div>
      </div>
    ),
  },
  {
    tag: "Exportar & Compartir",
    headline: "HTML interactivo, PDF, link directo",
    body: "Exporta como HTML standalone con todas las animaciones, PDF de alta calidad con Puppeteer, o comparte un link directo. Funciona en cualquier navegador sin instalar nada.",
    accent: "#34d399",
    visual: (
      <div className="relative w-full h-52 rounded-xl overflow-hidden flex items-center justify-center gap-3 p-6" style={{ background: "linear-gradient(135deg, #001510 0%, #001a15 100%)" }}>
        {[
          { label: "HTML interactivo", sub: "Animaciones incluidas", icon: "⟨⟩", color: "#38bdf8", size: "~9 KB" },
          { label: "PDF", sub: "Alta calidad", icon: "□", color: "#34d399", size: "~2 MB" },
          { label: "Link directo", sub: "Compartir al instante", icon: "↗", color: "#c084fc", size: "URL pública" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl flex-1 hover:scale-105 transition-transform cursor-pointer"
            style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
            <div className="text-2xl" style={{ color: item.color }}>{item.icon}</div>
            <div className="text-xs font-bold text-center" style={{ color: item.color }}>{item.label}</div>
            <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>{item.sub}</div>
            <div className="text-xs px-2 py-0.5 rounded-full mt-1" style={{ background: `${item.color}15`, color: item.color }}>{item.size}</div>
          </div>
        ))}
      </div>
    ),
  },
];

export default function AIFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" ref={ref} className="relative py-32 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030014 0%, #08001a 50%, #030014 100%)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(192,132,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(192,132,252,0.25)", background: "rgba(192,132,252,0.07)", color: "#c084fc" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c084fc" }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">¿Qué lo hace diferente?</span>
          </div>
          <h2 className="font-[var(--font-display)] font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0e6ff" }}>
            No son slides.<br />
            <span style={{
              background: "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #38bdf8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Es una experiencia.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(240,230,255,0.5)" }}>
            Cada feature fue diseñado para que tu audiencia sienta que está viendo una película, no una presentación aburrida de PowerPoint.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
              className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.border = `1px solid ${feature.accent}30`; el.style.boxShadow = `0 8px 40px ${feature.accent}15`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.border = "1px solid rgba(255,255,255,0.06)"; el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)"; }}>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: `${feature.accent}12`, border: `1px solid ${feature.accent}25`, color: feature.accent }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: feature.accent }} />
                {feature.tag}
              </div>
              <h3 className="font-[var(--font-display)] font-black text-xl mb-3 leading-tight" style={{ color: "#f0e6ff" }}>
                {feature.headline}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(240,230,255,0.45)" }}>
                {feature.body}
              </p>
              {feature.visual}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
