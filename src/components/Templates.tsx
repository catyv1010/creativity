"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const CATEGORIES = ["Todos", "Negocios", "Educación", "Creativo", "Portfolio"];

const TEMPLATES = [
  {
    name: "Pitch Deck",
    category: "Negocios",
    badge: "Popular",
    badgeColor: "#c084fc",
    accent: "#c084fc",
    bg: "linear-gradient(135deg, #0d0020 0%, #1a0040 100%)",
    preview: (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        {/* Background */}
        <rect width="320" height="200" fill="url(#pitchBg)" />
        <defs>
          <linearGradient id="pitchBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d0020" />
            <stop offset="100%" stopColor="#1a0040" />
          </linearGradient>
        </defs>
        {/* Orb */}
        <circle cx="260" cy="40" r="60" fill="#c084fc" opacity="0.08" />
        {/* Logo box */}
        <rect x="20" y="20" width="28" height="28" rx="6" fill="#c084fc" opacity="0.9" />
        <text x="34" y="38" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
        {/* Title */}
        <rect x="20" y="65" width="160" height="12" rx="3" fill="#c084fc" opacity="0.9" />
        <rect x="20" y="84" width="120" height="8" rx="2" fill="white" opacity="0.25" />
        <rect x="20" y="98" width="90" height="8" rx="2" fill="white" opacity="0.15" />
        {/* Chart bars */}
        <rect x="20" y="145" width="18" height="38" rx="3" fill="#c084fc" opacity="0.7" />
        <rect x="44" y="130" width="18" height="53" rx="3" fill="#818cf8" opacity="0.7" />
        <rect x="68" y="118" width="18" height="65" rx="3" fill="#38bdf8" opacity="0.7" />
        <rect x="92" y="122" width="18" height="61" rx="3" fill="#34d399" opacity="0.7" />
        <rect x="116" y="108" width="18" height="75" rx="3" fill="#c084fc" opacity="0.9" />
        {/* Stats */}
        <rect x="160" y="130" width="60" height="30" rx="6" fill="white" opacity="0.04" />
        <text x="190" y="147" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">+128%</text>
        <rect x="228" y="130" width="60" height="30" rx="6" fill="white" opacity="0.04" />
        <text x="258" y="147" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">$2.4M</text>
        {/* Dots */}
        <circle cx="160" cy="108" r="3" fill="#c084fc" opacity="0.6" />
        <circle cx="200" cy="95" r="3" fill="#818cf8" opacity="0.6" />
        <circle cx="240" cy="85" r="3" fill="#38bdf8" opacity="0.6" />
        <path d="M 160 108 Q 200 95 240 85" stroke="#c084fc" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="4 2" />
      </svg>
    ),
  },
  {
    name: "Neon Cyberpunk",
    category: "Creativo",
    badge: "Futurista",
    badgeColor: "#06b6d4",
    accent: "#06b6d4",
    bg: "linear-gradient(135deg, #000a1a 0%, #001020 100%)",
    preview: (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <defs>
          <linearGradient id="neonBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000a1a" />
            <stop offset="100%" stopColor="#001020" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="320" height="200" fill="url(#neonBg)" />
        {/* Grid lines */}
        {[40, 80, 120, 160, 200, 240, 280].map(x => <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#06b6d4" strokeWidth="0.3" opacity="0.15" />)}
        {[40, 80, 120, 160].map(y => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#06b6d4" strokeWidth="0.3" opacity="0.15" />)}
        {/* Neon title */}
        <rect x="20" y="30" width="200" height="18" rx="2" fill="#06b6d4" opacity="0.9" filter="url(#glow)" />
        <rect x="20" y="55" width="140" height="10" rx="2" fill="#ec4899" opacity="0.7" filter="url(#glow)" />
        {/* Glowing boxes */}
        <rect x="20" y="90" width="80" height="60" rx="4" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.8" />
        <rect x="25" y="95" width="20" height="12" rx="2" fill="#06b6d4" opacity="0.6" />
        <rect x="25" y="113" width="60" height="5" rx="1" fill="white" opacity="0.15" />
        <rect x="25" y="123" width="45" height="5" rx="1" fill="white" opacity="0.1" />
        <rect x="115" y="90" width="80" height="60" rx="4" fill="none" stroke="#ec4899" strokeWidth="1.5" opacity="0.8" />
        <circle cx="155" cy="120" r="18" fill="none" stroke="#ec4899" strokeWidth="1.5" opacity="0.7" />
        <circle cx="155" cy="120" r="8" fill="#ec4899" opacity="0.4" />
        <rect x="210" y="90" width="80" height="60" rx="4" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.8" />
        <path d="M 215 145 L 230 115 L 245 130 L 265 105 L 285 120" stroke="#a855f7" strokeWidth="1.5" fill="none" opacity="0.8" />
        {/* Bottom bar */}
        <rect x="20" y="165" width="280" height="2" rx="1" fill="#06b6d4" opacity="0.3" />
        <rect x="20" y="165" width="120" height="2" rx="1" fill="#06b6d4" opacity="0.9" filter="url(#glow)" />
      </svg>
    ),
  },
  {
    name: "Educación Moderna",
    category: "Educación",
    badge: "Nuevo",
    badgeColor: "#34d399",
    accent: "#34d399",
    bg: "linear-gradient(135deg, #001510 0%, #001a15 100%)",
    preview: (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <defs>
          <linearGradient id="eduBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#001510" />
            <stop offset="100%" stopColor="#001a15" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#eduBg)" />
        <circle cx="280" cy="30" r="50" fill="#34d399" opacity="0.06" />
        {/* Header */}
        <rect x="20" y="20" width="8" height="40" rx="2" fill="#34d399" opacity="0.9" />
        <rect x="35" y="25" width="140" height="12" rx="3" fill="white" opacity="0.85" />
        <rect x="35" y="43" width="100" height="8" rx="2" fill="#34d399" opacity="0.6" />
        {/* Content cards */}
        <rect x="20" y="80" width="85" height="100" rx="8" fill="white" opacity="0.04" />
        <rect x="28" y="90" width="30" height="30" rx="6" fill="#34d399" opacity="0.2" />
        <text x="43" y="111" textAnchor="middle" fill="#34d399" fontSize="14">📐</text>
        <rect x="28" y="128" width="60" height="6" rx="2" fill="white" opacity="0.3" />
        <rect x="28" y="140" width="45" height="5" rx="2" fill="white" opacity="0.15" />
        <rect x="28" y="152" width="50" height="5" rx="2" fill="white" opacity="0.1" />
        <rect x="115" y="80" width="85" height="100" rx="8" fill="white" opacity="0.04" />
        <rect x="123" y="90" width="30" height="30" rx="6" fill="#38bdf8" opacity="0.2" />
        <text x="138" y="111" textAnchor="middle" fill="#38bdf8" fontSize="14">🧬</text>
        <rect x="123" y="128" width="60" height="6" rx="2" fill="white" opacity="0.3" />
        <rect x="123" y="140" width="45" height="5" rx="2" fill="white" opacity="0.15" />
        <rect x="123" y="152" width="50" height="5" rx="2" fill="white" opacity="0.1" />
        <rect x="210" y="80" width="85" height="100" rx="8" fill="white" opacity="0.04" />
        <rect x="218" y="90" width="30" height="30" rx="6" fill="#c084fc" opacity="0.2" />
        <text x="233" y="111" textAnchor="middle" fill="#c084fc" fontSize="14">🔭</text>
        <rect x="218" y="128" width="60" height="6" rx="2" fill="white" opacity="0.3" />
        <rect x="218" y="140" width="45" height="5" rx="2" fill="white" opacity="0.15" />
        <rect x="218" y="152" width="50" height="5" rx="2" fill="white" opacity="0.1" />
        {/* Progress bar */}
        <rect x="20" y="60" width="280" height="4" rx="2" fill="white" opacity="0.05" />
        <rect x="20" y="60" width="180" height="4" rx="2" fill="#34d399" opacity="0.7" />
        <text x="204" y="65" fill="#34d399" fontSize="8" opacity="0.9">64%</text>
      </svg>
    ),
  },
  {
    name: "Portfolio Artista",
    category: "Portfolio",
    badge: "Premium",
    badgeColor: "#f472b6",
    accent: "#f472b6",
    bg: "linear-gradient(135deg, #1a0010 0%, #2d0020 100%)",
    preview: (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <defs>
          <linearGradient id="portBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a0010" />
            <stop offset="100%" stopColor="#2d0020" />
          </linearGradient>
          <linearGradient id="imgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#portBg)" />
        {/* Large image hero */}
        <rect x="20" y="20" width="185" height="160" rx="10" fill="url(#imgGrad)" />
        <circle cx="112" cy="100" r="35" fill="#f472b6" opacity="0.15" />
        <circle cx="112" cy="100" r="20" fill="#f472b6" opacity="0.2" />
        <text x="112" y="107" textAnchor="middle" fill="#f472b6" fontSize="18">✦</text>
        {/* Sidebar */}
        <rect x="215" y="20" width="85" height="45" rx="8" fill="white" opacity="0.03" />
        <rect x="223" y="28" width="50" height="7" rx="2" fill="white" opacity="0.6" />
        <rect x="223" y="40" width="35" height="5" rx="2" fill="#f472b6" opacity="0.7" />
        <rect x="215" y="75" width="85" height="45" rx="8" fill="white" opacity="0.03" />
        <rect x="223" y="83" width="50" height="7" rx="2" fill="white" opacity="0.4" />
        <rect x="223" y="95" width="35" height="5" rx="2" fill="white" opacity="0.2" />
        <rect x="215" y="130" width="85" height="45" rx="8" fill="#f472b6" opacity="0.08" />
        <rect x="223" y="142" width="60" height="7" rx="3" fill="#f472b6" opacity="0.8" />
        <text x="237" y="168" fill="#f472b6" fontSize="8" opacity="0.7">Ver Portfolio →</text>
        {/* Tags */}
        <rect x="20" y="188" width="55" height="0" />
      </svg>
    ),
  },
  {
    name: "Startup Launch",
    category: "Negocios",
    badge: "Hot",
    badgeColor: "#fb923c",
    accent: "#fb923c",
    bg: "linear-gradient(135deg, #0f0800 0%, #1a0e00 100%)",
    preview: (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <defs>
          <linearGradient id="startBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f0800" />
            <stop offset="100%" stopColor="#1a0e00" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#startBg)" />
        <circle cx="160" cy="200" r="100" fill="#fb923c" opacity="0.06" />
        {/* Rocket icon */}
        <text x="160" y="75" textAnchor="middle" fill="#fb923c" fontSize="36" opacity="0.9">🚀</text>
        {/* Title */}
        <rect x="60" y="90" width="200" height="16" rx="4" fill="#fb923c" opacity="0.9" />
        <rect x="80" y="113" width="160" height="10" rx="3" fill="white" opacity="0.3" />
        <rect x="100" y="130" width="120" height="8" rx="2" fill="white" opacity="0.15" />
        {/* CTA button */}
        <rect x="90" y="150" width="140" height="32" rx="16" fill="#fb923c" opacity="0.9" />
        <text x="160" y="170" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Lanzar Ahora →</text>
        {/* Stars */}
        {[[50, 30], [270, 50], [290, 150], [30, 160], [150, 20]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="#fb923c" opacity="0.4" />
        ))}
      </svg>
    ),
  },
  {
    name: "Minimalista Pro",
    category: "Creativo",
    badge: "Elegante",
    badgeColor: "#818cf8",
    accent: "#818cf8",
    bg: "linear-gradient(135deg, #08081a 0%, #0d0d20 100%)",
    preview: (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <defs>
          <linearGradient id="miniBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#08081a" />
            <stop offset="100%" stopColor="#0d0d20" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#miniBg)" />
        {/* Thin lines */}
        <line x1="40" y1="0" x2="40" y2="200" stroke="#818cf8" strokeWidth="0.5" opacity="0.1" />
        <line x1="280" y1="0" x2="280" y2="200" stroke="#818cf8" strokeWidth="0.5" opacity="0.1" />
        {/* Giant letter */}
        <text x="160" y="130" textAnchor="middle" fill="#818cf8" fontSize="100" opacity="0.06" fontWeight="900">M</text>
        {/* Content */}
        <rect x="55" y="50" width="210" height="3" rx="1" fill="white" opacity="0.7" />
        <rect x="55" y="62" width="160" height="2" rx="1" fill="white" opacity="0.3" />
        <rect x="55" y="78" width="1" height="80" fill="#818cf8" opacity="0.8" />
        <rect x="65" y="85" width="180" height="9" rx="2" fill="white" opacity="0.2" />
        <rect x="65" y="100" width="140" height="7" rx="2" fill="white" opacity="0.12" />
        <rect x="65" y="115" width="160" height="7" rx="2" fill="white" opacity="0.1" />
        <rect x="65" y="130" width="120" height="7" rx="2" fill="white" opacity="0.08" />
        {/* Small accent */}
        <circle cx="270" cy="170" r="20" fill="none" stroke="#818cf8" strokeWidth="0.8" opacity="0.4" />
        <circle cx="270" cy="170" r="12" fill="#818cf8" opacity="0.08" />
      </svg>
    ),
  },
];

export default function Templates() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = activeCategory === "Todos"
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <section id="templates" ref={ref} className="relative py-32 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030014 0%, #050020 50%, #030014 100%)" }}>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(129,140,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(129,140,248,0.25)", background: "rgba(129,140,248,0.07)", color: "#818cf8" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#818cf8" }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Galería de plantillas</span>
          </div>

          <h2 className="font-[var(--font-display)] font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0e6ff" }}>
            Empieza con estilo.
            <br />
            <span style={{
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Termina impresionando.</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "rgba(240,230,255,0.45)" }}>
            Plantillas diseñadas para cinema-editing. Cada una viene con transiciones, paleta de color y layout de escenas listo para usar.
          </p>

          {/* Category filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300"
                style={activeCategory === cat ? {
                  background: "linear-gradient(135deg, #818cf8, #c084fc)",
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(129,140,248,0.4)",
                } : {
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(240,230,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.19, 1, 0.22, 1] }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
              style={{
                background: t.bg,
                border: hovered === i ? `1px solid ${t.accent}50` : "1px solid rgba(255,255,255,0.06)",
                boxShadow: hovered === i
                  ? `0 20px 60px ${t.accent}20, 0 0 0 1px ${t.accent}20`
                  : "0 4px 24px rgba(0,0,0,0.4)",
                transform: hovered === i ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
              }}
            >
              {/* Preview area */}
              <div className="aspect-[16/10] relative overflow-hidden">
                {t.preview}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                  style={{ background: hovered === i ? `${t.accent}15` : "transparent" }}>
                  <div className="transition-all duration-400"
                    style={{ opacity: hovered === i ? 1 : 0, transform: hovered === i ? "scale(1)" : "scale(0.8)" }}>
                    <a
                      href="/cinema-editor"
                      className="px-5 py-2.5 rounded-full text-sm font-bold"
                      style={{ background: t.accent, color: "#000" }}
                    >
                      Usar plantilla →
                    </a>
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${t.accent}15` }}>
                <div>
                  <div className="font-[var(--font-display)] font-bold text-sm" style={{ color: "#f0e6ff" }}>{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(240,230,255,0.35)" }}>{t.category}</div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: `${t.badgeColor}15`, color: t.badgeColor, border: `1px solid ${t.badgeColor}30` }}>
                  {t.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <a
            href="/cinema-editor"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(129,140,248,0.08)",
              border: "1px solid rgba(129,140,248,0.25)",
              color: "#818cf8",
            }}
          >
            <span>Explorar todas las plantillas</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="mt-4 text-xs" style={{ color: "rgba(240,230,255,0.25)" }}>
            Más de 20 plantillas disponibles · Nuevas cada semana
          </p>
        </motion.div>
      </div>
    </section>
  );
}
