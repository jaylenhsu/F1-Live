"""Qualifying session API endpoints."""
from fastapi import APIRouter, HTTPException
from services.f1_data_service import get_f1_service
from models.schemas import QualifyingResultsResponse, QualifyingTelemetryResponse

router = APIRouter(prefix="/qualifying", tags=["qualifying"])


@router.get("/{year}/{round_number}/{session_type}/results")
async def get_qualifying_results(
    year: int,
    round_number: int,
    session_type: str = "Q"
):
    """
    Get qualifying session results with lap times for Q1/Q2/Q3.

    - **year**: Season year (e.g., 2024)
    - **round_number**: Round number (1-24)
    - **session_type**: Session type ('Q' for Qualifying, 'SQ' for Sprint Qualifying)
    """
    try:
        service = get_f1_service()
        data = service.get_qualifying_results(year, round_number, session_type)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching qualifying results: {str(e)}")


@router.get("/{year}/{round_number}/{session_type}/telemetry/{driver_code}/{segment}")
async def get_driver_qualifying_telemetry(
    year: int,
    round_number: int,
    driver_code: str,
    segment: str,
    session_type: str = "Q"
):
    """
    Get telemetry for a specific driver's qualifying lap.

    - **year**: Season year (e.g., 2024)
    - **round_number**: Round number (1-24)
    - **driver_code**: Driver code (e.g., 'VER', 'HAM')
    - **segment**: Qualifying segment ('Q1', 'Q2', or 'Q3')
    - **session_type**: Session type ('Q' for Qualifying, 'SQ' for Sprint Qualifying)
    """
    try:
        service = get_f1_service()
        data = service.get_driver_qualifying_telemetry(
            year, round_number, driver_code, segment.upper(), session_type
        )

        if data is None:
            raise HTTPException(
                status_code=404,
                detail=f"Telemetry not found for driver {driver_code} in segment {segment}"
            )

        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching driver telemetry: {str(e)}")
