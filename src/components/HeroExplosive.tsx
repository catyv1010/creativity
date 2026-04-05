"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ── Config ────────────────────────────────────────────────────────
const PARTICLE_COUNT = 90;
const COLORS = ["#7c3aed", "#a855f7", "#3b82f6", "#06b6d4", "#F2583E", "#f59e0b", "#ec4899", "#818cf8"];
const LETTER_COLORS = ["#a855f7", "#818cf8", "#3b82f6", "#06b6d4", "#22d3ee", "#F2583E", "#f59e0b", "#ec4899", "#7c3aed", "#a855f7"];

interface Particle { el: HTMLDivElement; x: number; y: number; size: number; color: string; }

// ── Warp speed stars (radiate from center on load) ────────────────
function createWarpBurst(container: HTMLElement) {
  for (let i = 0; i < 60; i++) {
    const star = document.createElement("div");
    const angle = (Math.PI * 2 * i) / 60 + (Math.random() - 0.5) * 0.15;
    const length = 40 + Math.random() * 120;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    star.style.cssText = `position:absolute;width:${length}px;height:2px;left:50%;top:50%;background:linear-gradient(90deg,transparent,${color},white);border-radius:2px;opacity:0;pointer-events:none;transform-origin:left center;transform:rotate(${angle}rad);`;
    container.appendChild(star);
    gsap.fromTo(star,
      { opacity: 0, scaleX: 0.1, x: 0, y: 0 },
      { opacity: 0.85, scaleX: 1, x: Math.cos(angle) * (250 + Math.random() * 350), y: Math.sin(angle) * (250 + Math.random() * 350),
        duration: 0.6 + Math.random() * 0.4, ease: "expo.out", delay: Math.random() * 0.15,
        onComplete: () => { gsap.to(star, { opacity: 0, duration: 0.3, onComplete: () => { star.remove(); } }); }
      }
    );
  }
}

// ── Expanding color ring from a point ────────────────────────────
function createColorRing(container: HTMLElement, cx: number, cy: number, color: string, delay = 0) {
  const ring = document.createElement("div");
  ring.style.cssText = `position:absolute;left:${cx}%;top:${cy}%;width:20px;height:20px;margin-left:-10px;margin-top:-10px;border-radius:50%;border:3px solid ${color};opacity:0;pointer-events:none;box-shadow:0 0 12px ${color},inset 0 0 12px ${color};`;
  container.appendChild(ring);
  gsap.fromTo(ring,
    { opacity: 0.9, scale: 0.5 },
    { opacity: 0, scale: 28 + Math.random() * 12, duration: 0.9, ease: "power2.out", delay,
      onComplete: () => { ring.remove(); }
    }
  );
}

// ── Star helpers ──────────────────────────────────────────────────
function createStarBurst(container: HTMLElement, cx = 10 + Math.random() * 80, cy = 10 + Math.random() * 80, intensity = 1) {
  const count = Math.floor((10 + Math.random() * 14) * intensity);
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    const size = 1.5 + Math.random() * 3.5;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const dist = (50 + Math.random() * 140) * intensity;
    star.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${cx}%;top:${cy}%;border-radius:50%;background:${color};opacity:0;pointer-events:none;box-shadow:0 0 ${size * 5}px ${color};`;
    container.appendChild(star);
    gsap.fromTo(star, { opacity: 0, scale: 0 }, {
      opacity: 0.9, scale: 1 + Math.random(), x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
      duration: 0.5 + Math.random() * 0.6, ease: "power2.out",
      onComplete: () => { gsap.to(star, { opacity: 0, scale: 0, duration: 0.3 + Math.random() * 0.3, ease: "power2.in", onComplete: () => { star.remove(); } }); },
    });
  }
}

function createShootingStar(container: HTMLElement) {
  if (!container) return;
  const star = document.createElement("div");
  const startX = 5 + Math.random() * 70;
  const startY = Math.random() * 35;
  const length = 70 + Math.random() * 150;
  const angle = 20 + Math.random() * 30;
  const color = Math.random() > 0.5 ? "#a855f7" : "#3b82f6";
  star.style.cssText = `position:absolute;width:${length}px;height:2px;left:${startX}%;top:${startY}%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.9),${color});border-radius:2px;opacity:0;pointer-events:none;transform:rotate(${angle}deg);box-shadow:0 0 12px ${color};`;
  container.appendChild(star);
  gsap.fromTo(star, { opacity: 0, x: 0, scaleX: 0.2 }, {
    opacity: 1, x: 260 + Math.random() * 280, y: 130 + Math.random() * 130, scaleX: 1,
    duration: 0.45 + Math.random() * 0.4, ease: "power2.in",
    onComplete: () => { gsap.to(star, { opacity: 0, duration: 0.2, onComplete: () => { star.remove(); } }); },
  });
}

function createTwinkleStar(container: HTMLElement): gsap.core.Tween {
  const star = document.createElement("div");
  const size = 1 + Math.random() * 3;
  const isAccent = Math.random() > 0.65;
  const isBright = Math.random() > 0.87;
  const color = isAccent ? COLORS[Math.floor(Math.random() * COLORS.length)] : "#ffffff";
  star.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;border-radius:50%;background:${color};opacity:0;pointer-events:none;${isAccent || isBright ? `box-shadow:0 0 ${size * 7}px ${color};` : ""}`;
  container.appendChild(star);
  return gsap.to(star, { opacity: isBright ? 0.95 : 0.2 + Math.random() * 0.6, scale: isBright ? 2 : 1, duration: 0.5 + Math.random() * 2.5, repeat: -1, yoyo: true, delay: Math.random() * 2, ease: "sine.inOut" });
}

