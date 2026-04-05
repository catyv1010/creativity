// ─────────────────────────────────────────────────────────────────
// PLANTILLA: "Showcase de Efectos"
// Demuestra todos los nuevos efectos GSAP premium:
// SplitText, DrawSVG, clip-path reveals, 3D flips, physics,
// glitch cuts, morph wipes, ripple transitions, y más.
// ─────────────────────────────────────────────────────────────────
import { createId } from "@/lib/id";
import type {
  Presentation, Scene, SceneElement, CameraKeyframe,
  TextContent, ShapeContent, ImageContent, IconContent,
  ElementInteraction,
} from "../types/presentation";
import { createAnimation, createCameraKeyframe } from "./SceneFactory";

// ── Fotos temáticas ───────────────────────────────────────────────
const PHOTOS = {
  galaxy:    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",
  neon:      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80",
  abstract:  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80",
  tech:      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
  gradient:  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80",
  particles: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80",
  code:      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80",
};

// ── Helpers ───────────────────────────────────────────────────────

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

function el(
  type: SceneElement["type"], x: number, y: number, w: number, h: number,
  content: SceneElement["content"],
  opts: {
    anim?: string; delay?: number; duration?: number; zIndex?: number; opacity?: number;
    style?: SceneElement["style"]; interactions?: ElementInteraction[];
    rotation?: number; repeat?: number; yoyo?: boolean;
  } = {}
): SceneElement {
  return {
    id: createId(), type, name: type,
    transform: {
      x, y, width: w, height: h,
      rotation: opts.rotation || 0,
      scaleX: 1, scaleY: 1,
      originX: 0.5, originY: 0.5,
      opacity: opts.opacity ?? 1,
    },
    style: opts.style || {},
    content,
    animations: opts.anim
      ? [createAnimation({
          preset: opts.anim as any,
          timing: {
            startTime: opts.delay || 0,
            duration: opts.duration || 0.9,
            repeat: opts.repeat ?? 0,
            yoyo: opts.yoyo ?? false,
          },
        })]
      : [],
    interactions: opts.interactions,
    depthLayer: 0, locked: false, visible: true, zIndex: opts.zIndex ?? 1,
  };
}

function txt(
  html: string, x: number, y: number, w: number, h: number,
  opts: Partial<TextContent> & {
    anim?: string; delay?: number; duration?: number; zIndex?: number; opacity?: number;
    style?: SceneElement["style"]; repeat?: number; yoyo?: boolean;
  } = {}
): SceneElement {
  const { anim, delay, duration, zIndex, opacity, style, repeat, yoyo, ...rest } = opts;
  return el("text", x, y, w, h, {
    type: "text", html,
    fontFamily: "Inter", fontSize: 32, fontWeight: 400,
    color: "#ffffff", textAlign: "left", lineHeight: 1.4,
    ...rest,
  } as TextContent, { anim, delay, duration, zIndex, opacity, style, repeat, yoyo });
}

function img(
  src: string, x: number, y: number, w: number, h: number,
  opts: { anim?: string; delay?: number; zIndex?: number; style?: SceneElement["style"]; interactions?: ElementInteraction[] } = {}
): SceneElement {
  return el("image", x, y, w, h, {
    type: "image", src, alt: "", objectFit: "cover",
  } as ImageContent, opts);
}

function box(
  x: number, y: number, w: number, h: number, fill: string,
  opts: {
    radius?: number; anim?: string; delay?: number; duration?: number;
    zIndex?: number; opacity?: number; interactions?: ElementInteraction[];
    repeat?: number; yoyo?: boolean; style?: SceneElement["style"];
  } = {}
): SceneElement {
  const { radius, style: extraStyle, ...rest } = opts;
  return el("shape", x, y, w, h, {
    type: "shape", shape: "rect", fill, stroke: undefined, strokeWidth: 0,
  } as ShapeContent, { ...rest, style: { borderRadius: radius ?? 0, ...extraStyle } });
}

function icn(
  name: string, x: number, y: number, size: number, color: string,
  opts: { anim?: string; delay?: number; duration?: number; repeat?: number; yoyo?: boolean } = {}
): SceneElement {
  return el("icon", x, y, size, size, {
    type: "icon", iconName: name, color, strokeWidth: 1.5, filled: false,
  } as IconContent, opts);
}

