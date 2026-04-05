import { create } from "zustand";
import type { TransitionType } from "@/core/types";

/**
 * Editor UI state — separate from presentation data.
 * Controls what the user sees and interacts with in the editor.
 */
interface CinemaEditorState {
  // Scene selection
  activeSceneId: string | null;
  selectedElementIds: string[];

  // Tools
  tool: "select" | "pan" | "text" | "shape" | "image" | "camera-path";

  // Viewport (editor canvas zoom/pan)
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };

  // View modes
  viewMode: "scene" | "world"; // scene = focused on one scene, world = see all scenes
  showCameraPath: boolean;
  showDepthLayers: boolean;
  showGrid: boolean;
  showParallaxPreview: boolean;

  // Panel state
  rightPanelTab: "transform" | "style" | "animation" | "camera" | "depth" | "transition";
  isTimelineOpen: boolean;
  isPresentMode: boolean;

  // Actions
  setActiveScene: (id: string | null) => void;
  setSelection: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;
  setTool: (tool: CinemaEditorState["tool"]) => void;
  setViewport: (v: Partial<CinemaEditorState["viewport"]>) => void;
  setViewMode: (mode: "scene" | "world") => void;
  toggleCameraPath: () => void;
  toggleDepthLayers: () => void;
  toggleGrid: () => void;
  toggleParallaxPreview: () => void;
  setRightPanelTab: (tab: CinemaEditorState["rightPanelTab"]) => void;
  toggleTimeline: () => void;
  setPresentMode: (on: boolean) => void;
}

export const useCinemaEditorStore = create<CinemaEditorState>()((set) => ({
  activeSceneId: null,
  selectedElementIds: [],
  tool: "select",
  viewport: { x: 0, y: 0, zoom: 0.55 },
  viewMode: "scene",
  showCameraPath: true,
  showDepthLayers: false,
  showGrid: true,
  showParallaxPreview: false,
  rightPanelTab: "transform",
  isTimelineOpen: true,
  isPresentMode: false,

  setActiveScene: (id) => set({ activeSceneId: id, selectedElementIds: [] }),
  setSelection: (ids) => set({ selectedElementIds: ids }),
  addToSelection: (id) => set((s) => ({
    selectedElementIds: s.selectedElementIds.includes(id)
      ? s.selectedElementIds
      : [...s.selectedElementIds, id],
  })),
  clearSelection: () => set({ selectedElementIds: [] }),
  setTool: (tool) => set({ tool }),
  setViewport: (v) => set((s) => ({ viewport: { ...s.viewport, ...v } })),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleCameraPath: () => set((s) => ({ showCameraPath: !s.showCameraPath })),
  toggleDepthLayers: () => set((s) => ({ showDepthLayers: !s.showDepthLayers })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleParallaxPreview: () => set((s) => ({ showParallaxPreview: !s.showParallaxPreview })),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  toggleTimeline: () => set((s) => ({ isTimelineOpen: !s.isTimelineOpen })),
  setPresentMode: (on) => set({ isPresentMode: on }),
}));
