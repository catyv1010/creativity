import { createId } from "@/lib/id";
import type {
  Presentation,
  Scene,
  SceneElement,
  TextContent,
  ShapeContent,
  ImageContent,
  AnimationDescriptor,
  CameraKeyframe,
  WorldTransform,
} from "../types/presentation";

// --- Scene Layouts ---
// Pre-defined world positions for scenes, creating cinematic camera paths.

export const SCENE_LAYOUTS = {
  /** Scenes laid out left-to-right, great for storytelling */
  horizontal: (index: number): WorldTransform => ({
    x: index * 2200,
    y: 0,
    z: 0,
    rotation: 0,
    scale: 1,
  }),

  /** Scenes in a spiral pattern, dramatic zoom-out reveals */
  spiral: (index: number): WorldTransform => {
    const angle = index * 0.8;
    const radius = 1500 + index * 600;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: 0,
      rotation: index * 15,
      scale: 1,
    };
  },

  /** Scenes stacked vertically, great for diving/scrolling */
  vertical: (index: number): WorldTransform => ({
    x: 0,
    y: index * 1400,
    z: 0,
    rotation: 0,
    scale: 1,
  }),

  /** Scenes at different zoom levels, nested world-within-world */
  fractal: (index: number): WorldTransform => ({
    x: index * 500,
    y: index * 300,
    z: index * -200,
    rotation: index * -5,
    scale: 1 + index * 0.3,
  }),

  /** Random positions for a freeform layout */
  freeform: (index: number): WorldTransform => ({
    x: (Math.sin(index * 2.5) * 2000) + index * 800,
    y: (Math.cos(index * 1.8) * 1200),
    z: 0,
    rotation: Math.sin(index) * 20,
    scale: 1,
  }),
} as const;

export type SceneLayout = keyof typeof SCENE_LAYOUTS;

// --- Factory Functions ---

export function createScene(overrides: Partial<Scene> = {}): Scene {
  return {
    id: createId(),
    name: "Nueva Escena",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    elements: [],
    duration: 3,
    backgroundColor: "#0a0a1a",
    transition: { type: "camera-move", duration: 1.2, easing: "power2.inOut", params: {} },
    ...overrides,
  };
}

export function createTextElement(overrides: Partial<SceneElement> = {}): SceneElement {
  const content: TextContent = {
    type: "text",
    html: "Escribe aqui...",
    fontFamily: "Inter",
    fontSize: 48,
    fontWeight: 400,
    color: "#ffffff",
    textAlign: "center",
  };

  return {
    id: createId(),
    type: "text",
    name: "Texto",
    transform: {
      x: 200, y: 200, width: 500, height: 80,
      rotation: 0, scaleX: 1, scaleY: 1,
      originX: 0.5, originY: 0.5, opacity: 1,
    },
    style: {},
    content,
    animations: [],
    depthLayer: 0,
    locked: false,
    visible: true,
    zIndex: 0,
    ...overrides,
  };
}

export function createShapeElement(
  shape: "rect" | "circle" | "triangle" = "rect",
  overrides: Partial<SceneElement> = {}
): SceneElement {
  const content: ShapeContent = {
    type: "shape",
    shape,
    fill: "#a855f7",
    stroke: undefined,
    strokeWidth: 0,
  };

  return {
    id: createId(),
    type: "shape",
    name: shape === "rect" ? "Rectangulo" : shape === "circle" ? "Circulo" : "Triangulo",
    transform: {
      x: 300, y: 300, width: 200, height: 200,
      rotation: 0, scaleX: 1, scaleY: 1,
      originX: 0.5, originY: 0.5, opacity: 1,
    },
    style: { borderRadius: shape === "circle" ? 9999 : 8 },
    content,
    animations: [],
    depthLayer: 0,
    locked: false,
    visible: true,
    zIndex: 0,
    ...overrides,
  };
}