// ─────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export function createEfectosShowcase(): Presentation {
  const scenes: Scene[] = [];

  // ══════════════════════════════════════════════════════════════
  // ESCENA 1 — INTRO "Efectos GSAP Premium"
  // Fondo galaxia + texto con letterByLetter + íconos flotantes
  // Transición de entrada: zoom-blur
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Intro",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0a0a1a",
    backgroundImage: PHOTOS.galaxy,
    backgroundOverlay: "linear-gradient(135deg, rgba(10,10,26,0.85) 0%, rgba(30,0,60,0.75) 100%)",
    duration: 6,
    transition: { type: "zoom-blur", duration: 1.2, easing: "power3.inOut", params: {} },
    elements: [
      // Destellos decorativos
      box(100, 200, 4, 4, "#a78bfa", { radius: 50, anim: "pulse", delay: 0, duration: 2, opacity: 0.6, repeat: -1, yoyo: true }),
      box(1700, 150, 6, 6, "#38bdf8", { radius: 50, anim: "pulse", delay: 0.5, duration: 3, opacity: 0.5, repeat: -1, yoyo: true }),
      box(300, 800, 5, 5, "#f472b6", { radius: 50, anim: "pulse", delay: 1, duration: 2.5, opacity: 0.4, repeat: -1, yoyo: true }),
      box(1500, 700, 3, 3, "#34d399", { radius: 50, anim: "pulse", delay: 0.3, duration: 2, opacity: 0.5, repeat: -1, yoyo: true }),

      // Badge superior
      box(710, 260, 500, 40, "rgba(139,92,246,0.25)", { radius: 20, anim: "scaleIn", delay: 0.2, zIndex: 2 }),
      txt("✦ GSAP PREMIUM PLUGINS ✦", 735, 264, 460, 32, {
        fontSize: 13, fontWeight: 700, color: "#a78bfa", textAlign: "center",
        letterSpacing: 4, anim: "fadeIn", delay: 0.4, zIndex: 3,
      }),

      // Título principal — letterByLetter
      txt("Efectos que\nImpresionan", 260, 350, 1400, 250, {
        fontSize: 96, fontWeight: 800, color: "#ffffff", textAlign: "center",
        lineHeight: 1.1, anim: "letterByLetter", delay: 0.6, duration: 2.0, zIndex: 4,
      }),

      // Subtítulo — wordByWord
      txt("SplitText • ScrambleText • DrawSVG • MorphSVG • Physics2D • CustomEase", 310, 620, 1300, 50, {
        fontSize: 20, fontWeight: 400, color: "rgba(255,255,255,0.6)", textAlign: "center",
        letterSpacing: 1, anim: "wordByWord", delay: 1.8, duration: 1.5, zIndex: 3,
      }),

      // Íconos flotantes con hover interactions
      icn("Sparkles", 350, 750, 48, "#a78bfa", { anim: "float", delay: 0, duration: 3, repeat: -1, yoyo: true }),
      icn("Zap", 550, 780, 40, "#fbbf24", { anim: "float", delay: 0.5, duration: 2.5, repeat: -1, yoyo: true }),
      icn("Rocket", 1350, 750, 48, "#38bdf8", { anim: "float", delay: 0.3, duration: 2.8, repeat: -1, yoyo: true }),
      icn("Star", 1150, 780, 40, "#f472b6", { anim: "float", delay: 0.8, duration: 3.2, repeat: -1, yoyo: true }),

      // CTA
      box(760, 850, 400, 60, "linear-gradient(135deg, #7c3aed, #2563eb)", {
        radius: 30, anim: "riseUp", delay: 2.5, zIndex: 5,
        interactions: [{ type: "hover-lift", params: {} }, { type: "hover-glow", params: { color: "rgba(124,58,237,0.5)" } }],
      }),
      txt("Explorar Efectos →", 790, 862, 360, 36, {
        fontSize: 18, fontWeight: 600, color: "#ffffff", textAlign: "center",
        anim: "fadeIn", delay: 2.7, zIndex: 6,
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 2 — "Animaciones de Entrada"
  // Muestra: flipInX, flipInY, spiralIn, swoopIn, stampIn, perspectiveTilt
  // Transición: glitch-cut (NUEVA)
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Entradas",
    worldTransform: { x: 2200, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0f172a",
    backgroundOverlay: "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.15) 0%, transparent 60%)",
    duration: 7,
    transition: { type: "glitch-cut", duration: 0.8, easing: "power4.inOut", params: {} },
    elements: [
      // Línea decorativa
      box(140, 90, 60, 3, "#3b82f6", { anim: "revealFromLeft", delay: 0.2 }),

      // Título
      txt("Animaciones de Entrada", 140, 110, 800, 70, {
        fontSize: 48, fontWeight: 800, color: "#ffffff",
        anim: "scrambleIn", delay: 0.3, duration: 1.2, zIndex: 4,
      }),
      txt("Más de 30 presets de entrada cinematográficos", 140, 185, 700, 30, {
        fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)",
        anim: "fadeIn", delay: 1.0, zIndex: 3,
      }),

      // Grid de demos — cada card muestra un efecto diferente
      // Row 1
      box(140, 260, 380, 200, "rgba(59,130,246,0.1)", {
        radius: 16, anim: "flipInX", delay: 0.8, zIndex: 2,
        interactions: [{ type: "hover-lift", params: {} }],
      }),
      icn("RotateCcw", 290, 300, 48, "#3b82f6", { anim: "flipInX", delay: 0.9 }),
      txt("flipInX", 250, 360, 160, 30, {
        fontSize: 18, fontWeight: 700, color: "#3b82f6", textAlign: "center",
        anim: "fadeIn", delay: 1.2,
      }),
      txt("Rotación 3D en eje X con efecto back", 200, 395, 260, 40, {
        fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", textAlign: "center",
        anim: "fadeIn", delay: 1.4,
      }),

      box(560, 260, 380, 200, "rgba(168,85,247,0.1)", {
        radius: 16, anim: "flipInY", delay: 1.0, zIndex: 2,
        interactions: [{ type: "hover-lift", params: {} }],
      }),
      icn("FlipVertical", 710, 300, 48, "#a855f7", { anim: "flipInY", delay: 1.1 }),
      txt("flipInY", 670, 360, 160, 30, {
        fontSize: 18, fontWeight: 700, color: "#a855f7", textAlign: "center",
        anim: "fadeIn", delay: 1.4,
      }),
      txt("Rotación 3D en eje Y tipo carta", 620, 395, 260, 40, {
        fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", textAlign: "center",
        anim: "fadeIn", delay: 1.6,
      }),

      box(980, 260, 380, 200, "rgba(244,114,182,0.1)", {
        radius: 16, anim: "spiralIn", delay: 1.2, zIndex: 2,
        interactions: [{ type: "hover-lift", params: {} }],
      }),
      icn("Loader", 1130, 300, 48, "#f472b6", { anim: "spiralIn", delay: 1.3 }),
      txt("spiralIn", 1090, 360, 160, 30, {
        fontSize: 18, fontWeight: 700, color: "#f472b6", textAlign: "center",
        anim: "fadeIn", delay: 1.6,
      }),
      txt("Escala + rotación 360° simultánea", 1040, 395, 260, 40, {
        fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", textAlign: "center",
        anim: "fadeIn", delay: 1.8,
      }),

      // Row 2
      box(140, 510, 380, 200, "rgba(251,191,36,0.1)", {
        radius: 16, anim: "stampIn", delay: 1.5, zIndex: 2,
        interactions: [{ type: "hover-lift", params: {} }],
      }),
      icn("Stamp", 290, 550, 48, "#fbbf24", { anim: "stampIn", delay: 1.6 }),
      txt("stampIn", 250, 610, 160, 30, {
        fontSize: 18, fontWeight: 700, color: "#fbbf24", textAlign: "center",
        anim: "fadeIn", delay: 1.9,
      }),
      txt("Impacto dramático: escala 3x → 1x rápido", 200, 645, 260, 40, {
        fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", textAlign: "center",
        anim: "fadeIn", delay: 2.1,
      }),

      box(560, 510, 380, 200, "rgba(52,211,153,0.1)", {
        radius: 16, anim: "perspectiveTilt", delay: 1.7, zIndex: 2,
        interactions: [{ type: "hover-lift", params: {} }],
      }),
      icn("Box", 710, 550, 48, "#34d399", { anim: "perspectiveTilt", delay: 1.8 }),
      txt("perspectiveTilt", 654, 610, 190, 30, {
        fontSize: 18, fontWeight: 700, color: "#34d399", textAlign: "center",
        anim: "fadeIn", delay: 2.1,
      }),
      txt("Entrada con perspectiva 3D inclinada", 620, 645, 260, 40, {
        fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", textAlign: "center",
        anim: "fadeIn", delay: 2.3,
      }),

      box(980, 510, 380, 200, "rgba(56,189,248,0.1)", {
        radius: 16, anim: "swoopIn", delay: 1.9, zIndex: 2,
        interactions: [{ type: "hover-lift", params: {} }],
      }),
      icn("Wind", 1130, 550, 48, "#38bdf8", { anim: "swoopIn", delay: 2.0 }),
      txt("swoopIn", 1090, 610, 160, 30, {
        fontSize: 18, fontWeight: 700, color: "#38bdf8", textAlign: "center",
        anim: "fadeIn", delay: 2.3,
      }),
      txt("Deslizamiento curvo con rotación", 1040, 645, 260, 40, {
        fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", textAlign: "center",
        anim: "fadeIn", delay: 2.5,
      }),

      // Counter at bottom
      txt("30+ efectos de entrada disponibles", 660, 780, 600, 40, {
        fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.3)", textAlign: "center",
        anim: "fadeIn", delay: 3.0,
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 3 — "Clip-Path Reveals"
  // Muestra los reveals: circle, diamond, left, right, split
  // Transición: morph-wipe (NUEVA)
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Reveals",
    worldTransform: { x: 4400, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0c0a1d",
    backgroundOverlay: "radial-gradient(ellipse at 70% 40%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    duration: 7,
    transition: { type: "morph-wipe", duration: 1.0, easing: "power3.inOut", params: { color: "#1e1b4b" } },
    elements: [
      // Título
      txt("Clip-Path Reveals", 140, 110, 800, 70, {
        fontSize: 48, fontWeight: 800, color: "#ffffff",
        anim: "revealFromLeft", delay: 0.3, zIndex: 4,
      }),
      txt("Revelados geométricos que Genially envidiaría", 140, 185, 700, 30, {
        fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)",
        anim: "fadeIn", delay: 0.8, zIndex: 3,
      }),

      // Demo images with different reveals
      // Circle reveal
      img(PHOTOS.neon, 140, 270, 500, 300, {
        anim: "circleReveal", delay: 1.0, zIndex: 2,
        style: { borderRadius: 16 },
      }),
      txt("circleReveal", 310, 585, 160, 30, {
        fontSize: 16, fontWeight: 700, color: "#a78bfa", textAlign: "center",
        anim: "fadeIn", delay: 2.0,
      }),

      // Diamond reveal
      img(PHOTOS.abstract, 700, 270, 500, 300, {
        anim: "diamondReveal", delay: 1.4, zIndex: 2,
        style: { borderRadius: 16 },
      }),
      txt("diamondReveal", 870, 585, 160, 30, {
        fontSize: 16, fontWeight: 700, color: "#f472b6", textAlign: "center",
        anim: "fadeIn", delay: 2.4,
      }),

      // Split reveal
      img(PHOTOS.gradient, 1260, 270, 500, 300, {
        anim: "splitReveal", delay: 1.8, zIndex: 2,
        style: { borderRadius: 16 },
      }),
      txt("splitReveal", 1430, 585, 160, 30, {
        fontSize: 16, fontWeight: 700, color: "#38bdf8", textAlign: "center",
        anim: "fadeIn", delay: 2.8,
      }),

      // Bottom row — reveal from each direction
      box(140, 680, 380, 180, "rgba(124,58,237,0.15)", {
        radius: 16, anim: "revealFromLeft", delay: 2.2, zIndex: 2,
      }),
      txt("← Desde Izquierda", 220, 745, 220, 30, {
        fontSize: 16, fontWeight: 600, color: "#a78bfa", textAlign: "center",
        anim: "fadeIn", delay: 2.8,
      }),

      box(560, 680, 380, 180, "rgba(52,211,153,0.15)", {
        radius: 16, anim: "revealFromTop", delay: 2.5, zIndex: 2,
      }),
      txt("↓ Desde Arriba", 660, 745, 180, 30, {
        fontSize: 16, fontWeight: 600, color: "#34d399", textAlign: "center",
        anim: "fadeIn", delay: 3.1,
      }),

      box(980, 680, 380, 180, "rgba(251,191,36,0.15)", {
        radius: 16, anim: "revealFromBottom", delay: 2.8, zIndex: 2,
      }),
      txt("↑ Desde Abajo", 1080, 745, 180, 30, {
        fontSize: 16, fontWeight: 600, color: "#fbbf24", textAlign: "center",
        anim: "fadeIn", delay: 3.4,
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 4 — "Efectos de Texto Premium"
  // SplitText letterByLetter, wordByWord, lineByLine, scramble, typewriter
  // Transición: rotate-3d (NUEVA)
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Texto Premium",
    worldTransform: { x: 6600, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0a0f1a",
    backgroundOverlay: "linear-gradient(180deg, rgba(10,15,26,0.95) 0%, rgba(20,10,40,0.9) 100%)",
    duration: 8,
    transition: { type: "rotate-3d", duration: 1.0, easing: "power3.inOut", params: { axis: "Y" } },
    elements: [
      // Badge
      box(140, 100, 200, 36, "rgba(251,191,36,0.2)", { radius: 18, anim: "scaleIn", delay: 0.2 }),
      txt("SPLITTEXT", 160, 104, 170, 28, {
        fontSize: 12, fontWeight: 700, color: "#fbbf24", textAlign: "center",
        letterSpacing: 3, anim: "fadeIn", delay: 0.4,
      }),

      // Título
      txt("Animación de Texto\nLetra por Letra", 140, 160, 1000, 180, {
        fontSize: 64, fontWeight: 800, color: "#ffffff", lineHeight: 1.15,
        anim: "letterByLetter", delay: 0.5, duration: 2.5, zIndex: 4,
      }),

      // Separador
      box(140, 370, 100, 3, "#fbbf24", { anim: "revealFromLeft", delay: 2.0 }),

      // Word by word demo
      txt("Cada palabra aparece de forma independiente con stagger perfecto", 140, 420, 900, 50, {
        fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.8)",
        anim: "wordByWord", delay: 2.5, duration: 2.0, zIndex: 3,
      }),

      // Scramble text demo
      box(140, 530, 760, 120, "rgba(59,130,246,0.08)", {
        radius: 16, anim: "fadeIn", delay: 3.5, zIndex: 1,
      }),
      icn("Binary", 170, 560, 36, "#3b82f6", { anim: "fadeIn", delay: 3.6 }),
      txt("ScrambleText — decodificación tipo Matrix", 220, 555, 650, 40, {
        fontSize: 22, fontWeight: 700, color: "#3b82f6",
        anim: "scrambleIn", delay: 3.8, duration: 1.5, zIndex: 3,
      }),
      txt("Los caracteres pasan por símbolos aleatorios antes de resolverse", 220, 600, 650, 30, {
        fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.4)",
        anim: "fadeIn", delay: 5.0, zIndex: 2,
      }),

      // Typewriter demo
      box(140, 700, 760, 120, "rgba(52,211,153,0.08)", {
        radius: 16, anim: "fadeIn", delay: 5.0, zIndex: 1,
      }),
      icn("Type", 170, 730, 36, "#34d399", { anim: "fadeIn", delay: 5.1 }),
      txt("Efecto máquina de escribir con TextPlugin", 220, 725, 650, 40, {
        fontSize: 22, fontWeight: 700, color: "#34d399",
        anim: "typewriter", delay: 5.3, duration: 2.0, zIndex: 3,
      }),
      txt("Cada carácter aparece secuencialmente como si se estuviera escribiendo", 220, 770, 650, 30, {
        fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.4)",
        anim: "fadeIn", delay: 7.0, zIndex: 2,
      }),

      // Decorativo — panel lateral con código
      box(1020, 100, 780, 780, "rgba(255,255,255,0.03)", {
        radius: 20, anim: "revealFromRight", delay: 0.8, zIndex: 1,
        style: { borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
      }),
      txt("// SplitText + GSAP\nconst split = new SplitText(el, {\n  type: 'chars,words,lines'\n});\n\ngsap.from(split.chars, {\n  opacity: 0,\n  y: 20,\n  stagger: 0.03,\n  duration: 0.8,\n  ease: 'power3.out'\n});", 1060, 160, 700, 500, {
        fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.35)",
        fontFamily: "JetBrains Mono, monospace", lineHeight: 2.0,
        anim: "lineByLine", delay: 1.5, duration: 3.0, zIndex: 2,
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 5 — "Emphasis & Loop"
  // heartbeat, wobble, jello, swing, tada, hoverFloat
  // Transición: ripple (NUEVA)
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Emphasis",
    worldTransform: { x: 8800, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0f0a1e",
    backgroundImage: PHOTOS.particles,
    backgroundOverlay: "linear-gradient(135deg, rgba(15,10,30,0.92) 0%, rgba(10,20,40,0.88) 100%)",
    duration: 8,
    transition: { type: "ripple", duration: 1.2, easing: "power3.inOut", params: {} },
    elements: [
      // Título
      txt("Efectos de Énfasis", 140, 100, 800, 70, {
        fontSize: 48, fontWeight: 800, color: "#ffffff",
        anim: "cinematicZoom", delay: 0.3, zIndex: 4,
      }),
      txt("Animaciones en loop infinito para llamar la atención", 140, 175, 700, 30, {
        fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)",
        anim: "fadeIn", delay: 0.8, zIndex: 3,
      }),

      // Grid de efectos emphasis — 3x2
      // heartbeat
      box(140, 260, 270, 220, "rgba(239,68,68,0.1)", {
        radius: 16, anim: "fadeIn", delay: 0.5, zIndex: 1,
        style: { borderWidth: 1, borderColor: "rgba(239,68,68,0.15)" },
      }),
      icn("Heart", 235, 300, 56, "#ef4444", { anim: "heartbeat", delay: 0.8, duration: 0.6, repeat: -1, yoyo: true }),
      txt("heartbeat", 200, 400, 150, 24, {
        fontSize: 15, fontWeight: 700, color: "#ef4444", textAlign: "center",
        anim: "fadeIn", delay: 1.0,
      }),

      // wobble
      box(450, 260, 270, 220, "rgba(168,85,247,0.1)", {
        radius: 16, anim: "fadeIn", delay: 0.7, zIndex: 1,
        style: { borderWidth: 1, borderColor: "rgba(168,85,247,0.15)" },
      }),
      icn("MessageCircle", 545, 300, 56, "#a855f7", { anim: "wobble", delay: 1.0, duration: 0.8, repeat: -1, yoyo: true }),
      txt("wobble", 520, 400, 130, 24, {
        fontSize: 15, fontWeight: 700, color: "#a855f7", textAlign: "center",
        anim: "fadeIn", delay: 1.2,
      }),

      // jello
      box(760, 260, 270, 220, "rgba(59,130,246,0.1)", {
        radius: 16, anim: "fadeIn", delay: 0.9, zIndex: 1,
        style: { borderWidth: 1, borderColor: "rgba(59,130,246,0.15)" },
      }),
      icn("Droplets", 855, 300, 56, "#3b82f6", { anim: "jello", delay: 1.2, duration: 1.0, repeat: -1, yoyo: true }),
      txt("jello", 840, 400, 110, 24, {
        fontSize: 15, fontWeight: 700, color: "#3b82f6", textAlign: "center",
        anim: "fadeIn", delay: 1.4,
      }),

      // swing
      box(1070, 260, 270, 220, "rgba(251,191,36,0.1)", {
        radius: 16, anim: "fadeIn", delay: 1.1, zIndex: 1,
        style: { borderWidth: 1, borderColor: "rgba(251,191,36,0.15)" },
      }),
      icn("Bell", 1165, 300, 56, "#fbbf24", { anim: "swing", delay: 1.4, duration: 1.5, repeat: -1, yoyo: true }),
      txt("swing", 1140, 400, 130, 24, {
        fontSize: 15, fontWeight: 700, color: "#fbbf24", textAlign: "center",
        anim: "fadeIn", delay: 1.6,
      }),

      // tada
      box(1380, 260, 270, 220, "rgba(52,211,153,0.1)", {
        radius: 16, anim: "fadeIn", delay: 1.3, zIndex: 1,
        style: { borderWidth: 1, borderColor: "rgba(52,211,153,0.15)" },
      }),
      icn("PartyPopper", 1475, 300, 56, "#34d399", { anim: "tada", delay: 1.6, duration: 1.0, repeat: -1, yoyo: true }),
      txt("tada", 1460, 400, 100, 24, {
        fontSize: 15, fontWeight: 700, color: "#34d399", textAlign: "center",
        anim: "fadeIn", delay: 1.8,
      }),

      // Bottom section — hover demos
      txt("Hover sobre las cards para ver interacciones →", 140, 560, 600, 30, {
        fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.4)",
        anim: "fadeIn", delay: 2.5,
      }),

      box(140, 620, 480, 280, "rgba(139,92,246,0.08)", {
        radius: 20, anim: "riseUp", delay: 2.0, zIndex: 2,
        style: { borderWidth: 1, borderColor: "rgba(139,92,246,0.12)" },
        interactions: [
          { type: "hover-lift", params: {} },
          { type: "hover-glow", params: { color: "rgba(139,92,246,0.4)" } },
        ],
      }),
      icn("Wand2", 340, 680, 64, "#8b5cf6", { anim: "hoverFloat", delay: 2.2, duration: 3, repeat: -1, yoyo: true }),
      txt("hover-lift + hover-glow", 240, 770, 280, 30, {
        fontSize: 16, fontWeight: 600, color: "#8b5cf6", textAlign: "center",
        anim: "fadeIn", delay: 2.6,
      }),
      txt("Combinación de elevación y resplandor", 230, 805, 300, 30, {
        fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.3)", textAlign: "center",
        anim: "fadeIn", delay: 2.8,
      }),

      box(700, 620, 480, 280, "rgba(56,189,248,0.08)", {
        radius: 20, anim: "riseUp", delay: 2.3, zIndex: 2,
        style: { borderWidth: 1, borderColor: "rgba(56,189,248,0.12)" },
        interactions: [
          { type: "hover-scale", params: { scale: 1.05 } },
          { type: "hover-color", params: { color: "rgba(56,189,248,0.15)" } },
        ],
      }),
      icn("Maximize", 900, 680, 64, "#38bdf8", { anim: "breathe", delay: 2.5, duration: 3, repeat: -1, yoyo: true }),
      txt("hover-scale + hover-color", 800, 770, 280, 30, {
        fontSize: 16, fontWeight: 600, color: "#38bdf8", textAlign: "center",
        anim: "fadeIn", delay: 2.9,
      }),
      txt("Escala suave con cambio de color", 790, 805, 300, 30, {
        fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.3)", textAlign: "center",
        anim: "fadeIn", delay: 3.1,
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 6 — "Transiciones Cinemáticas"
  // Resumen de todas las transiciones disponibles
  // Transición: slide-over (NUEVA)
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Transiciones",
    worldTransform: { x: 11000, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#050a15",
    backgroundImage: PHOTOS.code,
    backgroundOverlay: "linear-gradient(135deg, rgba(5,10,21,0.95) 0%, rgba(15,5,30,0.92) 100%)",
    duration: 7,
    transition: { type: "slide-over", duration: 0.8, easing: "power3.inOut", params: { direction: "left", color: "#1a1a2e" } },
    elements: [
      // Título
      txt("Transiciones\nCinemáticas", 140, 80, 800, 160, {
        fontSize: 64, fontWeight: 800, color: "#ffffff", lineHeight: 1.15,
        anim: "dramaticReveal", delay: 0.3, zIndex: 4,
      }),
      txt("12 tipos de transición entre escenas", 140, 250, 600, 30, {
        fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)",
        anim: "fadeIn", delay: 0.8, zIndex: 3,
      }),

      // Transition cards — 4x3 grid
      // Row 1
      box(140, 320, 380, 100, "rgba(59,130,246,0.1)", { radius: 12, anim: "revealFromLeft", delay: 0.8, zIndex: 2 }),
      icn("Move", 170, 345, 36, "#3b82f6", { anim: "fadeIn", delay: 1.0 }),
      txt("camera-move", 220, 335, 200, 24, { fontSize: 16, fontWeight: 700, color: "#3b82f6", anim: "fadeIn", delay: 1.0 }),
      txt("Vuelo suave entre escenas", 220, 365, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 1.2 }),

      box(560, 320, 380, 100, "rgba(168,85,247,0.1)", { radius: 12, anim: "revealFromLeft", delay: 1.0, zIndex: 2 }),
      icn("Zap", 590, 345, 36, "#a855f7", { anim: "fadeIn", delay: 1.2 }),
      txt("whip-pan", 640, 335, 200, 24, { fontSize: 16, fontWeight: 700, color: "#a855f7", anim: "fadeIn", delay: 1.2 }),
      txt("Barrido rápido con blur", 640, 365, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 1.4 }),

      box(980, 320, 380, 100, "rgba(244,114,182,0.1)", { radius: 12, anim: "revealFromLeft", delay: 1.2, zIndex: 2 }),
      icn("Aperture", 1010, 345, 36, "#f472b6", { anim: "fadeIn", delay: 1.4 }),
      txt("dolly-zoom", 1060, 335, 200, 24, { fontSize: 16, fontWeight: 700, color: "#f472b6", anim: "fadeIn", delay: 1.4 }),
      txt("Efecto Hitchcock/Vértigo", 1060, 365, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 1.6 }),

      // Row 2
      box(140, 445, 380, 100, "rgba(251,191,36,0.1)", { radius: 12, anim: "revealFromLeft", delay: 1.4, zIndex: 2 }),
      icn("Circle", 170, 470, 36, "#fbbf24", { anim: "fadeIn", delay: 1.6 }),
      txt("iris", 220, 460, 200, 24, { fontSize: 16, fontWeight: 700, color: "#fbbf24", anim: "fadeIn", delay: 1.6 }),
      txt("Wipe circular estilo cine", 220, 490, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 1.8 }),

      box(560, 445, 380, 100, "rgba(52,211,153,0.1)", { radius: 12, anim: "revealFromLeft", delay: 1.6, zIndex: 2 }),
      icn("Tv", 590, 470, 36, "#34d399", { anim: "fadeIn", delay: 1.8 }),
      txt("glitch-cut", 640, 460, 200, 24, { fontSize: 16, fontWeight: 700, color: "#34d399", anim: "fadeIn", delay: 1.8 }),
      txt("Corte digital con RGB split", 640, 490, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 2.0 }),

      box(980, 445, 380, 100, "rgba(239,68,68,0.1)", { radius: 12, anim: "revealFromLeft", delay: 1.8, zIndex: 2 }),
      icn("Droplets", 1010, 470, 36, "#ef4444", { anim: "fadeIn", delay: 2.0 }),
      txt("ripple", 1060, 460, 200, 24, { fontSize: 16, fontWeight: 700, color: "#ef4444", anim: "fadeIn", delay: 2.0 }),
      txt("Disolución tipo agua/ondas", 1060, 490, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 2.2 }),

      // Row 3
      box(140, 570, 380, 100, "rgba(56,189,248,0.1)", { radius: 12, anim: "revealFromLeft", delay: 2.0, zIndex: 2 }),
      icn("Layers", 170, 595, 36, "#38bdf8", { anim: "fadeIn", delay: 2.2 }),
      txt("slide-over", 220, 585, 200, 24, { fontSize: 16, fontWeight: 700, color: "#38bdf8", anim: "fadeIn", delay: 2.2 }),
      txt("Deslizamiento de tarjeta", 220, 615, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 2.4 }),

      box(560, 570, 380, 100, "rgba(139,92,246,0.1)", { radius: 12, anim: "revealFromLeft", delay: 2.2, zIndex: 2 }),
      icn("RotateCw", 590, 595, 36, "#8b5cf6", { anim: "fadeIn", delay: 2.4 }),
      txt("rotate-3d", 640, 585, 200, 24, { fontSize: 16, fontWeight: 700, color: "#8b5cf6", anim: "fadeIn", delay: 2.4 }),
      txt("Rotación 3D tipo cubo", 640, 615, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 2.6 }),

      box(980, 570, 380, 100, "rgba(34,197,94,0.1)", { radius: 12, anim: "revealFromLeft", delay: 2.4, zIndex: 2 }),
      icn("Shapes", 1010, 595, 36, "#22c55e", { anim: "fadeIn", delay: 2.6 }),
      txt("morph-wipe", 1060, 585, 200, 24, { fontSize: 16, fontWeight: 700, color: "#22c55e", anim: "fadeIn", delay: 2.6 }),
      txt("Wipe orgánico con blob", 1060, 615, 250, 20, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", anim: "fadeIn", delay: 2.8 }),

      // Highlight
      box(140, 730, 1220, 60, "rgba(255,255,255,0.03)", {
        radius: 12, anim: "fadeIn", delay: 3.0, zIndex: 1,
        style: { borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
      }),
      txt("+ fade • zoom-blur • film-grain-cut • parallax-shift • camera-move", 340, 742, 800, 30, {
        fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.35)", textAlign: "center",
        anim: "fadeIn", delay: 3.2,
      }),
    ],
  });

  return buildPresentation("Showcase de Efectos GSAP", scenes);
}
