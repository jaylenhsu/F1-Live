/**
 * Hook for managing playback animation loop
 */
import { useEffect } from 'react';
import { usePlaybackStore } from '../stores/playbackStore';

const FPS = 25; // Frames per second to match backend data

export function usePlayback(totalFrames: number) {
  const { frameIndex, paused, speed, setFrameIndex } = usePlaybackStore();

  useEffect(() => {
    if (paused || totalFrames === 0) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => {
        const increment = speed * (FPS / 60); // Adjust for 60fps interval
        const next = prev + increment;

        if (next >= totalFrames - 1) {
          return totalFrames - 1;
        }

        return next;
      });
    }, 1000 / 60); // 60fps for smooth animation

    return () => clearInterval(interval);
  }, [paused, speed, totalFrames, setFrameIndex]);

  return {
    currentFrameIndex: Math.floor(frameIndex),
  };
}