export function createImageElement(src: string, overrides: Partial<SceneElement> = {}): SceneElement {
  const content: ImageContent = {
    type: "image",
    src,
    alt: "Imagen",
    objectFit: "cover",
  };

  return {
    id: createId(),
    type: "image",
    name: "Imagen",
    transform: {
      x: 300, y: 200, width: 400, height: 300,
      rotation: 0, scaleX: 1, scaleY: 1,
      originX: 0.5, originY: 0.5, opacity: 1,
    },
    style: {},
    content,
    animations: [],
    depthLayer: 0,
    locked: false,
    visible: true,
    zIndex: 0,
    ...overrides,
  };
}

export function createAnimation(overrides: Partial<AnimationDescriptor> = {}): AnimationDescriptor {
  return {
    id: createId(),
    type: "entrance",
    preset: "fadeIn",
    trigger: { type: "scene-enter", delay: 0 },
    timing: { startTime: 0, duration: 0.8, repeat: 0, yoyo: false },
    properties: {},
    easing: "power2.out",
    ...overrides,
  };
}

export function createCameraKeyframe(
  sceneId: string,
  transform: WorldTransform,
  time: number
): CameraKeyframe {
  return {
    id: createId(),
    sceneId,
    time,
    transform,
    easing: "power2.inOut",
    duration: 1.2,
  };
}

// Helper rapido para elementos de la presentacion default espectacular
function _t(html: string, x: number, y: number, w: number, h: number, opts: Partial<SceneElement> & {
  fontFamily?: string; fontSize?: number; fontWeight?: number; color?: string;
  textAlign?: "left"|"center"|"right"; lineHeight?: number; letterSpacing?: number;
  preset?: string; startTime?: number;
} = {}): SceneElement {
  const { fontFamily="Inter", fontSize=32, fontWeight=400, color="#ffffff",
    textAlign="center", lineHeight=1.3, letterSpacing, preset, startTime=0, ...rest } = opts;
  const content: TextContent = { type:"text", html, fontFamily, fontSize, fontWeight, color, textAlign, lineHeight, ...(letterSpacing ? { letterSpacing } : {}) };
  return {
    id: createId(), type:"text", name: html.slice(0,20),
    transform: { x, y, width:w, height:h, rotation:0, scaleX:1, scaleY:1, originX:0.5, originY:0.5, opacity:1 },
    style: {}, content,
    animations: preset ? [createAnimation({ preset: preset as any, timing:{ startTime, duration:0.9, repeat:0, yoyo:false } })] : [],
    depthLayer:0, locked:false, visible:true, zIndex:5, ...rest,
  };
}
function _s(shp: "rect"|"circle", x: number, y: number, w: number, h: number, fill: string, opts: Partial<SceneElement> & {
  borderRadius?: number; blur?: number; preset?: string; startTime?: number;
} = {}): SceneElement {
  const { borderRadius=0, blur, preset, startTime=0, zIndex=1, ...rest } = opts as any;
  const content: ShapeContent = { type:"shape", shape:shp, fill, stroke:undefined, strokeWidth:0 };
  return {
    id: createId(), type:"shape", name:shp,
    transform: { x, y, width:w, height:h, rotation:0, scaleX:1, scaleY:1, originX:0.5, originY:0.5, opacity:1 },
    style: { borderRadius: borderRadius ?? (shp==="circle"?9999:0), ...(blur ? { filter:`blur(${blur}px)` } : {}) },
    content,
    animations: preset ? [createAnimation({ preset: preset as any, timing:{ startTime, duration:0.8, repeat:0, yoyo:false } })] : [],
    depthLayer:-1, locked:false, visible:true, zIndex, ...rest,
  };
}

