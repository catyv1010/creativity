"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import Canvas from "./Canvas";
import SlidePanel from "./panels/SlidePanel";
import ToolBar from "./panels/ToolBar";
import PropertiesPanel from "./panels/PropertiesPanel";

export default function Editor() {
  const { deleteSelectedElements, undo, redo, pushHistory, setTool, selectedElementIds, isPresentMode, setPresentMode, presentation, activeSlideId } = useEditorStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementIds.length > 0) {
          deleteSelectedElements();
          pushHistory();
        }
      }
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) { e.preventDefault(); redo(); }
      if (e.key === "v" || e.key === "V") setTool("select");
      if (e.key === "h" || e.key === "H") setTool("hand");
      if (e.key === "t" || e.key === "T") useEditorStore.getState().addTextElement();
      if (e.key === "Escape") {
        if (isPresentMode) setPresentMode(false);
        else useEditorStore.getState().clearSelection();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteSelectedElements, undo, redo, pushHistory, setTool, selectedElementIds, isPresentMode, setPresentMode]);

  // Present mode
  if (isPresentMode) {
    return <PresentMode />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a1a] overflow-hidden" style={{ cursor: "default" }}>
      <ToolBar />
      <div className="flex flex-1 overflow-hidden">
        <SlidePanel />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}

function PresentMode() {
  const { presentation, activeSlideId, setPresentMode } = useEditorStore();
  const slide = presentation.slides[activeSlideId];
  const { slideOrder, slides } = presentation;
  const [currentIdx, setCurrentIdx] = require("react").useState(slideOrder.indexOf(activeSlideId));
  const currentSlide = slides[slideOrder[currentIdx]];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPresentMode(false);
      if (e.key === "ArrowRight" || e.key === " ") setCurrentIdx((i: number) => Math.min(i + 1, slideOrder.length - 1));
      if (e.key === "ArrowLeft") setCurrentIdx((i: number) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    // Try fullscreen
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      window.removeEventListener("keydown", handler);
      document.exitFullscreen?.().catch(() => {});
    };
  }, [setPresentMode, slideOrder.length]);

  if (!currentSlide) return null;

  const SlideRenderer = require("./SlideRenderer").default;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]" onClick={() => setCurrentIdx((i: number) => Math.min(i + 1, slideOrder.length - 1))}>
      <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${Math.min(window.innerWidth / 1920, window.innerHeight / 1080)})`, transformOrigin: "center center" }}>
          <SlideRenderer slide={currentSlide} zoom={1} interactive={false} />
        </div>
      </div>
      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 text-white/20 text-xs font-mono">
        {currentIdx + 1} / {slideOrder.length}
      </div>
      <button onClick={(e) => { e.stopPropagation(); setPresentMode(false); }} className="absolute top-4 right-4 text-white/20 hover:text-white/60 text-xs cursor-pointer">
        ESC para salir
      </button>
    </div>
  );
}
