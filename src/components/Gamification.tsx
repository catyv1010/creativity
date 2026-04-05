"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Escape Room Preview ────────────────────────────────────────────────────
function EscapeRoomPreview() {
  const [phase, setPhase] = useState(0); // 0=locked, 1=clue, 2=open
  const [timer, setTimer] = useState(45);
  const clues = ["Busca el símbolo ◆", "Clave: ROJ0-7734", "¡Sala desbloqueada!"];

  useEffect(() => {
    const t = setInterval(() => setTimer((v) => (v > 0 ? v - 1 : 45)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPhase((v) => (v + 1) % 3), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0018 0%, #1a0030 100%)" }}>
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full"
          style={{ left: `${10 + i * 7.5}%`, top: `${20 + (i % 4) * 18}%`, background: i % 3 === 0 ? "#c084fc" : i % 3 === 1 ? "#818cf8" : "#f472b6", opacity: 0.4 }}
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }} />
      ))}

      {/* Timer bar */}
      <div className="absolute top-4 left-4 right-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-purple-300/60 uppercase tracking-widest">Tiempo</span>
          <motion.span className="text-[11px] font-bold font-mono"
            animate={{ color: timer < 15 ? ["#f472b6", "#ef4444"] : ["#c084fc", "#818cf8"] }}
            transition={{ duration: 0.8, repeat: Infinity }}>
            {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
          </motion.span>
        </div>
        <div className="h-1 rounded-full bg-white/5">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${(timer / 45) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {/* Lock icon */}
      <motion.div className="relative mb-4"
        animate={{ scale: phase === 2 ? [1, 1.2, 1] : [1, 1.04, 1], rotate: phase === 2 ? [0, -8, 8, 0] : 0 }}
        transition={{ duration: 0.6, delay: phase === 2 ? 0 : 0 }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
          style={{ background: phase === 2 ? "rgba(52,211,153,0.15)" : "rgba(192,132,252,0.12)", border: `1.5px solid ${phase === 2 ? "rgba(52,211,153,0.4)" : "rgba(192,132,252,0.3)"}`, boxShadow: phase === 2 ? "0 0 30px rgba(52,211,153,0.3)" : "0 0 20px rgba(192,132,252,0.2)" }}>
          {phase === 2
            ? <svg className="w-7 h-7" style={{ color: "#34d399" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            : <svg className="w-7 h-7" style={{ color: "#c084fc" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          }
        </div>
        {phase === 2 && (
          <motion.div className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: "0 0 40px rgba(52,211,153,0.5)" }}
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: 2 }} />
        )}
      </motion.div>

      {/* Clue bubble */}
      <AnimatePresence mode="wait">
        <motion.div key={phase}
          initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="px-4 py-2 rounded-xl text-center"
          style={{ background: phase === 2 ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${phase === 2 ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.06)"}` }}>
          <p className="text-[11px] font-bold" style={{ color: phase === 2 ? "#34d399" : "#c084fc" }}>{clues[phase]}</p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-4 h-4 rounded flex items-center justify-center text-[8px]"
              style={{ background: i < phase ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${i < phase ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`, color: i < phase ? "#34d399" : "#ffffff30" }}>
              {i < phase ? "✓" : (i + 1)}
            </div>
          ))}
        </div>
        <span className="text-[9px] text-white/20 font-mono">SALA 01</span>
      </div>
    </div>
  );
}

// ─── Quiz Preview ────────────────────────────────────────────────────────────
function QuizPreview() {
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(240);
  const [correct, setCorrect] = useState<number | null>(null);
  const correctIdx = 2;
  const options = ["París", "Roma", "Madrid", "Lisboa"];
  const colors = ["#818cf8", "#c084fc", "#34d399", "#38bdf8"];

  useEffect(() => {
    const t = setInterval(() => {
      const pick = Math.floor(Math.random() * 4);
      setSelected(pick);
      setCorrect(pick === correctIdx ? 1 : -1);
      if (pick === correctIdx) setScore((v) => v + 120);
      setTimeout(() => { setSelected(null); setCorrect(null); }, 1800);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0800 0%, #1a0e00 100%)" }}>
      {/* Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.div className="w-2 h-2 rounded-full bg-amber-400" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-widest">En vivo</span>
        </div>
        <motion.div className="px-3 py-1 rounded-full text-[11px] font-bold"
          style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}
          animate={{ scale: score > 240 ? [1, 1.15, 1] : 1 }} transition={{ duration: 0.3 }}>
          ★ {score.toLocaleString()} pts
        </motion.div>
      </div>

      {/* Question */}
      <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wider">Pregunta 3 de 10</p>
        <p className="text-sm font-bold text-white/80">¿Capital de España?</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => (
          <motion.div key={i}
            animate={selected === i ? { scale: [1, 0.95, 1] } : { scale: 1 }}
            className="px-2 py-2.5 rounded-lg text-center text-xs font-bold transition-all duration-300"
            style={{
              background: selected === i ? (correct === 1 && i === correctIdx ? "rgba(52,211,153,0.2)" : correct === -1 && i === selected ? "rgba(239,68,68,0.2)" : `${colors[i]}20`) : `${colors[i]}10`,
              border: `1.5px solid ${selected === i ? (correct === 1 && i === correctIdx ? "rgba(52,211,153,0.5)" : correct === -1 && i === selected ? "rgba(239,68,68,0.5)" : `${colors[i]}50`) : `${colors[i]}20`}`,
              color: selected === i ? (correct === 1 && i === correctIdx ? "#34d399" : correct === -1 && i === selected ? "#ef4444" : colors[i]) : `${colors[i]}80`,
            }}>
            {opt}
          </motion.div>
        ))}
      </div>

      {/* Timer bar */}
      <div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
            animate={{ width: ["100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Memory Game Preview ─────────────────────────────────────────────────────
const ICONS = ["⚡", "🌙", "⭐", "💎", "🔮", "🦋", "⚡", "🌙", "⭐", "💎", "🔮", "🦋"];
function MemoryPreview() {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [combos, setCombos] = useState(0);

  useEffect(() => {
    let step = 0;
    const moves = [
      [0, 6], [1, 7], [0, 6], [2, 8], [3, 9], [4, 10], [5, 11],
    ];
    const t = setInterval(() => {
      const move = moves[step % moves.length];
      setFlipped(move);
      setTimeout(() => {
        const isMatch = ICONS[move[0]] === ICONS[move[1]];
        if (isMatch) {
          setMatched((prev) => [...prev, ...move].slice(-8));
          setCombos((v) => v + 1);
        }
        setFlipped([]);
      }, 1000);
      step++;
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const colors = ["#c084fc", "#38bdf8", "#34d399", "#f472b6", "#fbbf24", "#818cf8"];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 p-5"
      style={{ background: "linear-gradient(135deg, #001a10 0%, #000a08 100%)" }}>
      {/* Score */}
      <div className="flex items-center gap-3 w-full justify-between">
        <span className="text-[9px] font-bold text-emerald-400/50 uppercase tracking-widest">Memoria</span>
        <motion.div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
          animate={{ scale: combos > 0 ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
          🔥 {combos} combos
        </motion.div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {ICONS.slice(0, 12).map((icon, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          const isMatched = matched.includes(i);
          const color = colors[i % colors.length];
          return (
            <motion.div key={i}
              animate={{ rotateY: isFlipped ? 180 : 0, scale: isMatched ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.4, type: isMatched ? "spring" : "tween" }}
              style={{ width: 40, height: 40, transformStyle: "preserve-3d", perspective: 400, position: "relative" }}>
              {/* Front (hidden) */}
              <div className="absolute inset-0 rounded-lg flex items-center justify-center"
                style={{ backfaceVisibility: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-white/10 text-xs font-bold">?</span>
              </div>
              {/* Back (icon) */}
              <div className="absolute inset-0 rounded-lg flex items-center justify-center"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: isMatched ? `${color}20` : `${color}12`, border: `1px solid ${isMatched ? color + "50" : color + "25"}`, boxShadow: isMatched ? `0 0 12px ${color}40` : "none" }}>
                <span className="text-base" style={{ filter: isMatched ? "drop-shadow(0 0 6px currentColor)" : "none" }}>{icon}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const games = [
  {
    title: "Escape Rooms",
    desc: "Desafíos interactivos con pistas ocultas, códigos secretos y efectos de sonido. Ideal para educación y team building.",
    Preview: EscapeRoomPreview,
    accentColor: "#c084fc",
  },
  {
    title: "Quizzes Interactivos",
    desc: "Preguntas con feedback instantáneo, puntuación en tiempo real, temporizador y tabla de posiciones.",
    Preview: QuizPreview,
    accentColor: "#fbbf24",
  },
  {
    title: "Juegos de Memoria",
    desc: "Tarjetas que se voltean, combos y parejas para encontrar. Perfecto para aprendizaje y engagement.",
    Preview: MemoryPreview,
    accentColor: "#34d399",
  },
];

export default function Gamification() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: "linear-gradient(180deg, #030014 0%, #08001a 50%, #030014 100%)" }}>
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(251,146,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(251,146,60,0.06) 0%, transparent 70%)" }} />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }} className="text-center mb-20">
          <motion.div initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/20 bg-amber-700/8 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-amber-500/70 text-xs font-bold uppercase tracking-[0.2em]">Gamificación</span>
          </motion.div>

          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6" style={{ color: "#f0e6ff" }}>
            Aprende<br />
            <span className="relative inline-block">
              <span style={{ color: "#fb923c" }}>jugando</span>
              <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none"
                initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
                <motion.path d="M4 8C50 2,150 2,196 8" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              </motion.svg>
            </span>
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "rgba(240,230,255,0.4)" }}>
            Escape rooms, quizzes y juegos de memoria que transforman cualquier presentación en una aventura interactiva.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((g, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15 * i, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500"
              style={{ background: "rgba(255,255,255,0.02)", boxShadow: `0 0 0 1px ${g.accentColor}10` }}>
              {/* Live preview */}
              <div className="aspect-[4/3] relative">
                <g.Preview />
                {/* Live badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: g.accentColor }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">En vivo</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: g.accentColor }} />
                  <h3 className="font-[var(--font-display)] text-base font-extrabold text-white">{g.title}</h3>
                </div>
                <p className="text-white/30 text-sm leading-relaxed">{g.desc}</p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="mt-4 w-full py-2 rounded-lg text-xs font-bold transition-all"
                  style={{ background: `${g.accentColor}12`, border: `1px solid ${g.accentColor}25`, color: `${g.accentColor}CC` }}>
                  Agregar a mi presentación →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
          className="text-center mt-12 text-white/15 text-sm">
          Compatible con cualquier plantilla · Sin código · Resultados en tiempo real
        </motion.p>
      </div>
    </section>
  );
}
