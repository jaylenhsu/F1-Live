"""Debug script to inspect dist values in telemetry data."""
import pickle
import sys

# Load the cached data from the working original
try:
    with open("/Users/jaylenhsu/Desktop/Internships/Projects/f1-race-replay/computed_data/2025_Season_Round_24:_Abu_Dhabi_Grand_Prix_-_Race_race_telemetry.pkl", "rb") as f:
        data = pickle.load(f)
        frames = data['frames']

        print(f"Total frames: {len(frames)}")
        print("\nChecking first 5 frames:")
        for i in range(min(5, len(frames))):
            frame = frames[i]
            print(f"\nFrame {i}, t={frame['t']}, lap={frame['lap']}")
            drivers = frame['drivers']

            # Sort by position to see order
            sorted_drivers = sorted(drivers.items(), key=lambda x: x[1]['position'])

            print("  Positions:")
            for code, driver_data in sorted_drivers[:5]:  # Top 5
                print(f"    P{driver_data['position']}: {code:3s} - dist={driver_data['dist']:8.1f}m, lap={driver_data['lap']}")

        # Check a frame near the finish line of lap 1
        print("\n\nChecking frames around lap completion (looking for lap transition):")
        for i, frame in enumerate(frames):
            lap = frame['lap']
            if lap >= 2:  # Found first frame of lap 2
                # Show frames around lap transition
                for j in range(max(0, i-2), min(len(frames), i+3)):
                    f = frames[j]
                    print(f"\nFrame {j}, t={f['t']:.1f}s, leader_lap={f['lap']}")
                    drivers = f['drivers']
                    sorted_drivers = sorted(drivers.items(), key=lambda x: x[1]['position'])

                    for code, driver_data in sorted_drivers[:3]:  # Top 3
                        print(f"  P{driver_data['position']}: {code:3s} - dist={driver_data['dist']:8.1f}m, lap={driver_data['lap']}")
                break

except FileNotFoundError:
    print("Cached file not found. Run the original program first to generate it.")
    sys.exit(1)
