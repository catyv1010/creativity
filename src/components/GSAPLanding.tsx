"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { registerGSAPPlugins } from "@/lib/gsap-register";

registerGSAPPlugins();

/**
 * GSAPLanding — Enhances the landing page with premium scroll experience.
 *
 * IMPORTANT: Framer-motion already handles component-level animations.
 * This ONLY adds page-level effects that framer-motion can't do:
 * - Lenis smooth scroll
 * - Scroll-driven parallax
 * - Hero push-back on scroll
 * - Progress bar
 * - Micro-interaction hover enhancements
 * - Counter animations
 *
 * It does NOT touch h2, cards, or elements that framer-motion animates.
 */
export default function GSAPLanding() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Wait for DOM + fonts
    const timer = setTimeout(() => {
      initLenis();
      initEffects();
    }, 400);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}

// =====================================================================
// LENIS — silky smooth scroll (the #1 premium feel)
// =====================================================================
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// =====================================================================
// ALL EFFECTS
// =====================================================================
function initEffects() {
  hideScrollbar();
  addProgressBar();
  heroParallax();
  sectionParallax();
  marqueeScrollSpeed();
  hoverMicroInteractions();
  counterAnimations();
}

// =====================================================================
// HIDE SCROLLBAR — cleaner look
// =====================================================================
function hideScrollbar() {
  const style = document.createElement("style");
  style.textContent = `
    body::-webkit-scrollbar { display: none; }
    html { scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}

// =====================================================================
// PROGRESS BAR — gradient line at top with shimmer
// =====================================================================
function addProgressBar() {
  const bar = document.createElement("div");
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 3px; z-index: 99999;
    background: linear-gradient(90deg, #a855f7, #ec4899, #06b6d4, #a855f7);
    background-size: 300% 100%;
    transform-origin: left; transform: scaleX(0);
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  gsap.to(bar, { backgroundPosition: "-300% 0%", duration: 4, repeat: -1, ease: "none" });
  gsap.to(bar, {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });
}

// =====================================================================
// HERO PARALLAX — content pushes back, bg elements drift
// =====================================================================
function heroParallax() {
  const hero = document.querySelector("section:first-of-type");
  if (!hero) return;

  // Main content recedes on scroll — cinematic "leaving the scene" feel
  const content = hero.querySelector(".relative.z-10");
  if (content) {
    gsap.to(content, {
      y: -120,
      opacity: 0,
      scale: 0.88,
      filter: "blur(15px)",
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "45% top",
        scrub: 1.5,
      },
    });
  }

  // Floating SVG decorations get enhanced depth on scroll
  hero.querySelectorAll("svg[class*='absolute']").forEach((svg, i) => {
    gsap.to(svg, {
      yPercent: -30 - i * 20,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 2 + i,
      },
    });
  });
}

// =====================================================================
// SECTION PARALLAX — background orbs/blurs move at different speeds
// =====================================================================
function sectionParallax() {
  // All blur orbs (the large colored circles) get gentle parallax
  document.querySelectorAll("[class*='blur-'][class*='absolute'][class*='rounded-full']").forEach((orb, i) => {
    if ((orb as HTMLElement).offsetWidth < 100) return; // skip tiny dots

    gsap.to(orb, {
      yPercent: -20 + (i % 2) * 40,
      ease: "none",
      scrollTrigger: {
        trigger: orb.closest("section") || orb,
        start: "top bottom",
        end: "bottom top",
        scrub: 3,
      },
    });
  });

  // SVG decorations across all sections
  document.querySelectorAll("section svg[class*='absolute'][class*='pointer-events-none']").forEach((svg, i) => {
    gsap.to(svg, {
      yPercent: -25 - (i % 3) * 10,
      ease: "none",
      scrollTrigger: {
        trigger: svg.closest("section") || svg,
        start: "top bottom",
        end: "bottom top",
        scrub: 2 + (i % 3),
      },
    });
  });
}

// =====================================================================
// MARQUEE SCROLL SPEED — marquees accelerate as you scroll past
// =====================================================================
function marqueeScrollSpeed() {
  document.querySelectorAll(".marquee-left, .marquee-right").forEach((el) => {
    const isLeft = el.classList.contains("marquee-left");
    gsap.to(el, {
      x: isLeft ? -150 : 150,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") || el.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });
  });
}

// =====================================================================
// HOVER MICRO-INTERACTIONS — make buttons and cards feel alive
// =====================================================================
function hoverMicroInteractions() {
  // Only on desktop
  if (window.matchMedia("(hover: none)").matches) return;

  // Buttons — subtle scale bounce
  document.querySelectorAll("a[class*='rounded-2xl'], a[class*='rounded-full'], button[class*='rounded-full']").forEach((btn) => {
    const el = btn as HTMLElement;
    if (el.offsetWidth < 40 || el.offsetWidth > 500) return;

    el.addEventListener("mouseenter", () => {
      gsap.to(el, { scale: 1.03, duration: 0.35, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  });

  // Grid cards — lift on hover
  document.querySelectorAll(".grid > div, .grid > a").forEach((card) => {
    const el = card as HTMLElement;
    el.addEventListener("mouseenter", () => {
      gsap.to(el, { y: -6, duration: 0.35, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { y: 0, duration: 0.35, ease: "power2.out" });
    });
  });
}

// =====================================================================
// COUNTER ANIMATIONS — numbers count up when visible
// =====================================================================
function counterAnimations() {
  // Target stat-like elements with numbers
  document.querySelectorAll("[class*='text-5xl'], [class*='text-6xl'], [class*='text-7xl'], [class*='text-8xl']").forEach((el) => {
    const text = (el.textContent || "").trim();
    const match = text.match(/^([\d,.]+)(\+?%?[kKmM]?[xX]?.*)/);
    if (!match) return;

    const numStr = match[1].replace(/,/g, "");
    const target = parseFloat(numStr);
    const suffix = match[2] || "";
    if (isNaN(target) || target === 0) return;

    const obj = { val: 0 };
    const hasDecimal = numStr.includes(".");

    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = (hasDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString()) + suffix;
      },
    });
  });
}
