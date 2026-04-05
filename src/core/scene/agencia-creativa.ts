// ─────────────────────────────────────────────────────────────────
// PLANTILLA: "Agencia Creativa"
// Estilo Genially: interactiva, cinematic, con fotos reales
// 5 escenas con transiciones cinematográficas y elementos interactivos
// ─────────────────────────────────────────────────────────────────
import { createId } from "@/lib/id";
import type {
  Presentation, Scene, SceneElement, CameraKeyframe,
  TextContent, ShapeContent, ImageContent, IconContent,
  ElementInteraction,
} from "../types/presentation";
import { createAnimation, createCameraKeyframe } from "./SceneFactory";

// ── Fotos de Unsplash (gratis, fiables) ──────────────────────────
const PHOTOS = {
  hero:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
  team:    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
  work:    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  stats:   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
  contact: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80",
};

// ── Helpers (same pattern as premium-templates.ts) ───────────────

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
    anim?: string; delay?: number; zIndex?: number; opacity?: number;
    style?: SceneElement["style"]; interactions?: ElementInteraction[];
    rotation?: number;
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
      ? [createAnimation({ preset: opts.anim as any, timing: { startTime: opts.delay || 0, duration: 0.9, repeat: 0, yoyo: false } })]
      : [],
    interactions: opts.interactions,
    depthLayer: 0, locked: false, visible: true, zIndex: opts.zIndex ?? 1,
  };
}

function txt(
  html: string, x: number, y: number, w: number, h: number,
  opts: Partial<TextContent> & {
    anim?: string; delay?: number; zIndex?: number; opacity?: number;
    style?: SceneElement["style"];
  } = {}
): SceneElement {
  const { anim, delay, zIndex, opacity, style, ...rest } = opts;
  return el("text", x, y, w, h, {
    type: "text", html,
    fontFamily: "Inter", fontSize: 32, fontWeight: 400,
    color: "#ffffff", textAlign: "left", lineHeight: 1.4,
    ...rest,
  } as TextContent, { anim, delay, zIndex, opacity, style });
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
  opts: { radius?: number; anim?: string; delay?: number; zIndex?: number; opacity?: number; interactions?: ElementInteraction[] } = {}
): SceneElement {
  return el("shape", x, y, w, h, {
    type: "shape", shape: "rect", fill, stroke: undefined, strokeWidth: 0,
  } as ShapeContent, { ...opts, style: { borderRadius: opts.radius ?? 0 } });
}

function icn(
  name: string, x: number, y: number, size: number, color: string,
  opts: { anim?: string; delay?: number } = {}
): SceneElement {
  return el("icon", x, y, size, size, {
    type: "icon", iconName: name, color, strokeWidth: 1.5, filled: false,
  } as IconContent, opts);
}

