"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useCinemaEditorStore } from "@/store/cinemaEditorStore";
import { usePresentationStore } from "@/store/presentationStore";
import { useHistoryStore } from "@/store/historyStore";
import { savePresentation, loadPresentation as loadFromStorage, getLastPresentationId } from "@/lib/persistence";
import { createDefaultPresentation } from "@/core/scene/SceneFactory";
import { registerGSAPPlugins } from "@/lib/gsap-register";
import CinemaToolbar from "./CinemaToolbar";
import CinemaScenePanel from "./CinemaScenePanel";
import CinemaCanvas from "./CinemaCanvas";
import CinemaPropertiesPanel from "./CinemaPropertiesPanel";
import CinemaPresenter from "./CinemaPresenter";
import TemplateSelector from "./TemplateSelector";
import MediaLibraryPanel from "./MediaLibraryPanel";

registerGSAPPlugins();

export default function CinemaEditor() {
  const { isPresentMode, activeSceneId, setActiveScene, selectedElementIds, clearSelection, setTool } =
    useCinemaEditorStore();
  const { presentation } = usePresentationStore();
  const { pushSnapshot, undo, redo } = useHistoryStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "">("");
  const clipboardRef = useRef<string | null>(null); // JSON of copied element

  // --- Load presentation on mount ---
  useEffect(() => {
    const isNew = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("new") === "1";
    if (isNew) {
      usePresentationStore.getState().loadPresentation(createDefaultPresentation("horizontal"));
      window.history.replaceState({}, "", "/cinema-editor");
      return;
    }
    // Intenta cargar la última presentación guardada;
    // si no hay ninguna, usa la nueva presentación espectacular
    const lastId = getLastPresentationId();
    if (lastId) {
      const saved = loadFromStorage(lastId);
      if (saved) {
        usePresentationStore.getState().loadPresentation(saved);
        return;
      }
    }
    // Sin presentación guardada → carga la nueva espectacular por defecto
    usePresentationStore.getState().loadPresentation(createDefaultPresentation("horizontal"));
  }, []);

  // --- Set first scene as active ---
  useEffect(() => {
    if (!activeSceneId && presentation.scenes.length > 0) {
      setActiveScene(presentation.scenes[0].id);
    }
  }, [activeSceneId, presentation.scenes, setActiveScene]);

  // --- Auto-save every 5 seconds ---
  useEffect(() => {
    const interval = setInterval(() => {
      setSaveStatus("saving");
      savePresentation(presentation);
      setTimeout(() => setSaveStatus("saved"), 300);
      setTimeout(() => setSaveStatus(""), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, [presentation]);

  // --- Track changes for undo ---
  const prevPresentationRef = useRef(presentation.updatedAt);
  useEffect(() => {
    if (presentation.updatedAt !== prevPresentationRef.current) {
      pushSnapshot();
      prevPresentationRef.current = presentation.updatedAt;
    }
  }, [presentation.updatedAt, pushSnapshot]);

  // --- Copy/Paste ---
  const copySelected = useCallback(() => {
    if (selectedElementIds.length === 0 || !activeSceneId) return;
    const scene = presentation.scenes.find((s) => s.id === activeSceneId);
    const element = scene?.elements.find((e) => selectedElementIds.includes(e.id));
    if (element) {
      clipboardRef.current = JSON.stringify(element);
    }
  }, [selectedElementIds, activeSceneId, presentation]);

  const pasteElement = useCallback(() => {
    if (!clipboardRef.current || !activeSceneId) return;
    const element = JSON.parse(clipboardRef.current);
    const { createId } = require("@/lib/id");
    element.id = createId();
    element.transform.x += 30;
    element.transform.y += 30;
    element.name = `${element.name} (copia)`;

    // Regen animation IDs
    if (element.animations) {
      for (const a of element.animations) a.id = createId();
    }

    const scene = presentation.scenes.find((s) => s.id === activeSceneId);
    if (!scene) return;

    usePresentationStore.getState().updateScene(activeSceneId, {
      elements: [...scene.elements, element],
    } as any);
    useCinemaEditorStore.getState().setSelection([element.id]);
  }, [activeSceneId, presentation]);

  const duplicateSelected = useCallback(() => {
    copySelected();
    pasteElement();
  }, [copySelected, pasteElement]);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.contentEditable === "true") return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Undo/Redo
      if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if (ctrl && e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); return; }
      if (ctrl && e.key === "y") { e.preventDefault(); redo(); return; }

      // Copy/Paste/Duplicate
      if (ctrl && e.key === "c") { e.preventDefault(); copySelected(); return; }
      if (ctrl && e.key === "v") { e.preventDefault(); pasteElement(); return; }
      if (ctrl && e.key === "d") { e.preventDefault(); duplicateSelected(); return; }

      // Save
      if (ctrl && e.key === "s") { e.preventDefault(); savePresentation(presentation); setSaveStatus("saved"); setTimeout(() => setSaveStatus(""), 2000); return; }

      switch (e.key) {
        case "Delete":
        case "Backspace":
          if (selectedElementIds.length > 0 && activeSceneId) {
            const { deleteElement } = usePresentationStore.getState();
            for (const id of selectedElementIds) deleteElement(activeSceneId, id);
            clearSelection();
          }
          break;
        case "Escape":
          if (showTemplates) setShowTemplates(false);
          else if (showMedia) setShowMedia(false);
          else if (isPresentMode) useCinemaEditorStore.getState().setPresentMode(false);
          else clearSelection();
          break;
        case "v": case "V": setTool("select"); break;
        case "h": case "H": setTool("pan"); break;
        case "t": case "T":
          if (activeSceneId) usePresentationStore.getState().addTextElement(activeSceneId);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeSceneId, selectedElementIds, isPresentMode, showTemplates, showMedia, clearSelection, setTool, undo, redo, copySelected, pasteElement, duplicateSelected, presentation]);

  if (isPresentMode) return <CinemaPresenter />;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a1a] overflow-hidden" style={{ cursor: "default" }}>
      <CinemaToolbar onOpenTemplates={() => setShowTemplates(true)} onOpenMedia={() => setShowMedia(true)} />
      <div className="flex flex-1 overflow-hidden">
        <CinemaScenePanel />
        <CinemaCanvas />
        <CinemaPropertiesPanel />
      </div>

      {/* Save indicator */}
      {saveStatus && (
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/5 z-30">
          <span className="text-white/40 text-xs">
            {saveStatus === "saving" ? "Guardando..." : "Guardado ✓"}
          </span>
        </div>
      )}

      {/* Modals */}
      {showTemplates && <TemplateSelector onClose={() => setShowTemplates(false)} />}
      {showMedia && <MediaLibraryPanel onClose={() => setShowMedia(false)} />}
    </div>
  );
}
