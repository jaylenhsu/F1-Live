# F1 Race Replay - Frontend

React + TypeScript frontend with Chakra UI for F1 race replay visualization.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

## Implementation Status

✅ **Complete:**
- Project setup with Vite + React + TypeScript
- Chakra UI theme and configuration
- TypeScript types for all API responses
- API client with axios
- React Query hooks for data fetching
- Zustand store for playback state
- Home page with session selector
- Utility functions (time, colors)

🚧 **TODO - Implement these components:**

See full implementation guide in the plan file and backend/README.md

Key components needed:
- `components/race/TrackCanvas.tsx` - Konva canvas for track visualization
- `components/race/PlaybackControls.tsx` - Play/pause/speed controls
- `components/race/Leaderboard.tsx` - Driver positions list
- `components/qualifying/TelemetryCharts.tsx` - Recharts implementation

Refer to `/Users/jaylenhsu/.claude/plans/floating-questing-book.md` for detailed implementation steps.
