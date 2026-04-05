import { create } from "zustand";
import type { Presentation } from "@/core/types";
import { usePresentationStore } from "./presentationStore";

const MAX_HISTORY = 50;

interface HistoryState {
  past: string[];       // JSON snapshots
  future: string[];
  lastSaved: number;    // timestamp of last auto-save

  /** Take a snapshot of current state (call after every mutation) */
  pushSnapshot: () => void;

  /** Undo — restore previous state */
  undo: () => void;

  /** Redo — restore next state */
  redo: () => void;

  /** Check if undo/redo is available */
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useHistoryStore = create<HistoryState>()((set, get) => ({
  past: [],
  future: [],
  lastSaved: 0,

  pushSnapshot: () => {
    const presentation = usePresentationStore.getState().presentation;
    const snapshot = JSON.stringify(presentation);
    set((s) => ({
      past: [...s.past.slice(-(MAX_HISTORY - 1)), snapshot],
      future: [], // clear redo stack on new action
    }));
  },

  undo: () => {
    const { past } = get();
    if (past.length === 0) return;

    // Save current state to future
    const current = JSON.stringify(usePresentationStore.getState().presentation);
    const previous = past[past.length - 1];

    set((s) => ({
      past: s.past.slice(0, -1),
      future: [current, ...s.future],
    }));

    // Restore previous state
    usePresentationStore.getState().loadPresentation(JSON.parse(previous));
  },

  redo: () => {
    const { future } = get();
    if (future.length === 0) return;

    // Save current state to past
    const current = JSON.stringify(usePresentationStore.getState().presentation);
    const next = future[0];

    set((s) => ({
      past: [...s.past, current],
      future: s.future.slice(1),
    }));

    // Restore next state
    usePresentationStore.getState().loadPresentation(JSON.parse(next));
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
