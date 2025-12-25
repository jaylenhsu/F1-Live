/**
 * API client for F1 Race Replay backend
 */
import axios from 'axios';
import type {
  RaceTelemetryData,
  TrackGeometry,
  QualifyingResultsData,
  QualifyingTelemetryData,
  SessionType,
  QualifyingSegment
} from '../types/telemetry';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minute timeout for data-intensive requests (FastF1 can be slow)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Race API endpoints
 */
export const raceAPI = {
  /**
   * Get race telemetry data with pagination
   */
  getTelemetry: async (
    year: number,
    round: number,
    sessionType: SessionType = 'R',
    refresh: boolean = false,
    startFrame: number = 0,
    frameCount: number = 1000
  ): Promise<RaceTelemetryData> => {
    const response = await apiClient.get(
      `/api/race/${year}/${round}/${sessionType}/telemetry`,
      { params: { refresh, start_frame: startFrame, frame_count: frameCount } }
    );
    return response.data;
  },

  /**
   * Get track geometry
   */
  getTrackGeometry: async (
    year: number,
    round: number,
    sessionType: SessionType = 'R'
  ): Promise<TrackGeometry> => {
    const response = await apiClient.get(
      `/api/race/${year}/${round}/${sessionType}/track`
    );
    return response.data;
  },
};

/**
 * Qualifying API endpoints
 */
export const qualifyingAPI = {
  /**
   * Get qualifying results
   */
  getResults: async (
    year: number,
    round: number,
    sessionType: SessionType = 'Q'
  ): Promise<QualifyingResultsData> => {
    const response = await apiClient.get(
      `/api/qualifying/${year}/${round}/${sessionType}/results`
    );
    return response.data;
  },

  /**
   * Get driver qualifying telemetry
   */
  getDriverTelemetry: async (
    year: number,
    round: number,
    driverCode: string,
    segment: QualifyingSegment,
    sessionType: SessionType = 'Q'
  ): Promise<QualifyingTelemetryData> => {
    const response = await apiClient.get(
      `/api/qualifying/${year}/${round}/${sessionType}/telemetry/${driverCode}/${segment}`
    );
    return response.data;
  },
};

/**
 * Events API endpoints
 */
export const eventsAPI = {
  /**
   * List all events for a year
   */
  listEvents: async (year: number) => {
    const response = await apiClient.get(`/api/events/${year}`);
    return response.data;
  },

  /**
   * List sprint events for a year
   */
  listSprintEvents: async (year: number) => {
    const response = await apiClient.get(`/api/events/${year}/sprints`);
    return response.data;
  },
};

export default apiClient;