// ─────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export function createAgenciaCreativa(): Presentation {
  const scenes: Scene[] = [];

  // ══════════════════════════════════════════════════════════════
  // ESCENA 1 — HERO
  // Fondo fotográfico + overlay gradient + título animado
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Hero",
    worldTransform: { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#000000",
    backgroundImage: PHOTOS.hero,
    backgroundOverlay: "rgba(0,0,0,0.55)",
    duration: 6,
    transition: { type: "zoom-blur", duration: 1.2, easing: "power3.inOut", params: {} },
    elements: [
      // Barra superior con color de marca
      box(0, 0, 1920, 6, "#7c3aed", { zIndex: 10 }),

      // Tag de categoría
      box(140, 100, 160, 36, "rgba(124,58,237,0.2)", { radius: 18, anim: "fadeIn" }),
      txt("AGENCIA", 155, 105, 130, 26, {
        fontSize: 11, fontWeight: 700, color: "#a78bfa",
        letterSpacing: 3, anim: "fadeIn", delay: 0.1,
      }),

      // Título principal — fuente serif grande
      txt("Creatividad\nque Vende", 140, 180, 1100, 280, {
        fontFamily: "DM Serif Display",
        fontSize: 96, fontWeight: 400, color: "#ffffff",
        lineHeight: 1.05, textAlign: "left",
        anim: "slideInLeft", delay: 0.2,
      }),

      // Línea decorativa de marca
      box(140, 480, 100, 5, "#7c3aed", { radius: 4, anim: "fadeIn", delay: 0.5 }),

      // Subtítulo
      txt("Diseno estrategico para marcas que quieren\nimpactar en la era digital.", 140, 510, 680, 80, {
        fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.75)",
        lineHeight: 1.6, anim: "fadeIn", delay: 0.6,
      }),

      // CTA botón — con interactividad hover
      box(140, 630, 220, 56, "#7c3aed", {
        radius: 28, anim: "slideInLeft", delay: 0.8, zIndex: 5,
        interactions: [{ type: "hover-glow", params: { color: "rgba(167,139,250,0.5)" } }],
      }),
      txt("Ver Nuestro Trabajo →", 150, 643, 200, 30, {
        fontSize: 16, fontWeight: 600, color: "#ffffff",
        textAlign: "center", zIndex: 6, anim: "fadeIn", delay: 0.9,
      }),

      // Card flotante a la derecha con métricas — hover interactivo
      box(1300, 300, 440, 200, "rgba(255,255,255,0.07)", {
        radius: 24, anim: "slideInRight", delay: 0.8, zIndex: 5,
        interactions: [{ type: "hover-lift", params: {} }],
      }),
      txt("150+", 1340, 330, 180, 70, {
        fontFamily: "Bebas Neue", fontSize: 72,
        color: "#a78bfa", anim: "fadeIn", delay: 1.0,
      }),
      txt("proyectos\nentregados", 1340, 405, 360, 50, {
        fontSize: 16, fontWeight: 400,
        color: "rgba(255,255,255,0.65)", anim: "fadeIn", delay: 1.1,
      }),

      // Año de fundación
      txt("© Agencia Creativa 2025", 140, 1030, 400, 25, {
        fontSize: 12, color: "rgba(255,255,255,0.3)",
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 2 — SERVICIOS
  // Fondo oscuro con cards interactivos. Transición whip-pan
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Servicios",
    worldTransform: { x: 2600, y: 200, z: 0, rotation: -1, scale: 1 },
    backgroundColor: "#08081a",
    backgroundGradient: "linear-gradient(135deg, #08081a 0%, #150d2e 100%)",
    duration: 5,
    transition: { type: "whip-pan", duration: 0.8, easing: "power4.inOut", params: {} },
    elements: [
      // Etiqueta de sección
      box(140, 100, 110, 36, "rgba(99,102,241,0.15)", { radius: 18 }),
      txt("SERVICIOS", 155, 104, 90, 28, {
        fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: 2, anim: "fadeIn",
      }),

      // Heading
      txt("Lo que\nhacemos mejor", 140, 170, 900, 200, {
        fontFamily: "DM Serif Display", fontSize: 64,
        color: "#ffffff", lineHeight: 1.1, anim: "slideInLeft", delay: 0.2,
      }),

      // 3 cards de servicios con hover interactivo
      ...[
        { icon: "Palette",    title: "Diseno UI/UX",       desc: "Interfaces que convierten visitantes en clientes",      color: "#818cf8" },
        { icon: "Video",      title: "Motion Graphics",    desc: "Animaciones cinematicas para tu marca",                 color: "#ec4899" },
        { icon: "TrendingUp", title: "Branding Digital",   desc: "Identidad visual coherente y memorable",                color: "#22c55e" },
      ].flatMap((svc, i) => {
        const cx = 140 + i * 570;
        const cy = 430;
        return [
          // Card base
          box(cx, cy, 530, 340, "rgba(255,255,255,0.04)", {
            radius: 24, anim: "slideInUp", delay: 0.4 + i * 0.15, zIndex: 2,
            interactions: [{ type: "hover-lift", params: {} }],
          }),
          // Borde superior coloreado
          box(cx, cy, 530, 4, svc.color, { radius: 2, zIndex: 3 }),
          // Ícono
          icn(svc.icon, cx + 32, cy + 36, 44, svc.color, {
            anim: "scaleIn", delay: 0.6 + i * 0.15,
          }),
          // Línea separadora
          box(cx + 32, cy + 100, 40, 3, svc.color, { radius: 2, zIndex: 3 }),
          // Título
          txt(svc.title, cx + 32, cy + 120, 460, 38, {
            fontSize: 24, fontWeight: 700, color: "#ffffff",
            zIndex: 4, anim: "fadeIn", delay: 0.7 + i * 0.15,
          }),
          // Descripción
          txt(svc.desc, cx + 32, cy + 170, 460, 60, {
            fontSize: 16, color: "rgba(255,255,255,0.60)",
            lineHeight: 1.6, zIndex: 4, anim: "fadeIn", delay: 0.8 + i * 0.15,
          }),
          // Link hover
          txt("Ver mas →", cx + 32, cy + 280, 150, 30, {
            fontSize: 15, fontWeight: 600, color: svc.color,
            zIndex: 4, anim: "fadeIn", delay: 0.9 + i * 0.15,
          }),
        ];
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 3 — PORTAFOLIO
  // Grid de imágenes reales con overlays. Transición dolly-zoom
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Portafolio",
    worldTransform: { x: 5200, y: -200, z: 0, rotation: 1, scale: 1 },
    backgroundColor: "#000000",
    backgroundImage: PHOTOS.work,
    backgroundOverlay: "rgba(0,0,0,0.82)",
    duration: 6,
    transition: { type: "dolly-zoom", duration: 1.4, easing: "power3.inOut", params: { perspective: 800, counterScale: 1.1 } },
    elements: [
      box(140, 100, 130, 36, "rgba(34,197,94,0.15)", { radius: 18 }),
      txt("PORTAFOLIO", 150, 104, 120, 28, {
        fontSize: 11, fontWeight: 700, color: "#4ade80", letterSpacing: 2, anim: "fadeIn",
      }),

      txt("Proyectos que\nhacen historia", 140, 170, 1000, 200, {
        fontFamily: "DM Serif Display", fontSize: 64,
        color: "#ffffff", lineHeight: 1.1, anim: "slideInLeft", delay: 0.2,
      }),

      // 2 cards de proyectos con hover reveal
      ...[
        { src: PHOTOS.team,  title: "Rebrand Startup",     tag: "Branding", w: 760, x: 140  },
        { src: PHOTOS.stats, title: "Dashboard Analytics", tag: "UI/UX",    w: 760, x: 960  },
      ].flatMap((proj, i) => {
        const cy = 440;
        return [
          img(proj.src, proj.x, cy, proj.w, 420, {
            anim: "slideInUp", delay: 0.4 + i * 0.2,
            style: { borderRadius: 20 },
          }),
          // Overlay gradient abajo
          box(proj.x, cy + 240, proj.w, 180, "rgba(0,0,0,0.85)", {
            radius: 20, zIndex: 3,
          }),
          // Tag
          box(proj.x + 20, cy + 20, 100, 30, "rgba(0,0,0,0.6)", { radius: 15, zIndex: 4 }),
          txt(proj.tag, proj.x + 28, cy + 24, 84, 22, {
            fontSize: 12, fontWeight: 600, color: "#ffffff", zIndex: 5,
          }),
          // Título
          txt(proj.title, proj.x + 24, cy + 350, proj.w - 48, 50, {
            fontSize: 22, fontWeight: 700, color: "#ffffff",
            zIndex: 4, anim: "fadeIn", delay: 0.6 + i * 0.2,
          }),
          // Hover interactivo en card
          box(proj.x, cy, proj.w, 420, "transparent", {
            radius: 20, zIndex: 5,
            interactions: [{ type: "hover-glow", params: { color: "rgba(99,102,241,0.3)" } }],
          }),
        ];
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 4 — MÉTRICAS & TESTIMONIOS
  // Números animados + cita de cliente. Transición iris
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Resultados",
    worldTransform: { x: 7800, y: 100, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#0a0a1a",
    backgroundGradient: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 65%)",
    duration: 5,
    transition: { type: "iris", duration: 1.0, easing: "power2.inOut", params: {} },
    elements: [
      box(140, 100, 120, 36, "rgba(251,191,36,0.15)", { radius: 18 }),
      txt("RESULTADOS", 152, 104, 110, 28, {
        fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: 2, anim: "fadeIn",
      }),

      txt("Numeros que\nhablan solos", 140, 170, 900, 200, {
        fontFamily: "DM Serif Display", fontSize: 64,
        color: "#ffffff", lineHeight: 1.1, anim: "slideInLeft", delay: 0.2,
      }),

      // 4 métricas en fila — FIX: coordenada Y correcta (era un arrow function bug)
      ...[
        { number: "150+",  label: "Proyectos",    color: "#818cf8" },
        { number: "98%",   label: "Satisfaccion",  color: "#22c55e" },
        { number: "12x",   label: "ROI promedio",  color: "#f59e0b" },
        { number: "40+",   label: "Paises",        color: "#ec4899" },
      ].flatMap((m, i) => {
        const cx = 140 + i * 420;
        const metricY = 430;
        return [
          box(cx, metricY, 380, 160, "rgba(255,255,255,0.04)", {
            radius: 20, anim: "slideInUp", delay: 0.3 + i * 0.12, zIndex: 2,
            interactions: [{ type: "hover-glow", params: { color: `${m.color}33` } }],
          }),
          txt(m.number, cx + 30, metricY + 25, 320, 80, {
            fontFamily: "Bebas Neue", fontSize: 68,
            color: m.color, zIndex: 3, anim: "cinematicZoom", delay: 0.5 + i * 0.12,
          }),
          txt(m.label, cx + 30, metricY + 105, 320, 35, {
            fontSize: 16, fontWeight: 400,
            color: "rgba(255,255,255,0.60)", zIndex: 3, anim: "fadeIn", delay: 0.6 + i * 0.12,
          }),
        ];
      }),

      // Testimonio de cliente
      box(140, 650, 1640, 200, "rgba(255,255,255,0.04)", {
        radius: 20, anim: "fadeIn", delay: 1.2, zIndex: 2,
      }),
      txt("\"Trabajar con esta agencia transformo completamente nuestra presencia digital. En 3 meses aumentamos nuestras conversiones un 340%.\"", 240, 680, 1400, 80, {
        fontSize: 20, fontWeight: 300, color: "rgba(255,255,255,0.85)",
        lineHeight: 1.6, zIndex: 3, anim: "fadeIn", delay: 1.3,
      }),
      txt("— Maria Garcia, CEO de StartupX", 240, 780, 500, 30, {
        fontSize: 14, fontWeight: 600, color: "#a78bfa", zIndex: 3, anim: "fadeIn", delay: 1.4,
      }),
    ],
  });

  // ══════════════════════════════════════════════════════════════
  // ESCENA 5 — CONTACTO / CTA FINAL
  // Fondo con foto + overlay fuerte. Transición zoom-blur
  // ══════════════════════════════════════════════════════════════
  scenes.push({
    id: createId(),
    name: "Contacto",
    worldTransform: { x: 10400, y: -100, z: 0, rotation: 0, scale: 1 },
    backgroundColor: "#000000",
    backgroundImage: PHOTOS.contact,
    backgroundOverlay: "rgba(0,0,0,0.75)",
    duration: 7,
    transition: { type: "zoom-blur", duration: 1.2, easing: "power3.inOut", params: {} },
    elements: [
      // Fondo decorativo — círculo de luz
      el("shape", 700, 200, 600, 600, {
        type: "shape", shape: "circle",
        fill: "rgba(124,58,237,0.12)",
      } as ShapeContent, { anim: "fadeIn" }),

      txt("¿Listo para\nel siguiente nivel?", 140, 200, 1200, 260, {
        fontFamily: "DM Serif Display", fontSize: 88,
        color: "#ffffff", lineHeight: 1.0, anim: "slideInLeft", delay: 0.2,
      }),

      txt("Hablemos de tu proyecto. Sin compromisos, con ideas claras.", 140, 490, 700, 60, {
        fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.75)",
        lineHeight: 1.6, anim: "fadeIn", delay: 0.6,
      }),

      // Botón CTA principal
      box(140, 600, 280, 64, "#7c3aed", {
        radius: 32, anim: "slideInLeft", delay: 0.8, zIndex: 5,
        interactions: [{ type: "hover-glow", params: { color: "rgba(124,58,237,0.6)" } }],
      }),
      txt("Iniciar Proyecto →", 155, 616, 250, 32, {
        fontSize: 18, fontWeight: 600, color: "#ffffff",
        textAlign: "center", zIndex: 6, anim: "fadeIn", delay: 0.9,
      }),

      // Botón secundario
      box(440, 600, 200, 64, "transparent", {
        radius: 32, anim: "slideInLeft", delay: 0.85, zIndex: 5,
        interactions: [{ type: "hover-glow", params: { color: "rgba(255,255,255,0.15)" } }],
      }),
      txt("Ver Portafolio", 452, 616, 176, 32, {
        fontSize: 18, fontWeight: 400, color: "rgba(255,255,255,0.85)",
        textAlign: "center", zIndex: 6, anim: "fadeIn", delay: 0.95,
      }),

      // Info de contacto
      icn("Mail",  140, 730, 22, "rgba(255,255,255,0.5)", { anim: "fadeIn", delay: 1.1 }),
      txt("hola@agenciacreativa.com", 172, 730, 300, 22, {
        fontSize: 16, color: "rgba(255,255,255,0.6)", anim: "fadeIn", delay: 1.1,
      }),
      icn("Globe", 520, 730, 22, "rgba(255,255,255,0.5)", { anim: "fadeIn", delay: 1.2 }),
      txt("www.agenciacreativa.com", 552, 730, 300, 22, {
        fontSize: 16, color: "rgba(255,255,255,0.6)", anim: "fadeIn", delay: 1.2,
      }),
    ],
  });

  return buildPresentation("Agencia Creativa", scenes);
}
