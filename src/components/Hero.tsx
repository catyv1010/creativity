"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-register";

registerGSAPPlugins();

const LETTER_COLORS = [
  "#f0abfc", // r
  "#c084fc", // e
  "#818cf8", // a
  "#38bdf8", // t
  "#34d399", // i
  "#fbbf24", // v
  "#fb923c", // i
  "#f472b6", // t
  "#a78bfa", // y
];

const STAR_COLORS = [
  "#f0abfc", "#c084fc", "#818cf8", "#38bdf8", "#34d399",
  "#fbbf24", "#fb923c", "#f472b6", "#e879f9", "#67e8f9",
  "#a78bfa", "#6366f1", "#06b6d4", "#ec4899",
];

function MagneticButton({
  children, className, href = "/cinema-editor", onClick,
}: {
  children: React.ReactNode; className?: string; href?: string; onClick?: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.a ref={ref} href={href} onClick={onClick} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const outerGlowRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });

  // Mouse parallax
  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 24);
      my.set((e.clientY / window.innerHeight - 0.5) * 24);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mx, my]);

  // C logo animations
  useEffect(() => {
    const gradient = gradientRef.current;
    const glow = glowRef.current;
    const outerGlow = outerGlowRef.current;
    if (!gradient || !glow) return;
    const t1 = gsap.to(gradient, { rotation: 360, duration: 4, repeat: -1, ease: "none" });
    const t2 = gsap.to(glow, { opacity: 0.9, scale: 1.5, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    const t3 = outerGlow ? gsap.to(outerGlow, { opacity: 0.55, scale: 1.7, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 }) : null;
    return () => { t1.kill(); t2.kill(); t3?.kill(); };
  }, []);

  // Star explosion with canvas + GSAP ticker
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Create stars — they explode from center outward and drift
    interface Star {
      x: number; y: number;
      vx: number; vy: number;
      size: number; color: string;
      alpha: number; alphaDir: number;
      alphaSpeed: number;
      shape: "circle" | "star4" | "star6";
      rotation: number; rotSpeed: number;
      driftX: number; driftY: number;
    }

    const STAR_COUNT = 180;
    const stars: Star[] = [];
    const cx = W / 2;
    const cy = H / 2;

    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Distance from center: spread all over screen
      const dist = 80 + Math.random() * Math.max(W, H) * 0.65;
      const speed = 0.08 + Math.random() * 0.18;
      stars.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 4.5,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        alpha: 0.2 + Math.random() * 0.7,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: 0.004 + Math.random() * 0.012,
        shape: (["circle", "star4", "star6"] as const)[Math.floor(Math.random() * 3)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        driftX: (Math.random() - 0.5) * 0.3,
        driftY: (Math.random() - 0.5) * 0.3,
      });
    }

    function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, points: number, rotation: number) {
      const outer = size;
      const inner = size * 0.4;
      ctx.beginPath();
      for (let p = 0; p < points * 2; p++) {
        const r = p % 2 === 0 ? outer : inner;
        const a = (p * Math.PI) / points + rotation;
        if (p === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
        else ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    }

    // Shooting stars
    interface Shoot { x: number; y: number; len: number; speed: number; angle: number; color: string; alpha: number; life: number; maxLife: number; }
    const shoots: Shoot[] = [];
    const spawnShoot = () => {
      const angle = (Math.random() * 40 + 20) * (Math.PI / 180); // 20–60°
      shoots.push({
        x: Math.random() * W * 0.7,
        y: Math.random() * H * 0.4,
        len: 80 + Math.random() * 120,
        speed: 8 + Math.random() * 10,
        angle,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        alpha: 0,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    };
    let shootTimer = 0;

    const ticker = gsap.ticker.add(() => {
      ctx.clearRect(0, 0, W, H);

      // Spawn shooting star periodically
      shootTimer++;
      if (shootTimer > 120 + Math.random() * 180) { spawnShoot(); shootTimer = 0; }

      // Draw shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        const progress = s.life / s.maxLife;
        s.alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
        if (s.life >= s.maxLife) { shoots.splice(i, 1); continue; }
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        grad.addColorStop(0, s.color + Math.round(s.alpha * 220).toString(16).padStart(2, "0"));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.alpha;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
        ctx.globalAlpha = 1;
        // Bright tip
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = s.alpha * 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      for (const s of stars) {
        // Twinkle
        s.alpha += s.alphaDir * s.alphaSpeed;
        if (s.alpha > 0.95) { s.alpha = 0.95; s.alphaDir = -1; }
        if (s.alpha < 0.1) { s.alpha = 0.1; s.alphaDir = 1; }

        // Slow drift
        s.x += s.vx + s.driftX * 0.01;
        s.y += s.vy + s.driftY * 0.01;
        s.rotation += s.rotSpeed;

        // Wrap around screen edges
        if (s.x < -50) s.x = W + 50;
        if (s.x > W + 50) s.x = -50;
        if (s.y < -50) s.y = H + 50;
        if (s.y > H + 50) s.y = -50;

        // Glow: larger soft circle behind
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3.5);
        gradient.addColorStop(0, s.color + Math.round(s.alpha * 80).toString(16).padStart(2, "0"));
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core shape
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        if (s.shape === "circle") {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.shape === "star4") {
          drawStar(ctx, s.x, s.y, s.size, 4, s.rotation);
        } else {
          drawStar(ctx, s.x, s.y, s.size, 6, s.rotation);
        }
        ctx.globalAlpha = 1;
      }
    });

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030014]">
      {/* Deep space radial backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(120,40,200,0.22)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(242,88,62,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(6,182,212,0.07)_0%,transparent_40%)]" />
      <div className="absolute inset-0 noise-animated pointer-events-none" />

      {/* Star explosion canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Mouse parallax orbs */}
      <motion.div style={{ x: sx, y: sy, zIndex: 2 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] -top-[15%] -left-[10%] rounded-full bg-purple/8 blur-[120px]"
          style={{ animation: "morphBlob1 18s ease-in-out infinite" }} />
        <div className="absolute w-[500px] h-[500px] top-[10%] -right-[8%] rounded-full bg-coral/8 blur-[120px]"
          style={{ animation: "morphBlob2 22s ease-in-out infinite" }} />
      </motion.div>

      {/* CONTENT */}
      <div className="relative text-center px-6 max-w-5xl mx-auto" style={{ zIndex: 10 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 mb-12 bg-white/[0.03] backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
          </span>
          <span className="text-white/50 text-sm font-medium">Potenciado por Inteligencia Artificial</span>
        </motion.div>

        {/* BIG C + reativity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-6"
          style={{ perspective: "800px" }}
        >
          {/* Giant C icon — same design as AnimatedLogo but huge */}
          <div className="relative flex-shrink-0" style={{ width: 240, height: 240, transformStyle: "preserve-3d" }}>
            {/* Outer diffuse glow */}
            <div ref={outerGlowRef} className="absolute opacity-30" style={{
              inset: -32, borderRadius: 52,
              background: "radial-gradient(circle, rgba(192,132,252,0.22) 0%, rgba(56,189,248,0.16) 40%, rgba(52,211,153,0.1) 70%, transparent 90%)",
              filter: "blur(36px)",
            }} />
            {/* Inner tight glow */}
            <div ref={glowRef} className="absolute opacity-75" style={{
              inset: -10, borderRadius: 38,
              background: "linear-gradient(135deg, #e879f9, #a855f7, #6366f1, #06b6d4)",
              filter: "blur(22px)",
            }} />
            {/* Spinning conic gradient border — thicker */}
            <div ref={gradientRef} className="absolute" style={{
              inset: -4, borderRadius: 34,
              background: "conic-gradient(from 0deg, #f0abfc, #c084fc, #818cf8, #38bdf8, #34d399, #fbbf24, #f472b6, #e879f9, #f0abfc)",
            }} />
            {/* Dark inner background */}
            <div className="absolute flex items-center justify-center" style={{
              inset: 5, borderRadius: 30,
              background: "linear-gradient(145deg, #0d001f, #040010)",
            }}>
              <span className="font-[var(--font-display)] font-[900] select-none" style={{
                fontSize: 138,
                lineHeight: 1,
                background: "linear-gradient(135deg, #f0abfc 0%, #c084fc 35%, #818cf8 65%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 16px #c084fc) drop-shadow(0 0 36px #818cf8)",
              }}>C</span>
            </div>
          </div>

          {/* reativity — colored letters, static */}
          <span className="font-[var(--font-display)] font-[900] leading-none tracking-[-0.04em] select-none"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}>
            {"reativity".split("").map((char, i) => (
              <span key={i} style={{
                color: LETTER_COLORS[i],
                textShadow: `0 0 24px ${LETTER_COLORS[i]}aa, 0 0 50px ${LETTER_COLORS[i]}44`,
                display: "inline-block",
              }}>{char}</span>
            ))}
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="font-[var(--font-display)] font-[800] leading-none tracking-[-0.02em] mb-8"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", color: "rgba(255,255,255,0.7)" }}
        >
          Crea sin límites
        </motion.div>

        {/* Floating stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex items-center justify-center gap-3 flex-wrap mb-10"
        >
          {[
            { icon: "∞", label: "Canvas infinito", color: "#34d399" },
            { icon: "✦", label: "8 transiciones cinemáticas", color: "#c084fc" },
            { icon: "⚡", label: "IA Generativa", color: "#38bdf8" },
            { icon: "🎬", label: "Exporta en HD", color: "#fb923c" },
          ].map((pill, i) => (
            <motion.div
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{
                background: `${pill.color}12`,
                border: `1px solid ${pill.color}30`,
                color: pill.color,
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            >
              <span style={{ fontSize: 11 }}>{pill.icon}</span>
              {pill.label}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-base sm:text-lg text-white/35 max-w-xl mx-auto mb-14 font-light leading-relaxed"
        >
          La plataforma de presentaciones que{" "}
          <span className="text-white/60 font-medium">rompe con todo lo establecido</span>.
          <br className="hidden sm:block" />
          Canvas infinito. IA generativa. Transiciones cinematograficas.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
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
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("demo-video");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="hoverable group relative px-8 py-5 rounded-2xl border border-white/10 font-bold text-lg overflow-hidden inline-block"
          >
            <span className="relative z-10 flex items-center gap-3 text-white/50 group-hover:text-white transition-colors duration-300">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" />
              </svg>
              Despierta tu creatividad
            </span>
            <div className="absolute inset-0 bg-white/[0.04] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/10 text-[10px] uppercase tracking-[0.3em]"
        style={{ zIndex: 10 }}>
        Scroll para descubrir
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ zIndex: 10 }}>
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
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/5 bg-black/30 backdrop-blur-sm py-2.5" style={{ zIndex: 10 }}>
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
