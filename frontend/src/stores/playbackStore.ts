/**
 * Zustand store for playback state management
 */
import { create } from 'zustand';

interface PlaybackState {
  frameIndex: number;
  paused: boolean;
  speed: number;
  selectedDriver: string | null;

  // Actions
  setFrameIndex: (index: number) => void;
  togglePause: () => void;
  setPause: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  selectDriver: (code: string | null) => void;
  reset: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  frameIndex: 0,
  paused: true,
  speed: 1.0,
  selectedDriver: null,

  setFrameIndex: (index) => set({ frameIndex: index }),

  togglePause: () => set((state) => ({ paused: !state.paused })),

  setPause: (paused) => set({ paused }),

  setSpeed: (speed) => set({ speed }),

  selectDriver: (code) => set({ selectedDriver: code }),

  reset: () => set({
    frameIndex: 0,
    paused: true,
    speed: 1.0,
    selectedDriver: null,
  }),
}));
