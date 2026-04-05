"use client";

import { useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import SlideRenderer from "./SlideRenderer";
import { SLIDE_WIDTH, SLIDE_HEIGHT } from "@/lib/defaults";

export default function Canvas() {
  const { presentation, activeSlideId, viewport, setViewport, clearSelection, tool } = useEditorStore();
  const slide = presentation.slides[activeSlideId];
  const containerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ startX: number; startY: number; vpX: number; vpY: number } | null>(null);

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setViewport({ zoom: Math.max(0.1, Math.min(2, viewport.zoom + delta)) });
    } else {
      setViewport({ y: viewport.y - e.deltaY, x: viewport.x - e.deltaX });
    }
  }, [viewport, setViewport]);

  const onCanvasClick = useCallback((e: React.PointerEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvas) {
      clearSelection();
    }
  }, [clearSelection]);

  // Middle-click or space+drag for pan
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 1 || tool === "hand") {
      e.preventDefault();
      panRef.current = { startX: e.clientX, startY: e.clientY, vpX: viewport.x, vpY: viewport.y };
      const onMove = (ev: PointerEvent) => {
        if (!panRef.current) return;
        setViewport({
          x: panRef.current.vpX + (ev.clientX - panRef.current.startX),
          y: panRef.current.vpY + (ev.clientY - panRef.current.startY),
        });
      };
      const onUp = () => {
        panRef.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    }
  }, [tool, viewport, setViewport]);

  if (!slide) return null;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-[#1a1a2e] relative"
      onWheel={onWheel}
      onPointerDown={(e) => { onCanvasClick(e); onPointerDown(e); }}
      data-canvas="true"
    >
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }} />

      {/* Viewport transform wrapper */}
      <div
        className="absolute"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: "0 0",
        }}
        data-canvas="true"
      >
        {/* Slide shadow */}
        <div className="absolute -inset-1 bg-black/20 blur-lg rounded-lg pointer-events-none" style={{ width: SLIDE_WIDTH + 2, height: SLIDE_HEIGHT + 2 }} />

        {/* Slide */}
        <div className="relative rounded-sm overflow-hidden" style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}>
          <SlideRenderer slide={slide} zoom={viewport.zoom} />
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
        <button onClick={() => setViewport({ zoom: Math.max(0.1, viewport.zoom - 0.1) })}
          className="w-7 h-7 rounded bg-white/5 border border-white/10 text-white/40 text-sm flex items-center justify-center hover:bg-white/10 cursor-pointer">−</button>
        <span className="text-white/30 text-xs font-mono min-w-[3rem] text-center">{Math.round(viewport.zoom * 100)}%</span>
        <button onClick={() => setViewport({ zoom: Math.min(2, viewport.zoom + 0.1) })}
          className="w-7 h-7 rounded bg-white/5 border border-white/10 text-white/40 text-sm flex items-center justify-center hover:bg-white/10 cursor-pointer">+</button>
        <button onClick={() => setViewport({ zoom: 0.5, x: 100, y: 50 })}
          className="px-2 h-7 rounded bg-white/5 border border-white/10 text-white/30 text-[10px] hover:bg-white/10 cursor-pointer">Ajustar</button>
      </div>
    </div>
  );
}
