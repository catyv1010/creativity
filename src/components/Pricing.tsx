"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  {
    name: "Gratis",
    price: "$0",
    period: "para siempre",
    desc: "Explora el canvas infinito y crea tus primeras presentaciones cinematográficas.",
    features: [
      "3 presentaciones activas",
      "Plantillas básicas",
      "Canvas infinito",
      "Exportar a PDF",
      "10 generaciones de IA / mes",
    ],
    cta: "Comenzar Gratis",
    accent: "#818cf8",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/mes",
    desc: "Para creadores que quieren presentaciones de otro nivel, con todo desbloqueado.",
    features: [
      "Presentaciones ilimitadas",
      "Todas las plantillas premium",
      "Canvas + colaboración",
      "Todas las transiciones cinemáticas",
      "IA ilimitada",
      "Exportar PDF, PPTX, video",
      "Marca personalizada",
      "Sin marca de agua",
    ],
    cta: "Comenzar con Pro",
    accent: "#c084fc",
    popular: true,
  },
  {
    name: "Teams",
    price: "$19.99",
    period: "/usuario/mes",
    desc: "Para equipos que crean juntos y necesitan control, analíticas y soporte.",
    features: [
      "Todo lo de Pro",
      "Workspace de equipo",
      "Colaboración tiempo real",
      "Biblioteca compartida",
      "Roles y permisos",
      "Analytics avanzado",
      "Soporte 24/7 prioritario",
    ],
    cta: "Contactar Ventas",
    accent: "#38bdf8",
    popular: false,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="relative py-32 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #030014 0%, #08001a 50%, #030014 100%)" }}>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(192,132,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(192,132,252,0.08) 0%, transparent 70%)" }} />

      <div ref={ref} className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(192,132,252,0.25)", background: "rgba(192,132,252,0.07)", color: "#c084fc" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c084fc" }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Planes</span>
          </div>

          <h2 className="font-[var(--font-display)] font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0e6ff" }}>
            Invierte en tu
            <br />
            <span style={{
              background: "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #38bdf8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>creatividad.</span>
          </h2>
          <p className="text-lg" style={{ color: "rgba(240,230,255,0.4)" }}>
            Comienza gratis. Escala cuando estés listo.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.12 * i, ease: [0.19, 1, 0.22, 1] }}
              className="relative rounded-2xl p-6 transition-all duration-500"
              style={plan.popular ? {
                background: `linear-gradient(145deg, ${plan.accent}12 0%, rgba(255,255,255,0.03) 100%)`,
                border: `1px solid ${plan.accent}40`,
                boxShadow: `0 0 40px ${plan.accent}15, 0 20px 60px rgba(0,0,0,0.4)`,
                marginTop: "-8px",
              } : {
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: `linear-gradient(135deg, ${plan.accent}, #818cf8)`, color: "#fff" }}>
                  Más Popular
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-5">
                <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                  style={{ color: plan.accent }}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-[var(--font-display)] font-black"
                    style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", color: "#f0e6ff" }}>
                    {plan.price}
                  </span>
                  <span className="text-sm" style={{ color: "rgba(240,230,255,0.3)" }}>{plan.period}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,230,255,0.4)" }}>{plan.desc}</p>
              </div>

              {/* Divider */}
              <div className="mb-5 h-px" style={{ background: `linear-gradient(90deg, ${plan.accent}30, transparent)` }} />

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f, j) => (
                  <motion.li
                    key={j}
                    className="flex items-start gap-2.5 text-sm"
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.06 + j * 0.03 }}
                  >
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                      style={{ color: plan.accent }}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: "rgba(240,230,255,0.55)" }}>{f}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.name === "Teams" ? "#" : "/cinema-editor"}
                className="block w-full text-center py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={plan.popular ? {
                  background: `linear-gradient(135deg, ${plan.accent}, #818cf8)`,
                  color: "#fff",
                  boxShadow: `0 4px 20px ${plan.accent}40`,
                } : {
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${plan.accent}30`,
                  color: plan.accent,
                }}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 text-xs"
          style={{ color: "rgba(240,230,255,0.2)" }}
        >
          Sin tarjeta de crédito · Cancela cuando quieras · SSL seguro
        </motion.p>
      </div>
    </section>
  );
}
