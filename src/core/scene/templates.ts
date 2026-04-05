import {
  createScene,
  createTextElement,
  createShapeElement,
  createAnimation,
  createCameraKeyframe,
} from "./SceneFactory";
import { createId } from "@/lib/id";
import type {
  Presentation, Scene, SceneElement, CameraKeyframe,
  IconContent, DividerContent, TextContent, ShapeContent,
  ElementInteraction,
} from "../types/presentation";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildPresentation(title: string, scenes: Scene[], bg = "#000000"): Presentation {
  let time = 0;
  const keyframes: CameraKeyframe[] = scenes.map((scene) => {
    const kf = createCameraKeyframe(scene.id, scene.worldTransform, time);
    time += scene.duration;
    return kf;
  });
  const now = new Date().toISOString();
  return {
    id: createId(), title,
    settings: { width: 1920, height: 1080, backgroundColor: bg, worldBounds: { width: 15000, height: 15000 }, defaultTransition: { type: "camera-move", duration: 1.2, easing: "power2.inOut", params: {} } },
    scenes, camera: { keyframes }, createdAt: now, updatedAt: now,
  };
}

function icon(name: string, x: number, y: number, size: number, color: string, anim?: string, delay = 0, interactions?: ElementInteraction[]): SceneElement {
  return {
    id: createId(), type: "icon", name,
    transform: { x, y, width: size, height: size, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
    style: {},
    content: { type: "icon", iconName: name, color, strokeWidth: 1.5, filled: false } as IconContent,
    animations: anim ? [createAnimation({ preset: anim as any, timing: { startTime: delay, duration: 0.8, repeat: 0, yoyo: false } })] : [],
    interactions,
    depthLayer: 0, locked: false, visible: true, zIndex: 5,
  };
}

function text(html: string, x: number, y: number, w: number, h: number, opts: Partial<TextContent> & { anim?: string; delay?: number; font?: string; depthLayer?: number; interactions?: ElementInteraction[] } = {}): SceneElement {
  const { anim, delay = 0, font, depthLayer = 0, interactions, ...contentOpts } = opts;
  return {
    id: createId(), type: "text", name: html.slice(0, 20),
    transform: { x, y, width: w, height: h, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
    style: {},
    content: { type: "text", html, fontFamily: font || "Inter", fontSize: 32, fontWeight: 400, color: "#ffffff", textAlign: "left", lineHeight: 1.4, ...contentOpts } as TextContent,
    animations: anim ? [createAnimation({ preset: anim as any, timing: { startTime: delay, duration: 0.9, repeat: 0, yoyo: false } })] : [],
    interactions,
    depthLayer, locked: false, visible: true, zIndex: 3,
  };
}

function shape(shapeType: "rect" | "circle" | "triangle", x: number, y: number, w: number, h: number, fill: string, opts: { opacity?: number; borderRadius?: number; blur?: number; anim?: string; delay?: number; depthLayer?: number; interactions?: ElementInteraction[]; zIndex?: number } = {}): SceneElement {
  const { opacity = 1, borderRadius, blur, anim, delay = 0, depthLayer = 0, interactions, zIndex = 1 } = opts;
  return {
    id: createId(), type: "shape", name: shapeType,
    transform: { x, y, width: w, height: h, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity },
    style: { borderRadius: borderRadius ?? (shapeType === "circle" ? 9999 : 0), filter: blur ? `blur(${blur}px)` : undefined },
    content: { type: "shape", shape: shapeType, fill, stroke: undefined, strokeWidth: 0 } as ShapeContent,
    animations: anim ? [createAnimation({ preset: anim as any, timing: { startTime: delay, duration: 0.8, repeat: 0, yoyo: false } })] : [],
    interactions,
    depthLayer, locked: false, visible: true, zIndex,
  };
}

function divider(x: number, y: number, w: number, h: number, color: string, style: "solid" | "gradient" | "dots" = "gradient"): SceneElement {
  return {
    id: createId(), type: "divider", name: "divider",
    transform: { x, y, width: w, height: h, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 0.5 },
    style: {},
    content: { type: "divider", style, color, thickness: 2, direction: "horizontal" } as DividerContent,
    animations: [], depthLayer: 0, locked: false, visible: true, zIndex: 2,
  };
}

// ---------------------------------------------------------------------------
// 1. APERTURA CINEMATICA — Dramatic, cinematic, Genially-level
// ---------------------------------------------------------------------------

export function createCinematicOpener(): Presentation {
  // Scene 1 — Hero con titulo grande y orbes brillantes
  const s1 = createScene({
    name: "Hero",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0f0a2a",
    backgroundGradient: "radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.35) 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(236,72,153,0.25) 0%, transparent 55%)",
    duration: 5,
    transition: { type: "camera-move", duration: 1, easing: "power2.inOut", params: {} },
    elements: [
      // Glowing orbs — visible!
      shape("circle", -50, 50, 500, 500, "rgba(124,58,237,0.2)", { depthLayer: -1, blur: 60, anim: "fadeIn" }),
      shape("circle", 1300, 500, 600, 600, "rgba(236,72,153,0.15)", { depthLayer: -1, blur: 50, anim: "fadeIn", delay: 0.2 }),
      shape("circle", 700, -150, 350, 350, "rgba(59,130,246,0.15)", { depthLayer: -1, blur: 35 }),

      // Accent line — bright purple
      divider(860, 475, 200, 4, "#a855f7", "gradient"),

      // Main title — big and bold
      text("CREATIVITY", 260, 300, 1400, 150, { font: "Bebas Neue", fontSize: 130, fontWeight: 400, color: "#ffffff", textAlign: "center", anim: "cinematicZoom", delay: 0.2 }),

      // Subtitle — legible
      text("Presentaciones que cuentan historias", 410, 500, 1100, 50, { font: "Inter", fontSize: 26, fontWeight: 300, color: "rgba(255,255,255,0.65)", textAlign: "center", anim: "fadeIn", delay: 0.8 }),

      // Decorative icons — brighter
      icon("Sparkles", 300, 340, 44, "#c084fc", "scaleIn", 1.0),
      icon("Zap", 1380, 360, 40, "#818cf8", "scaleIn", 1.2),
      icon("Star", 1420, 510, 35, "#f472b6", "scaleIn", 1.4),

      // Bottom hint
      text("→ para continuar", 810, 950, 300, 30, { fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.25)", textAlign: "center" }),
    ],
  });

  // Scene 2 — Propuesta de valor con iconos grandes
  const s2 = createScene({
    name: "Propuesta",
    worldTransform: { x: 2400, y: -300, z: 0, rotation: -3, scale: 1 },
    backgroundColor: "#0e0e28",
    backgroundGradient: "linear-gradient(135deg, #080818 0%, #0f172a 100%)",
    duration: 5,
    transition: { type: "zoom-blur", duration: 1.4, easing: "power3.inOut", params: {} },
    elements: [
      // Section label
      text("QUE HACEMOS", 160, 120, 400, 30, { font: "Inter", fontSize: 13, fontWeight: 600, color: "rgba(168,85,247,0.7)", textAlign: "left", letterSpacing: 4, anim: "fadeIn", delay: 0.2 }),
      divider(160, 160, 80, 2, "rgba(168,85,247,0.4)", "solid"),

      // Main heading
      text("Transformamos ideas\nen experiencias visuales", 160, 180, 800, 180, { font: "DM Serif Display", fontSize: 56, fontWeight: 400, color: "#ffffff", textAlign: "left", lineHeight: 1.2, anim: "slideInLeft", delay: 0.3 }),

      // Three feature cards with icons
      // Card 1
      shape("rect", 160, 440, 480, 200, "rgba(255,255,255,0.08)", { borderRadius: 16, anim: "slideInUp", delay: 0.5, interactions: [{ type: "hover-lift", params: {} }], zIndex: 4 }),
      icon("Layers", 200, 475, 48, "#a855f7", "scaleIn", 0.7),
      text("Capas Cinematicas", 270, 470, 340, 35, { font: "Inter", fontSize: 20, fontWeight: 600, color: "#ffffff", anim: "fadeIn", delay: 0.8 }),
      text("Profundidad real con parallax y capas de contenido", 270, 510, 340, 50, { fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.55)", anim: "fadeIn", delay: 0.9 }),

      // Card 2
      shape("rect", 160, 660, 480, 200, "rgba(255,255,255,0.08)", { borderRadius: 16, anim: "slideInUp", delay: 0.7, interactions: [{ type: "hover-lift", params: {} }], zIndex: 4 }),
      icon("Wand2", 200, 695, 48, "#6366f1", "scaleIn", 0.9),
      text("Transiciones de Cine", 270, 690, 340, 35, { font: "Inter", fontSize: 20, fontWeight: 600, color: "#ffffff", anim: "fadeIn", delay: 1.0 }),
      text("Dolly zoom, whip pan, iris y mas efectos de camara", 270, 730, 340, 50, { fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.55)", anim: "fadeIn", delay: 1.1 }),

      // Right side — large decorative icon
      icon("Film", 1100, 250, 400, "rgba(99,102,241,0.2)", "fadeIn", 0.4),
      icon("Play", 1240, 400, 120, "rgba(168,85,247,0.3)", "scaleIn", 1.2),
    ],
  });

  // Scene 3 — Stats/Numbers impactantes
  const s3 = createScene({
    name: "Impacto",
    worldTransform: { x: 4800, y: 400, z: 0, rotation: 2, scale: 1 },
    backgroundColor: "#0a0a1a",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)",
    duration: 5,
    transition: { type: "whip-pan", duration: 0.8, easing: "power4.inOut", params: {} },
    elements: [
      // Big number cards
      shape("rect", 100, 200, 500, 350, "rgba(168,85,247,0.18)", { borderRadius: 24, anim: "slideInUp", delay: 0.2, interactions: [{ type: "hover-glow", params: { color: "rgba(168,85,247,0.3)" } }], zIndex: 4 }),
      text("10x", 100, 240, 500, 150, { font: "Bebas Neue", fontSize: 140, fontWeight: 400, color: "#a855f7", textAlign: "center", anim: "cinematicZoom", delay: 0.3 }),
      text("mas engagement que\npresentaciones tradicionales", 100, 400, 500, 60, { fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.5)", textAlign: "center", anim: "fadeIn", delay: 0.6 }),

      shape("rect", 700, 200, 500, 350, "rgba(99,102,241,0.18)", { borderRadius: 24, anim: "slideInUp", delay: 0.4, interactions: [{ type: "hover-glow", params: { color: "rgba(99,102,241,0.3)" } }], zIndex: 4 }),
      text("60fps", 700, 240, 500, 150, { font: "Bebas Neue", fontSize: 140, fontWeight: 400, color: "#6366f1", textAlign: "center", anim: "cinematicZoom", delay: 0.5 }),
      text("animaciones fluidas\ncon motor GSAP", 700, 400, 500, 60, { fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.5)", textAlign: "center", anim: "fadeIn", delay: 0.8 }),

      shape("rect", 1300, 200, 500, 350, "rgba(236,72,153,0.18)", { borderRadius: 24, anim: "slideInUp", delay: 0.6, interactions: [{ type: "hover-glow", params: { color: "rgba(236,72,153,0.3)" } }], zIndex: 4 }),
      text("∞", 1300, 240, 500, 150, { font: "Bebas Neue", fontSize: 140, fontWeight: 400, color: "#ec4899", textAlign: "center", anim: "cinematicZoom", delay: 0.7 }),
      text("posibilidades creativas\nsin limites", 1300, 400, 500, 60, { fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.5)", textAlign: "center", anim: "fadeIn", delay: 1.0 }),

      // Bottom tagline
      text("El futuro de las presentaciones es cinematografico", 360, 700, 1200, 50, { font: "DM Serif Display", fontSize: 32, fontWeight: 400, color: "rgba(255,255,255,0.45)", textAlign: "center", anim: "fadeIn", delay: 1.2 }),
    ],
  });

  // Scene 4 — Features grid interactivo
  const s4 = createScene({
    name: "Features",
    worldTransform: { x: 7200, y: -200, z: 0, rotation: -1, scale: 1 },
    backgroundColor: "#0c0c22",
    backgroundGradient: "linear-gradient(180deg, #060612 0%, #0f0f2e 100%)",
    duration: 5,
    transition: { type: "dolly-zoom", duration: 1.5, easing: "power3.inOut", params: { perspectiveEnd: 600, counterScale: 1.1 } },
    elements: [
      text("FEATURES", 160, 80, 300, 30, { font: "Inter", fontSize: 13, fontWeight: 600, color: "rgba(99,102,241,0.7)", letterSpacing: 4, anim: "fadeIn" }),
      text("Todo lo que necesitas", 160, 120, 800, 70, { font: "DM Serif Display", fontSize: 48, color: "#fff", anim: "slideInLeft", delay: 0.2 }),

      // Feature grid — 2x3
      ...[
        { icon: "Camera", title: "Camara Virtual", desc: "Vuela entre escenas como en el cine", color: "#a855f7", gx: 0, gy: 0 },
        { icon: "Layers", title: "Parallax", desc: "Capas con profundidad y movimiento", color: "#6366f1", gx: 1, gy: 0 },
        { icon: "Sparkles", title: "Animaciones", desc: "20+ presets cinematograficos", color: "#ec4899", gx: 2, gy: 0 },
        { icon: "MousePointer2", title: "Interactivo", desc: "Hover, tooltips, reveals y mas", color: "#06b6d4", gx: 0, gy: 1 },
        { icon: "Download", title: "Exportar", desc: "HTML standalone listo para usar", color: "#f59e0b", gx: 1, gy: 1 },
        { icon: "Share2", title: "Compartir", desc: "Un link y listo", color: "#84cc16", gx: 2, gy: 1 },
      ].flatMap((f, i) => {
        const cx = 160 + f.gx * 540;
        const cy = 250 + f.gy * 310;
        return [
          shape("rect", cx, cy, 500, 270, "rgba(255,255,255,0.07)", { borderRadius: 20, anim: "slideInUp", delay: 0.3 + i * 0.15, interactions: [{ type: "hover-lift", params: {} }, { type: "hover-glow", params: { color: `${f.color}33` } }], zIndex: 4 }),
          icon(f.icon, cx + 30, cy + 35, 44, f.color, "scaleIn", 0.5 + i * 0.15),
          text(f.title, cx + 30, cy + 100, 440, 35, { font: "Inter", fontSize: 22, fontWeight: 600, color: "#fff", anim: "fadeIn", delay: 0.6 + i * 0.15 }),
          text(f.desc, cx + 30, cy + 145, 440, 50, { fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.55)", anim: "fadeIn", delay: 0.7 + i * 0.15 }),
          // Subtle accent line
          shape("rect", cx + 30, cy + 90, 40, 3, f.color, { borderRadius: 4, opacity: 0.6 }),
        ];
      }),
    ],
  });

  // Scene 5 — CTA Final
  const s5 = createScene({
    name: "Final",
    worldTransform: { x: 9600, y: 200, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#050510",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%)",
    duration: 5,
    transition: { type: "fade", duration: 1.5, easing: "power2.inOut", params: {} },
    elements: [
      // Large decorative circles
      shape("circle", 600, 150, 500, 500, "rgba(168,85,247,0.15)", { blur: 30, depthLayer: -1 }),
      shape("circle", 900, 350, 300, 300, "rgba(99,102,241,0.2)", { blur: 20, depthLayer: -1 }),

      text("Comienza a crear", 310, 300, 1300, 120, { font: "DM Serif Display", fontSize: 80, fontWeight: 400, color: "#ffffff", textAlign: "center", anim: "dramaticReveal", delay: 0.3 }),

      divider(810, 440, 300, 3, "rgba(168,85,247,0.5)", "gradient"),

      text("Tu historia merece ser contada\nde forma extraordinaria", 460, 470, 1000, 80, { font: "Inter", fontSize: 24, fontWeight: 300, color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.6, anim: "fadeIn", delay: 0.8 }),

      // CTA Button shape
      shape("rect", 760, 600, 400, 60, "rgba(168,85,247,0.9)", { borderRadius: 30, anim: "scaleIn", delay: 1.2, interactions: [{ type: "hover-scale", params: { scale: 1.05 } }, { type: "hover-glow", params: { color: "rgba(168,85,247,0.5)" } }], zIndex: 6 }),
      text("Crear presentacion →", 760, 610, 400, 40, { font: "Inter", fontSize: 18, fontWeight: 600, color: "#ffffff", textAlign: "center", anim: "fadeIn", delay: 1.4 }),

      // Floating icons
      icon("Heart", 350, 600, 30, "rgba(236,72,153,0.2)", "scaleIn", 1.5),
      icon("Star", 1500, 350, 35, "rgba(251,191,36,0.2)", "scaleIn", 1.6),
      icon("Rocket", 1450, 600, 40, "rgba(99,102,241,0.2)", "scaleIn", 1.7),
    ],
  });

  return buildPresentation("Apertura Cinematica", [s1, s2, s3, s4, s5]);
}

// ---------------------------------------------------------------------------
// 2. HISTORIA PARALLAX — Layered storytelling with depth
// ---------------------------------------------------------------------------

export function createParallaxStory(): Presentation {
  const parallaxConfig = {
    enabled: true,
    layers: [
      { depthLayer: -1, speedMultiplier: 0.5, blur: 2 },
      { depthLayer: 0, speedMultiplier: 1, blur: 0 },
      { depthLayer: 1, speedMultiplier: 1.5, blur: 0 },
    ],
    depthScale: 1,
    perspective: 1200,
  };

  const s1 = createScene({
    name: "Inicio",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#021a2b",
    backgroundGradient: "linear-gradient(180deg, #021a2b 0%, #0a3d5c 100%)",
    duration: 5,
    transition: { type: "camera-move", duration: 1, easing: "power2.inOut", params: {} },
    parallax: parallaxConfig,
    elements: [
      // Background layer decorations (depth -1)
      shape("circle", -200, 600, 500, 500, "rgba(6,182,212,0.18)", { depthLayer: -1, blur: 20 }),
      shape("circle", 1500, -100, 700, 700, "rgba(20,184,166,0.15)", { depthLayer: -1, blur: 25 }),
      shape("circle", 800, 800, 400, 400, "rgba(6,182,212,0.03)", { depthLayer: -1, blur: 15 }),

      // Main content (depth 0)
      text("PARALLAX", 260, 250, 1400, 200, { font: "Oswald", fontSize: 160, fontWeight: 400, color: "rgba(255,255,255,0.9)", textAlign: "center", anim: "cinematicZoom", delay: 0.2 }),
      text("STORYTELLING", 260, 430, 1400, 80, { font: "Source Sans 3", fontSize: 40, fontWeight: 300, color: "rgba(6,182,212,0.7)", textAlign: "center", letterSpacing: 12, anim: "fadeIn", delay: 0.6 }),

      divider(760, 530, 400, 2, "rgba(6,182,212,0.4)", "gradient"),

      text("Cada capa cuenta una parte de la historia", 460, 560, 1000, 40, { font: "Source Sans 3", fontSize: 20, fontWeight: 300, color: "rgba(255,255,255,0.45)", textAlign: "center", anim: "fadeIn", delay: 1.0 }),

      // Foreground accents (depth 1)
      icon("Waves", 150, 800, 60, "rgba(6,182,212,0.15)", undefined, 0),
      icon("Compass", 1650, 200, 50, "rgba(20,184,166,0.15)", "scaleIn", 1.2),
    ],
  });

  const s2 = createScene({
    name: "Profundidad",
    worldTransform: { x: 2400, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0a2e3f",
    backgroundGradient: "linear-gradient(135deg, #0a2e3f 0%, #134e6f 100%)",
    duration: 5,
    transition: { type: "parallax-shift", duration: 1.8, easing: "power2.inOut", params: {} },
    parallax: parallaxConfig,
    elements: [
      shape("circle", 1300, -100, 600, 600, "rgba(6,182,212,0.15)", { depthLayer: -1, blur: 20 }),

      text("Capas de\nProfundidad", 160, 200, 700, 200, { font: "Oswald", fontSize: 64, fontWeight: 400, color: "#fff", lineHeight: 1.1, anim: "slideInLeft", delay: 0.2 }),
      divider(160, 410, 100, 3, "#06b6d4", "solid"),

      text("Los elementos en diferentes capas se mueven a distintas velocidades, creando una ilusion de profundidad cinematografica.", 160, 440, 650, 120, { font: "Source Sans 3", fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, anim: "fadeIn", delay: 0.5 }),

      // Depth visualization - three stacked cards
      shape("rect", 950, 150, 700, 250, "rgba(6,182,212,0.03)", { borderRadius: 16, depthLayer: -1, anim: "slideInRight", delay: 0.4 }),
      text("Capa de fondo", 990, 240, 300, 30, { fontSize: 14, color: "rgba(255,255,255,0.35)", depthLayer: -1 }),

      shape("rect", 1000, 300, 700, 250, "rgba(6,182,212,0.08)", { borderRadius: 16, depthLayer: 0, anim: "slideInRight", delay: 0.6 }),
      text("Capa principal", 1040, 390, 300, 30, { fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)" }),

      shape("rect", 1050, 450, 700, 250, "rgba(6,182,212,0.15)", { borderRadius: 16, depthLayer: 1, anim: "slideInRight", delay: 0.8, interactions: [{ type: "hover-lift", params: {} }], zIndex: 5 }),
      text("Capa frontal", 1090, 540, 300, 30, { fontSize: 18, fontWeight: 600, color: "rgba(6,182,212,0.9)" }),
    ],
  });

  const s3 = createScene({
    name: "Movimiento",
    worldTransform: { x: 4800, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0c3547",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(20,184,166,0.1) 0%, transparent 60%)",
    duration: 5,
    transition: { type: "parallax-shift", duration: 1.8, easing: "power2.inOut", params: {} },
    parallax: parallaxConfig,
    elements: [
      shape("circle", 100, 100, 300, 300, "rgba(20,184,166,0.15)", { depthLayer: -1, blur: 15 }),

      text("El movimiento\ncrea emocion", 300, 250, 1320, 250, { font: "Oswald", fontSize: 72, fontWeight: 400, color: "#fff", textAlign: "center", lineHeight: 1.15, anim: "dramaticReveal", delay: 0.3 }),

      // Animated icons that represent movement
      ...[
        { name: "ArrowRight", x: 400, y: 600, d: 0.5 },
        { name: "MoveRight", x: 600, y: 620, d: 0.7 },
        { name: "ArrowBigRight", x: 800, y: 590, d: 0.9 },
        { name: "CornerDownRight", x: 1000, y: 610, d: 1.1 },
        { name: "MoveUpRight", x: 1200, y: 580, d: 1.3 },
      ].map(i => icon(i.name, i.x, i.y, 50, "rgba(6,182,212,0.4)", "slideInLeft", i.d)),

      text("Cada transicion entre escenas mueve las capas a diferentes velocidades", 460, 720, 1000, 50, { fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.45)", textAlign: "center", anim: "fadeIn", delay: 1.5 }),
    ],
  });

  const s4 = createScene({
    name: "Cierre",
    worldTransform: { x: 7200, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#021a2b",
    backgroundGradient: "radial-gradient(ellipse at 50% 40%, rgba(6,182,212,0.1) 0%, transparent 60%)",
    duration: 5,
    transition: { type: "parallax-shift", duration: 2, easing: "power2.inOut", params: {} },
    parallax: parallaxConfig,
    elements: [
      shape("circle", 700, 200, 500, 500, "rgba(6,182,212,0.18)", { depthLayer: -1, blur: 25 }),
      text("FIN", 560, 350, 800, 200, { font: "Oswald", fontSize: 180, fontWeight: 400, color: "rgba(6,182,212,0.8)", textAlign: "center", anim: "blurIn", delay: 0.3 }),
      text("La profundidad cambia todo", 510, 570, 900, 40, { font: "Source Sans 3", fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.25)", textAlign: "center", anim: "fadeIn", delay: 1.0 }),
    ],
  });

  return buildPresentation("Historia Parallax", [s1, s2, s3, s4]);
}

// ---------------------------------------------------------------------------
// 3. NOIR SPOTLIGHT — Minimal, dramatic, high contrast
// ---------------------------------------------------------------------------

export function createNoirSpotlight(): Presentation {
  const s1 = createScene({
    name: "NOIR",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#030303",
    duration: 4,
    transition: { type: "camera-move", duration: 1, easing: "power2.inOut", params: {} },
    elements: [
      // Spotlight effect
      shape("circle", 560, 190, 800, 800, "rgba(255,255,255,0.015)", { blur: 60 }),

      text("NOIR", 260, 330, 1400, 300, { font: "Anton", fontSize: 240, fontWeight: 400, color: "#ffffff", textAlign: "center", anim: "blurIn", delay: 0.3 }),

      divider(860, 620, 200, 1, "rgba(255,255,255,0.15)", "gradient"),

      text("A Study in Light and Shadow", 560, 650, 800, 40, { font: "DM Serif Display", fontSize: 24, fontWeight: 400, color: "rgba(255,255,255,0.35)", textAlign: "center", anim: "fadeIn", delay: 1.2 }),
    ],
  });

  const s2 = createScene({
    name: "Cita",
    worldTransform: { x: 2200, y: 1200, z: 0, rotation: 5, scale: 1 },
    backgroundColor: "#030303",
    duration: 5,
    transition: { type: "iris", duration: 1.2, easing: "power2.inOut", params: {} },
    elements: [
      shape("circle", 700, 250, 500, 500, "rgba(255,255,255,0.01)", { blur: 40 }),

      // Quote marks
      text('"', 350, 250, 100, 150, { font: "DM Serif Display", fontSize: 120, color: "rgba(255,255,255,0.08)" }),

      text("En la oscuridad,\nun solo punto de luz\nbasta para contar\nuna historia completa.", 400, 320, 1100, 300, { font: "DM Serif Display", fontSize: 44, fontWeight: 400, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.5, anim: "fadeIn", delay: 0.5 }),

      divider(810, 680, 300, 1, "rgba(255,255,255,0.1)", "gradient"),

      text("— El poder del minimalismo", 660, 710, 600, 30, { font: "DM Sans", fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.15)", textAlign: "center", anim: "fadeIn", delay: 1.5 }),
    ],
  });

  const s3 = createScene({
    name: "Constelacion",
    worldTransform: { x: 4400, y: 2400, z: 0, rotation: -3, scale: 1 },
    backgroundColor: "#030303",
    duration: 5,
    transition: { type: "film-grain-cut", duration: 0.5, easing: "power1.out", params: {} },
    elements: [
      // Constellation of dots
      ...[
        { x: 700, y: 300, s: 12 }, { x: 850, y: 250, s: 8 }, { x: 950, y: 380, s: 15 },
        { x: 1100, y: 280, s: 10 }, { x: 1050, y: 480, s: 6 }, { x: 800, y: 500, s: 9 },
        { x: 1200, y: 420, s: 11 }, { x: 750, y: 400, s: 7 }, { x: 1000, y: 200, s: 13 },
        { x: 900, y: 550, s: 8 }, { x: 1150, y: 550, s: 10 }, { x: 650, y: 350, s: 6 },
      ].map((d, i) =>
        shape("circle", d.x, d.y, d.s, d.s, "#ffffff", { opacity: 0.6, anim: "scaleIn", delay: 0.2 + i * 0.1 })
      ),

      // Connecting lines (subtle)
      divider(700, 310, 200, 1, "rgba(255,255,255,0.18)", "solid"),
      divider(950, 390, 200, 1, "rgba(255,255,255,0.18)", "solid"),

      text("Cada punto de luz tiene un proposito", 510, 700, 900, 40, { font: "DM Serif Display", fontSize: 24, color: "rgba(255,255,255,0.35)", textAlign: "center", anim: "fadeIn", delay: 1.5 }),
    ],
  });

  const s4 = createScene({
    name: "FIN",
    worldTransform: { x: 6600, y: 3600, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#030303",
    duration: 4,
    transition: { type: "iris", duration: 1.5, easing: "power2.inOut", params: {} },
    elements: [
      shape("circle", 760, 340, 400, 400, "rgba(255,255,255,0.01)", { blur: 50 }),
      text("FIN", 560, 380, 800, 250, { font: "Anton", fontSize: 200, fontWeight: 400, color: "rgba(255,255,255,0.8)", textAlign: "center", anim: "dramaticReveal", delay: 0.5 }),
      shape("circle", 935, 500, 50, 50, "#ffffff", { opacity: 0.03, anim: "fadeIn", delay: 1.5 }),
    ],
  });

  return buildPresentation("Noir Spotlight", [s1, s2, s3, s4]);
}

// ---------------------------------------------------------------------------
// 4. REVELACION EPICA — Zoom into worlds within worlds
// ---------------------------------------------------------------------------

export function createEpicReveal(): Presentation {
  const s1 = createScene({
    name: "Descubre",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0c0a1d",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 60%)",
    duration: 4,
    transition: { type: "camera-move", duration: 1, easing: "power2.inOut", params: {} },
    elements: [
      shape("circle", 560, 140, 800, 800, "rgba(99,102,241,0.03)", { blur: 40 }),
      text("DESCUBRE", 160, 320, 1600, 250, { font: "Archivo Black", fontSize: 160, fontWeight: 400, color: "#ffffff", textAlign: "center", anim: "cinematicZoom", delay: 0.2 }),
      icon("Eye", 910, 600, 60, "rgba(99,102,241,0.3)", "scaleIn", 0.8),
      text("Zoom para revelar cada capa", 610, 680, 700, 30, { fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.35)", textAlign: "center", anim: "fadeIn", delay: 1.2 }),
    ],
  });

  const s2 = createScene({
    name: "Capa 1",
    worldTransform: { x: 600, y: 400, z: -200, rotation: -5, scale: 1.5 },
    backgroundColor: "#110e2a",
    backgroundGradient: "radial-gradient(ellipse at 30% 70%, rgba(124,58,237,0.12) 0%, transparent 60%)",
    duration: 5,
    transition: { type: "dolly-zoom", duration: 1.8, easing: "power3.inOut", params: { perspectiveEnd: 600, counterScale: 1.2 } },
    elements: [
      text("VISION", 160, 100, 400, 60, { font: "Inter", fontSize: 13, fontWeight: 600, color: "rgba(124,58,237,0.6)", letterSpacing: 4, anim: "fadeIn" }),
      text("Cada zoom revela\nun nuevo mundo", 160, 150, 800, 200, { font: "Archivo Black", fontSize: 56, color: "#fff", lineHeight: 1.15, anim: "blurIn", delay: 0.3 }),

      // Cards with icons
      shape("rect", 160, 420, 480, 240, "rgba(124,58,237,0.2)", { borderRadius: 20, anim: "slideInUp", delay: 0.5, interactions: [{ type: "hover-lift", params: {} }], zIndex: 4 }),
      icon("Lightbulb", 200, 460, 44, "#7c3aed", "scaleIn", 0.7),
      text("Ideas", 260, 460, 300, 30, { font: "Inter", fontSize: 20, fontWeight: 600, color: "#fff" }),
      text("Las mejores ideas nacen cuando miras desde una perspectiva diferente", 200, 520, 400, 60, { fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.55)" }),

      shape("rect", 700, 420, 480, 240, "rgba(124,58,237,0.2)", { borderRadius: 20, anim: "slideInUp", delay: 0.7, interactions: [{ type: "hover-lift", params: {} }], zIndex: 4 }),
      icon("Target", 740, 460, 44, "#a855f7", "scaleIn", 0.9),
      text("Enfoque", 800, 460, 300, 30, { font: "Inter", fontSize: 20, fontWeight: 600, color: "#fff" }),
      text("Cada nivel de profundidad agrega claridad a tu mensaje", 740, 520, 400, 60, { fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.55)" }),
    ],
  });

  const s3 = createScene({
    name: "Capa 2",
    worldTransform: { x: 1200, y: 800, z: -400, rotation: 3, scale: 2 },
    backgroundColor: "#1a0e36",
    backgroundGradient: "radial-gradient(ellipse at 70% 30%, rgba(236,72,153,0.1) 0%, transparent 60%)",
    duration: 5,
    transition: { type: "dolly-zoom", duration: 2, easing: "power3.inOut", params: { perspectiveEnd: 500, counterScale: 1.15 } },
    elements: [
      shape("circle", 1200, 100, 500, 500, "rgba(236,72,153,0.15)", { blur: 30 }),

      text("MAS PROFUNDO", 160, 100, 600, 40, { font: "Inter", fontSize: 13, fontWeight: 600, color: "rgba(236,72,153,0.6)", letterSpacing: 4, anim: "fadeIn" }),
      text("Donde la creatividad\nno tiene fondo", 160, 160, 900, 200, { font: "Archivo Black", fontSize: 52, color: "#fff", lineHeight: 1.15, anim: "splitReveal", delay: 0.3 }),

      // Progress dots
      ...[0, 1, 2, 3, 4].map((i) =>
        shape("circle", 160 + i * 50, 400, 12, 12, i < 3 ? "#ec4899" : "rgba(255,255,255,0.1)", { anim: "scaleIn", delay: 0.5 + i * 0.15 })
      ),

      text("Nivel 3 de 5", 160, 430, 200, 20, { fontSize: 12, fontWeight: 500, color: "rgba(236,72,153,0.5)" }),

      // Quote
      text("La profundidad es lo que separa lo bueno de lo extraordinario", 160, 550, 800, 80, { font: "DM Serif Display", fontSize: 28, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, anim: "fadeIn", delay: 1.0 }),
    ],
  });

  const s4 = createScene({
    name: "Capa 3",
    worldTransform: { x: 1800, y: 1200, z: -600, rotation: -2, scale: 2.5 },
    backgroundColor: "#1f0a2e",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.08) 0%, transparent 60%)",
    duration: 5,
    transition: { type: "dolly-zoom", duration: 2, easing: "power3.inOut", params: { perspectiveEnd: 400, counterScale: 1.1 } },
    elements: [
      text("IMPACTO", 360, 250, 1200, 200, { font: "Archivo Black", fontSize: 100, color: "rgba(244,63,94,0.9)", textAlign: "center", anim: "cinematicZoom", delay: 0.3 }),

      // Three impact metrics
      ...[
        { num: "97%", label: "retencion visual", color: "#f43f5e" },
        { num: "3x", label: "mas memorable", color: "#ec4899" },
        { num: "100%", label: "personalizable", color: "#f59e0b" },
      ].map((m, i) => [
        text(m.num, 250 + i * 500, 500, 400, 80, { font: "Bebas Neue", fontSize: 72, color: m.color, textAlign: "center", anim: "scaleIn", delay: 0.6 + i * 0.2 }),
        text(m.label, 250 + i * 500, 580, 400, 30, { fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.45)", textAlign: "center", anim: "fadeIn", delay: 0.8 + i * 0.2 }),
      ]).flat(),
    ],
  });

  const s5 = createScene({
    name: "El Futuro",
    worldTransform: { x: 2400, y: 1600, z: -800, rotation: 0, scale: 3 },
    backgroundColor: "#0a0a0a",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(244,63,94,0.2) 0%, transparent 50%)",
    duration: 5,
    transition: { type: "dolly-zoom", duration: 2.5, easing: "power4.inOut", params: { perspectiveEnd: 300, counterScale: 1.2 } },
    elements: [
      shape("circle", 560, 140, 800, 800, "rgba(251,191,36,0.03)", { blur: 40 }),
      text("EL FUTURO", 160, 300, 1600, 250, { font: "Archivo Black", fontSize: 140, fontWeight: 400, color: "#ffffff", textAlign: "center", anim: "dramaticReveal", delay: 0.5 }),
      divider(760, 540, 400, 3, "rgba(251,191,36,0.4)", "gradient"),
      text("Ya no es una presentacion.\nEs una experiencia.", 410, 570, 1100, 80, { font: "Inter", fontSize: 26, fontWeight: 300, color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.6, anim: "fadeIn", delay: 1.2 }),

      icon("Rocket", 920, 700, 50, "rgba(251,191,36,0.3)", "scaleIn", 1.8),
    ],
  });

  return buildPresentation("Revelacion Epica", [s1, s2, s3, s4, s5]);
}

// ---------------------------------------------------------------------------
// Template Catalog
// ---------------------------------------------------------------------------

export const TEMPLATE_CATALOG = [
  { id: "cinematic-opener", name: "Apertura Cinematica", description: "Entrada dramatica con transiciones de cine, cards interactivos y tipografia de impacto", create: createCinematicOpener },
  { id: "parallax-story", name: "Historia Parallax", description: "Narrativa con capas de profundidad que se mueven a diferentes velocidades", create: createParallaxStory },
  { id: "noir-spotlight", name: "Noir Spotlight", description: "Minimalista y dramatico — luz, sombra y silencio visual", create: createNoirSpotlight },
  { id: "epic-reveal", name: "Revelacion Epica", description: "Dolly zoom infinito revelando mundos dentro de mundos", create: createEpicReveal },
];
