"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import { usePresentationStore } from "@/store/presentationStore";
import type { SceneElement, TextContent } from "@/core/types";
import InlineTextEditor from "./InlineTextEditor";

const SCENE_W = 1920;
const SCENE_H = 1080;

/**
 * CinemaCanvas — Canva-style focused editor.
 * The scene is ALWAYS centered. No infinite canvas.
 * Zoom scales the scene in place. No free-roaming pan.
 */
export default function CinemaCanvas() {
  const { activeSceneId, viewport, setViewport, tool, selectedElementIds, setSelection, clearSelection } =
    useCinemaEditorStore();
  const { presentation, updateElement, deleteElement } = usePresentationStore();
  const scene = presentation.scenes.find((s) => s.id === activeSceneId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const dragRef = useRef<{
    elementId: string;
    startX: number;
    startY: number;
    elX: number;
    elY: number;
  } | null>(null);
  const resizeRef = useRef<{
    elementId: string;
    handle: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    elX: number;
    elY: number;
  } | null>(null);

  // Auto-fit zoom on mount, scene change, and presentation load
  useEffect(() => {
    // Small delay to ensure DOM is ready after template load
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container || !scene) return;

      const rect = container.getBoundingClientRect();
      const padding = 60;
      const fitZoom = Math.min(
        (rect.width - padding * 2) / SCENE_W,
        (rect.height - padding * 2) / SCENE_H,
        1
      );
      setViewport({ zoom: fitZoom });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeSceneId, presentation.id]);

  // Zoom only (no pan) — Ctrl+scroll or pinch
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.03 : 0.03;
        setViewport({ zoom: Math.max(0.15, Math.min(1.5, viewport.zoom + delta)) });
      }
      // No free scroll — the scene stays put
    },
    [viewport.zoom, setViewport]
  );

  // Fit to view
  const fitToView = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const padding = 60;
    const fitZoom = Math.min(
      (rect.width - padding * 2) / SCENE_W,
      (rect.height - padding * 2) / SCENE_H,
      1
    );
    setViewport({ zoom: fitZoom });
  }, [setViewport]);

  // --- Double-click to edit text ---
  const onElementDoubleClick = useCallback(
    (e: React.MouseEvent, element: SceneElement) => {
      e.stopPropagation();
      if (element.type === "text" && !element.locked) {
        setEditingElementId(element.id);
      }
    },
    []
  );

  // Exit text editing when clicking outside or switching scenes
  useEffect(() => {
    setEditingElementId(null);
  }, [activeSceneId]);

  // Delete selected elements with Delete/Backspace key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't delete when typing in an input or text editor
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.contentEditable === "true") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementIds.length > 0 && activeSceneId) {
        e.preventDefault();
        for (const id of selectedElementIds) {
          deleteElement(activeSceneId, id);
        }
        clearSelection();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedElementIds, activeSceneId, deleteElement, clearSelection]);

  // --- Element drag ---
  const onElementDragStart = useCallback(
    (e: React.PointerEvent, element: SceneElement) => {
      if (tool !== "select" || element.locked || editingElementId === element.id) return;
      e.stopPropagation();
      setSelection([element.id]);

      dragRef.current = {
        elementId: element.id,
        startX: e.clientX,
        startY: e.clientY,
        elX: element.transform.x,
        elY: element.transform.y,
      };

      const onMove = (ev: PointerEvent) => {
        if (!dragRef.current || !activeSceneId || !scene) return;
        const dx = (ev.clientX - dragRef.current.startX) / viewport.zoom;
        const dy = (ev.clientY - dragRef.current.startY) / viewport.zoom;
        const el = scene.elements.find((el) => el.id === dragRef.current!.elementId);
        if (!el) return;
        updateElement(activeSceneId, dragRef.current.elementId, {
          transform: {
            ...el.transform,
            x: Math.round(dragRef.current.elX + dx),
            y: Math.round(dragRef.current.elY + dy),
          },
        });
      };
      const onUp = () => {
        dragRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [tool, viewport.zoom, activeSceneId, scene, setSelection, updateElement]
  );

  // --- Element resize ---
  const onResizeStart = useCallback(
    (e: React.PointerEvent, element: SceneElement, handle: string) => {
      e.stopPropagation();
      e.preventDefault();

      resizeRef.current = {
        elementId: element.id,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startW: element.transform.width,
        startH: element.transform.height,
        elX: element.transform.x,
        elY: element.transform.y,
      };

      const onMove = (ev: PointerEvent) => {
        if (!resizeRef.current || !activeSceneId || !scene) return;
        const r = resizeRef.current;
        const dx = (ev.clientX - r.startX) / viewport.zoom;
        const dy = (ev.clientY - r.startY) / viewport.zoom;

        let newW = r.startW, newH = r.startH, newX = r.elX, newY = r.elY;
        if (r.handle.includes("e")) newW = Math.max(20, r.startW + dx);
        if (r.handle.includes("w")) { newW = Math.max(20, r.startW - dx); newX = r.elX + dx; }
        if (r.handle.includes("s")) newH = Math.max(20, r.startH + dy);
        if (r.handle.includes("n")) { newH = Math.max(20, r.startH - dy); newY = r.elY + dy; }

        const el = scene.elements.find((e) => e.id === r.elementId);
        if (!el) return;
        updateElement(activeSceneId, r.elementId, {
          transform: {
            ...el.transform,
            width: Math.round(newW),
            height: Math.round(newH),
            x: Math.round(newX),
            y: Math.round(newY),
          },
        });
      };
      const onUp = () => {
        resizeRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [viewport.zoom, activeSceneId, scene, updateElement]
  );

  // --- Canvas click (deselect) ---
  const onCanvasClick = useCallback(
    (e: React.PointerEvent) => {
      if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvas) {
        clearSelection();
        setEditingElementId(null);
      }
    },
    [clearSelection]
  );

  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1a1a2e]">
        <p className="text-white/20 text-sm">Selecciona o crea una escena</p>
      </div>
    );
  }

  const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  const handlePos: Record<string, string> = {
    nw: "-top-1.5 -left-1.5 cursor-nw-resize",
    n: "-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize",
    ne: "-top-1.5 -right-1.5 cursor-ne-resize",
    e: "top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize",
    se: "-bottom-1.5 -right-1.5 cursor-se-resize",
    s: "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize",
    sw: "-bottom-1.5 -left-1.5 cursor-sw-resize",
    w: "top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize",
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center relative overflow-hidden"
      style={{
        cursor: tool === "pan" ? "grab" : "default",
        background: "radial-gradient(ellipse at 50% 40%, #1e1b3a 0%, #0f0e1a 60%, #080812 100%)",
      }}
      onWheel={onWheel}
      onPointerDown={onCanvasClick}
      data-canvas="true"
    >
      {/* Fine dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Subtle vignette at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {/* Corner glow accents */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
        style={{ background: "radial-gradient(circle at top left, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: "radial-gradient(circle at bottom right, rgba(236,72,153,0.06) 0%, transparent 70%)" }} />

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {Math.round(viewport.zoom * 100)}%
        </div>
        <div className="px-2.5 py-1 rounded-md text-[11px] font-semibold"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {SCENE_W} × {SCENE_H}
        </div>
      </div>

      {/* Scene name label above canvas */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-3 py-1 rounded-full text-[11px] font-medium"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {scene.name}
        </div>
      </div>

      {/* Scene — always centered via flexbox */}
      <div
        className="relative"
        style={{
          transform: `scale(${viewport.zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Glow behind scene */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-40px",
            background: `radial-gradient(ellipse, ${scene.backgroundColor}55 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />
        {/* Hard shadow */}
        <div className="absolute -inset-4 rounded-2xl pointer-events-none"
          style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)" }} />

        {/* The actual scene */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            width: SCENE_W,
            height: SCENE_H,
            backgroundColor: scene.backgroundColor,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 0 3px rgba(0,0,0,0.3)",
            outline: "none",
          }}
        >
          {/* Background image layer */}
          {scene.backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${scene.backgroundImage})`,
                filter: scene.backgroundBlur ? `blur(${scene.backgroundBlur}px)` : undefined,
                transform: scene.backgroundBlur ? "scale(1.1)" : undefined, // prevent blur edges
              }}
            />
          )}
          {/* Background gradient/overlay layer */}
          {(scene.backgroundGradient || scene.backgroundOverlay) && (
            <div
              className="absolute inset-0"
              style={{ backgroundImage: scene.backgroundGradient || undefined, backgroundColor: scene.backgroundOverlay || undefined }}
            />
          )}
          {/* Render elements */}
          {scene.elements
            .filter((el) => el.visible)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => {
              const isSelected = selectedElementIds.includes(element.id);
              const t = element.transform;

              return (
                <div
                  key={element.id}
                  data-element-id={element.id}
                  data-depth-layer={element.depthLayer}
                  className="absolute"
                  style={{
                    left: t.x,
                    top: t.y,
                    width: t.width,
                    height: t.height,
                    transform: `rotate(${t.rotation}deg) scaleX(${t.scaleX}) scaleY(${t.scaleY})`,
                    transformOrigin: `${t.originX * 100}% ${t.originY * 100}%`,
                    opacity: t.opacity,
                    zIndex: element.zIndex,
                    cursor: tool === "select" && !element.locked ? "move" : "default",
                    backgroundColor: element.style.backgroundColor,
                    borderRadius: element.style.borderRadius,
                    border: element.style.borderWidth
                      ? `${element.style.borderWidth}px solid ${element.style.borderColor || "#000"}`
                      : undefined,
                    boxShadow: element.style.boxShadow,
                    filter: element.style.filter,
                    backdropFilter: element.style.backdropFilter,
                    clipPath: element.style.clipPath,
                    mixBlendMode: element.style.mixBlendMode as React.CSSProperties["mixBlendMode"],
                  }}
                  onPointerDown={(e) => onElementDragStart(e, element)}
                  onDoubleClick={(e) => onElementDoubleClick(e, element)}
                >
                  {/* Show inline editor or static content */}
                  {editingElementId === element.id && element.content.type === "text" ? (
                    <InlineTextEditor
                      content={element.content as TextContent}
                      zoom={viewport.zoom}
                      onChange={(html) => {
                        if (!activeSceneId) return;
                        updateElement(activeSceneId, element.id, {
                          content: { ...element.content, html } as TextContent,
                        });
                      }}
                      onBlur={() => setEditingElementId(null)}
                    />
                  ) : (
                    <ElementContent content={element.content} />
                  )}

                  {isSelected && editingElementId !== element.id && (
                    <>
                      <div className="absolute inset-0 border-2 border-purple-500 rounded-sm pointer-events-none" />
                      {handles.map((h) => (
                        <div
                          key={h}
                          className={`absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-sm ${handlePos[h]}`}
                          onPointerDown={(e) => onResizeStart(e, element, h)}
                        />
                      ))}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Zoom controls — bottom left */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 z-20">
        <button
          onClick={() => setViewport({ zoom: Math.max(0.15, viewport.zoom - 0.1) })}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          −
        </button>
        <span className="text-white/30 text-[11px] font-mono px-2 py-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button
          onClick={() => setViewport({ zoom: Math.min(1.5, viewport.zoom + 0.1) })}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          +
        </button>
        <button
          onClick={fitToView}
          className="px-3 h-7 rounded-lg text-white/30 hover:text-white/60 text-[10px] font-medium transition-colors cursor-pointer"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          Ajustar
        </button>
      </div>
    </div>
  );
}

// --- Element Content Renderer ---
function ElementContent({ content }: { content: import("@/core/types").ElementContent }) {
  switch (content.type) {
    case "text":
      return (
        <div
          className="w-full h-full whitespace-pre-wrap break-words overflow-hidden select-none"
          style={{
            fontSize: content.fontSize,
            fontWeight: content.fontWeight,
            fontFamily: content.fontFamily || "Inter, sans-serif",
            textAlign: content.textAlign,
            color: content.color,
            lineHeight: content.lineHeight || 1.3,
            letterSpacing: content.letterSpacing ? `${content.letterSpacing}px` : undefined,
          }}
        >
          {content.html}
        </div>
      );
    case "image":
      return (
        <img
          src={content.src}
          alt={content.alt}
          className="w-full h-full"
          style={{ objectFit: content.objectFit }}
          draggable={false}
        />
      );
    case "shape": {
      const shapeStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        backgroundColor: content.fill,
        border: content.stroke ? `${content.strokeWidth || 1}px solid ${content.stroke}` : undefined,
      };
      if (content.shape === "circle") shapeStyle.borderRadius = "50%";
      if (content.shape === "triangle") shapeStyle.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      return <div style={shapeStyle} />;
    }
    case "video":
      return (
        <video
          src={content.src}
          autoPlay={content.autoplay}
          loop={content.loop}
          muted={content.muted}
          className="w-full h-full object-cover"
        />
      );
    case "icon":
      return <DynamicIcon name={content.iconName} color={content.color} strokeWidth={content.strokeWidth} filled={content.filled} />;
    case "divider":
      return <DividerRenderer content={content} />;
    default:
      return null;
  }
}

// --- Dynamic Lucide Icon Renderer ---
function DynamicIcon({ name, color = "#fff", strokeWidth = 2, filled }: { name: string; color?: string; strokeWidth?: number; filled?: boolean }) {
  try {
    const allIcons = require("lucide-react");
    const Icon = allIcons[name];
    if (!Icon || typeof Icon !== "function") {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ color }}>
          <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
            <circle cx="12" cy="12" r="10" />
            <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">{name.charAt(0)}</text>
          </svg>
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Icon size={undefined} width="65%" height="65%" color={color} strokeWidth={strokeWidth} fill={filled ? color : "none"} />
      </div>
    );
  } catch {
    return <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">{name}</div>;
  }
}

// --- Divider Renderer ---
function DividerRenderer({ content }: { content: import("@/core/types").DividerContent }) {
  const isHorizontal = content.direction === "horizontal";
  const styles: Record<string, React.CSSProperties> = {
    solid: { borderTop: isHorizontal ? `${content.thickness}px solid ${content.color}` : undefined, borderLeft: !isHorizontal ? `${content.thickness}px solid ${content.color}` : undefined },
    dashed: { borderTop: isHorizontal ? `${content.thickness}px dashed ${content.color}` : undefined, borderLeft: !isHorizontal ? `${content.thickness}px dashed ${content.color}` : undefined },
    dotted: { borderTop: isHorizontal ? `${content.thickness}px dotted ${content.color}` : undefined, borderLeft: !isHorizontal ? `${content.thickness}px dotted ${content.color}` : undefined },
    gradient: { background: isHorizontal ? `linear-gradient(90deg, transparent, ${content.color}, transparent)` : `linear-gradient(180deg, transparent, ${content.color}, transparent)`, height: isHorizontal ? content.thickness : "100%", width: isHorizontal ? "100%" : content.thickness },
    dots: { backgroundImage: isHorizontal ? `radial-gradient(circle, ${content.color} 1px, transparent 1px)` : `radial-gradient(circle, ${content.color} 1px, transparent 1px)`, backgroundSize: isHorizontal ? `${content.thickness * 4}px ${content.thickness}px` : `${content.thickness}px ${content.thickness * 4}px` },
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={{ width: "100%", height: "100%", ...styles[content.style] }} />
    </div>
  );
}
