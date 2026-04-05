import { createId } from "@/lib/id";
import type {
  Presentation, Scene, SceneElement, CameraKeyframe,
  TextContent, ShapeContent, ImageContent, IconContent,
  ElementInteraction,
} from "../types/presentation";
import { createAnimation, createCameraKeyframe } from "./SceneFactory";
import { createEfectosShowcase } from "./efectos-showcase";

// ---------------------------------------------------------------------------
// Premium Templates — Real images, real beauty
// Uses Unsplash free photos for backgrounds and content
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
    settings: { width: 1920, height: 1080, backgroundColor: "#000", worldBounds: { width: 20000, height: 20000 }, defaultTransition: { type: "camera-move", duration: 1.2, easing: "power2.inOut", params: {} } },
    scenes, camera: { keyframes }, createdAt: now, updatedAt: now,
  };
}

// Element helpers with proper defaults
function el(type: SceneElement["type"], x: number, y: number, w: number, h: number, content: SceneElement["content"], opts: {
  anim?: string; delay?: number; zIndex?: number; opacity?: number;
  style?: SceneElement["style"]; interactions?: ElementInteraction[];
  rotation?: number;
} = {}): SceneElement {
  return {
    id: createId(), type, name: type,
    transform: { x, y, width: w, height: h, rotation: opts.rotation || 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: opts.opacity ?? 1 },
    style: opts.style || {},
    content,
    animations: opts.anim ? [createAnimation({ preset: opts.anim as any, timing: { startTime: opts.delay || 0, duration: 0.9, repeat: 0, yoyo: false } })] : [],
    interactions: opts.interactions,
    depthLayer: 0, locked: false, visible: true, zIndex: opts.zIndex ?? 1,
  };
}

function txt(html: string, x: number, y: number, w: number, h: number, opts: Partial<TextContent> & { anim?: string; delay?: number; zIndex?: number; opacity?: number; style?: SceneElement["style"] } = {}): SceneElement {
  const { anim, delay, zIndex, opacity, style, ...rest } = opts;
  return el("text", x, y, w, h, {
    type: "text", html, fontFamily: "Inter", fontSize: 32, fontWeight: 400, color: "#ffffff", textAlign: "left", lineHeight: 1.4, ...rest,
  } as TextContent, { anim, delay, zIndex, opacity, style });
}

function img(src: string, x: number, y: number, w: number, h: number, opts: { anim?: string; delay?: number; zIndex?: number; style?: SceneElement["style"]; interactions?: ElementInteraction[] } = {}): SceneElement {
  return el("image", x, y, w, h, {
    type: "image", src, alt: "", objectFit: "cover",
  } as ImageContent, opts);
}

function box(x: number, y: number, w: number, h: number, fill: string, opts: { radius?: number; anim?: string; delay?: number; zIndex?: number; opacity?: number; interactions?: ElementInteraction[] } = {}): SceneElement {
  return el("shape", x, y, w, h, {
    type: "shape", shape: "rect", fill, stroke: undefined, strokeWidth: 0,
  } as ShapeContent, { ...opts, style: { borderRadius: opts.radius ?? 0 } });
}

function circle(x: number, y: number, size: number, fill: string, opts: { anim?: string; delay?: number; opacity?: number } = {}): SceneElement {
  return el("shape", x, y, size, size, {
    type: "shape", shape: "circle", fill, stroke: undefined, strokeWidth: 0,
  } as ShapeContent, { ...opts, style: { borderRadius: 9999 } });
}

function icn(name: string, x: number, y: number, size: number, color: string, opts: { anim?: string; delay?: number } = {}): SceneElement {
  return el("icon", x, y, size, size, {
    type: "icon", iconName: name, color, strokeWidth: 1.5, filled: false,
  } as IconContent, opts);
}

