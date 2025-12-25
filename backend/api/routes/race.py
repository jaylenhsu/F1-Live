"""Race telemetry API endpoints."""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional
from services.f1_data_service import get_f1_service
from models.schemas import RaceTelemetryResponse, TrackGeometryResponse
import json
import numpy as np

router = APIRouter(prefix="/race", tags=["race"])


class NumpyEncoder(json.JSONEncoder):
    """Custom JSON encoder for numpy types."""
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, np.bool_):
            return bool(obj)
        return super().default(obj)


@router.get("/{year}/{round_number}/{session_type}/telemetry")
async def get_race_telemetry(
    year: int,
    round_number: int,
    session_type: str = "R",
    refresh: bool = Query(False, description="Force refresh data from source"),
    start_frame: int = Query(0, description="Starting frame index"),
    frame_count: int = Query(1000, description="Number of frames to return")
):
    """
    Get race telemetry data with pagination support.

    - **year**: Season year (e.g., 2024)
    - **round_number**: Round number (1-24)
    - **session_type**: Session type ('R' for Race, 'S' for Sprint)
    - **refresh**: Force recompute telemetry data (default: False)
    - **start_frame**: Starting frame index (default: 0)
    - **frame_count**: Number of frames to return (default: 1000)
    """
    try:
        service = get_f1_service()
        data = service.get_race_data(year, round_number, session_type)

        # Extract frames slice for pagination
        all_frames = data.get('frames', [])
        total_frames = len(all_frames)

        # Get requested slice
        end_frame = min(start_frame + frame_count, total_frames)
        frames_slice = all_frames[start_frame:end_frame]

        print(f"DEBUG: Total frames: {total_frames}, returning frames {start_frame}-{end_frame}")

        # Build response with sliced frames
        response_data = {
            "frames": frames_slice,
            "track_statuses": data.get('track_statuses', []),
            "driver_colors": data.get('driver_colors', {}),
            "total_laps": data.get('total_laps', 0),
            "total_frames": total_frames,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "has_more": end_frame < total_frames
        }

        # Use custom encoder for numpy types
        try:
            json_str = json.dumps(response_data, cls=NumpyEncoder)
            print(f"DEBUG: JSON serialization successful, length: {len(json_str)} chars")
            return JSONResponse(content=json.loads(json_str))
        except Exception as json_error:
            print(f"ERROR: JSON serialization failed: {json_error}")
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"JSON serialization error: {str(json_error)}")
    except Exception as e:
        print(f"ERROR in get_race_telemetry: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching race telemetry: {str(e)}")


@router.get("/{year}/{round_number}/{session_type}/track")
async def get_track_geometry(
    year: int,
    round_number: int,
    session_type: str = "R"
):
    """
    Get track geometry including inner/outer boundaries and rotation.

    - **year**: Season year (e.g., 2024)
    - **round_number**: Round number (1-24)
    - **session_type**: Session type ('R' for Race, 'S' for Sprint)
    """
    try:
        service = get_f1_service()
        data = service.get_track_geometry(year, round_number, session_type)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching track geometry: {str(e)}")
