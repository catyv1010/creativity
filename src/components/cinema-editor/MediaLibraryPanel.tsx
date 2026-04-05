"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import {
  X, Search, ChevronDown, ChevronRight, Shapes, Image, Sparkles,
  Camera, Clapperboard, Upload, ExternalLink, Loader2, AlertCircle,
} from "lucide-react";
import { ICON_CATEGORIES } from "@/lib/icon-library";
import { usePresentationStore } from "@/store/presentationStore";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import { createId } from "@/lib/id";
import type { SceneElement, IconContent, ShapeContent, DividerContent } from "@/core/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  onClose: () => void;
}

type TabId = "fotos" | "gifs" | "iconos" | "formas" | "fondos";

interface PhotoResult {
  id: string;
  url: string;
  thumb: string;
  author: string;
  authorUrl: string;
}

interface GifResult {
  id: string;
  title: string;
  url: string;
  preview: string;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function IconPreview({ name, size = 24, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const Icon = (LucideIcons as Record<string, any>)[name];
  if (!Icon || typeof Icon !== "function") return null;
  return <Icon size={size} color={color} />;
}

function createBaseElement(overrides: Partial<SceneElement> & Pick<SceneElement, "type" | "name" | "content">, zIndex: number): SceneElement {
  return {
    id: createId(),
    type: overrides.type,
    name: overrides.name,
    transform: {
      x: 400,
      y: 300,
      width: 80,
      height: 80,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      originX: 0.5,
      originY: 0.5,
      opacity: 1,
      ...overrides.transform,
    },
    style: overrides.style ?? {},
    content: overrides.content,
    animations: [],
    depthLayer: 0,
    locked: false,
    visible: true,
    zIndex,
  };
}

// ---------------------------------------------------------------------------
// Shape presets
// ---------------------------------------------------------------------------

interface ShapePreset {
  label: string;
  preview: string;
  build: (z: number) => SceneElement;
}

const SHAPE_PRESETS: ShapePreset[] = [
  {
    label: "Rectangulo",
    preview: "w-14 h-10 rounded-md bg-purple-500/40 border border-purple-400/50",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Rectangulo",
          content: { type: "shape", shape: "rect", fill: "rgba(139,92,246,0.35)", stroke: "#a78bfa", strokeWidth: 2 } as ShapeContent,
          transform: { x: 350, y: 250, width: 220, height: 140, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Circulo",
    preview: "w-12 h-12 rounded-full bg-cyan-500/30 border border-cyan-400/50",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Circulo",
          content: { type: "shape", shape: "circle", fill: "rgba(6,182,212,0.3)", stroke: "#22d3ee", strokeWidth: 2 } as ShapeContent,
          transform: { x: 420, y: 300, width: 160, height: 160, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Triangulo",
    preview: "w-0 h-0 border-l-[24px] border-r-[24px] border-b-[40px] border-l-transparent border-r-transparent border-b-pink-500/60",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Triangulo",
          content: { type: "shape", shape: "triangle", fill: "rgba(236,72,153,0.4)", stroke: "#f472b6", strokeWidth: 2 } as ShapeContent,
          transform: { x: 420, y: 280, width: 160, height: 140, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Linea H",
    preview: "w-14 h-0.5 bg-white/60",
    build: (z) =>
      createBaseElement(
        {
          type: "divider",
          name: "Linea",
          content: { type: "divider", direction: "horizontal", thickness: 2, style: "solid", color: "rgba(255,255,255,0.5)" } as DividerContent,
          transform: { x: 200, y: 500, width: 600, height: 2, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Linea V",
    preview: "w-0.5 h-14 bg-white/60",
    build: (z) =>
      createBaseElement(
        {
          type: "divider",
          name: "Linea V",
          content: { type: "divider", direction: "vertical", thickness: 2, style: "solid", color: "rgba(255,255,255,0.5)" } as DividerContent,
          transform: { x: 950, y: 100, width: 2, height: 600, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Gradiente",
    preview: "w-14 h-10 rounded-md bg-gradient-to-r from-purple-500/50 to-pink-500/50",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Gradiente",
          content: { type: "shape", shape: "rect", fill: "linear-gradient(135deg,rgba(139,92,246,0.5),rgba(236,72,153,0.5))", stroke: "transparent", strokeWidth: 0 } as ShapeContent,
          style: { borderRadius: 12 },
          transform: { x: 200, y: 200, width: 400, height: 250, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Card",
    preview: "w-14 h-10 rounded-lg bg-white/5 border border-white/10",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Card",
          content: { type: "shape", shape: "rect", fill: "rgba(255,255,255,0.04)", stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 } as ShapeContent,
          style: { borderRadius: 16, backdropFilter: "blur(20px)" },
          transform: { x: 200, y: 200, width: 500, height: 300, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Badge",
    preview: "w-14 h-6 rounded-full bg-purple-500/40 border border-purple-400/50",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Badge",
          content: { type: "shape", shape: "rect", fill: "rgba(139,92,246,0.2)", stroke: "rgba(167,139,250,0.4)", strokeWidth: 1 } as ShapeContent,
          style: { borderRadius: 999 },
          transform: { x: 600, y: 150, width: 180, height: 44, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
];

// ---------------------------------------------------------------------------
// Background patterns
// ---------------------------------------------------------------------------

interface BgPattern {
  label: string;
  css: string;
  preview: string;
}

const BG_PATTERNS: BgPattern[] = [
  {
    label: "Puntos",
    css: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
    preview: "bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:12px_12px]",
  },
  {
    label: "Cuadricula",
    css: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    preview: "bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:14px_14px]",
  },
  {
    label: "Diagonales",
    css: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.04) 10px, rgba(255,255,255,0.04) 11px)",
    preview: "bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(255,255,255,0.12)_6px,rgba(255,255,255,0.12)_7px)]",
  },
  {
    label: "Gradiente azul",
    css: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
    preview: "bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a]",
  },
  {
    label: "Gradiente purpura",
    css: "linear-gradient(135deg, #1a0533 0%, #4c1d95 50%, #1a0533 100%)",
    preview: "bg-gradient-to-br from-[#1a0533] via-[#4c1d95] to-[#1a0533]",
  },
  {
    label: "Gradiente esmeralda",
    css: "linear-gradient(135deg, #022c22 0%, #065f46 50%, #022c22 100%)",
    preview: "bg-gradient-to-br from-[#022c22] via-[#065f46] to-[#022c22]",
  },
  {
    label: "Gradiente rojo oscuro",
    css: "linear-gradient(135deg, #1c0a0a 0%, #7f1d1d 50%, #1c0a0a 100%)",
    preview: "bg-gradient-to-br from-[#1c0a0a] via-[#7f1d1d] to-[#1c0a0a]",
  },
  {
    label: "Aurora",
    css: "linear-gradient(135deg, #0c0a1a 0%, #1e1b4b 30%, #312e81 50%, #1e3a5f 70%, #0c0a1a 100%)",
    preview: "bg-gradient-to-br from-[#0c0a1a] via-[#312e81] to-[#1e3a5f]",
  },
  {
    label: "Atardecer",
    css: "linear-gradient(135deg, #1a0a2e 0%, #831843 40%, #c2410c 70%, #1a0a2e 100%)",
    preview: "bg-gradient-to-br from-[#1a0a2e] via-[#831843] to-[#c2410c]",
  },
  {
    label: "Negro puro",
    css: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)",
    preview: "bg-black",
  },
];

// Photo category seeds for Picsum
const PHOTO_CATEGORIES = [
  { label: "Explorar", seed: null },
  { label: "Naturaleza", seed: "nature" },
  { label: "Negocios", seed: "business" },
  { label: "Tecnología", seed: "tech" },
  { label: "Ciudad", seed: "city" },
  { label: "Abstracto", seed: "abstract" },
  { label: "Personas", seed: "people" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MediaLibraryPanel({ onClose }: Props) {
  const [tab, setTab] = useState<TabId>("fotos");
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [flashedItem, setFlashedItem] = useState<string | null>(null);

  // Photos state
  const [photos, setPhotos] = useState<PhotoResult[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosPage, setPhotosPage] = useState(1);
  const [photoCategory, setPhotoCategory] = useState<string | null>(null);
  const photoSearchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // GIFs state
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [gifsLoading, setGifsLoading] = useState(false);
  const [gifsNeedsKey, setGifsNeedsKey] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const gifSearchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSceneId = useCinemaEditorStore((s) => s.activeSceneId);

  // ── Load photos ─────────────────────────────────────────────────────────
  const loadPhotos = useCallback(async (q: string, seed: string | null, page: number) => {
    setPhotosLoading(true);
    try {
      let url: string;
      if (q.trim()) {
        url = `/api/media/photos?q=${encodeURIComponent(q)}&limit=20&page=${page}`;
      } else if (seed) {
        // Picsum seeded — generate 20 deterministic images for this category
        const items: PhotoResult[] = Array.from({ length: 20 }, (_, i) => ({
          id: `${seed}-${i + 1 + (page - 1) * 20}`,
          url: `https://picsum.photos/seed/${seed}${i + 1 + (page - 1) * 20}/1200/800`,
          thumb: `https://picsum.photos/seed/${seed}${i + 1 + (page - 1) * 20}/400/250`,
          author: "Picsum",
          authorUrl: "https://picsum.photos",
        }));
        setPhotos(items);
        setPhotosLoading(false);
        return;
      } else {
        url = `/api/media/photos?limit=20&page=${page}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setPhotos(data.results ?? []);
    } catch {
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  }, []);

  // ── Load GIFs ────────────────────────────────────────────────────────────
  const loadGifs = useCallback(async (q: string) => {
    setGifsLoading(true);
    try {
      const query = q.trim() || "__trending__";
      const res = await fetch(`/api/media/gifs?q=${encodeURIComponent(query)}&limit=20`);
      const data = await res.json();
      if (data.needsKey) {
        setGifsNeedsKey(true);
        setGifs([]);
      } else {
        setGifsNeedsKey(false);
        setGifs(data.results ?? []);
      }
    } catch {
      setGifs([]);
    } finally {
      setGifsLoading(false);
    }
  }, []);

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tab === "fotos") {
      loadPhotos("", photoCategory, photosPage);
    }
  }, [tab, photoCategory, photosPage]);

  useEffect(() => {
    if (tab === "fotos" && searchQuery.trim()) {
      if (photoSearchDebounce.current) clearTimeout(photoSearchDebounce.current);
      photoSearchDebounce.current = setTimeout(() => {
        loadPhotos(searchQuery, null, 1);
      }, 500);
    }
  }, [searchQuery, tab]);

  useEffect(() => {
    if (tab === "gifs") {
      loadGifs(gifQuery);
    }
  }, [tab]);

  // ── Filtered icons ───────────────────────────────────────────────────────
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ICON_CATEGORIES;
    return ICON_CATEGORIES.map((cat) => ({
      ...cat,
      icons: cat.icons.filter((name) => name.toLowerCase().includes(q)),
    })).filter((cat) => cat.icons.length > 0);
  }, [searchQuery]);

  const toggleCategory = useCallback((name: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const flash = useCallback((key: string) => {
    setFlashedItem(key);
    setTimeout(() => setFlashedItem(null), 400);
  }, []);

  const getScene = useCallback(() => {
    if (!activeSceneId) return null;
    const { presentation } = usePresentationStore.getState();
    return presentation.scenes.find((s) => s.id === activeSceneId) ?? null;
  }, [activeSceneId]);

  // ── Add image/gif to scene ───────────────────────────────────────────────
  const addImageToScene = useCallback(
    (url: string, label: string, isGif = false) => {
      const scene = getScene();
      if (!scene || !activeSceneId) return;
      const el = createBaseElement(
        {
          type: "image",
          name: label,
          content: { type: "image", src: url, alt: label, objectFit: "cover" },
          transform: { x: 200, y: 150, width: isGif ? 400 : 600, height: isGif ? 300 : 400, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        scene.elements.length,
      );
      usePresentationStore.getState().updateScene(activeSceneId, {
        elements: [...scene.elements, el],
      } as any);
      flash(`img-${url}`);
    },
    [activeSceneId, getScene, flash],
  );

  // ── Add icon to scene ────────────────────────────────────────────────────
  const addIconToScene = useCallback(
    (iconName: string) => {
      const scene = getScene();
      if (!scene || !activeSceneId) return;
      const newElement = createBaseElement(
        {
          type: "icon",
          name: iconName,
          content: { type: "icon", iconName, color: "#ffffff", strokeWidth: 2, filled: false } as IconContent,
        },
        scene.elements.length,
      );
      usePresentationStore.getState().updateScene(activeSceneId, {
        elements: [...scene.elements, newElement],
      } as any);
      flash(`icon-${iconName}`);
    },
    [activeSceneId, getScene, flash],
  );

  // ── Add shape to scene ───────────────────────────────────────────────────
  const addShapeToScene = useCallback(
    (preset: ShapePreset) => {
      const scene = getScene();
      if (!scene || !activeSceneId) return;
      const newElement = preset.build(scene.elements.length);
      usePresentationStore.getState().updateScene(activeSceneId, {
        elements: [...scene.elements, newElement],
      } as any);
      flash(`shape-${preset.label}`);
    },
    [activeSceneId, getScene, flash],
  );

  // ── Apply background ─────────────────────────────────────────────────────
  const applyBackground = useCallback(
    (pattern: BgPattern) => {
      if (!activeSceneId) return;
      usePresentationStore.getState().updateScene(activeSceneId, {
        backgroundGradient: pattern.css,
      });
      flash(`bg-${pattern.label}`);
    },
    [activeSceneId, flash],
  );

  // ── Tabs definition ──────────────────────────────────────────────────────
  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "fotos", label: "Fotos", icon: <Camera size={13} /> },
    { id: "gifs", label: "GIFs", icon: <Clapperboard size={13} /> },
    { id: "iconos", label: "Iconos", icon: <Sparkles size={13} /> },
    { id: "formas", label: "Formas", icon: <Shapes size={13} /> },
    { id: "fondos", label: "Fondos", icon: <Image size={13} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#12121f] border border-white/10 rounded-xl w-[780px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h2 className="text-white font-semibold text-sm">Biblioteca de Medios</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 px-6 pt-3 shrink-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setSearchQuery("");
                setGifQuery("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                tab === t.id
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* No active scene warning */}
        {!activeSceneId && (
          <div className="px-6 pt-3">
            <p className="text-amber-400/70 text-xs bg-amber-400/5 border border-amber-400/10 rounded-md px-3 py-2">
              Selecciona una escena primero para agregar elementos.
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ minHeight: 0 }}>

          {/* ═══════════════ FOTOS ═══════════════ */}
          {tab === "fotos" && (
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  placeholder="Buscar fotos... (ej: mountains, office, abstract)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPhotoCategory(null);
                  }}
                  className="w-full bg-white/5 border border-white/5 rounded-md pl-9 pr-3 py-2 text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-purple-500/40"
                />
              </div>

              {/* Category pills */}
              {!searchQuery.trim() && (
                <div className="flex gap-2 flex-wrap">
                  {PHOTO_CATEGORIES.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => { setPhotoCategory(cat.seed); setPhotosPage(1); }}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        photoCategory === cat.seed
                          ? "bg-purple-600 text-white"
                          : "bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Photo grid */}
              {photosLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={24} className="animate-spin text-purple-400/60" />
                </div>
              ) : photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-white/20 gap-2">
                  <Camera size={32} />
                  <p className="text-xs">No se encontraron fotos</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((photo) => {
                    const isFlashed = flashedItem === `img-${photo.url}`;
                    return (
                      <button
                        key={photo.id}
                        onClick={() => addImageToScene(photo.url, "Foto")}
                        disabled={!activeSceneId}
                        className={`group relative rounded-lg overflow-hidden aspect-video cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
                          isFlashed ? "ring-2 ring-purple-400" : "hover:ring-2 hover:ring-white/20"
                        }`}
                        title={`Foto de ${photo.author}`}
                      >
                        <img
                          src={photo.thumb}
                          alt={photo.author}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                            + Agregar
                          </span>
                        </div>
                        {isFlashed && (
                          <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {!searchQuery.trim() && photos.length > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => setPhotosPage((p) => Math.max(1, p - 1))}
                    disabled={photosPage === 1}
                    className="px-3 py-1.5 rounded-md text-xs text-white/40 hover:text-white/70 hover:bg-white/5 disabled:opacity-20 cursor-pointer transition-colors"
                  >
                    ← Anterior
                  </button>
                  <span className="text-white/20 text-xs">Página {photosPage}</span>
                  <button
                    onClick={() => setPhotosPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-md text-xs text-white/40 hover:text-white/70 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    Siguiente →
                  </button>
                </div>
              )}

              {/* Credit */}
              <p className="text-white/15 text-[10px] text-center pt-1">
                Fotos de{" "}
                <a href="https://picsum.photos" target="_blank" rel="noopener" className="underline hover:text-white/30">
                  Picsum Photos
                </a>{" "}
                · Agrega{" "}
                <span className="text-white/25">UNSPLASH_ACCESS_KEY</span>
                {" "}en Vercel para búsqueda real
              </p>
            </div>
          )}

          {/* ═══════════════ GIFs ═══════════════ */}
          {tab === "gifs" && (
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  placeholder="Buscar GIFs... (ej: celebration, funny, wow)"
                  value={gifQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGifQuery(val);
                    if (gifSearchDebounce.current) clearTimeout(gifSearchDebounce.current);
                    gifSearchDebounce.current = setTimeout(() => loadGifs(val), 500);
                  }}
                  className="w-full bg-white/5 border border-white/5 rounded-md pl-9 pr-3 py-2 text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-purple-500/40"
                />
              </div>

              {/* Needs API key */}
              {gifsNeedsKey && (
                <div className="flex flex-col gap-3 items-center justify-center py-10">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <AlertCircle size={20} className="text-amber-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-sm font-medium mb-1">Necesitas una API key de Giphy</p>
                    <p className="text-white/30 text-xs max-w-xs">Es gratis y tarda 2 minutos en obtenerla</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-sm">
                    <div className="bg-white/3 border border-white/5 rounded-lg p-3 text-[11px] text-white/40 space-y-1">
                      <p>1. Ve a <a href="https://developers.giphy.com" target="_blank" rel="noopener" className="text-purple-400 underline">developers.giphy.com</a></p>
                      <p>2. Crea una app gratuita → copia tu API Key</p>
                      <p>3. En Vercel → Settings → Environment Variables</p>
                      <p>4. Agrega <code className="text-cyan-400/70 bg-white/5 px-1 rounded">GIPHY_API_KEY</code> = tu key</p>
                      <p>5. Redeploy y listo 🎉</p>
                    </div>
                    <a
                      href="https://developers.giphy.com/dashboard/?create=true"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                    >
                      <ExternalLink size={12} />
                      Obtener API key gratis
                    </a>
                  </div>
                </div>
              )}

              {/* Loading */}
              {gifsLoading && !gifsNeedsKey && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={24} className="animate-spin text-purple-400/60" />
                </div>
              )}

              {/* GIF grid */}
              {!gifsLoading && !gifsNeedsKey && gifs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-white/20 gap-2">
                  <Clapperboard size={32} />
                  <p className="text-xs">No se encontraron GIFs</p>
                </div>
              )}

              {!gifsNeedsKey && gifs.length > 0 && (
                <div className="columns-3 gap-2 space-y-2">
                  {gifs.map((gif) => {
                    const isFlashed = flashedItem === `img-${gif.url}`;
                    return (
                      <button
                        key={gif.id}
                        onClick={() => addImageToScene(gif.url, gif.title || "GIF", true)}
                        disabled={!activeSceneId}
                        className={`group relative w-full rounded-lg overflow-hidden cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all block ${
                          isFlashed ? "ring-2 ring-purple-400" : "hover:ring-2 hover:ring-white/20"
                        }`}
                        title={gif.title}
                      >
                        <img
                          src={gif.url}
                          alt={gif.title}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end justify-start p-2">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-medium bg-black/60 px-2 py-0.5 rounded">
                            + Agregar
                          </span>
                        </div>
                        {isFlashed && (
                          <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {!gifsNeedsKey && (
                <p className="text-white/15 text-[10px] text-center pt-1">
                  GIFs de Giphy · Solo para uso personal/desarrollo
                </p>
              )}
            </div>
          )}

          {/* ═══════════════ ICONOS ═══════════════ */}
          {tab === "iconos" && (
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  placeholder="Buscar icono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-md pl-9 pr-3 py-2 text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-purple-500/40"
                />
              </div>
              <div className="space-y-3">
                {filteredCategories.length === 0 && (
                  <p className="text-white/20 text-xs text-center py-8">Sin resultados para &ldquo;{searchQuery}&rdquo;</p>
                )}
                {filteredCategories.map((cat) => {
                  const isCollapsed = collapsedCategories.has(cat.name);
                  return (
                    <div key={cat.name}>
                      <button
                        onClick={() => toggleCategory(cat.name)}
                        className="flex items-center gap-1.5 text-white/50 hover:text-white/70 text-[11px] font-medium uppercase tracking-wider mb-2 cursor-pointer"
                      >
                        {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                        {cat.name}
                        <span className="text-white/20 ml-1">({cat.icons.length})</span>
                      </button>
                      {!isCollapsed && (
                        <div className="grid grid-cols-8 gap-1.5 mb-2">
                          {cat.icons.map((iconName) => {
                            const key = `icon-${iconName}`;
                            const isFlashed = flashedItem === key;
                            return (
                              <button
                                key={iconName}
                                title={iconName}
                                onClick={() => addIconToScene(iconName)}
                                disabled={!activeSceneId}
                                className={`group relative aspect-square rounded-md flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                                  isFlashed
                                    ? "bg-purple-500/30 ring-1 ring-purple-400/50"
                                    : "bg-white/[0.03] hover:bg-white/[0.08] border border-transparent hover:border-white/10"
                                }`}
                              >
                                <IconPreview name={iconName} size={20} color="rgba(255,255,255,0.6)" />
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] text-white/60 bg-black/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                  {iconName}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════ FORMAS ═══════════════ */}
          {tab === "formas" && (
            <div className="grid grid-cols-4 gap-3">
              {SHAPE_PRESETS.map((preset) => {
                const key = `shape-${preset.label}`;
                const isFlashed = flashedItem === key;
                return (
                  <button
                    key={preset.label}
                    onClick={() => addShapeToScene(preset)}
                    disabled={!activeSceneId}
                    className={`group flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      isFlashed
                        ? "bg-purple-500/20 ring-1 ring-purple-400/40"
                        : "bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="w-full h-14 rounded-md bg-white/[0.03] flex items-center justify-center">
                      <div className={preset.preview} />
                    </div>
                    <span className="text-white/50 text-[10px] font-medium group-hover:text-white/70 transition-colors">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ═══════════════ FONDOS ═══════════════ */}
          {tab === "fondos" && (
            <div className="grid grid-cols-5 gap-3">
              {BG_PATTERNS.map((pattern) => {
                const key = `bg-${pattern.label}`;
                const isFlashed = flashedItem === key;
                return (
                  <button
                    key={pattern.label}
                    onClick={() => applyBackground(pattern)}
                    disabled={!activeSceneId}
                    className="group flex flex-col items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <div
                      className={`w-full aspect-[16/10] rounded-lg border transition-all ${
                        isFlashed
                          ? "ring-2 ring-purple-400/60 border-purple-400/40"
                          : "border-white/5 hover:border-white/15 group-hover:scale-[1.04]"
                      } ${pattern.preview} bg-[#0a0a14]`}
                    />
                    <span className="text-white/40 text-[10px] font-medium group-hover:text-white/60 transition-colors">
                      {pattern.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/5 shrink-0 flex items-center justify-between">
          <p className="text-white/15 text-[10px]">
            Haz clic para agregar a la escena activa
          </p>
          {(tab === "fotos") && (
            <label className="flex items-center gap-1.5 text-white/25 hover:text-white/50 text-[10px] cursor-pointer transition-colors">
              <Upload size={10} />
              Subir desde computadora
              <input
                type="file"
                accept="image/*,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file || !activeSceneId) return;
                  const reader = new FileReader();
                  reader.onload = () => addImageToScene(reader.result as string, file.name, file.type === "image/gif");
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
