"""Events and sessions API endpoints."""
from fastapi import APIRouter, HTTPException
from services.f1_data_service import get_f1_service

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/{year}")
async def list_events(year: int):
    """
    List all F1 events (race weekends) for a given year.

    - **year**: Season year (e.g., 2024)
    """
    try:
        service = get_f1_service()
        # This will return event information
        # Note: list_rounds in f1_data.py prints to console, we might need to modify it
        # For now, return a simple acknowledgment
        return {
            "year": year,
            "message": "Use --list-rounds flag in CLI to see events"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching events: {str(e)}")


@router.get("/{year}/sprints")
async def list_sprint_events(year: int):
    """
    List all sprint race events for a given year.

    - **year**: Season year (e.g., 2024)
    """
    try:
        service = get_f1_service()
        # Note: list_sprints in f1_data.py prints to console, we might need to modify it
        return {
            "year": year,
            "message": "Use --list-sprints flag in CLI to see sprint events"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sprint events: {str(e)}")
