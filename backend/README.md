# F1 Race Replay - Backend API

FastAPI backend that wraps FastF1 data processing and serves telemetry data to the React frontend.

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the API Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Race Telemetry

- `GET /api/race/{year}/{round}/{session_type}/telemetry`
  - Get full race telemetry data (frames, track statuses, driver colors)
  - Example: `/api/race/2024/1/R/telemetry`

- `GET /api/race/{year}/{round}/{session_type}/track`
  - Get track geometry (inner/outer boundaries, rotation)
  - Example: `/api/race/2024/1/R/track`

### Qualifying

- `GET /api/qualifying/{year}/{round}/{session_type}/results`
  - Get qualifying results with Q1/Q2/Q3 lap times
  - Example: `/api/qualifying/2024/1/Q/results`

- `GET /api/qualifying/{year}/{round}/{session_type}/telemetry/{driver}/{segment}`
  - Get telemetry for specific driver's qualifying lap
  - Example: `/api/qualifying/2024/1/Q/telemetry/VER/Q3`

### Events

- `GET /api/events/{year}`
  - List all events for a year

- `GET /api/events/{year}/sprints`
  - List sprint events for a year

## Project Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── requirements.txt         # Python dependencies
├── core/
│   ├── config.py           # Configuration
│   └── f1_integration/     # Existing F1 data processing code
│       ├── f1_data.py
│       ├── ui_components.py
│       └── lib/
├── api/routes/
│   ├── race.py            # Race endpoints
│   ├── qualifying.py      # Qualifying endpoints
│   └── events.py          # Events endpoints
├── services/
│   └── f1_data_service.py # F1 data service layer
└── models/
    └── schemas.py         # Pydantic models
```

## Development

### Running with Auto-Reload

The server automatically reloads when code changes are detected:

```bash
python main.py
```

### Testing Endpoints

Use curl or Postman to test endpoints:

```bash
# Get race telemetry
curl http://localhost:8000/api/race/2024/1/R/telemetry

# Get track geometry
curl http://localhost:8000/api/race/2024/1/R/track

# Get qualifying results
curl http://localhost:8000/api/qualifying/2024/1/Q/results
```

## Notes

- FastF1 cache is stored in `../.fastf1-cache/`
- Computed telemetry data is cached in `../computed_data/`
- First request for a session may take 10-30 seconds while data is fetched from FastF1
- Subsequent requests use cached data and are instant