/** Presentacion default — ESPECTACULAR desde el primer segundo */
export function createDefaultPresentation(layout: SceneLayout = "horizontal"): Presentation {
  const layoutFn = SCENE_LAYOUTS[layout];

  // ── ESCENA 1: HERO CINEMATICO ──────────────────────────────────────────────
  const scene1 = createScene({
    name: "Hero",
    worldTransform: layoutFn(0),
    backgroundColor: "#03000f",
    backgroundGradient: [
      "radial-gradient(ellipse at 25% 35%, rgba(124,58,237,0.55) 0%, transparent 55%)",
      "radial-gradient(ellipse at 78% 65%, rgba(236,72,153,0.40) 0%, transparent 50%)",
      "radial-gradient(ellipse at 55% 90%, rgba(6,182,212,0.30) 0%, transparent 45%)",
    ].join(", "),
    duration: 5,
    transition: { type: "camera-move", duration: 1.2, easing: "power2.inOut", params: {} },
    elements: [
      // Orbes de fondo (el wow visual)
      _s("circle", -120, -80, 700, 700, "rgba(124,58,237,0.28)", { blur: 90, zIndex: 0 }),
      _s("circle", 1400, 500, 600, 600, "rgba(236,72,153,0.22)", { blur: 80, zIndex: 0 }),
      _s("circle", 800, 850, 500, 500, "rgba(6,182,212,0.20)", { blur: 70, zIndex: 0 }),
      _s("circle", 1600, -100, 350, 350, "rgba(168,85,247,0.18)", { blur: 60, zIndex: 0 }),
      // Linea decorativa superior
      _s("rect", 0, 0, 1920, 3, "linear-gradient(90deg,transparent,#a855f7,#06b6d4,transparent)" as any, { zIndex: 10 }),
      // Etiqueta
      _t("CREATIVITY STUDIO", 560, 280, 800, 35, { fontSize: 13, fontWeight: 600, color: "rgba(168,85,247,0.9)", letterSpacing: 6, preset: "fadeIn", startTime: 0.1 }),
      // Titulo principal — ENORME
      _t("Crea sin\nlímites.", 100, 330, 1720, 380, {
        fontFamily: "DM Serif Display", fontSize: 160, fontWeight: 400, color: "#ffffff",
        textAlign: "center", lineHeight: 0.92, preset: "cinematicZoom", startTime: 0.2,
      }),
      // Subtitulo
      _t("La plataforma de presentaciones que rompe con todo lo establecido.", 310, 750, 1300, 60, {
        fontSize: 24, fontWeight: 300, color: "rgba(255,255,255,0.55)", textAlign: "center",
        lineHeight: 1.5, preset: "fadeIn", startTime: 0.9,
      }),
      // Hint continuar
      _t("→ presiona para continuar", 710, 1010, 500, 28, {
        fontSize: 13, color: "rgba(255,255,255,0.2)", textAlign: "center",
      }),
    ],
  });

  // ── ESCENA 2: PROPUESTA DE VALOR ───────────────────────────────────────────
  const scene2 = createScene({
    name: "Propuesta",
    worldTransform: layoutFn(1),
    backgroundColor: "#060014",
    backgroundGradient: [
      "radial-gradient(ellipse at 80% 30%, rgba(99,102,241,0.45) 0%, transparent 55%)",
      "radial-gradient(ellipse at 15% 80%, rgba(236,72,153,0.30) 0%, transparent 50%)",
    ].join(", "),
    duration: 5,
    transition: { type: "dolly-zoom", duration: 1.5, easing: "power3.inOut", params: { perspectiveEnd: 800, counterScale: 1.08 } },
    elements: [
      // Orbes
      _s("circle", 1100, -200, 800, 800, "rgba(99,102,241,0.22)", { blur: 100, zIndex: 0 }),
      _s("circle", -200, 700, 600, 600, "rgba(236,72,153,0.18)", { blur: 80, zIndex: 0 }),
      // Acento lateral izquierdo
      _s("rect", 0, 0, 6, 1080, "linear-gradient(180deg,transparent,#a855f7,#6366f1,transparent)" as any, { zIndex: 10 }),
      // Header
      _t("QUE HACEMOS", 140, 100, 400, 30, { fontSize: 12, fontWeight: 700, color: "rgba(168,85,247,0.8)", letterSpacing: 5, preset: "fadeIn" }),
      _s("rect", 140, 140, 70, 3, "rgba(168,85,247,0.5)", { borderRadius: 3, zIndex: 5 }),
      // Titulo
      _t("Presentaciones\nque impresionan.", 140, 170, 820, 280, {
        fontFamily: "DM Serif Display", fontSize: 76, fontWeight: 400, color: "#ffffff",
        textAlign: "left", lineHeight: 1.1, preset: "slideInLeft", startTime: 0.2,
      }),
      // Cards de caracteristicas
      ...([
        { icon: "🎬", title: "Cámara Virtual", desc: "Vuela entre escenas como en el cine real", color: "#a855f7", x: 140 },
        { icon: "✨", title: "Animaciones 60fps", desc: "Motor GSAP para movimiento cinematográfico", color: "#6366f1", x: 740 },
        { icon: "∞", title: "Canvas Infinito", desc: "Mundo 2D/3D sin límites de espacio", color: "#ec4899", x: 1340 },
      ].flatMap(({ icon, title, desc, color, x }) => [
        _s("rect", x, 520, 500, 220, `rgba(255,255,255,0.06)`, { borderRadius: 20, zIndex: 4, preset: "slideInUp", startTime: 0.5 }),
        _s("rect", x, 520, 500, 4, color, { borderRadius: 3, zIndex: 6 }),
        _t(icon, x, 548, 80, 60, { fontSize: 42, textAlign: "left", zIndex: 5 }),
        _t(title, x + 10, 622, 480, 40, { fontSize: 22, fontWeight: 700, color: "#ffffff", textAlign: "left", zIndex: 5, preset: "fadeIn", startTime: 0.7 }),
        _t(desc, x + 10, 668, 480, 55, { fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.55)", textAlign: "left", lineHeight: 1.5, zIndex: 5, preset: "fadeIn", startTime: 0.8 }),
      ])),
    ],
  });

  // ── ESCENA 3: IMPACTO / NUMEROS ────────────────────────────────────────────
  const scene3 = createScene({
    name: "Impacto",
    worldTransform: layoutFn(2),
    backgroundColor: "#000008",
    backgroundGradient: [
      "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.12) 0%, transparent 65%)",
      "radial-gradient(ellipse at 90% 10%, rgba(6,182,212,0.25) 0%, transparent 45%)",
      "radial-gradient(ellipse at 10% 90%, rgba(242,88,62,0.20) 0%, transparent 45%)",
    ].join(", "),
    duration: 5,
    transition: { type: "whip-pan", duration: 0.9, easing: "power4.inOut", params: {} },
    elements: [
      // Orbes decorativos
      _s("circle", 900, 400, 1100, 1100, "rgba(99,102,241,0.07)", { blur: 120, zIndex: 0 }),
      _s("circle", 100, 900, 400, 400, "rgba(242,88,62,0.15)", { blur: 60, zIndex: 0 }),
      _s("circle", 1700, 100, 350, 350, "rgba(6,182,212,0.18)", { blur: 50, zIndex: 0 }),
      // Header
      _t("RESULTADOS REALES", 560, 80, 800, 35, { fontSize: 13, fontWeight: 700, color: "rgba(6,182,212,0.9)", letterSpacing: 5, preset: "fadeIn" }),
      // Titulo
      _t("Numeros que\nhablan solos.", 100, 130, 1720, 250, {
        fontFamily: "DM Serif Display", fontSize: 110, fontWeight: 400,
        color: "#ffffff", textAlign: "center", lineHeight: 1.0, preset: "cinematicZoom", startTime: 0.2,
      }),
      // Metricas gigantes
      ...([
        { num: "10×", label: "más engagement", color: "#a855f7", x: 110 },
        { num: "60fps", label: "animaciones fluidas", color: "#6366f1", x: 590 },
        { num: "∞", label: "posibilidades", color: "#ec4899", x: 1070 },
        { num: "0", label: "límites creativos", color: "#06b6d4", x: 1550 },
      ].flatMap(({ num, label, color, x }) => [
        _s("rect", x, 440, 380, 300, `rgba(255,255,255,0.04)`, { borderRadius: 24, zIndex: 3, preset: "slideInUp", startTime: 0.4 }),
        _s("rect", x, 740, 380, 3, color, { borderRadius: 3, zIndex: 5 }),
        _t(num, x, 460, 380, 200, { fontFamily: "Bebas Neue", fontSize: 130, fontWeight: 400, color, textAlign: "center", zIndex: 4, preset: "cinematicZoom", startTime: 0.5 }),
        _t(label, x, 680, 380, 45, { fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.5)", textAlign: "center", zIndex: 4 }),
      ])),
      // Tagline final
      _t("El futuro de las presentaciones ya está aquí.", 310, 870, 1300, 50, {
        fontFamily: "DM Serif Display", fontSize: 28, color: "rgba(255,255,255,0.35)",
        textAlign: "center", preset: "fadeIn", startTime: 1.0,
      }),
    ],
  });

  // ── ESCENA 4: CTA FINAL ─────────────────────────────────────────────────────
  const scene4 = createScene({
    name: "Empieza",
    worldTransform: layoutFn(3),
    backgroundColor: "#030012",
    backgroundGradient: [
      "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.60) 0%, rgba(6,182,212,0.20) 40%, transparent 70%)",
    ].join(", "),
    duration: 5,
    transition: { type: "iris", duration: 1.2, easing: "power2.inOut", params: {} },
    elements: [
      // Gran orbe central
      _s("circle", 660, 140, 600, 600, "rgba(124,58,237,0.35)", { blur: 100, zIndex: 0 }),
      _s("circle", 500, 300, 400, 400, "rgba(236,72,153,0.20)", { blur: 80, zIndex: 0 }),
      _s("circle", 900, 200, 300, 300, "rgba(6,182,212,0.25)", { blur: 60, zIndex: 0 }),
      // Texto principal
      _t("Ahora es", 100, 200, 1720, 130, {
        fontFamily: "DM Serif Display", fontSize: 120, fontWeight: 400,
        color: "rgba(255,255,255,0.35)", textAlign: "center", preset: "fadeIn",
      }),
      _t("tu turno.", 100, 330, 1720, 250, {
        fontFamily: "DM Serif Display", fontSize: 200, fontWeight: 400,
        color: "#ffffff", textAlign: "center", lineHeight: 0.9, preset: "cinematicZoom", startTime: 0.3,
      }),
      // CTA boton visual
      _s("rect", 610, 660, 700, 80, "rgba(168,85,247,0.25)", { borderRadius: 40, zIndex: 4, preset: "scaleIn", startTime: 0.8 }),
      _s("rect", 614, 664, 692, 72, "rgba(168,85,247,0.15)", { borderRadius: 38, zIndex: 3 }),
      _t("Comienza a crear ahora →", 610, 660, 700, 80, {
        fontSize: 24, fontWeight: 600, color: "#c084fc", textAlign: "center", zIndex: 5, preset: "fadeIn", startTime: 1.0,
      }),
      // Tagline
      _t("Creativity · Studio Cinematico", 560, 780, 800, 30, {
        fontSize: 13, color: "rgba(255,255,255,0.18)", textAlign: "center", letterSpacing: 3,
      }),
    ],
  });

  const scenes = [scene1, scene2, scene3, scene4];

  let time = 0;
  const keyframes: CameraKeyframe[] = scenes.map((scene) => {
    const kf = createCameraKeyframe(scene.id, scene.worldTransform, time);
    time += scene.duration;
    return kf;
  });

  return {
    id: createId(),
    title: "Mi Presentacion Cinematica",
    settings: {
      width: 1920, height: 1080,
      backgroundColor: "#000000",
      worldBounds: { width: 15000, height: 10000 },
      defaultTransition: { type: "camera-move", duration: 1.2, easing: "power2.inOut", params: {} },
    },
    scenes, camera: { keyframes },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
