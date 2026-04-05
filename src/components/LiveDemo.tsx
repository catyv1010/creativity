"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGSAPPlugins } from "@/lib/gsap-register";

registerGSAPPlugins();

/**
 * LiveDemo — An embedded mini-presenter on the landing page.
 * Shows REAL cinematic transitions between mini-scenes as user scrolls.
 * This is the "proof" that the product actually works.
 */

const DEMO_SCENES = [
  {
    bg: "linear-gradient(135deg, #1a0533 0%, #0f172a 100%)",
    title: "Tu Vision",
    subtitle: "Comienza con una idea",
    accent: "#a855f7",
    icon: "✦",
  },
  {
    bg: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)",
    title: "Cobra Vida",
    subtitle: "Animaciones cinematograficas",
    accent: "#06b6d4",
    icon: "◆",
  },
  {
    bg: "linear-gradient(135deg, #1c1917 0%, #44403c 100%)",
    title: "Impacta",
    subtitle: "Deja a todos sin palabras",
    accent: "#f59e0b",
    icon: "★",
  },
];

export default function LiveDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const transitioning = useRef(false);

  // Auto-cycle through scenes
  useEffect(() => {
    const interval = setInterval(() => {
      if (transitioning.current) return;
      setActiveScene((prev) => (prev + 1) % DEMO_SCENES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate scene transitions
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    transitioning.current = true;
    const scene = DEMO_SCENES[activeScene];

    // Get all child elements
    const title = screen.querySelector("[data-demo-title]");
    const subtitle = screen.querySelector("[data-demo-subtitle]");
    const icon = screen.querySelector("[data-demo-icon]");
    const accentLine = screen.querySelector("[data-demo-accent]");

    const tl = gsap.timeline({
      onComplete: () => { transitioning.current = false; },
    });

    // Exit current
    tl.to([title, subtitle, icon, accentLine].filter(Boolean), {
      opacity: 0,
      y: -30,
      scale: 0.9,
      filter: "blur(8px)",
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
    });

    // Change background
    tl.to(screen, {
      backgroundImage: scene.bg,
      duration: 0.6,
      ease: "power2.inOut",
    }, "-=0.2");

    // Enter new
    tl.fromTo([icon, title, accentLine, subtitle].filter(Boolean), {
      opacity: 0,
      y: 40,
      scale: 0.9,
      filter: "blur(8px)",
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

  }, [activeScene]);

  // Scroll-triggered entrance for the whole demo
  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(containerRef.current, {
      y: 100,
      opacity: 0,
      rotateX: 10,
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  const scene = DEMO_SCENES[activeScene];

  return (
    <section className="relative py-32 px-6 bg-[#030014] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06)_0%,transparent_60%)]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">Demo en Vivo</span>
          </div>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-[900] tracking-tight mb-6 text-white">
            Mira la <span className="text-shimmer">magia</span>
          </h2>
          <p className="text-white/30 text-lg max-w-md mx-auto">
            Transiciones cinematograficas reales. No son mockups.
          </p>
        </div>

        {/* Demo screen */}
        <div
          ref={containerRef}
          className="relative mx-auto max-w-4xl"
          style={{ perspective: "1200px" }}
        >
          {/* Browser chrome */}
          <div className="rounded-t-xl bg-[#1a1a2e] border border-white/5 border-b-0 px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-0.5 rounded bg-white/5 text-white/20 text-[10px] font-mono">
                creativity.app/presentar
              </div>
            </div>
          </div>

          {/* Presentation screen */}
          <div
            ref={screenRef}
            className="relative aspect-video rounded-b-xl overflow-hidden border border-white/5 border-t-0"
            style={{ backgroundImage: scene.bg }}
          >
            {/* Scene content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
              <div data-demo-icon className="text-5xl mb-6 opacity-60">
                {scene.icon}
              </div>
              <h3 data-demo-title className="text-white text-3xl sm:text-5xl font-[var(--font-display)] font-[900] mb-3">
                {scene.title}
              </h3>
              <div data-demo-accent className="w-16 h-1 rounded-full mb-4" style={{ backgroundColor: scene.accent }} />
              <p data-demo-subtitle className="text-white/50 text-sm sm:text-base">
                {scene.subtitle}
              </p>
            </div>

            {/* Scene indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {DEMO_SCENES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScene(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === activeScene
                      ? "w-6 h-2 bg-white/60"
                      : "w-2 h-2 bg-white/20 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Subtle vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
            }} />
          </div>

          {/* Reflection */}
          <div className="h-20 rounded-b-xl opacity-20 blur-sm" style={{
            backgroundImage: scene.bg,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
          }} />
        </div>

        {/* Transition type labels */}
        <div className="flex justify-center gap-4 mt-8">
          {["Zoom Blur", "Dolly Zoom", "Whip Pan", "Iris", "Fade"].map((name, i) => (
            <div key={i} className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-white/20 text-[11px] font-medium">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
