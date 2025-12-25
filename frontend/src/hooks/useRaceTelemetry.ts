/**
 * React Query hook for fetching race telemetry data
 */
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { raceAPI } from '../api/client';
import type { SessionType, RaceTelemetryData, RaceFrame } from '../types/telemetry';

export function useRaceTelemetry(
  year: number,
  round: number,
  sessionType: SessionType = 'R',
  refresh: boolean = false
) {
  const [allFrames, setAllFrames] = useState<RaceFrame[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);

  // Initial query - fetch first 1000 frames and metadata
  const query = useQuery({
    queryKey: ['race', 'telemetry', year, round, sessionType, refresh],
    queryFn: async () => {
      console.log('Fetching initial telemetry from API...');
      const data = await raceAPI.getTelemetry(year, round, sessionType, refresh, 0, 1000);
      console.log('Initial data received:', {
        totalFrames: data.total_frames,
        receivedFrames: data.frames.length,
        hasMore: data.has_more
      });

      setAllFrames(data.frames);
      setTotalFrames(data.total_frames);

      // If there are more frames, start loading them in background
      if (data.has_more) {
        loadRemainingFrames(data.end_frame, data.total_frames);
      }

      return data;
    },
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });

  // Function to load remaining frames progressively
  const loadRemainingFrames = async (startFrom: number, total: number) => {
    setIsLoadingMore(true);
    const batchSize = 5000; // Load 5000 frames at a time

    try {
      for (let start = startFrom; start < total; start += batchSize) {
        console.log(`Loading frames ${start} to ${Math.min(start + batchSize, total)}...`);
        const batch = await raceAPI.getTelemetry(year, round, sessionType, false, start, batchSize);

        setAllFrames(prev => [...prev, ...batch.frames]);

        // Small delay to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log('All frames loaded!');
    } catch (error) {
      console.error('Error loading remaining frames:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    ...query,
    data: query.data ? {
      ...query.data,
      frames: allFrames,
    } : undefined,
    allFramesLoaded: allFrames.length === totalFrames && totalFrames > 0,
    loadingProgress: totalFrames > 0 ? (allFrames.length / totalFrames) * 100 : 0,
    isLoadingMore,
  };
}

export function useTrackGeometry(
  year: number,
  round: number,
  sessionType: SessionType = 'R'
) {
  return useQuery({
    queryKey: ['race', 'track', year, round, sessionType],
    queryFn: () => raceAPI.getTrackGeometry(year, round, sessionType),
    staleTime: Infinity,
    cacheTime: Infinity, // Track geometry never changes
  });
}
