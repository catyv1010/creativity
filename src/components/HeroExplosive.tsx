"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import AnimatedLogo from "./AnimatedLogo";

const FEATURES = [
  { icon: "✦", label: "Cámara cinematográfica", color: "#c084fc" },
  { icon: "⚡", label: "IA que genera slides", color: "#38bdf8" },
  { icon: "🎬", label: "Transiciones dolly-zoom, iris", color: "#f472b6" },
  { icon: "∞", label: "Canvas infinito 2D/3D", color: "#34d399" },
  { icon: "↗", label: "Exportar HTML & PDF", color: "#fbbf24" },
  { icon: "◈", label: "20+ animaciones GSAP", color: "#fb923c" },
];

const MOCKUP_SCENES = [
  { bg: "from-violet-900/80 to-purple-900/80", accent: "#c084fc", title: "Lanza tu startup", sub: "Pitches que impactan" },
  { bg: "from-cyan-900/80 to-blue-900/80", accent: "#38bdf8", title: "Educación viva", sub: "Clases interactivas" },
  { bg: "from-rose-900/80 to-pink-900/80", accent: "#f472b6", title: "Portfolio visual", sub: "Muestra tu trabajo" },
];

export default function HeroExplosive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Orb animations
    if (orb1Ref.current) gsap.to(orb1Ref.current, { x: 40, y: -30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    if (orb2Ref.current) gsap.to(orb2Ref.current, { x: -50, y: 40, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
    if (orb3Ref.current) gsap.to(orb3Ref.current, { x: 30, y: 50, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });

    // Mockup float
    if (mockupRef.current) gsap.to(mockupRef.current, { y: -16, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16"
      style={{ background: "radial-gradient(ellipse 100% 80% at 50% 0%, #1a003a 0%, #030014 60%)" }}
    >
      {/* Background orbs */}
      <div ref={orb1Ref} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,132,252,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div ref={orb2Ref} className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.14) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div ref={orb3Ref} className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)", filter: "blur(70px)" }} />

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(192,132,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Badge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
        style={{ borderColor: "rgba(192,132,252,0.3)", background: "rgba(192,132,252,0.08)" }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#c084fc", boxShadow: "0 0 8px #c084fc" }} />
        <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#c084fc" }}>
          La presentación del futuro ya llegó
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center font-[var(--font-display)] font-black leading-none mb-6 max-w-5xl"
        style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
        <span style={{ color: "#f0e6ff" }}>Presenta como </span>
        <span style={{
          background: "linear-gradient(135deg, #f0abfc 0%, #c084fc 25%, #818cf8 50%, #38bdf8 75%, #34d399 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>director</span>
        <br />
        <span style={{ color: "#f0e6ff" }}>de cine</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-2xl mb-10 text-lg leading-relaxed"
        style={{ color: "rgba(240,230,255,0.55)" }}>
        La única plataforma donde la cámara cinematográfica <em>es</em> la narrativa.
        Canvas infinito, transiciones dolly-zoom, IA integrada. Entre Gamma, Genially y Canva — pero mejor.
      </motion.p>

      {/* CTAs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-16">
        <a href="/cinema-editor"
          className="group relative px-8 py-4 rounded-full font-bold text-base overflow-hidden transition-transform hover:scale-105"
          style={{ background: "linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)", color: "#fff", boxShadow: "0 0 30px rgba(192,132,252,0.4), 0 0 60px rgba(129,140,248,0.2)" }}>
          <span className="relative z-10 flex items-center gap-2">
            Crear gratis ahora
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #e879f9, #a855f7, #6366f1)" }} />
        </a>
        <a href="#features"
          className="px-8 py-4 rounded-full font-bold text-base border transition-all hover:scale-105"
          style={{ borderColor: "rgba(192,132,252,0.3)", color: "rgba(240,230,255,0.7)", background: "rgba(192,132,252,0.06)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,252,0.6)"; (e.currentTarget as HTMLElement).style.color = "#f0e6ff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,252,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(240,230,255,0.7)"; }}>
          Ver cómo funciona ↓
        </a>
      </motion.div>

      {/* Editor Mockup */}
      <motion.div ref={mockupRef} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative w-full max-w-5xl"
        style={{ perspective: "1200px" }}>
        {/* Glow behind mockup */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(192,132,252,0.3) 0%, transparent 70%)", filter: "blur(40px)", transform: "translateY(20px)" }} />

        {/* Browser frame */}
        <div className="relative rounded-2xl overflow-hidden border"
          style={{ borderColor: "rgba(192,132,252,0.2)", background: "#0a0015", boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)" }}>

          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#f472b6", boxShadow: "0 0 6px #f472b6" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#fbbf24", boxShadow: "0 0 6px #fbbf24" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
            </div>
            <div className="flex-1 mx-3 px-3 py-1 rounded-md text-xs text-center" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
              creativity.app/editor
            </div>
          </div>

          {/* Editor UI mockup */}
          <div className="flex" style={{ height: "420px" }}>
            {/* Left sidebar - scenes */}
            <div className="w-40 flex-shrink-0 border-r flex flex-col gap-2 p-2" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}>
              <div className="text-xs px-2 py-1 mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Escenas</div>
              {MOCKUP_SCENES.map((scene, i) => (
                <div key={i} className={`rounded-lg p-2 cursor-pointer relative overflow-hidden transition-all ${i === 0 ? "ring-1" : "opacity-60 hover:opacity-100"}`}
                  style={{ background: `linear-gradient(135deg, ${scene.bg.replace("from-", "").replace(" to-", ", ").replace("/80", "")})`, ...(i === 0 ? { ringColor: scene.accent } : {}) }}>
                  <div className="text-xs font-bold" style={{ color: scene.accent }}>{i + 1}</div>
                  <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.7)" }}>{scene.title}</div>
                </div>
              ))}
              <div className="mt-auto mx-2 py-2 rounded-lg border border-dashed text-center text-xs cursor-pointer transition-colors hover:border-purple-500/40"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>+ Escena</div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative flex items-center justify-center p-4"
              style={{ background: "radial-gradient(ellipse at center, rgba(192,132,252,0.05) 0%, transparent 70%)" }}>
              {/* Scene card */}
              <div className="relative rounded-xl overflow-hidden w-full max-w-lg aspect-video shadow-2xl"
                style={{ background: "linear-gradient(135deg, #1a003a 0%, #0d001f 50%, #001a2e 100%)", border: "1px solid rgba(192,132,252,0.2)" }}>
                {/* Decorative elements inside scene */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
                  <div className="w-12 h-1 rounded-full" style={{ background: "linear-gradient(90deg, #c084fc, #818cf8)" }} />
                  <div className="text-2xl font-black text-center font-[var(--font-display)]" style={{ color: "#f0e6ff" }}>
                    Lanza tu startup
                  </div>
                  <div className="text-sm text-center" style={{ color: "rgba(240,230,255,0.5)" }}>
                    Pitches que capturan inversores
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: "linear-gradient(135deg, #c084fc, #818cf8)", color: "#fff" }}>
                      Comenzar
                    </div>
                  </div>
                </div>
                {/* Floating decorative shapes */}
                <div className="absolute top-3 right-4 w-8 h-8 rounded-full opacity-30"
                  style={{ background: "radial-gradient(circle, #c084fc, transparent)", filter: "blur(4px)" }} />
                <div className="absolute bottom-4 left-4 w-6 h-6 rounded opacity-20"
                  style={{ background: "#38bdf8", filter: "blur(3px)" }} />
              </div>

              {/* Camera path indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.2)", color: "#c084fc" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c084fc" }} />
                Cámara · Dolly Zoom
              </div>
            </div>

            {/* Right panel */}
            <div className="w-48 flex-shrink-0 border-l flex flex-col gap-3 p-3" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}>
              <div className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>Propiedades</div>
              {/* Animation preset selector */}
              <div className="rounded-lg p-2" style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.15)" }}>
                <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Animación</div>
                <div className="text-xs font-bold" style={{ color: "#c084fc" }}>✦ Cinematic Zoom</div>
              </div>
              {/* Transition selector */}
              <div className="rounded-lg p-2" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)" }}>
                <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Transición</div>
                <div className="text-xs font-bold" style={{ color: "#38bdf8" }}>🎬 Iris</div>
              </div>
              {/* Color swatches */}
              <div>
                <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Color</div>
                <div className="flex flex-wrap gap-1.5">
                  {["#c084fc","#818cf8","#38bdf8","#34d399","#fbbf24","#f472b6","#fb923c","#f0abfc"].map(c => (
                    <div key={c} className="w-4 h-4 rounded-full cursor-pointer hover:scale-125 transition-transform"
                      style={{ background: c, boxShadow: `0 0 6px ${c}88` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature pills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
        className="flex flex-wrap justify-center gap-3 mt-12 max-w-3xl">
        {FEATURES.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.08 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: `${f.color}10`, border: `1px solid ${f.color}25`, color: f.color }}>
            <span>{f.icon}</span>
            {f.label}
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="flex gap-10 mt-14 pt-10 border-t w-full max-w-lg justify-center"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {[
          { n: "8+", label: "Transiciones cine" },
          { n: "20+", label: "Presets animación" },
          { n: "∞", label: "Canvas infinito" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl font-black font-[var(--font-display)]" style={{
              background: "linear-gradient(135deg, #c084fc, #818cf8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>{s.n}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(240,230,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
