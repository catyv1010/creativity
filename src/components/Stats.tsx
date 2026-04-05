"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

function AnimatedCounter({ target, suffix = "", duration = 2, delay = 0 }: { target: number; suffix?: string; duration?: number; delay?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const ctrl = animate(count, target, { duration, delay, ease: [0.19, 1, 0.22, 1] });
      return () => ctrl.stop();
    }
  }, [inView, count, target, duration, delay]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v.toLocaleString() + suffix;
    });
    return unsub;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { value: 2000, suffix: "+", label: "Plantillas", desc: "profesionales" },
  { value: 50, suffix: "M+", label: "Presentaciones", desc: "creadas" },
  { value: 120, suffix: "+", label: "Paises", desc: "con usuarios" },
  { value: 99, suffix: "%", label: "Satisfaccion", desc: "de clientes" },
];

const logos = ["Google", "Microsoft", "Spotify", "Airbnb", "Netflix", "Slack", "Stripe", "Notion"];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#030014]">
      <div className="absolute inset-0 noise-animated pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.05)_0%,transparent_60%)]" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.19, 1, 0.22, 1] }}
              className="text-center">
              <div className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-[900] text-white mb-1">
                <AnimatedCounter target={s.value} suffix={s.suffix} delay={0.2 * i} />
              </div>
              <div className="text-white/40 text-sm font-medium">{s.label}</div>
              <div className="text-white/20 text-xs">{s.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Trusted by */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}>
          <p className="text-center text-white/15 text-xs uppercase tracking-[0.3em] mb-8">Empresas que confian en Creativity</p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
            {logos.map((logo, i) => (
              <motion.span key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 + i * 0.05 }}
                whileHover={{ scale: 1.1, opacity: 0.5 }}
                className="text-white/10 font-[var(--font-display)] text-sm font-bold hover:text-white/25 transition-all duration-300 cursor-default">
                {logo}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
