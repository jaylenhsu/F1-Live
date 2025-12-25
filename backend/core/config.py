"""Application configuration."""
import os
from pathlib import Path

# Base directory (project root)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Cache and data directories
FASTF1_CACHE_DIR = BASE_DIR / ".fastf1-cache"
COMPUTED_DATA_DIR = BASE_DIR / "computed_data"

# Create directories if they don't exist
FASTF1_CACHE_DIR.mkdir(exist_ok=True)
COMPUTED_DATA_DIR.mkdir(exist_ok=True)

# API Configuration
API_V1_PREFIX = "/api"
PROJECT_NAME = "F1 Race Replay API"
VERSION = "1.0.0"

# CORS settings
CORS_ORIGINS = [
    "http://localhost:5173",  # Vite default dev server
    "http://localhost:3000",  # Alternative React dev server
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
