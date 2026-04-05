"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const INCLUDED = [
  "Canvas infinito 2D / 3D",
  "Todas las transiciones cinematográficas",
  "Quizzes interactivos y gamificación",
  "Biblioteca de plantillas",
  "Exportar a HTML interactivo",
  "Animaciones GSAP (20+ presets)",
  "Subir imágenes y GIFs",
  "Modo presentación fullscreen",
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="pricing"
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030014 0%, #08001a 50%, #030014 100%)" }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(192,132,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(192,132,252,0.08) 0%, transparent 70%)" }}
      />

      <div ref={ref} className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(192,132,252,0.25)", background: "rgba(192,132,252,0.07)", color: "#c084fc" }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#c084fc" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Beta abierta</span>
          </div>

          <h2
            className="font-[var(--font-display)] font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#f0e6ff" }}
          >
            Gratis mientras
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              dure la beta.
            </span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(240,230,255,0.45)" }}>
            Creativity está en beta abierta. Todo lo que ves está disponible sin costo.
            Los planes de pago llegarán más adelante — y los beta users tendrán ventajas especiales.
          </p>
        </motion.div>

        {/* Big free card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="relative rounded-2xl p-8 mb-8"
          style={{
            background: "linear-gradient(145deg, rgba(192,132,252,0.1) 0%, rgba(129,140,248,0.06) 100%)",
            border: "1px solid rgba(192,132,252,0.3)",
            boxShadow: "0 0 60px rgba(192,132,252,0.1), 0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* GRATIS badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest"
            style={{ background: "linear-gradient(135deg, #c084fc, #818cf8)", color: "#fff", boxShadow: "0 0 20px rgba(192,132,252,0.5)" }}>
            100% Gratis ahora
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 pt-2">
            <div>
              <div className="font-[var(--font-display)] font-black mb-1"
                style={{ fontSize: "clamp(3rem, 6vw, 4rem)", color: "#f0e6ff", lineHeight: 1 }}>
                $0
              </div>
              <div className="text-sm" style={{ color: "rgba(240,230,255,0.4)" }}>
                durante la beta — sin tarjeta de crédito
              </div>
            </div>
            <a
              href="/cinema-editor"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 hover:-translate-y-0.5 whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #c084fc, #818cf8)",
                color: "#fff",
                boxShadow: "0 4px 30px rgba(192,132,252,0.4)",
              }}
            >
              Crear gratis ahora
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px" style={{ background: "linear-gradient(90deg, rgba(192,132,252,0.3), transparent)" }} />

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INCLUDED.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2.5 text-sm"
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ color: "#c084fc" }}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: "rgba(240,230,255,0.6)" }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming soon note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center rounded-xl py-5 px-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-sm" style={{ color: "rgba(240,230,255,0.35)" }}>
            🚀 <span className="font-semibold" style={{ color: "rgba(240,230,255,0.6)" }}>Planes Pro y Teams</span> — en camino.
            Únete ahora y tendrás precio especial de early adopter cuando lancemos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
