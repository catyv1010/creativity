import { createId } from "@/lib/id";
import type {
  Presentation, Scene, SceneElement, CameraKeyframe,
  TextContent, ShapeContent,
} from "../types/presentation";
import { createAnimation, createCameraKeyframe } from "./SceneFactory";

// ---------------------------------------------------------------------------
// Template VIBRANTE — Mesh gradients de colores, sin fotos necesarias.
// Cada escena tiene su propia paleta vibrante y única.
// ---------------------------------------------------------------------------

function buildPresentation(title: string, scenes: Scene[]): Presentation {
  let time = 0;
  const keyframes: CameraKeyframe[] = scenes.map((scene) => {
    const kf = createCameraKeyframe(scene.id, scene.worldTransform, time);
    time += scene.duration;
    return kf;
  });
  const now = new Date().toISOString();
  return {
    id: createId(), title,
    settings: {
      width: 1920, height: 1080, backgroundColor: "#000",
      worldBounds: { width: 20000, height: 20000 },
      defaultTransition: { type: "camera-move", duration: 1.2, easing: "power2.inOut", params: {} },
    },
    scenes, camera: { keyframes }, createdAt: now, updatedAt: now,
  };
}

function txt(
  html: string, x: number, y: number, w: number, h: number,
  opts: Partial<TextContent> & { anim?: string; delay?: number; zIndex?: number } = {}
): SceneElement {
  const { anim, delay, zIndex = 5, ...rest } = opts;
  return {
    id: createId(), type: "text", name: html.slice(0, 20),
    transform: { x, y, width: w, height: h, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
    style: {},
    content: { type: "text", html, fontFamily: "Inter", fontSize: 32, fontWeight: 400, color: "#ffffff", textAlign: "left", lineHeight: 1.4, ...rest } as TextContent,
    animations: anim ? [createAnimation({ preset: anim as any, timing: { startTime: delay ?? 0, duration: 0.9, repeat: 0, yoyo: false } })] : [],
    depthLayer: 0, locked: false, visible: true, zIndex,
  };
}

function orb(
  x: number, y: number, size: number, color: string,
  opts: { blur?: number; opacity?: number; zIndex?: number } = {}
): SceneElement {
  const { blur = 80, opacity = 1, zIndex = 0 } = opts;
  return {
    id: createId(), type: "shape", name: "orb",
    transform: { x, y, width: size, height: size, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity },
    style: { borderRadius: 9999, filter: `blur(${blur}px)` },
    content: { type: "shape", shape: "circle", fill: color, stroke: undefined, strokeWidth: 0 } as ShapeContent,
    animations: [],
    depthLayer: -1, locked: false, visible: true, zIndex,
  };
}

function bar(
  x: number, y: number, w: number, h: number, color: string,
  opts: { radius?: number; zIndex?: number; anim?: string; delay?: number } = {}
): SceneElement {
  const { radius = 4, zIndex = 4, anim, delay } = opts;
  return {
    id: createId(), type: "shape", name: "bar",
    transform: { x, y, width: w, height: h, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
    style: { borderRadius: radius },
    content: { type: "shape", shape: "rect", fill: color, stroke: undefined, strokeWidth: 0 } as ShapeContent,
    animations: anim ? [createAnimation({ preset: anim as any, timing: { startTime: delay ?? 0, duration: 0.8, repeat: 0, yoyo: false } })] : [],
    depthLayer: 0, locked: false, visible: true, zIndex,
  };
}

// =====================================================================
// TEMPLATE: VIBRANTE — 5 escenas con paletas de color espectaculares
// =====================================================================
export function createVibrante(): Presentation {
  const scenes: Scene[] = [];

  // ── ESCENA 1: FUEGO — Coral · Naranja · Dorado ────────────────────────
  scenes.push({
    id: createId(), name: "Fuego",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#120500",
    backgroundGradient: [
      "radial-gradient(ellipse at 20% 30%, rgba(255,100,20,0.65) 0%, transparent 50%)",
      "radial-gradient(ellipse at 80% 70%, rgba(255,60,100,0.50) 0%, transparent 50%)",
      "radial-gradient(ellipse at 55% 90%, rgba(255,200,0,0.40) 0%, transparent 45%)",
      "radial-gradient(ellipse at 90% 10%, rgba(220,50,0,0.35) 0%, transparent 40%)",
    ].join(", "),
    duration: 5,
    transition: { type: "camera-move", duration: 1.2, easing: "power2.inOut", params: {} },
    elements: [
      // Orbes de calor
      orb(-150, -100, 800, "rgba(255,100,20,0.45)", { blur: 100 }),
      orb(1500, 400, 700, "rgba(255,60,80,0.40)", { blur: 90 }),
      orb(700, 900, 600, "rgba(255,180,0,0.35)", { blur: 80 }),
      orb(1800, -50, 400, "rgba(220,50,0,0.30)", { blur: 70 }),
      // Línea superior
      bar(0, 0, 1920, 4, "linear-gradient(90deg, #ff6414, #ff3c64, #ffc800)" as any, { zIndex: 10 }),
      // Etiqueta
      txt("✦ CREATIVITY STUDIO", 560, 270, 800, 30, {
        fontSize: 12, fontWeight: 700, color: "rgba(255,160,80,0.9)", letterSpacing: 6,
        textAlign: "center", anim: "fadeIn", delay: 0.1,
      }),
      // Título
      txt("Enciende\ntu idea.", 100, 320, 1720, 420, {
        fontFamily: "DM Serif Display", fontSize: 160, fontWeight: 400, color: "#ffffff",
        textAlign: "center", lineHeight: 0.9, anim: "cinematicZoom", delay: 0.2,
      }),
      // Subtítulo
      txt("Presentaciones que no se olvidan.", 460, 780, 1000, 55, {
        fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.55)",
        textAlign: "center", anim: "fadeIn", delay: 0.9,
      }),
      // Acento
      bar(860, 860, 200, 3, "rgba(255,120,40,0.7)", { radius: 3, zIndex: 4 }),
    ],
  });

  // ── ESCENA 2: OCÉANO — Cyan · Azul Eléctrico · Teal ──────────────────
  scenes.push({
    id: createId(), name: "Océano",
    worldTransform: { x: 2400, y: -300, z: 0, rotation: 2, scale: 1 },
    backgroundColor: "#00080f",
    backgroundGradient: [
      "radial-gradient(ellipse at 75% 25%, rgba(0,200,255,0.60) 0%, transparent 50%)",
      "radial-gradient(ellipse at 15% 75%, rgba(0,120,230,0.50) 0%, transparent 50%)",
      "radial-gradient(ellipse at 50% 100%, rgba(0,180,180,0.40) 0%, transparent 45%)",
      "radial-gradient(ellipse at 5% 20%, rgba(0,80,200,0.35) 0%, transparent 40%)",
    ].join(", "),
    duration: 5,
    transition: { type: "dolly-zoom", duration: 1.5, easing: "power3.inOut", params: { perspectiveEnd: 800, counterScale: 1.08 } },
    elements: [
      orb(1400, -200, 900, "rgba(0,200,255,0.40)", { blur: 110 }),
      orb(-200, 600, 700, "rgba(0,100,230,0.38)", { blur: 95 }),
      orb(900, 1000, 600, "rgba(0,180,180,0.35)", { blur: 85 }),
      bar(0, 0, 6, 1080, "linear-gradient(180deg, transparent, #00c8ff, #0078e6, transparent)" as any, { zIndex: 10 }),
      txt("PROPUESTA DE VALOR", 140, 100, 500, 28, {
        fontSize: 12, fontWeight: 700, color: "rgba(0,200,255,0.9)", letterSpacing: 5,
        anim: "fadeIn",
      }),
      bar(140, 138, 80, 3, "rgba(0,200,255,0.5)", { radius: 2, zIndex: 5 }),
      txt("Tecnología\nque fluye.", 140, 165, 820, 290, {
        fontFamily: "DM Serif Display", fontSize: 80, fontWeight: 400, color: "#ffffff",
        textAlign: "left", lineHeight: 1.05, anim: "slideInLeft", delay: 0.2,
      }),
      // Cards
      ...([
        { icon: "⚡", title: "Velocidad", desc: "10x más rápido que la competencia", x: 140 },
        { icon: "🔷", title: "Precisión", desc: "Resultados exactos desde el día uno", x: 720 },
        { icon: "∞", title: "Escalable", desc: "Crece contigo sin límites", x: 1300 },
      ].flatMap(({ icon, title, desc, x }) => [
        bar(x, 540, 500, 220, "rgba(0,150,220,0.12)", { radius: 20, zIndex: 3, anim: "slideInUp", delay: 0.5 }),
        bar(x, 540, 500, 4, "rgba(0,200,255,0.6)", { radius: 3, zIndex: 6 }),
        txt(icon, x + 24, 566, 60, 50, { fontSize: 38, textAlign: "left", zIndex: 5 }),
        txt(title, x + 24, 626, 452, 38, { fontSize: 22, fontWeight: 700, color: "#fff", textAlign: "left", zIndex: 5, anim: "fadeIn", delay: 0.7 }),
        txt(desc, x + 24, 668, 452, 55, { fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.55)", textAlign: "left", lineHeight: 1.5, zIndex: 5 }),
      ])),
    ],
  });

  // ── ESCENA 3: BOSQUE — Verde Esmeralda · Lima · Menta ────────────────
  scenes.push({
    id: createId(), name: "Bosque",
    worldTransform: { x: 4800, y: 400, z: 0, rotation: -1.5, scale: 1 },
    backgroundColor: "#000f05",
    backgroundGradient: [
      "radial-gradient(ellipse at 30% 40%, rgba(0,220,100,0.60) 0%, transparent 50%)",
      "radial-gradient(ellipse at 80% 80%, rgba(0,180,80,0.50) 0%, transparent 50%)",
      "radial-gradient(ellipse at 60% 10%, rgba(100,230,60,0.40) 0%, transparent 45%)",
      "radial-gradient(ellipse at 5% 90%, rgba(0,140,60,0.35) 0%, transparent 40%)",
    ].join(", "),
    duration: 5,
    transition: { type: "whip-pan", duration: 0.9, easing: "power4.inOut", params: {} },
    elements: [
      orb(-100, -50, 850, "rgba(0,220,100,0.38)", { blur: 110 }),
      orb(1500, 600, 700, "rgba(0,180,80,0.35)", { blur: 95 }),
      orb(850, 1050, 500, "rgba(100,230,60,0.32)", { blur: 85 }),
      bar(0, 1076, 1920, 4, "linear-gradient(90deg, transparent, #00dc64, #64e63c, transparent)" as any, { zIndex: 10 }),
      txt("IMPACTO REAL", 560, 80, 800, 30, {
        fontSize: 13, fontWeight: 700, color: "rgba(0,220,100,0.9)", letterSpacing: 5,
        textAlign: "center", anim: "fadeIn",
      }),
      txt("Resultados\nque crecen.", 100, 130, 1720, 320, {
        fontFamily: "DM Serif Display", fontSize: 130, fontWeight: 400, color: "#ffffff",
        textAlign: "center", lineHeight: 0.95, anim: "cinematicZoom", delay: 0.2,
      }),
      // Métricas
      ...([
        { num: "10×", label: "crecimiento", color: "#00dc64", x: 110 },
        { num: "98%", label: "satisfacción", color: "#64e63c", x: 590 },
        { num: "500+", label: "proyectos", color: "#00b450", x: 1070 },
        { num: "0", label: "compromisos rotos", color: "#00dc96", x: 1550 },
      ].flatMap(({ num, label, color, x }) => [
        bar(x, 540, 380, 280, "rgba(0,220,100,0.06)", { radius: 24, zIndex: 3, anim: "slideInUp", delay: 0.4 }),
        bar(x, 820, 380, 3, color, { radius: 3, zIndex: 5 }),
        txt(num, x, 565, 380, 180, {
          fontFamily: "Bebas Neue", fontSize: 120, fontWeight: 400, color,
          textAlign: "center", zIndex: 4, anim: "cinematicZoom", delay: 0.5,
        }),
        txt(label, x, 760, 380, 40, {
          fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.5)",
          textAlign: "center", zIndex: 4,
        }),
      ])),
    ],
  });

  // ── ESCENA 4: AURORA — Magenta · Rosa · Violeta Eléctrico ────────────
  scenes.push({
    id: createId(), name: "Aurora",
    worldTransform: { x: 7200, y: -400, z: 0, rotation: 1, scale: 1 },
    backgroundColor: "#0d000f",
    backgroundGradient: [
      "radial-gradient(ellipse at 50% 30%, rgba(200,0,255,0.60) 0%, transparent 50%)",
      "radial-gradient(ellipse at 15% 70%, rgba(255,0,150,0.50) 0%, transparent 50%)",
      "radial-gradient(ellipse at 85% 80%, rgba(120,0,255,0.45) 0%, transparent 45%)",
      "radial-gradient(ellipse at 70% 10%, rgba(255,50,200,0.35) 0%, transparent 40%)",
    ].join(", "),
    duration: 5,
    transition: { type: "iris", duration: 1.2, easing: "power2.inOut", params: {} },
    elements: [
      orb(760, -200, 1000, "rgba(200,0,255,0.40)", { blur: 120 }),
      orb(-100, 700, 700, "rgba(255,0,150,0.38)", { blur: 100 }),
      orb(1600, 500, 600, "rgba(120,0,255,0.35)", { blur: 90 }),
      orb(1000, 900, 500, "rgba(255,50,200,0.30)", { blur: 80 }),
      // Líneas de acento
      bar(0, 0, 1920, 4, "linear-gradient(90deg, #c800ff, #ff0096, #7800ff)" as any, { zIndex: 10 }),
      bar(0, 1076, 1920, 4, "linear-gradient(90deg, #7800ff, #ff0096, #c800ff)" as any, { zIndex: 10 }),
      txt("✦ NUESTRA VISIÓN", 140, 100, 500, 28, {
        fontSize: 12, fontWeight: 700, color: "rgba(200,80,255,0.9)", letterSpacing: 5,
        anim: "fadeIn",
      }),
      txt("Donde la\ncreativity\nno tiene límites.", 140, 160, 900, 480, {
        fontFamily: "DM Serif Display", fontSize: 96, fontWeight: 400, color: "#ffffff",
        textAlign: "left", lineHeight: 1.0, anim: "slideInLeft", delay: 0.3,
      }),
      // Elementos derecha
      bar(1150, 200, 600, 600, "rgba(200,0,255,0.08)", { radius: 300, zIndex: 3 }),
      bar(1200, 250, 500, 500, "rgba(255,0,150,0.06)", { radius: 250, zIndex: 3 }),
      txt("∞", 1310, 330, 380, 350, {
        fontFamily: "DM Serif Display", fontSize: 300, fontWeight: 400,
        color: "rgba(200,80,255,0.20)", textAlign: "center", zIndex: 4,
      }),
      txt("Posibilidades sin fin para quienes\nse atreven a crear diferente.", 1150, 770, 600, 75, {
        fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.45)",
        textAlign: "center", lineHeight: 1.6, zIndex: 5, anim: "fadeIn", delay: 0.9,
      }),
    ],
  });

  // ── ESCENA 5: COSMOS — Dorado · Ámbar · Champagne ────────────────────
  scenes.push({
    id: createId(), name: "Cosmos",
    worldTransform: { x: 9600, y: 300, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0a0800",
    backgroundGradient: [
      "radial-gradient(ellipse at 50% 40%, rgba(255,180,0,0.55) 0%, transparent 55%)",
      "radial-gradient(ellipse at 10% 80%, rgba(200,100,0,0.45) 0%, transparent 50%)",
      "radial-gradient(ellipse at 90% 20%, rgba(255,140,0,0.40) 0%, transparent 45%)",
      "radial-gradient(ellipse at 70% 90%, rgba(180,60,0,0.35) 0%, transparent 40%)",
    ].join(", "),
    duration: 5,
    transition: { type: "fade", duration: 1.5, easing: "power2.inOut", params: {} },
    elements: [
      orb(760, -100, 1100, "rgba(255,180,0,0.38)", { blur: 130 }),
      orb(-100, 800, 700, "rgba(200,100,0,0.35)", { blur: 100 }),
      orb(1700, 300, 600, "rgba(255,140,0,0.32)", { blur: 90 }),
      bar(0, 0, 1920, 4, "linear-gradient(90deg, transparent, #ffb400, #ff8c00, transparent)" as any, { zIndex: 10 }),
      txt("Ahora es", 100, 220, 1720, 150, {
        fontFamily: "DM Serif Display", fontSize: 120, fontWeight: 400,
        color: "rgba(255,255,255,0.30)", textAlign: "center", anim: "fadeIn",
      }),
      txt("tu turno.", 100, 360, 1720, 270, {
        fontFamily: "DM Serif Display", fontSize: 210, fontWeight: 400,
        color: "#ffffff", textAlign: "center", lineHeight: 0.88,
        anim: "cinematicZoom", delay: 0.3,
      }),
      // CTA visual
      bar(610, 700, 700, 76, "rgba(255,160,0,0.20)", { radius: 38, zIndex: 4, anim: "scaleIn", delay: 0.8 }),
      bar(614, 704, 692, 68, "rgba(255,160,0,0.10)", { radius: 34, zIndex: 3 }),
      txt("Comienza a crear ahora →", 610, 700, 700, 76, {
        fontSize: 24, fontWeight: 600, color: "#ffb400",
        textAlign: "center", zIndex: 5, anim: "fadeIn", delay: 1.0,
      }),
      txt("Creativity · Studio Cinematico", 560, 820, 800, 30, {
        fontSize: 13, color: "rgba(255,255,255,0.18)", textAlign: "center", letterSpacing: 3,
      }),
    ],
  });

  return buildPresentation("Vibrante", scenes);
}
