/**
 * React Query hooks for qualifying data
 */
import { useQuery } from '@tanstack/react-query';
import { qualifyingAPI } from '../api/client';
import type { SessionType, QualifyingSegment } from '../types/telemetry';

export function useQualifyingResults(
  year: number,
  round: number,
  sessionType: SessionType = 'Q'
) {
  return useQuery({
    queryKey: ['qualifying', 'results', year, round, sessionType],
    queryFn: () => qualifyingAPI.getResults(year, round, sessionType),
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
  });
}

export function useDriverQualifyingTelemetry(
  year: number,
  round: number,
  driverCode: string | null,
  segment: QualifyingSegment | null,
  sessionType: SessionType = 'Q'
) {
  return useQuery({
    queryKey: ['qualifying', 'telemetry', year, round, driverCode, segment, sessionType],
    queryFn: () => {
      if (!driverCode || !segment) {
        throw new Error('Driver code and segment are required');
      }
      return qualifyingAPI.getDriverTelemetry(year, round, driverCode, segment, sessionType);
    },
    enabled: !!driverCode && !!segment,
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
  });
}