// ── Meteor shower (lluvia de estrellas cayendo desde arriba) ──────
function createMeteorShower(container: HTMLElement, count = 1) {
  for (let i = 0; i < count; i++) {
    const meteor = document.createElement("div");
    const startX = Math.random() * 105 - 2;
    const length = 55 + Math.random() * 110;
    const angle = 68 + Math.random() * 22;
    const speed = 0.55 + Math.random() * 0.75;
    const delay = i * 0.07 + Math.random() * 0.1;
    const color = Math.random() > 0.55 ? "#a855f7" : Math.random() > 0.5 ? "#3b82f6" : "#ffffff";
    meteor.style.cssText = `position:absolute;width:2px;height:${length}px;left:${startX}%;top:-4%;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.85),${color});border-radius:2px;opacity:0;pointer-events:none;transform:rotate(${angle}deg);box-shadow:0 0 8px ${color},0 0 20px ${color}55;`;
    container.appendChild(meteor);
    gsap.fromTo(meteor,
      { opacity: 0, y: 0 },
      { opacity: 0.95, y: (typeof window !== "undefined" ? window.innerHeight : 900) * 1.3,
        duration: speed, ease: "power1.in", delay,
        onComplete: () => { gsap.to(meteor, { opacity: 0, duration: 0.12, onComplete: () => { meteor.remove(); } }); }
      }
    );
  }
}

// ── Fire embers (brasas subiendo desde abajo) ─────────────────────
function createFireEmber(container: HTMLElement) {
  const ember = document.createElement("div");
  const size = 2 + Math.random() * 5.5;
  const startX = 5 + Math.random() * 90;
  const fireColors = ["#ff4500","#ff6600","#ff8c00","#ffa500","#ffcc00","#F2583E","#ff2200","#ff9900"];
  const color = fireColors[Math.floor(Math.random() * fireColors.length)];
  const drift = (Math.random() - 0.5) * 100;
  const riseHeight = 120 + Math.random() * 280;
  const glow = size * 4;
  ember.style.cssText = `position:absolute;width:${size}px;height:${size * 1.6}px;left:${startX}%;bottom:2%;border-radius:50% 50% 40% 40%;background:radial-gradient(ellipse at 50% 20%,#fff9,${color});opacity:0;pointer-events:none;box-shadow:0 0 ${glow}px ${color},0 0 ${glow * 2}px ${color}55;`;
  container.appendChild(ember);
  gsap.fromTo(ember,
    { opacity: 0, y: 0, x: 0, scale: 1 },
    { opacity: 0.85, y: -riseHeight, x: drift, scale: 0.15,
      duration: 1.8 + Math.random() * 2.2, ease: "power1.out",
      onComplete: () => { ember.remove(); }
    }
  );
}

