"use client";

import { useState, useMemo, useCallback } from "react";
import * as LucideIcons from "lucide-react";
import { X, Search, ChevronDown, ChevronRight, Shapes, Image, Sparkles } from "lucide-react";
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

type TabId = "iconos" | "formas" | "fondos";

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
  preview: string; // tailwind classes for visual preview
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
    preview: "w-12 h-12 rounded-full bg-cyan-500/40 border border-cyan-400/50",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Circulo",
          content: { type: "shape", shape: "circle", fill: "rgba(6,182,212,0.35)", stroke: "#22d3ee", strokeWidth: 2 } as ShapeContent,
          transform: { x: 400, y: 280, width: 140, height: 140, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Triangulo",
    preview: "w-0 h-0 border-l-[24px] border-r-[24px] border-b-[40px] border-l-transparent border-r-transparent border-b-amber-400/60",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Triangulo",
          content: { type: "shape", shape: "triangle", fill: "rgba(251,191,36,0.4)", stroke: "#fbbf24", strokeWidth: 2 } as ShapeContent,
          transform: { x: 400, y: 280, width: 140, height: 130, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Insignia",
    preview: "w-14 h-10 rounded-full bg-rose-500/30 border-2 border-rose-400/50",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Insignia",
          content: { type: "shape", shape: "rect", fill: "rgba(244,63,94,0.25)", stroke: "#fb7185", strokeWidth: 2 } as ShapeContent,
          transform: { x: 380, y: 290, width: 200, height: 60, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
          style: { borderRadius: 999 },
        },
        z,
      ),
  },
  {
    label: "Linea horizontal",
    preview: "w-14 h-[2px] bg-white/40",
    build: (z) =>
      createBaseElement(
        {
          type: "divider",
          name: "Linea horizontal",
          content: { type: "divider", style: "solid", color: "#ffffff80", thickness: 2, direction: "horizontal" } as DividerContent,
          transform: { x: 300, y: 350, width: 300, height: 4, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Linea punteada",
    preview: "w-14 h-[2px] border-t-2 border-dashed border-white/40",
    build: (z) =>
      createBaseElement(
        {
          type: "divider",
          name: "Linea punteada",
          content: { type: "divider", style: "dashed", color: "#ffffff60", thickness: 2, direction: "horizontal" } as DividerContent,
          transform: { x: 300, y: 350, width: 300, height: 4, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
        },
        z,
      ),
  },
  {
    label: "Tarjeta oscura",
    preview: "w-14 h-10 rounded-lg bg-white/5 border border-white/10",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Tarjeta oscura",
          content: { type: "shape", shape: "rect", fill: "rgba(255,255,255,0.04)" } as ShapeContent,
          transform: { x: 300, y: 220, width: 320, height: 200, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
          style: { borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
        },
        z,
      ),
  },
  {
    label: "Tarjeta cristal",
    preview: "w-14 h-10 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm",
    build: (z) =>
      createBaseElement(
        {
          type: "shape",
          name: "Tarjeta cristal",
          content: { type: "shape", shape: "rect", fill: "rgba(255,255,255,0.08)" } as ShapeContent,
          transform: { x: 300, y: 220, width: 320, height: 200, rotation: 0, scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5, opacity: 1 },
          style: { borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" },
        },
        z,
      ),
  },
];

// ---------------------------------------------------------------------------
// Background pattern presets
// ---------------------------------------------------------------------------

interface BgPattern {
  label: string;
  css: string; // CSS gradient string to apply as backgroundGradient
  preview: string; // tailwind or inline style for preview swatch
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MediaLibraryPanel({ onClose }: Props) {
  const [tab, setTab] = useState<TabId>("iconos");
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [flashedItem, setFlashedItem] = useState<string | null>(null);

  const activeSceneId = useCinemaEditorStore((s) => s.activeSceneId);

  // --------------------------------------------------
  // Filtered icon categories
  // --------------------------------------------------
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ICON_CATEGORIES;
    return ICON_CATEGORIES.map((cat) => ({
      ...cat,
      icons: cat.icons.filter((name) => name.toLowerCase().includes(q)),
    })).filter((cat) => cat.icons.length > 0);
  }, [searchQuery]);

  // --------------------------------------------------
  // Toggle category collapse
  // --------------------------------------------------
  const toggleCategory = useCallback((name: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // --------------------------------------------------
  // Flash feedback
  // --------------------------------------------------
  const flash = useCallback((key: string) => {
    setFlashedItem(key);
    setTimeout(() => setFlashedItem(null), 400);
  }, []);

  // --------------------------------------------------
  // Get current scene helper
  // --------------------------------------------------
  const getScene = useCallback(() => {
    if (!activeSceneId) return null;
    const { presentation } = usePresentationStore.getState();
    return presentation.scenes.find((s) => s.id === activeSceneId) ?? null;
  }, [activeSceneId]);

  // --------------------------------------------------
  // Add icon element to scene
  // --------------------------------------------------
  const addIconToScene = useCallback(
    (iconName: string) => {
      const scene = getScene();
      if (!scene || !activeSceneId) return;

      const newElement = createBaseElement(
        {
          type: "icon",
          name: iconName,
          content: {
            type: "icon",
            iconName,
            color: "#ffffff",
            strokeWidth: 2,
            filled: false,
          } as IconContent,
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

  // --------------------------------------------------
  // Add shape element to scene
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Apply background pattern to scene
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Tabs definition
  // --------------------------------------------------
  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "iconos", label: "Iconos", icon: <Sparkles size={14} /> },
    { id: "formas", label: "Formas", icon: <Shapes size={14} /> },
    { id: "fondos", label: "Fondos", icon: <Image size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#12121f] border border-white/10 rounded-xl w-[680px] max-h-[82vh] flex flex-col overflow-hidden shadow-2xl">
        {/* --------- Header --------- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h2 className="text-white font-semibold text-sm">Biblioteca de Medios</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* --------- Tab bar --------- */}
        <div className="flex gap-1 px-6 pt-3 shrink-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearchQuery(""); }}
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

        {/* --------- Search (icons tab only) --------- */}
        {tab === "iconos" && (
          <div className="px-6 pt-3 shrink-0">
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
          </div>
        )}

        {/* --------- No active scene warning --------- */}
        {!activeSceneId && (
          <div className="px-6 py-4">
            <p className="text-amber-400/70 text-xs">Selecciona una escena primero para agregar elementos.</p>
          </div>
        )}

        {/* --------- Content area --------- */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {/* ======================== ICONOS ======================== */}
          {tab === "iconos" && (
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
                              {/* Tooltip */}
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
          )}

          {/* ======================== FORMAS ======================== */}
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

          {/* ======================== FONDOS ======================== */}
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
                    className={`group flex flex-col items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
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

        {/* --------- Footer --------- */}
        <div className="px-6 py-3 border-t border-white/5 shrink-0">
          <p className="text-white/15 text-[10px] text-center">
            Haz clic en un elemento para agregarlo a la escena activa.
          </p>
        </div>
      </div>
    </div>
  );
}
