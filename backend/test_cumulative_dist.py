"""Test script to verify cumulative distance is working."""
import sys
from pathlib import Path

# Add the f1_integration directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "core" / "f1_integration"))

from f1_data import load_session, enable_cache, _process_single_driver

enable_cache()

# Load the session
session = load_session(2025, 24, 'R')

# Test with one driver
drivers = session.drivers
first_driver = drivers[0]
driver_code = session.get_driver(first_driver)["Abbreviation"]

print(f"Testing driver: {driver_code}")

# Process the driver
result = _process_single_driver((first_driver, session, driver_code))

if result:
    data = result["data"]
    dist = data["dist"]
    lap = data["lap"]

    print(f"\nTotal data points: {len(dist)}")
    print(f"Distance range: {dist.min():.1f}m to {dist.max():.1f}m")
    print(f"Laps: {lap.min()} to {lap.max()}")

    # Check lap transitions
    print("\nChecking lap transitions:")
    for lap_num in range(1, int(lap.max()) + 1):
        lap_mask = lap == lap_num
        if lap_mask.any():
            lap_dist = dist[lap_mask]
            print(f"  Lap {lap_num}: {lap_dist.min():.1f}m to {lap_dist.max():.1f}m")

            if lap_num >= 2:
                # Check if lap 2 starts where lap 1 ended
                prev_lap_mask = lap == (lap_num - 1)
                prev_lap_dist = dist[prev_lap_mask]
                print(f"    -> Gap between laps: {lap_dist.min() - prev_lap_dist.max():.1f}m")
