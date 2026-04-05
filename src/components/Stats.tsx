"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  { icon: "🎬", value: "8+", label: "Transiciones", desc: "dolly-zoom, iris, whip-pan..." },
  { icon: "✦", value: "20+", label: "Animaciones", desc: "GSAP presets cinematográficos" },
  { icon: "∞", value: "∞", label: "Canvas", desc: "espacio infinito 2D / 3D" },
  { icon: "⚡", value: "0", label: "Límites", desc: "de escenas o elementos" },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#030014]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.05)_0%,transparent_60%)]" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        {/* Feature highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <div
                className="font-[var(--font-display)] text-4xl sm:text-5xl font-[900] mb-1"
                style={{
                  background: "linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {f.value}
              </div>
              <div className="text-white/50 text-sm font-semibold">{f.label}</div>
              <div className="text-white/20 text-xs mt-0.5">{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="text-center text-white/15 text-xs uppercase tracking-[0.3em] mb-8">
            Construido con tecnología de primer nivel
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
            {["GSAP", "Next.js", "React 19", "TypeScript", "Zustand", "Tailwind", "Tiptap", "Framer Motion"].map(
              (tech, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  whileHover={{ scale: 1.1, opacity: 0.5 }}
                  className="text-white/15 font-[var(--font-display)] text-sm font-bold hover:text-white/40 transition-all duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