// ══════════════════════════════════════════════════════════════════
export default function HeroExplosive() {
  const sectionRef    = useRef<HTMLElement>(null);
  const logoBoxRef    = useRef<HTMLDivElement>(null);
  const gradientRef   = useRef<HTMLDivElement>(null);
  const innerGlowRef  = useRef<HTMLDivElement>(null);
  const shockwave1Ref = useRef<HTMLDivElement>(null);
  const shockwave2Ref = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);
  const subtitleRef   = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLDivElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const particlesRef  = useRef<HTMLDivElement>(null);
  const starsRef      = useRef<HTMLDivElement>(null);
  const auroraRef     = useRef<HTMLDivElement>(null);
  const flashRef      = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const videoContRef  = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const scrollIndRef    = useRef<HTMLDivElement>(null);
  const cLetterRef      = useRef<HTMLSpanElement>(null);
  const innerColorRef   = useRef<HTMLDivElement>(null);

  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const charsBuilt = useRef(false);
  const entranceTl = useRef<gsap.core.Timeline | null>(null);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  useEffect(() => {
    const h = (e: MouseEvent) => { mx.set((e.clientX / window.innerWidth - 0.5) * 30); my.set((e.clientY / window.innerHeight - 0.5) * 30); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mx, my]);

  // Rotating border
  useEffect(() => {
    const el = gradientRef.current;
    if (!el) return;
    const t = gsap.to(el, { rotation: 360, duration: 6, repeat: -1, ease: "none" });
    return () => { t.kill(); };
  }, []);

  // Aurora continuous drift
  useEffect(() => {
    const aurora = auroraRef.current;
    if (!aurora) return;
    const a1 = aurora.querySelector(".a1") as HTMLElement;
    const a2 = aurora.querySelector(".a2") as HTMLElement;
    const a3 = aurora.querySelector(".a3") as HTMLElement;
    const a4 = aurora.querySelector(".a4") as HTMLElement;
    if (!a1 || !a2 || !a3 || !a4) return;
    const t1 = gsap.to(a1, { scaleX: 1.4, scaleY: 0.75, x: 100, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    const t2 = gsap.to(a2, { scaleX: 0.8, scaleY: 1.5, x: -80, y: 50, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
    const t3 = gsap.to(a3, { scaleX: 1.3, scaleY: 0.85, x: 60, y: -40, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
    const t4 = gsap.to(a4, { scaleX: 0.9, scaleY: 1.3, x: -50, y: 30, duration: 13, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 3 });
    return () => { t1.kill(); t2.kill(); t3.kill(); t4.kill(); };
  }, []);

  // GSAP ticker: gira el conic-gradient de la C (background-clip:text) y del cuadrado de fondo
  useEffect(() => {
    const letter = cLetterRef.current;
    const inner  = innerColorRef.current;
    if (!letter) return;
    // Paleta sin verde: va de cálido a frío PASANDO por rosa/púrpura, nunca por verde
    // Arcoíris completo: rojo→naranja→amarillo→verde suave→celeste→azul→violeta→rosado→rojo
// Una vuelta completa = cada color ocupa su sección, todos visibles en la C al mismo tiempo
const STOPS = "#f43f5e,#f97316,#fbbf24,#86efac,#22d3ee,#38bdf8,#3b82f6,#7c3aed,#a855f7,#d946ef,#ec4899,#f43f5e";
    let angle = 0;
    const ticker = gsap.ticker.add(() => {
      angle = (angle + 0.5) % 360;
      const grad = `conic-gradient(from ${angle}deg, ${STOPS})`;
      letter.style.backgroundImage = grad;
      if (inner) inner.style.backgroundImage = grad;
    });
    return () => { gsap.ticker.remove(ticker); };
  }, []);

  // Starfield
  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;
    const tweens: gsap.core.Tween[] = [];
    const timers: ReturnType<typeof setInterval>[] = [];
    const tos: ReturnType<typeof setTimeout>[] = [];

    // 300 twinkle stars for dense starfield
    for (let i = 0; i < 300; i++) tweens.push(createTwinkleStar(container));

    // Bursts every 500ms (denser)
    const burstInterval = setInterval(() => createStarBurst(container), 500);
    timers.push(burstInterval);

    // 8 immediate bursts at load spread across screen
    createStarBurst(container, 50, 30, 1.5);
    createStarBurst(container, 20, 60, 1.2);
    createStarBurst(container, 80, 20, 1.3);
    tos.push(setTimeout(() => createStarBurst(container, 35, 75, 1.4), 100));
    tos.push(setTimeout(() => createStarBurst(container, 70, 50, 1.2), 200));
    tos.push(setTimeout(() => createStarBurst(container, 15, 35, 1.3), 300));
    tos.push(setTimeout(() => createStarBurst(container, 85, 65, 1.1), 400));
    tos.push(setTimeout(() => createStarBurst(container, 50, 80, 1.6), 500));

    // Shooting stars — 6 in the first 2 seconds, then every 900ms
    for (let i = 0; i < 6; i++) {
      tos.push(setTimeout(() => createShootingStar(container), i * 300));
    }
    timers.push(setInterval(() => createShootingStar(container), 900));

    // Double shooting stars at random
    timers.push(setInterval(() => {
      createShootingStar(container);
      setTimeout(() => createShootingStar(container), 120);
    }, 2200));

    // Triple firework salvo every 2s (faster)
    timers.push(setInterval(() => {
      const bx = 10 + Math.random() * 80;
      const by = 10 + Math.random() * 70;
      createStarBurst(container, bx, by, 2.2);
      setTimeout(() => createStarBurst(container, bx + (Math.random() - 0.5) * 15, by + (Math.random() - 0.5) * 15, 1.6), 100);
      setTimeout(() => createStarBurst(container, bx + (Math.random() - 0.5) * 20, by + (Math.random() - 0.5) * 20, 1.2), 220);
    }, 2000));

    // ── LLUVIA DE METEOROS ────────────────────────────────────────
    // Salva inicial de meteoros
    for (let i = 0; i < 6; i++) tos.push(setTimeout(() => createMeteorShower(container, 2), i * 250));
    // Cada 1.4s llegan 2-4 meteoros
    timers.push(setInterval(() => createMeteorShower(container, 2 + Math.floor(Math.random() * 3)), 1400));
    // Salva doble rápida cada 4s
    timers.push(setInterval(() => {
      createMeteorShower(container, 4);
      setTimeout(() => createMeteorShower(container, 3), 300);
    }, 4000));

    // ── FUEGO / BRASAS ────────────────────────────────────────────
    // Brasas continuas desde abajo
    timers.push(setInterval(() => {
      for (let i = 0; i < 4; i++) createFireEmber(container);
    }, 120));

    // Ambient glows
    for (let i = 0; i < 5; i++) {
      const glow = document.createElement("div");
      const size = 100 + Math.random() * 220;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      glow.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${10 + Math.random() * 80}%;top:${10 + Math.random() * 80}%;border-radius:50%;background:${color};opacity:0;pointer-events:none;filter:blur(${55 + Math.random() * 40}px);`;
      container.appendChild(glow);
      tweens.push(gsap.to(glow, { opacity: 0.03 + Math.random() * 0.04, scale: 1.5, duration: 5 + Math.random() * 8, repeat: -1, yoyo: true, delay: Math.random() * 4, ease: "sine.inOut" }));
    }

    return () => { tweens.forEach(t => t.kill()); timers.forEach(t => clearInterval(t)); tos.forEach(t => clearTimeout(t)); if (container) container.innerHTML = ""; };
  }, []);

  // Build letter spans
  const buildChars = useCallback(() => {
    const el = titleRef.current;
    if (!el) return;
    el.innerHTML = "";
    "reativity".split("").forEach((ch, i) => {
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.cssText = `display:inline-block;color:${LETTER_COLORS[i + 1]};text-shadow:0 0 40px ${LETTER_COLORS[i + 1]}66,0 0 80px ${LETTER_COLORS[i + 1]}33;`;
      span.className = "hero-char";
      el.appendChild(span);
    });
    charsBuilt.current = true;
  }, []);

  // ── Entrance ─────────────────────────────────────────────────────
  const playEntrance = useCallback(() => {
    const logoBox   = logoBoxRef.current;
    const title     = titleRef.current;
    const subtitle  = subtitleRef.current;
    const tagline   = taglineRef.current;
    const cta       = ctaRef.current;
    const starsEl   = starsRef.current;
    const aurora    = auroraRef.current;
    const flash     = flashRef.current;
    const sw1       = shockwave1Ref.current;
    const sw2       = shockwave2Ref.current;
    const content   = contentRef.current;
    const scrollInd = scrollIndRef.current;
    const starsContainer = starsRef.current;
    const section   = sectionRef.current;
    if (!title || !subtitle || !cta) return;

    if (!charsBuilt.current) buildChars();
    const chars = title.querySelectorAll<HTMLElement>(".hero-char");

    // ── Reset ─────────────────────────────────────────────────────
    if (content) { content.style.pointerEvents = ""; content.style.opacity = "1"; }
    if (starsEl) gsap.set(starsEl, { opacity: 1 });
    if (aurora)  gsap.set(aurora,  { opacity: 0 });
    if (flash)   gsap.set(flash,   { opacity: 0 });
    if (sw1)     gsap.set(sw1,     { opacity: 0, scale: 1 });
    if (sw2)     gsap.set(sw2,     { opacity: 0, scale: 1 });

    // Kill tweens and reset logoBox to stable state
    if (logoBox) {
      gsap.killTweensOf(logoBox);
      gsap.set(logoBox, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
    }

    // Reset chars
    gsap.set(chars, { clearProps: "all" });
    chars.forEach((el, i) => {
      el.style.display = "inline-block";
      const c = LETTER_COLORS[(i + 1) % LETTER_COLORS.length];
      el.style.color = c;
      el.style.textShadow = `0 0 40px ${c}66,0 0 80px ${c}33`;
    });
    gsap.set(chars,    { opacity: 0, y: 80, scale: 0 });
    gsap.set(subtitle, { opacity: 0, y: 40 });
    if (tagline)   gsap.set(tagline,   { opacity: 0, y: 30 });
    gsap.set(cta,      { opacity: 0, scale: 0.6, y: 20 });
    if (scrollInd) gsap.set(scrollInd, { opacity: 0 });

    // ── Build timeline ────────────────────────────────────────────
    if (entranceTl.current) entranceTl.current.kill();
    const tl = gsap.timeline({ delay: 0 });
    entranceTl.current = tl;

    // t=0 — WARP BURST: stars explode outward from center immediately
    tl.add(() => {
      if (starsContainer) {
        createWarpBurst(starsContainer);
        setTimeout(() => createWarpBurst(starsContainer!), 180);
      }
    }, 0);

    // t=0 — Aurora erupts in fast (subtle, fondo sigue negro)
    if (aurora) tl.to(aurora, { opacity: 0.65, duration: 1.0, ease: "power2.out" }, 0);

    // t=0.05 — Screen pre-flash (brief) to signal something is coming
    tl.add(() => {
      if (flash) {
        gsap.set(flash, { opacity: 0.25 });
        gsap.to(flash, { opacity: 0, duration: 0.4, ease: "power3.out" });
      }
    }, 0.05);

    // C: set to crash position immediately (off-screen above), then animate down
    if (logoBox) {
      gsap.set(logoBox, { opacity: 1, scale: 4.2, y: -380, rotation: -20 });
      tl.to(logoBox, { scale: 1, y: 0, rotation: 0, duration: 0.88, ease: "expo.out" }, 0.12);
    }

    // t=1.0 — BOOM: flash + shockwaves + star explosion + color rings
    tl.add(() => {
      // Big screen flash on impact
      if (flash) {
        gsap.set(flash, { opacity: 0.9 });
        gsap.to(flash, { opacity: 0, duration: 0.55, ease: "power2.out" });
      }
      // Shockwave rings
      if (sw1) { gsap.set(sw1, { opacity: 0.95, scale: 0.85 }); gsap.to(sw1, { opacity: 0, scale: 3.5, duration: 0.85, ease: "power2.out" }); }
      if (sw2) { gsap.set(sw2, { opacity: 0.7, scale: 0.85 }); gsap.to(sw2, { opacity: 0, scale: 5.0, duration: 1.2, ease: "power1.out", delay: 0.1 }); }

      // Big star burst from C position
      if (starsContainer && logoBox && section) {
        const lRect = logoBox.getBoundingClientRect();
        const sRect = section.getBoundingClientRect();
        const cx = ((lRect.left + lRect.width / 2 - sRect.left) / sRect.width) * 100;
        const cy = ((lRect.top + lRect.height / 2 - sRect.top) / sRect.height) * 100;
        createStarBurst(starsContainer, cx, cy, 4.5);
        setTimeout(() => createStarBurst(starsContainer!, cx, cy, 3.2), 80);
        setTimeout(() => createStarBurst(starsContainer!, cx, cy, 2.2), 190);
        setTimeout(() => createStarBurst(starsContainer!, cx, cy, 1.6), 360);

        // 5 color rings expanding from C position
        const ringColors = ["#a855f7", "#3b82f6", "#06b6d4", "#F2583E", "#fbbf24"];
        ringColors.forEach((color, i) => {
          setTimeout(() => createColorRing(starsContainer!, cx, cy, color, 0), i * 80);
        });
      }

      // C inner glow burst
      const ig = innerGlowRef.current;
      if (ig) {
        gsap.set(ig, { opacity: 1 });
        gsap.to(ig, { opacity: 0, duration: 0.9, ease: "power2.out" });
      }
    }, 1.0);

    // t=0.85 — letters blast in, staggered fast
    tl.to(chars, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.042, ease: "back.out(1.8)" }, 0.85);

    // t=1.5 — glow wave sweeps letters
    tl.to(chars, {
      textShadow: (i: number) => { const c = LETTER_COLORS[(i + 1) % LETTER_COLORS.length]; return `0 0 80px ${c},0 0 160px ${c}99`; },
      duration: 0.25, stagger: 0.035, ease: "power2.in",
    }, 1.5);
    tl.to(chars, {
      textShadow: (i: number) => { const c = LETTER_COLORS[(i + 1) % LETTER_COLORS.length]; return `0 0 40px ${c}66,0 0 80px ${c}33`; },
      duration: 0.5, stagger: 0.035, ease: "power2.out",
    }, "+=0.08");

    // t=1.2 — subtitle rises
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.2);

    // t=1.5 — tagline
    if (tagline) tl.to(tagline, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.5);

    // t=1.7 — CTA bounces in
    tl.to(cta, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "back.out(2.8)" }, 1.7);
    const pulseRing = cta.querySelector(".pulse-ring-cta");
    if (pulseRing) tl.to(pulseRing, { scale: 1.6, opacity: 0, duration: 1.8, repeat: -1, ease: "power1.out" }, "+=0.4");

    if (scrollInd) tl.to(scrollInd, { opacity: 1, duration: 0.6 }, "-=1.2");

    // Steady-state: float letters + gentle C pulse
    tl.add(() => {
      chars.forEach((ch, i) => {
        gsap.to(ch, { y: -4 + Math.sin(i) * 2.5, duration: 1.8 + Math.random() * 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.12 });
      });
      if (logoBox) {
        gsap.to(logoBox, { scale: 1.04, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }
    });
  }, [buildChars]);

  // Mount
  useEffect(() => {
    buildChars();
    playEntrance();
    return () => { if (entranceTl.current) entranceTl.current.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return from video
  const returnToHome = useCallback(() => {
    const videoContainer = videoContRef.current;
    const video = videoRef.current;
    const starsEl = starsRef.current;
    if (videoContainer) gsap.to(videoContainer, { clipPath: "circle(0% at 50% 50%)", duration: 1, ease: "power3.in", onComplete: () => { gsap.set(videoContainer, { opacity: 0 }); } });
    if (video) gsap.to(video, { volume: 0, duration: 0.8, onComplete: () => { video.pause(); video.currentTime = 0; video.muted = true; video.volume = 1; } });
    if (starsEl) gsap.to(starsEl, { opacity: 1, duration: 0.8, delay: 0.3 });
    setTimeout(() => { setShowVideo(false); setIsMuted(true); playEntrance(); }, 600);
  }, [playEntrance]);

  // Video ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const h = () => returnToHome();
    video.addEventListener("ended", h);
    return () => video.removeEventListener("ended", h);
  }, [returnToHome]);

  // Explosion trigger
  const triggerExplosion = useCallback(() => {
    if (showVideo) return;
    setShowVideo(true);
    if (entranceTl.current) entranceTl.current.kill();

    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const tagline = taglineRef.current;
    const cta = ctaRef.current;
    const particlesEl = particlesRef.current;
    const videoContainer = videoContRef.current;
    const video = videoRef.current;
    const starsEl = starsRef.current;
    const aurora = auroraRef.current;
    const scrollInd = scrollIndRef.current;
    const logoBox = logoBoxRef.current;
    if (!section || !title || !particlesEl || !videoContainer) return;

    const titleChars = title.querySelectorAll(".hero-char");
    titleChars.forEach(ch => gsap.killTweensOf(ch));
    if (logoBox) gsap.killTweensOf(logoBox);

    const sRect = section.getBoundingClientRect();
    const particles: Particle[] = [];

    const els = logoBox ? [logoBox, ...Array.from(titleChars)] : Array.from(titleChars);
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - sRect.left;
      const cy = r.top + r.height / 2 - sRect.top;
      for (let j = 0; j < 5; j++) {
        const p = document.createElement("div");
        const size = 3 + Math.random() * 9;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${color};left:${cx}px;top:${cy}px;pointer-events:none;box-shadow:0 0 ${size * 3}px ${color};`;
        particlesEl.appendChild(p);
        particles.push({ el: p, x: cx, y: cy, size, color });
      }
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("div");
      const size = 2 + Math.random() * 7;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const x = sRect.width * 0.15 + Math.random() * sRect.width * 0.7;
      const y = sRect.height * 0.25 + Math.random() * sRect.height * 0.4;
      p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};background:${color};left:${x}px;top:${y}px;pointer-events:none;box-shadow:0 0 ${size * 3}px ${color};`;
      particlesEl.appendChild(p);
      particles.push({ el: p, x, y, size, color });
    }

    const tl = gsap.timeline();
    tl.to(section, { filter: "brightness(3)", duration: 0.07, ease: "power4.in" });
    tl.to(section, { filter: "brightness(1)", duration: 0.55, ease: "power2.out" });

    if (aurora) tl.to(aurora, { opacity: 0, duration: 0.4 }, 0);

    if (logoBox) tl.to(logoBox, {
      x: (Math.random() - 0.5) * window.innerWidth,
      y: (Math.random() - 0.5) * window.innerHeight,
      rotation: (Math.random() - 0.5) * 400,
      scale: 0, opacity: 0, duration: 0.85, ease: "power3.in",
    }, 0);

    tl.to(titleChars, {
      x: () => (Math.random() - 0.5) * window.innerWidth * 1.6,
      y: () => (Math.random() - 0.5) * window.innerHeight * 1.6,
      rotation: () => (Math.random() - 0.5) * 720,
      scale: 0, opacity: 0, duration: 0.8, stagger: 0.018, ease: "power3.in",
    }, 0);

    if (subtitle)  tl.to(subtitle,  { opacity: 0, y: -60, duration: 0.35, ease: "power2.in" }, 0);
    if (tagline)   tl.to(tagline,   { opacity: 0, y: -40, duration: 0.3,  ease: "power2.in" }, 0);
    if (cta)       tl.to(cta,       { opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.in" }, 0);
    if (starsEl)   tl.to(starsEl,   { opacity: 0, duration: 0.55, ease: "power2.in" }, 0);
    if (scrollInd) tl.to(scrollInd, { opacity: 0, duration: 0.25 }, 0);

    particles.forEach(p => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 650;
      tl.to(p.el, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 200, scale: Math.random() * 2.5, opacity: 0, duration: 1.5 + Math.random() * 1, ease: "power2.out" }, 0.04 + Math.random() * 0.14);
    });

    tl.fromTo(videoContainer, { clipPath: "circle(0% at 50% 50%)", opacity: 1 }, { clipPath: "circle(85% at 50% 50%)", duration: 1.3, ease: "power3.out" }, 0.2);

    if (video) tl.add(() => { video.currentTime = 0; video.muted = false; video.loop = false; setIsMuted(false); video.play().catch(() => { video.muted = true; setIsMuted(true); video.play().catch(() => {}); }); }, 0.55);

    tl.add(() => { particles.forEach(p => { p.el.remove(); }); }, 3);
  }, [showVideo]);

  const toggleSound = useCallback(() => { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setIsMuted(v.muted); }, []);

  // Sizes — C is BIG inside the black box
  const C_BOX  = "clamp(8rem, 22vw, 19rem)";
  const C_FONT = "clamp(6.5rem, 18.5vw, 16rem)"; // bigger → fills ~84% of box
  const TXT_FONT = "clamp(3.2rem, 9.5vw, 8.5rem)";

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030014]">

      {/* Background gradients — subtle, no apachurra el negro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,40,200,0.10)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(242,88,62,0.07)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(6,182,212,0.05)_0%,transparent_40%)]" />

      {/* Screen flash overlay */}
      <div ref={flashRef} className="absolute inset-0 z-[50] pointer-events-none bg-white opacity-0" />

      {/* Aurora — brighter, visible from the start */}
      <div ref={auroraRef} className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-0">
        <div className="a1 absolute" style={{ width:"95%", height:"75%", top:"-5%", left:"2%", background:"radial-gradient(ellipse,rgba(124,58,237,0.18) 0%,rgba(168,85,247,0.08) 40%,transparent 70%)", filter:"blur(55px)" }} />
        <div className="a2 absolute" style={{ width:"80%", height:"70%", top:"10%", right:"-8%", background:"radial-gradient(ellipse,rgba(6,182,212,0.14) 0%,rgba(59,130,246,0.07) 40%,transparent 70%)", filter:"blur(60px)" }} />
        <div className="a3 absolute" style={{ width:"70%", height:"60%", bottom:"5%", left:"10%", background:"radial-gradient(ellipse,rgba(242,88,62,0.12) 0%,rgba(245,158,11,0.06) 40%,transparent 70%)", filter:"blur(55px)" }} />
        <div className="a4 absolute" style={{ width:"60%", height:"55%", top:"25%", left:"20%", background:"radial-gradient(ellipse,rgba(168,85,247,0.10) 0%,rgba(99,102,241,0.05) 40%,transparent 70%)", filter:"blur(65px)" }} />
      </div>

      {/* Starfield */}
      <div ref={starsRef} className="absolute inset-0 z-[2] pointer-events-none" />

      {/* Mouse orbs */}
      <motion.div style={{ x: sx, y: sy }} className="absolute inset-0 pointer-events-none z-[3]">
        <div className="absolute w-[650px] h-[650px] -top-[10%] -left-[8%] rounded-full bg-purple/10 blur-[130px]" style={{ animation:"morphBlob1 18s ease-in-out infinite" }} />
        <div className="absolute w-[550px] h-[550px] top-[20%] -right-[5%] rounded-full bg-coral/8 blur-[130px]" style={{ animation:"morphBlob2 22s ease-in-out infinite" }} />
        <div className="absolute w-[450px] h-[450px] bottom-[5%] left-[25%] rounded-full bg-cyan/5 blur-[110px]" />
      </motion.div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.012] z-[4]" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

      {/* Floating geometry */}
      <motion.svg className="absolute top-[12%] left-[5%] w-24 h-24 opacity-15 pointer-events-none z-[5]" viewBox="0 0 100 100" fill="none" animate={{ rotate:360 }} transition={{ duration:30, repeat:Infinity, ease:"linear" }}><circle cx="50" cy="50" r="40" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="8 5" /></motion.svg>
      <motion.svg className="absolute top-[8%] right-[7%] w-32 h-32 opacity-10 pointer-events-none z-[5]" viewBox="0 0 120 120" fill="none" animate={{ rotate:-360 }} transition={{ duration:45, repeat:Infinity, ease:"linear" }}><rect x="20" y="20" width="80" height="80" rx="8" stroke="#F2583E" strokeWidth="0.6" /></motion.svg>
      <motion.svg className="absolute bottom-[20%] left-[4%] w-28 h-28 opacity-10 pointer-events-none z-[5]" viewBox="0 0 100 100" fill="none" animate={{ y:[0,-20,0] }} transition={{ duration:10, repeat:Infinity }}><polygon points="50,8 92,92 8,92" stroke="#f59e0b" strokeWidth="0.6" /></motion.svg>
      <motion.svg className="absolute bottom-[25%] right-[5%] w-24 h-24 opacity-10 pointer-events-none z-[5]" viewBox="0 0 90 90" fill="none" animate={{ scale:[1,1.2,1], rotate:[0,60,0] }} transition={{ duration:14, repeat:Infinity }}><polygon points="45,5 85,27 85,63 45,85 5,63 5,27" stroke="#06b6d4" strokeWidth="0.6" /></motion.svg>

      {/* Breathing dots */}
      {[{ pos:"top-[28%] left-[15%]", color:"bg-purple/40" },{ pos:"top-[50%] right-[18%]", color:"bg-coral/40" },{ pos:"top-[65%] left-[55%]", color:"bg-cyan/30" },{ pos:"top-[15%] left-[45%]", color:"bg-magenta/30" },{ pos:"bottom-[30%] right-[30%]", color:"bg-gold/25" }].map((d,i)=>(
        <motion.div key={i} className={`absolute w-1.5 h-1.5 rounded-full ${d.color} ${d.pos} pointer-events-none z-[5]`} animate={{ scale:[1,2.5,1], opacity:[0.3,0.8,0.3] }} transition={{ duration:3+i, repeat:Infinity, delay:i*0.6 }} />
      ))}

      {/* VIDEO */}
      <div ref={videoContRef} className="absolute inset-0 z-10" style={{ clipPath:"circle(0% at 50% 50%)", opacity:0 }}>
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="auto"><source src="/demo-reel.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,0,20,0.7)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[#030014] to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 z-20">
          {showVideo && (
            <motion.a href="/cinema-editor?new=1" className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-lg hover:bg-white/20 transition-all" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.5, duration:0.8 }}>
              <span className="flex items-center gap-3">Crea tu primera presentación<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
            </motion.a>
          )}
        </div>
        {showVideo && (
          <motion.button initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }} transition={{ delay:1, duration:0.5 }} onClick={toggleSound} className="absolute bottom-20 right-8 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all" title={isMuted?"Activar sonido":"Silenciar"}>
            {isMuted ? (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>) : (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></svg>)}
          </motion.button>
        )}
      </div>

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* MAIN CONTENT */}
      <div ref={contentRef} className="relative z-30 text-center px-6 max-w-7xl mx-auto">

        {/* Badge */}
        <motion.div initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 mb-8 bg-white/[0.03] backdrop-blur-md">
          <span className="relative flex h-2 w-2"><span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-lime" /></span>
          <span className="text-white/50 text-sm font-medium">Potenciado por Inteligencia Artificial</span>
        </motion.div>

        {/* TITLE ROW */}
        <div className="flex items-center justify-center mb-5" style={{ gap:"0.04em" }}>

          {/* ══ C LOGO BOX — GRANDE ══ */}
          <div ref={logoBoxRef} className="relative flex-shrink-0" style={{ width:C_BOX, height:C_BOX }}>
            {/* Outer ambient glow */}
            <div className="absolute rounded-[18%] blur-3xl opacity-60" style={{ inset:"-18%", background:"linear-gradient(135deg,#7c3aed,#a855f7,#F2583E,#06b6d4)" }} />
            {/* Inner glow — fires on BOOM */}
            <div ref={innerGlowRef} className="absolute rounded-[18%] blur-3xl opacity-0" style={{ inset:"-12%", background:"radial-gradient(ellipse,#e879f9,#818cf8,#F2583E,#fbbf24)" }} />
            {/* Shockwave ring 1 */}
            <div ref={shockwave1Ref} className="absolute rounded-[18%] pointer-events-none opacity-0" style={{ inset:"-5%", border:"3px solid rgba(168,85,247,0.9)" }} />
            {/* Shockwave ring 2 */}
            <div ref={shockwave2Ref} className="absolute rounded-[18%] pointer-events-none opacity-0" style={{ inset:"-5%", border:"2px solid rgba(6,182,212,0.75)" }} />
            {/* Rotating gradient border — colores originales Creativity */}
            <div ref={gradientRef} className="absolute rounded-[18%]" style={{ inset:-4, background:"conic-gradient(from 0deg,#f43f5e,#f97316,#fbbf24,#86efac,#22d3ee,#38bdf8,#3b82f6,#7c3aed,#a855f7,#d946ef,#ec4899,#f43f5e)" }} />
            {/* ══ CUADRO NEGRO — C con gradiente de todos los colores ══ */}
            <div className="absolute rounded-[16%] overflow-hidden flex items-center justify-center" style={{ inset:5, background:"#030008" }}>
              {/* Glow de fondo del cuadrado (muy sutil, da profundidad) */}
              <div ref={innerColorRef} className="absolute" style={{
                inset:0,
                backgroundImage:"conic-gradient(from 0deg,#f43f5e,#f97316,#fbbf24,#86efac,#22d3ee,#38bdf8,#3b82f6,#7c3aed,#a855f7,#d946ef,#ec4899,#f43f5e)",
                opacity: 0.15,
              }} />
              {/* La C — gradient clip al texto, todos los colores rotan */}
              <span ref={cLetterRef}
                    className="relative font-[var(--font-display)] font-[900] select-none"
                    style={{
                      fontSize: C_FONT,
                      lineHeight: 1,
                      backgroundImage:"conic-gradient(from 0deg,#f43f5e,#f97316,#fbbf24,#86efac,#22d3ee,#38bdf8,#3b82f6,#7c3aed,#a855f7,#d946ef,#ec4899,#f43f5e)",
                      WebkitBackgroundClip:"text",
                      WebkitTextFillColor:"transparent",
                      backgroundClip:"text",
                      filter:"drop-shadow(0 0 20px rgba(168,85,247,0.8)) drop-shadow(0 0 50px rgba(6,182,212,0.5))",
                    }}>C</span>
            </div>
          </div>

          {/* "reativity" */}
          <div
            ref={titleRef}
            className="font-[var(--font-display)] font-[900] leading-[0.85] tracking-[-0.04em]"
            style={{ fontSize:TXT_FONT, marginLeft:"-0.015em" }}
          >
            reativity
          </div>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="mb-6">
          <h2 className="font-bold tracking-[-0.02em] whitespace-nowrap" style={{
            fontSize:"clamp(1.6rem,4.2vw,3.2rem)",
            backgroundImage:"linear-gradient(135deg,#7c3aed 0%,#a855f7 25%,#F2583E 55%,#06b6d4 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            Crea sin límites
          </h2>
        </div>

        {/* Tagline */}
        <div ref={taglineRef} className="mb-12">
          <p className="text-base md:text-lg text-white/35 max-w-xl mx-auto font-light leading-relaxed">
            La plataforma de presentaciones que{" "}
            <span className="text-white/60 font-medium">rompe con todo lo establecido</span>.
            <br className="hidden sm:block" />
            Canvas infinito. IA generativa. Transiciones cinematográficas.
          </p>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col items-center gap-5">
          <button onClick={triggerExplosion} className="hoverable group relative px-12 py-6 rounded-2xl overflow-hidden font-extrabold text-xl" style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7,#F2583E)", boxShadow:"0 0 50px rgba(124,58,237,0.35),0 0 100px rgba(168,85,247,0.18)" }}>
            <span className="pulse-ring-cta absolute inset-0 rounded-2xl border-2 border-white/30" />
            <span className="relative z-10 flex items-center gap-4 text-white">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              Despierta tu creatividad
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <span className="text-white/20 text-xs uppercase tracking-[0.3em]">Click para la experiencia completa</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30" style={{ opacity:0 }}>
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.5, repeat:Infinity }} className="flex flex-col items-center gap-2">
          <span className="text-white/15 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
            <motion.div animate={{ y:[0,8,0], opacity:[0.3,0.8,0.3] }} transition={{ duration:1.5, repeat:Infinity }} className="w-0.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/5 bg-black/30 backdrop-blur-sm py-2.5 z-40">
        <div className="marquee-left whitespace-nowrap flex" style={{ "--speed":"30s" } as React.CSSProperties}>
          {Array.from({ length:6 }).map((_,i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-4 text-[11px] font-semibold uppercase tracking-[0.25em]">
              <span className="text-white/15">Canvas Infinito</span><span className="text-coral/25">—</span>
              <span className="text-white/15">IA Generativa</span><span className="text-purple/25">—</span>
              <span className="text-white/15">Transiciones 3D</span><span className="text-cyan/25">—</span>
              <span className="text-white/15">100+ Plantillas</span><span className="text-gold/25">—</span>
              <span className="text-white/15">GSAP Premium</span><span className="text-magenta/25">—</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
