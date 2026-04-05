"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: 34, font: 20, text: 17, gap: 7, radius: 8, inset: 2 },
  md: { box: 42, font: 25, text: 20, gap: 9, radius: 10, inset: 2 },
  lg: { box: 56, font: 34, text: 27, gap: 11, radius: 12, inset: 3 },
  xl: { box: 76, font: 48, text: 38, gap: 14, radius: 14, inset: 3 },
};

const LETTER_COLORS = ["#f0abfc", "#c084fc", "#818cf8", "#38bdf8", "#34d399", "#fb923c", "#f472b6", "#a78bfa", "#67e8f9"];

export default function AnimatedLogo({ size = "md", showText = true, className = "" }: Props) {
  const iconRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const outerGlowRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const s = sizes[size];

  useEffect(() => {
    const gradient = gradientRef.current;
    const glow = glowRef.current;
    const outerGlow = outerGlowRef.current;
    if (!gradient || !glow) return;

    const gradTween = gsap.to(gradient, { rotation: 360, duration: 4, repeat: -1, ease: "none" });
    const glowTween = gsap.to(glow, { opacity: 0.9, scale: 1.4, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    const outerTween = outerGlow ? gsap.to(outerGlow, { opacity: 0.5, scale: 1.6, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 }) : null;

    return () => { gradTween.kill(); glowTween.kill(); outerTween?.kill(); };
  }, []);

  const handleMouseEnter = () => {
    const icon = iconRef.current;
    const letter = letterRef.current;
    const glow = glowRef.current;
    if (!icon || !letter || !glow) return;
    gsap.to(icon, { rotateY: 15, rotateX: -10, scale: 1.18, duration: 0.4, ease: "back.out(1.7)" });
    gsap.to(letter, { scale: 1.25, duration: 0.3, ease: "power2.out" });
    gsap.to(glow, { opacity: 1, scale: 2, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const icon = iconRef.current;
    const letter = letterRef.current;
    const glow = glowRef.current;
    if (!icon || !letter || !glow) return;
    gsap.to(icon, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    gsap.to(letter, { scale: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(glow, { opacity: 0.7, scale: 1, duration: 0.5 });
  };

  return (
    <div
      className={`flex items-center group cursor-pointer ${className}`}
      style={{ gap: s.gap, perspective: "600px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* C icon */}
      <div ref={iconRef} className="relative flex-shrink-0" style={{ width: s.box, height: s.box, transformStyle: "preserve-3d" }}>
        {/* Outer diffuse glow */}
        <div ref={outerGlowRef} className="absolute opacity-30" style={{
          inset: -8, borderRadius: s.radius + 8,
          background: "radial-gradient(circle, #e879f9 0%, #a855f7 30%, #3b82f6 60%, transparent 80%)",
          filter: `blur(${s.box * 0.4}px)`,
        }} />
        {/* Inner tight glow */}
        <div ref={glowRef} className="absolute opacity-70" style={{
          inset: -3, borderRadius: s.radius + 3,
          background: "linear-gradient(135deg, #e879f9, #a855f7, #6366f1, #06b6d4)",
          filter: `blur(${s.box * 0.18}px)`,
        }} />
        {/* Spinning gradient border */}
        <div ref={gradientRef} className="absolute" style={{
          inset: -1.5, borderRadius: s.radius,
          background: "conic-gradient(from 0deg, #f0abfc, #c084fc, #818cf8, #38bdf8, #34d399, #fbbf24, #f472b6, #e879f9, #f0abfc)",
        }} />
        {/* Dark inner background */}
        <div className="absolute flex items-center justify-center" style={{
          inset: s.inset, borderRadius: s.radius - 2,
          background: "linear-gradient(145deg, #12001f, #050010)",
        }}>
          <span ref={letterRef} className="font-[var(--font-display)] font-[900]" style={{
            fontSize: s.font,
            background: "linear-gradient(135deg, #f0abfc 0%, #c084fc 40%, #818cf8 70%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 8px #c084fc) drop-shadow(0 0 16px #818cf8)",
          }}>C</span>
        </div>
      </div>

      {/* "reativity" — colored letters */}
      {showText && (
        <span className="font-[var(--font-display)] font-extrabold tracking-tight" style={{ fontSize: s.text }}>
          {"reativity".split("").map((char, i) => (
            <span key={i} style={{
              color: LETTER_COLORS[i],
              textShadow: `0 0 14px ${LETTER_COLORS[i]}88, 0 0 28px ${LETTER_COLORS[i]}44`,
            }}>{char}</span>
          ))}
        </span>
      )}
    </div>
  );
}
