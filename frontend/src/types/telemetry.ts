/**
 * TypeScript types for F1 telemetry data
 */

export interface DriverPosition {
  x: number;
  y: number;
  dist: number;
  rel_dist: number;
  lap: number;
  tyre: number;
  position: number;
  speed: number;
  gear: number;
  drs: number;
  throttle: number;
  brake: number;
}

export interface WeatherInfo {
  track_temp?: number;
  air_temp?: number;
  humidity?: number;
  wind_speed?: number;
  wind_direction?: number;
  rain_state?: string;
}

export interface RaceFrame {
  t: number;
  lap: number;
  drivers: Record<string, DriverPosition>;
  weather?: WeatherInfo;
}

export interface TrackStatus {
  status: string;
  start_time: number;
  end_time?: number;
}

export interface RaceTelemetryData {
  frames: RaceFrame[];
  track_statuses: TrackStatus[];
  driver_colors: Record<string, number[]>;
  total_laps: number;
  total_frames: number;
  start_frame: number;
  end_frame: number;
  has_more: boolean;
}

export interface TrackBounds {
  x_min: number;
  x_max: number;
  y_min: number;
  y_max: number;
}

export interface TrackGeometry {
  inner: number[][];
  outer: number[][];
  rotation: number;
  bounds: TrackBounds;
}

export interface QualifyingResult {
  pos: number;
  code: string;
  color: number[];
  Q1?: number;
  Q2?: number;
  Q3?: number;
  time: string;
}

export interface QualifyingResultsData {
  results: QualifyingResult[];
  telemetry?: Record<string, any>;
}

export interface DRSZone {
  zone_start: number;
  zone_end: number;
}

export interface TelemetryFrame {
  t: number;
  telemetry: {
    x: number;
    y: number;
    speed: number;
    gear: number;
    throttle: number;
    brake: number;
    drs: number;
    dist: number;
    rel_dist: number;
  };
}

export interface QualifyingTelemetryData {
  frames: TelemetryFrame[];
  drs_zones: DRSZone[];
  min_speed: number;
  max_speed: number;
}

export type SessionType = 'R' | 'Q' | 'S' | 'SQ';
export type QualifyingSegment = 'Q1' | 'Q2' | 'Q3';
