import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Presentation, SlideElement, Position, Size } from "@/types/presentation";
import { createDefaultPresentation, createDefaultSlide, createTextElement, createShapeElement, createImageElement } from "@/lib/defaults";
import { createId } from "@/lib/id";

interface EditorState {
  presentation: Presentation;
  activeSlideId: string;
  selectedElementIds: string[];
  tool: "select" | "text" | "shape" | "image" | "hand";
  viewport: { x: number; y: number; zoom: number };
  isPresentMode: boolean;

  // Slide actions
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  reorderSlides: (from: number, to: number) => void;
  setActiveSlide: (id: string) => void;
  updateSlideBackground: (id: string, bg: string) => void;

  // Element actions
  addTextElement: () => void;
  addShapeElement: (shape?: "rectangle" | "ellipse" | "triangle") => void;
  addImageElement: (src: string) => void;
  updateElement: (elementId: string, patch: Partial<SlideElement>) => void;
  deleteSelectedElements: () => void;
  moveElement: (elementId: string, position: Position) => void;
  resizeElement: (elementId: string, size: Size, position: Position) => void;
  rotateElement: (elementId: string, rotation: number) => void;

  // Selection
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;

  // Viewport
  setViewport: (v: Partial<{ x: number; y: number; zoom: number }>) => void;
  setTool: (tool: EditorState["tool"]) => void;
  setPresentMode: (on: boolean) => void;

  // History (simple)
  history: Presentation[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

const initialPresentation = createDefaultPresentation();

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    presentation: initialPresentation,
    activeSlideId: initialPresentation.slideOrder[0],
    selectedElementIds: [],
    tool: "select",
    viewport: { x: 0, y: 0, zoom: 0.5 },
    isPresentMode: false,
    history: [JSON.parse(JSON.stringify(initialPresentation))],
    historyIndex: 0,

    pushHistory: () => set((s) => {
      const snap = JSON.parse(JSON.stringify(s.presentation));
      s.history = s.history.slice(0, s.historyIndex + 1);
      s.history.push(snap);
      s.historyIndex = s.history.length - 1;
    }),

    undo: () => set((s) => {
      if (s.historyIndex > 0) {
        s.historyIndex--;
        s.presentation = JSON.parse(JSON.stringify(s.history[s.historyIndex]));
      }
    }),

    redo: () => set((s) => {
      if (s.historyIndex < s.history.length - 1) {
        s.historyIndex++;
        s.presentation = JSON.parse(JSON.stringify(s.history[s.historyIndex]));
      }
    }),

    // Slides
    addSlide: () => set((s) => {
      const slide = createDefaultSlide();
      s.presentation.slides[slide.id] = slide;
      const idx = s.presentation.slideOrder.indexOf(s.activeSlideId);
      s.presentation.slideOrder.splice(idx + 1, 0, slide.id);
      s.activeSlideId = slide.id;
      s.selectedElementIds = [];
    }),

    deleteSlide: (id) => set((s) => {
      if (s.presentation.slideOrder.length <= 1) return;
      const idx = s.presentation.slideOrder.indexOf(id);
      s.presentation.slideOrder.splice(idx, 1);
      delete s.presentation.slides[id];
      s.activeSlideId = s.presentation.slideOrder[Math.min(idx, s.presentation.slideOrder.length - 1)];
      s.selectedElementIds = [];
    }),

    duplicateSlide: (id) => set((s) => {
      const src = s.presentation.slides[id];
      if (!src) return;
      const newSlide = JSON.parse(JSON.stringify(src));
      newSlide.id = createId();
      // Remap element IDs
      const newElements: Record<string, SlideElement> = {};
      const newOrder: string[] = [];
      for (const eid of newSlide.elementOrder) {
        const newId = createId();
        const el = { ...newSlide.elements[eid], id: newId };
        newElements[newId] = el;
        newOrder.push(newId);
      }
      newSlide.elements = newElements;
      newSlide.elementOrder = newOrder;
      s.presentation.slides[newSlide.id] = newSlide;
      const idx = s.presentation.slideOrder.indexOf(id);
      s.presentation.slideOrder.splice(idx + 1, 0, newSlide.id);
      s.activeSlideId = newSlide.id;
    }),

    reorderSlides: (from, to) => set((s) => {
      const [moved] = s.presentation.slideOrder.splice(from, 1);
      s.presentation.slideOrder.splice(to, 0, moved);
    }),

    setActiveSlide: (id) => set((s) => { s.activeSlideId = id; s.selectedElementIds = []; }),

    updateSlideBackground: (id, bg) => set((s) => {
      if (s.presentation.slides[id]) s.presentation.slides[id].backgroundColor = bg;
    }),

    // Elements
    addTextElement: () => set((s) => {
      const el = createTextElement();
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide) return;
      el.zIndex = slide.elementOrder.length;
      slide.elements[el.id] = el;
      slide.elementOrder.push(el.id);
      s.selectedElementIds = [el.id];
      s.tool = "select";
    }),

    addShapeElement: (shape = "rectangle") => set((s) => {
      const el = createShapeElement(shape);
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide) return;
      el.zIndex = slide.elementOrder.length;
      slide.elements[el.id] = el;
      slide.elementOrder.push(el.id);
      s.selectedElementIds = [el.id];
      s.tool = "select";
    }),

    addImageElement: (src) => set((s) => {
      const el = createImageElement(src);
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide) return;
      el.zIndex = slide.elementOrder.length;
      slide.elements[el.id] = el;
      slide.elementOrder.push(el.id);
      s.selectedElementIds = [el.id];
      s.tool = "select";
    }),

    updateElement: (elementId, patch) => set((s) => {
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide?.elements[elementId]) return;
      Object.assign(slide.elements[elementId], patch);
    }),

    deleteSelectedElements: () => set((s) => {
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide) return;
      for (const eid of s.selectedElementIds) {
        delete slide.elements[eid];
        slide.elementOrder = slide.elementOrder.filter((id) => id !== eid);
      }
      s.selectedElementIds = [];
    }),

    moveElement: (elementId, position) => set((s) => {
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide?.elements[elementId]) return;
      slide.elements[elementId].transform.position = position;
    }),

    resizeElement: (elementId, size, position) => set((s) => {
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide?.elements[elementId]) return;
      slide.elements[elementId].transform.size = size;
      slide.elements[elementId].transform.position = position;
    }),

    rotateElement: (elementId, rotation) => set((s) => {
      const slide = s.presentation.slides[s.activeSlideId];
      if (!slide?.elements[elementId]) return;
      slide.elements[elementId].transform.rotation = rotation;
    }),

    // Selection
    setSelection: (ids) => set((s) => { s.selectedElementIds = ids; }),
    clearSelection: () => set((s) => { s.selectedElementIds = []; }),

    // Viewport
    setViewport: (v) => set((s) => { Object.assign(s.viewport, v); }),
    setTool: (tool) => set((s) => { s.tool = tool; }),
    setPresentMode: (on) => set((s) => { s.isPresentMode = on; }),
  }))
);
