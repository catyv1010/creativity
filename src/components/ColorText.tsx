"use client";

import { useEffect, useRef } from "react";

const colors = ["#a6efde", "#72a5ff", "#ff4100", "#ffa7da", "#a855f7", "#06b6d4", "#f59e0b", "#F2583E"];

interface Props {
  text: string;
  className?: string;
  baseColor?: string;
}

export default function ColorText({ text, className = "", baseColor = "white" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Split into individual character spans
    const chars = text.split("");
    el.innerHTML = "";
    chars.forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.color = baseColor;
      span.style.transition = "color 3s ease";
      span.style.transitionDelay = "0.8s";
      span.style.cursor = "cell";
      span.style.display = "inline-block";

      // Random color group
      const colorIdx = Math.floor(Math.random() * colors.length);

      span.addEventListener("mouseenter", () => {
        span.style.transition = "color 0s";
        span.style.transitionDelay = "0s";
        span.style.color = colors[colorIdx];
      });

      span.addEventListener("mouseleave", () => {
        span.style.transition = "color 3s ease";
        span.style.transitionDelay = "0.8s";
        span.style.color = baseColor;
      });

      el.appendChild(span);

      // Staggered entrance: start invisible, fade in
      span.style.opacity = "0";
      setTimeout(() => {
        span.style.transition = "opacity 0.15s ease, color 3s ease";
        span.style.opacity = "1";
      }, 80 + i * 25);
    });
  }, [text, baseColor]);

  return <span ref={ref} className={className} />;
}
