"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createId } from "@/lib/id";
import type { QuizData, QuizQuestion } from "@/core/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Participant {
  id: string;
  name: string;
  score: number;
  streak: number;
  answers: (number | null)[]; // index of selected answer, null = no answer
}

type QuizPhase =
  | "waiting"    // lobby: waiting for host to start
  | "question"   // question + timer running
  | "feedback"   // show correct answer
  | "scoreboard" // between questions
  | "final";     // end

const OPTION_COLORS = [
  { bg: "#c084fc", light: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.5)", text: "#c084fc" },
  { bg: "#38bdf8", light: "rgba(56,189,248,0.15)",  border: "rgba(56,189,248,0.5)",  text: "#38bdf8" },
  { bg: "#34d399", light: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.5)",  text: "#34d399" },
  { bg: "#fbbf24", light: "rgba(251,191,36,0.15)",  border: "rgba(251,191,36,0.5)",  text: "#fbbf24" },
];

const OPTION_LETTERS = ["A", "B", "C", "D"];

// ─── Confetti particle ────────────────────────────────────────────────────────
function Confetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: OPTION_COLORS[i % 4].bg,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: -20, width: p.size, height: p.size, background: p.color, rotate: p.rotation }}
          animate={{ y: ["0vh", "110vh"], rotate: [p.rotation, p.rotation + 360], opacity: [1, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ─── Timer ring ───────────────────────────────────────────────────────────────
function TimerRing({ timeLeft, total, color }: { timeLeft: number; total: number; color: string }) {
  const pct = timeLeft / total;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <motion.circle
          cx="36" cy="36" r={r} fill="none"
          stroke={isUrgent ? "#ef4444" : color}
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      <motion.span
        className="absolute font-bold text-xl"
        style={{ color: isUrgent ? "#ef4444" : "white" }}
        animate={{ scale: isUrgent ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}>
        {timeLeft}
      </motion.span>
    </div>
  );
}

// ─── Score pill ───────────────────────────────────────────────────────────────
function ScorePill({ score, delta }: { score: number; delta?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="px-4 py-1.5 rounded-full text-sm font-bold"
        style={{ background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.25)", color: "#c084fc" }}>
        ⭐ {score.toLocaleString()} pts
      </div>
      <AnimatePresence>
        {delta !== undefined && delta > 0 && (
          <motion.div
            key={delta}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-emerald-400">
            +{delta}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main QuizOverlay ─────────────────────────────────────────────────────────

interface Props {
  quiz: QuizData;
  onClose: () => void;
}

export default function QuizOverlay({ quiz, onClose }: Props) {
  const [phase, setPhase] = useState<QuizPhase>("waiting");
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [scoreDelta, setScoreDelta] = useState<number | undefined>(undefined);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionResults, setQuestionResults] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ: QuizQuestion | undefined = quiz.questions[qIndex];
  const totalQ = quiz.questions.length;

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startQuestion = useCallback((idx: number) => {
    const q = quiz.questions[idx];
    if (!q) return;
    setQIndex(idx);
    setSelected(null);
    setScoreDelta(undefined);
    setTimeLeft(q.timeLimit);
    setPhase("question");
  }, [quiz.questions]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "question") { stopTimer(); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer();
          // Time's up — auto-submit no answer
          setPhase("feedback");
          setQuestionResults((r) => [...r, false]);
          setStreak(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return stopTimer;
  }, [phase, stopTimer]);

  const handleAnswer = useCallback((idx: number) => {
    if (phase !== "question" || selected !== null) return;
    stopTimer();
    setSelected(idx);

    const q = currentQ!;
    const isCorrect = idx === q.correctIndex;
    const newStreak = isCorrect ? streak + 1 : 0;
    const bonus = newStreak >= 3 ? Math.floor(q.points * 0.5) : 0;
    const delta = isCorrect ? q.points + bonus : 0;

    setStreak(newStreak);
    setCorrectCount((c) => c + (isCorrect ? 1 : 0));
    setQuestionResults((r) => [...r, isCorrect]);

    if (delta > 0) {
      setScore((s) => s + delta);
      setScoreDelta(delta);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setTimeout(() => setPhase("feedback"), 400);
  }, [phase, selected, currentQ, streak, stopTimer]);

  const handleNext = useCallback(() => {
    const nextIdx = qIndex + 1;
    if (nextIdx >= totalQ) {
      setPhase("final");
    } else {
      setPhase("scoreboard");
      setTimeout(() => startQuestion(nextIdx), 1800);
    }
  }, [qIndex, totalQ, startQuestion]);

  // Keyboard: Space/Enter to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if ((e.key === " " || e.key === "Enter") && phase === "feedback") {
        e.preventDefault(); e.stopPropagation(); handleNext();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [phase, handleNext, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center z-[99999]"
      style={{ background: "rgba(2,0,20,0.95)", backdropFilter: "blur(20px)" }}
      onClick={(e) => e.stopPropagation()}>

      {showConfetti && <Confetti />}

      {/* Close button */}
      <button onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}>
        ✕
      </button>

      {/* ── WAITING PHASE ─────────────────────────────────────────────── */}
      {phase === "waiting" && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-lg px-6">
          <motion.div className="text-6xl mb-6" animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>🎯</motion.div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "DM Serif Display, serif" }}>{quiz.title}</h2>
          <p className="text-white/40 mb-2 text-sm">{totalQ} pregunta{totalQ !== 1 ? "s" : ""} · ¡Responde rápido para ganar más puntos!</p>
          <div className="flex justify-center gap-3 mt-3 mb-8 flex-wrap">
            {quiz.questions.map((q: QuizQuestion, i: number) => (
              <div key={i} className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.2)", color: "#c084fc" }}>
                Q{i + 1} · {q.timeLimit}s
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => startQuestion(0)}
            className="px-10 py-4 rounded-2xl text-white font-bold text-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)", boxShadow: "0 0 40px rgba(192,132,252,0.4)" }}>
            ¡Comenzar! →
          </motion.button>
        </motion.div>
      )}

      {/* ── QUESTION PHASE ────────────────────────────────────────────── */}
      {(phase === "question" || phase === "feedback") && currentQ && (
        <div className="w-full max-w-3xl px-6 flex flex-col gap-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                {qIndex + 1} / {totalQ}
              </div>
              {streak >= 2 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}>
                  🔥 ×{streak} racha
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <ScorePill score={score} delta={scoreDelta} />
              {phase === "question" && (
                <TimerRing timeLeft={timeLeft} total={currentQ.timeLimit} color={OPTION_COLORS[0].bg} />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full bg-white/5">
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #7c3aed, #c084fc)", width: `${((qIndex) / totalQ) * 100}%` }}
              animate={{ width: `${((qIndex) / totalQ) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div key={qIndex}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}>
              <div className="rounded-2xl p-6 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xl md:text-2xl font-bold text-white leading-tight">{currentQ.question}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt: string, i: number) => {
              const c = OPTION_COLORS[i % 4];
              const isSelected = selected === i;
              const isCorrect = i === currentQ.correctIndex;
              const showResult = phase === "feedback";

              let bg = c.light;
              let border = c.border;
              let textColor = c.text;

              if (showResult) {
                if (isCorrect) { bg = "rgba(52,211,153,0.2)"; border = "rgba(52,211,153,0.6)"; textColor = "#34d399"; }
                else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.15)"; border = "rgba(239,68,68,0.5)"; textColor = "#ef4444"; }
                else { bg = "rgba(255,255,255,0.02)"; border = "rgba(255,255,255,0.06)"; textColor = "rgba(255,255,255,0.2)"; }
              }

              return (
                <motion.button key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={phase === "feedback"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, scale: isSelected && showResult ? (isCorrect ? [1, 1.03, 1] : [1, 0.98, 1]) : 1 }}
                  transition={{ delay: i * 0.06, duration: 0.35, scale: { duration: 0.4 } }}
                  whileHover={phase === "question" ? { scale: 1.02, y: -2 } : undefined}
                  whileTap={phase === "question" ? { scale: 0.98 } : undefined}
                  className="relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300"
                  style={{ background: bg, border: `1.5px solid ${border}` }}>
                  {/* Letter badge */}
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: showResult ? (isCorrect ? "rgba(52,211,153,0.25)" : isSelected ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)") : `${c.bg}20`, color: textColor }}>
                    {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : OPTION_LETTERS[i]}
                  </div>
                  <span className="font-medium text-sm md:text-base" style={{ color: textColor }}>{opt}</span>

                  {/* Correct answer flash */}
                  {showResult && isCorrect && (
                    <motion.div className="absolute inset-0 rounded-xl"
                      style={{ border: "2px solid rgba(52,211,153,0.7)", boxShadow: "0 0 20px rgba(52,211,153,0.3)" }}
                      animate={{ opacity: [0, 1, 0.7] }} transition={{ duration: 0.5 }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback phase → next button */}
          {phase === "feedback" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 25px rgba(168,85,247,0.35)" }}>
                {qIndex + 1 < totalQ ? "Siguiente pregunta →" : "Ver resultados →"}
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      {/* ── SCOREBOARD (between questions) ────────────────────────────── */}
      {phase === "scoreboard" && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center">
          <div className="text-4xl mb-3">
            {questionResults[questionResults.length - 1] ? "🎉" : "💪"}
          </div>
          <p className="text-white/50 text-sm mb-1">Pregunta {qIndex} de {totalQ}</p>
          <p className="text-2xl font-bold text-white mb-2">
            {questionResults[questionResults.length - 1] ? "¡Correcto!" : "¡Sigue intentando!"}
          </p>
          <ScorePill score={score} />
          <p className="text-white/30 text-xs mt-4">Siguiente pregunta en un momento...</p>
        </motion.div>
      )}

      {/* ── FINAL SCOREBOARD ──────────────────────────────────────────── */}
      {phase === "final" && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md px-6 w-full">
          <Confetti />
          <motion.div className="text-6xl mb-4"
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.6, repeat: 3 }}>
            🏆
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "DM Serif Display, serif" }}>
            ¡Quiz Completado!
          </h2>
          <p className="text-white/40 text-sm mb-6">{quiz.title}</p>

          {/* Results card */}
          <div className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: "Puntuación", value: score.toLocaleString(), color: "#c084fc", icon: "⭐" },
                { label: "Correctas", value: `${correctCount}/${totalQ}`, color: "#34d399", icon: "✓" },
                { label: "Racha máx.", value: `×${Math.max(...questionResults.map((r, i) => r ? i + 1 : 0), 0)}`, color: "#fbbf24", icon: "🔥" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center p-3 rounded-xl" style={{ background: `${OPTION_COLORS[i].bg}10`, border: `1px solid ${OPTION_COLORS[i].border}` }}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Answer breakdown */}
            <div className="flex gap-1.5 justify-center">
              {questionResults.map((correct, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.06 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: correct ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.12)", border: `1px solid ${correct ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.3)"}`, color: correct ? "#34d399" : "#ef4444" }}>
                  {correct ? "✓" : "✗"}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Motivational message */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-sm font-medium mb-6"
            style={{ color: correctCount === totalQ ? "#34d399" : correctCount >= totalQ * 0.7 ? "#fbbf24" : "rgba(255,255,255,0.4)" }}>
            {correctCount === totalQ ? "🏆 ¡Perfecto! Respondiste todo correctamente."
              : correctCount >= totalQ * 0.7 ? "🎯 ¡Muy bien! Casi perfecto."
              : correctCount >= totalQ * 0.5 ? "💪 Buen intento. ¡Sigue practicando!"
              : "📚 Repasa el material y vuelve a intentarlo."}
          </motion.p>

          <div className="flex gap-3 justify-center">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setPhase("waiting"); setScore(0); setStreak(0); setCorrectCount(0); setQuestionResults([]); }}
              className="px-6 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
              Repetir
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(168,85,247,0.3)" }}>
              Cerrar quiz
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Factory: default quiz with 5 questions ───────────────────────────────────
export function createDefaultQuiz(overrides: Partial<QuizData> = {}): QuizData {
  return {
    title: "Quiz Interactivo",
    questions: [
      { id: createId(), question: "¿Cuál es la capital de Francia?", options: ["Madrid", "París", "Roma", "Berlín"], correctIndex: 1, timeLimit: 20, points: 100 },
      { id: createId(), question: "¿En qué año llegó el hombre a la Luna?", options: ["1965", "1967", "1969", "1972"], correctIndex: 2, timeLimit: 20, points: 100 },
      { id: createId(), question: "¿Cuál es el planeta más grande del sistema solar?", options: ["Saturno", "Neptuno", "Júpiter", "Urano"], correctIndex: 2, timeLimit: 15, points: 150 },
    ],
    ...overrides,
  };
}
