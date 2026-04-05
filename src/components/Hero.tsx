"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-register";

registerGSAPPlugins();

// Colores del espectro para cada letra de "Creativity"
const LETTER_COLORS = [
  "#f0abfc", // C — lila brillante
  "#c084fc", // r — violeta
  "#818cf8", // e — índigo
  "#38bdf8", // a — cian
  "#34d399", // t — esmeralda
  "#fbbf24", // i — ámbar
  "#fb923c", // v — naranja
  "#f472b6", // i — rosa
  "#e879f9", // t — fucsia
  "#a78bfa", // y — lavanda
];

// Colores alternativos al hacer hover
const HOVER_COLORS = [
  "#06b6d4", "#f472b6", "#fbbf24", "#a855f7",
  "#ec4899", "#38bdf8", "#34d399", "#f97316", "#c084fc", "#818cf8",
];

function MagneticButton({
  children,
  className,
  href = "/cinema-editor",
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });

  const lettersRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 30);
      my.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mx, my]);

  useEffect(() => {
    if (!lettersRef.current) return;
    const spans = lettersRef.current.querySelectorAll<HTMLSpanElement>(".hero-letter");

    // 1) Entrada espectacular: cada letra entra desde abajo con stagger
    gsap.fromTo(
      spans,
      { y: 120, opacity: 0, rotateX: -80, scale: 0.6 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.4)",
        stagger: 0.06,
        delay: 0.3,
      }
    );

    // 2) Flotación continua — cada letra flota con un offset diferente
    spans.forEach((span, i) => {
      gsap.to(span, {
        y: `${-8 - (i % 3) * 4}`,
        duration: 2.2 + i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.12,
      });
    });

    // 3) Hover: cambiar color al color alternativo y volver
    spans.forEach((span, i) => {
      const baseColor = LETTER_COLORS[i] ?? "#fff";
      const hoverColor = HOVER_COLORS[i] ?? "#c084fc";

      span.addEventListener("mouseenter", () => {
        gsap.to(span, {
          color: hoverColor,
          scale: 1.3,
          duration: 0.15,
          ease: "power2.out",
          overwrite: true,
        });
        // Brillo al hacer hover
        gsap.to(span, {
          textShadow: `0 0 30px ${hoverColor}cc, 0 0 60px ${hoverColor}66`,
          duration: 0.15,
        });
      });

      span.addEventListener("mouseleave", () => {
        gsap.to(span, {
          color: baseColor,
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          overwrite: false,
        });
        gsap.to(span, {
          textShadow: `0 0 20px ${baseColor}88, 0 0 40px ${baseColor}44`,
          duration: 1.2,
        });
      });
    });

    return () => {
      gsap.killTweensOf(spans);
    };
  }, []);

  // Spotlight que sigue el mouse
  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;
    const move = (e: MouseEvent) => {
      gsap.to(spot, {
        x: e.clientX - 200,
        y: e.clientY - 200,
        duration: 0.8,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030014]">
      {/* Radial lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,40,200,0.18)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(242,88,62,0.12)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(6,182,212,0.08)_0%,transparent_40%)]" />
      <div className="absolute inset-0 noise-animated pointer-events-none" />

      {/* Mouse spotlight */}
      <div
        ref={spotRef}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 70%)",
          top: 0,
          left: 0,
          filter: "blur(20px)",
        }}
      />

      {/* Mouse-following orbs */}
      <motion.div style={{ x: sx, y: sy }} className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-[10%] -left-[8%] rounded-full bg-purple/10 blur-[100px]"
          style={{ animation: "morphBlob1 18s ease-in-out infinite" }} />
        <div className="absolute w-[400px] h-[400px] top-[20%] -right-[5%] rounded-full bg-coral/10 blur-[100px]"
          style={{ animation: "morphBlob2 22s ease-in-out infinite" }} />
        <div className="absolute w-[300px] h-[300px] bottom-[5%] left-[25%] rounded-full bg-cyan/6 blur-[80px]" />
      </motion.div>

      {/* Geometric elements */}
      <motion.svg className="absolute top-[14%] left-[7%] w-20 h-20 opacity-20 pointer-events-none" viewBox="0 0 80 80" fill="none"
        animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        <circle cx="40" cy="40" r="35" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="6 4" />
      </motion.svg>
      <motion.svg className="absolute top-[10%] right-[9%] w-28 h-28 opacity-15 pointer-events-none" viewBox="0 0 120 120" fill="none"
        animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        <rect x="20" y="20" width="80" height="80" rx="6" stroke="#F2583E" strokeWidth="0.8" />
      </motion.svg>
      <motion.svg className="absolute bottom-[22%] left-[6%] w-24 h-24 opacity-15 pointer-events-none" viewBox="0 0 100 100" fill="none"
        animate={{ y: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity }}>
        <polygon points="50,10 90,90 10,90" stroke="#f59e0b" strokeWidth="0.8" />
      </motion.svg>
      <motion.svg className="absolute bottom-[28%] right-[7%] w-20 h-20 opacity-15 pointer-events-none" viewBox="0 0 90 90" fill="none"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 0] }} transition={{ duration: 12, repeat: Infinity }}>
        <polygon points="45,5 85,27 85,63 45,85 5,63 5,27" stroke="#06b6d4" strokeWidth="0.8" />
      </motion.svg>

      {/* Breathing dots */}
      {[
        { p: "top-[30%] left-[18%]", c: "bg-purple/40" },
        { p: "top-[55%] right-[22%]", c: "bg-coral/40" },
        { p: "top-[70%] left-[60%]", c: "bg-cyan/30" },
      ].map((d, i) => (
        <motion.div key={i} className={`absolute w-1.5 h-1.5 rounded-full ${d.c} ${d.p} pointer-events-none`}
          animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }} />
      ))}

      {/* Particles */}
      {[
        { l: 12, w: 2.4, h: 3.1, o: 0.3, dd: 1.2, du: 9 },
        { l: 24, w: 3.2, h: 2.6, o: 0.4, dd: 3.5, du: 11 },
        { l: 35, w: 2.8, h: 3.5, o: 0.35, dd: 5.8, du: 13 },
        { l: 45, w: 3.6, h: 2.2, o: 0.45, dd: 0.5, du: 10 },
        { l: 55, w: 2.1, h: 3.8, o: 0.28, dd: 7.2, du: 15 },
        { l: 65, w: 3.4, h: 2.9, o: 0.38, dd: 2.8, du: 12 },
        { l: 18, w: 2.6, h: 3.3, o: 0.32, dd: 9.1, du: 14 },
        { l: 73, w: 3.1, h: 2.4, o: 0.42, dd: 4.4, du: 8.5 },
        { l: 82, w: 2.3, h: 3.6, o: 0.36, dd: 6.6, du: 16 },
        { l: 40, w: 3.8, h: 2.7, o: 0.33, dd: 8.3, du: 11.5 },
        { l: 58, w: 2.9, h: 3.0, o: 0.41, dd: 1.8, du: 13.5 },
        { l: 30, w: 3.3, h: 2.5, o: 0.29, dd: 10.5, du: 9.5 },
      ].map((p, i) => (
        <div key={i} className="particle" style={{
          left: `${p.l}%`, bottom: "-3%", width: p.w, height: p.h,
          background: ["#a855f7", "#ec4899", "#06b6d4", "#f59e0b", "#F2583E"][i % 5],
          opacity: p.o, animationDelay: `${p.dd}s`, animationDuration: `${p.du}s`,
        }} />
      ))}

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 mb-10 bg-white/[0.03] backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
          </span>
          <span className="text-white/50 text-sm font-medium">Potenciado por Inteligencia Artificial</span>
        </motion.div>

        {/* CREATIVITY — letras de colores con GSAP */}
        <div
          ref={lettersRef}
          className="font-[var(--font-display)] font-[900] leading-none tracking-[-0.04em] mb-5 select-none"
          style={{
            fontSize: "clamp(4rem, 14vw, 11rem)",
            perspective: "800px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          {"Creativity".split("").map((char, i) => (
            <span
              key={i}
              className="hero-letter inline-block cursor-cell"
              style={{
                color: LETTER_COLORS[i],
                textShadow: `0 0 20px ${LETTER_COLORS[i]}88, 0 0 40px ${LETTER_COLORS[i]}44`,
                opacity: 0, // GSAP lo anima a 1
                display: "inline-block",
                transformStyle: "preserve-3d",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="font-[var(--font-display)] font-[800] leading-none tracking-[-0.02em] mb-10"
          style={{ fontSize: "clamp(1.5rem, 4.5vw, 3rem)", color: "rgba(255,255,255,0.65)" }}
        >
          Crea sin límites
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-base sm:text-lg text-white/35 max-w-xl mx-auto mb-14 font-light leading-relaxed"
        >
          La plataforma de presentaciones que{" "}
          <span className="text-white/60 font-medium">rompe con todo lo establecido</span>.
          <br className="hidden sm:block" />
          Canvas infinito. IA generativa. Transiciones cinematograficas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <MagneticButton className="hoverable group relative px-10 py-5 rounded-2xl bg-white text-black font-extrabold text-lg overflow-hidden inline-block">
            <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-white">
              Crea tu primera presentacion
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-coral to-magenta scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </MagneticButton>

          <MagneticButton
            href="#demo-video"
            className="hoverable group relative px-8 py-5 rounded-2xl border border-white/10 font-bold text-lg overflow-hidden inline-block"
          >
            <span className="relative z-10 flex items-center gap-3 text-white/50 group-hover:text-white transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" />
              </svg>
              Despierta tu creatividad
            </span>
            <div className="absolute inset-0 bg-white/[0.04] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Interactive hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/10 text-[10px] uppercase tracking-[0.3em] z-10"
      >
        Pasa el mouse sobre el titulo
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2">
          <span className="text-white/15 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
            <motion.div animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-0.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/5 bg-black/30 backdrop-blur-sm py-2.5">
        <div className="marquee-left whitespace-nowrap flex" style={{ "--speed": "30s" } as React.CSSProperties}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-4 text-[11px] font-semibold uppercase tracking-[0.25em]">
              <span className="text-white/15">Canvas Infinito</span><span className="text-coral/25">—</span>
              <span className="text-white/15">IA Generativa</span><span className="text-purple/25">—</span>
              <span className="text-white/15">Transiciones 3D</span><span className="text-cyan/25">—</span>
              <span className="text-white/15">100+ Plantillas</span><span className="text-gold/25">—</span>
              <span className="text-white/15">Colaboracion</span><span className="text-magenta/25">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
