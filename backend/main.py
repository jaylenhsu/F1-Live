"""
F1 Race Replay API

FastAPI backend serving F1 telemetry data for the React frontend.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import API_V1_PREFIX, PROJECT_NAME, VERSION, CORS_ORIGINS
from api.routes import race, qualifying, events

# Create FastAPI app
app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    description="API for F1 race replay telemetry data",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(race.router, prefix=API_V1_PREFIX)
app.include_router(qualifying.router, prefix=API_V1_PREFIX)
app.include_router(events.router, prefix=API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "F1 Race Replay API",
        "version": VERSION,
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
