# F1 Live - Web Application

![F1 Live](images/F1-live.png)

## Architecture

- **Backend**: FastAPI (Python) - Wraps FastF1 data pipeline and processing
- **Frontend**: React + TypeScript + Chakra UI
- **Canvas**: React Konva for track visualization
- **Charts**: Recharts for telemetry graphs
- **State**: React Query (server state) + Zustand (client state)

## Quick Start

### 1. Start Backend API

```bash
cd backend
uvicorn main:app --reload --port 8000
```

API will be available at http://localhost:8000
API docs at http://localhost:8000/docs

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:5173

### 3. Use the Application

1. Visit http://localhost:5173
2. Select year, round, and session type
3. Click "Load Session"
4. Wait for data to load
5. Watch the race!

## Project Structure

```
f1-live/
├── backend/                     # FastAPI backend
│   ├── main.py                 # API entry point
│   ├── api/routes/             # API endpoints
│   ├── services/               # Business logic
│   ├── core/f1_integration/    # Existing F1 data code
│   └── requirements.txt
│
├── frontend/                    # React frontend
    ├── src/
    │   ├── components/         # React components
    │   ├── hooks/              # Custom React hooks
    │   ├── stores/             # Zustand stores
    │   ├── api/                # API client
    │   ├── types/              # TypeScript types
    │   ├── pages/              # Page components
    │   └── theme/              # Chakra UI theme
    └── package.json

```

## API Endpoints

All endpoints are prefixed with `/api`

## Next Steps

1. **Improve Initial Loading Times** - Building the initial cache can be further optimized
2. **Positions Jumbling at Start of New Lap** - Refine distance logic to maintain driver order when completing laps