// Unsplash image URLs (free, high quality, reliable)
const PHOTOS = {
  // Business / Tech
  cityNight: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80",
  teamWork: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1920&q=80",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  meeting: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
  data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",

  // Nature / Abstract
  mountains: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
  stars: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
  aurora: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80",
  sunset: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80",

  // Creative / Design
  colorful: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80",
  neon: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80",
  abstract: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80",
  gradient: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80",

  // People
  speaker: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&q=80",
  creative: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1920&q=80",

  // Cards / Small
  card1: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  card2: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  card3: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  card4: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
};

// =====================================================================
// TEMPLATE 1: PITCH PROFESIONAL
// Modern business pitch with real photos
// =====================================================================
export function createPitchProfesional(): Presentation {
  const scenes: Scene[] = [];

  // --- SCENE 1: Cover ---
  scenes.push({
    id: createId(), name: "Portada",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#000000",
    backgroundImage: PHOTOS.cityNight,
    backgroundOverlay: "rgba(0,0,0,0.55)",
    duration: 5,
    transition: { type: "camera-move", duration: 1, easing: "power2.inOut", params: {} },
    elements: [
      // Top accent bar
      box(0, 0, 1920, 5, "#6366f1", { zIndex: 10 }),

      // Logo area
      box(140, 80, 50, 50, "#6366f1", { radius: 12, anim: "scaleIn", zIndex: 5 }),
      txt("ACME", 200, 85, 200, 40, { fontFamily: "Montserrat", fontSize: 22, fontWeight: 700, color: "#ffffff", anim: "fadeIn", delay: 0.2 }),

      // Main title
      txt("Transformamos\nel Futuro Digital", 140, 300, 1000, 280, {
        fontFamily: "DM Serif Display", fontSize: 88, fontWeight: 400, color: "#ffffff",
        textAlign: "left", lineHeight: 1.1, anim: "slideInLeft", delay: 0.3,
      }),

      // Accent line
      box(140, 590, 80, 5, "#6366f1", { radius: 4, anim: "fadeIn", delay: 0.6 }),

      // Subtitle
      txt("Innovacion tecnologica para empresas\nque quieren liderar su industria", 140, 620, 700, 80, {
        fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, anim: "fadeIn", delay: 0.7,
      }),

      // Right side: floating stat card
      box(1300, 400, 450, 180, "rgba(255,255,255,0.1)", {
        radius: 20, anim: "slideInRight", delay: 0.8, zIndex: 5,
        interactions: [{ type: "hover-glow", params: { color: "rgba(99,102,241,0.3)" } }],
      }),
      txt("$2.4M", 1340, 420, 370, 80, { fontFamily: "Bebas Neue", fontSize: 64, color: "#6366f1", anim: "fadeIn", delay: 1.0 }),
      txt("en ingresos generados\npara nuestros clientes", 1340, 500, 370, 50, { fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.6)", anim: "fadeIn", delay: 1.1 }),

      // Bottom bar
      txt("2025 · Presentacion Confidencial", 140, 1000, 400, 25, { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.3)" }),
    ],
  });

  // --- SCENE 2: Problem ---
  scenes.push({
    id: createId(), name: "El Problema",
    worldTransform: { x: 2400, y: -200, z: 0, rotation: -2, scale: 1 },
    backgroundColor: "#0a0a1a",
    backgroundGradient: "linear-gradient(135deg, #0a0a1a 0%, #1a1035 100%)",
    duration: 5,
    transition: { type: "zoom-blur", duration: 1.2, easing: "power3.inOut", params: {} },
    elements: [
      // Section tag
      box(140, 100, 120, 32, "rgba(239,68,68,0.15)", { radius: 16 }),
      txt("PROBLEMA", 155, 104, 100, 24, { fontSize: 11, fontWeight: 700, color: "#ef4444", letterSpacing: 2, anim: "fadeIn" }),

      // Main heading
      txt("El 73% de las empresas\npierden oportunidades\npor tecnologia obsoleta", 140, 180, 900, 280, {
        fontFamily: "DM Serif Display", fontSize: 52, color: "#ffffff", lineHeight: 1.2, anim: "slideInLeft", delay: 0.2,
      }),

      // Pain points with images
      // Card 1
      img(PHOTOS.card1, 140, 520, 500, 200, { anim: "slideInUp", delay: 0.4, style: { borderRadius: 16 } }),
      box(140, 520, 500, 200, "rgba(0,0,0,0.6)", { radius: 16, zIndex: 3 }),
      icn("TrendingDown", 180, 560, 40, "#ef4444", { anim: "scaleIn", delay: 0.6 }),
      txt("Perdida de competitividad", 230, 560, 350, 30, { fontSize: 18, fontWeight: 600, color: "#fff", zIndex: 4 }),
      txt("Procesos lentos que cuestan dinero y clientes cada trimestre", 180, 620, 420, 50, { fontSize: 14, color: "rgba(255,255,255,0.65)", zIndex: 4 }),

      // Card 2
      img(PHOTOS.card2, 700, 520, 500, 200, { anim: "slideInUp", delay: 0.6, style: { borderRadius: 16 } }),
      box(700, 520, 500, 200, "rgba(0,0,0,0.6)", { radius: 16, zIndex: 3 }),
      icn("AlertTriangle", 740, 560, 40, "#f59e0b", { anim: "scaleIn", delay: 0.8 }),
      txt("Riesgo de seguridad", 790, 560, 350, 30, { fontSize: 18, fontWeight: 600, color: "#fff", zIndex: 4 }),
      txt("Sistemas vulnerables que ponen en riesgo datos criticos", 740, 620, 420, 50, { fontSize: 14, color: "rgba(255,255,255,0.65)", zIndex: 4 }),

      // Right side big number
      txt("73%", 1300, 200, 500, 250, { fontFamily: "Bebas Neue", fontSize: 200, color: "rgba(239,68,68,0.15)", textAlign: "center" }),
    ],
  });

  // --- SCENE 3: Solution ---
  scenes.push({
    id: createId(), name: "La Solucion",
    worldTransform: { x: 4800, y: 300, z: 0, rotation: 1, scale: 1 },
    backgroundColor: "#000000",
    backgroundImage: PHOTOS.abstract,
    backgroundOverlay: "rgba(0,0,0,0.7)",
    duration: 5,
    transition: { type: "whip-pan", duration: 0.8, easing: "power4.inOut", params: {} },
    elements: [
      box(140, 100, 120, 32, "rgba(34,197,94,0.2)", { radius: 16 }),
      txt("SOLUCION", 155, 104, 100, 24, { fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: 2, anim: "fadeIn" }),

      txt("Plataforma integral\nde transformacion digital", 140, 180, 900, 200, {
        fontFamily: "DM Serif Display", fontSize: 56, color: "#ffffff", lineHeight: 1.15, anim: "slideInLeft", delay: 0.2,
      }),

      // 3 Solution pillars
      ...[
        { icon: "Cpu", title: "Automatizacion IA", desc: "Procesos inteligentes que aprenden y mejoran", color: "#6366f1", photo: PHOTOS.card3 },
        { icon: "Shield", title: "Seguridad Total", desc: "Proteccion de datos de nivel empresarial", color: "#22c55e", photo: PHOTOS.card4 },
        { icon: "Zap", title: "Velocidad 10x", desc: "Resultados inmediatos desde el dia uno", color: "#f59e0b", photo: PHOTOS.card1 },
      ].flatMap((item, i) => {
        const cx = 140 + i * 540;
        const cy = 480;
        return [
          img(item.photo, cx, cy, 490, 280, { anim: "slideInUp", delay: 0.4 + i * 0.2, style: { borderRadius: 20 } }),
          box(cx, cy, 490, 280, "rgba(0,0,0,0.65)", { radius: 20, zIndex: 3 }),
          icn(item.icon, cx + 30, cy + 30, 48, item.color, { anim: "scaleIn", delay: 0.6 + i * 0.2 }),
          box(cx + 30, cy + 90, 40, 3, item.color, { radius: 2, zIndex: 4 }),
          txt(item.title, cx + 30, cy + 108, 430, 35, { fontSize: 22, fontWeight: 700, color: "#fff", zIndex: 4, anim: "fadeIn", delay: 0.7 + i * 0.2 }),
          txt(item.desc, cx + 30, cy + 150, 430, 50, { fontSize: 15, color: "rgba(255,255,255,0.7)", zIndex: 4, anim: "fadeIn", delay: 0.8 + i * 0.2 }),
          // Hover effect on the overlay
          box(cx, cy, 490, 280, "transparent", {
            radius: 20, zIndex: 5,
            interactions: [{ type: "hover-lift", params: {} }],
          }),
        ];
      }),
    ],
  });

  // --- SCENE 4: Results / Social Proof ---
  scenes.push({
    id: createId(), name: "Resultados",
    worldTransform: { x: 7200, y: -100, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0a0a1a",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    duration: 5,
    transition: { type: "dolly-zoom", duration: 1.5, easing: "power3.inOut", params: { perspectiveEnd: 600, counterScale: 1.1 } },
    elements: [
      box(140, 100, 140, 32, "rgba(99,102,241,0.2)", { radius: 16 }),
      txt("RESULTADOS", 155, 104, 120, 24, { fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: 2, anim: "fadeIn" }),

      txt("Numeros que hablan", 140, 180, 800, 80, {
        fontFamily: "DM Serif Display", fontSize: 56, color: "#ffffff", anim: "slideInLeft", delay: 0.2,
      }),

      // Big metrics row
      ...[
        { number: "340%", label: "ROI promedio", color: "#6366f1" },
        { number: "2.4M", label: "Usuarios activos", color: "#22c55e" },
        { number: "99.9%", label: "Uptime garantizado", color: "#06b6d4" },
        { number: "50+", label: "Empresas confian", color: "#f59e0b" },
      ].flatMap((m, i) => {
        const cx = 140 + i * 430;
        return [
          box(cx, 320, 390, 200, "rgba(255,255,255,0.05)", {
            radius: 20, anim: "slideInUp", delay: 0.3 + i * 0.15, zIndex: 3,
            interactions: [{ type: "hover-glow", params: { color: `${m.color}44` } }],
          }),
          txt(m.number, cx, 350, 390, 90, { fontFamily: "Bebas Neue", fontSize: 72, color: m.color, textAlign: "center", anim: "cinematicZoom", delay: 0.5 + i * 0.15, zIndex: 4 }),
          txt(m.label, cx, 440, 390, 30, { fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.6)", textAlign: "center", zIndex: 4 }),
        ];
      }),

      // Testimonial with photo
      img(PHOTOS.teamWork, 140, 600, 1640, 350, { anim: "fadeIn", delay: 0.8, style: { borderRadius: 24 } }),
      box(140, 600, 1640, 350, "rgba(0,0,0,0.7)", { radius: 24, zIndex: 3 }),
      txt('"La mejor decision tecnologica que hemos tomado.\nNuestro equipo es 3x mas productivo."', 220, 660, 1000, 120, {
        fontFamily: "DM Serif Display", fontSize: 28, color: "rgba(255,255,255,0.9)",
        lineHeight: 1.5, zIndex: 4, anim: "fadeIn", delay: 1.0,
      }),
      txt("— Maria Garcia, CTO de TechCorp", 220, 810, 500, 30, { fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.5)", zIndex: 4 }),

      // Company logos (placeholder circles)
      ...[0, 1, 2, 3, 4].map(i =>
        circle(1300 + i * 70, 820, 50, "rgba(255,255,255,0.1)", { anim: "scaleIn", delay: 1.2 + i * 0.1 })
      ),
    ],
  });

  // --- SCENE 5: CTA ---
  scenes.push({
    id: createId(), name: "Contacto",
    worldTransform: { x: 9600, y: 200, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#000000",
    backgroundImage: PHOTOS.gradient,
    backgroundOverlay: "rgba(0,0,0,0.5)",
    duration: 5,
    transition: { type: "fade", duration: 1.5, easing: "power2.inOut", params: {} },
    elements: [
      txt("Empecemos", 310, 280, 1300, 150, {
        fontFamily: "DM Serif Display", fontSize: 96, color: "#ffffff",
        textAlign: "center", anim: "dramaticReveal", delay: 0.3,
      }),

      box(810, 440, 300, 4, "#6366f1", { radius: 4, anim: "fadeIn", delay: 0.7 }),

      txt("Agenda una demo de 30 minutos\ny descubre como transformar tu empresa", 460, 480, 1000, 80, {
        fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.7)",
        textAlign: "center", lineHeight: 1.6, anim: "fadeIn", delay: 0.8,
      }),

      // CTA Button
      box(710, 620, 500, 65, "#6366f1", {
        radius: 32, anim: "scaleIn", delay: 1.0, zIndex: 5,
        interactions: [{ type: "hover-scale", params: { scale: 1.05 } }, { type: "hover-glow", params: { color: "rgba(99,102,241,0.5)" } }],
      }),
      txt("Agendar demo gratuita →", 710, 632, 500, 40, {
        fontSize: 20, fontWeight: 600, color: "#ffffff", textAlign: "center", zIndex: 6,
      }),

      // Contact info
      icn("Mail", 700, 740, 24, "rgba(255,255,255,0.5)"),
      txt("hola@acme.com", 735, 742, 200, 24, { fontSize: 15, color: "rgba(255,255,255,0.5)" }),

      icn("Globe", 960, 740, 24, "rgba(255,255,255,0.5)"),
      txt("www.acme.com", 995, 742, 200, 24, { fontSize: 15, color: "rgba(255,255,255,0.5)" }),

      // Bottom
      txt("© 2025 ACME Inc. Todos los derechos reservados.", 610, 950, 700, 25, {
        fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center",
      }),
    ],
  });

  return buildPresentation("Pitch Profesional", scenes);
}

// =====================================================================
// TEMPLATE 2: NATURALEZA INMERSIVA
// Beautiful nature-focused with full-bleed photos
// =====================================================================
export function createNaturalezaInmersiva(): Presentation {
  const scenes: Scene[] = [];

  // Scene 1 — Epic mountain cover
  scenes.push({
    id: createId(), name: "Portada",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#000",
    backgroundImage: PHOTOS.mountains,
    backgroundOverlay: "rgba(0,0,0,0.35)",
    duration: 5,
    transition: { type: "camera-move", duration: 1, easing: "power2.inOut", params: {} },
    elements: [
      // Bottom gradient for text readability
      box(0, 600, 1920, 480, "rgba(0,0,0,0.7)", {}),

      txt("PRESERVAR", 140, 650, 1640, 180, {
        fontFamily: "Oswald", fontSize: 140, fontWeight: 400, color: "#ffffff",
        textAlign: "center", anim: "cinematicZoom", delay: 0.3,
      }),
      txt("El planeta necesita nuestra accion", 140, 830, 1640, 50, {
        fontFamily: "Source Sans 3", fontSize: 24, fontWeight: 300,
        color: "rgba(255,255,255,0.7)", textAlign: "center", anim: "fadeIn", delay: 0.8,
      }),

      // Small nature icon
      icn("Mountain", 920, 900, 40, "rgba(255,255,255,0.3)", { anim: "scaleIn", delay: 1.2 }),
    ],
  });

  // Scene 2 — The crisis
  scenes.push({
    id: createId(), name: "La Crisis",
    worldTransform: { x: 2400, y: 500, z: 0, rotation: 3, scale: 1 },
    backgroundColor: "#0a1a0a",
    backgroundGradient: "linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 100%)",
    duration: 5,
    transition: { type: "zoom-blur", duration: 1.4, easing: "power3.inOut", params: {} },
    elements: [
      txt("La Crisis\nAmbiental", 140, 120, 800, 220, {
        fontFamily: "Oswald", fontSize: 72, color: "#ffffff", lineHeight: 1.1, anim: "slideInLeft", delay: 0.2,
      }),
      box(140, 350, 60, 4, "#22c55e", { radius: 2 }),
      txt("Cada dia perdemos especies, bosques y recursos\nirrecuperables. Pero hay esperanza.", 140, 380, 700, 80, {
        fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, anim: "fadeIn", delay: 0.5,
      }),

      // Photo cards
      img(PHOTOS.forest, 140, 520, 520, 400, { anim: "slideInUp", delay: 0.4, style: { borderRadius: 20 } }),
      img(PHOTOS.ocean, 700, 520, 520, 400, { anim: "slideInUp", delay: 0.6, style: { borderRadius: 20 } }),
      img(PHOTOS.sunset, 1260, 520, 520, 400, { anim: "slideInUp", delay: 0.8, style: { borderRadius: 20 } }),

      // Labels on photos
      box(140, 830, 520, 90, "rgba(0,0,0,0.6)", { radius: 20, zIndex: 3 }),
      txt("Deforestacion", 180, 850, 440, 30, { fontSize: 18, fontWeight: 600, color: "#fff", zIndex: 4 }),
      txt("12M hectareas/ano", 180, 880, 440, 25, { fontSize: 14, color: "#22c55e", zIndex: 4 }),

      box(700, 830, 520, 90, "rgba(0,0,0,0.6)", { radius: 20, zIndex: 3 }),
      txt("Oceanos", 740, 850, 440, 30, { fontSize: 18, fontWeight: 600, color: "#fff", zIndex: 4 }),
      txt("8M tons plastico/ano", 740, 880, 440, 25, { fontSize: 14, color: "#06b6d4", zIndex: 4 }),

      box(1260, 830, 520, 90, "rgba(0,0,0,0.6)", { radius: 20, zIndex: 3 }),
      txt("Biodiversidad", 1300, 850, 440, 30, { fontSize: 18, fontWeight: 600, color: "#fff", zIndex: 4 }),
      txt("1M especies en riesgo", 1300, 880, 440, 25, { fontSize: 14, color: "#f59e0b", zIndex: 4 }),
    ],
  });

  // Scene 3 — What we can do
  scenes.push({
    id: createId(), name: "Solucion",
    worldTransform: { x: 4800, y: -200, z: 0, rotation: -2, scale: 1 },
    backgroundColor: "#000",
    backgroundImage: PHOTOS.aurora,
    backgroundOverlay: "rgba(0,0,0,0.6)",
    duration: 5,
    transition: { type: "whip-pan", duration: 0.9, easing: "power4.inOut", params: {} },
    elements: [
      txt("Que Podemos\nHacer", 140, 150, 1640, 250, {
        fontFamily: "Oswald", fontSize: 80, color: "#ffffff",
        textAlign: "center", lineHeight: 1.1, anim: "dramaticReveal", delay: 0.3,
      }),

      // Action cards
      ...[
        { icon: "Trees", title: "Reforestar", desc: "Plantar 1 billon de arboles para 2030", color: "#22c55e" },
        { icon: "Droplets", title: "Limpiar Oceanos", desc: "Eliminar el 90% del plastico maritimo", color: "#06b6d4" },
        { icon: "Sun", title: "Energia Limpia", desc: "100% renovable para 2040", color: "#f59e0b" },
        { icon: "Users", title: "Educar", desc: "Formar 100M de eco-lideres globales", color: "#a855f7" },
      ].flatMap((item, i) => {
        const cx = 140 + i * 420;
        const cy = 500;
        return [
          box(cx, cy, 390, 380, "rgba(0,0,0,0.5)", {
            radius: 24, anim: "slideInUp", delay: 0.4 + i * 0.15, zIndex: 3,
            interactions: [{ type: "hover-lift", params: {} }],
          }),
          icn(item.icon, cx + 30, cy + 35, 56, item.color, { anim: "scaleIn", delay: 0.6 + i * 0.15 }),
          box(cx + 30, cy + 110, 50, 3, item.color, { radius: 2, zIndex: 4 }),
          txt(item.title, cx + 30, cy + 130, 330, 40, { fontFamily: "Oswald", fontSize: 28, fontWeight: 400, color: "#fff", zIndex: 4 }),
          txt(item.desc, cx + 30, cy + 180, 330, 80, { fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, zIndex: 4 }),
          // Big number
          txt(`0${i + 1}`, cx + 290, cy + 290, 80, 60, { fontFamily: "Bebas Neue", fontSize: 48, color: "rgba(255,255,255,0.08)", zIndex: 4 }),
        ];
      }),
    ],
  });

  // Scene 4 — Call to action
  scenes.push({
    id: createId(), name: "Actua",
    worldTransform: { x: 7200, y: 400, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#000",
    backgroundImage: PHOTOS.stars,
    backgroundOverlay: "rgba(0,0,0,0.4)",
    duration: 5,
    transition: { type: "fade", duration: 2, easing: "power2.inOut", params: {} },
    elements: [
      txt("El momento\nes ahora", 260, 280, 1400, 280, {
        fontFamily: "Oswald", fontSize: 100, color: "#ffffff",
        textAlign: "center", lineHeight: 1.1, anim: "dramaticReveal", delay: 0.5,
      }),
      box(810, 570, 300, 4, "#22c55e", { radius: 2, anim: "fadeIn", delay: 1.0 }),
      txt("Cada accion cuenta. Cada decision importa.\nSe parte del cambio.", 410, 600, 1100, 80, {
        fontSize: 24, fontWeight: 300, color: "rgba(255,255,255,0.7)",
        textAlign: "center", lineHeight: 1.6, anim: "fadeIn", delay: 1.2,
      }),

      // CTA
      box(660, 740, 600, 65, "#22c55e", {
        radius: 32, anim: "scaleIn", delay: 1.5, zIndex: 5,
        interactions: [{ type: "hover-scale", params: { scale: 1.05 } }],
      }),
      txt("Unete al movimiento →", 660, 752, 600, 40, {
        fontSize: 22, fontWeight: 600, color: "#fff", textAlign: "center", zIndex: 6,
      }),

      icn("Heart", 910, 860, 30, "rgba(34,197,94,0.5)", { anim: "scaleIn", delay: 2.0 }),
    ],
  });

  return buildPresentation("Naturaleza Inmersiva", scenes);
}

// =====================================================================
// CATALOG
// =====================================================================
import { createAgenciaCreativa } from "./agencia-creativa";
import { createVibrante } from "./vibrante";

export const PREMIUM_TEMPLATE_CATALOG = [
  {
    id: "vibrante",
    name: "Vibrante",
    description: "5 escenas con paletas de color espectaculares: fuego, océano, bosque, aurora y cosmos",
    preview: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&q=80",
    create: createVibrante,
  },
  {
    id: "pitch-profesional",
    name: "Pitch Profesional",
    description: "Presentacion de negocios con fotos reales, metricas y testimonios",
    preview: PHOTOS.cityNight,
    create: createPitchProfesional,
  },
  {
    id: "naturaleza-inmersiva",
    name: "Naturaleza Inmersiva",
    description: "Fotos de paisajes impresionantes con mensajes de impacto ambiental",
    preview: PHOTOS.mountains,
    create: createNaturalezaInmersiva,
  },
  {
    id: "agencia-creativa",
    name: "Agencia Creativa",
    description: "Diseno premium con fotos reales, cards interactivos y transiciones cinematicas",
    preview: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    create: createAgenciaCreativa,
  },
  {
    id: "efectos-showcase",
    name: "Showcase de Efectos",
    description: "Demo de todos los efectos GSAP premium: SplitText, reveals, glitch, 3D, physics y más",
    preview: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80",
    create: createEfectosShowcase,
  },
];
