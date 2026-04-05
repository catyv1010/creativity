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

const LETTER_COLORS = ["#a855f7", "#818cf8", "#3b82f6", "#06b6d4", "#22d3ee", "#F2583E", "#f59e0b", "#ec4899", "#7c3aed"];

export default function AnimatedLogo({ size = "md", showText = true, className = "" }: Props) {
  const iconRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const s = sizes[size];

  useEffect(() => {
    const gradient = gradientRef.current;
    const glow = glowRef.current;
    if (!gradient || !glow) return;

    const gradTween = gsap.to(gradient, { rotation: 360, duration: 6, repeat: -1, ease: "none" });
    const glowTween = gsap.to(glow, { opacity: 0.65, scale: 1.35, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" });

    return () => { gradTween.kill(); glowTween.kill(); };
  }, []);

  const handleMouseEnter = () => {
    const icon = iconRef.current;
    const letter = letterRef.current;
    const glow = glowRef.current;
    if (!icon || !letter || !glow) return;
    gsap.to(icon, { rotateY: 15, rotateX: -10, scale: 1.15, duration: 0.4, ease: "back.out(1.7)" });
    gsap.to(letter, { scale: 1.2, duration: 0.3, ease: "power2.out" });
    gsap.to(glow, { opacity: 1, scale: 1.8, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const icon = iconRef.current;
    const letter = letterRef.current;
    const glow = glowRef.current;
    if (!icon || !letter || !glow) return;
    gsap.to(icon, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    gsap.to(letter, { scale: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(glow, { opacity: 0.3, scale: 1, duration: 0.5 });
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
        <div ref={glowRef} className="absolute opacity-40" style={{ inset: -4, borderRadius: s.radius + 4, background: "linear-gradient(135deg, #7c3aed, #a855f7, #F2583E, #06b6d4)", filter: "blur(10px)" }} />
        <div ref={gradientRef} className="absolute" style={{ inset: -1.5, borderRadius: s.radius, background: "conic-gradient(from 0deg, #3b82f6, #7c3aed, #a855f7, #06b6d4, #22d3ee, #818cf8, #F2583E, #3b82f6)" }} />
        <div className="absolute flex items-center justify-center" style={{ inset: s.inset, borderRadius: s.radius - 2, background: "linear-gradient(145deg, #0a0020, #030014)" }}>
          <span ref={letterRef} className="font-[var(--font-display)] font-[900]" style={{
            fontSize: s.font,
            color: "#ffffff",
            textShadow: "0 0 6px #a855f7, 0 0 12px #3b82f6, 0 0 20px #06b6d4",
          }}>C</span>
        </div>
      </div>

      {/* "reativity" — colored letters matching the hero */}
      {showText && (
        <span className="font-[var(--font-display)] font-extrabold tracking-tight" style={{ fontSize: s.text }}>
          {"reativity".split("").map((char, i) => (
            <span key={i} style={{ color: LETTER_COLORS[i], textShadow: `0 0 20px ${LETTER_COLORS[i]}55` }}>{char}</span>
          ))}
        </span>
      )}
    </div>
  );
}
