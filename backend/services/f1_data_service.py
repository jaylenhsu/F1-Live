"""Service layer wrapping existing F1 data processing logic."""
import sys
from pathlib import Path

# Add the f1_integration directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "core" / "f1_integration"))

from f1_data import (
    get_race_telemetry,
    get_quali_telemetry,
    enable_cache,
    get_circuit_rotation,
    load_session,
    list_rounds,
    list_sprints
)
from ui_components import build_track_from_example_lap
import numpy as np


class F1DataService:
    """Service for F1 data operations."""

    def __init__(self):
        """Initialize the service and enable FastF1 cache."""
        enable_cache()

    def get_session(self, year: int, round_number: int, session_type: str = 'R'):
        """
        Load F1 session data.

        Args:
            year: Season year
            round_number: Round number
            session_type: Session type ('R', 'Q', 'S', 'SQ')

        Returns:
            FastF1 session object
        """
        return load_session(year, round_number, session_type)

    def get_race_data(self, year: int, round_number: int, session_type: str = 'R'):
        """
        Get race telemetry data.

        Returns dict with:
            - frames: List of frame dictionaries
            - track_statuses: List of track status events
            - driver_colors: Dict mapping driver codes to RGB colors
            - total_laps: Total number of laps
        """
        session = self.get_session(year, round_number, session_type)
        race_telemetry = get_race_telemetry(session, session_type=session_type)

        return {
            "frames": race_telemetry['frames'],
            "track_statuses": race_telemetry['track_statuses'],
            "driver_colors": race_telemetry['driver_colors'],
            "total_laps": race_telemetry['total_laps']
        }

    def get_track_geometry(self, year: int, round_number: int, session_type: str = 'R'):
        """
        Get track geometry data.

        Returns dict with:
            - inner: List of [x, y] coordinates for inner boundary
            - outer: List of [x, y] coordinates for outer boundary
            - rotation: Circuit rotation in degrees
            - bounds: Dict with x_min, x_max, y_min, y_max
        """
        session = self.get_session(year, round_number, session_type)
        example_lap = session.laps.pick_fastest().get_telemetry()
        circuit_rotation = get_circuit_rotation(session)

        # Build track geometry using existing function
        (plot_x_ref, plot_y_ref, x_inner, y_inner, x_outer, y_outer,
         x_min, x_max, y_min, y_max) = build_track_from_example_lap(example_lap)

        # Convert numpy arrays to lists of [x, y] coordinates
        inner = [[float(x), float(y)] for x, y in zip(x_inner, y_inner)]
        outer = [[float(x), float(y)] for x, y in zip(x_outer, y_outer)]

        return {
            "inner": inner,
            "outer": outer,
            "rotation": float(circuit_rotation),
            "bounds": {
                "x_min": float(x_min),
                "x_max": float(x_max),
                "y_min": float(y_min),
                "y_max": float(y_max)
            }
        }

    def get_qualifying_results(self, year: int, round_number: int, session_type: str = 'Q'):
        """
        Get qualifying session results.

        Returns dict with results and telemetry data.
        """
        session = self.get_session(year, round_number, session_type)
        qualifying_data = get_quali_telemetry(session, session_type=session_type)

        return qualifying_data

    def get_driver_qualifying_telemetry(self, year: int, round_number: int,
                                       driver_code: str, segment: str,
                                       session_type: str = 'Q'):
        """
        Get telemetry for a specific driver's qualifying lap.

        Args:
            year: Season year
            round_number: Round number
            driver_code: Driver code (e.g., 'VER', 'HAM')
            segment: Qualifying segment ('Q1', 'Q2', 'Q3')
            session_type: Session type ('Q' or 'SQ')

        Returns:
            Dict with frames, drs_zones, and speed range
        """
        session = self.get_session(year, round_number, session_type)
        qualifying_data = get_quali_telemetry(session, session_type=session_type)

        # Extract telemetry for specific driver and segment
        telemetry_data = qualifying_data.get('telemetry', {})
        driver_data = telemetry_data.get(driver_code, {})
        segment_data = driver_data.get(segment, {})

        if not segment_data:
            return None

        return segment_data

    def list_events(self, year: int):
        """List all events for a given year."""
        return list_rounds(year)

    def list_sprint_events(self, year: int):
        """List sprint events for a given year."""
        return list_sprints(year)


# Singleton instance
_f1_service = None

def get_f1_service() -> F1DataService:
    """Get singleton F1 data service instance."""
    global _f1_service
    if _f1_service is None:
        _f1_service = F1DataService()
    return _f1_service
