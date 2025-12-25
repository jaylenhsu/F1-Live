"""Pydantic schemas for API request/response models."""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel


class DriverPosition(BaseModel):
    """Driver position data for a single frame."""
    x: float
    y: float
    dist: float
    rel_dist: float
    lap: int
    tyre: int
    position: int
    speed: float
    gear: int
    drs: int
    throttle: float
    brake: float


class WeatherInfo(BaseModel):
    """Weather information for a frame."""
    track_temp: Optional[float] = None
    air_temp: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    rain_state: Optional[str] = None


class RaceFrame(BaseModel):
    """Single frame of race telemetry."""
    t: float
    lap: int
    drivers: Dict[str, Dict[str, Any]]
    weather: Optional[WeatherInfo] = None


class TrackStatus(BaseModel):
    """Track status event."""
    status: str
    start_time: float
    end_time: Optional[float] = None


class RaceTelemetryResponse(BaseModel):
    """Response for race telemetry endpoint."""
    frames: List[Dict[str, Any]]
    track_statuses: List[Dict[str, Any]]
    driver_colors: Dict[str, List[int]]
    total_laps: int


class TrackBounds(BaseModel):
    """Track coordinate bounds."""
    x_min: float
    x_max: float
    y_min: float
    y_max: float


class TrackGeometryResponse(BaseModel):
    """Response for track geometry endpoint."""
    inner: List[List[float]]
    outer: List[List[float]]
    rotation: float
    bounds: TrackBounds


class QualifyingResult(BaseModel):
    """Qualifying result for a single driver."""
    pos: int
    code: str
    color: List[int]
    Q1: Optional[float] = None
    Q2: Optional[float] = None
    Q3: Optional[float] = None
    time: str


class QualifyingResultsResponse(BaseModel):
    """Response for qualifying results endpoint."""
    results: List[Dict[str, Any]]
    telemetry: Optional[Dict[str, Any]] = None


class DRSZone(BaseModel):
    """DRS zone information."""
    zone_start: float
    zone_end: float


class QualifyingTelemetryResponse(BaseModel):
    """Response for qualifying driver telemetry."""
    frames: List[Dict[str, Any]]
    drs_zones: List[Dict[str, Any]]
    min_speed: float
    max_speed: float


class Event(BaseModel):
    """F1 event (race weekend) information."""
    round_number: int
    event_name: str
    country: str
    location: str
    event_date: str


class EventsResponse(BaseModel):
    """Response for events listing."""
    year: int
    events: List[Event]
