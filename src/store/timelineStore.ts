import { create } from "zustand";

interface TimelineState {
  playhead: number;       // current time in seconds
  isPlaying: boolean;
  playbackRate: number;   // 0.5x, 1x, 2x
  visibleRange: { start: number; end: number };
  selectedAnimationId: string | null;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVisibleRange: (range: { start: number; end: number }) => void;
  selectAnimation: (id: string | null) => void;
  updatePlayhead: (time: number) => void;
}

export const useTimelineStore = create<TimelineState>()((set) => ({
  playhead: 0,
  isPlaying: false,
  playbackRate: 1,
  visibleRange: { start: 0, end: 30 },
  selectedAnimationId: null,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  seek: (time) => set({ playhead: time }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setVisibleRange: (range) => set({ visibleRange: range }),
  selectAnimation: (id) => set({ selectedAnimationId: id }),
  updatePlayhead: (time) => set({ playhead: time }),
}));
